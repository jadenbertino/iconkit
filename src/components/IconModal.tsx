import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import { centerClasses } from '@/constants/classes'
import { cn } from '@/lib'
import { useProviders } from '@/lib/queries/providers'
import type { Icon } from '@/lib/schemas/database'
import { useRef, useState } from 'react'
import ExternalLink from './ExternalLink'
import CheckmarkIcon from './icons/CheckmarkIcon'
import CodeIcon from './icons/CodeIcon'
import ReactIcon from './icons/ReactIcon'
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
  const provider = providers?.find((p) => p.id === icon?.provider_id)

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
          <div className='w-1/3 p-4 flex flex-col justify-center'>
            <SvgIcon icon={icon} />
          </div>
          <div className='w-2/3'>
            <div className='pl-1'>
              <h1 className='text-2xl font-bold'>{icon.name}</h1>
              <ExternalLink
                className='text-sm text-gray-500 p-2 -ml-2'
                href={icon.source_url}
              >
                by {provider?.name}
              </ExternalLink>
            </div>
            <div className='text-md flex flex-col gap-2 pt-2'>
              {/* Copy SVG */}
              <Button
                className={centerClasses}
                onClick={() => handleCopy(icon.svg, 'svg')}
              >
                <ListIconWrapper>
                  {copiedButton === 'svg' ? (
                    <CheckmarkIcon className='text-white' />
                  ) : (
                    <CodeIcon />
                  )}
                </ListIconWrapper>
                <span>
                  {copiedButton === 'svg' ? 'Copied SVG!' : 'Copy SVG'}
                </span>
              </Button>

              {/* Copy JSX */}
              <Button
                className={centerClasses}
                onClick={() => handleCopy(icon.jsx, 'jsx')}
              >
                <ListIconWrapper>
                  {copiedButton === 'jsx' ? (
                    <CheckmarkIcon className='text-white' />
                  ) : (
                    <ReactIcon />
                  )}
                </ListIconWrapper>
                <span>
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
