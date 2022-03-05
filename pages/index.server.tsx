import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CommentSendInput from '../components/CommentSendInput.client'
import CommentList from '../components/CommentList.server'
import React from 'react'

const Home: NextPage = () => {
  return (<div style={{
    flex: 1
  }}>
    <div style={{
      position: 'sticky',
      zIndex: 10,
      backgroundColor: '#fff',
      padding: '10px 10px 0 10px',
      top: '0',
      flexGrow: 1
    }}>
      <CommentSendInput
        articleId="4edd40c86762e0fb12000003"
      /> 
    </div>
    <div style={{
      padding: '10px'
    }}>
      <CommentList
        clusterId="4edd40c86762e0fb12000003"
        offset={0}
      />
    </div>
  </div>)
}

export default Home
