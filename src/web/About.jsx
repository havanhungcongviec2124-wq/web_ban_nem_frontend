import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../components/NepUI';

const About = () => {
  return (
    <div className="bg-nep-cream">
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center p-4 sm:p-8 lg:p-[72px]">
        <div className="flex-1 w-full">
          <img src="/assets/story.png" alt="Nếp gói thủ công" className="w-full h-[280px] sm:h-[440px] object-cover rounded-xl" />
        </div>
        <div className="flex-1 space-y-5">
          <Eyebrow>Chuyện nhà Nếp</Eyebrow>
          <h1 className="font-serif font-semibold text-[36px] sm:text-[48px] leading-[1.3] tracking-[-0.6px]">
            Giữ nếp gói.<br />Gửi vị thân quen.
          </h1>
          <p className="text-[14px] leading-[1.6] text-nep-muted">
            Với Nếp, nem ngon không chỉ ở vị chua dịu hay lớp lá thơm. Đó còn là sự chỉn chu trong từng phần nhỏ, để món ăn quen thuộc trở thành một lời mời ngồi lại bên nhau.
          </p>
          <p className="text-[14px] leading-[1.6] text-nep-muted">
            Chúng tôi chọn cách kể chuyện bằng món ăn: thành phần rõ ràng, gia vị theo ý và hướng dẫn thưởng thức dễ hiểu.
          </p>
        </div>
      </section>

      <section className="bg-nep-mint px-4 sm:px-8 lg:px-[72px] py-16 space-y-8">
        <div className="space-y-2.5">
          <Eyebrow>Ba điều Nếp giữ</Eyebrow>
          <h2 className="font-serif font-semibold text-[32px] sm:text-[36px] leading-[1.3] tracking-[-0.6px]">
            Gói kỹ. Chọn vị. Đúng dịp.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '01', t: 'Gói kỹ từng phần', d: 'Quy cách, thành phần luôn rõ ràng — để bạn biết mình đang mang gì về bàn.' },
            { n: '02', t: 'Vừa khẩu vị bạn', d: 'Tỏi, Ớt, Đinh lăng: Ít hoặc Nhiều. Nếp ghi rõ đến tận từng phần hàng.' },
            { n: '03', t: 'Đúng dịp sum vầy', d: 'Bạn báo ngày dùng. Nếp tư vấn lịch giao phù hợp, không hứa suông giờ ship.' },
          ].map((s) => (
            <div key={s.n} className="bg-nep-cream rounded-xl p-6 space-y-3">
              <p className="font-serif text-[32px] text-nep-green">{s.n}</p>
              <p className="text-[14px] font-semibold">{s.t}</p>
              <p className="text-[12px] leading-[1.6] text-nep-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-[72px] py-16 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="font-serif font-semibold text-[28px] leading-[1.3]">Muốn ngồi lại bên một gói nem?</p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center min-h-12 px-[22px] rounded-lg bg-nep-rose text-white text-[14px] font-semibold"
        >
          Chọn món ngon →
        </Link>
      </section>
    </div>
  );
};

export default About;
