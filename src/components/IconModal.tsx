import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import type { Icon } from '@/lib/schemas/database'
import { toast } from 'sonner'
import ExternalLink from './ExternalLink'
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
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <CloseModalButton handleClose={handleClose} />
      {!icon ? null : (
        <div className='flex'>
          <div className='w-1/3 p-4'>
            <SvgIcon icon={icon} />
          </div>
          <div className='w-2/3'>
            <h1 className='text-2xl font-bold'>{icon.name}</h1>
            <ul className='text-md flex flex-col *:pt-2'>
              {/* Copy SVG */}
              <li>
                <button className='flex items-center'>
                  <ListIconWrapper>
                    <CodeIcon />
                  </ListIconWrapper>
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(icon.svg)
                      toast.success('Copied SVG to clipboard')
                    }}
                  >
                    Copy SVG
                  </span>
                </button>
              </li>

              {/* Copy JSX */}
              <li>
                <button className='flex items-center'>
                  <ListIconWrapper>
                    <ReactIcon />
                  </ListIconWrapper>
                  <span>TODO: Copy JSX</span>
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
