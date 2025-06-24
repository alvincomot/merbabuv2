import Aos from "aos";
import "aos/dist/aos.css";
import MainLayouts from "../components/layouts/MainLayouts";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div>
      <MainLayouts>
        <section id="home">
          <div className="relative w-full">
            <div className="space-y-4 md:space-y-8">
              <img src="/raw/main.png" className="w-full h-145 object-cover object-bottom rounded" alt=""/>
              <div data-aos="fade-up" data-aos-duration="1300" className="absolute bottom-0 left-0 p-4 md:p-8">
                <h1 className="text-white text-3xl md:text-5xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                  Dusun Cuntel
                </h1>
                <div className="py-5">
                  <p className="text-white">
                    Cuntel, sebuah nama dalam bahasa Jawa yang berarti "ujung"
                    atau "penghabisan," adalah nama sebuah
                    <span className="block">
                      dusun di lereng utara Gunung Merbabu. Terletak strategis
                      di Desa Kopeng, Getasan, Kabupaten Semarang, Jawa Tengah,{" "}
                      <span className="block">
                        {" "}
                        Dusun Cuntel menawarkan beberapa perpaduan antara
                        ketenangan alam pegunungan yang asri dan udara sejuk
                        yang menyegarkan.
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-aos="zoom-in" data-aos-duration="500">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-semibold">
              <span className="text-3xl text-black">D</span>usun Cuntel adalah
              sebuah "Hidden Gem" yang terletak di lereng utara Gunung Merbabu.
              Secara administratif, Cuntel berada di Desa Kopeng, Kecamatan
              Getasan, Kabupaten Semarang, Jawa Tengah. Nama "Cuntel" sendiri
              dalam bahasa Jawa berarti "ujung" atau "penghabisan", yang sangat
              sesuai dengan lokasinya sebagai kampung terakhir di jalur beraspal
              sebelum jalan setapak menuju puncak Gunung Merbabu. Awalnya
              dikenal sebagai salah satu pos dan jalur pendakian Gunung Merbabu,
              Dusun Cuntel kini telah berkembang menjadi destinasi wisata yang
              menawarkan beragam pengalaman, dari alam hingga agrowisata, cafe
              dan glamping.
            </p>
          </div>
        </section>

        <section data-aos="fade-right" data-aos-duration="1300">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
              <div>
                <img src="/raw/view_gardupandang.png" className="rounded" alt=""/>
              </div>

              <div>
                <div className="max-w-lg md:max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
                    Experiences
                  </h1>

                  <p className="mt-4 text-gray-700">
                    Terletak di lereng utara Gunung Merbabu, Cuntel menawarkan
                    pemandangan pegunungan di sisi utara dan barat (seperti
                    Gunung Telomoyo, Andong, Ungaran, Sindoro, dan Sumbing),
                    serta Rawa Pening di sisi timur. Walaupun sedang tidak
                    ber-operasi, inilah salah satu alasan mengapa Jalur
                    Pendakian Cuntel menjadi jalur resmi dan populer untuk
                    mendaki Gunung Merbabu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-aos="fade-right" data-aos-duration="1300">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
              <div className="order-last md:order-none">
                <div className="max-w-lg md:max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
                    Camping dan Glamping
                  </h1>
                  <p className="mt-4 text-gray-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tenetur doloremque saepe architecto maiores repudiandae amet
                    perferendis repellendus, reprehenderit voluptas sequi.
                  </p>
                </div>
              </div>

              <div className="order-first md:order-none">
                <img src="/raw/view_360.png" className="rounded w-full h-auto" alt=""/>
              </div>
            </div>
          </div>
        </section>

        <section data-aos="fade-right" data-aos-duration="1300">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
              <div>
                <img src="/raw/view_gunungsari.png" className="rounded" alt=""/>
              </div>

              <div>
                <div className="max-w-lg md:max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
                    Lorem
                  </h1>

                  <p className="mt-4 text-gray-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tenetur doloremque saepe architecto maiores repudiandae amet
                    perferendis repellendus, reprehenderit voluptas sequi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MainLayouts>
    </div>
  );
};

export default Home;
