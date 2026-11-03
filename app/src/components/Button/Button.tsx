import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  className?: string
}

type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

function classes({ variant = 'primary', size = 'md', className }: BaseProps) {
  return [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
}

export function Button({ variant, size, icon, iconRight, children, className, ...rest }: ButtonProps) {
  return (
    <button type="button" className={classes({ variant, size, className })} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  )
}

type LinkButtonProps = BaseProps & Omit<LinkProps, 'className' | 'children'>

export function LinkButton({ variant, size, icon, iconRight, children, className, ...rest }: LinkButtonProps) {
  return (
    <Link className={classes({ variant, size, className })} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </Link>
  )
}
