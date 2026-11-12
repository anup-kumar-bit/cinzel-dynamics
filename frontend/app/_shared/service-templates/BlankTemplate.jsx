import React from 'react'
import ServiceHeroBackdrop from './ServiceHeroBackdrop'
import 'react-quill-new/dist/quill.snow.css'

export default function BlankTemplate({ content }) {
  const html = content?.body ?? ''
  const empty = !html || html == '<h1><br></h1>'

  return (
    <article className="relative isolate overflow-hidden px-4 py-14 sm:px-8 sm:py-20 lg:px-16">
      <ServiceHeroBackdrop />

      <div className="container relative z-10 mx-auto max-w-7xl">
        {empty ? (
          <p className="font-opensans text-sm text-center">This page is still being written.</p>
        ) : (
          // Quill's own classes, so the page renders exactly like the editor
          <div className="ql-snow font-opensans text-base text-base-content">
            <div className="ql-editor overflow-visible! p-0!" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </article>
  )
}
