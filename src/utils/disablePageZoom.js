/**
 * Chặn phóng to / thu nhỏ giao diện bằng 2 ngón tay trên điện thoại.
 *
 * - Thẻ meta viewport trong index.html xử lý phần lớn trình duyệt.
 * - Safari trên iOS bỏ qua `user-scalable=no`, nên cần chặn thêm sự kiện gesture.
 * - Chặn luôn thao tác chạm 2 ngón (một số trình duyệt Android cũ).
 * Vẫn giữ nguyên khả năng cuộn trang bình thường.
 */
export const disablePageZoom = () => {
  if (typeof window === 'undefined') return;

  const preventDefault = (event) => {
    if (event.cancelable) event.preventDefault();
  };

  // Safari iOS
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((name) => {
    document.addEventListener(name, preventDefault, { passive: false });
  });

  // Nhiều ngón tay cùng lúc (pinch) trên các trình duyệt còn lại
  document.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 1) preventDefault(event);
    },
    { passive: false }
  );

  // Nhấn đúp để zoom trên iOS cũ (bỏ qua nút bấm để không chặn thao tác)
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now();
      const interactive = event.target?.closest?.(
        'a, button, input, select, textarea, label, [role="button"]'
      );
      if (!interactive && now - lastTouchEnd <= 300 && event.cancelable) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );
};
