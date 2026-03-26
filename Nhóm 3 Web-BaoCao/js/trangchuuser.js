/* POPUP ĐĂNG NHẬP / ĐĂNG KÝ  */
const popup = document.getElementById("popup");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const userAccount = document.getElementById("userAccount");

const LS_CART = "cart"; 

function saveCart(cart) {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
}

function addToCart_BuyNow(item, qty = 1) {
  const cart = [];
  
  const id = item.id || item.maSP || item.ma || (item.name + item.price);
  const name = item.name || item.ten || "";
  const price = Number(item.price || item.gia || 0);
  const img = item.img || item.hinh || "";

  cart.push({ id, name, price, img, qty });
  saveCart(cart);
}
/* MỞ POPUP LOGIN  */
document.getElementById("loginText")?.addEventListener("click", () => {
  showLogin();
  popup.style.display = "flex";
});
/*ĐÓNG POPUP*/
document.getElementById("closePopup")?.addEventListener("click", closePopup);
document.getElementById("closePopup2")?.addEventListener("click", closePopup);
popup.addEventListener("click", e => {
  if (e.target === popup) closePopup();
});
function closePopup() {
  popup.style.display = "none";
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  const updForm = document.getElementById("updateForm");
  if (updForm) updForm.remove();
}
/*CHUYỂN GIỮA LOGIN / REGISTER */
function showRegister() {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  popup.style.display = "flex";
}
function showLogin() {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  popup.style.display = "flex";
}
/*XỬ LÝ ĐĂNG KÝ*/
document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  register();
});
function register() {
  const fullname = document.getElementById("regFullname").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const address = document.getElementById("regAddress").value.trim();
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const confirm = document.getElementById("regConfirm").value.trim();

  if (!fullname || !phone || !email || !address|| !user || !pass || !confirm)
    return alert("Vui lòng nhập đầy đủ thông tin!");
  if (!/^[0-9]{10}$/.test(phone))
    return alert("Số điện thoại phải 10 chữ số!");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return alert("Email không hợp lệ!");
  if (pass.length < 6)
    return alert("Mật khẩu phải >= 6 ký tự!");
  if (pass !== confirm)
    return alert("Mật khẩu nhập lại không khớp!");

  // Lấy DS_USERS từ localStorage
  let dsUsers = JSON.parse(localStorage.getItem("DS_USERS")) || [];

  if (dsUsers.some(u => u.user && u.user.toLowerCase() === user.toLowerCase()))
    return alert("Tên đăng nhập đã tồn tại!");
  if (dsUsers.some(u => u.email.toLowerCase() === email.toLowerCase()))
    return alert("Email đã tồn tại!");

  // Tạo mã KH tự động
  let dsKH = dsUsers.filter(u => u.ma?.startsWith("KH"));
  let ma = dsKH.length === 0 ? "KH1" : "KH" + (Math.max(...dsKH.map(u => parseInt(u.ma.slice(2)))) + 1);

  const newUser = { ma, user, fullname, phone, email, address,password: pass, trangthai: "Hoạt động" };
  dsUsers.push(newUser);
  localStorage.setItem("DS_USERS", JSON.stringify(dsUsers));
  localStorage.setItem(user, JSON.stringify({ fullname, phone, email, address, password: pass }));

  if (typeof refreshUsersAdmin === "function") refreshUsersAdmin();

  alert("Đăng ký thành công!");
  showLogin();
}

/* CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG*/
function updateUserInfo(username, newFullname, newPhone, newEmail, newPassword) {
  let dsUsers = JSON.parse(localStorage.getItem("DS_USERS")) || [];
  let userIndex = dsUsers.findIndex(u => u.user === username);

  if (userIndex === -1) return alert("Không tìm thấy tài khoản!");
  if (dsUsers.some((u, idx) => u.email.toLowerCase() === newEmail.toLowerCase() && idx !== userIndex))
    return alert("Email đã tồn tại!");
  dsUsers[userIndex].fullname = newFullname;
  dsUsers[userIndex].phone = newPhone;
  dsUsers[userIndex].email = newEmail;
  dsUsers[userIndex].password = newPassword;
  dsUsers[userIndex].address = newAddress;
  localStorage.setItem("DS_USERS", JSON.stringify(dsUsers));
  localStorage.setItem(username, JSON.stringify({ fullname: newFullname, phone: newPhone, email: newEmail, address: newAddress, password: newPassword }));

  if (typeof refreshUsersAdmin === "function") refreshUsersAdmin();
  alert("Cập nhật thông tin thành công!");
}

