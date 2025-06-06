import React from 'react'
import MainLayouts from '../components/layouts/MainLayouts'

function Reservasi() {
  return (

    <div>
      <section>
        <MainLayouts>
          <section id="reservasi">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Reservasi</h1>
              <p className="mt-2 text-gray-700">
                Silakan isi form di bawah ini untuk melakukan reservasi.
              </p>
              {/* Form reservasi bisa ditambahkan di sini */}
            </div>
          </section>
        </MainLayouts>
      </section>
    </div>
  )
}

export default Reservasi