import React, { useRef, useState, useMemo, useCallback } from 'react'
import { useEditor, EditorContent, Content, EditorOptions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './styles/RichTextInput.module.css'

interface IProps {
  placeholder?: string
  isUseMarkdown?: boolean
  onChange?: (value: string) => void
  inputStyle?: string
}
export default function RichTextInput(props: IProps) {
  const {
    placeholder = '',
    isUseMarkdown = false,
    onChange,
    inputStyle = ''
  } = props
  const [content, setContent] = useState<string>('')
  const onEditorUpdate: EditorOptions['onTransaction'] = useCallback(({ editor, transaction }) => {
    let contentStr = editor.getText()
    // console.log({contentStr});
    setContent(contentStr)
    onChange?.(contentStr)
  }, [onChange])
  const onFocus: EditorOptions['onFocus'] = useCallback(({ editor, event  }) => {
    // console.log({event})
  }, [])
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editable: true,
    onTransaction: onEditorUpdate,
    content: placeholder,
    injectCSS: true,
    onFocus,
    editorProps: {
      attributes: {
        style: inputStyle
      }
    }
  })
  return (
    <div style={{width: '100%', height: '100%'}}>
      <div>

      </div>
      <EditorContent editor={editor}/>
    </div>
  )
}