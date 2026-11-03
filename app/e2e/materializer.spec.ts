import { expect, test } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const FIXTURE = fileURLToPath(new URL('./fixtures/cube.glb', import.meta.url))

test.describe('materializer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/materializer')
    await expect(page.getByText('No file open')).toBeVisible()
  })

  test('loads a model and shows stats and scene graph', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles(FIXTURE)

    await expect(page.getByText('cube.glb', { exact: true })).toBeVisible()
    await expect(page.getByText('Unchanged')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Export GLB' })).toBeEnabled()

    const about = page.getByText('About this file').locator('..')
    await expect(about).toContainText('glTF binary')
    await expect(about).toContainText('Triangles12')
    await expect(about).toContainText('Meshes1')
    await expect(about).toContainText('Materials1')

    await expect(page.getByText('Cube', { exact: true })).toBeVisible()
    await expect(page.getByText('Nothing selected')).toBeVisible()
  })

  test('selecting a mesh shows editable material and marks file as edited', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles(FIXTURE)
    await page.getByText('Cube', { exact: true }).click()

    await expect(page.getByText('Cube selected')).toBeVisible()
    const nameInput = page.getByLabel('Material name')
    await expect(nameInput).toHaveValue('Red')
    await expect(page.getByText('#e07a5f')).toBeVisible()

    await nameInput.fill('Blue')
    await expect(page.getByText('Edited locally')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset changes' })).toBeEnabled()

    // Changing the type replaces the material; edits should persist on the new one.
    await page.getByLabel('Material type').selectOption('MeshBasicMaterial')
    await expect(page.getByLabel('Material type')).toHaveValue('MeshBasicMaterial')
    await expect(nameInput).toHaveValue('Blue')
  })

  test('reset reloads the original file', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles(FIXTURE)
    await page.getByText('Cube', { exact: true }).click()
    await page.getByLabel('Material name').fill('Changed')
    await page.getByRole('button', { name: 'Reset changes' }).click()

    await expect(page.getByText('Unchanged')).toBeVisible()
    await page.getByText('Cube', { exact: true }).click()
    await expect(page.getByLabel('Material name')).toHaveValue('Red')
  })

  test('exports an edited GLB', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles(FIXTURE)

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export GLB' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe('cube-edited.glb')
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(chunk as Buffer)
    const buffer = Buffer.concat(chunks)
    expect(buffer.subarray(0, 4).toString('ascii')).toBe('glTF')
    expect(buffer.length).toBeGreaterThan(100)
  })

  test('rejects unsupported files', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    })
    await expect(page.getByText(/Unsupported file/)).toBeVisible()
  })
})
