import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Login = () => {
  const { login, isLoading } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Xử lý gửi form đăng nhập
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessInfo(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Tên tài khoản!');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập Mật khẩu!');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const role = res.user.role;
      const destination = role === 'admin' ? '/admin' : '/home';
      const roleTitle = role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng (User)';

      setSuccessInfo({
        roleTitle,
        destination,
        message: `Đăng nhập thành công! Vai trò: ${roleTitle}. Đang chuyển hướng...`,
      });

      showToast(`Đăng nhập thành công (${roleTitle})!`);

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          const searchParams = new URLSearchParams(location.search);
          const redirect = searchParams.get('redirect');
          navigate(redirect || '/home');
        }
      }, 700);
    } else {
      setErrorMsg(res.message || 'Email hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-nep-cream">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-3">
            <img src="/assets/leaf.svg" alt="Nếp Nem" width={36} height={36} />
            <span className="font-serif font-bold text-[32px] tracking-[-1.3px] text-nep-green">
              Nếp Nem
            </span>
          </Link>
          <h2 className="font-serif text-[26px] font-normal text-nep-ink tracking-tight">
            Đăng nhập tài khoản
          </h2>
          <p className="mt-1 text-[13px] text-nep-muted">
            Hệ thống phân quyền tự động theo vai trò của tài khoản
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
            <div>
              <label className="block text-[13px] font-medium text-nep-ink mb-1.5">
                Email hoặc Tên tài khoản
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nepnem.vn hoặc email của bạn"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-nep-ink">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => alert('Vui lòng liên hệ quản trị viên hoặc dùng tài khoản mẫu để đăng nhập!')}
                  className="text-[12px] text-nep-green hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full h-11 pl-3.5 pr-11 rounded-xl border border-nep-line bg-white text-[14px] text-nep-ink placeholder:text-nep-muted focus:outline-none focus:border-nep-green transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nep-muted hover:text-nep-ink text-[12px]"
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            {/* Note about role redirect */}
            <div className="p-3 rounded-xl bg-nep-cream/60 border border-nep-line/60 text-[12px] text-nep-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-nep-green"></span>
                <span><strong>Role = Admin:</strong> Tự động chuyển tới <code>/admin</code></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-nep-rose"></span>
                <span><strong>Role = User:</strong> Tự động chuyển tới <code>/home</code></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-nep-green hover:bg-[#203223] text-nep-cream text-[14px] font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Đang xử lý đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-nep-line text-center">
            <p className="text-[13px] text-nep-muted">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-semibold text-nep-rose hover:underline ml-1">
                Đăng ký tài khoản mới →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
