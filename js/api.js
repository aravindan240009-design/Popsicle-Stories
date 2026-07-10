/**
 * api.js — Data access abstraction layer
 * All functions simulate async API calls; swap internals for fetch() when connecting Laravel backend.
 */

const API = (() => {
  // "ps_" prefix (Popsicle Stories) — also isolates us from stale pre-rebrand "sg_" data
  const STORAGE_KEYS = {
    MENU: 'ps_menu',
    COUPONS: 'ps_coupons',
    USERS: 'ps_users',
    SESSION: 'ps_session',
    CART: 'ps_cart',
    ORDERS: 'ps_orders',
    REVIEWS: 'ps_reviews',
    CHECKOUT: 'ps_checkout',
    ADDRESSES: 'ps_addresses'
  };

  function delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  function setStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      setStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
      setStorage(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setStorage(STORAGE_KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      setStorage(STORAGE_KEYS.REVIEWS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      setStorage(STORAGE_KEYS.CART, []);
    }
  }

  // → GET /api/v1/menu
  async function getMenu() {
    await delay(100);
    return getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU).filter(item => item.available !== false);
  }

  // → GET /api/v1/menu (all, including unavailable — admin)
  async function getAllMenuItems() {
    await delay(100);
    return getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
  }

  // → GET /api/v1/menu/{id}
  async function getMenuItem(id) {
    await delay(50);
    const menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    return menu.find(item => item.id === Number(id)) || null;
  }

  // → POST /api/v1/menu (admin)
  async function addMenuItem(item) {
    await delay(200);
    const menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const newId = menu.length ? Math.max(...menu.map(m => m.id)) + 1 : 1;
    const newItem = { ...item, id: newId, rating: item.rating || 4.0, reviewCount: 0, available: true };
    menu.push(newItem);
    setStorage(STORAGE_KEYS.MENU, menu);
    return newItem;
  }

  // → PUT /api/v1/menu/{id} (admin)
  async function updateMenuItem(id, updates) {
    await delay(200);
    const menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const index = menu.findIndex(m => m.id === Number(id));
    if (index === -1) throw new Error('Item not found');
    menu[index] = { ...menu[index], ...updates };
    setStorage(STORAGE_KEYS.MENU, menu);
    return menu[index];
  }

  // → DELETE /api/v1/menu/{id} (admin)
  async function deleteMenuItem(id) {
    await delay(200);
    let menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    menu = menu.filter(m => m.id !== Number(id));
    setStorage(STORAGE_KEYS.MENU, menu);
    return true;
  }

  // → POST /api/v1/auth/login
  async function login(email, password) {
    await delay(400);
    const users = getStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...safeUser } = user;
    const session = {
      token: 'ps_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      user: safeUser,
      createdAt: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.SESSION, session);
    return session;
  }

  // → POST /api/v1/auth/register
  async function register(userData) {
    await delay(400);
    const users = getStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const newUser = {
      id: 'cust-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'customer',
      rewardPoints: 0
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    const { password: _, ...safeUser } = newUser;
    const session = {
      token: 'ps_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      user: safeUser,
      createdAt: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.SESSION, session);
    return session;
  }

  // → POST /api/v1/auth/logout
  async function logout() {
    await delay(100);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return true;
  }

  // → GET /api/v1/auth/session
  async function getSession() {
    await delay(50);
    return getStorage(STORAGE_KEYS.SESSION, null);
  }

  // → GET /api/v1/coupons
  async function getCoupons() {
    await delay(100);
    return getStorage(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS).filter(c => c.active);
  }

  // → POST /api/v1/coupons/validate
  async function validateCoupon(code, cartItems, subtotal) {
    await delay(300);
    const coupons = getStorage(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) throw new Error('Invalid coupon code');

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      throw new Error(`Minimum order of ₹${coupon.minOrder} required for this coupon`);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      let applicableSubtotal = subtotal;
      if (coupon.category) {
        applicableSubtotal = cartItems.reduce((sum, ci) => {
          const item = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU).find(m => m.id === ci.id);
          return item && item.category === coupon.category ? sum + item.price * ci.quantity : sum;
        }, 0);
        if (applicableSubtotal === 0) {
          throw new Error('This coupon is only valid for ' + coupon.category);
        }
      }
      discount = (applicableSubtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
    }

    return { coupon, discount: Math.round(discount * 100) / 100 };
  }

  // → GET /api/v1/cart
  async function getCart() {
    await delay(50);
    return getStorage(STORAGE_KEYS.CART, []);
  }

  // → PUT /api/v1/cart
  async function saveCart(cart) {
    await delay(50);
    setStorage(STORAGE_KEYS.CART, cart);
    return cart;
  }

  // → GET /api/v1/checkout
  async function getCheckoutState() {
    await delay(50);
    return getStorage(STORAGE_KEYS.CHECKOUT, {
      coupon: null,
      couponDiscount: 0,
      redeemPoints: false,
      pointsRedeemed: 0,
      deliveryOption: 'standard',
      address: null
    });
  }

  // → PUT /api/v1/checkout
  async function saveCheckoutState(state) {
    await delay(50);
    setStorage(STORAGE_KEYS.CHECKOUT, state);
    return state;
  }

  // → GET /api/v1/addresses
  async function getAddresses() {
    await delay(100);
    return getStorage(STORAGE_KEYS.ADDRESSES, []);
  }

  // → POST /api/v1/addresses
  async function saveAddress(address) {
    await delay(200);
    const addresses = getStorage(STORAGE_KEYS.ADDRESSES, []);
    const newAddr = { ...address, id: 'addr-' + Date.now() };
    addresses.push(newAddr);
    setStorage(STORAGE_KEYS.ADDRESSES, addresses);
    return newAddr;
  }

  // → POST /api/v1/orders
  async function placeOrder(orderData) {
    await delay(500);
    const orders = getStorage(STORAGE_KEYS.ORDERS, []);
    const order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      ...orderData,
      status: 'Placed',
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    setStorage(STORAGE_KEYS.ORDERS, orders);

    if (orderData.userId) {
      const users = getStorage(STORAGE_KEYS.USERS, DEMO_USERS);
      const userIndex = users.findIndex(u => u.id === orderData.userId);
      if (userIndex !== -1) {
        const pointsEarned = Math.floor(orderData.grandTotal / 10);
        users[userIndex].rewardPoints = (users[userIndex].rewardPoints || 0) - (orderData.pointsRedeemed || 0) + pointsEarned;
        setStorage(STORAGE_KEYS.USERS, users);
        const session = getStorage(STORAGE_KEYS.SESSION, null);
        if (session && session.user.id === orderData.userId) {
          session.user.rewardPoints = users[userIndex].rewardPoints;
          setStorage(STORAGE_KEYS.SESSION, session);
        }
        order.pointsEarned = pointsEarned;
      }
    }

    return order;
  }

  // → GET /api/v1/orders
  async function getOrders() {
    await delay(200);
    return getStorage(STORAGE_KEYS.ORDERS, []);
  }

  // → PUT /api/v1/orders/{id}/status (admin)
  async function updateOrderStatus(orderId, status) {
    await delay(200);
    const orders = getStorage(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    orders[index].status = status;
    setStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  }

  // → POST /api/v1/payments/process
  async function processPayment(paymentData, forceFail = false) {
    await delay(1500);
    // Cash on Delivery has no gateway, so it never fails randomly
    // (the demo "Simulate Failure" button still forces a failure).
    const canRandomFail = paymentData.method !== 'cod';
    if (forceFail || (canRandomFail && Math.random() < 0.3)) {
      const reason = PAYMENT_FAILURE_REASONS[Math.floor(Math.random() * PAYMENT_FAILURE_REASONS.length)];
      throw new Error(reason);
    }
    return {
      transactionId: 'TXN' + Date.now(),
      status: 'success',
      method: paymentData.method,
      amount: paymentData.amount
    };
  }

  // → POST /api/v1/reviews
  async function submitReview(review) {
    await delay(300);
    const reviews = getStorage(STORAGE_KEYS.REVIEWS, []);
    const newReview = { ...review, id: 'rev-' + Date.now(), createdAt: new Date().toISOString() };
    reviews.push(newReview);
    setStorage(STORAGE_KEYS.REVIEWS, reviews);

    const menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const itemIndex = menu.findIndex(m => m.id === review.dishId);
    if (itemIndex !== -1) {
      const item = menu[itemIndex];
      const totalRating = item.rating * item.reviewCount + review.rating;
      item.reviewCount += 1;
      item.rating = Math.round((totalRating / item.reviewCount) * 10) / 10;
      setStorage(STORAGE_KEYS.MENU, menu);
    }

    return newReview;
  }

  // → GET /api/v1/reviews
  async function getReviews(dishId) {
    await delay(100);
    const reviews = getStorage(STORAGE_KEYS.REVIEWS, []);
    return dishId ? reviews.filter(r => r.dishId === dishId) : reviews;
  }

  // → GET /api/v1/admin/stats
  async function getAdminStats() {
    await delay(200);
    const orders = getStorage(STORAGE_KEYS.ORDERS, []);
    const menu = getStorage(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const coupons = getStorage(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    const reviews = getStorage(STORAGE_KEYS.REVIEWS, []);

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const avgRating = menu.length
      ? Math.round(menu.reduce((sum, m) => sum + m.rating, 0) / menu.length * 10) / 10
      : 0;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyOrders = weekDays.map((day, i) => {
      const count = orders.filter(o => new Date(o.createdAt).getDay() === i).length;
      return { day, count };
    });

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      avgRating,
      activeCoupons: coupons.filter(c => c.active).length,
      totalReviews: reviews.length,
      weeklyOrders
    };
  }

  return {
    STORAGE_KEYS,
    initStorage,
    getMenu,
    getAllMenuItems,
    getMenuItem,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    login,
    register,
    logout,
    getSession,
    getCoupons,
    validateCoupon,
    getCart,
    saveCart,
    getCheckoutState,
    saveCheckoutState,
    getAddresses,
    saveAddress,
    placeOrder,
    getOrders,
    updateOrderStatus,
    processPayment,
    submitReview,
    getReviews,
    getAdminStats
  };
})();
