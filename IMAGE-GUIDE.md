# Ảnh cần chuẩn bị cho 15 slide

Mỗi slide hỗ trợ:

- 1 ảnh nền riêng qua trường `background`.
- 3 đến 4 ảnh nổi qua mảng `photos`.

Nếu muốn không lặp ảnh, nên chuẩn bị khoảng **60 đến 75 ảnh**:

- 15 ảnh nền.
- 45–60 ảnh nổi.

Phương án thực tế, dễ chuẩn bị hơn là **35–45 ảnh** rồi cho phép một số ảnh đẹp xuất hiện lại ở phần nền hoặc đoạn cao trào.

Chép ảnh vào `web/assets/photos/`, sau đó khai báo đường dẫn ở đầu `web/config.js` và dùng trong từng slide:

```js
{
  variant: "scrap",
  background: "assets/photos/slide-01-bg.jpg",
  photos: [
    "assets/photos/slide-01-a.jpg",
    "assets/photos/slide-01-b.jpg",
    "assets/photos/slide-01-c.jpg",
    "assets/photos/slide-01-d.jpg"
  ]
}
```

Ảnh nền nên nằm ngang tỷ lệ 16:9. Ảnh nổi có thể dùng cả ảnh dọc và ảnh ngang.
