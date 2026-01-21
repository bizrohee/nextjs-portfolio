'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface PDFViewerProps {
  filePath: string
  title?: string
}

export function PDFViewer({ filePath, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    setError(`Failed to load PDF: ${error.message}`)
    setIsLoading(false)
  }

  return (
    <div className="pdf-viewer-container my-8 border border-gray-300 rounded-lg overflow-hidden">
      {title && <div className="bg-gray-100 px-4 py-3 font-semibold text-sm">{title}</div>}
      <div className="pdf-document overflow-auto bg-gray-50">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading PDF...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <Document
          file={filePath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="flex items-center justify-center py-12"><p className="text-gray-500">Loading...</p></div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="mb-4 bg-white shadow-sm">
              <Page
                pageNumber={index + 1}
                width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 60, 800) : 800}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </div>
          ))}
        </Document>
        {!isLoading && !error && numPages > 0 && (
          <div className="text-center py-4 text-xs text-gray-500">
            Page count: {numPages}
          </div>
        )}
      </div>
    </div>
  )
}
