const LS_CART = "cart";

function loadCart() {
  return JSON.parse(localStorage.getItem(LS_CART) || "[]");
}
function saveCart(cart) {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
}


function addToCart_BuyNow(item, qty = 1) {
  const cart = []; // <-- Luôn bắt đầu với giỏ hàng rỗng
  
  const id = item.id || item.maSP || item.ma || (item.name + item.price);
  const name = item.name || item.ten || "";
  const price = Number(item.price || item.gia || 0);
  const img = item.img || item.hinh || "";

  cart.push({ id, name, price, img, qty });
  saveCart(cart);
  renderCart(); 
}


// HÀM ADD TO CART BÌNH THƯỜNG
function addToCart(item, qty = 1) {
  const cart = loadCart();
  const id = item.id || item.maSP || item.ma || null;
  const name = item.name || item.ten || item.title || "";
  const price = Number(item.price || item.gia || item.priceNumber || 0);
  const img = item.img || item.hinh || item.image || "";

  let found = null;
  if (id) found = cart.find(i => (i.id || i.maSP || i.ma) === id);
  if (!found) found = cart.find(i => i.name === name);

  if (found) {
    found.qty = qty; 
  } else {
    cart.push({ id, name, price, img, qty });
  }
  saveCart(cart);
  renderCart();
}

