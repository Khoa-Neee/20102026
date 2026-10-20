# Trạng thái dự án 20102026 / A1K37

_Cập nhật: 20/10/2026_

## Đã hoàn thành

- Đã xóa video mẫu `web/assets/memories/video.mp4`.
- Tab **Xem lại kỷ niệm** đã đổi thành slideshow ảnh chung: mỗi ảnh hiển thị 5 giây, có nút tạm dừng/tiếp tục, NEXT để bỏ qua và nút bật/tắt nhạc.
- Đã xóa khối tiêu đề/bìa đầu tab **Xem lại kỷ niệm**; vào tab là thấy ngay màn chiếu. Chip trạng thái Realtime được chuyển vào khung **Kho ảnh chung**.
- Mới: hỗ trợ **video chung** — nút **Thêm video** tải mp4/webm/mov (tối đa 50MB) lên Supabase; tab phát video với thanh điều khiển, NEXT vẫn bỏ qua được, hết video tự chuyển mục; nhạc nền tự tắt khi phát video và bật lại khi về ảnh.
- Nhạc nền của slideshow dùng `web/assets/2.mp3` và phát lặp lại.
- Người xem có thể thêm nhiều ảnh trực tiếp từ web. Ảnh sẽ được nén trước khi tải lên để nhẹ hơn.
- Phòng kỷ niệm đã chuẩn bị đồng bộ chung cho: ảnh treo tường, lời nhắn và Photobook.
- Đã thêm Supabase Storage + Realtime vào source và bỏ toàn bộ cách lưu album cục bộ bằng IndexedDB.
- Đã kiểm tra giao diện tab slideshow trên trình duyệt: hiển thị đúng cả ở trạng thái album trống.
- Hướng dẫn cài đặt đã được cập nhật tại `HUONG-DAN-THEM-ANH.md`.

## Cần làm để chạy dữ liệu chung thật

1. Nếu đã chạy `supabase/schema.sql` bản cũ: chạy **lại** file này trong Supabase SQL Editor để thêm cột `kind` và mở khóa video cho bucket (chạy lại an toàn).
2. Website đã được điền Project URL và publishable key ở `web/supabase-config.js`.
3. Build/deploy lại website sau khi chạy schema.

Khi hoàn tất, góc tab **Xem lại kỷ niệm** sẽ hiện `Realtime đang hoạt động`. Từ lúc đó, bất cứ ai thêm ảnh/lời nhắn/photobook đều thấy ngay trên các máy khác.

## Lưu ý

- `anon` hoặc publishable key có thể đặt trong frontend; không bao giờ đưa `service_role` key vào source.
- Cấu hình hiện tại mở quyền thêm/sửa cho tất cả người có link web, phù hợp website nội bộ của lớp. Nếu phát tán link rộng rãi thì nên bổ sung đăng nhập hoặc mã lớp.
- Bản source đã commit ở Git: `0b34b93` và `bb94957`.
