/**
 * data.js — Static seed data for Popsicle Stories
 * All runtime mutations persist to localStorage via api.js
 */

const CATEGORIES = [
  'All',
  'Signature Popsicles',
  'Kunafa Specials',
  'Fruit Popsicles',
  'Chocolate & Nutty',
  'Kulfi Classics',
  'Shakes & Sips'
];

const DEFAULT_MENU = [
  {
    id: 1,
    name: 'Kunafa Popsicle',
    category: 'Signature Popsicles',
    description: 'Crispy golden kunafa wrapped around creamy vanilla custard, drizzled with Belgian chocolate and crushed pistachios.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80',
    rating: 4.9,
    reviewCount: 412,
    isVeg: true,
    tags: ['bestseller', 'popular', 'signature'],
    available: true
  },
  {
    id: 2,
    name: 'Strawberry Orange Blast',
    category: 'Signature Popsicles',
    description: 'Our star popsicle — creamy vanilla draped in dark chocolate, fresh strawberry, and a zesty orange slice.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80',
    rating: 4.8,
    reviewCount: 356,
    isVeg: true,
    tags: ['popular', 'signature'],
    available: true
  },
  {
    id: 3,
    name: 'Triple Chocolate Truffle',
    category: 'Signature Popsicles',
    description: 'A decadent chocolate popsicle loaded with dark, milk, and white chocolate drizzle.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    rating: 4.7,
    reviewCount: 231,
    isVeg: true,
    tags: ['chocolate', 'popular'],
    available: true
  },
  {
    id: 4,
    name: 'Rainbow Sprinkle Dream',
    category: 'Signature Popsicles',
    description: 'Vanilla cream popsicle rolled in rainbow sprinkles and candy crunch — a kids favorite.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80',
    rating: 4.6,
    reviewCount: 189,
    isVeg: true,
    tags: ['kids', 'popular'],
    available: true
  },
  {
    id: 5,
    name: 'Pistachio Kunafa Popsicle',
    category: 'Kunafa Specials',
    description: 'Crunchy kunafa and pistachio cream finished with a hint of rose syrup.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80',
    rating: 4.8,
    reviewCount: 167,
    isVeg: true,
    tags: ['premium'],
    available: true
  },
  {
    id: 6,
    name: 'Nutella Kunafa Popsicle',
    category: 'Kunafa Specials',
    description: 'Golden kunafa with a molten Nutella core and a chocolate-hazelnut drizzle.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=600&q=80',
    rating: 4.9,
    reviewCount: 278,
    isVeg: true,
    tags: ['premium', 'bestseller'],
    available: true
  },
  {
    id: 7,
    name: 'Biscoff Kunafa Popsicle',
    category: 'Kunafa Specials',
    description: 'Kunafa layered with Lotus Biscoff spread and a caramelised biscuit crumble.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&q=80',
    rating: 4.8,
    reviewCount: 203,
    isVeg: true,
    tags: ['premium', 'popular'],
    available: true
  },
  {
    id: 8,
    name: 'Alphonso Mango',
    category: 'Fruit Popsicles',
    description: 'Real Alphonso mango pulp churned into a fruity pop — no artificial colours.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3f8f1d1e0e?w=600&q=80',
    rating: 4.7,
    reviewCount: 245,
    isVeg: true,
    tags: ['healthy', 'popular'],
    available: true
  },
  {
    id: 9,
    name: 'Fresh Strawberry',
    category: 'Fruit Popsicles',
    description: 'Hand-picked strawberries blended into a bright, refreshing fruit popsicle.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=600&q=80',
    rating: 4.6,
    reviewCount: 178,
    isVeg: true,
    tags: ['healthy'],
    available: true
  },
  {
    id: 10,
    name: 'Watermelon Mint',
    category: 'Fruit Popsicles',
    description: 'Juicy watermelon with a cool hint of fresh mint — summer on a stick.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&q=80',
    rating: 4.5,
    reviewCount: 142,
    isVeg: true,
    tags: ['refreshing'],
    available: true
  },
  {
    id: 11,
    name: 'Mixed Berry',
    category: 'Fruit Popsicles',
    description: 'A medley of blueberry, raspberry, and blackberry frozen into one vibrant pop.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&q=80',
    rating: 4.6,
    reviewCount: 156,
    isVeg: true,
    tags: ['healthy'],
    available: true
  },
  {
    id: 12,
    name: 'Tender Coconut',
    category: 'Fruit Popsicles',
    description: 'Creamy tender coconut with real malai bits — a local favorite.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&q=80',
    rating: 4.7,
    reviewCount: 198,
    isVeg: true,
    tags: ['popular'],
    available: true
  },
  {
    id: 13,
    name: 'Belgian Dark Chocolate',
    category: 'Chocolate & Nutty',
    description: 'Intense 70% Belgian dark chocolate popsicle for the true chocolate lover.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    rating: 4.8,
    reviewCount: 267,
    isVeg: true,
    tags: ['chocolate', 'popular'],
    available: true
  },
  {
    id: 14,
    name: 'Almond Rocher',
    category: 'Chocolate & Nutty',
    description: 'Chocolate-hazelnut popsicle coated in roasted almonds and crunchy praline.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80',
    rating: 4.8,
    reviewCount: 221,
    isVeg: true,
    tags: ['premium'],
    available: true
  },
  {
    id: 15,
    name: 'Cookies & Cream',
    category: 'Chocolate & Nutty',
    description: 'Vanilla cream popsicle loaded with chocolate cookie crunch in every bite.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=600&q=80',
    rating: 4.7,
    reviewCount: 289,
    isVeg: true,
    tags: ['popular'],
    available: true
  },
  {
    id: 16,
    name: 'Peanut Butter Fudge',
    category: 'Chocolate & Nutty',
    description: 'Creamy peanut butter swirl ribboned with rich chocolate fudge.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&q=80',
    rating: 4.6,
    reviewCount: 134,
    isVeg: true,
    tags: ['nutty'],
    available: true
  },
  {
    id: 17,
    name: 'Malai Kulfi Pop',
    category: 'Kulfi Classics',
    description: 'Slow-cooked reduced milk with cardamom and saffron on a stick.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3f8f1d1e0e?w=600&q=80',
    rating: 4.8,
    reviewCount: 312,
    isVeg: true,
    tags: ['classic', 'popular'],
    available: true
  },
  {
    id: 18,
    name: 'Kesar Pista Kulfi',
    category: 'Kulfi Classics',
    description: 'Traditional saffron and pistachio kulfi, rich and aromatic.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=600&q=80',
    rating: 4.7,
    reviewCount: 254,
    isVeg: true,
    tags: ['classic'],
    available: true
  },
  {
    id: 19,
    name: 'Rose Falooda Pop',
    category: 'Kulfi Classics',
    description: 'Rose syrup, vermicelli, and basil seeds frozen into a nostalgic treat.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=600&q=80',
    rating: 4.6,
    reviewCount: 143,
    isVeg: true,
    tags: ['classic'],
    available: true
  },
  {
    id: 20,
    name: 'Paan Kulfi',
    category: 'Kulfi Classics',
    description: 'Betel-leaf flavoured kulfi with gulkand — a refreshing desi delight.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80',
    rating: 4.5,
    reviewCount: 121,
    isVeg: true,
    tags: ['classic'],
    available: true
  },
  {
    id: 21,
    name: 'Chocolate Thick Shake',
    category: 'Shakes & Sips',
    description: 'A blended chocolate popsicle shake topped with whipped cream and shavings.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
    rating: 4.7,
    reviewCount: 187,
    isVeg: true,
    tags: ['popular'],
    available: true
  },
  {
    id: 22,
    name: 'Strawberry Milkshake',
    category: 'Shakes & Sips',
    description: 'Thick, creamy strawberry shake made with real fruit and a scoop of ice cream.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80',
    rating: 4.6,
    reviewCount: 165,
    isVeg: true,
    tags: [],
    available: true
  },
  {
    id: 23,
    name: 'Filter Coffee Frappe',
    category: 'Shakes & Sips',
    description: 'Chilled South-Indian filter coffee frappe with a light cream float.',
    price: 99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    rating: 4.7,
    reviewCount: 208,
    isVeg: true,
    tags: ['popular'],
    available: true
  },
  {
    id: 24,
    name: 'Rose Milk',
    category: 'Shakes & Sips',
    description: 'Classic chilled rose milk — cool, fragrant, and comforting.',
    price: 70,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
    rating: 4.5,
    reviewCount: 132,
    isVeg: true,
    tags: [],
    available: true
  }
];

