/**
 * Giảm khả năng người dùng thường mở công cụ xem mã nguồn trên trình duyệt.
 *
 * Lưu ý: đây chỉ là lớp cản trở. Mã JavaScript chạy trên trình duyệt luôn có thể
 * bị tải về và phân tích bởi người có kiến thức; không có cách nào chặn tuyệt đối.
 * Những gì thực sự cần bảo mật (mật khẩu DB, JWT_SECRET...) phải nằm ở backend.
 */
export const blockDevtools = () => {
  // Ở chế độ phát triển vẫn cho phép dùng devtools để làm việc.
  if (import.meta.env.DEV) return;

  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  // Chuột phải (menu ngữ cảnh có "Xem nguồn trang" / "Inspect")
  const onContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
  document.addEventListener('contextmenu', onContextMenu, true);
  window.addEventListener('contextmenu', onContextMenu, true);

  // Phím tắt mở devtools / xem mã nguồn.
  // Dùng cả Ctrl (Windows/Linux) và Cmd (macOS) để chặn trên mọi hệ điều hành.
  const onKeyDown = (event) => {
    const key = String(event.key || '').toLowerCase();

    // F12, phím menu ngữ cảnh, Shift + F10
    if (key === 'f12' || key === 'contextmenu' || key === 'apps') return stop(event);
    if (event.shiftKey && key === 'f10') return stop(event);

    const mod = event.ctrlKey || event.metaKey;
    if (!mod) return true;

    // Ctrl/Cmd + Shift + I / J / C / K  và  Cmd + Option + I / J / C / K
    if ((event.shiftKey || event.altKey) && ['i', 'j', 'c', 'k'].includes(key)) {
      return stop(event);
    }

    // Ctrl/Cmd + U (xem mã nguồn) và Ctrl/Cmd + S (lưu trang)
    if (['u', 's'].includes(key)) return stop(event);

    return true;
  };
  document.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keydown', onKeyDown, true);

  // Kéo thả tệp vào trang có thể mở nội dung tệp — không cần cho trang bán hàng.
  document.addEventListener('dragover', (event) => event.preventDefault(), true);
  document.addEventListener('drop', (event) => event.preventDefault(), true);
};
