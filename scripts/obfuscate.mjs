/**
 * Làm rối (obfuscate) JavaScript sau khi Vite build.
 *
 * Mục đích: làm mã nguồn phía trình duyệt khó đọc/hiểu hơn khi ai đó mở devtools
 * hoặc tải file .js về. Đây chỉ là lớp cản trở — không thể chặn tuyệt đối việc
 * tải mã frontend, nên mọi thông tin nhạy cảm vẫn phải nằm ở backend.
 */
import fs from 'node:fs';
import path from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const assetsDir = path.resolve('dist/assets');

if (!fs.existsSync(assetsDir)) {
  console.error('[obfuscate] Không tìm thấy dist/assets — hãy chạy vite build trước.');
  process.exit(1);
}

// Không bao giờ xuất bản source map.
for (const file of fs.readdirSync(assetsDir)) {
  if (file.endsWith('.map')) {
    fs.rmSync(path.join(assetsDir, file), { force: true });
  }
}

const jsFiles = fs
  .readdirSync(assetsDir)
  .filter((file) => file.endsWith('.js') && !file.endsWith('.map'));

const options = {
  target: 'browser',
  compact: true,
  // Giữ hiệu năng: bỏ các kỹ thuật làm chậm trang (control flow flattening, dead code)
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  selfDefending: false,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  simplify: true,
  numbersToExpressions: false,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: false,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: false,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.6,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  log: false,
};

let changed = 0;

for (const file of jsFiles) {
  const filePath = path.join(assetsDir, file);
  const source = fs.readFileSync(filePath, 'utf8');

  const result = JavaScriptObfuscator.obfuscate(source, options);
  fs.writeFileSync(filePath, result.getObfuscatedCode(), 'utf8');

  const before = Buffer.byteLength(source, 'utf8');
  const after = Buffer.byteLength(result.getObfuscatedCode(), 'utf8');
  console.log(
    `[obfuscate] ${file}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
  );
  changed += 1;
}

if (!changed) {
  console.warn('[obfuscate] Không có file .js nào để làm rối.');
} else {
  console.log(`[obfuscate] Hoàn tất ${changed} file.`);
}
