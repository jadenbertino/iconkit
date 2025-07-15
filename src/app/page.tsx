'use client'

import IconModal from '@/components/IconModal'
import { IconsGrid } from '@/components/IconsGrid'
import { Container, Row } from '@/components/Layout'
import { Navbar } from '@/components/Navbar'
import { SearchBar } from '@/components/SearchBar'
import type { Icon } from '@/lib/schemas/database'
import { useState } from 'react'

export default function SearchPage() {
  const [activeIcon, setActiveIcon] = useState<Icon | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Container>
      <Navbar />
      <div className='w-full space-y-6'>
        <Row className='pt-4'>
          <SearchBar />
        </Row>
        <IconsGrid
          onIconClick={(icon) => {
            setActiveIcon(icon)
            setIsModalOpen(true)
          }}
        />
      </div>
      <IconModal
        icon={activeIcon}
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  )
}
