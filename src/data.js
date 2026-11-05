export const categories = [
  { name: "Mattresses", count: "Explore 24 designs", image: "photo-1505693416388-ac5ce068fe85" },
  { name: "Beds", count: "Explore 18 designs", image: "photo-1505693416388-ac5ce068fe85" },
  { name: "Sofas", count: "Explore 32 designs", image: "photo-1555041469-a586c61ea9bc" },
  { name: "Recliners", count: "Explore 12 designs", image: "photo-1567538096630-e0c55bd6374c" },
  { name: "Pillows", count: "Explore 16 designs", image: "photo-1631049307264-da0ec9d70304" },
  { name: "Bedroom", count: "Explore collections", image: "photo-1616486338812-3dadae4b4ace" },
  { name: "Living", count: "Explore collections", image: "photo-1600210492486-724fe5c67fb0" }
];
export const products = [
  { id: 1, name: " ortho Luxe Memory Foam Mattress", category: "Mattresses", price: 18999, oldPrice: 26999, tag: "BESTSELLER", rating: 4.8, image: "photo-1631049307264-da0ec9d70304", tone: "Medium firm · 8 inch" },
  { id: 2, name: "CloudRest Premium Pocket Spring", category: "Mattresses", price: 24999, oldPrice: 32999, tag: "NEW", rating: 4.7, image: "photo-1505693416388-ac5ce068fe85", tone: "Soft · 10 inch" },
  { id: 3, name: "Serene Upholstered Queen Bed", category: "Beds", price: 35990, oldPrice: 45990, tag: "POPULAR", rating: 4.9, image: "photo-1616486338812-3dadae4b4ace", tone: "Solid wood · Queen" },
  { id: 4, name: "Marlow Three Seater Sofa", category: "Sofas", price: 42990, oldPrice: 55990, tag: "LIMITED OFFER", rating: 4.8, image: "photo-1555041469-a586c61ea9bc", tone: "Premium fabric · 3 seater" },
  { id: 5, name: "Aura Comfort Recliner", category: "Recliners", price: 28990, oldPrice: 36990, tag: "TOP RATED", rating: 4.6, image: "photo-1567538096630-e0c55bd6374c", tone: "Manual recline · Beige" },
  { id: 6, name: "CalmContour Memory Pillow", category: "Pillows", price: 2499, oldPrice: 3499, tag: "DEAL", rating: 4.7, image: "photo-1631049307264-da0ec9d70304", tone: "Cooling foam · Standard" }
];
export const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;