/*XỬ LÝ ĐĂNG NHẬP*/
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const savedData = localStorage.getItem(user);

  if (!savedData) return alert("Tài khoản không tồn tại!");
  const data = JSON.parse(savedData);

  if (pass === data.password) {
    localStorage.setItem("loggedInUser", user);
    alert("Đăng nhập thành công!");
    closePopup();
    renderUserMenu();
  } else {
    alert("Sai mật khẩu!");
  }
}

/*MENU NGƯỜI DÙNG*/
function renderUserMenu() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    const data = JSON.parse(localStorage.getItem(user));
    userAccount.innerHTML = `
      👤 ${data.fullname}
      <div class="user-dropdown">
        <a href="#" onclick="showUpdateForm()">Thông tin cá nhân</a>
        <a href="orders.html">Đơn hàng của tôi</a>
        <a href="#" id="logoutBtn">Đăng xuất</a>
      </div>`;
  }
}

/*ĐĂNG XUẤT*/
document.addEventListener("click", e => {
  if (e.target.id === "logoutBtn") {
    localStorage.removeItem("loggedInUser");
    alert("Đã đăng xuất!");
    location.reload();
  }
});

/*FORM CẬP NHẬT THÔNG TIN */
function showUpdateForm() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;
  const data = JSON.parse(localStorage.getItem(user));

  loginForm.style.display = "none";
  registerForm.style.display = "none";

  const oldForm = document.getElementById("updateForm");
  if (oldForm) oldForm.remove();

  const updForm = document.createElement("div");
  updForm.className = "popup-content";
  updForm.id = "updateForm";
  updForm.innerHTML = `
    <span class="close-popup" onclick="closeUpdateForm()">&times;</span>
    <h2>Chỉnh sửa thông tin cá nhân</h2>
    <input type="text" id="updFullname" value="${data.fullname}" placeholder="Họ và tên">
    <input type="text" id="updPhone" value="${data.phone}" placeholder="Số điện thoại">
    <input type="email" id="updEmail" value="${data.email}" placeholder="Email">
    <input type="text" id="updAddress" value="${data.address || ''}" placeholder="Địa chỉ">
    <input type="password" id="updPass" value="${data.password}" placeholder="Mật khẩu mới">
    <button onclick="updateProfile()">Cập nhật</button>
  `;

  popup.appendChild(updForm);
  popup.style.display = "flex";
}

/*ĐÓNG FORM CẬP NHẬT */
function closeUpdateForm() {
  const updForm = document.getElementById("updateForm");
  if (updForm) updForm.remove();
  popup.style.display = "none";
}

