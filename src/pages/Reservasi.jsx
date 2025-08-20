// src/pages/Reservasi.jsx
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReservasi } from "@/features/reservasi/reservasiSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial' font-size='16'>No Image</text></svg>`
  );

const SkeletonRow = () => (
  <div className="sm:flex items-center gap-6 p-4 rounded-xl shadow-sm border border-gray-200">
    <div className="w-full sm:w-1/3 h-48 rounded-lg bg-gray-200 animate-pulse" />
    <div className="mt-4 sm:mt-0 flex-1">
      <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="mt-4 sm:mt-0">
      <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

// Hilangkan karakter non-digit pada nomor WhatsApp
const sanitizePhone = (nomor = "") => (nomor || "").replace(/[^\d]/g, "");

const Reservasi = () => {
  const dispatch = useDispatch();
  const { items: layanan, status, error } = useSelector((s) => s.reservasi);
  const fetchedRef = useRef(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    // Cegah double fetch di Strict Mode saat dev
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchReservasi());
    }
  }, [dispatch]);

  const handleBooking = (nomor, pesan, judul) => {
    const phone = sanitizePhone(nomor);
    if (!phone) {
      alert("Nomor WhatsApp tidak tersedia.");
      return;
    }
    const safePesan = (pesan || "").replace("{judul}", judul || "");
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(safePesan)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

          {/* Loading */}
          {(status === "idle" || status === "loading") && (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={`s-${i}`} />
              ))}
            </div>
          )}

          {/* Error */}
          {status === "failed" && (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">Gagal memuat layanan.</p>
              <p className="mt-1">{error || "Silakan coba lagi nanti."}</p>
              <button
                onClick={() => dispatch(fetchReservasi())}
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Succeeded */}
          {status === "succeeded" && (
            <>
              {Array.isArray(layanan) && layanan.length > 0 ? (
                <div className="space-y-8">
                  {layanan.map((item, index) => (
                    <div
                      key={item?.id || index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className="sm:flex items-center gap-6 p-4 rounded-xl shadow-sm border border-gray-200"
                    >
                      <img
                        src={item?.image || FALLBACK_IMG}
                        alt={item?.judul || "Layanan"}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                        className="w-full sm:w-1/3 h-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="mt-4 sm:mt-0 flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {item?.judul || "Tanpa Judul"}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {item?.deskripsi_singkat || "Tidak ada deskripsi"}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <button
                          onClick={() =>
                            handleBooking(
                              item?.nomor_whatsapp,
                              item?.pesan_whatsapp,
                              item?.judul
                            )
                          }
                          className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-500">
                    Layanan & Reservasi belum tersedia.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayouts>
  );
};

export default Reservasi;
