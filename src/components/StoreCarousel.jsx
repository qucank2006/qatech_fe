
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

export default function StoreCarousel({ images }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={true}
      spaceBetween={20}
      className="rounded-2xl overflow-hidden shadow-lg border border-neutral-800"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img}
            alt="store"
            className="w-full h-[320px] object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
