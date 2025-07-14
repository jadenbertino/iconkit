import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import { useProviders } from '@/lib/queries/providers'
import type { Icon } from '@/lib/schemas/database'
import { useRef, useState } from 'react'
import ExternalLink from './ExternalLink'
import CheckmarkIcon from './icons/CheckmarkIcon'
import CodeIcon from './icons/CodeIcon'
import GithubIcon from './icons/GithubIcon'
import ReactIcon from './icons/ReactIcon'

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
              <p className='text-sm text-gray-500 pt-1'>by {provider?.name}</p>
            </div>
            <ul className='text-md flex flex-col *:pt-2 pt-2'>
              {/* Copy SVG */}
              <li>
                <button className='flex items-center'>
                  <ListIconWrapper>
                    {copiedButton === 'svg' ? <CheckmarkIcon /> : <CodeIcon />}
                  </ListIconWrapper>
                  <span onClick={() => handleCopy(icon.svg, 'svg')}>
                    {copiedButton === 'svg' ? 'Copied SVG!' : 'Copy SVG'}
                  </span>
                </button>
              </li>

              {/* Copy JSX */}
              <li>
                <button className='flex items-center'>
                  <ListIconWrapper>
                    {copiedButton === 'jsx' ? <CheckmarkIcon /> : <ReactIcon />}
                  </ListIconWrapper>
                  <span onClick={() => handleCopy(icon.jsx, 'jsx')}>
                    {copiedButton === 'jsx' ? 'Copied JSX!' : 'Copy JSX'}
                  </span>
                </button>
              </li>

              {/* Source */}
              <li>
                <ExternalLink
                  className='flex items-center'
                  href={icon.source_url}
                >
                  <ListIconWrapper>
                    <GithubIcon />
                  </ListIconWrapper>
                  <span>View Source</span>
                </ExternalLink>
              </li>

              {/* License */}
            </ul>
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
