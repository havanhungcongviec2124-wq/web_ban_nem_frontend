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
  document.addEventListener('contextmenu', stop, true);

  // Phím tắt mở devtools / xem mã nguồn.
  // Dùng cả Ctrl (Windows/Linux) và Cmd (macOS) để chặn trên mọi hệ điều hành.
  document.addEventListener(
    'keydown',
    (event) => {
      const key = String(event.key || '').toLowerCase();

      // F12
      if (key === 'f12') return stop(event);

      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return true;

      // Ctrl/Cmd + Shift + I / J / C / K  và  Cmd + Option + I / J / C / K
      if ((event.shiftKey || event.altKey) && ['i', 'j', 'c', 'k'].includes(key)) {
        return stop(event);
      }

      // Ctrl/Cmd + U (xem mã nguồn) và Ctrl/Cmd + S (lưu trang)
      if (['u', 's'].includes(key)) return stop(event);

      return true;
    },
    true
  );

  // Kéo thả tệp vào trang có thể mở nội dung tệp — không cần cho trang bán hàng.
  document.addEventListener('dragover', (event) => event.preventDefault(), true);
  document.addEventListener('drop', (event) => event.preventDefault(), true);
};
