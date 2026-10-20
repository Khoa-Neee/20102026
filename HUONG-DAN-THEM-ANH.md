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

- **Xem lại kỷ niệm:** bấm **Thêm ảnh vào album chung**. Ảnh được tải thẳng lên Supabase Storage và tự xuất hiện với mọi người. Mỗi ảnh phát 5 giây; có nút tạm dừng, bỏ qua và bật/tắt nhạc `web/assets/2.mp3`.
- **Phòng kỷ niệm:** ảnh treo tường, lời nhắn và các dải ảnh đã lưu trong Photobook được đồng bộ realtime.
- Dòng trạng thái màu xanh **Realtime đang hoạt động** cho biết kết nối thành công.

## Lưu ý quyền truy cập

Thiết lập hiện tại dành cho link lớp học: bất kỳ ai có link đều có thể xem và thêm/sửa nội dung. Nếu public link rộng rãi, nên bổ sung đăng nhập hoặc mã lớp trước khi cho phép ghi dữ liệu.
