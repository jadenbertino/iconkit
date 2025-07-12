'use client'

import { IconsGrid } from '../components/IconsGrid'
import { Container, Row } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'

export default function Home() {
  return (
    <Container>
      <div className='w-full space-y-6'>
        <Row className='pt-8'>
          <SearchBar />
        </Row>
        <IconsGrid />
      </div>
    </Container>
  )
}
