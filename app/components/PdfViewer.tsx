'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<any>(null)

  useEffect(() => {
    // Fetch the PDF file
    const loadPdf = async () => {
      try {
        console.log('Loading PDF from:', fileUrl)
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfFile(url)
        setError(null)
        console.log('PDF loaded successfully')
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError(String(err))
      }
    }

    loadPdf()

    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile)
      }
    }
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
    console.error('PDF rendering error:', error)
    setError(error?.message || 'Failed to render PDF')
  }

  if (error) {
    return <div className="text-red-500 p-4">Couldn't load PDF: {error}</div>
  }

  if (!pdfFile) {
    return <div className="p-4">Loading PDF…</div>
  }

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={pdfFile}
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
