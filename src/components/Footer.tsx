import { capitalize } from '@/lib/utils'
import { Package } from 'lucide-react'
import ExternalLink from './ExternalLink'
import { FooterLinks } from './FooterLinks'

type FooterLink = { name: string; href: string }

const FooterLinkSections: Record<string, FooterLink[]> = {
  product: [
    { name: 'Browse Icons', href: '/search' }, // Working - could create dedicated /libraries page
    { name: 'License Info', href: '#' }, // TODO: Create /licenses page using existing API
    { name: 'Changelog', href: '#' }, // TODO: Create changelog page from git history
  ],
  info: [
    { name: 'Support', href: '#' }, // TODO: Create support/contact page or GitHub issues
    { name: 'Privacy', href: '#' }, // TODO: Create privacy policy for professional touch
    { name: 'Terms', href: '#' }, // TODO: Create terms of service
    // Consider adding: Icon Guidelines (/guidelines), Contributing (/contributing), System Status
    // { name: 'Icon Guidelines', href: '#' }, // TODO: Create design system documentation
  ],
  developer: [
    { name: 'Contact', href: '#' }, // TODO: Create /contact page
    { name: 'GitHub', href: 'https://github.com/jadenbertino/iconkit' }, // Working - real repo
    { name: 'Tech Stack', href: '#' }, // TODO: Create /docs page showcasing tech decisions
  ],
}

const Footer = () => {
  return (
    <footer className='bg-slate-900 text-white'>
      <div className='container mx-auto px-4 py-12 border-t border-slate-800'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <Package className='h-6 w-6 text-white' />
              <span className='text-xl font-bold'>IconKit</span>
            </div>
            <p className='text-slate-400 text-sm leading-relaxed'>
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
          <p className='text-slate-400 text-sm'>
            © {new Date().getFullYear()} IconKit. All rights reserved.
          </p>
          <div className='flex items-center gap-6 mt-4 md:mt-0'>
            <p className='text-slate-400 text-sm'>
              Made with ❤ by{' '}
              <ExternalLink
                href='https://github.com/jadenbertino'
                className='text-slate-400 hover:text-white transition-colors underline'
              >
                Jaden Bertino
              </ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
