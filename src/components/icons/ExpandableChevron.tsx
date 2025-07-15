const ExpandableChevronIcon = () => {
  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer min-w-8 overflow-hidden`}
    >
      {/* Horizontal line that extends on hover */}
      <div className='h-0.5 bg-gray-800 origin-left -mr-2.5 w-0 group-hover:w-4 transition-all duration-200 ease-out' />

      {/* Chevron */}
      <svg
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='relative z-10'
      >
        <path
          d='M4.5 2.5L8 6L4.5 9.5'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    </div>
  )
}

export { ExpandableChevronIcon }
