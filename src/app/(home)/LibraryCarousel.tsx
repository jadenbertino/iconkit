import { ICON_PROVIDERS } from '@/constants/provider'

const LibraryCarousel = () => {
  const libraryNames = Object.values(ICON_PROVIDERS).map(
    (provider) => provider.name,
  )

  return (
    <div className='py-8 border-t border-b border-border'>
      <div className='overflow-x-auto'>
        <div className='flex gap-8 min-w-max px-4'>
          {libraryNames.map((name, index) => (
            <div
              key={index}
              className='text-lg font-medium text-muted-foreground whitespace-nowrap'
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { LibraryCarousel }
