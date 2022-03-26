import React, { useEffect} from 'react'
import { BroadcastChannel } from 'broadcast-channel'

export default function BlankPageForAuth() {
  useEffect(() => {
    const channel = new BroadcastChannel('github-auth-message')
    channel.postMessage(JSON.stringify({
      cookie: document.cookie
    }))
    window.close()
  }, [])
  return <div>
    <h2 style={{textAlign: 'center'}}>登陆成功, 正在跳转...</h2>
  </div>
}