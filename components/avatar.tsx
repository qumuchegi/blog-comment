import React from 'react'

interface Props {
  avatarUrl: string
  defaultUrl?: string
}
export default function Avatar({
  avatarUrl,
  defaultUrl,
}: Props) {
  return <div>
    <img src={avatarUrl || defaultUrl} alt=''/>
  </div>
}
