import { expect, test } from '@playwright/test'

test.describe('site navigation', () => {
  test('home renders hero and links to tools', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('tkalve.dev')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Useful things.')
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()

    await page.getByRole('link', { name: 'Explore the tools' }).click()
    await expect(page).toHaveURL('/tools')
    await expect(page).toHaveTitle('Tools · tkalve.dev')
    await expect(page.getByRole('heading', { level: 1, name: 'Tools' })).toBeVisible()
  })

  test('tool card opens the tool and header switches to tool mode', async ({ page }) => {
    await page.goto('/tools')
    await page.getByRole('link', { name: /Open Materializer/ }).click()

    await expect(page).toHaveURL('/tools/materializer')
    await expect(page).toHaveTitle('Materializer · tkalve.dev')

    const header = page.getByRole('banner')
    await expect(header.getByRole('heading', { level: 1, name: 'Materializer' })).toBeVisible()
    await expect(header.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Tools')
    await expect(header.getByRole('button', { name: 'Open file' })).toBeVisible()
    await expect(header.getByRole('button', { name: 'Export GLB' })).toBeDisabled()
    await expect(header.getByRole('navigation', { name: 'Main' })).toHaveCount(0)
  })

  test('active nav link reflects the current route', async ({ page }) => {
    await page.goto('/about')
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link', { name: 'About' })).toHaveClass(/active/)
    await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveClass(/active/)
  })

  test('unknown routes show the 404 page', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing on this bench.')
    await page.getByRole('link', { name: 'Back home' }).click()
    await expect(page).toHaveURL('/')
  })
})
