import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchNewsById } from "@/features/news/newsSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial' font-size='16'>No Image</text></svg>`
  );

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const DetailBerita = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);

  // di slice: current menampung detail yg terakhir di-fetch
  const { current: news, status, error } = useSelector((s) => s.news);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    // fetch jika:
    // - belum pernah fetch
    // - atau id berbeda dengan current
    if (!fetchedRef.current || (news && String(news.id) !== String(id))) {
      fetchedRef.current = true;
      dispatch(fetchNewsById(id));
    }
  }, [dispatch, id]); // jangan masukkan "news" ke dependency agar tidak re-fetch loop

  return (
    <MainLayouts>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/berita"
              className="inline-flex items-center text-teal-700 hover:text-teal-800"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Berita
            </Link>
          </div>

          {(status === "idle" || status === "loading") && (
            <p className="text-center text-gray-500">Memuat berita...</p>
          )}

          {status === "failed" && (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">
                Gagal memuat berita{error ? `: ${error}` : "."}
              </p>
              <button
                onClick={() => dispatch(fetchNewsById(id))}
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Coba lagi
              </button>
            </div>
          )}

          {status === "succeeded" && news && (
            <article className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up">
              <div className="relative overflow-hidden">
                <img
                  src={news.image || FALLBACK_IMG}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  alt={news.judul}
                  className="w-full h-auto md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {news.judul}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Oleh {news.user?.name || "Admin"} &middot; {formatDate(news.createdAt)}
                </p>

                <div className="prose prose-teal max-w-none mt-6">
                  {/* Jika konten plain text panjang, tetap ditampilkan rapi */}
                  <p className="whitespace-pre-wrap leading-7 text-gray-800">
                    {news.konten}
                  </p>
                </div>
              </div>
            </article>
          )}

          {status === "succeeded" && !news && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600">Berita tidak ditemukan</h2>
              <p className="mt-2 text-gray-500">Coba kembali ke halaman daftar berita.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayouts>
  );
};

export default DetailBerita;
