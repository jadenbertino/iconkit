import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import { useLicenses } from '@/lib/queries/licenses'
import { useProviders } from '@/lib/queries/providers'
import type { Icon } from '@/lib/schemas/database'
import { useEffect, useRef, useState } from 'react'
import ExternalLink from './ExternalLink'
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

  useEffect(() => {
    if (licenses) {
      console.log(licenses)
    }
  }, [licenses])

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
        <div className='flex'>
          <div className='w-2/3 xs:w-2/5 p-4 flex flex-col justify-center'>
            <SvgIcon icon={icon} />
          </div>
          <div className='flex-grow flex flex-col text-center pt-4'>
            {/* Details */}
            <h1 className='text-heading'>{icon.name}</h1>
            <div className='text-small flex p-2 -ml-2 *:p-1 flex-wrap justify-center pt-1'>
              {!provider ? null : (
                <ExternalLink
                  href={icon.source_url}
                  className='px-3 text-neutral-low hover:underline underline-offset-4'
                >
                  {provider.name}
                </ExternalLink>
              )}
              {!license ? null : (
                <ExternalLink
                  href={license.url}
                  className='px-3 text-neutral-low hover:underline underline-offset-4'
                >
                  ({license.type} License)
                </ExternalLink>
              )}
            </div>

            {/* Copy Buttons */}
            <div className='text-body flex flex-col gap-2 pt-2'>
              {/* Copy SVG */}
              <Button
                className={cn(centerClasses, 'gap-0')}
                onClick={() => handleCopy(icon.svg, 'svg')}
              >
                <ListIconWrapper>
                  {copiedButton === 'svg' ? (
                    <CheckmarkIcon className='text-white' />
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
                    <CheckmarkIcon className='text-white' />
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
