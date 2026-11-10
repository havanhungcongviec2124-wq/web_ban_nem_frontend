import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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
    role: 'user', // 'user' hoặc 'admin'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo(null);

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

    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    });

    if (res.success) {
      const isRoleAdmin = formData.role === 'admin';
      const roleTitle = isRoleAdmin ? 'Quản trị viên (Admin)' : 'Khách hàng (User)';
      const targetPath = isRoleAdmin ? '/admin' : '/home';

      setSuccessInfo({
        roleTitle,
        targetPath,
        message: `Đăng ký thành công! Vai trò: ${roleTitle}. Đang tự động chuyển hướng đến ${targetPath}...`,
      });

      showToast(`Đăng ký thành công tài khoản ${roleTitle}!`);

      setTimeout(() => {
        if (isRoleAdmin) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }, 900);
    } else {
      setErrorMsg(res.message || 'Đăng ký không thành công. Vui lòng thử lại!');
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
            Chọn vai trò phù hợp: Admin đi tới trang Quản trị, Khách hàng đi tới Trang chủ
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-nep-line p-6 sm:p-8 shadow-xs">
          {/* Notification Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#fff0f0] border border-[#f5c6c6] text-[#b91c1c] text-[13px] flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-[13px] flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{successInfo.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lựa chọn vai trò (Role Selector) */}
            <div>
              <label className="block text-[13px] font-medium text-nep-ink mb-2">
                Chọn vai trò tài khoản <span className="text-nep-rose">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('user')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.role === 'user'
                      ? 'border-nep-rose bg-[#fff7f5] ring-1 ring-nep-rose'
                      : 'border-nep-line bg-white hover:bg-nep-cream/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-nep-ink flex items-center gap-1.5">
                      <span>👤</span> Khách hàng
                    </span>
                    {formData.role === 'user' && (
                      <span className="w-4 h-4 rounded-full bg-nep-rose text-white text-[10px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-nep-muted mt-1 leading-snug">
                    Mua nem, đặt combo, xem giỏ hàng
                  </p>
                  <p className="text-[10px] text-nep-rose font-medium mt-1">
                    → Đích đến: Trang chủ (/home)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.role === 'admin'
                      ? 'border-nep-green bg-[#eef3e8] ring-1 ring-nep-green'
                      : 'border-nep-line bg-white hover:bg-nep-cream/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-nep-ink flex items-center gap-1.5">
                      <span>🛡️</span> Quản trị viên
                    </span>
                    {formData.role === 'admin' && (
                      <span className="w-4 h-4 rounded-full bg-nep-green text-white text-[10px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-nep-muted mt-1 leading-snug">
                    Quản lý đơn hàng, cấu hình combo
                  </p>
                  <p className="text-[10px] text-nep-green font-medium mt-1">
                    → Đích đến: Quản trị (/admin)
                  </p>
                </button>
              </div>
            </div>

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
                  placeholder="name@example.com"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                />
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
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 4 ký tự"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                  Xác nhận mật khẩu <span className="text-nep-rose">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                />
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

