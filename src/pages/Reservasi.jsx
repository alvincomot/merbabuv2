import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReservasi } from "@/features/reservasi/reservasiSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const Reservasi = () => {
  const dispatch = useDispatch();
  const { items: layanan, status } = useSelector((state) => state.reservasi);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (status === "idle") dispatch(fetchReservasi());
  }, [status, dispatch]);

  const handleBooking = (nomor, pesan, judul) => {
    const finalPesan = pesan.replace("{judul}", judul);
    const encodedPesan = encodeURIComponent(finalPesan);
    const whatsappUrl = `https://wa.me/${nomor}?text=${encodedPesan}`;
    window.open(whatsappUrl, "_blank");
  };

  // helper function untuk merender konten berdasarkan status
  const renderContent = () => {
    if (status === "loading" || status === "idle") {
      return <p className="text-center text-gray-500">Memuat layanan...</p>;
    }

    if (status === "failed") {
      return (
        <p className="text-center text-red-500">
          Gagal memuat layanan. Silakan coba lagi nanti.
        </p>
      );
    }

    if (
      status === "succeeded" &&
      Array.isArray(layanan) &&
      layanan.length > 0
    ) {
      return layanan.map((item, index) => (
        <div
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={index * 100}
          className="sm:flex items-center gap-6 p-4 rounded-xl shadow-sm border-gray-300 border"
        >
          <img
            src={item.image}
            alt={item.judul}
            className="w-full sm:w-1/3 h-48 object-cover rounded-lg"
          />
          <div className="mt-4 sm:mt-0 flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{item.judul}</h3>
            <p className="mt-2 text-gray-600">{item.deskripsi_singkat}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() =>
                handleBooking(
                  item.nomor_whatsapp,
                  item.pesan_whatsapp,
                  item.judul
                )
              }
              className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Booking
            </button>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">
            Layanan & Reservasi belum tersedia.
          </p>
        </div>
      );
    }
  };

  return (
    <MainLayouts>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
          <div className="text-start mb-12">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
              Layanan & Reservasi
            </h1>
          </div>

          <div className="space-y-8">{renderContent()}</div>
        </div>
      </section>
    </MainLayouts>
  );
};

export default Reservasi;
