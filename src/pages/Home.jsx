import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import LogoLoop from "../components/LogoLoop";
import FadeContent from "../components/FadeContent";
import { techLogos } from "../data/logos";
import StoreCarousel from "../components/StoreCarousel";
import { storeImages } from "../data/storeImg";
import { LuTruck, LuShieldCheck, LuHeadphones } from "react-icons/lu";

/**
 * Trang chủ (Home Page)
 * Hiển thị: Hero section, giới thiệu, dịch vụ, sản phẩm nổi bật, đánh giá khách hàng, thương hiệu
 */
export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: products, status } = useSelector((state) => state.products);

  // Tải danh sách sản phẩm khi component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <div className="w-full flex flex-col items-center text-center">
      
      {/* Phần Hero - Giới thiệu chính */}
      <section
        className="
          relative w-full min-h-[85vh] flex flex-col justify-center items-center px-4
          bg-gradient-to-b from-[#0a0a0a] via-[#0b0d20] to-black
          -mt-[65px] pt-[65px]
        "
      >
        {/* Lớp phủ hiệu ứng nhiễu */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[url('/noise.png')]"></div>

        {/* Hiệu ứng ánh sáng phát quang */}
        <div className="
          absolute top-1/3 left-1/2 -translate-x-1/2
          w-[600px] h-[600px] rounded-full
          bg-[radial-gradient(circle,rgba(0,140,255,0.35),transparent_70%)]
          blur-3xl opacity-60
        ">
        </div>

        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Chào mừng đến với QATech
          </h1>
        </FadeContent>

        <FadeContent blur={false} duration={1000} easing="ease-out" initialOpacity={0} delay={400}>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Nền tảng mua sắm công nghệ hiện đại, tối ưu trải nghiệm và mang đến
            những sản phẩm chất lượng từ các thương hiệu hàng đầu thế giới.
          </p>
        </FadeContent>

        <FadeContent blur={false} duration={1000} easing="ease-out" initialOpacity={0} delay={800}>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20"
            >
              Mua ngay
            </Link>

            {!isAuthenticated && (
              <Link 
                to="/register"
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-xl font-semibold transition border border-neutral-700"
              >
                Đăng ký
              </Link>
            )}
          </div>
        </FadeContent>
      </section>

      {/* Phần giới thiệu về QATech */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-20 text-left">
        <FadeContent blur={false} threshold={0.2}>
          <div>
            <h2 className="text-3xl font-bold mb-4">QATech là gì?</h2>
            <p className="text-neutral-400 leading-relaxed mb-4">
              QATech là cửa hàng chuyên cung cấp thiết bị công nghệ như laptop, PC, màn hình 
              và phụ kiện chính hãng. Chúng tôi mang đến trải nghiệm mua sắm nhanh chóng, tiện lợi 
              cùng dịch vụ hỗ trợ tận tâm.
            </p>

            <p className="text-neutral-400 leading-relaxed mb-4">
              Tại QATech, mọi sản phẩm đều được kiểm duyệt kỹ lưỡng, đi kèm chế độ bảo
              hành rõ ràng cùng dịch vụ hỗ trợ tận tâm. Đội ngũ tư vấn luôn sẵn sàng đồng
              hành để bạn không phải lăn tăn về chất lượng hay giá cả.
            </p>

            <p className="text-neutral-400 leading-relaxed">
              QATech mang đến cảm giác mua sắm “đi trước thời đại” — nơi bạn có thể khám phá công nghệ
              mới nhất trong không gian trực quan, mượt mà và đầy cảm hứng.
            </p>
          </div>
        </FadeContent>

        <FadeContent blur={false} threshold={0.2} delay={200}>
          <div className="rounded-2xl bg-[#111] border border-neutral-800 p-2">
            <StoreCarousel images={storeImages.map(i => i.src)} />
          </div>
        </FadeContent>

      </section>

      {/* Phần lý do chọn QATech */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <FadeContent blur={false}>
          <h2 className="text-3xl font-bold mb-12">Tại sao chọn QATech?</h2>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: LuTruck, title: "Giao hàng nhanh", desc: "Nhanh chóng, đúng hẹn, hỗ trợ mọi nơi." },
            { icon: LuShieldCheck, title: "Sản phẩm chính hãng", desc: "Cam kết 100% chất lượng từ thương hiệu lớn." },
            { icon: LuHeadphones, title: "Hỗ trợ tận tâm", desc: "Có mặt 24/7 khi bạn cần." }
          ].map((item, index) => (
            <FadeContent key={index} delay={index * 400} blur={false}>
              <div className="p-6 bg-[#111] rounded-2xl border border-neutral-800 shadow-md hover:shadow-indigo-500/20 transition h-full">
                <item.icon className="text-indigo-400 w-10 h-10 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-400">{item.desc}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </section>
      
      {/* Phần sản phẩm nổi bật */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <FadeContent blur={false}>
          <h2 className="text-3xl font-bold mb-12">Sản phẩm nổi bật</h2>
        </FadeContent>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.slice(0, 4).map((product, i) => (
              <FadeContent key={product.id || i} delay={i * 100} blur={true}>
                <ProductCard product={product} />
              </FadeContent>
            ))
          ) : (
            <p className="text-neutral-400 col-span-full text-center">Đang cập nhật sản phẩm...</p>
          )}
        </div>
      </section>
      
      {/* Phần đánh giá của khách hàng */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <FadeContent blur={false}>
          <h2 className="text-3xl font-bold mb-12">Khách hàng nói gì về QATech?</h2>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            {
              name: "Lê Đức Hải",
              review: "Dịch vụ quá tuyệt! Laptop nhận nhanh, đóng gói kỹ và đúng như mô tả.",
            },
            {
              name: "Đỗ Lam",
              review: "Nhân viên tư vấn rất nhiệt tình, giúp mình chọn đúng chiếc PC phù hợp.",
            },
            {
              name: "Tô Văn Hiền",
              review: "Giá tốt, sản phẩm chính hãng. Sẽ ủng hộ thêm!",
            },
          ].map((item, i) => (
            <FadeContent key={i} delay={i * 300} blur={false}>
              <div 
                className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-md hover:shadow-indigo-500/20 transition h-full"
              >
                <p className="text-neutral-300 italic mb-4">“{item.review}”</p>
                <p className="text-neutral-500 text-sm">— {item.name}</p>
              </div>
            </FadeContent>
          ))}

        </div>
      </section>
      
      {/* Vòng lặp logo thương hiệu */}
      <section className="w-full max-w-6xl min-h-[120px] relative overflow-hidden py-10 mb-10">
        <FadeContent blur={false}>
          <h2 className="text-3xl font-bold mb-12">Các thương hiệu hàng đầu</h2>
        </FadeContent>

        <FadeContent delay={200} blur={true}>
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            fadeOut
            scaleOnHover
            ariaLabel="Tech Logos"
          />
        </FadeContent>
      </section>

      {/* Phần kêu gọi hành động (Call to Action) */}

      <section className="py-20 w-full text-center">
        <FadeContent blur={false}>
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng khám phá công nghệ mới?</h2>
          <p className="text-neutral-400 mb-8">Hàng ngàn sản phẩm đang chờ bạn.</p>
        </FadeContent>
        <FadeContent delay={500} blur={false}>
          <Link 
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20"
          >
            Xem sản phẩm
          </Link>
        </FadeContent>
      </section>

    </div>
  );
}