/*CẬP NHẬT THÔNG TIN NGƯỜI DÙNG*/
function updateProfile() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;

  const fullname = document.getElementById("updFullname").value.trim();
  const phone = document.getElementById("updPhone").value.trim();
  const email = document.getElementById("updEmail").value.trim();
  const address = document.getElementById("updAddress").value.trim();
  const pass = document.getElementById("updPass").value.trim();

  if (!fullname || !phone || !email || !pass || !address) return alert("Nhập đầy đủ thông tin!");
  if (!/^[0-9]{10}$/.test(phone)) return alert("Số điện thoại phải 10 chữ số!");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Email không hợp lệ!");

  // Cập nhật trong dsUsers
  let dsUsers = JSON.parse(localStorage.getItem("DS_USERS")) || [];
  const idx = dsUsers.findIndex(u => u.user === user);
  if (idx !== -1) {
    dsUsers[idx] = { ...dsUsers[idx], fullname, phone, email, password: pass };
    dsUsers[idx].address = address;
    localStorage.setItem("DS_USERS", JSON.stringify(dsUsers));

    // Refresh bảng admin nếu admin đang mở
    if (typeof refreshUsersAdmin === "function") refreshUsersAdmin();
  }

  // Cập nhật key riêng user
  localStorage.setItem(user, JSON.stringify({ fullname, phone, email, password: pass,address }));

  alert("Cập nhật thành công!");
  closeUpdateForm();
  renderUserMenu();
}
/*KIỂM TRA USER KHI LOAD TRANG*/
if (localStorage.getItem("loggedInUser")) renderUserMenu();
/*  ẢNH NỀN TỰ ĐỘNG */
const header = document.querySelector('.header');
const anhNen = ['./img/logo.jpg', './img/nike.jpg', './img/puma.jpg', './img/phantom.jpg'];
let chiSoAnh = 0;
setInterval(() => {
  chiSoAnh = (chiSoAnh + 1) % anhNen.length;
  header.style.backgroundImage = `url('${anhNen[chiSoAnh]}')`;
}, 3000);
// Tìm kiếm cơ bản theo tên
function searchBasic() {
    const key = document.getElementById("searchInput").value.trim().toLowerCase();
    filteredCards = allCards.filter(card => 
        card.querySelector("p").textContent.toLowerCase().includes(key)
    );
    renderProducts(1);
}

