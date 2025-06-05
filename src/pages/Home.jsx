import Aos from "aos";
import "aos/dist/aos.css";
import MainLayouts from '../components/layouts/MainLayouts'
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div>
      <MainLayouts>
      <section id="home">
        <div className="w-full">
          <div className="space-y-4 md:space-y-8">
            <img
              src="/top-footage.png"
              className="w-full h-145 object-cover object-bottom rounded"
              alt=""
            />
            <div className="absolute bottom-0 left-0 p-4 md:p-8">
              <h1 className="text-white text-3xl md:text-5xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                Desa Cuntel
              </h1>
              <div className="py-5">
                <p className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est maiores reiciendis adipisci,<span className="block">quaerat nesciunt suscipit tempore labore magnam quo deserunt totam sequi molestias, neque unde repellat reprehenderit ipsum ratione debitis.</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-aos="zoom-in">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <p>
            <span className="text-3xl text-black">L</span>orem ipsum, dolor sit
            amet consectetur adipisicing elit. Libero at suscipit cupiditate
            excepturi reiciendis illo, nostrum asperiores perspiciatis culpa eum
            dolores sint ad sequi provident nobis! Quidem provident consequuntur
            aliquam molestiae quos cum voluptatum deserunt, dignissimos vero
            perspiciatis magnam architecto ipsum accusamus nisi, officia odit
            placeat minima commodi sint repudiandae. Assumenda consectetur
            asperiores excepturi libero, cumque ipsum aspernatur sint esse velit
            vero neque dolorum, facilis saepe veniam amet et animi obcaecati
            itaque debitis iure dolore perspiciatis delectus natus? Illum
            repudiandae iure nostrum porro. Vitae officia vel quidem laborum
            reiciendis, distinctio delectus! Rerum voluptatem molestiae suscipit
            corrupti consectetur magni ipsum fugit, libero enim, eveniet laborum
            in eligendi sapiente molestias laudantium voluptatibus perspiciatis!
            Hic quidem alias similique, perspiciatis ea ab incidunt. Molestias
            quod at tenetur expedita, sed adipisci quas nostrum similique
            exercitationem.
          </p>
        </div>
      </section>

      <section data-aos="fade-right">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <img
                src="../src/assets/home-images/footage1.png"
                className="rounded"
                alt=""
              />
            </div>

            <div>
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>

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

      <section data-aos="fade-right">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div className="order-last md:order-none">
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>
                <p className="mt-4 text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tenetur doloremque saepe architecto maiores repudiandae amet
                  perferendis repellendus, reprehenderit voluptas sequi.
                </p>
              </div>
            </div>

            <div className="order-first md:order-none">
              <img
                src="../src/assets/home-images/footage1.png"
                className="rounded w-full h-auto"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <section data-aos="fade-right">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <img
                src="../src/assets/home-images/footage1.png"
                className="rounded"
                alt=""
              />
            </div>

            <div>
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>

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
}

export default Home;
