import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { IconShieldCheck, IconClock, IconStar } from '../components/Icons';

const About = () => {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero About */}
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block">
            Câu Chuyện Thương Hiệu
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Nem Chua Xứ Thanh - ZS Food
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Hành trình hơn 40 năm gìn giữ và nâng tầm hương vị nem chua truyền thống Thanh Hóa - đậm đà, giòn ngon, trọn vẹn phong vị quê hương.
          </p>
        </div>

        {/* Feature Image & Story */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs p-6 sm:p-10 space-y-8">
          <img 
            src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80"
            alt="Nghề làm nem truyền thống" 
            className="w-full h-72 sm:h-96 object-cover rounded-2xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-700 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-black text-stone-900 mb-3 text-red-800">
                1. Nguồn Gốc & Tâm Huyết Gia Truyền
              </h3>
              <p className="mb-3">
                Khởi nguồn từ một xưởng nem nhỏ gia đình tại TP. Thanh Hóa từ những năm 1985, ZS Food luôn kiên định với một triết lý: <strong>"Chỉ dùng thịt lợn tươi nóng dẻo mông loại một và ủ men tự nhiên trong lá chuối xanh"</strong>.
              </p>
              <p>
                Không chất bảo quản, không phẩm màu công nghiệp, màu hồng đào của nem là màu tự nhiên của thịt lợn tươi phản ứng lên men với thính gạo rang tay.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-stone-900 mb-3 text-emerald-800">
                2. Đột Phá Với Tính Năng Tùy Chỉnh Gia Vị
              </h3>
              <p className="mb-3">
                Thấu hiểu mỗi thực khách có một khẩu vị đặc trưng, ZS Food là thương hiệu tiên phong cho phép khách hàng <strong>tùy chỉnh lượng Tỏi, Ớt và Lá Đinh Lăng độc lập</strong> khi đặt nem.
              </p>
              <p>
                Đồng thời, chúng tôi lắng nghe thời gian dự kiến thưởng thức của bạn để chọn đúng mẻ nem vừa chua tới, giúp trải nghiệm ẩm thực luôn trọn vẹn nhất.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps of Quality Process */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-stone-900">Quy Trình Làm Nem Chuẩn 4 Bước</h2>
            <p className="text-xs text-stone-500 mt-1">Từ lò mổ buổi sớm đến bàn tiệc của bạn</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-2xl font-black text-red-700 block mb-2">01</span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Chọn Thịt & Da Lợn Sạch</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Thịt nạc mông tươi lấy lúc 4h sáng, lọc bỏ hoàn toàn mỡ và gân. Bì lợn cạo trắng tinh và thái chỉ đều tăm tắp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-2xl font-black text-amber-600 block mb-2">02</span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Xay & Phối Trộn Thính</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Xay lạnh để thịt không bị chín ép. Phối trộn cùng thính gạo rang vàng mịn và tiêu sọ đập dập thơm lừng.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700 block mb-2">03</span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Thêm Gia Vị & Gói Lá</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kẹp tỏi, ớt, lá đinh lăng theo đúng yêu cầu riêng của khách. Gói chặt trong 5-7 lớp lá chuối xanh tươi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-2xl font-black text-stone-700 block mb-2">04</span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Ủ Men Tự Nhiên & Giao Hàng</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Ủ nem ở nhiệt độ tiêu chuẩn 22-26°C trong 48-72h. Giao hỏa tốc khi nem vừa đạt độ chua giòn hoàn hảo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;

