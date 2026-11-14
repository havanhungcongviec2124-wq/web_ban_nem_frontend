/**
 * Nội dung tĩnh của website Nếp Nem.
 * Đây là nội dung giao diện cố định (thông tin liên hệ, câu hỏi thường gặp, bài viết giới thiệu)
 * — KHÔNG phải dữ liệu giả lập.
 *
 * Dữ liệu động (sản phẩm, combo, danh mục, đơn hàng, tài khoản người dùng)
 * luôn được lấy từ Backend API, không dùng dữ liệu mẫu.
 */

export const STORE_INFO = {
  name: 'Nếp Nem',
  shortName: 'Nếp Nem',
  slogan: 'Gói vị quê. Mở sum vầy.',
  hotline: '0936 993 543',
  zalo: '0936 993 543',
  email: 'chao@nepnem.example',
  address: 'Một nếp nhà nhỏ, gửi vị thân quen đến bàn ăn của bạn',
  branches: [],
  workingHours: '07:00 - 22:00',
};

export const FAQS = [
  {
    q: 'Nem nhận về dùng ngay được không?',
    a: 'Tùy thời điểm ủ và lịch nhận. Nếp sẽ ghi hướng dẫn theo từng mẻ; hãy kiểm tra nhãn trước khi dùng.',
  },
  {
    q: 'Bảo quản nem như thế nào?',
    a: 'Bảo quản lạnh 0–4°C khi nem đạt độ chua mong muốn. Dùng theo hạn ghi trên nhãn; nem rán cần làm chín trước khi ăn.',
  },
  {
    q: 'Combo có chọn gia vị riêng không?',
    a: 'Có. Từng sản phẩm trong combo có đủ Tỏi, Ớt, Đinh lăng với hai mức Ít / Nhiều.',
  },
  {
    q: 'Ngày dùng có phải ngày giao không?',
    a: 'Không. Ngày, giờ sử dụng giúp Nếp tư vấn lịch giao; lịch giao được xác nhận riêng với bạn.',
  },
];

export const BLOG_POSTS = [
  {
    id: 'chuyen-nep-nem',
    title: 'Giữ nếp gói. Gửi vị thân quen.',
    summary: 'Với Nếp, nem ngon không chỉ ở vị chua dịu hay lớp lá thơm. Đó còn là sự chỉn chu trong từng phần nhỏ.',
    date: '09/11/2026',
    readTime: '4 phút đọc',
    image: '/assets/story.png',
    category: 'Chuyện nhà Nếp',
  },
];
