'use client'

import IconModal from '@/components/IconModal'
import type { Icon } from '@/lib/schemas/database'
import { useState } from 'react'
import { IconsGrid } from '../components/IconsGrid'
import { Container, Row } from '../components/Layout'
import { Navbar } from '../components/Navbar'
import { SearchBar } from '../components/SearchBar'

export default function Home() {
  const [activeIcon, setActiveIcon] = useState<Icon | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Container>
      <Navbar />
      <div className='w-full space-y-6'>
        <Row className='pt-8'>
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
