import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  avatarUrl: string
  defaultUrl?: string
}
export default function Avatar({
  avatarUrl,
  defaultUrl,
}: Props) {
  const [avatar, setAvatar] = useState(avatarUrl)
  const onImgLoadError = useCallback(() => {
    setAvatar(defaultUrl ?? '')
  }, [defaultUrl])
  return <div>
    <ImgWithStyle src={avatar} onError={onImgLoadError} alt=''/>
  </div>
}

const ImgWithStyle = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 20px;
`