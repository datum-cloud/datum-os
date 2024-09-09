'use client'

import React from 'react'

import PageTitle from '@/components/page-title'

import { pageStyles } from './page.styles'

const ListsPage = () => {
  const { wrapper } = pageStyles()

  return (
    <div className={wrapper()}>
      <div className="flex items-stretch justify-between">
        <PageTitle title="Lists" />
      </div>
    </div>
  )
}

export default ListsPage