// Hàm hiển thị giỏ hàng
function renderCart() {
  const cart = loadCart();
  const cartContainer = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const paymentTotalEl = document.getElementById("payment-total");

  if (!cartContainer || !totalPriceEl) return;

  let total = 0;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "🛒 Giỏ hàng của bạn đang trống!";
  } else {
    cart.forEach((item, index) => {
      const subtotal = (item.price || 0) * (item.qty || 1);
      total += subtotal;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-content">
          <img src="${item.img || 'img/noimage.jpg'}" alt="${item.name}">
          <div class="cart-info">
            <h4>${item.name}</h4>
            <p>Giá: ${(item.price || 0).toLocaleString("vi-VN")}₫</p>
            <p>Số lượng: <input class="qty-input" data-index="${index}" type="number" min="1" value="${item.qty || 1}"></p>
            <p><strong>Tạm tính:</strong> ${subtotal.toLocaleString("vi-VN")}₫</p>
          </div>
          <button class="remove-btn" data-index="${index}">🗑 Xóa</button>
        </div>`;
      cartContainer.appendChild(div);
    });
  }

  totalPriceEl.textContent = total.toLocaleString("vi-VN") + "₫";
  if (paymentTotalEl) paymentTotalEl.textContent = total.toLocaleString("vi-VN");

  // Gán sự kiện xóa
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      let cart = loadCart();
      if (!isNaN(idx)) {
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      }
    });
  });

  // Thay đổi số lượng
  document.querySelectorAll(".qty-input").forEach(inp => {
    inp.addEventListener("change", () => {
      const idx = Number(inp.getAttribute("data-index"));
      let cart = loadCart();
      if (!isNaN(idx) && cart[idx]) {
        cart[idx].qty = Math.max(1, parseInt(inp.value) || 1);
        saveCart(cart);
        renderCart();
      }
    });
  });
}

//  Xóa sản phẩm 
function removeFromCart(index) {
  let cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Chuyển giữa các phần
function showSection(id) {
  const detail = document.getElementById("detail");
  const cart = document.getElementById("cart");

  if (!detail || !cart) return;

  detail.classList.add("hidden");
  cart.classList.add("hidden");

  if (id === "detail") detail.classList.remove("hidden");
  else if (id === "cart") {
    cart.classList.remove("hidden");
    renderCart();
  }
}

// === BẮT ĐẦU HÀM DOMCONTENTLOADED 
document.addEventListener("DOMContentLoaded", () => {
  let currentProductMa = null;
  const checkoutBtn = document.getElementById("checkout");
  const popup = document.getElementById("payment-popup");
  const cancelBtn = document.getElementById("cancel-payment");
  const confirmBtn = document.getElementById("confirm-payment");
  const addCartBtn = document.getElementById("add-cart");
  const buyNowBtn = document.getElementById("buy-now");
  
  const productNameEl = document.getElementById("product-name");
  const productPriceEl = document.getElementById("product-price");
  const productBrandEl = document.getElementById("product-brand");
  const productImgEl = document.getElementById("product-img");
  const productDescEl = document.getElementById("product-desc");
  const items = document.querySelectorAll(".similar-item");
  const backBtn = document.getElementById("back-detail");


  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  const useSavedRadio = document.getElementById("use-saved-address");
  const useNewRadio = document.getElementById("use-new-address");
  const customerAddressInput = document.getElementById("customer-address");

  if (useSavedRadio && useNewRadio && customerAddressInput) {
    customerAddressInput.style.display = "none"; 
    useSavedRadio.addEventListener("change", () => {
      if (useSavedRadio.checked) {
        customerAddressInput.style.display = "none";
      }
    });
    useNewRadio.addEventListener("change", () => {
      if (useNewRadio.checked) {
        customerAddressInput.style.display = "block";
      }
    });
  }
  if (product && productNameEl) {
    productNameEl.textContent = product.name;
    productPriceEl.textContent = product.price.toLocaleString("vi-VN") + "₫";
    productImgEl.src = product.img;
    currentProductMa = product.ma || null;

    if (productBrandEl) {
        productBrandEl.textContent = "Thương hiệu: " + (product.brand || "Không rõ");
    }

    if (productDescEl) {
        productDescEl.textContent = product.moTa || "Sản phẩm này chưa có mô tả chi tiết.";
    }

  } else if (productNameEl) {
    productNameEl.textContent = "Không tìm thấy sản phẩm!";
  }
  if (items && items.length > 0) {
    items.forEach(item => {
      if (item.dataset.boundClick) return;
      item.dataset.boundClick = "true";
      
      item.addEventListener("click", () => {
        const name = item.dataset.name;
        const price = parseInt(item.dataset.price);
        const brand = item.dataset.brand;
        const img = item.dataset.img;
        const moTa = item.dataset.mota || ""; 

        productNameEl.textContent = name;
        productPriceEl.textContent = price.toLocaleString("vi-VN") + "₫";
        productImgEl.src = img;
        
        if (productBrandEl) productBrandEl.textContent = "Thương hiệu: " + brand;
        if (productDescEl) productDescEl.textContent = moTa || "Không có mô tả chi tiết.";

        localStorage.setItem("selectedProduct", JSON.stringify({ name, price, brand, img, moTa })); 
      });
    });
  }
  if (backBtn && !backBtn.dataset.bound) {
    backBtn.dataset.bound = "true";
    backBtn.addEventListener("click", () => showSection("detail"));
  }
  
  if (localStorage.getItem("triggerCheckout") === "true") {
    localStorage.removeItem("triggerCheckout"); 
    if (popup) popup.classList.remove("hidden"); 
  }

  // Nút "Thêm vào giỏ"
  if (addCartBtn && !addCartBtn.dataset.bound) { 
    addCartBtn.dataset.bound = "true"; 
    addCartBtn.addEventListener("click", () => {
      const name = document.getElementById("product-name").textContent.trim();
      const price = parseFloat(document.getElementById("product-price").textContent.replace(/[^\d]/g, "")) || 0;
      const img = document.getElementById("product-img").src;
      const qty = parseInt(document.getElementById("qty").value) || 1;
      const product = JSON.parse(localStorage.getItem("selectedProduct"));
      const maSP = product ? product.ma : null;
      addToCart({ id: maSP, name, price, img }, qty);
      alert("Đã thêm vào giỏ!");
    });
  }

  // Nút "Mua ngay"
  if (buyNowBtn && !buyNowBtn.dataset.bound) { 
    buyNowBtn.dataset.bound = "true"; 
    buyNowBtn.addEventListener("click", () => {
      const name = document.getElementById("product-name").textContent.trim();
      const price = parseFloat(document.getElementById("product-price").textContent.replace(/[^\d]/g, "")) || 0;
      const img = document.getElementById("product-img").src;
      const qty = parseInt(document.getElementById("qty").value) || 1;
      const product = JSON.parse(localStorage.getItem("selectedProduct"));
      const maSP = product ? product.ma : null;
      addToCart_BuyNow({ id: maSP,name, price, img }, qty); 
      
      if (popup) popup.classList.remove("hidden");
    });
  }

  // Nút "Thanh toán"
if (checkoutBtn && !checkoutBtn.dataset.bound) {
  checkoutBtn.dataset.bound = "true";
  checkoutBtn.addEventListener("click", () => {
    const cart = loadCart();
    if (cart.length === 0) {
      alert("🛒 Giỏ hàng của bạn đang trống!");
      return;
    }
    const loggedInUser = localStorage.getItem("loggedInUser");
    const savedAddressTextEl = document.getElementById("saved-address-text");
    const customerAddressInput = document.getElementById("customer-address");
    const useSavedRadio = document.getElementById("use-saved-address");
    const useNewRadio = document.getElementById("use-new-address");

    if (loggedInUser) {
      var userData = JSON.parse(localStorage.getItem(loggedInUser)) || {};

      document.getElementById("customer-name").value = userData.fullname || "";
      document.getElementById("customer-phone").value = userData.phone || "";

      if (userData.address) {
        savedAddressTextEl.textContent = userData.address;
        useSavedRadio.disabled = false;
        useSavedRadio.checked = true;
        customerAddressInput.style.display = "none";
      } else {
        savedAddressTextEl.textContent = "(Chưa có địa chỉ lưu)";
        useSavedRadio.disabled = true;
        useNewRadio.checked = true;
        customerAddressInput.style.display = "block";
      }
    } else {
      savedAddressTextEl.textContent = "(Vui lòng đăng nhập)";
      useSavedRadio.disabled = true;
      useNewRadio.checked = true;
      customerAddressInput.style.display = "block";
    }
    popup.classList.remove("hidden");
  });
}

  // Nút "Hủy"
  if (cancelBtn && !cancelBtn.dataset.bound) { 
    cancelBtn.dataset.bound = "true"; 
    cancelBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
  }

  // Nút "XÁC NHẬN ĐẶT HÀNG"
  if (confirmBtn && !confirmBtn.dataset.bound) {
    confirmBtn.dataset.bound = "true";
    confirmBtn.addEventListener("click", () => {
      const name = document.getElementById("customer-name").value.trim();
      const phone = document.getElementById("customer-phone").value.trim();
      const note = document.getElementById("customer-note").value.trim();
      const paymentMethod = document.getElementById("payment-method").value;
      let address = "";
      const useSavedRadio = document.getElementById("use-saved-address");

      if (useSavedRadio && useSavedRadio.checked) {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
          const userData = JSON.parse(localStorage.getItem(loggedInUser)) || {};
          address = userData.address || "";
        }
        if (!address) {
           alert("⚠️ Bạn đã chọn dùng địa chỉ đã lưu nhưng không tìm thấy! Vui lòng chọn 'Dùng địa chỉ mới'.");
           return;
        }
      } else {
        address = document.getElementById("customer-address").value.trim();
      }
      

      if (!name) return alert("⚠️ Vui lòng nhập họ tên!");
      if (!/^(0|\+84)[0-9]{9,10}$/.test(phone)) return alert("⚠️ Số điện thoại không hợp lệ!");
      if (!address) return alert("⚠️ Vui lòng nhập địa chỉ giao hàng!");
      if (!note) return alert("⚠️ Vui lòng nhập ghi chú size!"); 

      const cart = loadCart();
      if (!cart || cart.length === 0) {
        alert("🛒 Giỏ hàng trống!");
        popup.classList.add("hidden");
        return;
      }

      const maDH = "DH" + Date.now();
      const chiTiet = cart.map(sp => ({
        ma: sp.id || sp.ma || "",
        ten: sp.name || "",
        sl: sp.qty || 1,
        size: sp.size || "", 
        gia: sp.price || 0,
        img: sp.img || "img/noimage.jpg"
      }));

      const tongTien = chiTiet.reduce((s, i) => s + i.sl * i.gia, 0);
      const donHang = {
        id: Date.now(),
        maDH,
        ngay: new Date().toISOString(),
        khach: name,
        sdt: phone,
        diachi: address, 
        ghiChu: note, 
        phuongThuc: paymentMethod,
        tongTien,
        trangthai: "Mới đặt",
        chiTiet
      };

      const dsDonHang = JSON.parse(localStorage.getItem("ws_donhang_v1") || "[]");
      dsDonHang.push(donHang);
      localStorage.setItem("ws_donhang_v1", JSON.stringify(dsDonHang));

      localStorage.removeItem("cart");

      if (typeof renderCart === "function") renderCart();

      alert("🎉 Đặt hàng thành công!");
      popup.classList.add("hidden");

      if (typeof renderOrders === "function") renderOrders();
    });
  }
  if (popup && !popup.dataset.bound) { 
    popup.dataset.bound = "true"; 
    popup.addEventListener("click", (e) => {
      if (e.target.id === "payment-popup") popup.classList.add("hidden");
    });
  }
  if (document.getElementById("cart")) renderCart();
  
}); 
window.addEventListener("storage", (e) => {
  if (e.key === LS_CART || e.key === null) {
    renderCart();
  }
});