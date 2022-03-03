import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import postComment from '../lib/network/postComment'

interface Props {
  dbUrlToken: string
  articleId: string
  inputStyle?: React.StyleHTMLAttributes<'input'>
  onSuccess?: () => void,
  onFailed?: () => void

}
export default function CommentSendInput({
  dbUrlToken,
  articleId,
  inputStyle = {},
  onSuccess,
  onFailed
}: Props) {
  const [value, setValue] = useState('')
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const _onSend = useCallback(async () => {
    if (!articleId) return
    try {
      const res = await postComment({
        dbUrlToken,
        clusterId: articleId,
        content: value,
        // TODO: 暂时用匿名账号发送评论
        commenter: {
          id: '123456',
          userName: 'Anonymous',
          avatar: '',
          email: '',
          url: ''
        }
      })
      onSuccess?.()
    } catch (err) {
      onFailed?.()
    }
  }, [articleId, dbUrlToken, onFailed, onSuccess, value])
  return <div>
    <div>
      <CommentInput
        inputStyle={inputStyle}
        type='text'
        onChange={onInputChange}
      />
    </div>
    <div>
      <div onClick={_onSend}>发送</div>
    </div>
  </div>
}

interface InputProps {
  inputStyle: React.StyleHTMLAttributes<'input'>
}
const CommentInput = styled.input<InputProps>`
  ${
    props => Object.entries(props.inputStyle ?? {}).map(([k, v]) => `${k}: ${v};`)
  }

`