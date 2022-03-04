import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import CommentSendInput from '../components/CommentSendInput.client'
import CommentList from '../components/CommentList.server'
import React, { Suspense } from 'react'

const Home: NextPage = () => {
  return (<div style={{
    flex: '1'
  }}>
    <div style={{
      position: 'sticky',
      backgroundColor: '#fff',
      padding: '10px',
      top: '0'
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
        offset={1}
      />
    </div>
  </div>)
}

export default Home
