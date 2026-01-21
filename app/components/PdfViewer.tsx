'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js`

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Log to verify the component mounted
    console.log('PdfViewer mounted with fileUrl:', fileUrl)
  }, [fileUrl])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Set initial width
    setContainerWidth(el.clientWidth)

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const nextWidth = Math.floor(entry.contentRect.width)
      setContainerWidth(nextWidth)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Optional: cap max render width so it doesn't get huge on wide screens
  const pageWidth = Math.min(containerWidth, 800)

  const handleError = (error: any) => {
    console.error('PDF rendering error details:', {
      error,
      message: error?.message,
      toString: String(error),
    })
    setError(`Rendering failed: ${error?.message || String(error)}`)
  }

  if (error) {
    return <div className="text-red-500 p-4">Couldn't load PDF: {error}</div>
  }

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onError={handleError}
        loading={<div className="p-4">Loading PDF…</div>}
      >
        <div className="flex flex-col gap-6">
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="w-full">
              {pageWidth > 0 && (
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                />
              )}
            </div>
          ))}
        </div>
      </Document>
    </div>
  )
}
