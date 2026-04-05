'use client'
import React, { useCallback, useState } from 'react'
import { Upload, X, File, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxSize?: number // MB
  accept?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, maxSize = 25, accept }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.size <= maxSize * 1024 * 1024)
    setSelectedFiles(prev => [...prev, ...validFiles])
    onFilesSelected(validFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  return (
    <div className="file-upload-container">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input 
          id="file-input"
          type="file" 
          multiple 
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          style={{ display: 'none' }}
        />
        
        <div className="dropzone-content">
          <Upload size={32} className="upload-icon" />
          <p className="main-text">Click or drag files to upload</p>
          <p className="sub-text">Support for PDF, JPG, PNG, DOC (Max {maxSize}MB)</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-list">
          {selectedFiles.map((file, i) => (
            <div key={i} className="file-item">
              <File size={16} className="file-icon" />
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <CheckCircle size={16} className="success-icon" />
              <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .dropzone {
          border: 2px dashed var(--bg-tertiary);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-12) var(--space-6);
          text-align: center;
          cursor: pointer;
          transition: all var(--trans-normal);
        }
        .dropzone.dragging {
          border-color: var(--mint-primary);
          background: rgba(0, 255, 157, 0.05);
          transform: scale(1.02);
        }
        .dropzone:hover {
          border-color: var(--text-muted);
        }
        .upload-icon {
          color: var(--text-muted);
          margin-bottom: var(--space-4);
        }
        .main-text {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        .sub-text {
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .file-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .file-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--bg-tertiary);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: border-color var(--trans-fast);
        }
        .file-item:hover {
            border-color: var(--bg-elevated);
        }
        .file-icon { color: var(--text-secondary); }
        .file-info { flex: 1; display: flex; flex-direction: column; }
        .file-name { font-size: 14px; font-weight: 500; }
        .file-size { font-size: 12px; color: var(--text-muted); }
        .success-icon { color: var(--success); }
        .remove-btn { color: var(--text-muted); }
        .remove-btn:hover { color: var(--error); }
      `}</style>
    </div>
  )
}
