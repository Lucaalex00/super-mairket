import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getColorLuminosity } from '../utils/colorUtils';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CarouselComponent({ products, categoryColors }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 2500 }}
      className="pb-10"
    >
      {products.map((product) => {
        const bgColor = categoryColors[product.category] || "#ffffff";
        const textColor = getColorLuminosity(bgColor) > 128 ? "text-black" : "text-white";

        return (
          <SwiperSlide key={product.id} className="mb-10">
            <div
              className={`rounded-xl overflow-hidden shadow hover:scale-105 transition h-full ${textColor}`}
              style={{ backgroundColor: bgColor }}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm">€{product.price.toFixed(2)}</p>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
