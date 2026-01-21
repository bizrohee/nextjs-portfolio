'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set worker source with CORS support
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`
}

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

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
          // Create blob URL
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          setBlobUrl(url)
          setError(null)
          console.log('Blob URL created:', url)
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
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
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

  if (error) {
    return <div className="text-red-500 p-4">Couldn't load PDF: {error}</div>
  }

  if (!blobUrl) {
    return <div className="p-4">Loading PDF…</div>
  }

  console.log('About to render Document with blobUrl:', blobUrl)
  console.log('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc)
  console.log('pdfjs version:', pdfjs.version)

  try {
    console.log('Rendering Document component now...')
    return (
      <div ref={containerRef} className="w-full">
        <Document
          file={blobUrl}
          onLoadSuccess={({ numPages }) => {
            console.log('✓ PDF loaded successfully with', numPages, 'pages')
            setNumPages(numPages)
          }}
          onError={(error) => {
            console.error('✗ Document error:', error)
            setError(`Error: ${error}`)
          }}
          onLoadProgress={({ loaded, total }) => {
            console.log(`📊 Loading: ${Math.round((loaded / total) * 100)}%`)
          }}
          loading={<div className="p-4 bg-gray-100 rounded">Loading PDF…</div>}
          noData={<div className="p-4 bg-red-100 text-red-600 rounded">No PDF data</div>}
        >
          {numPages > 0 ? (
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
          ) : (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
              Document loaded but waiting for page count...
            </div>
          )}
        </Document>
      </div>
    )
  } catch (err) {
    console.error('✗ Exception rendering PDF:', err, err instanceof Error ? err.stack : '')
    setError(`Exception: ${err}`)
    return <div className="text-red-500 p-4 bg-red-50 rounded">Error rendering PDF: {String(err)}</div>
  }
}