// Tìm kiếm nâng cao 
function searchAdvanced() {
    const nameKey = document.getElementById("searchInputAdvanced").value.trim().toLowerCase();
    const rawCategoryKey = document.getElementById("categoryAdvanced").value || "";
    const categoryKey = rawCategoryKey.toString().trim().toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const normalize = v => (v || "").toString().trim().toLowerCase();
    const isShoeTypeFilter = categoryKey && (
        categoryKey.startsWith("loai:") ||
        categoryKey.startsWith("loaigiay") ||
        /giay|giày|futsal|cotunhien|conhantao|cỏ|co/.test(categoryKey)
    );

    filteredCards = allCards.filter(card => {
        const name = card.querySelector("p").textContent.toLowerCase();
        const cardCategory = normalize(card.getAttribute("data-category") || card.dataset.category);
        const cardLoaiGiay = normalize(card.dataset.loaigiay || card.dataset.loaiGiay || card.dataset.loai || "");

        const priceText = card.querySelector(".price")?.textContent || "0";
        const priceNumber = parseFloat(priceText.replace(/[₫.,\s]/g,"")) || 0;
        if (nameKey && !name.includes(nameKey)) return false;
        if (categoryKey && categoryKey !== "all") {
            if (isShoeTypeFilter) {
             
                const want = categoryKey.replace(/^loai:/, "").replace(/\s+/g, "");
                if (!cardLoaiGiay) return false;
                if (cardLoaiGiay !== want && !cardLoaiGiay.includes(want)) return false;
            } else {
               
                if (!cardCategory) return false;
                if (cardCategory !== categoryKey && !cardCategory.includes(categoryKey)) return false;
            }
        }
        if (priceNumber < minPrice || priceNumber > maxPrice) return false;//check giá

        return true;
    });

    renderProducts(1);
}
//BIẾN GLOBAL
let allCards = [];
let filteredCards = [];
let currentBrandFilter = 'all';
let currentAccessoryFilter = 'all';
const productsPerPage = 12;
let currentPage = 1;
let sectionState = 'home'; 
//KHỞI TẠO SẢN PHẨM TRANG USER
function initProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;
    productGrid.querySelectorAll(".card.dynamic").forEach(c => c.remove());
    let sanPhamAdmin = JSON.parse(localStorage.getItem("sanPhamTrangChu") || "[]");
    if (sanPhamAdmin.length === 0 && typeof sampleSP !== 'undefined') {
        console.log("LocalStorage trống, đang khởi tạo từ sampleSP...");
        sanPhamAdmin = sampleSP; 
        localStorage.setItem("sanPhamTrangChu", JSON.stringify(sanPhamAdmin)); 
    }
    sanPhamAdmin.forEach(sp => {
      const card = document.createElement("div");
      card.className = "card dynamic";
      card.dataset.ma = sp.maSP;
      card.dataset.brand = sp.brand?.toLowerCase() || "";
      card.dataset.loaigiay = sp.loaigiay?.toLowerCase() || "";
      card.dataset.category = sp.maLoai?.toLowerCase() || "";
      card.dataset.mota = sp.moTa || "";
        card.innerHTML = `
            <img src="${sp.hinh || 'img/noimage.jpg'}" alt="${sp.ten}">
            <p >${sp.ten}</p>
            <div class="card-footer">
            <p class="price">${sp.gia?.toLocaleString('vi-VN') || 0}₫</p>
            <button class="buy-btn">Mua ngay</button>
            </div>
 `;

        productGrid.appendChild(card);
    });

    allCards = Array.from(productGrid.querySelectorAll(".card"));
    filteredCards = [...allCards];

    applyFilters();        
    attachBuyEvents();
    attachProductClickEvents();
}
//ÁP DỤNG FILTER
function applyFilters() {
    const key = v => (v || '').toString().trim().toLowerCase();
    filteredCards = allCards.filter(card => {
        const brand = key(card.dataset.brand || card.dataset.br || card.dataset.brandname);
        const accessory = key(card.dataset.loaigiay || card.dataset.loaigiaytype || card.dataset.loaiGiay || card.dataset.loaigiay);
        const category = key(card.dataset.category || card.dataset.loai);
        const maLoai = key(card.dataset.maLoai || card.dataset.maloai || card.dataset.ma); 
        const isShoe =
            maLoai === 'l001' ||
            category.includes('giày') || category.includes('giay') ||
            accessory.includes('giày') || accessory.includes('giay') || accessory.includes('giaycotunhien') ||
            accessory.includes('giayconhantao') || accessory.includes('giayfutsal');

        const isAccessory =
            maLoai === 'l002' ||
            category.includes('phụ') || category.includes('phu') || category.includes('phukien') ||
            accessory.includes('phukien') || accessory.includes('tui') || accessory.includes('bongda') || accessory.includes('vo') || accessory.includes('gangtay');
        if (sectionState === 'L001') {
            if (!isShoe) return false;
            if (currentBrandFilter !== 'all' && key(currentBrandFilter) !== brand) return false;
        } else if (sectionState === 'L002') { 
            if (!isAccessory) return false;
            if (currentAccessoryFilter !== 'all' && key(currentAccessoryFilter) !== accessory) return false;
        } else { 
            if (currentBrandFilter !== 'all' && key(currentBrandFilter) !== brand) return false;
            if (currentAccessoryFilter !== 'all' && key(currentAccessoryFilter) !== accessory) return false;
        }

        return true;
    });

    renderProducts(1);
}
//PHÂN TRANG
function renderProducts(page = 1) {
    currentPage = page;
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    allCards.forEach(card => card.style.display = "none");
    filteredCards.slice(start, end).forEach(card => card.style.display = "block");

    renderPagination();
}
function renderPagination() {
    const pagination = document.querySelector(".pagination");
    if (!pagination) return;

    pagination.innerHTML = "";
    const totalProducts = filteredCards.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (totalProducts === 0) {
        pagination.innerHTML = "<span>Không có sản phẩm nào</span>";
        return;
        
    }
if (totalPages <= 1) {
        return; 
    }
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "«";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => renderProducts(currentPage - 1));
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => renderProducts(i));
        pagination.appendChild(btn);
    }
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "»";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => renderProducts(currentPage + 1));
    pagination.appendChild(nextBtn);
}
//Nút Mua Ngay 
function attachBuyEvents() {
    document.querySelectorAll(".buy-btn, .btn.buy-now").forEach(btn => {
        if (btn.dataset.boundBuy) return;
        btn.dataset.boundBuy = "true";

        btn.addEventListener("click", e => {
            e.stopPropagation(); 
            const loggedInUser = localStorage.getItem("loggedInUser");
            if (!loggedInUser) {
                alert("Vui lòng đăng nhập để tiếp tục mua hàng!");
                showLogin(); 
                return; 
            }
            
            try { 
                const card = e.target.closest(".card");
                if (!card) return;
                
                const ten = (card.querySelector("p")?.textContent || "").trim();
                const giaText = card.querySelector(".price")?.textContent || "";
                const gia = parseInt(giaText.replace(/[₫.,\s]/g, "")) || 0;
                const hinh = card.querySelector("img")?.src || "";
                const maSP = card.dataset.ma || (ten + gia); 

                const product = {  name: ten, price: gia, img: hinh };
                addToCart_BuyNow(product, 1); 
                localStorage.setItem("triggerCheckout", "true");
                window.location.href = "giohang.html"; 

            } catch (error) {
                console.error("Lỗi khi xử lý nút Mua ngay:", error);
            }
        });
    });
}
//CLICK CARD
function attachProductClickEvents() {
    allCards.forEach(card => {
        if (card.dataset.boundClick) return;
        card.dataset.boundClick = "true";
            
        card.addEventListener("click", () => {
            try {
                const loggedInUser = localStorage.getItem("loggedInUser");
                if (!loggedInUser) {
                    alert("Vui lòng đăng nhập để xem chi tiết/mua hàng!");
                    showLogin();
                    return;
                }
                const nameEl = card.querySelector("p");
                const name = nameEl ? nameEl.textContent.trim() : "Không có tên";

                const priceEl = card.querySelector(".price");
                const priceText = priceEl ? priceEl.textContent.replace(/[₫.,]/g, "").trim() : "0";
                const price = parseInt(priceText);
                const brand = card.dataset.brand || "Không rõ";
                const category = card.dataset.category || "Không rõ";
                const img = card.querySelector("img")?.getAttribute("src") || "";
                const moTa = card.dataset.mota || "";
                const maSP = card.dataset.ma || ""; 
                const product = { ma: maSP, name, price, brand, category, img, moTa };
                
                localStorage.setItem("selectedProduct", JSON.stringify(product));
                window.location.href = "giohang.html";

            } catch (e) {
                console.error("Lỗi khi click vào card:", e, card);
            }
        });
    });
}
//GỌI KHI LOAD TRANG
document.addEventListener("DOMContentLoaded", () => {
    initProducts();
});
window.addEventListener("storage", (e) => {
    if (e.key === "sanPhamTrangChu") {
        console.log("🔄 Cập nhật sản phẩm từ admin...");
        initProducts(); 
    }
});
//show
function showSection(sectionId, filter = '') {
  sectionState = sectionId;
  const homeSection = document.querySelector('main.main:not([id])');
  const infoSection = document.getElementById('infor-section');
  const searchBar = document.querySelector('.search-bar');
  const searchAdvanced = document.querySelector('.search-advanced');
  if (homeSection) homeSection.style.display = 'none';
  if (infoSection) infoSection.style.display = 'none';

  let showSearch = false;

  switch(sectionId) {
    case 'L002':
      if (homeSection) {
        homeSection.style.display = 'block'; 
        currentBrandFilter = 'all';
        currentAccessoryFilter = filter?.toLowerCase() || 'all';
        applyFilters();
        showSearch = true; 
      }
      break;
    case 'L001':
      if (homeSection) {
        homeSection.style.display = 'block';
        currentAccessoryFilter = 'all';
        currentBrandFilter = filter?.toLowerCase() || 'all';
        applyFilters();
        showSearch = true; 
      }
      break;
    case 'infor-section':
      if (infoSection) infoSection.style.display = 'block';
      break;
    case 'home':
    default:
      if (homeSection) {
        homeSection.style.display = 'block';
        currentBrandFilter = 'all';
        currentAccessoryFilter = 'all';
        applyFilters();
        showSearch = true;
      }
      break;
  }

  if (searchBar) searchBar.style.display = showSearch ? 'flex' : 'none';
  if (searchAdvanced) searchAdvanced.style.display = showSearch ? 'flex' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}