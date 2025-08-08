import DynamicLink from '@/components/DynamicLink'
import { ExpandableChevronIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL } from '@/constants'
import Link from 'next/link'
// const colors = ['f5f5f5', '9fb3ba', '2c2d3f']

export default function NotFound() {
  return (
    <main className='grid min-h-full place-items-center bg-surface px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center text-neutral-low'>
        <p className='text-subheader font-semibold'>404</p>
        <h1 className='mt-4 text-impact font-semibold tracking-tight text-balance text-neutral-high'>
          Page not found
        </h1>
        <p className='mt-6 text-subheader font-medium text-pretty text-neutral-low'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Button asChild>
            <Link
              href='/'
              className='rounded-md px-3.5 py-2.5 text-small font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
            >
              Go back home
            </Link>
          </Button>
          <Button
            asChild
            variant='ghost'
            className='group text-small font-semibold text-neutral-high'
          >
            <DynamicLink href={`mailto:${CONTACT_EMAIL}`}>
              Contact support
              <ExpandableChevronIcon />
            </DynamicLink>
          </Button>
        </div>
      </div>
    </main>
  )
}
