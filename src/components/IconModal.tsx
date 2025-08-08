import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import { useLicenses } from '@/lib/queries/licenses'
import { useProviders } from '@/lib/queries/providers'
import type { Icon } from '@/lib/schemas/database'
import { useRef, useState } from 'react'
import DynamicLink from './DynamicLink'
import { CheckmarkIcon, CodeIcon, ReactIcon } from './icons'
import { Button } from './ui/button'

const IconModal = ({
  icon,
  isOpen,
  handleClose,
}: {
  icon: Icon | null
  isOpen: boolean
  handleClose: () => void
}) => {
  const [copiedButton, setCopiedButton] = useState<'svg' | 'jsx' | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { data: providers } = useProviders()
  const { data: licenses } = useLicenses()
  const provider = providers?.find((p) => p.id === icon?.provider_id)
  const license = licenses?.find((l) => l.provider_id === icon?.provider_id)

  const handleCopy = (text: string, buttonType: 'svg' | 'jsx') => {
    navigator.clipboard.writeText(text)
    setCopiedButton(buttonType)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setCopiedButton(null)
      timeoutRef.current = null
    }, 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <CloseModalButton handleClose={handleClose} />
      {!icon ? null : (
        <div className='flex flex-col sm:flex-row pt-4'>
          <div className='w-full sm:w-2/5 max-w-[240px] sm:max-w-none p-4 flex flex-col sm:justify-center'>
            <SvgIcon icon={icon} />
          </div>
          <div className='flex-grow flex flex-col text-center'>
            {/* Details */}
            <h1 className='text-header font-semibold'>{icon.name}</h1>
            <div className='text-small flex p-2 -ml-2 *:p-1 flex-wrap justify-center pt-1'>
              {!provider ? null : (
                <DynamicLink
                  href={icon.source_url}
                  className='px-3 text-neutral-low hover:underline underline-offset-4'
                >
                  {provider.name}
                </DynamicLink>
              )}
              {!license ? null : (
                <DynamicLink
                  href={license.url}
                  className='px-3 text-neutral-low hover:underline underline-offset-4'
                >
                  ({license.type} License)
                </DynamicLink>
              )}
            </div>

            {/* Copy Buttons */}
            <div className='text-small flex flex-col gap-2 pt-2'>
              {/* Copy SVG */}
              <Button
                className={cn(centerClasses, 'gap-0')}
                onClick={() => handleCopy(icon.svg, 'svg')}
              >
                <ListIconWrapper>
                  {copiedButton === 'svg' ? (
                    <CheckmarkIcon className='text-neutral-high' />
                  ) : (
                    <CodeIcon />
                  )}
                </ListIconWrapper>
                <span className='min-w-[80px]'>
                  {copiedButton === 'svg' ? 'Copied SVG!' : 'Copy SVG'}
                </span>
              </Button>

              {/* Copy JSX */}
              <Button
                className={cn(centerClasses, 'gap-0')}
                onClick={() => handleCopy(icon.jsx, 'jsx')}
              >
                <ListIconWrapper>
                  {copiedButton === 'jsx' ? (
                    <CheckmarkIcon className='text-neutral-high' />
                  ) : (
                    <ReactIcon />
                  )}
                </ListIconWrapper>
                <span className='min-w-[80px]'>
                  {copiedButton === 'jsx' ? 'Copied JSX!' : 'Copy JSX'}
                </span>
              </Button>

              {/* License */}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

const ListIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='min-w-[32px] flex items-center justify-center'>
    {children}
  </div>
)

export default IconModal
