# 20102026

Website phim kỷ niệm 20/10 tự chạy trong khoảng 2 phút.

## Dòng thời gian

- Màn Start dùng `web/assets/1.mp3` và lặp lại.
- 15 slide × 8 giây = 120 giây.
- `web/assets/2.mp3` chạy xuyên suốt phần phim.
- Trong 20 giây cuối, `web/assets/3.mp3` được hòa vào và tăng âm lượng.
- Đúng mốc 2:00, hiệu ứng bùng nổ mở ra lời chúc cuối.

## Chỉnh nội dung

Sửa `web/config.js`:

- `slideDuration`: thời lượng mỗi slide, tính bằng mili-giây.
- `finaleLead`: số mili-giây bài 3 chạy trước màn kết.
- `slides`: nội dung, kiểu bố cục và ảnh của từng slide.
- `finalWish`: lời chúc cuối.

Các kiểu slide hiện có: `hero`, `duo`, `scrap`, `film`, `focus`, `stack`, `split`, `orbit`, `finale`.

## Build

```powershell
npm run build
npm run validate
```

Chỉ sửa mã nguồn trong `web/` và `worker/`. Thư mục `dist/` là artifact được tạo lại khi build.
