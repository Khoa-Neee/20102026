# Cấu hình ảnh chung cho A1K37 bằng Supabase

Website không còn dùng video mẫu và không lưu ảnh riêng trong trình duyệt. Ảnh kỷ niệm, ảnh trên tường, lời nhắn và Photobook đều dùng chung dữ liệu Supabase nên mọi người mở trang sẽ thấy cùng nội dung.

## 1. Tạo Supabase project

Tạo một project miễn phí tại Supabase. Sau khi project sẵn sàng, mở **SQL Editor**, tạo query mới, dán toàn bộ nội dung file `supabase/schema.sql`, rồi bấm **Run**. File này tạo bảng dữ liệu, bucket ảnh công khai và bật realtime.

## 2. Nối website với Supabase

Vào **Project Settings → API** (hoặc **Connect**) và lấy Project URL cùng `anon` key/publishable key. Mở `web/supabase-config.js` và thay hai giá trị mẫu:

```js
window.SUPABASE_CONFIG = {
    url: "https://PROJECT_CUA_BAN.supabase.co",
    anonKey: "ANON_HOAC_PUBLISHABLE_KEY_CUA_BAN"
};
```

Khóa `anon`/publishable được phép nằm trong frontend. Tuyệt đối không đưa `service_role` key vào repo.

## 3. Cách hoạt động

- **Xem lại kỷ niệm:** vào tab là thấy luôn màn chiếu (không còn khối tiêu đề đầu trang). Bấm **Thêm ảnh** hoặc **Thêm video** để tải lên kho chung Supabase, mọi người thấy ngay qua realtime. Ảnh phát 5 giây; video phát trọn bộ với thanh điều khiển, hết video tự chuyển mục tiếp theo; có nút tạm dừng, NEXT và bật/tắt nhạc `web/assets/2.mp3` (nhạc tự tắt khi tới video và bật lại khi về ảnh).
- **Phòng kỷ niệm:** ảnh treo tường, lời nhắn và các dải ảnh đã lưu trong Photobook được đồng bộ realtime.
- Dòng trạng thái **Realtime đang hoạt động** nằm trong khung **Kho ảnh chung**, cho biết kết nối thành công.

## 4. Bắt buộc: chạy lại schema khi trước đây đã chạy bản cũ

Nếu bạn đã chạy `supabase/schema.sql` trước khi có chức năng video, hãy chạy **lại toàn bộ file** này một lần nữa trong SQL Editor. File viết an toàn để chạy nhiều lần (idempotent); lần chạy lại sẽ thêm cột `kind` vào bảng `memory_items` và nâng giới hạn bucket lên 50MB cho phép video mp4/webm/mov.

## Lưu ý quyền truy cập

Thiết lập hiện tại dành cho link lớp học: bất kỳ ai có link đều có thể xem và thêm/sửa nội dung. Nếu public link rộng rãi, nên bổ sung đăng nhập hoặc mã lớp trước khi cho phép ghi dữ liệu.
