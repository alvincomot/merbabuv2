// src/pages/informasiWisata.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDestinations } from "@/features/destinations/destinationSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const SkeletonCard = () => (
  <div className="block rounded-xl p-4 shadow-lg border border-gray-100">
    <div className="h-56 w-full rounded-md bg-gray-200 animate-pulse" />
    <div className="mt-4">
      <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse mt-2" />
      <div className="space-y-2 mt-4">
        <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-6 h-10 w-32 rounded-full bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial' font-size='16'>No Image</text></svg>`
  );

const InformasiWisata = () => {
  const dispatch = useDispatch();
  const { items: destinations, status, error } = useSelector((s) => s.destinations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWisata, setSelectedWisata] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchDestinations());
    }
  }, [dispatch]);

  const openModal = (wisata) => {
    setSelectedWisata(wisata);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWisata(null);
  };

  return (
    <MainLayouts>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(status === "loading" || status === "idle") &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}

            {status === "failed" && (
              <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                <strong className="font-bold">Terjadi Kesalahan!</strong>
                <span className="block sm:inline ml-2">
                  {error || "Gagal memuat data."}
                </span>
                <div className="mt-3">
                  <button
                    onClick={() => dispatch(fetchDestinations())}
                    disabled={status === "loading"}
                    className="inline-block rounded bg-red-600 text-white text-sm px-4 py-2 hover:bg-red-700 disabled:opacity-60"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            )}

            {status === "succeeded" && Array.isArray(destinations) && destinations.length > 0 ? (
              destinations.map((dest, index) => (
                <div
                  key={dest?.uuid || index}
                  className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative overflow-hidden">
                    <img
                      alt={dest?.name || "Destinasi"}
                      src={dest?.image || FALLBACK_IMG}
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                      loading="lazy"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">
                      {dest?.name || "Nama Wisata Tidak Tersedia"}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{dest?.location || "Lokasi tidak tersedia"}</span>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {dest?.description || "Deskripsi tidak tersedia."}
                    </p>
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => openModal(dest)}
                        className="inline-block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-teal-700"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              status === "succeeded" && (
                <p className="col-span-full text-center text-gray-500">
                  Saat ini belum ada data wisata yang tersedia.
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {isModalOpen && selectedWisata && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            <img
              src={selectedWisata?.image || FALLBACK_IMG}
              alt={selectedWisata?.name || "Destinasi"}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedWisata?.name || "Tanpa Nama"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-3xl font-bold text-gray-400 hover:text-gray-700 -mt-4 -mr-2"
                  aria-label="Tutup modal"
                >
                  &times;
                </button>
              </div>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mt-4">
                {selectedWisata?.description || "Tidak ada deskripsi."}
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayouts>
  );
};

export default InformasiWisata;
