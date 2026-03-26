function renderOrders() {
  const orderList = document.getElementById("order-list");
  if (!orderList) return;
  const orders = JSON.parse(localStorage.getItem("ws_donhang_v1") || "[]");
  if (!Array.isArray(orders) || orders.length === 0) {
    orderList.innerHTML = "<p>❌ Bạn chưa có đơn hàng nào.</p>";
    return;
  }
  orderList.innerHTML = orders.map(order => {
    const total = Number(order.tongTien || 0);
    const itemsHtml = (order.chiTiet || []).map(i => `
      <div class="order-product">
        <img src="${i.img || 'img/noimage.jpg'}" alt="">
        <span>${(i.ten || i.name || '').trim()}</span> 
        - SL: ${i.sl || i.qty || 1} 
        - ${(Number(i.gia || i.price) || 0).toLocaleString("vi-VN")}₫
      </div>
    `).join("");
    let ngayDatHienThi = order.ngayDat || order.date || order.ngay || '';
    if (ngayDatHienThi && !isNaN(new Date(ngayDatHienThi).getTime())) {
      ngayDatHienThi = new Date(ngayDatHienThi).toLocaleString('vi-VN');
    }

    return `
      <div class="order-item">
        <h3>🧾 Mã đơn: ${order.maDH || order.id || '(Không rõ mã)'}</h3>
        <p><strong>Ngày đặt:</strong> ${ngayDatHienThi || '(Chưa rõ)'}</p>
        <p><strong>Trạng thái:</strong> ${order.trangthai || order.trangThai || order.status || '(Chưa cập nhật)'}</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${order.diachi || order.address || '(Chưa rõ địa chỉ)'}</p>
        <p><strong>Tổng tiền:</strong> ${total.toLocaleString("vi-VN")}₫</p>
        <details>
          <summary>Chi tiết sản phẩm</summary>
          ${itemsHtml}
        </details>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", renderOrders);
