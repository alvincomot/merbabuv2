// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Destinations
import {
  fetchDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  resetAddEditStatus as resetDestinationFormStatus,
} from "@/features/destinations/destinationSlice";

// Users
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetFormStatus as resetUserFormStatus,
} from "@/features/users/userSlice";

// News
import {
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
  resetFormStatus as resetNewsFormStatus,
} from "@/features/news/newsSlice";

// Reservasi
import {
  fetchReservasi,
  createReservasi,
  updateReservasi,
  deleteReservasi,
  resetFormStatus as resetReservasiFormStatus,
} from "@/features/reservasi/reservasiSlice";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  // ===== Redux states =====
  const {
    items: destinations,
    status: destinationStatus,
    addEditStatus: destinationFormStatus,
    error: destinationError,
  } = useSelector((state) => state.destinations);

  const {
    items: users,
    status: userStatus,
    formStatus: userFormStatus,
    error: userError,
  } = useSelector((state) => state.users);

  const {
    items: news,
    status: newsStatus,
    formStatus: newsFormStatus,
    error: newsError,
  } = useSelector((state) => state.news);

  const {
    items: reservasi,
    status: reservasiStatus,
    formStatus: reservasiFormStatus,
    error: reservasiError,
  } = useSelector((state) => state.reservasi);

  // ===== Local states =====
  const [activeTab, setActiveTab] = useState("wisata");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentItem, setCurrentItem] = useState(null);

  // Wisata form
  const [wisataName, setWisataName] = useState("");
  const [wisataDesc, setWisataDesc] = useState("");
  const [wisataLocation, setWisataLocation] = useState("");
  const [wisataImage, setWisataImage] = useState(null);

  // Users form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("user");

  // News form
  const [newsJudul, setNewsJudul] = useState("");
  const [newsKonten, setNewsKonten] = useState("");
  const [newsImage, setNewsImage] = useState(null);

  // Reservasi form
  const [reservasiJudul, setReservasiJudul] = useState("");
  const [reservasiDeskripsi, setReservasiDeskripsi] = useState("");
  const [reservasiImage, setReservasiImage] = useState(null);
  const [reservasiNomorWa, setReservasiNomorWa] = useState("");
  const [reservasiPesanWa, setReservasiPesanWa] = useState("");

  // Preview image (dipakai bersama: wisata/news/reservasi)
  const [preview, setPreview] = useState("");

  // ===== Effects =====
  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  useEffect(() => {
    // Fetch sesuai tab aktif
    if (activeTab === "wisata" && destinationStatus === "idle") {
      dispatch(fetchDestinations());
    } else if (activeTab === "users" && userStatus === "idle") {
      dispatch(fetchUsers());
    } else if (activeTab === "news" && newsStatus === "idle") {
      dispatch(fetchNews());
    } else if (activeTab === "reservasi" && reservasiStatus === "idle") {
      dispatch(fetchReservasi());
    }
  }, [dispatch, activeTab, destinationStatus, userStatus, newsStatus, reservasiStatus]);

  // ===== Helpers =====
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setPreview("");
    // reset form fragment yang mungkin terisi
    setWisataImage(null);
    setNewsImage(null);
    setReservasiImage(null);
  };

  // ====== WISATA handlers ======
  const handleOpenWisataCreate = () => {
    dispatch(resetDestinationFormStatus());
    setCurrentItem(null);
    setModalMode("create");
    setWisataName("");
    setWisataDesc("");
    setWisataLocation("");
    setWisataImage(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleOpenWisataEdit = (wisata) => {
    dispatch(resetDestinationFormStatus());
    setCurrentItem(wisata);
    setModalMode("edit");
    setWisataName(wisata.name || "");
    setWisataDesc(wisata.description || "");
    setWisataLocation(wisata.location || "");
    setWisataImage(null);
    setPreview(wisata.image || "");
    setIsModalOpen(true);
  };

  const loadWisataImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setWisataImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleWisataSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", wisataName);
    formData.append("description", wisataDesc);
    formData.append("location", wisataLocation);
    if (wisataImage) formData.append("image", wisataImage);

    const action =
      modalMode === "create"
        ? createDestination(formData)
        : updateDestination({ id: currentItem.uuid, formData });

    const result = await dispatch(action);
    if (!result.error) {
      if (modalMode === "create") dispatch(fetchDestinations());
      handleCloseModal();
    }
  };

  const handleWisataDelete = (uuid) => {
    if (window.confirm("Yakin ingin menghapus wisata ini?")) {
      dispatch(deleteDestination(uuid));
    }
  };

  // ====== USER handlers ======
  const handleOpenUserCreate = () => {
    dispatch(resetUserFormStatus());
    setCurrentItem(null);
    setModalMode("create");
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
    setUserRole("user");
    setIsModalOpen(true);
  };

  const handleOpenUserEdit = (user) => {
    dispatch(resetUserFormStatus());
    setCurrentItem(user);
    setModalMode("edit");
    setUserName(user.name || "");
    setUserEmail(user.email || "");
    setUserRole(user.role || "user");
    setUserPassword("");
    setUserConfirmPassword("");
    setIsModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userPassword && userPassword !== userConfirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    const payload = { name: userName, email: userEmail, role: userRole };
    if (userPassword) payload.password = userPassword; // backend abaikan confPassword

    const action =
      modalMode === "create"
        ? createUser(payload)
        : updateUser({ uuid: currentItem.uuid, payload });

    const result = await dispatch(action);
    if (!result.error) {
      if (modalMode === "create") dispatch(fetchUsers());
      handleCloseModal();
    }
  };

  const handleUserDelete = (uuid) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      dispatch(deleteUser(uuid));
    }
  };

  // ====== NEWS handlers ======
  const handleOpenNewsCreate = () => {
    dispatch(resetNewsFormStatus());
    setCurrentItem(null);
    setModalMode("create");
    setNewsJudul("");
    setNewsKonten("");
    setNewsImage(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleOpenNewsEdit = (item) => {
    dispatch(resetNewsFormStatus());
    setCurrentItem(item);
    setModalMode("edit");
    setNewsJudul(item.judul || "");
    setNewsKonten(item.konten || "");
    setNewsImage(null);
    setPreview(item.image || "");
    setIsModalOpen(true);
  };

  const loadNewsImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", newsJudul);
    formData.append("konten", newsKonten);
    if (newsImage) formData.append("image", newsImage);

    // Sesuaikan dengan newsSlice kamu (updateNews({ id, payload }))
    const action =
      modalMode === "create"
        ? createNews(formData) // createNews(payload) -> payload bisa FormData
        : updateNews({ id: currentItem.id, payload: formData });

    const result = await dispatch(action);
    if (!result.error) {
      if (modalMode === "create") dispatch(fetchNews());
      handleCloseModal();
    }
  };

  const handleNewsDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      dispatch(deleteNews(id));
    }
  };

  // ====== RESERVASI handlers ======
  const handleOpenReservasiCreate = () => {
    dispatch(resetReservasiFormStatus());
    setCurrentItem(null);
    setModalMode("create");
    setReservasiJudul("");
    setReservasiDeskripsi("");
    setReservasiNomorWa("");
    setReservasiPesanWa("");
    setReservasiImage(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleOpenReservasiEdit = (item) => {
    dispatch(resetReservasiFormStatus());
    setCurrentItem(item);
    setModalMode("edit");
    setReservasiJudul(item.judul || "");
    setReservasiDeskripsi(item.deskripsi_singkat || "");
    setReservasiNomorWa(item.nomor_whatsapp || "");
    setReservasiPesanWa(item.pesan_whatsapp || "");
    setReservasiImage(null);
    setPreview(item.image || "");
    setIsModalOpen(true);
  };

  const loadReservasiImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReservasiImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleReservasiSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", reservasiJudul);
    formData.append("deskripsi_singkat", reservasiDeskripsi);
    formData.append("nomor_whatsapp", reservasiNomorWa);
    formData.append("pesan_whatsapp", reservasiPesanWa);
    if (reservasiImage) formData.append("image", reservasiImage);

    // reservasiSlice: updateReservasi({ id, formData })
    const action =
      modalMode === "create"
        ? createReservasi(formData)
        : updateReservasi({ id: currentItem.id, formData });

    const result = await dispatch(action);
    if (!result.error) {
      if (modalMode === "create") dispatch(fetchReservasi());
      handleCloseModal();
    }
  };

  const handleReservasiDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus layanan reservasi ini?")) {
      dispatch(deleteReservasi(id));
    }
  };

  // ====== UI ======
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-1 bg-gray-50">
        {/* Sidebar */}
        <aside className="flex flex-col w-64 bg-white border-r sticky top-16 h-[calc(100vh-4rem)]">
          <div className="flex-1 px-5 py-8 overflow-y-auto">
            <nav className="-mx-3 space-y-6">
              <div className="space-y-3">
                <label className="px-3 text-xs text-gray-500 uppercase">
                  Content
                </label>

                <button
                  onClick={() => setActiveTab("wisata")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "wisata"
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m7.4285 11 5-6 5 6m-10 0h-3v8h16v-8h-3m-10 0H3.42851l3-4h4.33739l-3.3374 4Zm10 0V7.5m-3 5.5c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2Zm3-8v3h4V5h-4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-2 text-sm font-medium">
                    Informasi Wisata
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("reservasi")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "reservasi"
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-2 text-sm font-medium">
                    Layanan Reservasi
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("news")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "news"
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-2 text-sm font-medium">Berita</span>
                </button>
              </div>

              <div className="space-y-3">
                <label className="px-3 text-xs text-gray-500 uppercase">
                  Account
                </label>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "users"
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="mx-2 text-sm font-medium">User Control</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Konten utama */}
        <div className="flex-1 p-8">
          {/* ===== WISATA ===== */}
          {activeTab === "wisata" && (
            <div data-aos="fade-up">
              <h1 className="text-3xl font-bold mb-6">Kelola Informasi Wisata</h1>
              <button
                onClick={handleOpenWisataCreate}
                className="inline-block bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 mb-6 shadow-md hover:shadow-lg transition-shadow"
              >
                + Tambah Wisata Baru
              </button>

              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama Wisata
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinationStatus === "loading" && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {destinationStatus === "succeeded" &&
                      destinations.map((dest, index) => (
                        <tr key={dest.uuid}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {index + 1}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {dest.name}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {dest.description}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {dest.location}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              onClick={() => handleOpenWisataEdit(dest)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleWisataDelete(dest.uuid)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {destinationStatus === "failed" && destinationError && (
                <p className="mt-4 text-red-600">{destinationError}</p>
              )}
            </div>
          )}

          {/* ===== USERS ===== */}
          {activeTab === "users" && (
            <div data-aos="fade-up">
              <h1 className="text-3xl font-bold mb-6">User Control</h1>
              <button
                onClick={handleOpenUserCreate}
                className="inline-block bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 mb-6 shadow-md hover:shadow-lg transition-shadow"
              >
                + Tambah User Baru
              </button>

              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Dibuat Pada
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userStatus === "loading" && (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {userStatus === "succeeded" &&
                      users.map((user, index) => (
                        <tr key={user.uuid}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {index + 1}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.name}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.email}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span
                              className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                                user.role === "admin"
                                  ? "text-red-900 bg-red-200"
                                  : "text-green-900 bg-green-200"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              onClick={() => handleOpenUserEdit(user)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleUserDelete(user.uuid)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {userStatus === "failed" && userError && (
                <p className="mt-4 text-red-600">{userError}</p>
              )}
            </div>
          )}

          {/* ===== NEWS ===== */}
          {activeTab === "news" && (
            <div data-aos="fade-up">
              <h1 className="text-3xl font-bold mb-6">Kelola Berita</h1>
              <button
                onClick={handleOpenNewsCreate}
                className="inline-block bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 mb-6 shadow-md"
              >
                + Tambah Berita Baru
              </button>

              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Judul Berita
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Konten Berita
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Dibuat Pada
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsStatus === "loading" && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {newsStatus === "succeeded" &&
                      news.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {index + 1}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.judul}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.konten}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              onClick={() => handleOpenNewsEdit(item)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleNewsDelete(item.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {newsStatus === "failed" && newsError && (
                <p className="mt-4 text-red-600">{newsError}</p>
              )}
            </div>
          )}

          {/* ===== RESERVASI ===== */}
          {activeTab === "reservasi" && (
            <div data-aos="fade-up">
              <h1 className="text-3xl font-bold mb-6">Kelola Layanan Reservasi</h1>
              <button
                onClick={handleOpenReservasiCreate}
                className="inline-block bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 mb-6 shadow-md"
              >
                + Tambah Layanan Baru
              </button>

              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Judul Layanan
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nomor WhatsApp
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Template WhatsApp
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasiStatus === "loading" && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {reservasiStatus === "succeeded" &&
                      reservasi.map((item) => (
                        <tr key={item.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.judul}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.deskripsi_singkat}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.nomor_whatsapp}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.pesan_whatsapp}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              onClick={() => handleOpenReservasiEdit(item)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleReservasiDelete(item.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {reservasiStatus === "failed" && reservasiError && (
                <p className="mt-4 text-red-600">
                  {reservasiError?.message || "Terjadi kesalahan"}
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ===== Modal Form ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto"
            data-aos="zoom-in"
          >
            {/* WISATA FORM */}
            {activeTab === "wisata" && (
              <form onSubmit={handleWisataSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {modalMode === "create" ? "Tambah Wisata Baru" : "Edit Wisata"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                  >
                    &times;
                  </button>
                </div>

                {destinationFormStatus === "failed" && destinationError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {destinationError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama Wisata
                  </label>
                  <input
                    value={wisataName}
                    onChange={(e) => setWisataName(e.target.value)}
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={wisataDesc}
                    onChange={(e) => setWisataDesc(e.target.value)}
                    rows="5"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Lokasi
                  </label>
                  <input
                    value={wisataLocation}
                    onChange={(e) => setWisataLocation(e.target.value)}
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gambar
                  </label>
                  <input
                    onChange={loadWisataImage}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>

                {preview && (
                  <div className="mb-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-full max-w-xs h-auto rounded shadow-md"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={destinationFormStatus === "loading"}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:bg-teal-400"
                  >
                    {destinationFormStatus === "loading" ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}

            {/* USERS FORM */}
            {activeTab === "users" && (
              <form onSubmit={handleUserSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {modalMode === "create" ? "Tambah User Baru" : "Edit User"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                  >
                    &times;
                  </button>
                </div>

                {userFormStatus === "failed" && userError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {userError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama
                  </label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    type="email"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Role
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password {modalMode === "edit" ? "(opsional saat edit)" : ""}
                  </label>
                  <input
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    type="password"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    type="password"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={userFormStatus === "loading"}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:bg-teal-400"
                  >
                    {userFormStatus === "loading" ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}

            {/* NEWS FORM */}
            {activeTab === "news" && (
              <form onSubmit={handleNewsSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {modalMode === "create" ? "Tambah Berita Baru" : "Edit Berita"}
                  </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
                </div>

                {newsFormStatus === "failed" && newsError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {newsError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Judul Berita
                  </label>
                  <input
                    value={newsJudul}
                    onChange={(e) => setNewsJudul(e.target.value)}
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Konten Berita
                  </label>
                  <textarea
                    value={newsKonten}
                    onChange={(e) => setNewsKonten(e.target.value)}
                    rows="8"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gambar
                  </label>
                  <input
                    onChange={loadNewsImage}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>

                {preview && (
                  <div className="mb-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-full max-w-xs h-auto rounded shadow-md"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={newsFormStatus === "loading"}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:bg-teal-400"
                  >
                    {newsFormStatus === "loading" ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}

            {/* RESERVASI FORM */}
            {activeTab === "reservasi" && (
              <form onSubmit={handleReservasiSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {modalMode === "create" ? "Tambah Layanan Baru" : "Edit Layanan"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                  >
                    &times;
                  </button>
                </div>

                {reservasiFormStatus === "failed" && reservasiError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {reservasiError?.message || "Terjadi kesalahan"}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Judul Layanan
                  </label>
                  <input
                    value={reservasiJudul}
                    onChange={(e) => setReservasiJudul(e.target.value)}
                    type="text"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    value={reservasiDeskripsi}
                    onChange={(e) => setReservasiDeskripsi(e.target.value)}
                    rows="3"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nomor WhatsApp
                  </label>
                  <input
                    value={reservasiNomorWa}
                    onChange={(e) => setReservasiNomorWa(e.target.value)}
                    type="text"
                    placeholder="Contoh: 6281234567890"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Template Pesan WhatsApp
                  </label>
                  <textarea
                    value={reservasiPesanWa}
                    onChange={(e) => setReservasiPesanWa(e.target.value)}
                    rows="3"
                    placeholder="Gunakan {judul} untuk memasukkan judul"
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gambar
                  </label>
                  <input
                    onChange={loadReservasiImage}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>

                {preview && (
                  <div className="mb-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-full max-w-xs h-auto rounded shadow-md"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={reservasiFormStatus === "loading"}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:bg-teal-400"
                  >
                    {reservasiFormStatus === "loading" ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
