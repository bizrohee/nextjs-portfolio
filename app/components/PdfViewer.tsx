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
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    // Fetch the PDF file as ArrayBuffer
    const fetchPdf = async () => {
      try {
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`)
        }
        const arrayBuffer = await response.arrayBuffer()
        setPdfData(arrayBuffer)
        setError(false)
      } catch (err) {
        console.error('Error fetching PDF:', err)
        setError(true)
      }
    }

    fetchPdf()
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
    return <div className="text-red-500">Couldn't load PDF. Please check the file path.</div>
  }

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={pdfData}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<div>Loading PDF…</div>}
        error={<div>Couldn’t load PDF.</div>}
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
