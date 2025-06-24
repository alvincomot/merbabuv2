import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNews } from "@/features/news/newsSlice";
import MainLayouts from "@/components/layouts/MainLayouts";
import AOS from "aos";
import "aos/dist/aos.css";

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric"});

const News = () => {
  const dispatch = useDispatch();
  const { items: allNews, status } = useSelector((state) => state.news);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (status === "idle") dispatch(fetchNews());
  }, [status, dispatch]);

  // Memisahkan artikel pertama dengan sisanya
  const firstArticle = allNews?.[0];
  const otherArticles = allNews?.slice(1);

  return (
    <MainLayouts>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
          {/* artikel Utama / paling Atas */}
          {status === "succeeded" && firstArticle && (
            <div className="mb-12" data-aos="fade-down">
              <Link to={`/news/${firstArticle.id}`} className="block group">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img src={firstArticle.image} alt={firstArticle.judul} className="w-full h-auto md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                    {firstArticle.judul}
                  </h2>
                  <p className="mt-4 text-gray-700 leading-relaxed line-clamp-3">
                    {firstArticle.konten}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Oleh {firstArticle.User?.name || "Admin"} &middot;{" "}
                    {formatDate(firstArticle.createdAt)}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {status === "succeeded" && firstArticle && (
            <hr className="my-12 border-gray-200" />
          )}

          {/* artikel Lainnya */}
          <div className="space-y-10">
            {status === "succeeded" &&
              otherArticles?.map((article, index) => (
                <div key={article.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <Link to={`/news/${article.id}`} className="flex flex-col sm:flex-row gap-6 group">
                    <div className="w-full sm:w-1/3 lg:w-1/4 h-48 sm:h-auto overflow-hidden rounded-lg">
                      <img src={article.image} alt={article.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:w-2/3 lg:w-3/4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                        {article.judul}
                      </h3>
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {article.konten}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Oleh {article.User?.name || "Admin"} &middot;{" "}
                        {formatDate(article.createdAt)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
          </div>

          {/* Status Loading dan Error */}
          {status === "loading" && (
            <p className="text-center">Memuat berita...</p>
          )}
          {status === "failed" && (
            <p className="text-center text-red-500">Gagal memuat berita.</p>
          )}
        </div>
      </section>
    </MainLayouts>
  );
};

export default News;