const DEFAULT_COUPONS = [
  {
    code: 'SWEET20',
    type: 'percentage',
    value: 20,
    maxDiscount: 100,
    minOrder: 0,
    description: '20% off your first sweet treat',
    active: true
  },
  {
    code: 'FLAT50',
    type: 'flat',
    value: 50,
    minOrder: 299,
    description: '₹50 off on orders above ₹299',
    active: true
  },
  {
    code: 'KUNAFA10',
    type: 'percentage',
    value: 10,
    category: 'Kunafa Specials',
    description: '10% off all Kunafa Specials',
    active: true
  }
];

const DEMO_USERS = [
  {
    id: 'cust-001',
    name: 'Rahul Sharma',
    email: 'customer@test.com',
    password: 'Test@123',
    phone: '9876543210',
    role: 'customer',
    rewardPoints: 120
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@popsiclestories.in',
    password: 'Admin@123',
    phone: '9999999999',
    role: 'admin',
    rewardPoints: 0
  }
];

const PROMO_OFFERS = [
  { text: 'Flat 20% off your first order — code SWEET20', icon: '🍦' },
  { text: 'Free delivery on orders above ₹499', icon: '🚚' },
  { text: 'Now open in Thiruvallur — Kunafa Popsicles are here!', icon: '🎉' }
];

