import React from 'react'
import styles from './styles/Avatar.module.css'

interface Props {
  avatarUrl: string
  defaultUrl?: string
  badgeImgUrl?: string
  onClick?: () => void
}
export default function Avatar({
  avatarUrl,
  defaultUrl,
  badgeImgUrl,
  onClick
}: Props) {
  return <div className={styles.container} onClick={onClick}>
    <img
      src={avatarUrl || defaultUrl}
      alt='magin avatar'
      className={styles.mainAvatar}
    />
    {
      badgeImgUrl && 
      <img
        src={badgeImgUrl}
        alt='badge'
        className={styles.badgeImg}
      />
    }
  </div>
}
