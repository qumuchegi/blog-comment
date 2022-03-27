import React, { useRef, useState, useMemo, useCallback, useImperativeHandle, useEffect } from 'react'
import { useEditor, EditorContent, Content, EditorOptions, Editor, ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import styles from './styles/RichTextInput.module.css'
import Image from 'next/image'
import lowlight from 'lowlight'
import Underline from '@tiptap/extension-underline'
// import Link from '@tiptap/extension-link'
import { Select, MenuItem } from '@mui/material';

interface IProps {
  value?: string
  placeholder?: string
  isUseMarkdown?: boolean
  onChange?: (value: string) => void
  inputStyle?: string
}
export default function RichTextInput(props: IProps) {
  const {
    value = '',
    placeholder = '',
    isUseMarkdown = false,
    onChange,
    inputStyle = ''
  } = props
  const onEditorUpdate: EditorOptions['onTransaction'] = useCallback(({ editor, transaction }) => {
    let contentStr = editor.getHTML()
    // console.log({contentStr});
    onChange?.(contentStr)
  }, [onChange])
  const onFocus: EditorOptions['onFocus'] = useCallback(({ editor, event  }) => {
    // console.log({event})
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Underline,
      // Link,
      // CodeBlockLowlight.configure({
      //   lowlight,
      //   defaultLanguage: 'javascript'
      // }),
    ],
    editable: true,
    onTransaction: onEditorUpdate,
    // content: value,
    injectCSS: true,
    onFocus,
    editorProps: {
      attributes: {
        style: inputStyle
      }
    }
  })

  useEffect(() => {
    if (value === '') {
      editor?.commands.setContent('')
    }
  }, [editor?.commands, value])

  return (
    <div style={{width: '100%', height: '100%'}}>
      <div>
       {editor && <MenuBar editor={editor}/>}
      </div>
      <div className={styles.editorContainer}>
         <EditorContent editor={editor}/>
      </div>
    </div>
  )
}

enum Style {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  codeBlock = 'codeBlock',
  code = 'code',
  doubleQuotes = 'blockquote',
  unorderedList = 'bulletList',
  orderedList = 'orderedList',
}
const HEADING_TYPE = {
  heading1: {
    style: 'heading',
    level: 1
  },
  heading2: {
    style: 'heading',
    level: 2
  },
  heading3: {
    style: 'heading',
    level: 3
  }
}
function MenuBar({
  editor
}: {
  editor: Editor
}) {
  const [selectedHeading, setSelectedHeading] = useState<string>('paragraph')
  const MENU_ITEM = useMemo(() => [
    {
      type: 'select',
      options: [
        {
          icon: '/richTextInputImg/heading-h1.png',
          key: 'heading1',
          onSelect: () => {
            setSelectedHeading('heading1')
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        },
        {
          icon: '/richTextInputImg/heading-h2.png',
          key: 'heading2',
          onSelect: () => {
            setSelectedHeading('heading2')
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        },
        {
          icon: '/richTextInputImg/heading-h3.png',
          key: 'heading3',
          onSelect: () => {
            setSelectedHeading('heading3')
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        },
        {
          icon: '/richTextInputImg/paragraph-left.png',
          key: 'paragraph',
          onSelect: () => {
            setSelectedHeading('paragraph')
            editor.chain().focus().setParagraph().run()
          }
        },
      ]
    },
    {
      type: 'button',
      icon: '/richTextInputImg/bold.png',
      style: Style.bold,
      alt: '加粗',
      onClick: () => {
        editor.chain().focus().toggleBold().run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/italic.png',
      style: Style.italic,
      alt: '斜体',
      onClick: () => {
        editor.chain().focus().toggleItalic().run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/underline.png',
      style: Style.underline,
      alt: '下划线',
      onClick: () => {
        editor.chain().focus().toggleUnderline().run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/bx-code-block.png',
      style: Style.codeBlock,
      alt: '代码块',
      onClick: () => {
        editor.chain().focus().toggleCodeBlock({ language: 'javascript' }).run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/code.png',
      style: Style.code,
      alt: '行内代码',
      onClick: () => {
        editor.chain().focus().toggleCode().run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/double-quotes-l.png',
      style: Style.doubleQuotes,
      alt: '引用',
      onClick: () => {
        editor.chain().focus().toggleBlockquote().run()
      }
    },
    // {
    //   icon: '/richTextInputImg/link.png',
    //   onClick: () => {
    //     editor.chain().focus().toggleLink().run()
    //   }
    // },
    {
      type: 'button',
      icon: '/richTextInputImg/unordered-list.png',
      style: Style.unorderedList,
      alt: '无序列表',
      onClick: () => {
        editor.chain().focus().toggleBulletList().run()
      }
    },
    {
      type: 'button',
      icon: '/richTextInputImg/ordered-list.png',
      style: Style.orderedList,
      alt: '有序列表',
      onClick: () => {
        editor.chain().focus().toggleOrderedList().run()
      }
    }
  ], [editor])
  return <div className={styles.menuContainer}>
    <div className={styles.menuList}>
    {
      MENU_ITEM.map((item) => {
        if (item.type === 'button') {
          const {
            icon,
            style,
            alt = '',
            onClick
          } = item
          return <div key={icon} onClick={onClick} style={{marginRight: '10px'}}>
            <Image
             // @ts-ignore
              src={icon}
              alt={alt}
              // @ts-ignore
              className={`${styles.menuIcon} ${editor.isActive(style) ? styles.menuIconSelected : ''}`}
              width={20}
              height={20}
            />
          </div>
        }
        else if (item.type === 'select') {
          return <Select variant='standard' value={selectedHeading} style={{border: 'none'}}>
            {
              // @ts-ignore
              item.options.map(item => {
                return <MenuItem onClick={item.onSelect} key={item.key} value={item.key}>
                  <Image
                    src={item.icon}
                    width={20}
                    height={20}
                    alt='heading'
                  />
                </MenuItem>
              })
            }
          </Select>
        }
      })
    }
    </div>
    {/* <div className={styles.verticleDivider}/> */}
    {/* <div onClick={() => editor.chain().focus().redo().run()}>
      <Image
        src={'/richTextInputImg/redo.png'}
        alt='redo'
        className={styles.menuIcon}
        width={20}
        height={20}
      />
    </div> */}
  </div>
}