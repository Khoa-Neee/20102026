/*
  Chỉ cần thay ảnh trong assets/photos/slide-01 ... slide-10:
  bg.jpg = ảnh nền, 01.jpg = ảnh chính, 02.jpg–04.jpg = ảnh phụ.
*/
const slidePhotos = (number) => {
  const folder = `assets/photos/slide-${String(number).padStart(2, "0")}`;
  return {
    background: `${folder}/bg.jpg`,
    photos: [`${folder}/01.jpg`, `${folder}/02.jpg`, `${folder}/03.jpg`, `${folder}/04.jpg`]
  };
};

window.GIFT_CONFIG = {
  siteName: "20102026",
  className: "Lớp chúng mình",
  cursorEmoji: "🌷",
  music: { start: "assets/1.mp3", middle: "assets/2.mp3", finale: "assets/3.mp3" },
  slideDuration: 12000,
  finaleLead: 21000,
  slides: [
    { variant:"hero", kicker:"MỞ ĐẦU · 20102026", title:"Có những ngày bình thường,", accent:"nhờ có nhau mà thành kỷ niệm.", note:"Một cuốn phim ngắn dành riêng cho lớp mình.", ...slidePhotos(1) },
    { variant:"duo", kicker:"01 · NGÀY ĐẦU TIÊN", title:"Từ những lần đầu", accent:"còn hơi ngại ngùng…", note:"Những gương mặt lạ rồi dần trở thành một phần rất quen.", ...slidePhotos(2) },
    { variant:"scrap", kicker:"02 · CHUYỆN TRONG LỚP", title:"Một chút ồn ào,", accent:"một trời thanh xuân.", note:"Có những ngày chẳng có gì đặc biệt, nhưng sau này lại nhớ rất lâu.", ...slidePhotos(3) },
    { variant:"film", kicker:"03 · CAMERA ROLL", title:"Những khung hình", accent:"không kịp tạo dáng.", note:"Mờ một chút, lệch một chút — nhưng là chúng mình thật nhất.", ...slidePhotos(4) },
    { variant:"focus", kicker:"04 · NHỮNG TIẾNG CƯỜI", title:"Chỉ cần nhìn lại,", accent:"là nghe thấy hôm ấy.", note:"Một bức ảnh có thể giữ lại cả căn phòng đầy tiếng cười.", ...slidePhotos(5) },
    { variant:"stack", kicker:"05 · GIỜ RA CHƠI", title:"Khoảng nghỉ ngắn,", accent:"câu chuyện thì rất dài.", note:"Chuyện hôm qua, chuyện ngày mai và đủ thứ linh tinh chẳng bao giờ hết.", ...slidePhotos(6) },
    { variant:"split", kicker:"06 · ĐỒNG ĐỘI", title:"Không cần hoàn hảo,", accent:"chỉ cần có mặt cùng nhau.", note:"Mỗi người một tính, vậy mà ghép lại vẫn thành một tập thể rất riêng.", ...slidePhotos(7) },
    { variant:"orbit", kicker:"07 · NHỮNG NGÀY BẬN RỘN", title:"Deadline nối deadline,", accent:"vẫn có nhau ở bên.", note:"Cùng làm, cùng sửa, cùng than — rồi cuối cùng vẫn xong.", ...slidePhotos(8) },
    { variant:"hero", kicker:"08 · MỘT CHÚT TỰ HÀO", title:"Chúng ta đã đi qua", accent:"nhiều hơn mình nghĩ.", note:"Từng việc nhỏ góp lại thành một chặng đường đáng nhớ.", ...slidePhotos(9) },
    { variant:"finale", kicker:"09 · VÀ CUỐI CÙNG…", title:"Có một điều", accent:"muốn gửi riêng đến bạn.", note:"Bật âm lượng lên một chút. Đoạn hay nhất sắp tới rồi.", ...slidePhotos(10) }
  ],
  finalWish: "Nhân ngày 20/10, tụi mình muốn gửi đến các bạn nữ lời chúc chân thành nhất. Cảm ơn vì đã mang đến cho lớp những tiếng cười rất riêng, những sự quan tâm nhỏ bé nhưng đủ làm một ngày đi học trở nên ấm áp hơn, và cả nguồn năng lượng khiến những kỷ niệm bình thường cũng trở nên đáng nhớ. Mong các bạn sẽ luôn được yêu thương, được lắng nghe, được tự do theo đuổi điều mình thích và luôn tin rằng bản thân mình xứng đáng với những điều tốt đẹp nhất. Dù sau này mỗi người đi một hướng, hy vọng khi nhớ về những năm tháng này, chúng ta vẫn có thể mỉm cười vì đã từng có một tập thể thật vui, thật gần gũi và thật thanh xuân. Chúc các bạn luôn rạng rỡ theo cách của riêng mình — không chỉ hôm nay, mà trong mọi ngày phía trước."
};
