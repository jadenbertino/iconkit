import { capitalize } from '@/lib/utils'
import { Package } from 'lucide-react'
import DynamicLink from './DynamicLink'
import { FooterLinks } from './FooterLinks'

type FooterLink = { name: string; href: string }

const FooterLinkSections: Record<string, FooterLink[]> = {
  product: [
    { name: 'Browse Icons', href: '/search' }, // Working - could create dedicated /libraries page
    { name: 'License Info', href: '#' }, // TODO: Create /licenses page using existing API
    {
      name: 'Changelog',
      href: 'https://github.com/jadenbertino/iconkit/blob/main/CHANGELOG.md',
    },
  ],
  info: [
    { name: 'Support', href: '#' }, // TODO: Create support/contact page or GitHub issues
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    // Consider adding: Icon Guidelines (/guidelines), Contributing (/contributing), System Status
    // { name: 'Icon Guidelines', href: '#' }, // TODO: Create design system documentation
  ],
  developer: [
    { name: 'Contact', href: '#' }, // TODO: Create /contact page
    { name: 'GitHub', href: 'https://github.com/jadenbertino/iconkit' },
    { name: 'Tech Stack', href: 'https://iconkit.jadenbertino.com/iconkit' },
  ],
}

const Footer = () => {
  return (
    <footer className='bg-inverse text-neutral-high'>
      <div className='container mx-auto px-4 py-12 border-t border-slate-800'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <Package className='h-6 w-6 text-neutral-high' />
              <span className='text-subheader font-bold'>IconKit</span>
            </div>
            <p className='text-neutral-low text-small leading-relaxed'>
              Your favorite icons, all in one place.
            </p>
          </div>

          {Object.entries(FooterLinkSections).map(([title, links]) => (
            <FooterLinks
              title={capitalize(title)}
              links={links}
              key={title}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-neutral-low text-small'>
            © {new Date().getFullYear()} IconKit. All rights reserved.
          </p>
          <div className='flex items-center gap-6 mt-4 md:mt-0'>
            <p className='text-neutral-low text-small'>
              Made with ❤ by{' '}
              <DynamicLink
                href='https://github.com/jadenbertino'
                className='text-neutral-low hover:text-neutral-high transition-colors underline'
              >
                Jaden Bertino
              </DynamicLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