const TESTIMONIALS = [
  {
    name: 'Divya Ramesh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'The Kunafa Popsicle is unreal — crispy, creamy, and that chocolate drizzle! Easily the best dessert in Thiruvallur right now.'
  },
  {
    name: 'Karthik S',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: 'Took the whole family for the grand opening. Fresh fruit popsicles, zero artificial taste, and super friendly staff. We are regulars now!'
  },
  {
    name: 'Aishwarya M',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 4,
    text: 'Loved the Alphonso Mango and Malai Kulfi pops. Ordering online was quick and delivery was still frozen solid. Highly recommend!'
  }
];

const TEAM_MEMBERS = [
  {
    name: 'Aravind Kumar',
    role: 'Founder & Head Popsicle Artist',
    bio: 'Turning simple ingredients into frozen stories.',
    photo: 'https://images.unsplash.com/photo-1577214491175-810e8d5f871f?w=400&q=80'
  },
  {
    name: 'Priya Nair',
    role: 'Flavor Curator',
    bio: 'Dreaming up new flavors, one pop at a time.',
    photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80'
  },
  {
    name: 'Sanjay Rao',
    role: 'Quality & Hygiene Lead',
    bio: 'Zero compromise on freshness and cleanliness.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  },
  {
    name: 'Meena Lakshmi',
    role: 'Customer Happiness',
    bio: 'Making every visit a sweet memory.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
  }
];

const OUTLETS = [
  {
    city: 'Thiruvallur (Flagship)',
    address: 'No. 1, Sivavishnu Koil Street, Rajajipuram, Thiruvallur – 602 001',
    phone: '+91 98409 12345',
    hours: '12:00 PM – 11:00 PM'
  },
  {
    city: 'Avadi',
    address: '24 Poonamallee High Road, Avadi, Chennai 600054',
    phone: '+91 98409 12346',
    hours: '12:00 PM – 11:00 PM'
  },
  {
    city: 'Poonamallee',
    address: '9 Trunk Road, Poonamallee, Chennai 600056',
    phone: '+91 98409 12347',
    hours: '12:00 PM – 11:30 PM'
  }
];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80',
  'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80',
  'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
  'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80',
  'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=600&q=80',
  'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80'
];

const WHY_CHOOSE_US = [
  { icon: '🍓', title: '100% Natural', desc: 'Real fruit and premium ingredients — no artificial colors.' },
  { icon: '🧑‍🍳', title: 'Handcrafted Daily', desc: 'Every popsicle is made fresh in small batches, right here.' },
  { icon: '❄️', title: 'Frozen Fresh', desc: 'Delivered chilled and frozen solid to your doorstep.' },
  { icon: '🍦', title: '24+ Flavors', desc: 'From Kunafa to Kulfi — a story for every craving.' }
];

const PAYMENT_FAILURE_REASONS = [
  'Network connection lost during transaction',
  'Payment gateway timeout — please retry',
  'Transaction cancelled by payment provider',
  'Insufficient funds or card declined',
  'UPI ID verification failed'
];
