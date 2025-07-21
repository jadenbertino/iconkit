import { Clipboard, Package, Shield } from 'lucide-react'

const ThreeCardSection = () => {
  const cards = [
    {
      title: '100% Open Source',
      description:
        'Every icon comes from trusted open-source libraries with permissive licenses.',
      // No subscriptions, no premium tiers, no gotchas.
      icon: Package,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Easy Attribution',
      description:
        "See each icon's license and attribution requirements upfront.",
      // Stay compliant without the legal guesswork.
      icon: Shield,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'SVG & JSX Ready',
      description:
        'Click any icon to copy as SVG markup or ready-to-use JSX components.',
      icon: Clipboard,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  return (
    <section className='container mx-auto px-4 py-16'>
      <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
        {cards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <div
              key={index}
              className='text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow'
            >
              <div
                className={`w-16 h-16 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <IconComponent className={`h-8 w-8 ${card.iconColor}`} />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-4'>
                {card.title}
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                {card.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { ThreeCardSection }
