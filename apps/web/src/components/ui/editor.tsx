import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Code, Italic, Link2 } from 'lucide-react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Toggle } from './toggle'

interface EditorProps {
  onChange?: (value: string) => void
  onBlur?: () => void
  value?: string
  placeholder?: string
}

// TODO: extend props from EditorContentProps
// TODO: add code hightligt extension
// TODO: create css for editor
// TODO: imgix loader
// TODO: card,divider,layout,typography,badge components
// TODO: bull
// TODO: email resend
// TODO: organize components and skeletons
// TOOD: link account, 2factor, activate account
// TODO: UserAvatar Component
// TODO: Post Component
// modal animation
// skeleton auth pages, pages redirect if login, user me
// procedure ralimit
// rewrite email templates with tailwind
// nprogress
// error login/register review next-auth cuistom pages
// algolia
// full text search pg, materialized view
// loading posts
//  downshift
// react balancer and tailwind capzise
// react virtualized
// github actions deploy
const EditorField = forwardRef<any, EditorProps>(
  ({ onBlur, onChange, value, placeholder }, ref) => {
    const editorRef: React.MutableRefObject<Editor | null> = useRef(null)

    const editor = useEditor({
      extensions: [
        Link.configure({
          openOnClick: false,
        }),
        StarterKit,
        Highlight,
        Typography,
        Placeholder.configure({
          placeholder,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground',
        },
      },
      content: value,
      onUpdate(props) {
        onChange?.(props.editor.getHTML())
      },
      onBlur() {
        onBlur?.()
      },
    })

    const setLink = useCallback(() => {
      const previousUrl = editor?.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()

        return
      }

      // update link
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }, [editor])

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          editorRef.current?.commands.focus()
        },
      }),
      [],
    )

    if (!editor) return null

    editorRef.current = editor

    return (
      <div className="inline-flex w-full flex-col gap-2 [&>*]:w-full">
        <EditorContent editor={editor} />

        <ul className="flex">
          <li>
            <Toggle
              type="button"
              pressed={editor.isActive('bold')}
              onPressedChange={(pressed) => {
                if (pressed) editor.chain().focus().setBold().run()
                else editor.chain().focus().unsetBold().run()
              }}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </li>

          <li>
            <Toggle
              type="button"
              pressed={editor.isActive('italic')}
              onPressedChange={(pressed) => {
                if (pressed) editor.chain().focus().setItalic().run()
                else editor.chain().focus().unsetItalic().run()
              }}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </li>
          <li>
            <Toggle
              type="button"
              pressed={editor.isActive('code')}
              onPressedChange={(pressed) => {
                editor.chain().focus().toggleCodeBlock().run()
              }}
            >
              <Code className="h-4 w-4" />
            </Toggle>
          </li>
          <li>
            <Toggle
              type="button"
              pressed={editor.isActive('link')}
              onPressedChange={(pressed) => {
                if (pressed) setLink()
                else editor.chain().focus().unsetLink().run()
              }}
            >
              <Link2 className="h-4 w-4" />
            </Toggle>
          </li>
        </ul>
      </div>
    )
  },
)

EditorField.displayName = 'Editor'

export default EditorField
