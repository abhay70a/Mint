'use client'
import React, { useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button type="button" onClick={() => execCommand('bold')}>B</button>
        <button type="button" onClick={() => execCommand('italic')}>I</button>
        <button type="button" onClick={() => execCommand('insertUnorderedList')}>List</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'h3')}>H</button>
      </div>
      
      <div 
        ref={editorRef}
        className="content-area"
        contentEditable
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        .editor-container {
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          overflow: hidden;
        }
        .toolbar {
          padding: var(--space-2);
          background: var(--bg-tertiary);
          display: flex;
          gap: var(--space-1);
          border-bottom: 1px solid var(--bg-tertiary);
        }
        .toolbar button {
          padding: 4px 8px;
          font-size: 13px;
          border-radius: 4px;
          color: var(--text-secondary);
          transition: all var(--trans-fast);
        }
        .toolbar button:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .content-area {
          min-height: 200px;
          padding: var(--space-4);
          color: var(--text-primary);
          outline: none;
        }
        .content-area:empty:before {
          content: attr(data-placeholder);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
