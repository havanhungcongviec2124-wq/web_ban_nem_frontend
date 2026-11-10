/**
 * Mock data tài khoản người dùng cho Nếp Nem (Fake data giả lập đăng ký / đăng nhập)
 */

export const AUTH_ACCOUNTS = [
  // --- TÀI KHOẢN QUẢN TRỊ VIÊN (ROLE: ADMIN) ---
  {
    id: "usr_admin_01",
    name: "Quản trị viên Nếp Nem",
    email: "admin@nepnem.vn",
    phone: "0987654321",
    password: "admin", // Hỗ trợ mật khẩu: "admin" hoặc "123456"
    role: "admin",
    avatar: "/assets/user.svg",
    title: "Chủ cửa hàng & Điều hành",
    note: "Toàn quyền quản lý đơn hàng, danh mục và combo.",
  },
  {
    id: "usr_admin_02",
    name: "An Nguyễn (Quản lý kho)",
    email: "quanly@nepnem.vn",
    phone: "0912345678",
    password: "admin",
    role: "admin",
    avatar: "/assets/user.svg",
    title: "Quản lý kho & Đơn hàng",
    note: "Phụ trách xử lý đơn hàng và cấu hình gia vị.",
  },

  // --- TÀI KHOẢN KHÁCH HÀNG (ROLE: USER) ---
  {
    id: "usr_user_01",
    name: "Nguyễn Thùy Linh",
    email: "khachhang@nepnem.vn",
    phone: "0900000128",
    password: "user", // Hỗ trợ mật khẩu: "user" hoặc "123456"
    role: "user",
    avatar: "/assets/user.svg",
    address: "24 ngõ Hoa, Bồ Đề, Long Biên, Hà Nội",
    note: "Khách quen đặt nem cho gia đình dịp cuối tuần.",
  },
  {
    id: "usr_user_02",
    name: "Trần Quốc Bảo",
    email: "customer@gmail.com",
    phone: "0912000555",
    password: "123456",
    role: "user",
    avatar: "/assets/user.svg",
    address: "Số 88 Cầu Giấy, Hà Nội",
    note: "Khách hàng thân thiết.",
  },
  {
    id: "usr_user_03",
    name: "Lê Thu Hương",
    email: "huong.le@example.com",
    phone: "0934111222",
    password: "123456",
    role: "user",
    avatar: "/assets/user.svg",
    address: "120 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    note: "Thích vị nem nhiều tỏi, ít ớt.",
  },
];

// Danh sách tài khoản demo hiển thị trên trang đăng nhập
export const DEMO_CREDENTIALS = {
  admin: {
    label: "Quản trị viên (Admin)",
    email: "admin@nepnem.vn",
    password: "admin",
    role: "admin",
    badge: "Chuyển hướng đến /admin",
  },
  user: {
    label: "Khách hàng (User)",
    email: "khachhang@nepnem.vn",
    password: "user",
    role: "user",
    badge: "Chuyển hướng đến /home",
  },
};

/**
 * Lấy danh sách tài khoản đã lưu từ localStorage, nếu chưa có thì nạp AUTH_ACCOUNTS
 */
export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem("nep_all_users");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Lỗi đọc danh sách user:", e);
  }
  // Mặc định lưu danh sách gốc vào localStorage
  try {
    localStorage.setItem("nep_all_users", JSON.stringify(AUTH_ACCOUNTS));
  } catch (e) {}
  return AUTH_ACCOUNTS;
};

/**
 * Lưu danh sách tài khoản vào localStorage
 */
export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem("nep_all_users", JSON.stringify(users));
  } catch (e) {
    console.error("Lỗi lưu user:", e);
  }
};


export const authenticateMockUser = (emailOrUsername, password) => {
  const users = getStoredUsers();
  const cleanInput = (emailOrUsername || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();

  const found = users.find((u) => {
    const uEmail = (u.email || "").toLowerCase();
    const uPhone = (u.phone || "").toLowerCase();

    // Khớp email, số điện thoại, hoặc từ khóa tắt như 'admin' / 'user'
    const identityMatch =
      uEmail === cleanInput ||
      uPhone === cleanInput ||
      (cleanInput === "admin" && u.role === "admin") ||
      (cleanInput === "user" && u.role === "user");

    // Khớp mật khẩu
    const passwordMatch =
      u.password === cleanPass ||
      cleanPass === "123456" ||
      (cleanPass === "admin" && u.role === "admin") ||
      (cleanPass === "user" && u.role === "user");

    return identityMatch && passwordMatch;
  });

  return found || null;
};

