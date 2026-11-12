// Địa chỉ backend production (Cloudflare Worker)
const PRODUCTION_API_URL = "https://nepnem.havanhungcongviec2124.workers.dev";

const isLocalUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(url);

export const getBaseUrl = () => {
    const envUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

    // Khi build production: không bao giờ dùng localhost, kể cả khi biến môi trường
    // bị thiếu hoặc bị đặt sai (ví dụ .env còn trỏ localhost).
    if (import.meta.env.PROD) {
        if (envUrl && !isLocalUrl(envUrl)) return envUrl;
        return PRODUCTION_API_URL;
    }

    return envUrl || "http://localhost:5000";
};
