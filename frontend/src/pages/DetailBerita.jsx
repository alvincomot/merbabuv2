// file: frontend/src/pages/NewsDetail.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchNewsById } from "@/features/news/newsSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const NewsDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Mengambil 'id' dari URL, contoh: /news/1

  // Ambil data berita yang dipilih dari Redux store
  const {
    selectedItem: news,
    status,
    error,
  } = useSelector((state) => state.news);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    // Panggil data dari API menggunakan id dari URL
    if (id) {
      dispatch(fetchNewsById(id));
    }
  }, [id, dispatch]);

  // Tampilan saat loading
  if (status === "loading") {
    return (
      <MainLayouts>
        <div className="text-center py-40">Memuat berita...</div>
      </MainLayouts>
    );
  }

  // Tampilan saat error
  if (status === "failed") {
    return (
      <MainLayouts>
        <div className="text-center py-40 text-red-500">Error: {error}</div>
      </MainLayouts>
    );
  }

  // Tampilan jika berita tidak ditemukan atau belum dimuat
  if (!news) {
    return (
      <MainLayouts>
        <div className="text-center py-40">Berita tidak ditemukan.</div>
      </MainLayouts>
    );
  }

  return (
    <MainLayouts>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8" data-aos="fade-down">
          {/* Link untuk kembali ke halaman daftar berita */}
          <Link
            to="/berita"
            className="text-teal-600 hover:text-teal-800 font-semibold"
          >
            &larr; Kembali ke semua berita
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
            {news.judul}
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Dipublikasikan oleh{" "}
            <span className="font-medium text-gray-800">
              {news.User?.name || "Admin"}
            </span>{" "}
            pada {formatDate(news.createdAt)}
          </p>
        </div>

        {/* Gambar Utama */}
        <div
          className="my-8 rounded-xl overflow-hidden shadow-2xl"
          data-aos="zoom-in"
        >
          <img
            src={news.image}
            alt={news.judul}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Konten Berita */}
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap"
          data-aos="fade-up"
          dangerouslySetInnerHTML={{
            __html: news.konten.replace(/\n/g, "<br />"),
          }}
        />
      </article>
    </MainLayouts>
  );
};

export default NewsDetail;
