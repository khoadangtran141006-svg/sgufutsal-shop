
const sampleUsers = [
  { ma: "KH001", ten: "Nguyễn Văn Khoa", email: "a@mail.com", sdt: "0900000001", trangthai: "Hoạt động", matkhau: "123456" },
  { ma: "KH002", ten: "Trần Thị Hân", email: "b@mail.com", sdt: "0900000002", trangthai: "Bị khóa", matkhau: "123456" }
];


const sampleLoai = [
  { maLoai: "L001", tenLoai: "Giày đá banh ", an: false },
  { maLoai: "L002", tenLoai: "Phụ Kiện", an: false },
];


const sampleSP = [
  {
    ma: "SP001",
    maLoai: "L001",
    ten: "Nike Tiempo Legend 10 Elite FG United",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 5990000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    loaiGiay: "giaycotunhien",
    moTa: "Thiết kế hiện đại, nhẹ, thoáng khí. Giúp bạn kiểm soát bóng hoàn hảo."
  },
  {
    ma: "SP002",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Vapor 16 Pro TF",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 2350000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    loaiGiay: "giaycotunhien",
    moTa: "Chất liệu Flyknit mỏng, nhẹ, thoáng khí giúp làm giày nhẹ và dễ uốn hơn"
  },
  {
    ma: "SP003",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Vapor 16 Elite AG-PRO",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 9990000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAA",
    loaiGiay: "giaycotunhien",
    moTa: "Cảm giác mềm mại, ôm chân và độ bám bóng tốt hơn."
  },
  {
    ma: "SP004",
    maLoai: "L001",
    ten: "Nike Tiempo Legend 10 Academy MG Scary Good",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 7990000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAA",
    loaiGiay: "giaycotunhien",
    moTa: "Hệ thống đinh dăm kiểu mới giúp bám sân tốt hơn và vô cùng bền bỉ"
  },
  {
    ma: "SP005",
    maLoai: "L001",
    ten: "Mizuno Monarcida Neo III Select AS - P1GD242525",
    accessory: "none",
    an: false,
    brand: "Mizuno",
    giaVon: 950000,
    hinh: "img/2.2.jpeg",
    loaiGiay: "giayfutsal",
    moTa: "Giày đá bóng mới nhất thuộc thế hệ thứ 3 của dòng \"Mizuno quốc dân\""
  },
  {
    ma: "SP006",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Vapor 16 Elite FG Fear",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 4890000,
    hinh: "img/1.4.jpg",
    loaiGiay: "giaycotunhien",
    moTa: "Cảm giác mềm mại, ôm chân và độ bám bóng tốt hơn."
  },
  {
    ma: "SP007",
    maLoai: "L001",
    ten: "Nike React Phantom 6 Pro Low TF Scary Good",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 980000,
    hinh: "img/1.5.jpg",
    loaiGiay: "giaycotunhien",
    moTa: "Mang lại cảm giác bóng chân thực và độ ôm chân tốt."
  },
  {
    ma: "SP008",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Vapor 16 Elite FG Fear",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 1250000,
    hinh: "img/1.6.jpg",
    loaiGiay: "giaycotunhien",
    moTa: "Cảm giác mềm mại, ôm chân và độ bám bóng tốt hơn."
  },
  {
    ma: "SP009",
    maLoai: "L001",
    ten: "Adidas F50 League TF",
    accessory: "none",
    an: false,
    brand: "Adidas",
    giaVon: 999000,
    hinh: "img/2.3.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Upper sử dụng chất liệu Fiberskin mềm mại và thoáng khí, giúp đôi chân luôn thoải mái"
  },
  {
    ma: "SP010",
    maLoai: "L001",
    ten: "Nike Zoom Mercurial Vapor 16 Academy TF",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 1599000,
    hinh: "img/2.4.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Khuôn đế mới với các đinh dăm hình Elip chống trơn trượt và giúp xoay chuyển linh hoạt"
  },
  {
    ma: "SP011",
    maLoai: "L001",
    ten: "Puma Future 8 Match Creativity TT",
    accessory: "none",
    an: false,
    brand: "Puma",
    giaVon: 1050000,
    hinh: "img/2.5.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Dải băng hình chữ V được mô phỏng theo công nghệ PWRTAPE trên phân khúc Pro"
  },
  {
    ma: "SP012",
    maLoai: "L001",
    ten: "Nike Mercurial Vapor 16 Academy KM TF",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 1599000,
    hinh: "img/2.6.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Khuôn đế mới với các đinh dăm hình Elip chống trơn trượt và giúp xoay chuyển linh hoạt"
  },
  {
    ma: "SP013",
    maLoai: "L001",
    ten: "Mizuno Morelia Sala Classic IN",
    accessory: "none",
    an: false,
    brand: "Mizuno",
    giaVon: 899000,
    hinh: "img/3.3.jpeg",
    loaiGiay: "giayfutsal",
    moTa: "Thiết kế cực kì đẹp mắt, sử dụng chất liệu cao cấp, êm ái mềm mại, ôm chân"
  },
  {
    ma: "SP014",
    maLoai: "L001",
    ten: "JOMA TOP FLEX REBOUND IN 2512",
    accessory: "none",
    an: false,
    brand: "HangKhac",
    giaVon: 1750000,
    hinh: "img/3.4.jpg",
    loaiGiay: "giayfutsal",
    moTa: "Là phiên bản nâng cấp của JOMA TOP FLEX - một trong những dòng giày đá bóng Futsal được yêu thích nhất hiện nay, JOMA TOP FLEX REBOUND IN "
  },
  {
    ma: "SP015",
    maLoai: "L001",
    ten: "Adidas X Speedportal.1 TF Own Your Football",
    accessory: "none",
    an: false,
    brand: "Adidas",
    giaVon: 1850000,
    hinh: "img/2.9.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Form ôm chân dành cho các cầu thủ có lối chơi tốc độ, dứt điểm"
  },
  {
    ma: "SP016",
    maLoai: "L001",
    ten: "Adidas Predator Accuracy .1 TF Marine Rush",
    hinh: "img/2.10.jpeg"
  },
  {
    ma: "SP017",
    maLoai: "L001",
    ten: "Mizuno Morelia Neo Sala Beta TF Frontier",
    accessory: "none",
    an: false,
    brand: "Mizuno",
    giaVon: 3600000,
    hinh: "img/2.11.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Công nghệ đệm giảm chấn giúp êm chân, hạn chế chấn thương khi tranh chấp bóng"
  },
  {
    ma: "SP018",
    maLoai: "L001",
    ten: "Mizuno Mrl Sala Club TF",
    accessory: "none",
    an: false,
    brand: "Mizuno",
    giaVon: 999000,
    hinh: "img/2.12.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Form dáng phù hợp với mọi form chân, đặc biệt là chân bè.Phù hợp với lối chơi sử sụng tốc độ, tấn công và dứt điểm"
  },
  {
    ma: "SP019",
    maLoai: "L001",
    ten: "Desporte Sao Luis KI Pro II - DS1945",
    accessory: "none",
    an: false,
    brand: "HangKhac",
    giaVon: 2150000,
    hinh: "img/3.2.jpeg",
    loaiGiay: "giayfutsal",
    moTa: "Cấu tạo bằng da tự nhiên K cao cấp siêu mềm, siêu bền, cho cảm giác bóng tốt nhất"
  },
  {
    ma: "SP020",
    maLoai: "L001",
    ten: "adidas F50 Elite FG Road to Glory",
    accessory: "none",
    an: false,
    brand: "Adidas",
    giaVon: 1990000,
    hinh: "img/1.10.jpg",
    loaiGiay: "giaycotunhien",
    moTa: "Upper sử dụng chất liệu Fiberskin mềm mại và thoáng khí, giúp đôi chân luôn thoải mái"
  },
  {
    ma: "SP021",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Vapor 16 Academy",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 3990000,
    hinh: "img/1.11.jpg",
    loaiGiay: "giaycotunhien",
    moTa: ""
  },
  {
    ma: "SP022",
    maLoai: "L001",
    ten: "Nike Air Zoom Mercurial Superfly 9 Academy TF",
    accessory: "none",
    an: false,
    brand: "Nike",
    giaVon: 4990000,
    hinh: "img/1.12.jpg",
    loaiGiay: "giayconhantao",
    moTa: "Khuôn đế mới với các đinh dăm hình Elip chống trơn trượt và giúp xoay chuyển linh hoạt"
  },
  {
    ma: "SP023",
    maLoai: "L001",
    ten: "Puma Future 8 Match Forever TT",
    accessory: "none",
    an: false,
    brand: "Puma",
    giaVon: 1150000,
    hinh: "img/2.7.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Dải băng hình chữ V được mô phỏng theo công nghệ PWRTAPE trên phân khúc Pro"
  },
  {
    ma: "SP024",
    maLoai: "L001",
    ten: "PUMA Future 7 Pro Cage TT",
    accessory: "none",
    an: false,
    brand: "Puma",
    giaVon: 1650000,
    hinh: "img/2.8.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Trọng lượng nhẹ, form dễ đi, thích hợp với nhiều hình dạng bàn chân.Kết cấu 3D được phân bổ trên thân giày hỗ trợ tăng khả năng kiểm soát bóng"
  },
  {
    ma: "SP025",
    maLoai: "L001",
    ten: "Adidas Copa Pure 2 League TF Energy Citrus",
    accessory: "none",
    an: false,
    brand: "Adidas",
    giaVon: 1490000,
    hinh: "img/3.6.jpeg",
    loaiGiay: "giayconhantao",
    moTa: "Giày đá bóng adidas thiết kế thiên hướng kiểm soát bóng"
  },
  {
    ma: "SP026",
    maLoai: "L001",
    ten: "Adidas Copa Pure 2 Elite TF Solar Energy",
    accessory: "none",
    an: false,
    brand: "Adidas",
    giaVon: 2190000,
    hinh: "data:image/jpeg;base64,/9j/4QAiRXhpZgAASUkqAAgAAA",
    loaiGiay: "giayconhantao",
    moTa: "Thiết kế tối ưu cho tốc độ và sự linh hoạt trên sân cỏ."
  },
  {
    ma: "SP027",
    maLoai: "L002",
    ten: "Quả bóng đá adidas Football Trionda Pro",
    accessory: "bongda",
    an: false,
    brand: "Adidas",
    giaVon: 3190000,
    hinh: "data:image/jpeg;base64,/9j/4QAiRXhpZgAASUkqAAgAAA",
    loaiGiay: "bongda",
    ma: "SP027",
    maLoai: "L002",
    moTa: ""
  },
  {
    ma: "SP028",
    maLoai: "L002",
    ten: "Vớ vân chống trơn NMS SEMI GRIP 1.0 Crew Sock",
    accessory: "vo",
    an: false,
    brand: "HangKhac",
    giaVon: 69000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    loaiGiay: "vo",
    moTa: ""
  },
  {
    ma: "SP029",
    maLoai: "L002",
    ten: "Găng tay thủ môn adidas Goalkeeper Gloves",
    accessory: "gangtay",
    an: false,
    brand: "Adidas",
    giaVon: 790000,
    hinh: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAA",
    loaiGiay: "gangtay",
    moTa: ""
  },
  {
    ma: "SP030",
    maLoai: "L002",
    ten: "Túi hộp NEYMARSPORT 2025 màu ngẫu nhiên",
    accessory: "tui",
    an: false,
    brand: "HangKhac",
    giaVon: 90000,
    hinh: "data:image/jpeg;base64,/9j/4QAiRXhpZgAASUkqAAgAAA",
    loaiGiay: "tui",
    moTa: ""
  },
  {
    ma: "SP031",
    maLoai: "L002",
    ten: "Quả bóng đá Futsal Molten tiêu chuẩn F9N1510",
    accessory: "bongda",
    an: false,
    brand: "hangkhac",
    giaVon: 599000,
    hinh: "img/4.4.jpg",
    loaiGiay: "bongda",
    moTa: ""
  },
  {
    ma: "SP032",
    maLoai: "L002",
    ten: "Vớ cắt NMS 2025 Freesize",
    accessory: "vo",
    an: false,
    brand: "HangKhac",
    giaVon: 49000,
    hinh: "data:image/jpeg;base64,/9j/4QAiRXhpZgAASUkqAAgAAA",
    loaiGiay: "vo",
    moTa: ""
  },
  {
    ma: "SP033",
    maLoai: "L002",
    ten: "Túi lưới đựng bóng NMS 2024",
    accessory: "tui",
    an: false,
    brand: "HangKhac",
    giaVon: 119000,
    hinh: "data:image/jpeg;base64,/9j/4QAiRXhpZgAASUkqAAgAAA",
    loaiGiay: "tui",
    moTa: ""
  },
  {
    ma: "SP034",
    maLoai: "L002",
    ten: "Quả bóng đá adidas Football Champions League",
    accessory: "bongda",
    an: false,
    brand: "Adidas",
    giaVon: 950000,
    hinh: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    loaiGiay: "bongda",
    moTa: "."
  }
];


const samplePhieu = [
  { maPN: "PN001", ngay: "2025-10-15", chiTiet: [{ ma: "SP001", sl: 10, giaNhap: 2600000 }], trangthai: "Chưa hoàn thành" }
];
const sampleGia = [
  { maSP: "SP001", phanTram: 0.15 }
];
const sampleDon = [
  {
    maDH: "DH001",
    ngay: "2025-10-10T10:00:00",
    khach: "Nguyễn Văn Khoa",
    sdt: "0909123456",
    diachi: "273 An Dương Vương, Q5, TP.HCM",
    chiTiet: [
      { ma: "SP001", ten: "Nike Phantom GX", sl: 1, gia: 3220000 }
    ],
    tongTien: 6440000,
    trangthai: "Mới đặt"
  }
];
if (!localStorage.getItem("sanPhamTrangChu")) {
    localStorage.setItem("sanPhamTrangChu", JSON.stringify(sampleSP));
}

if (!localStorage.getItem("ws_donhang_v1")) {
  localStorage.setItem("ws_donhang_v1", JSON.stringify(sampleDon));
}