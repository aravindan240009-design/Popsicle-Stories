/**
 * admin.js — Admin dashboard functionality
 */

const Admin = (() => {
  let menuItems = [];
  let orders = [];
  let reviews = [];

  async function init() {
    if (!Auth.requireAdmin()) return;

    menuItems = await API.getAllMenuItems();
    orders = await API.getOrders();
    reviews = await API.getReviews();

    initNavigation();
    await renderDashboard();
    renderMenuTable();
    renderOrders();
    renderReviews();
    await renderCoupons();
    bindEvents();
  }

  function initNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a[data-section]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        showSection(section);
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    const logoutBtn = document.querySelector('.admin-nav .admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await Auth.logout();
        window.location.href = 'login.html';
      });
    }
  }

  function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById('section-' + sectionId);
    if (section) section.classList.add('active');
  }

  async function renderDashboard() {
    const stats = await API.getAdminStats();

    document.getElementById('stat-orders').textContent = stats.todayOrders;
    document.getElementById('stat-revenue').textContent = App.formatCurrency(stats.todayRevenue);
    document.getElementById('stat-rating').textContent = stats.avgRating + '★';
    document.getElementById('stat-coupons').textContent = stats.activeCoupons;

    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      const maxCount = Math.max(...stats.weeklyOrders.map(d => d.count), 1);
      chartBars.innerHTML = stats.weeklyOrders.map(d => `
        <div class="chart-bar-group">
          <div class="chart-bar" style="height: ${(d.count / maxCount) * 160}px" title="${d.count} orders"></div>
          <span class="label">${d.day}</span>
        </div>
      `).join('');
    }
  }

  function renderMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    if (!tbody) return;

    tbody.innerHTML = menuItems.map(item => `
      <tr data-id="${item.id}">
        <td><img src="${item.image}" alt="${item.name}" style="width:48px;height:48px;border-radius:8px;object-fit:cover"></td>
        <td>
          <input type="text" class="form-control edit-name" value="${item.name}" style="padding:6px 10px;font-size:13px">
        </td>
        <td>${item.category}</td>
        <td>
          <input type="number" class="form-control edit-price" value="${item.price}" style="padding:6px 10px;font-size:13px;width:90px">
        </td>
        <td>★ ${item.rating}</td>
        <td>
          <div class="availability-toggle ${item.available !== false ? 'on' : ''}" data-id="${item.id}" title="Toggle availability"></div>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-primary btn-sm save-item-btn" data-id="${item.id}">Save</button>
            <button class="btn btn-secondary btn-sm delete-item-btn" data-id="${item.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.availability-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => toggle.classList.toggle('on'));
    });

    tbody.querySelectorAll('.save-item-btn').forEach(btn => {
      btn.addEventListener('click', () => saveMenuItem(parseInt(btn.dataset.id)));
    });

    tbody.querySelectorAll('.delete-item-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteMenuItem(parseInt(btn.dataset.id)));
    });
  }

  async function saveMenuItem(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const name = row.querySelector('.edit-name').value.trim();
    const price = parseFloat(row.querySelector('.edit-price').value);
    const available = row.querySelector('.availability-toggle').classList.contains('on');

    if (!name || isNaN(price) || price <= 0) {
      App.showToast('Please enter valid name and price', 'error');
      return;
    }

    try {
      await API.updateMenuItem(id, { name, price, available });
      menuItems = await API.getAllMenuItems();
      App.showToast('Menu item updated', 'success');
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  }

  async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.deleteMenuItem(id);
      menuItems = await API.getAllMenuItems();
      renderMenuTable();
      App.showToast('Item deleted', 'success');
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  }

  function renderOrders() {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--color-text-muted)">No orders yet</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(order => `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.customerName || 'Guest'}</td>
        <td>${order.items?.length || 0} items</td>
        <td>${App.formatCurrency(order.grandTotal)}</td>
        <td>
          <select class="status-select status-${order.status?.toLowerCase().replace(/\s/g, '')}" data-id="${order.id}">
            <option value="Placed" ${order.status === 'Placed' ? 'selected' : ''}>Placed</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>${new Date(order.createdAt).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async () => {
        try {
          await API.updateOrderStatus(select.dataset.id, select.value);
          App.showToast('Order status updated', 'success');
        } catch (err) {
          App.showToast(err.message, 'error');
        }
      });
    });
  }

  function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    if (!reviews.length) {
      container.innerHTML = '<p style="text-align:center;padding:32px;color:var(--color-text-muted)">No reviews yet</p>';
      return;
    }

    container.innerHTML = reviews.map(review => {
      const dish = menuItems.find(m => m.id === review.dishId);
      return `
        <div class="review-item" style="padding:16px;background:var(--color-surface);border-radius:12px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <strong>${review.customerName || 'Customer'}</strong>
            <span style="color:var(--color-accent)">${'★'.repeat(review.rating)}</span>
          </div>
          <p style="font-size:13px;color:var(--color-primary);margin-bottom:4px">${dish?.name || 'Unknown dish'}</p>
          <p style="font-size:14px;color:var(--color-text-muted)">${review.comment || 'No comment'}</p>
          <p style="font-size:12px;color:var(--color-text-light);margin-top:8px">${new Date(review.createdAt).toLocaleString('en-IN')}</p>
        </div>
      `;
    }).join('');
  }

  async function renderCoupons() {
    const container = document.getElementById('coupons-list');
    if (!container) return;

    const coupons = await API.getCoupons();
    if (!coupons.length) {
      container.innerHTML = '<p style="text-align:center;padding:32px;color:var(--color-text-muted)">No active coupons</p>';
      return;
    }

    container.innerHTML = coupons.map(c => `
      <div style="background:var(--color-surface);padding:24px;border-radius:12px;box-shadow:var(--shadow-sm);border-left:4px solid var(--color-accent)">
        <h3 style="font-size:18px;color:var(--color-primary);margin-bottom:8px">${c.code}</h3>
        <p style="font-size:14px;color:var(--color-text-muted);margin-bottom:8px">${c.description}</p>
        <p style="font-size:13px">
          ${c.type === 'percentage' ? c.value + '% off' : '\u20B9' + c.value + ' off'}
          ${c.maxDiscount ? ' (max \u20B9' + c.maxDiscount + ')' : ''}
          ${c.minOrder ? ' \u00B7 Min \u20B9' + c.minOrder : ''}
          ${c.category ? ' \u00B7 ' + c.category + ' only' : ''}
        </p>
        <span style="display:inline-block;margin-top:8px;padding:4px 12px;background:rgba(46,125,50,0.1);color:var(--color-success);border-radius:20px;font-size:12px;font-weight:600">Active</span>
      </div>
    `).join('');
  }

  function bindEvents() {
    const addBtn = document.getElementById('add-item-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => App.openModal('add-item-modal'));
    }

    const addForm = document.getElementById('add-item-form');
    if (addForm) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addForm);
        const item = {
          name: formData.get('name'),
          category: formData.get('category'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price')),
          image: formData.get('image'),
          isVeg: formData.get('isVeg') === 'true',
          tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean) || []
        };

        if (!item.name || !item.category || !item.price || !item.image) {
          App.showToast('Please fill all required fields', 'error');
          return;
        }

        try {
          await API.addMenuItem(item);
          menuItems = await API.getAllMenuItems();
          renderMenuTable();
          addForm.reset();
          App.closeModal('add-item-modal');
          App.showToast('New item added successfully', 'success');
        } catch (err) {
          App.showToast(err.message, 'error');
        }
      });
    }
  }

  return { init, renderCoupons };
})();
