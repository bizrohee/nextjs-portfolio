'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set worker source with CORS support
pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js`

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchPDF = async () => {
      try {
        console.log('Starting PDF fetch from:', fileUrl)
        const response = await fetch(fileUrl)
        console.log('Fetch response status:', response.status, response.statusText)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const arrayBuffer = await response.arrayBuffer()
        console.log('PDF fetched, size:', arrayBuffer.byteLength, 'bytes')
        
        if (isMounted) {
          setPdfData(arrayBuffer)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching PDF:', err)
        if (isMounted) {
          setError(String(err))
        }
      }
    }

    fetchPDF()
    return () => {
      isMounted = false
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

  if (error) {
    return <div className="text-red-500 p-4">Couldn't load PDF: {error}</div>
  }

  if (!pdfData) {
    return <div className="p-4">Loading PDF…</div>
  }

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={{ data: pdfData }}
        onLoadSuccess={({ numPages }) => {
          console.log('PDF loaded successfully with', numPages, 'pages')
          setNumPages(numPages)
        }}
        onError={(error) => {
          console.error('Document error:', error)
          setError(String(error))
        }}
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
