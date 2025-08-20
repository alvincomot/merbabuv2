import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNews } from "@/features/news/newsSlice";
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

const Berita = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);
  const { items: allNews = [], status, error } = useSelector((s) => s.news);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    // cegah double fetch di StrictMode
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchNews());
    }
  }, [dispatch]);

  const firstArticle = allNews[0];
  const otherArticles = allNews.slice(1);

  return (
    <MainLayouts>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
          {(status === "idle" || status === "loading") && (
            <p className="text-center text-gray-500">Memuat berita...</p>
          )}

          {status === "failed" && (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">
                Gagal memuat berita{error ? `: ${error}` : "."}
              </p>
              <button
                onClick={() => dispatch(fetchNews())}
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Coba lagi
              </button>
            </div>
          )}

          {status === "succeeded" && allNews.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600">Belum Ada Berita</h2>
              <p className="mt-2 text-gray-500">
                Saat ini belum ada berita yang tersedia untuk ditampilkan.
              </p>
            </div>
          )}

          {status === "succeeded" && allNews.length > 0 && (
            <>
              {firstArticle && (
                <div className="mb-12" data-aos="fade-down">
                  <Link to={`/berita/${firstArticle.id}`} className="block group">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={firstArticle.image || FALLBACK_IMG}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                        alt={firstArticle.judul}
                        className="w-full h-auto md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-6 bg-gray-50 -mt-2 rounded-b-xl">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                        {firstArticle.judul}
                      </h2>
                      <p className="mt-4 text-gray-700 leading-relaxed line-clamp-3">
                        {firstArticle.konten}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Oleh {firstArticle.user?.name || "Admin"} &middot;{" "}
                        {formatDate(firstArticle.createdAt)}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {otherArticles.length > 0 && <hr className="my-12 border-gray-200" />}

              <div className="space-y-10">
                {otherArticles.map((article, index) => (
                  <div key={article.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <Link
                      to={`/berita/${article.id}`}
                      className="flex flex-col sm:flex-row gap-6 group"
                    >
                      <div className="w-full sm:w-1/3 lg:w-1/4 h-48 sm:h-auto overflow-hidden rounded-lg">
                        <img
                          src={article.image || FALLBACK_IMG}
                          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                          alt={article.judul}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:w-2/3 lg:w-3/4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                          {article.judul}
                        </h3>
                        <p className="mt-3 text-gray-600 line-clamp-2">{article.konten}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          Oleh {article.user?.name || "Admin"} &middot;{" "}
                          {formatDate(article.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </MainLayouts>
  );
};

export default Berita;
