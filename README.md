# 20102026

Website tương tác 20/10 của lớp: album tự chạy, ba lớp nhạc, game kéo-thả hoa và sơ đồ lớp 48 ghế dùng dữ liệu chung.

## Chỉnh nội dung

Mã nguồn giao diện nằm trong `web/`:

- `web/config.js`: tên lớp, lời chúc, thời gian slide, danh sách ảnh và mốc cao trào của nhạc 3.
- `web/assets/1.mp3`: nhạc lặp ở màn hình Start.
- `web/assets/2.mp3`: nhạc chạy xuyên suốt album, xưởng hoa và lớp học.
- `web/assets/3.mp3`: nhạc cao trào trước lời chúc cuối.
- `web/assets/photos/`: ảnh của album.

`music.finalDropAt` trong `web/config.js` là số giây của bài 3 tại thời điểm bung hiệu ứng cuối. Tăng hoặc giảm giá trị này để khớp đúng đoạn hay nhất của bài.

Mỗi slide trong `slides` có `kicker`, `title`, `accent`, `note` và mảng `photos`. Có thể thêm bao nhiêu slide tùy ý; trang tự chuyển sau thời gian `slideDuration`.

## Sơ đồ lớp và dữ liệu chung

Sơ đồ gồm 4 dãy × 6 bàn × 2 ghế = 48 ghế. Website gọi `/api/classroom` mỗi 2,5 giây để đồng bộ trạng thái gần realtime cho mọi người. Dữ liệu tên, ghế và bó hoa được lưu trong D1 qua migration `drizzle/0000_classroom.sql`.

Nếu chỉ mở file HTML hoặc chạy static server cục bộ, API không tồn tại và trang tự chuyển sang chế độ thử bằng `localStorage`. Bản deploy trên Sites dùng D1 chung.

## Build

```powershell
npm run build
npm run validate
```

Build sẽ nhúng toàn bộ nội dung trong `web/` vào Worker tại `dist/server/index.js`. Không sửa trực tiếp file đã build trong `dist/`.

## Cấu trúc

```text
web/                    giao diện, ảnh và nhạc nguồn
worker/runtime.js       API D1 và bộ phục vụ asset
scripts/build-worker.mjs
drizzle/                migration dữ liệu lớp học
dist/                   artifact được tạo tự động
```
