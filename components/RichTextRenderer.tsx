import React, { useState, useMemo, useCallback } from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './styles/RichTextInput.module.css'

interface IProps {
  content: Content,
}
export default function RichTextRenderer({
  content
}: IProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editable: false,
    content,
  })
  return (
    <div className={styles.editorContainer}>
       <EditorContent editor={editor} />
    </div>
  )
}