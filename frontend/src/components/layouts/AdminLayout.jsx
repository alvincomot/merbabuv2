import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1">
        <aside className="flex flex-col w-64 bg-white border-r p-5">
          <div className="flex flex-col justify-between flex-1">
            <nav className="space-y-6">
              <div className="space-y-3">
                <label className="px-3 text-xs text-gray-500 uppercase">General</label>
                <Link to="/admin/users" className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                  <span className="mx-2 text-sm font-medium">Users</span>
                </Link>
              </div>
              <div className="space-y-3">
                <label className="px-3 text-xs text-gray-500 uppercase">Content</label>
                <Link to="/dashboard" className="flex items-center px-3 py-2 text-white bg-teal-600 transition-colors duration-300 transform rounded-lg">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7.4285 11 5-6 5 6m-10 0h-3v8h16v-8h-3m-10 0H3.42851l3-4h4.33739l-3.3374 4Zm10 0V7.5m-3 5.5c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2Zm3-8v3h4V5h-4Z"/></svg>
                  <span className="mx-2 text-sm font-medium">Informasi Wisata</span>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;