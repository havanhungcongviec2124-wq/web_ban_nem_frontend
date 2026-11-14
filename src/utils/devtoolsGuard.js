/**
 * Che trang khi phát hiện DevTools đang mở (dạng dock cạnh/cửa sổ).
 *
 * Đây là lớp cản trở trực quan, KHÔNG bảo vệ được mã đã tải về máy người dùng:
 * ai mở DevTools thì mã JS đã nằm trong trình duyệt họ rồi. Mã đã được làm rối
 * ở bước build để khó đọc. DevTools mở dạng cửa sổ rời cũng không phát hiện được.
 */
export const devtoolsGuard = () => {
  if (import.meta.env.DEV) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Bỏ qua thiết bị cảm ứng (điện thoại/tablet thường không có DevTools dạng dock)
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'display:none',
    'align-items:center',
    'justify-content:center',
    'padding:24px',
    'background:#fffdf8',
    'color:#3d2b1f',
    'font-family:system-ui,-apple-system,"Segoe UI",sans-serif',
    'text-align:center',
  ].join(';');
  overlay.innerHTML = `
    <div style="max-width:420px">
      <p style="margin:0 0 8px;font-size:20px;font-weight:600">Trang được bảo vệ</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#7a6a5c">
        Vui lòng đóng công cụ kiểm tra của trình duyệt để tiếp tục xem nội dung.
      </p>
    </div>
  `;

  const sync = () => {
    if (!overlay.isConnected) document.documentElement.appendChild(overlay);

    // Khoảng chênh giữa cửa sổ trình duyệt và vùng hiển thị trang.
    // Thanh địa chỉ/tab thường chỉ ~80–150px; DevTools dock chiếm nhiều hơn.
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    const isOpen = widthGap > 220 || heightGap > 220;

    overlay.style.display = isOpen ? 'flex' : 'none';
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  };

  sync();
  window.addEventListener('resize', sync);
  window.setInterval(sync, 1000);
};
