import { CloseModalButton, Modal } from '@/components/Modal'
import SvgIcon from '@/components/SvgIcon'
import type { Icon } from '@/lib/schemas/database'
import ExternalLink from './ExternalLink'

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
                    }}
                  >
                    Copy SVG
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
  <div className='min-w-[25px]'>{children}</div>
)

const GithubIcon = () => (
  <svg
    role='img'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    className='size-4'
  >
    <title>GitHub</title>
    <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
  </svg>
)

const CodeIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    fill='currentColor'
    aria-hidden='true'
    data-slot='icon'
    className='size-5'
  >
    <path
      fill-rule='evenodd'
      d='M4.78 4.97a.75.75 0 0 1 0 1.06L2.81 8l1.97 1.97a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0ZM11.22 4.97a.75.75 0 0 0 0 1.06L13.19 8l-1.97 1.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0ZM8.856 2.008a.75.75 0 0 1 .636.848l-1.5 10.5a.75.75 0 0 1-1.484-.212l1.5-10.5a.75.75 0 0 1 .848-.636Z'
      clip-rule='evenodd'
    />
  </svg>
)

export default IconModal
