import { cn } from '@/lib'

const ExternalLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className={cn(className)}
    >
      {children}
    </a>
  )
}

export default ExternalLink
