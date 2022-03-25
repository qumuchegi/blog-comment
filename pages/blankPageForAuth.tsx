import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function BlankPageForAuth() {
  useEffect(() => {
    const channel = new BroadcastChannel('github-auth-message')
    channel.postMessage(JSON.stringify({
      cookie: document.cookie
    }))
    window.close()
  }, [])
  return <div>
    <h2>登陆成功！</h2>
  </div>
}