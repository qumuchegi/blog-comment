import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import CommentSendInput from '../components/CommentSendInput.client'
import CommentList from '../components/CommentList.server'
import React, { Suspense } from 'react'

const Home: NextPage = () => {
  return (<div>
    <CommentSendInput
      dbUrlToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYlVybCI6Im1vbmdvZGIrc3J2Oi8vY2hlZ2lfbW9uZ29kYjoxMTMzMjJjZ0BjbHVzdGVyMC4yc3B1MS5tb25nb2RiLm5ldC9teUZpcnN0RGF0YWJhc2U_cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5IiwiaWF0IjoxNjQ2MzA4Nzc4fQ.wVmQYf6b01g9Qvip6AlxN7NAu4U2Xu5Wrq3ANlMeLH0'
      articleId="4edd40c86762e0fb12000003"
    />
    <CommentList
      dbUrlToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYlVybCI6Im1vbmdvZGIrc3J2Oi8vY2hlZ2lfbW9uZ29kYjoxMTMzMjJjZ0BjbHVzdGVyMC4yc3B1MS5tb25nb2RiLm5ldC9teUZpcnN0RGF0YWJhc2U_cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5IiwiaWF0IjoxNjQ2MzA4Nzc4fQ.wVmQYf6b01g9Qvip6AlxN7NAu4U2Xu5Wrq3ANlMeLH0'
      clusterId="4edd40c86762e0fb12000003"
      offset={1}
    />
  </div>)
}

export default Home
