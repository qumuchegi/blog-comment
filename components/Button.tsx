import React from 'react'
import styles from './styles/Button.module.css'

interface Props {
  onClick: () => void,
  text: string | React.ReactChild,
  width?: number,
  height?: number
}
export default function Button({
  onClick,
  text,
  width = 20,
  height = 20
}: Props) {
  return <div
    onClick={onClick}
    style={{width, height}}
    className={styles.container}
  >
    {text}
  </div>
}
