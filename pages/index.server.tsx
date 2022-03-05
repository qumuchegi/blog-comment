import Head from 'next/head'
import Image from 'next/image'
import CommentSendInput from '../components/CommentSendInput.client'
import CommentList from '../components/CommentList.server'
import React from 'react'

  //@ts-ignore
const Home = (props) => {
  const searchObj = props.router.query
  // console.log({searchObj})
  //@ts-ignore
  const clusterId = searchObj['articleId'] || '4edd40c86762e0fb12000003'
  // console.log({clusterId});
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
        articleId={clusterId}
      /> 
    </div>
    <div style={{
      padding: '10px'
    }}>
      <CommentList
        clusterId={clusterId}
        offset={0}
      />
    </div>
  </div>)
}

export default Home
