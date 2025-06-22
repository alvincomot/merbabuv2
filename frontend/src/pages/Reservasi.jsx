import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservasi } from '@/features/reservasi/reservasiSlice';
import MainLayouts from '@/components/layouts/MainLayouts';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Reservasi = () => {
    const dispatch = useDispatch();
    const { items: layanan, status } = useSelector(state => state.reservasi);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        if (status === 'idle') dispatch(fetchReservasi());
    }, [status, dispatch]);

    const handleBooking = (nomor, pesan, judul) => {
        // Ganti placeholder {judul} dengan judul layanan sebenarnya
        const finalPesan = pesan.replace('{judul}', judul);
        const encodedPesan = encodeURIComponent(finalPesan);
        const whatsappUrl = `https://wa.me/${nomor}?text=${encodedPesan}`;
        window.open(whatsappUrl, '_blank'); // Buka di tab baru
    };

    return (
        <MainLayouts>
            <section className="bg-white py-16">
                <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-down">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Layanan & Reservasi</h1>
                        <p className="mt-4 max-w-xl mx-auto text-gray-600">Pilih layanan yang Anda inginkan dan hubungi kami untuk melakukan pemesanan.</p>
                    </div>

                    <div className="space-y-8">
                        {status === 'loading' && <p className="text-center">Memuat layanan...</p>}
                        {status === 'succeeded' && layanan.map((item, index) => (
                            <div key={item.id} data-aos="fade-up" data-aos-delay={index * 100} className="sm:flex items-center gap-6 p-4 bg-gray-50 rounded-xl shadow-sm border">
                                <img src={item.image} alt={item.judul} className="w-full sm:w-1/3 h-48 object-cover rounded-lg" />
                                <div className="mt-4 sm:mt-0 flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800">{item.judul}</h3>
                                    <p className="mt-2 text-gray-600">{item.deskripsi_singkat}</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <button 
                                        onClick={() => handleBooking(item.nomor_whatsapp, item.pesan_whatsapp, item.judul)}
                                        className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayouts>
    );
};

export default Reservasi;