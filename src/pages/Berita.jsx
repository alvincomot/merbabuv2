import React from 'react'
import MainLayouts from '../components/layouts/MainLayouts'

function Berita() {
  return (
    <div>
      <section>
        <MainLayouts>
          <section id="berita">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Berita is</h1>
              <h1 className="text-3xl font-bold text-gray-900">Cooming Soon</h1>
            </div>
          </section>
        </MainLayouts>
      </section>
    </div>
  )
}

export default Berita