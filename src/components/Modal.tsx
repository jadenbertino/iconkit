'use client'

import { cn } from '@/lib'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import type { ReactNode } from 'react'

function Modal({
  isOpen,
  handleClose,
  children,
  blurBackground = false,
}: {
  isOpen: boolean
  handleClose: () => void
  children?: ReactNode
  blurBackground?: boolean
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className='relative z-10'
    >
      <DialogBackdrop
        transition
        className={cn(
          'fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in',
          blurBackground && 'backdrop-blur-sm',
        )}
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95'
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

const CloseModalButton = ({
  handleClose,
  children,
}: {
  handleClose: () => void
  children?: ReactNode
}) => {
  return (
    <button
      type='button'
      onClick={handleClose}
      className='absolute top-2 right-2 p-2'
    >
      {children || <CloseIcon />}
    </button>
  )
}

const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    className='size-5'
  >
    <title>close</title>
    <g
      id='Layer_2'
      data-name='Layer 2'
    >
      <g id='close'>
        <g
          id='close-2'
          data-name='close'
        >
          <rect
            fill='#fff'
            opacity='0'
            width='24'
            height='24'
            transform='translate(24 24) rotate(180)'
          />
          <path
            fill='#231f20'
            d='M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z'
          />
        </g>
      </g>
    </g>
  </svg>
)

export { CloseModalButton, Modal }
