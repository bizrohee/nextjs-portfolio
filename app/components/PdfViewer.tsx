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

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={fileUrl}
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
