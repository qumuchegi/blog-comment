import React, { useState, useMemo, useCallback } from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

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
    <EditorContent editor={editor} />
  )
}