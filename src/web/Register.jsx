import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getBaseUrl } from '../utils/baseURL';

const Register = () => {
  const { register, isLoading } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  // Cảnh báo "email đã tồn tại" kiểm tra trực tiếp từ backend khi rời ô Email
  const [emailExists, setEmailExists] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  // Icon con mắt: hiện/ẩn mật khẩu cho từng ô riêng biệt
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      // Người dùng sửa email lại — xoá cảnh báo cũ để kiểm tra lại
      setEmailExists(false);
    }
  };

  // Kiểm tra email đã có tài khoản chưa (gọi backend khi rời ô Email)
  const handleEmailBlur = async () => {
    const email = formData.email.trim();
    if (!email) return;
    setEmailChecking(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setEmailExists(Boolean(data.exists));
        if (data.exists) {
          setErrorMsg('');
        }
      }
    } catch {
      // Không chặn luồng đăng ký nếu không kiểm tra được — submit sẽ vẫn báo lỗi từ backend
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên!');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Vui lòng nhập Email!');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Mật khẩu phải có ít nhất 4 ký tự!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu không trùng khớp!');
      return;
    }
    // Backend đã cảnh báo email tồn tại ngay khi gõ — chặn luôn, không gửi request thừa
    if (emailExists) {
      setErrorMsg('Tài khoản với email này đã tồn tại! Vui lòng đăng nhập hoặc dùng email khác.');
      return;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (res.success) {
      setSuccessInfo('Đăng ký thành công! Đang tự động chuyển hướng đến trang chủ...');

      showToast('Đăng ký thành công tài khoản khách hàng!');

      setTimeout(() => {
        navigate('/home');
      }, 900);
    } else {
      const backendMsg = res.message || '';
      const isDuplicate =
        backendMsg.includes('đã được đăng ký') ||
        backendMsg.includes('đã tồn tại') ||
        backendMsg.includes('already registered');

      if (isDuplicate) {
        // Tài khoản đã tồn tại — hiện thông báo riêng kèm đường dẫn đăng nhập
        setEmailExists(true);
        setErrorMsg('Tài khoản với email này đã tồn tại! Vui lòng đăng nhập hoặc dùng email khác.');
      } else {
        setErrorMsg(backendMsg || 'Đăng ký không thành công. Vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-nep-cream">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-3">
            <img src="/assets/leaf.svg" alt="Nếp Nem" width={36} height={36} />
            <span className="font-serif font-bold text-[32px] tracking-[-1.3px] text-nep-green">
              Nếp Nem
            </span>
          </Link>
          <h2 className="font-serif text-[26px] font-normal text-nep-ink tracking-tight">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-1 text-[13px] text-nep-muted">
            Tạo tài khoản khách hàng để mua nem, đặt combo và theo dõi đơn hàng
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-nep-line p-6 sm:p-8 shadow-xs">
          {/* Notification Banners */}
          {errorMsg && (
            <div
              className={`mb-5 p-3.5 rounded-xl text-[13px] flex items-start gap-2 ${
                emailExists
                  ? 'bg-[#fff7ed] border border-[#fdba74] text-[#9a3412]'
                  : 'bg-[#fff0f0] border border-[#f5c6c6] text-[#b91c1c]'
              }`}
            >
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 space-y-2">
                <span>{errorMsg}</span>
                {emailExists && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to={`/login?email=${encodeURIComponent(formData.email.trim())}`}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-nep-green text-nep-cream text-[12px] font-semibold hover:bg-[#203223] transition-colors"
                    >
                      Đăng nhập ngay →
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailExists(false);
                        setErrorMsg('');
                        setFormData((prev) => ({ ...prev, email: '' }));
                      }}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg border border-nep-line text-nep-ink text-[12px] font-medium hover:bg-nep-cream transition-colors"
                    >
                      Dùng email khác
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {successInfo && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-[13px] flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{successInfo}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div>
              <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                Họ và tên <span className="text-nep-rose">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn An"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
              />
            </div>

            {/* Email & Số điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                  Email <span className="text-nep-rose">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="name@example.com"
                  required
                  className={`w-full h-11 px-3.5 rounded-xl border bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none transition-colors ${
                    emailExists
                      ? 'border-[#fdba74] focus:border-[#fdba74]'
                      : 'border-nep-line focus:border-nep-green'
                  }`}
                />
                {/* Trạng thái kiểm tra email trực tiếp */}
                {emailChecking && (
                  <p className="mt-1.5 text-[11px] text-nep-muted flex items-center gap-1.5">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Đang kiểm tra email...
                  </p>
                )}
                {!emailChecking && emailExists && (
                  <div className="mt-1.5 p-2 rounded-lg bg-[#fff7ed] border border-[#fdba74]/60 text-[11px] leading-relaxed text-[#9a3412]">
                    <p className="font-semibold">Email này đã có tài khoản!</p>
                    <p>
                      Bạn có thể{' '}
                      <Link
                        to={`/login?email=${encodeURIComponent(formData.email.trim())}`}
                        className="font-semibold text-nep-green underline underline-offset-2"
                      >
                        đăng nhập ngay
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0900 000 128"
                  className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                />
              </div>
            </div>

            {/* Mật khẩu & Xác nhận mật khẩu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                  Mật khẩu <span className="text-nep-rose">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 4 ký tự"
                    required
                    className="w-full h-11 px-3.5 pr-11 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nep-muted hover:text-nep-ink transition-colors"
                  >
                    {/* Icon con mắt — mắt gạch chéo khi đang ẩn */}
                    {showPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6cA10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6c-.598 0-1.18.057-1.743.164" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                  Xác nhận mật khẩu <span className="text-nep-rose">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full h-11 px-3.5 pr-11 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nep-muted hover:text-nep-ink transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6cA10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6c-.598 0-1.18.057-1.743.164" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Gợi ý khớp mật khẩu khi đã hiện rõ */}
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1.5 text-[11px] text-nep-rose">Mật khẩu xác nhận chưa trùng khớp!</p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-nep-green hover:bg-[#203223] text-nep-cream text-[14px] font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Đang đăng ký tài khoản...</span>
                </>
              ) : (
                <span>Đăng ký tài khoản</span>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-nep-line text-center">
            <p className="text-[13px] text-nep-muted">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-nep-green hover:underline ml-1">
                Đăng nhập ngay →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

