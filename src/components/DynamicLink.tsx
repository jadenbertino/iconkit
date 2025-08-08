import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type DynamicLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  className?: string
  children: React.ReactNode
}

/**
 * Renders a link that opens in a new tab if it's an external link, otherwise it's a Next.js link.
 */
const DynamicLink: React.FC<DynamicLinkProps> = ({
  children,
  className,
  href,
  ...additionalProps
}) => {
  const sharedProps = {
    className: cn(className),
    href,
    ...additionalProps,
  }

  const isExternalLink = /^https?:\/\//i.test(href)
  if (isExternalLink) {
    return (
      <a
        target='_blank'
        rel='noreferrer'
        {...sharedProps}
      >
        {children}
      </a>
    )
  }

  if (href.startsWith('/')) {
    return <Link {...sharedProps}>{children}</Link>
  }

  return <a {...sharedProps}>{children}</a>
}

export default DynamicLink
