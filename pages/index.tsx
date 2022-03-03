import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import CommentSendInput from '../components/CommentSendInput.client'

const Home: NextPage = () => {
  return (<div>
    <CommentSendInput
      dbUrlToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJkYlVybCI6Im1vbmdvZGIrc3J2Oi8vY2hlZ2lfbW9uZ29kYjoxMTMzMjJjZ0BjbHVzdGVyMC4yc3B1MS5tb25nb2RiLm5ldC9teUZpcnN0RGF0YWJhc2U_cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5In1dLCJpYXQiOjE2NDYzMDUxOTIsImV4cCI6MTY0NjkyNzk5OSwiYXVkIjoiIiwiaXNzIjoiIiwic3ViIjoiIn0.nyOHhm_Q8JIx7j4jVHjqV7NiZhILvvoRDuPe1RzrvIo'
      articleId="123"
    />
  </div>)
}

export default Home
