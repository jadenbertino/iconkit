const ThreeCardSection = () => {
  const cards = [
    {
      title: '40,000+ Icons. 1 Search Bar',
      description:
        'Browse icons from Hero Icons, Lucide, Simple Icons, Font Awesome, Feather, Remix Icon, and 5 more popular libraries—all in one search.',
      icon: '🔍',
    },
    {
      title: '100% Open Source',
      description:
        'Every icon comes from trusted open-source libraries with permissive licenses. No subscriptions, no premium tiers, no gotchas.',
      icon: '📦',
    },
    {
      title: 'Easy Attribution',
      description:
        "See each icon's license and attribution requirements upfront. Stay compliant without the legal guesswork.",
      icon: '🛡️',
    },
  ]

  return (
    <div className='py-16'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {cards.map((card, index) => (
          <div
            key={index}
            className='border border-border rounded-lg p-8 text-center space-y-4'
          >
            <div className='text-4xl mb-4'>{card.icon}</div>
            <h3 className='text-xl font-bold text-foreground'>{card.title}</h3>
            <p className='text-muted-foreground leading-relaxed'>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ThreeCardSection }
