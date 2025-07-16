import ExternalLink from '@/components/ExternalLink'
import { ExpandableChevronIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL } from '@/constants'
import Link from 'next/link'
// const colors = ['f5f5f5', '9fb3ba', '2c2d3f']

export default function NotFound() {
  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center text-gray-500'>
        <p className='text-lg font-semibold'>404</p>
        <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl'>
          Page not found
        </h1>
        <p className='mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Button asChild>
            <Link
              href='/'
              className='rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
            >
              Go back home
            </Link>
          </Button>
          <Button
            asChild
            variant='ghost'
            className='group text-sm font-semibold text-gray-900'
          >
            <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>
              Contact support
              <ExpandableChevronIcon />
            </ExternalLink>
          </Button>
        </div>
      </div>
    </main>
  )
}
