import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDestinations } from "../features/destinations/destinationSlice";
import MainLayouts from "../components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const SkeletonCard = () => (
  <div className="block rounded-xl p-4 shadow-lg border border-gray-100">
    <div className="h-56 w-full rounded-md bg-gray-200 animate-pulse"></div>
    <div className="mt-4">
      <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse mt-2"></div>
      <div className="space-y-2 mt-4">
        <div className="h-3 w-full rounded bg-gray-200 animate-pulse"></div>
        <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse"></div>
      </div>
      <div className="mt-6 h-10 w-32 rounded-full bg-gray-200 animate-pulse"></div>
    </div>
  </div>
);

const InformasiWisata = () => {
  const dispatch = useDispatch();
  const { items: destinations, status, error } = useSelector((state) => state.destinations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWisata, setSelectedWisata] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (status === "idle") {
      dispatch(fetchDestinations());
    }
  }, [status, dispatch]);

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
          <div className="text-center mb-12" data-aos="fade-down">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Jelajahi Destinasi Wisata Kami
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-gray-600">
              Temukan keindahan dan keunikan di setiap sudut desa kami yang
              menawan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(status === "loading" || status === "idle") &&
              Array(6)
                .fill(0)
                .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)}

            {status === "failed" && (
              <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                <strong className="font-bold">Terjadi Kesalahan!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}

            {status === "succeeded" &&
            Array.isArray(destinations) &&
            destinations.length > 0
              ? destinations.map((dest, index) => (
                  <div key={dest.uuid} className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="relative overflow-hidden">
                      <img alt={dest.name} src={dest.image} className="h-56 w-full object-cover"/>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900">
                        {dest.name || "Nama Wisata Tidak Tersedia"}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                        <span>{dest.location || "Lokasi tidak tersedia"}</span>
                      </div>
                      <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {dest.description || "Deskripsi tidak tersedia."}
                      </p>
                      <div className="mt-auto pt-4">
                        <button onClick={() => openModal(dest)} className="inline-block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-teal-700">
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : status === "succeeded" && (
                  <p className="col-span-full text-center text-gray-500">
                    Saat ini belum ada data wisata yang tersedia.
                  </p>
                )}
          </div>
        </div>
      </section>

      {isModalOpen && selectedWisata && (
        <div onClick={closeModal} className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[100] p-4" data-aos="fade">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" data-aos="zoom-in">
            <img src={selectedWisata.image} alt={selectedWisata.name} className="w-full h-64 object-cover rounded-t-lg"/>
            <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedWisata.name}
                </h2>
                <button onClick={closeModal} className="text-3xl font-bold text-gray-400 hover:text-gray-700 -mt-4 -mr-2">
                  &times;
                </button>
              </div>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mt-4">
                {selectedWisata.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayouts>
  );
};

export default InformasiWisata;
