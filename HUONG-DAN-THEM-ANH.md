# Hướng dẫn nội dung A1K37

Website dùng `web/index.html` làm trang chính theo giao diện căn phòng pixel A1K37.

## Video kỷ niệm

Video của tab **Xem lại kỷ niệm** nằm tại:

`web/assets/memories/video.mp4`

Muốn thay video, chỉ cần chép video MP4 mới đè lên file này và giữ nguyên tên `video.mp4`.

## Ảnh do người xem thêm

Người xem mở tab **Xem lại kỷ niệm**, bấm **NEXT**, rồi chọn **Thêm ảnh trực tiếp**.

Ảnh được lưu trong IndexedDB của trình duyệt:

- tải lại trang vẫn còn;
- chỉ xuất hiện trên trình duyệt và thiết bị đã thêm ảnh;
- không tự đồng bộ sang điện thoại hoặc máy tính khác;
- người xem có thể xóa từng ảnh bằng nút `×`.

Nếu muốn tất cả mọi người nhìn thấy chung một album, cần kết nối kho lưu trữ/backend riêng trong bước tiếp theo.

## Ảnh trên tường căn phòng

Ngay tại tab **Phòng kỷ niệm**, bấm **Import Ảnh Lên Tường** để chọn nhiều ảnh cùng lúc. Bản source không còn chứa ảnh Messi hoặc ảnh mẫu cũ.
