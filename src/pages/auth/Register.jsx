import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { registerUser, resetAuth } from "@/features/auth/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const dispatch = useDispatch();
  const { formStatus, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (formStatus === "loading") return;

    if (password !== confPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    // sesuaikan dengan backend kamu (kamu sebelumnya kirim confPassword)
    dispatch(registerUser({ name, email, password, confPassword }));
  };

  if (formStatus === "succeeded") {
    return (
      <section className="bg-gray-50">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-teal-600">Registrasi Berhasil!</h2>
            <p className="mt-4 text-gray-600">
              Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.
            </p>
            <Link
              to="/login"
              className="w-full mt-6 inline-block px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
            >
              Ke Halaman Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md"
        >
          <div className="flex justify-center mx-auto">
            <svg className="h-10 text-teal-600" viewBox="0 0 28 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z" />
            </svg>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-center text-gray-800">Create Account</h2>

          {formStatus === "failed" && error && (
            <p className="mt-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Email address"
              autoComplete="email"
              required
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              type="password"
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mt-6">
            <button
              disabled={formStatus === "loading"}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-50 disabled:bg-teal-400"
            >
              {formStatus === "loading" ? "Registering..." : "Sign Up"}
            </button>

            <div className="mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-sm text-teal-600 hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          {formStatus === "failed" && error && (
            <p className="mt-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Register;
