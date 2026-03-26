

document.addEventListener("DOMContentLoaded", () => {
  // ---- Elements cơ bản ----
  const formDangNhap = document.getElementById("formDangNhapAdmin");
  const khungDangNhap = document.getElementById("khungDangNhap");
  const khungAdmin = document.getElementById("khungAdmin");
  const thongBao = document.getElementById("thongbao");
  const noiDung = document.getElementById("noiDung");
  const btnDangXuat = document.getElementById("btnDangXuat");
  const menuLinks = document.querySelectorAll(".menu a");

  // ---- Admin accounts ----
  const adminList = [
    { user: "admin1", pass: "12345@12345" },
    { user: "admin2", pass: "12345@12345" },
    { user: "admin3", pass: "12345@12345" }
  ];

  // ---- LocalStorage keys ----
  const LS_USERS = "ws_users_v1";
  const LS_LOAISP = "ws_loaisp_v1";
  const LS_SP = "ws_sanpham_v1";
  const LS_PHIEUNHAP = "ws_phieunhap_v1";
  const LS_GIABAN = "ws_giaban_v1";
  const LS_DONHANG = "ws_donhang_v1";


  // ---- Utils load/save ----
  function loadOrInit(key, sample) {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(sample));
      return JSON.parse(JSON.stringify(sample));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      localStorage.setItem(key, JSON.stringify(sample));
      return JSON.parse(JSON.stringify(sample));
    }
  }
  function save(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }

  // Dữ liệu runtime
  let dsUsers = loadOrInit(LS_USERS, sampleUsers);
  let dsLoai = loadOrInit(LS_LOAISP, sampleLoai);
  let dsSP = loadOrInit(LS_SP, sampleSP);
  let dsPhieu = loadOrInit(LS_PHIEUNHAP, samplePhieu);
  let dsGia = loadOrInit(LS_GIABAN, sampleGia);
  let dsDon = loadOrInit(LS_DONHANG, sampleDon);

  //Helper hiển thị tiền
  function fmt(v) {
    return v == null ? "" : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //Login / Logout
  if (localStorage.getItem("adminDangNhap")) {
    hienTrangAdmin();
  }

  formDangNhap.addEventListener("submit", (e) => {
    e.preventDefault();
    const tk = document.getElementById("taikhoan").value.trim();
    const mk = document.getElementById("matkhau").value.trim();
    const admin = adminList.find(a => a.user === tk && a.pass === mk);
    if (admin) {
      localStorage.setItem("adminDangNhap", tk);
      hienTrangAdmin();
    } else {
      thongBao.textContent = "❌ Sai tài khoản hoặc mật khẩu!";
    }
  });

  btnDangXuat.addEventListener("click", () => {
    localStorage.removeItem("adminDangNhap");
    khungDangNhap.style.display = "flex";
    khungAdmin.style.display = "none";
  });

  // Menu navigation 
  menuLinks.forEach(link => {
    link.addEventListener("click", (ev) => {
      ev.preventDefault();
      menuLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const section = link.dataset.section;
      hienNoiDung(section);
    });
  });

  // Hiển thị nội dung động cho mỗi module
  function hienNoiDung(section) {
    switch (section) {
      case "dashboard":
        renderDashboard();
        break;
      case "nguoidung":
        renderQLNguoiDung();
        break;
      case "loaisp":
        renderQLLoaiSP();
        break;
      case "sanpham":
        renderQLSanPham();
        break;
      case "nhaphang":
        renderQLPhieuNhap();
        break;
      case "giaban":
        renderQLGiaBan();
        break;
      case "donhang":
        renderAdminOrdersUI();
        break;
      case "tonkho":
        renderQLTonKho();
        break;
      default:
        noiDung.innerHTML = `<p>Chọn mục bên trái để quản lý.</p>`;
    }
  }

  //  Dashboard
  function renderDashboard() {
    const tongSP = dsSP.filter(s => !s.an).length;
    const tongLoai = dsLoai.filter(l => !l.an).length;
    const tongKH = dsUsers.length;
    const tongDon = dsDon.length;
    noiDung.innerHTML = `
      <h3>Trang chủ</h3>
      <div style="display:flex;gap:12px;margin-top:10px;">
        <div style="flex:1;padding:12px;border:1px solid #eee;border-radius:8px;">
          <strong>Sản phẩm (không ẩn)</strong><div style="font-size:24px;margin-top:6px">${tongSP}</div>
        </div>
        <div style="flex:1;padding:12px;border:1px solid #eee;border-radius:8px;">
          <strong>Loại sản phẩm</strong><div style="font-size:24px;margin-top:6px">${tongLoai}</div>
        </div>
        <div style="flex:1;padding:12px;border:1px solid #eee;border-radius:8px;">
          <strong>Khách hàng</strong><div style="font-size:24px;margin-top:6px">${tongKH}</div>
        </div>
        <div style="flex:1;padding:12px;border:1px solid #eee;border-radius:8px;">
          <strong>Đơn hàng</strong><div style="font-size:24px;margin-top:6px">${tongDon}</div>
        </div>
      </div>
      <p style="margin-top:12px;">Chào mừng đến hệ thống quản lý SGUSPORT! Mở từng mục bên trái để quản lý chi tiết.</p>
    `;
  }

//Quản lý Người dùng 
function renderQLNguoiDung() {
  noiDung.innerHTML = `
    <h3>👥 Quản lý người dùng</h3>
    <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
      <input id="q_nd_tim" placeholder="Tìm theo mã / tên / email" style="padding:8px;flex:1;" />
      <button id="q_nd_them">➕ Thêm</button>
    </div>
    <table style="margin-top:12px;">
      <thead><tr><th>Mã</th><th>Tên</th><th>Email</th><th>SĐT</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
      <tbody id="q_nd_tbody"></tbody>
    </table>

    <div id="q_nd_modal" style="display:none;padding:12px;border:1px solid #ddd;margin-top:10px;border-radius:8px;">
      <h4 id="q_nd_modal_title">Thêm người dùng</h4>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <input id="q_nd_ma" placeholder="Mã (VD: KH003)" />
        <input id="q_nd_ten" placeholder="Họ tên" />
        <input id="q_nd_email" placeholder="Email" />
        <input id="q_nd_sdt" placeholder="Số ĐT" />
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button id="q_nd_save">Lưu</button>
          <button id="q_nd_cancel">Hủy</button>
        </div>
      </div>
    </div>
  `;

  const tbody = document.getElementById("q_nd_tbody");
  const inputTim = document.getElementById("q_nd_tim");
  const btnThem = document.getElementById("q_nd_them");
  const modal = document.getElementById("q_nd_modal");
  const modalTitle = document.getElementById("q_nd_modal_title");
  const inpMa = document.getElementById("q_nd_ma");
  const inpTen = document.getElementById("q_nd_ten");
  const inpEmail = document.getElementById("q_nd_email");
  const inpSdt = document.getElementById("q_nd_sdt");
  const btnSave = document.getElementById("q_nd_save");
  const btnCancel = document.getElementById("q_nd_cancel");

  let editingMa = null;

  function loadUsers() {
    const data = localStorage.getItem("DS_USERS");
    return data ? JSON.parse(data) : [];
  }
  function saveUsers(users) {
    localStorage.setItem("DS_USERS", JSON.stringify(users));
  }

  function refresh() {
    let dsUsers = loadUsers();
    const q = inputTim.value.trim().toLowerCase();
    tbody.innerHTML = "";

    dsUsers.filter(u => !q || u.ma.toLowerCase().includes(q) || u.ten.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .forEach(u => {
        const st = u.trangthai === "Bị khóa" ? `<span style="color:red">${u.trangthai}</span>` : `<span style="color:green">${u.trangthai}</span>`;
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${u.ma}</td><td>${u.ten}</td><td>${u.email}</td><td>${u.sdt||''}</td><td>${st}</td>
          <td>
            <button data-ma="${u.ma}" class="edit">Chỉnh Sửa</button>
            <button data-ma="${u.ma}" class="reset">Reset Mật Khẩu</button>
            <button data-ma="${u.ma}" class="toggle">${u.trangthai === 'Bị khóa' ? '🔓 Mở' : '🔒 Khóa'}</button>
            <button data-ma="${u.ma}" class="del" style="color:#b00">Xóa</button>
          </td>`;
        tbody.appendChild(tr);
      });

    tbody.querySelectorAll("button.edit").forEach(b => b.addEventListener("click", () => openEdit(b.dataset.ma)));
    tbody.querySelectorAll("button.reset").forEach(b => b.addEventListener("click", () => resetPassword(b.dataset.ma)));
    tbody.querySelectorAll("button.toggle").forEach(b => b.addEventListener("click", () => toggleKhoa(b.dataset.ma)));
    tbody.querySelectorAll("button.del").forEach(b => b.addEventListener("click", () => deleteUser(b.dataset.ma)));
  }

  inputTim.addEventListener("input", refresh);

  btnThem.addEventListener("click", () => {
    editingMa = null;
    modalTitle.textContent = "Thêm người dùng";
    inpMa.value = inpTen.value = inpEmail.value = inpSdt.value = "";
    modal.style.display = "block";
  });

  btnCancel.addEventListener("click", () => modal.style.display = "none");

  btnSave.addEventListener("click", () => {
    let dsUsers = loadUsers();
    const ma = inpMa.value.trim(), ten = inpTen.value.trim(), email = inpEmail.value.trim(), sdt = inpSdt.value.trim();
    if (!ma || !ten || !email) return alert("Mã, tên và email bắt buộc.");
    if (editingMa) {
      const idx = dsUsers.findIndex(u => u.ma === editingMa);
      if (idx === -1) return alert("Không tìm thấy bản ghi.");
      dsUsers[idx] = { ...dsUsers[idx], ma, ten, email, sdt };
    } else {
      if (dsUsers.some(u => u.ma === ma)) return alert("Mã đã tồn tại.");
      dsUsers.push({ ma, ten, email, sdt, trangthai: "Hoạt động", matkhau: "123456" });
    }
    saveUsers(dsUsers);
    modal.style.display = "none";
    refresh();
  });

  function openEdit(ma) {
    const dsUsers = loadUsers();
    const u = dsUsers.find(u => u.ma === ma);
    if (!u) return alert("Không tìm thấy.");
    editingMa = ma;
    modalTitle.textContent = "Sửa người dùng";
    inpMa.value = u.ma; inpTen.value = u.ten; inpEmail.value = u.email; inpSdt.value = u.sdt || "";
    modal.style.display = "block";
  }

  function resetPassword(ma) {
    let dsUsers = loadUsers();
    const u = dsUsers.find(u => u.ma === ma);
    if (!u) return alert("Không tìm thấy.");
    if (!confirm(`Reset mật khẩu cho ${u.ten} (${u.ma}) về "123456"?`)) return;
    u.matkhau = "123456";
    saveUsers(dsUsers); alert("Đã reset mật khẩu."); refresh();
  }

  function toggleKhoa(ma) {
    let dsUsers = loadUsers();
    const u = dsUsers.find(u => u.ma === ma);
    if (!u) return alert("Không tìm thấy.");
    const willKhoa = u.trangthai !== "Bị khóa";
    if (!confirm(`${willKhoa ? 'Khóa' : 'Mở khóa'} tài khoản ${u.ten} (${u.ma})?`)) return;
    u.trangthai = willKhoa ? "Bị khóa" : "Hoạt động";
    saveUsers(dsUsers); refresh();
  }

  function deleteUser(ma) {
    let dsUsers = loadUsers();
    if (!confirm("Xóa người dùng sẽ không thể khôi phục. Có chắc?")) return;
    dsUsers = dsUsers.filter(u => u.ma !== ma);
    saveUsers(dsUsers); refresh();
  }

  refresh();


  window.addEventListener("storage", function(e) {
    if (e.key === "DS_USERS") refresh();
  });
}

//mã khách hàng tự động
function taoMaKH() {
  const dsKH = loadUsers().filter(u => u.ma.startsWith("KH"));
  if (!dsKH.length) return "KH1";
  const max = Math.max(...dsKH.map(u => parseInt(u.ma.slice(2))));
  return "KH" + (max + 1);
}



  // Quản lý Loại sản phẩm
  function renderQLLoaiSP() {
    noiDung.innerHTML = `
      <h3>📦 Quản lý loại sản phẩm</h3>
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
        <input id="q_loai_tim" placeholder="Tìm theo mã / tên" style="padding:8px;flex:1;" />
        <button id="q_loai_them">➕ Thêm loại</button>
      </div>
      <table style="margin-top:12px;">
        <thead><tr><th>Mã loại</th><th>Tên loại</th><th>Ẩn</th><th>Thao tác</th></tr></thead>
        <tbody id="q_loai_tbody"></tbody>
      </table>

      <div id="q_loai_modal" style="display:none;padding:12px;border:1px solid #ddd;margin-top:10px;border-radius:8px;">
        <h4 id="q_loai_modal_title">Thêm loại</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <input id="q_loai_ma" placeholder="Mã loại (VD: L003)" />
          <input id="q_loai_ten" placeholder="Tên loại" />
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button id="q_loai_save">Lưu</button>
            <button id="q_loai_cancel">Hủy</button>
          </div>
        </div>
      </div>
    `;

    const tbody = document.getElementById("q_loai_tbody");
    const inputTim = document.getElementById("q_loai_tim");
    const btnThem = document.getElementById("q_loai_them");
    const modal = document.getElementById("q_loai_modal");
    const modalTitle = document.getElementById("q_loai_modal_title");
    const inpMa = document.getElementById("q_loai_ma");
    const inpTen = document.getElementById("q_loai_ten");
    const btnSave = document.getElementById("q_loai_save");
    const btnCancel = document.getElementById("q_loai_cancel");

    let editingMa = null;

    function refresh() {
      const q = inputTim.value.trim().toLowerCase();
      tbody.innerHTML = "";
      dsLoai.filter(l => {
        if (!q) return true;
        return l.maLoai.toLowerCase().includes(q) || l.tenLoai.toLowerCase().includes(q);
      }).forEach(l => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${l.maLoai}</td><td>${l.tenLoai}</td><td>${l.an ? '✔' : ''}</td>
          <td>
            <button data-ma="${l.maLoai}" class="edit">Chỉnh Sửa</button>
            <button data-ma="${l.maLoai}" class="toggle">${l.an ? 'Hiện' : 'Ẩn'}</button>
            <button data-ma="${l.maLoai}" class="del" style="color:#b00">Xóa</button>
          </td>`;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll("button.edit").forEach(b => b.addEventListener("click", () => {
        openEdit(b.dataset.ma);
      }));
      tbody.querySelectorAll("button.toggle").forEach(b => b.addEventListener("click", () => {
        toggleAn(b.dataset.ma);
      }));
      tbody.querySelectorAll("button.del").forEach(b => b.addEventListener("click", () => {
        deleteLoai(b.dataset.ma);
      }));
    }

    inputTim.addEventListener("input", refresh);
    btnThem.addEventListener("click", () => {
      editingMa = null; modalTitle.textContent = "Thêm loại"; inpMa.value = ""; inpTen.value = ""; modal.style.display = "block";
    });
    btnCancel.addEventListener("click", () => modal.style.display = "none");
    btnSave.addEventListener("click", () => {
      const ma = inpMa.value.trim(); const ten = inpTen.value.trim();
      if (!ma || !ten) return alert("Mã & tên bắt buộc.");
      if (editingMa) {
        const idx = dsLoai.findIndex(x => x.maLoai === editingMa);
        if (idx === -1) return alert("Không tìm thấy.");
        dsLoai[idx].maLoai = ma; dsLoai[idx].tenLoai = ten;
      } else {
        if (dsLoai.some(x => x.maLoai === ma)) return alert("Mã đã tồn tại.");
        dsLoai.push({ maLoai: ma, tenLoai: ten, an: false });
      }
      save(LS_LOAISP, dsLoai); modal.style.display = "none"; refresh();
    });

    function openEdit(ma) {
      const l = dsLoai.find(x => x.maLoai === ma); if (!l) return alert("Không tìm thấy.");
      editingMa = ma; modalTitle.textContent = "Sửa loại"; inpMa.value = l.maLoai; inpTen.value = l.tenLoai; modal.style.display = "block";
    }
    function toggleAn(ma) {
      const l = dsLoai.find(x => x.maLoai === ma); if (!l) return;
      l.an = !l.an; save(LS_LOAISP, dsLoai); refresh();
    }
    function deleteLoai(ma) {
      if (!confirm("Xóa loại sẽ không xóa sản phẩm thuộc loại đó. Chắc chắn xóa?")) return;
      dsLoai = dsLoai.filter(x => x.maLoai !== ma); save(LS_LOAISP, dsLoai);
      refresh();
    }

    refresh();
  }
//quản lý sản phẩm 
function renderQLSanPham() {
  noiDung.innerHTML = `
    <h3>🛍️ Quản lý sản phẩm</h3>
    <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
      <input id="q_sp_tim" placeholder="Tìm theo mã / tên" style="padding:8px;flex:1;border-radius:6px;border:1px solid #ccc;" />
      <select id="q_sp_loai" style="padding:8px;border-radius:6px;border:1px solid #ccc;">
      </select>
      <button id="q_sp_them" style="padding:8px 12px;background:#e63946;color:#fff;border:none;border-radius:6px;cursor:pointer;">
        ➕ Thêm sản phẩm
      </button>
    </div>

    <table style="margin-top:16px;width:100%;border-collapse:collapse;text-align:center;">
      <thead style="background:#2b2d42;color:#fff;">
        <tr>
          <th style="padding:10px;">Mã SP</th>
          <th style="padding:10px;">Tên</th>
          <th style="padding:10px;">Loại</th>
          <th style="padding:10px;">Loại giày</th>
          <th style="padding:10px;">Hãng</th>
          <th style="padding:10px;">Giá vốn</th>
          <th style="padding:10px;">Tồn</th>
          <th style="padding:10px;">Hình ảnh</th>
          <th style="padding:10px;">Ẩn</th>
          <th style="padding:10px;">Thao tác</th>
        </tr>
      </thead>
      <tbody id="q_sp_tbody"></tbody>
    </table>

    <div id="q_sp_modal" style="display:none;padding:12px;border:1px solid #ddd;margin-top:10px;border-radius:8px;background:#f8f9fa;">
      <h4 id="q_sp_modal_title">Thêm sản phẩm</h4>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <input id="q_sp_ma" placeholder="Mã SP (VD: SP003)" />
        <input id="q_sp_ten" placeholder="Tên sản phẩm" />
        <select id="q_sp_maLoai"></select>
        <select id="loaiGiay"></select>
        <select id="q_sp_hang"></select>
        <input id="q_sp_giaVon" placeholder="Giá vốn (số)" type="number" /> 
       <label for="q_sp_hinh" style="font-weight:500;margin-top:5px;">Hình ảnh sản phẩm:</label>
        <input id="q_sp_hinh" type="file" accept="image/*" />
        <img id="q_sp_hinh_preview" src="" alt="Ảnh xem trước" style="max-width:120px;max-height:120px;display:none;margin-top:5px;border:1px solid #ddd;border-radius:4px;" />
        <textarea id="q_sp_mota" placeholder="Mô tả"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="q_sp_save">💾 Lưu</button>
          <button id="q_sp_cancel">❌ Hủy</button>
        </div>
      </div>
    </div>
  `;


  const tbody = document.getElementById("q_sp_tbody");
  const inputTim = document.getElementById("q_sp_tim");
  const selLoaiFilter = document.getElementById("q_sp_loai");
  const btnThem = document.getElementById("q_sp_them");
  const modal = document.getElementById("q_sp_modal");
  const title = document.getElementById("q_sp_modal_title");
  const inpMa = document.getElementById("q_sp_ma");
  const inpTen = document.getElementById("q_sp_ten");
  const selMaLoai = document.getElementById("q_sp_maLoai");
  const selLoaiGiay = document.getElementById("loaiGiay");
  const selHang = document.getElementById("q_sp_hang");
  const inpGiaVon = document.getElementById("q_sp_giaVon");
  const inpHinh = document.getElementById("q_sp_hinh");
  const imgPreview = document.getElementById("q_sp_hinh_preview"); // Biến cho ảnh preview
  let selectedImageData = null;
  const inpMoTa = document.getElementById("q_sp_mota");
  const btnSave = document.getElementById("q_sp_save");
  const btnCancel = document.getElementById("q_sp_cancel");

  let editingMa = null;
  //ảnh chọn 
  inpHinh.addEventListener("change", () => {
    const file = inpHinh.files[0];
    if (!file) {
      return; 
    }
    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 800; 
    const MIME_TYPE = "image/jpeg"; 
    const QUALITY = 0.7;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL(MIME_TYPE, QUALITY);
        selectedImageData = compressedBase64;
        imgPreview.src = compressedBase64;
        imgPreview.style.display = "block";
        
        console.log(`Ảnh đã được nén! (Kích thước mới: ${width}x${height})`);
      };
    };
    reader.readAsDataURL(file); 
   
  });
  //Loại giày / Phụ kiện
  function populateLoaiGiay(maLoai) {
    const loaiObj = dsLoai.find(l => l.maLoai === maLoai);
    const tenLoai = loaiObj ? loaiObj.tenLoai.toLowerCase() : "";

    if (tenLoai.includes("phụ kiện")) {
      selLoaiGiay.innerHTML = `
        <option value="">Chọn loại phụ kiện</option>
        <option value="vo">Vớ</option>
        <option value="gangtay">Găng tay</option>
        <option value="bongda">Bóng đá</option>
        <option value="tui">Túi</option>
      `;
    } else if (tenLoai.includes("giày")) {
      selLoaiGiay.innerHTML = `
        <option value="">Chọn loại giày</option>
        <option value="giayconhantao">Cỏ nhân tạo</option>
        <option value="giaycotunhien">Cỏ tự nhiên</option>
        <option value="giayfutsal">Futsal</option>
      `;
    } else {
      selLoaiGiay.innerHTML = `<option value="">-- Không có loại phụ --</option>`;
    }
  }

  // Hãng sản xuất
  function populateHang() {
    selHang.innerHTML = `
      <option value=""> Chọn hãng </option>
      <option value="Nike">Nike</option>
      <option value="Adidas">Adidas</option>
      <option value="Puma">Puma</option>
      <option value="Mizuno">Mizuno</option>
      <option value="HangKhac">HangKhac</option>
    `;
  }

  // Cập nhật danh sách loại
  function refreshLoaiOptions() {
    selMaLoai.innerHTML = "";
    selLoaiFilter.innerHTML = `<option value="">-- Lọc theo loại --</option>`;
    dsLoai.forEach(l => {
      if (!l.an) {
        const opt = document.createElement("option");
        opt.value = l.maLoai;
        opt.textContent = `${l.maLoai} - ${l.tenLoai}`;
        selMaLoai.appendChild(opt);
      }
      const opt2 = document.createElement("option");
      opt2.value = l.maLoai;
      opt2.textContent = `${l.maLoai} - ${l.tenLoai}`;
      selLoaiFilter.appendChild(opt2);
    });
  }

  

  // ===== Hàm refresh bảng =====
  function refresh() {
    refreshLoaiOptions();
    const q = inputTim.value.trim().toLowerCase();
    const filterLoai = selLoaiFilter.value;
    tbody.innerHTML = "";

    dsSP
      .filter(s => {
        if (filterLoai && s.maLoai !== filterLoai) return false;
        if (!q) return true;
        return s.ma.toLowerCase().includes(q) || s.ten.toLowerCase().includes(q);
      })
      .forEach(s => {
        const loai = dsLoai.find(l => l.maLoai === s.maLoai);
        const tenLoai = loai ? loai.tenLoai : s.maLoai;
        const tonKhoData = calcBaoCaoTonKho(s.ma, s.ten, null, null);
        const slTon = tonKhoData.tonCuoi || 0;
        const hinhSrc = (s.hinh && s.hinh.trim()) ? s.hinh : 'img/noimage.jpg';
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #ddd";
        tr.innerHTML = `
          <td style="padding:10px;">${s.ma}</td>
          <td style="padding:10px;text-align:left;">${s.ten}</td>
          <td style="padding:10px;">${tenLoai}</td>
          <td style="padding:10px;">${s.loaiGiay || ""}</td>
          <td style="padding:10px;">${s.brand || ""}</td>
          <td style="padding:10px;">${fmt(s.giaVon)}</td>
          <td style="padding:10px;">${slTon}</td>
          <td style="padding:10px;">
            <img src="${s.hinh && s.hinh.trim() ? s.hinh : 'img/noimage.jpg'}" 
                 alt="${s.ten}" 
                 style="width:80px;height:80px;object-fit:cover;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
          </td>
          <td style="padding:10px;">${s.an ? '✔' : ''}</td>
          <td style="padding:10px;">
            <div style="display:flex;gap:6px;justify-content:center;">
              <button data-ma="${s.ma}" class="edit" style="background:#4dabf7;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">Chỉnh sửa</button>
              <button data-ma="${s.ma}" class="toggle" style="background:#ffa94d;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">${s.an ? 'Hiện' : 'Ẩn'}</button>
              <button data-ma="${s.ma}" class="del" style="background:#e03131;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">Xóa</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

    tbody.querySelectorAll(".edit").forEach(b => b.onclick = () => openEdit(b.dataset.ma));
    tbody.querySelectorAll(".toggle").forEach(b => b.onclick = () => toggleAn(b.dataset.ma));
    tbody.querySelectorAll(".del").forEach(b => b.onclick = () => deleteSP(b.dataset.ma));
  }

  // ===== Sự kiện tìm kiếm & lọc =====
  inputTim.addEventListener("input", refresh);
  selLoaiFilter.addEventListener("change", refresh);

  window.addEventListener("storage", (e) => {
    // Nếu thấy đơn hàng thay đổi, tự refresh lại cột Tồn
    if (e.key === LS_DONHANG) { 
      refresh();
    }
  });
  // ===== Sự kiện thêm sản phẩm =====
  btnThem.addEventListener("click", () => {
    editingMa = null;
    selectedImageData = null;
    title.textContent = "Thêm sản phẩm";
    inpMa.value = "";
    inpTen.value = "";
    inpGiaVon.value = "";
    inpHinh.value = "";
    imgPreview.src = "";
    imgPreview.style.display = "none";
    inpMoTa.value = "";
    selHang.value = "";
    refreshLoaiOptions();
    selMaLoai.selectedIndex = 0;
    populateLoaiGiay(selMaLoai.value);
    populateHang();
    selLoaiGiay.value = "";
    modal.style.display = "block";
  });

  btnCancel.addEventListener("click", () => (modal.style.display = "none"));

  // ===== Sự kiện lưu sản phẩm =====
  btnSave.addEventListener("click", () => {
    const ma = inpMa.value.trim();
    const ten = inpTen.value.trim();
    const maLoai = selMaLoai.value;
    const loaiGiay = selLoaiGiay.value.trim();
    const hang = selHang.value.trim();
    const giaVon = Number(inpGiaVon.value || 0);
    const hinh = selectedImageData;
    const moTa = inpMoTa.value.trim();

    if (!ma || !ten || !maLoai) return alert("Mã, tên và loại bắt buộc.");

    const loaiObj = dsLoai.find(l => l.maLoai === maLoai);
    const tenLoai = loaiObj ? loaiObj.tenLoai.toLowerCase() : "";
    const isAccessory = loaiGiay && ["bongda", "vo", "gangtay", "tui"].includes(loaiGiay.toLowerCase());

    const brandFinal = hang || "hangkhac";

    if (editingMa) {
      const idx = dsSP.findIndex(x => x.ma === editingMa);
      if (idx === -1) return alert("Không tìm thấy sản phẩm.");
      dsSP[idx] = {
        ma, maLoai, ten, hinh: hinh, moTa, giaVon,
        loaiGiay,
        brand: brandFinal,
        accessory: isAccessory ? loaiGiay : "none",
        an: dsSP[idx].an || false
      };
    } else {
      if (dsSP.some(x => x.ma === ma)) return alert("Mã SP đã tồn tại.");
      dsSP.push({
        ma, maLoai, ten, hinh: hinh, moTa, giaVon,
        loaiGiay,
        brand: brandFinal,
        accessory: isAccessory ? loaiGiay : "none",
        an: false
      });
    }

    save(LS_SP, dsSP); 
    capNhatSanPhamUser();
    modal.style.display = "none";
    refresh();
    alert("✅ Đã lưu sản phẩm và cập nhật cho trang người dùng!");
  });

  // ===== Hàm sửa sản phẩm =====
  function openEdit(ma) {
    const s = dsSP.find(x => x.ma === ma);
    if (!s) return alert("Không tìm thấy sản phẩm.");
    editingMa = ma;
    title.textContent = "Sửa sản phẩm";

    inpMa.value = s.ma;
    inpTen.value = s.ten;
    inpGiaVon.value = s.giaVon;
    inpHinh.value = ""; 
    selectedImageData = s.hinh;
    if (s.hinh) { 
      imgPreview.src = s.hinh;
      imgPreview.style.display = "block";
    } else {
      imgPreview.style.display = "none";
    }
    inpMoTa.value = s.moTa || "";
    refreshLoaiOptions();
    selMaLoai.value = s.maLoai;
    populateLoaiGiay(s.maLoai);
    populateHang();
    selLoaiGiay.value = s.loaiGiay || s.accessory || "";
    selHang.value = s.brand || "hangkhac";

    modal.style.display = "block";
  }

  // ===== Ẩn/Hiện sản phẩm =====
  function toggleAn(ma) {
    const s = dsSP.find(x => x.ma === ma);
    if (!s) return;
    s.an = !s.an;
    save(LS_SP, dsSP); 
    capNhatSanPhamUser();
    refresh();
  }

  // ===== Xóa sản phẩm =====
  function deleteSP(ma) {
    if (!confirm("Xóa sản phẩm sẽ xóa vĩnh viễn. Chắc chắn?")) return;
    dsSP = dsSP.filter(x => x.ma !== ma);
    save(LS_SP, dsSP); 
    capNhatSanPhamUser();
    refresh();
  }

  refresh();
  capNhatSanPhamUser(); 
  console.log("ADMIN: Đã tự động cập nhật 'sanPhamTrangChu' cho user.");
 
}

window.addEventListener("storage", (e) => {
  if (e.key === "sanPhamTrangChu") {
    console.log("🔄 Trang user được cập nhật sản phẩm mới từ admin!");
  }
});
  //Quản lý Phiếu nhập
function renderQLPhieuNhap() {
  noiDung.innerHTML = `
    <h3>📥 Quản lý phiếu nhập</h3>
    <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
      <input id="q_pn_tim" placeholder="Tìm theo mã / ngày" style="padding:8px;flex:1;" />
      <button id="q_pn_them">➕ Tạo phiếu nhập</button>
    </div>
    <table style="margin-top:12px;">
      <thead><tr><th>Mã phiếu</th><th>Ngày</th><th>Chi tiết</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
      <tbody id="q_pn_tbody"></tbody>
    </table>

    <div id="q_pn_modal" style="display:none;padding:12px;border:1px solid #ddd;margin-top:10px;border-radius:8px;">
      <h4 id="q_pn_title">Tạo phiếu nhập</h4>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <input id="q_pn_ma" placeholder="Mã phiếu (VD: PN002)" />
        <input id="q_pn_ngay" type="date" />
        <div style="display:flex;gap:8px;">
          <select id="q_pn_sp"></select>
          <input id="q_pn_sl" type="number" placeholder="Số lượng" />
          <input id="q_pn_gianhap" type="number" placeholder="Giá nhập" />
          <button id="q_pn_addct">Thêm</button>
        </div>
        <div id="q_pn_chitiet" style="min-height:40px;border:1px dashed #ddd;padding:8px;"></div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="q_pn_save">Lưu phiếu</button>
          <button id="q_pn_cancel">Hủy</button>
          <button id="q_pn_hoanthanh" style="background:#28a745;color:#fff">Hoàn thành</button>
        </div>
      </div>
    </div>
  `;

  const tbody = document.getElementById("q_pn_tbody");
  const inputTim = document.getElementById("q_pn_tim");
  const btnThem = document.getElementById("q_pn_them");
  const modal = document.getElementById("q_pn_modal");
  const title = document.getElementById("q_pn_title");
  const inpMa = document.getElementById("q_pn_ma");
  const inpNgay = document.getElementById("q_pn_ngay");
  const selSP = document.getElementById("q_pn_sp");
  const inpSL = document.getElementById("q_pn_sl");
  const inpGiaNhap = document.getElementById("q_pn_gianhap");
  const btnAddCT = document.getElementById("q_pn_addct");
  const divCT = document.getElementById("q_pn_chitiet");
  const btnSave = document.getElementById("q_pn_save");
  const btnCancel = document.getElementById("q_pn_cancel");
  const btnHoanThanh = document.getElementById("q_pn_hoanthanh");

  let editingMa = null;
  let curChiTiet = []; 

 // Chi tiết phiếu hiện tại
  function refreshSPoptions() {
    selSP.innerHTML = "";
    dsSP.forEach(s => {
      if (!s.an) {
        const opt = document.createElement("option");
        opt.value = s.ma;
        opt.textContent = `${s.ma} - ${s.ten}`;
        selSP.appendChild(opt);
      }
    });
  }

  //Hàm refresh bảng
  function refresh() {
    refreshSPoptions();
    const q = inputTim.value.trim().toLowerCase();
    tbody.innerHTML = "";
    dsPhieu.filter(p => {
      if (!q) return true;
      return p.maPN.toLowerCase().includes(q) || p.ngay.toLowerCase().includes(q);
    }).forEach(p => {
      const ct = p.chiTiet.map(c => `${c.ma} x${c.sl}`).join(", ");
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${p.maPN}</td><td>${p.ngay}</td><td>${ct}</td><td>${p.trangthai}</td>
        <td class="actions-cell">
        <button data-ma="${p.maPN}" class="btn btn-action btn-warning edit">Chỉnh Sửa</button>
         <button data-ma="${p.maPN}" class="btn btn-action btn-success toggle">${p.trangthai === 'Chưa hoàn thành' ? 'Hoàn thành' : 'Hoàn thành'}</button>
        <button data-ma="${p.maPN}" class="btn btn-action btn-danger del">Xóa</button>
</td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("button.edit").forEach(b => b.addEventListener("click", () => openEdit(b.dataset.ma)));
    tbody.querySelectorAll("button.toggle").forEach(b => b.addEventListener("click", () => completePN(b.dataset.ma)));
    tbody.querySelectorAll("button.del").forEach(b => b.addEventListener("click", () => deletePN(b.dataset.ma)));
  }

  inputTim.addEventListener("input", refresh);

  // Tạo phiếu mới
  btnThem.addEventListener("click", () => {
    editingMa = null; curChiTiet = [];
    inpMa.value = ""; inpNgay.value = (new Date()).toISOString().slice(0,10);
    title.textContent = "Tạo phiếu nhập"; divCT.innerHTML = ""; refreshSPoptions();
    modal.style.display = "block";
  });

  btnCancel.addEventListener("click", () => modal.style.display = "none");

  //  Thêm chi tiết phiếu nhập
  btnAddCT.addEventListener("click", () => {
    const maSP = selSP.value; 
    const sl = Number(inpSL.value||0); 
    const gia = Number(inpGiaNhap.value||0);
    if (!maSP || sl<=0 || gia<=0) return alert("Chọn SP, nhập SL và giá nhập hợp lệ.");
    curChiTiet.push({ ma: maSP, sl, giaNhap: gia });
    renderCT();
  });

  function renderCT() {
    if (!curChiTiet.length) { divCT.innerHTML = "<i>Chưa có chi tiết</i>"; return; }
    divCT.innerHTML = curChiTiet.map((c, i) => `<div>${i+1}. ${c.ma} - SL:${c.sl} - Giá:${fmt(c.giaNhap)} 
    <button data-i="${i}" class="ctdel" style="font-size: 0.75em; padding: 0 5px; line-height: 1.5; vertical-align: middle;">X</button></div>`).join("");
    divCT.querySelectorAll("button.ctdel").forEach(b => b.addEventListener("click", () => {
      curChiTiet.splice(Number(b.dataset.i),1); renderCT();
    }));
  }

  // Lưu phiếu
  btnSave.addEventListener("click", () => {
    const ma = inpMa.value.trim(); const ngay = inpNgay.value.trim();
    if (!ma || !ngay) return alert("Mã & ngày bắt buộc.");
    if (!curChiTiet.length) return alert("Phiếu phải có ít nhất 1 sản phẩm.");
    if (editingMa) {
      const idx = dsPhieu.findIndex(x => x.maPN === editingMa); if (idx === -1) return alert("Không tìm thấy.");
      if (dsPhieu[idx].trangthai !== "Chưa hoàn thành") return alert("Chỉ được sửa phiếu trước khi hoàn thành.");
      dsPhieu[idx].maPN = ma; dsPhieu[idx].ngay = ngay; dsPhieu[idx].chiTiet = JSON.parse(JSON.stringify(curChiTiet));
    } else {
      if (dsPhieu.some(x => x.maPN === ma)) return alert("Mã phiếu đã tồn tại.");
      dsPhieu.push({ maPN: ma, ngay, chiTiet: JSON.parse(JSON.stringify(curChiTiet)), trangthai: "Chưa hoàn thành" });
    }
    save(LS_PHIEUNHAP, dsPhieu); modal.style.display = "none"; refresh(); refreshTonKho();
  });

  // Hoàn thành phiếu
  btnHoanThanh.addEventListener("click", () => {
    if (!editingMa) {
      if (!confirm("Hoàn thành phiếu hiện tại?")) return;
      const ma = inpMa.value.trim(); const ngay = inpNgay.value.trim();
      if (!ma || !ngay) return alert("Mã & ngày bắt buộc.");
      if (!curChiTiet.length) return alert("Phiếu phải có ít nhất 1 sản phẩm.");
      if (dsPhieu.some(x => x.maPN === ma)) return alert("Mã phiếu đã tồn tại.");
      dsPhieu.push({ maPN: ma, ngay, chiTiet: JSON.parse(JSON.stringify(curChiTiet)), trangthai: "Đã hoàn thành" });
    } else {
      const idx = dsPhieu.findIndex(x => x.maPN === editingMa);
      if (idx === -1) return alert("Không tìm thấy.");
      if (dsPhieu[idx].trangthai !== "Chưa hoàn thành") return alert("Phiếu đã hoàn thành.");
      dsPhieu[idx].trangthai = "Đã hoàn thành";
    }
    save(LS_PHIEUNHAP, dsPhieu); modal.style.display = "none"; refresh(); refreshTonKho();
  });

  // Chỉnh sửa phiếu
  function openEdit(ma) {
    const p = dsPhieu.find(x => x.maPN === ma); if (!p) return alert("Không tìm thấy.");
    editingMa = p.maPN;
    inpMa.value = p.maPN; inpNgay.value = p.ngay; curChiTiet = JSON.parse(JSON.stringify(p.chiTiet)); renderCT();
    title.textContent = "Sửa phiếu nhập"; refreshSPoptions(); modal.style.display = "block";
  }

  //Hoàn thành theo nút toggle 
  function completePN(ma) {
    const p = dsPhieu.find(x => x.maPN === ma); if (!p) return;
    if (p.trangthai === "Đã hoàn thành") { alert("Phiếu đã hoàn thành."); return; }
    if (!confirm("Hoàn thành phiếu nhập?")) return;
    p.trangthai = "Đã hoàn thành"; save(LS_PHIEUNHAP, dsPhieu); refresh(); refreshTonKho();
  }

  //Xóa phiếu
  function deletePN(ma) {
    if (!confirm("Xóa phiếu (không thể khôi phục). Chắc chắn?")) return;
    dsPhieu = dsPhieu.filter(x => x.maPN !== ma); save(LS_PHIEUNHAP, dsPhieu); refresh(); refreshTonKho();
  }

  refresh();
}
  //Quản lý Giá bán
function renderQLGiaBan() {
    noiDung.innerHTML = `
        <h3>💰 Quản lý giá bán</h3>
        
        <div class="modal" style="margin-bottom: 16px;">
            <h4>Thiết lập theo Loại sản phẩm</h4>
            <div style="display:flex;gap:8px;align-items:center;">
                <select id="q_gb_loai" class="form-control" style="flex:1;">
                    <option value="">Chọn Loại SP</option>
                </select>
                <input id="q_gb_loai_pt" class="form-control" placeholder="% lợi nhuận (VD: 15)" type="number" style="flex:1;" />
                <button id="q_gb_loai_save" class="btn btn-primary">Lưu</button>
            </div>
        </div>

        <div class="modal">
            <h4>Thiết lập theo Sản Phẩm </h4>
            <div style="display:flex;gap:8px;align-items:center;">
                <select id="q_gb_sp" class="form-control" style="flex:1;">
                    <option value="">Chọn SP để chỉnh</option>
                </select>
                <input id="q_gb_sp_pt" class="form-control" placeholder="% lợi nhuận (VD: 15)" type="number" style="flex:1;" />
                <button id="q_gb_sp_save" class="btn btn-primary">Lưu</button>
            </div>
        </div>

        <h4 style="margin-top: 20px;">Tra cứu </h4>
        
        <div class="flex-row" style="margin-bottom: 12px;">
            <input id="q_gb_tim" placeholder="Tra cứu theo giá vốn & giá bán " class="form-control" style="flex: 1;" />
        </div>
        
        <table>
            <thead><tr><th>Mã SP</th><th>Tên</th><th>Giá vốn</th><th>% Lợi nhuận (Áp dụng)</th><th>Giá bán</th><th>Thao tác</th></tr></thead>
            <tbody id="q_gb_tbody"></tbody>
        </table>
    `;

    
    const selSP = document.getElementById("q_gb_sp");
    const inpSpPT = document.getElementById("q_gb_sp_pt");
    const btnSpSave = document.getElementById("q_gb_sp_save");
    const tbody = document.getElementById("q_gb_tbody");
    const selLoai = document.getElementById("q_gb_loai");
    const inpLoaiPT = document.getElementById("q_gb_loai_pt");
    const btnLoaiSave = document.getElementById("q_gb_loai_save");
    
    const inputTim = document.getElementById("q_gb_tim"); 

    function refresh() {
        selLoai.innerHTML = `<option value="">Chọn Loại SP</option>`;
        dsLoai.forEach(loai => {
            if (loai.an) return;
            const opt = document.createElement("option"); 
            opt.value = loai.maLoai; 
            opt.textContent = `${loai.maLoai} - ${loai.tenLoai}`;
            selLoai.appendChild(opt);
        });
        selSP.innerHTML = `<option value="">Chọn SP để chỉnh</option>`;
        dsSP.forEach(s => {
            if (!s.an) {
                const opt = document.createElement("option"); 
                opt.value = s.ma; 
                opt.textContent = `${s.ma} - ${s.ten}`; 
                selSP.appendChild(opt);
            }
        });

        tbody.innerHTML = "";
        const q = inputTim.value.trim().toLowerCase();
        const enhancedData = dsSP
            .filter(s => !s.an)
            .map(s => {
                const giaVon = Number(s.giaVon || 0);
                const gsp = dsGia.find(x => x.maSP === s.ma);
                let pt = gsp ? gsp.phanTram : null;
                let nguon = gsp ? "SP" : "";

                if (pt == null) {
                    const gLoai = dsGia.find(x => x.maLoai === s.maLoai);
                    if (gLoai) {
                        pt = gLoai.phanTram;
                        nguon = "Loại";
                    }
                }
                const giaBan = pt != null ? Math.round(giaVon * (1 + (pt/100))) : ""; 
                const ptText = pt != null ? `${pt}% (${nguon})` : '<i>Chưa set</i>';
                return {
                    ma: s.ma, ten: s.ten, giaVon: giaVon, pt: pt, 
                    ptText: ptText, giaBan: giaBan, gsp: gsp 
                };
            });
        enhancedData
            .filter(item => {
                if (!q) return true; 
                const giaVonStr = item.giaVon.toString();
                const ptStr = item.pt != null ? item.pt.toString() : "";
                const giaBanStr = item.giaBan.toString();

              
                return giaVonStr.includes(q) ||
                       ptStr.includes(q) ||
                       giaBanStr.includes(q);
            })
            .forEach(item => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${item.ma}</td>
                    <td>${item.ten}</td>
                    <td>${fmt(item.giaVon)}</td>
                    <td>${item.ptText}</td>
                    <td>${item.giaBan ? fmt(item.giaBan) : ''}</td>
                    <td class="actions-cell">
                        <button data-ma="${item.ma}" class="btn btn-action btn-danger reset" ${!item.gsp ? 'disabled' : ''}>Xóa (SP)</button>
                    </td>`;
                tbody.appendChild(tr);
            });
        tbody.querySelectorAll("button.reset").forEach(b => b.addEventListener("click", () => {
            const ma = b.dataset.ma;
            dsGia = dsGia.filter(x => x.maSP !== ma); 
            save(LS_GIABAN, dsGia); 
            refresh();
        }));
    }

    btnSpSave.addEventListener("click", () => {
        const ma = selSP.value; 
        const pt = Number(inpSpPT.value || 0); 
        if (!ma) return alert("Chọn SP.");
        if (pt < 0) return alert("Tỉ lệ không hợp lệ.");

        const ex = dsGia.find(x => x.maSP === ma);
        if (ex) { 
            ex.phanTram = pt; 
            delete ex.maLoai; 
        } else { 
            dsGia.push({ maSP: ma, phanTram: pt }); 
        }
        
        save(LS_GIABAN, dsGia); 
        refresh(); 
        inpSpPT.value = "";
        capNhatSanPhamUser();
    });

    btnLoaiSave.addEventListener("click", () => {
        const ma = selLoai.value; 
        const pt = Number(inpLoaiPT.value || 0);
        if (!ma) return alert("Chọn Loại SP.");
        if (pt < 0) return alert("Tỉ lệ không hợp lệ.");

        const ex = dsGia.find(x => x.maLoai === ma);
        if (ex) { 
            ex.phanTram = pt; 
            delete ex.maSP;
        } else { 
            dsGia.push({ maLoai: ma, phanTram: pt }); 
        }
        
        save(LS_GIABAN, dsGia); 
        refresh(); 
        inpLoaiPT.value = "";
        capNhatSanPhamUser();
    });

    inputTim.addEventListener("input", refresh);


    refresh();
}
// Quản lý đơn hàng
function renderAdminOrdersUI() {
  const containerId = "admin-order-list";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.padding = "12px";
    const nd = document.getElementById("noiDung") || document.body;
    nd.innerHTML = "";
    nd.appendChild(container);
  }
  const statusOptions = ['Mới đặt', 'Đã xử lý', 'Đã giao', 'Hủy'];
  container.innerHTML = `
    <h3>📦 Quản lý đơn hàng</h3>
    
    <div id="admin-filter-bar" style="padding: 10px; background: #f9f9f9; border-radius: 4px; margin-bottom: 12px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
      <div>
        <label for="filter_start_date" style="font-size: 13px; margin-right: 5px;">Từ ngày:</label>
        <input type="date" id="filter_start_date" style="padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      <div>
        <label for="filter_end_date" style="font-size: 13px; margin-right: 5px;">Đến ngày:</label>
        <input type="date" id="filter_end_date" style="padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      <div>
        <label for="filter_status" style="font-size: 13px; margin-right: 5px;">Trạng thái:</label>
        <select id="filter_status" style="padding: 7px 8px; border: 1px solid #ccc; border-radius: 4px;">
          <option value="">Tất cả</option>
          ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <button id="admin_filter_reset" style="padding: 6px 10px; background: #eee; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Xóa lọc</button>
    </div>
    
    <div id="admin_orders_list" style="border-top:1px solid #eee">
      </div>
  `;
  const listWrap = container.querySelector("#admin_orders_list");
  function loadAdminOrders() {
    try {
      const raw = localStorage.getItem("ws_donhang_v1") || "[]";
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function saveAdminOrders(list) {
    localStorage.setItem("ws_donhang_v1", JSON.stringify(list || []));
  }
  function buildList() {
    const list = loadAdminOrders();
    const filterStartDate = document.getElementById("filter_start_date")?.value;
    const filterEndDate = document.getElementById("filter_end_date")?.value;
    const filterStatus = document.getElementById("filter_status")?.value;


    const filteredList = list.filter(o => {
        if (filterStatus && o.trangthai !== filterStatus) {
            return false;
        }
        let orderDate = null;
        if (o.ngay && !isNaN(new Date(o.ngay).getTime())) {
            orderDate = new Date(o.ngay);
            orderDate.setHours(0, 0, 0, 0); 
        } else if (filterStartDate || filterEndDate) {
     
            return false; 
        }

        if (filterStartDate) {
            const startDate = new Date(filterStartDate);
            if (orderDate < startDate) return false;
        }
        
        if (filterEndDate) {
            const endDate = new Date(filterEndDate);
            if (orderDate > endDate) return false;
        }
        
        return true;
    });
    if (filteredList.length === 0) {
      listWrap.innerHTML = "<p>❌ Không có đơn hàng nào (hoặc không khớp với bộ lọc).</p>";
      return;
    }
    listWrap.innerHTML = filteredList.map(o => {
      const shortItems = (o.chiTiet || []).slice(0, 2)
        .map(it => `${it.ten} x${it.sl}`).join(", ");
      let ngayHienThi = '';
      if (o.ngay && !isNaN(new Date(o.ngay).getTime())) {
          ngayHienThi = new Date(o.ngay).toLocaleString('vi-VN');
      } else {
          ngayHienThi = o.ngay || ''; 
      }
      const tongTienHienThi = (typeof fmt === 'function' ? fmt(o.tongTien || 0) : (o.tongTien || 0));
      const tt = o.trangthai;
      let selectStyle = "padding: 6px 8px; border-radius: 4px; border: 1px solid #ccc; min-width: 120px;";
      if (tt === 'Đã giao') {
        selectStyle += "color: green; border-color: green;";
      } else if (tt === 'Hủy') {
        selectStyle += "color: red; border-color: red;";
      } else if (tt === 'Đang xử lý') {
        selectStyle += "color: blue; border-color: blue;";
      }

      const actionHtml = `
        <select class="admin-status-select" data-ma="${o.maDH}" style="${selectStyle}">
          ${statusOptions.map(status => `
            <option value="${status}" ${tt === status ? 'selected' : ''}>
              ${status}
            </option>
          `).join('')}
        </select>
      `;

      return `
      <div class="admin-order-row" data-ma="${o.maDH}" style="border-bottom:1px solid #eee;padding:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1">
          <div style="font-weight:600">${o.maDH} <span style="font-weight:400;color:#666;margin-left:8px">${ngayHienThi}</span></div>
          <div style="color:#333;margin-top:6px">${o.khach || ''} ${o.sdt ? "· " + o.sdt : ""}</div>
          <div style="color:#444;margin-top:6px">${shortItems}${(o.chiTiet||[]).length>2 ? " …" : ""}</div>
        </div>
        <div style="min-width:220px;text-align:right">
          <div style="font-weight:700">${tongTienHienThi}₫</div> 
          
          <div style="margin-top:8px; height: 30px; line-height: 30px;"> 
            ${actionHtml}
          </div>
          <div style="margin-top:8px">
            <button class="admin-view-btn" data-ma="${o.maDH}" style="margin-right:6px;padding:6px 8px">Xem</button>
            <button class="admin-delete-btn" data-ma="${o.maDH}" style="padding:6px 8px;background:#ff4d4f;color:#fff;border:0">Xóa</button>
          </div>
        </div>
      </div>`;
    }).join("");

  }
  listWrap.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".admin-view-btn");
      if (viewBtn) { openAdminOrderModal(viewBtn.dataset.ma); return; }

      const delBtn = e.target.closest(".admin-delete-btn");
      if (delBtn) {
        const ma = delBtn.dataset.ma;
        if (!confirm("Xóa đơn " + ma + " ?")) return;
        const cur = loadAdminOrders().filter(x => x.maDH !== ma);
        saveAdminOrders(cur);
        if (typeof dsDon !== 'undefined') dsDon = cur; 
        buildList();
      }
    });
    
  listWrap.addEventListener("change", (e) => {
      const select = e.target.closest(".admin-status-select");
      if (!select) return;

      const ma = select.dataset.ma;
      const newStatus = select.value;

      if (!confirm(`Cập nhật trạng thái đơn ${ma} thành "${newStatus}"?`)) {
        const list = loadAdminOrders();
        const o = list.find(x => x.maDH === ma);
        if(o) select.value = o.trangthai;
        return;
      }

      const listNow = loadAdminOrders();
      const idx = listNow.findIndex(x => x.maDH === ma);
      if (idx === -1) return;

      listNow[idx].trangthai = newStatus;
      saveAdminOrders(listNow);
      if (typeof dsDon !== 'undefined') dsDon = listNow; 
    if (typeof window.refreshTonKhoModule === "function") {
        if (newStatus === 'Đã giao') {
           console.log("Admin: Đơn hàng 'Đã giao', đang gọi refresh Tồn Kho...");
           window.refreshTonKhoModule();
        }
      }
      buildList(); 
    });

  
  container.querySelector("#filter_start_date").addEventListener("change", buildList);
  container.querySelector("#filter_end_date").addEventListener("change", buildList);
  container.querySelector("#filter_status").addEventListener("change", buildList);
  container.querySelector("#admin_filter_reset").addEventListener("click", () => {
      document.getElementById("filter_start_date").value = "";
      document.getElementById("filter_end_date").value = "";
      document.getElementById("filter_status").value = "";
      buildList();
  });


  function openAdminOrderModal(maDH) {
    const list = loadAdminOrders();
    const o = list.find(x => x.maDH === maDH);
    if (!o) return alert("Không tìm thấy đơn.");

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = 9999;

    const box = document.createElement("div");
    box.style.width = "720px";
    box.style.maxHeight = "80%";
    box.style.overflow = "auto";
    box.style.background = "#fff";
    box.style.padding = "18px";
    box.style.borderRadius = "6px";
    box.style.color = "#333"; 

    let ngayHienThiModal = '';
    if (o.ngay && !isNaN(new Date(o.ngay).getTime())) {
        ngayHienThiModal = new Date(o.ngay).toLocaleString('vi-VN');
    } else {
        ngayHienThiModal = o.ngay || '';
    }
    const tongTienModal = (typeof fmt === 'function' ? fmt(o.tongTien || 0) : (o.tongTien || 0));
    const chiTietHtml = (o.chiTiet || []).map(it => `
      <div style="padding:6px 0;border-bottom:1px dashed #eee">
        ${it.ma} · ${it.ten} x${it.sl} · ${(typeof fmt === 'function' ? fmt(it.gia || 0) : (it.gia || 0))}₫ 
      </div>
    `).join("");

    box.innerHTML = `
      <h3>Đơn ${o.maDH}</h3>
      <p><strong>Khách:</strong> ${o.khach || ""} ${o.sdt ? "· " + o.sdt : ""}</p>
      <p><strong>Ngày:</strong> ${ngayHienThiModal}</p>
      <p><strong>Trạng thái:</strong> ${o.trangthai || ""}</p>
      <h4>Chi tiết sản phẩm</h4>
      <div>${chiTietHtml}</div>
      <h4>Tổng: ${tongTienModal}₫</h4> 
      <div style="margin-top:12px;text-align:right">
        <button id="admin_close_modal" style="padding:8px 12px;margin-right:8px">Đóng</button>
      </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    modal.querySelector("#admin_close_modal").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  }
  
  buildList(); 
  
  window.addEventListener("storage", (e) => {
    if (e.key === "ws_donhang_v1") {
        if (typeof dsDon !== 'undefined') dsDon = loadAdminOrders();
    }
  });
}
// Quản Lý  tồn kho
function calcBaoCaoTonKho(maSP, tenSP, startDateStr, endDateStr) {
  let tonDau = 0;
  let nhapTrongKy = 0;
  let xuatTrongKy = 0;

  const tenSP_normalized = tenSP ? tenSP.trim().toLowerCase() : null;
  if (!tenSP_normalized) {
    return { tonDau: 0, nhapTrongKy: 0, xuatTrongKy: 0, tonCuoi: 0 };
  }
  const startTime = startDateStr ? new Date(startDateStr).setHours(0, 0, 0, 0) : null;
  const endTime = endDateStr ? new Date(endDateStr).setHours(23, 59, 59, 999) : null;
  dsPhieu.forEach(p => {
    if (p.trangthai !== "Đã hoàn thành") return;
    const pDate = p.ngay ? new Date(p.ngay).getTime() : null;
    if (!pDate) return;

    const sl = p.chiTiet.reduce((sum, c) => 
      (c.ma === maSP) ? sum + Number(c.sl || 0) : sum, 0);
    if (sl === 0) return;
    if (startTime && pDate < startTime) {
      tonDau += sl;
    } else if (startTime && endTime && pDate >= startTime && pDate <= endTime) {
      nhapTrongKy += sl;
    } else if (startTime && !endTime && pDate >= startTime) {
      nhapTrongKy += sl;
    } else if (!startTime && endTime && pDate <= endTime) {
      nhapTrongKy += sl;
    } else if (!startTime && !endTime) {
  nhapTrongKy += sl;
    }
  });

 
  dsDon.forEach(d => {
    const trangthai = (d.trangthai || '').toLowerCase();
   if (d.trangthai !== "Đã giao" && d.trangthai !== "Đang giao") return;
    const dDate = d.ngay ? new Date(d.ngay).getTime() : null;
    if (!dDate) return; 

   const sl = d.chiTiet.reduce((sum, c) => {
    const maTrongDon = c.ma || c.id || "";
    return (maTrongDon === maSP) ? sum + Number(c.sl || 0) : sum;
    }, 0);
    
    if (sl === 0) return;

    if (startTime && dDate < startTime) {
      tonDau -= sl;
    } else if (startTime && endTime && dDate >= startTime && dDate <= endTime) {
      xuatTrongKy += sl;
    } else if (startTime && !endTime && dDate >= startTime) {
      xuatTrongKy += sl;
    } else if (!startTime && endTime && dDate <= endTime) {
      xuatTrongKy += sl;
    } else if (!startTime && !endTime) {
  xuatTrongKy += sl;
    }
  });
  const tonCuoi = tonDau + nhapTrongKy - xuatTrongKy;
  return { tonDau, nhapTrongKy, xuatTrongKy, tonCuoi };
}
function renderQLTonKho() {
  const loaiOptions = (typeof dsLoai !== 'undefined' && Array.isArray(dsLoai))
    ? dsLoai.map(l => `<option value="${l.maLoai}">${l.tenLoai}</option>`).join('')
    : ''; 
  

  const noiDung = document.getElementById("noiDung"); 
  noiDung.innerHTML = `
    <h3>📊 Quản lý tồn kho (Báo cáo Nhập-Xuất-Tồn)</h3>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; margin-bottom: 12px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
      <div>
        <label style="font-size: 13px; display: block; margin-bottom: 4px;">Tìm kiếm:</label>
        <input id="q_tk_tim" placeholder="Tìm mã / tên SP" style="padding:8px; width: 100%; box-sizing: border-box;" />
      </div>
      <div>
        <label style="font-size: 13px; display: block; margin-bottom: 4px;">Ngưỡng cảnh báo (cho Tồn Cuối):</label>
        <input id="q_tk_threshold" type="number" placeholder="VD: 5" style="width:100%;padding:8px; box-sizing: border-box;" />
      </div>
      <div>
        <label style="font-size: 13px; display: block; margin-bottom: 4px;">Lọc theo loại:</label>
        <select id="q_tk_loai" style="padding:8px; width: 100%; box-sizing: border-box;">
          <option value="">Tất cả các loại</option>
          ${loaiOptions}
        </select>
      </div>
      <div style="display: flex; gap: 8px;">
        <div style="flex: 1;">
          <label style="font-size: 13px; display: block; margin-bottom: 4px;">Từ ngày (Bắt đầu kỳ):</label>
          <input id="q_tk_start" type="date" style="padding:7px 8px; width: 100%; box-sizing: border-box;" />
        </div>
        <div style="flex: 1;">
          <label style="font-size: 13px; display: block; margin-bottom: 4px;">Đến ngày (Kết thúc kỳ):</label>
          <input id="q_tk_end" type="date" style="padding:7px 8px; width: 100%; box-sizing: border-box;" />
        </div>
      </div>
    </div>
    <button id="q_tk_reset" style="padding: 6px 10px; margin-bottom: 12px;">Xóa bộ lọc ngày</button>

    <table style="margin-top:12px; width: 100%;">
      <thead>
        <tr>
          <th>Mã SP</th>
          <th>Tên</th>
          <th>Tồn Đầu Kỳ</th>
          <th>Nhập Trong Kỳ</th>
          <th>Xuất Trong Kỳ</th>
          <th>Tồn Cuối Kỳ</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody id="q_tk_tbody"></tbody>
    </table>
    <p style="margin-top:8px;">
      <i><b>Lưu ý:</b>
        <br>- <b>Tồn</b> = (Tổng Nhập từ Phiếu "Đã hoàn thành") - (Tổng Xuất từ Đơn "Đã giao" hoặc "Đang giao").
        <br>- Nếu không chọn ngày bắt đầu, <b>Tồn Đầu Kỳ = 0</b>.
        <br>- Nếu không chọn ngày nào, <b>Tồn Cuối Kỳ = Tồn Kho Hiện Tại</b>.
      </i>
    </p>
  `;

  const inputTim = document.getElementById("q_tk_tim");
  const inputThres = document.getElementById("q_tk_threshold");
  const tbody = document.getElementById("q_tk_tbody");
  
  const inputLoai = document.getElementById("q_tk_loai");
  const inputStart = document.getElementById("q_tk_start");
  const inputEnd = document.getElementById("q_tk_end");
  const btnReset = document.getElementById("q_tk_reset");

  function refresh() {
    dsDon = JSON.parse(localStorage.getItem("ws_donhang_v1") || "[]");
    dsPhieu = JSON.parse(localStorage.getItem("ws_phieunhap_v1") || "[]");
    const q = inputTim.value.trim().toLowerCase();
    const thres = Number(inputThres.value || 5); 
    const startDate = inputStart.value; 
    const endDate = inputEnd.value; 
    const maLoaiFilter = inputLoai.value;
   
    
    tbody.innerHTML = "";
    
    dsSP.filter(s => {
      if (s.an) return false;
      if (maLoaiFilter && s.maLoai !== maLoaiFilter) return false;
      if (!q) return true;
      return s.ma.toLowerCase().includes(q) || s.ten.toLowerCase().includes(q);
      
    }).forEach(s => {
      const data = calcBaoCaoTonKho(s.ma, s.ten, startDate, endDate);
      const tonCuoi = data.tonCuoi;
      const status = tonCuoi <= thres 
        ? (tonCuoi <= 0 ? '<span style="color:red">Hết hàng</span>' : '<span style="color:red">Sắp hết</span>') 
        : '<span style="color:green">Bình thường</span>';
        
      const tr = document.createElement("tr");
      
      tr.innerHTML = `
        <td>${s.ma}</td>
        <td>${s.ten}</td>
        <td>${data.tonDau}</td>
        <td>${data.nhapTrongKy > 0 ? `<span style="color:blue; font-weight: 600;">+${data.nhapTrongKy}</span>` : 0}</td>
        <td>${data.xuatTrongKy > 0 ? `<span style="color:red; font-weight: 600;">-${data.xuatTrongKy}</span>` : 0}</td>
        <td style="font-weight: 700;">${tonCuoi}</td>
        <td>${status}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  window.refreshTonKhoModule = refresh;
  inputTim.addEventListener("input", refresh);
  inputThres.addEventListener("input", refresh);
  inputLoai.addEventListener("change", refresh);
  inputStart.addEventListener("change", refresh);
  inputEnd.addEventListener("change", refresh);
  
  btnReset.addEventListener("click", () => {
    inputStart.value = "";
    inputEnd.value = "";
    refresh();
  });
  
  refresh();

  window.addEventListener("storage", (e) => {
    const LS_DONHANG = "ws_donhang_v1"; 
    const LS_PHIEU = "ws_phieunhap_v1"; 

    if (e.key === LS_DONHANG || e.key === LS_PHIEU) {
        refresh();
    }
  });
}
try {
  window.syncOrdersToAdmin = syncOrdersToAdmin;
  window.renderAdminOrdersUI = renderAdminOrdersUI;
} catch (e) {}
  //Khi đăng nhập thành công
  function hienTrangAdmin() {
    khungDangNhap.style.display = "none";
    khungAdmin.style.display = "flex";
    hienNoiDung("dashboard");
  }
  function capNhatSanPhamUser() {
    const dsHienThi = dsSP
      .filter(sp => !sp.an)
      .map(sp => {
        const maSP = sp.ma || "unknown";
        const giaVon = Number(sp.giaVon || sp.gia || 0);


        const giaEntrySP = dsGia && dsGia.find(g => (g.maSP || g.ma) === maSP);
        const giaEntryLoai = dsGia && dsGia.find(g => g.maLoai === sp.maLoai);

        const pickPriceFromEntry = (entry) => {
          if (!entry) return null;
          if (entry.giaBan != null) return Number(entry.giaBan);
          if (entry.gia != null) return Number(entry.gia);
          if (entry.phanTram != null) return Math.round(giaVon * (1 + (Number(entry.phanTram) || 0) / 100));
          if (entry.phantram != null) return Math.round(giaVon * (1 + (Number(entry.phantram) || 0) / 100));
          return null;
        };

        let priceBeforeTax = pickPriceFromEntry(giaEntrySP);
        if (priceBeforeTax == null) priceBeforeTax = pickPriceFromEntry(giaEntryLoai);
        if (priceBeforeTax == null) priceBeforeTax = Number(sp.gia || sp.giaVon || 0);

        return {
          maSP: maSP,
          maLoai: sp.maLoai || "unknown",
          ten: sp.ten || "Sản phẩm chưa tên",
          gia: priceBeforeTax,
          hinh: sp.hinh ? sp.hinh : "img/noimage.jpg",
          loaigiay: sp.loaiGiay || sp.loai || sp.accessory || "none",
          brand: sp.brand || "hangkhac",
          moTa: sp.moTa || ""
        };
      });

    localStorage.setItem("sanPhamTrangChu", JSON.stringify(dsHienThi));
  }
});
