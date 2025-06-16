import { centerClasses, Icon } from '@/constants'
import { cn, htmlAttributesToReact } from '@/lib'
import parse, { domToReact } from 'html-react-parser'

const SvgThumnail = ({ icon }: { icon: Icon }) => {
  const SvgElement = parse(icon.svgContent, {
    replace: (domNode) => {
      if (
        domNode.type === 'tag' &&
        (domNode.name === 'svg' ||
          domNode.name === 'path' ||
          domNode.name === 'circle' ||
          domNode.name === 'rect')
      ) {
        return (
          <domNode.name
            {...htmlAttributesToReact(domNode.attribs)}
            fill={domNode.attribs['fill'] ?? 'currentColor'}
            stroke={domNode.attribs['stroke'] ?? 'currentColor'}
          >
            {domToReact(domNode.children as any)}
          </domNode.name>
        )
      }
      return null
    },
  })

  return (
    <div
      className={cn(
        'w-20 h-20 p-2 bg-white rounded-lg shadow-md text-black',
        centerClasses,
      )}
    >
      {SvgElement}
    </div>
  )
}

export { SvgThumnail }
