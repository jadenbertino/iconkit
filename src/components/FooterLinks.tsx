'use client'

import { toast } from 'sonner'

type FooterLink = { name: string; href: string }

type FooterLinks = {
  title: string
  links: FooterLink[]
}

export const FooterLinks = ({ title, links }: FooterLinks) => {
  const handleClick = (e: React.MouseEvent, link: FooterLink) => {
    if (link.href === '#') {
      e.preventDefault()
      toast.error(`${link.name} is coming soon!`)
    }
  }

  return (
    <div>
      <h3 className='font-semibold mb-4'>{title}</h3>
      <ul className='space-y-2 text-small text-neutral-low'>
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              onClick={(e) => handleClick(e, link)}
              className='hover:text-neutral-high transition-colors cursor-pointer'
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
