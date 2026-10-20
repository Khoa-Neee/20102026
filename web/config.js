const PHOTO = {
  a: "assets/photos/images.jpg",
  b: "assets/photos/images (1).jpg",
  c: "assets/photos/messi2.jpg",
  d: "assets/photos/messi-PNG-1783465158-6003-1783465353.png",
  e: "assets/photos/afp202608302292630909v1highresintermiamicfvcfmontreal-17880554405591864347428.jpg"
};

window.GIFT_CONFIG = {
  siteName: "20102026",
  className: "Lớp chúng mình",
  cursorEmoji: "🌷",
  music: { start: "assets/1.mp3", middle: "assets/2.mp3", finale: "assets/3.mp3" },
  slideDuration: 8000,
  finaleLead: 21000,
  slides: [
    { variant:"hero", background:PHOTO.e, kicker:"MỞ ĐẦU · 20102026", title:"Có những ngày bình thường,", accent:"nhờ có nhau mà thành kỷ niệm.", note:"Một cuốn phim ngắn dành riêng cho lớp mình.", photos:[PHOTO.a,PHOTO.b,PHOTO.c] },
    { variant:"duo", background:PHOTO.a, kicker:"01 · NGÀY ĐẦU TIÊN", title:"Từ những lần đầu", accent:"còn hơi ngại ngùng…", note:"Những gương mặt lạ rồi dần trở thành một phần rất quen.", photos:[PHOTO.b,PHOTO.c,PHOTO.d,PHOTO.e] },
    { variant:"scrap", background:PHOTO.c, kicker:"02 · CHUYỆN TRONG LỚP", title:"Một chút ồn ào,", accent:"một trời thanh xuân.", note:"Có những ngày chẳng có gì đặc biệt, nhưng sau này lại nhớ rất lâu.", photos:[PHOTO.a,PHOTO.d,PHOTO.b,PHOTO.e] },
    { variant:"film", background:PHOTO.b, kicker:"03 · CAMERA ROLL", title:"Những khung hình", accent:"không kịp tạo dáng.", note:"Mờ một chút, lệch một chút — nhưng là chúng mình thật nhất.", photos:[PHOTO.c,PHOTO.e,PHOTO.a,PHOTO.d] },
    { variant:"focus", background:PHOTO.d, kicker:"04 · NHỮNG TIẾNG CƯỜI", title:"Chỉ cần nhìn lại,", accent:"là nghe thấy hôm ấy.", note:"Một bức ảnh có thể giữ lại cả căn phòng đầy tiếng cười.", photos:[PHOTO.e,PHOTO.a,PHOTO.b] },
    { variant:"stack", background:PHOTO.e, kicker:"05 · GIỜ RA CHƠI", title:"Khoảng nghỉ ngắn,", accent:"câu chuyện thì rất dài.", note:"Chuyện hôm qua, chuyện ngày mai và đủ thứ linh tinh chẳng bao giờ hết.", photos:[PHOTO.b,PHOTO.d,PHOTO.c,PHOTO.a] },
    { variant:"split", background:PHOTO.b, kicker:"06 · ĐỒNG ĐỘI", title:"Không cần hoàn hảo,", accent:"chỉ cần có mặt cùng nhau.", note:"Mỗi người một tính, vậy mà ghép lại vẫn thành một tập thể rất riêng.", photos:[PHOTO.d,PHOTO.a,PHOTO.c,PHOTO.e] },
    { variant:"orbit", background:PHOTO.d, kicker:"07 · NHỮNG NGÀY BẬN RỘN", title:"Deadline nối deadline,", accent:"vẫn có nhau ở bên.", note:"Cùng làm, cùng sửa, cùng than — rồi cuối cùng vẫn xong.", photos:[PHOTO.a,PHOTO.b,PHOTO.e,PHOTO.c] },
    { variant:"hero", background:PHOTO.c, kicker:"08 · MỘT CHÚT TỰ HÀO", title:"Chúng ta đã đi qua", accent:"nhiều hơn mình nghĩ.", note:"Từng việc nhỏ góp lại thành một chặng đường đáng nhớ.", photos:[PHOTO.d,PHOTO.a,PHOTO.e] },
    { variant:"duo", background:PHOTO.e, kicker:"09 · MỖI NGƯỜI MỘT MÀU", title:"Khác nhau một chút,", accent:"mới thành lớp chúng mình.", note:"Không ai cần giống ai để cùng tạo nên một bức tranh đẹp.", photos:[PHOTO.e,PHOTO.c,PHOTO.b,PHOTO.d] },
    { variant:"film", background:PHOTO.a, kicker:"10 · NHỮNG ĐIỀU CHƯA NÓI", title:"Có những lời cảm ơn", accent:"thường bị để dành.", note:"Cảm ơn vì đã làm những ngày đi học có thêm lý do để mong chờ.", photos:[PHOTO.b,PHOTO.a,PHOTO.d,PHOTO.e] },
    { variant:"focus", background:PHOTO.b, kicker:"11 · GỬI CÁC BẠN NỮ", title:"Hãy luôn tự tin,", accent:"theo cách của riêng mình.", note:"Không cần trở thành phiên bản của bất kỳ ai khác.", photos:[PHOTO.c,PHOTO.d,PHOTO.a] },
    { variant:"scrap", background:PHOTO.d, kicker:"12 · GỬI MỘT NỤ CƯỜI", title:"Mong những ngày tới", accent:"sẽ thật dịu dàng.", note:"Có niềm vui để nhớ, có ước mơ để theo và có người tốt để gặp.", photos:[PHOTO.e,PHOTO.b,PHOTO.a,PHOTO.c] },
    { variant:"stack", background:PHOTO.a, kicker:"13 · SẮP ĐẾN ĐOẠN CUỐI", title:"Cuốn phim sắp hết,", accent:"kỷ niệm thì còn dài.", note:"Giữ lại khoảnh khắc này thêm một chút nữa nhé.", photos:[PHOTO.d,PHOTO.c,PHOTO.e,PHOTO.b] },
    { variant:"finale", background:PHOTO.e, kicker:"14 · VÀ CUỐI CÙNG…", title:"Có một điều", accent:"muốn gửi riêng đến bạn.", note:"Bật âm lượng lên một chút. Đoạn hay nhất sắp tới rồi.", photos:[PHOTO.a,PHOTO.b,PHOTO.c,PHOTO.d] }
  ],
  finalWish: "Nhân ngày 20/10, tụi mình muốn gửi đến các bạn nữ lời chúc chân thành nhất. Cảm ơn vì đã mang đến cho lớp những tiếng cười rất riêng, những sự quan tâm nhỏ bé nhưng đủ làm một ngày đi học trở nên ấm áp hơn, và cả nguồn năng lượng khiến những kỷ niệm bình thường cũng trở nên đáng nhớ. Mong các bạn sẽ luôn được yêu thương, được lắng nghe, được tự do theo đuổi điều mình thích và luôn tin rằng bản thân mình xứng đáng với những điều tốt đẹp nhất. Dù sau này mỗi người đi một hướng, hy vọng khi nhớ về những năm tháng này, chúng ta vẫn có thể mỉm cười vì đã từng có một tập thể thật vui, thật gần gũi và thật thanh xuân. Chúc các bạn luôn rạng rỡ theo cách của riêng mình — không chỉ hôm nay, mà trong mọi ngày phía trước."
};
