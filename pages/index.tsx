import CommentSendInput from '../components/CommentSendInput'
import CommentList from '../components/CommentList'
import React from 'react'
import { GetServerSideProps } from 'next'

  //@ts-ignore
const Home = ({
  articleId
}: {
  articleId: string
}) => {
  const clusterId = articleId || '4edd40c86762e0fb12000003'
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { articleId } = context.query || {}
  return {
    props: {
      articleId
    }
  }
}
