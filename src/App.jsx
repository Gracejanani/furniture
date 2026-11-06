import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Heart, Menu, Search, ShoppingBag, Star, Truck, ShieldCheck, Headphones, X, Plus, Minus, CheckCircle2 } from "lucide-react";
import { categories, products, imageUrl } from "./data";
import Admin from "./Admin";

function Header({ cartCount, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="topline">Thoughtful comfort. Delivered to your doorstep. <span>Free delivery on orders above ₹999</span></div>
    <header className="site-header">
      <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu /></button>
      <a className="brand" href="#"><span className="brand-mark">R</span><span>RESTORA<small>COMFORT, BEAUTIFULLY MADE</small></span></a>
      <nav className={menuOpen ? "main-nav open" : "main-nav"}>
        <a href="#shop">Shop</a><a href="#collections">Collections</a><a href="#why">Why Restora</a><a href="#stories">Stories</a><a href="#business">For Business</a>
      </nav>
      <div className="header-actions"><button className="icon-btn" aria-label="Search"><Search /></button><button className="icon-btn" aria-label="Wishlist"><Heart /></button><button className="icon-btn bag-btn" onClick={onCart} aria-label="Shopping bag"><ShoppingBag /><b>{cartCount}</b></button></div>
    </header>
  </>;
}

function ProductCard({ product, onAdd }) {
  const [saved, setSaved] = useState(false);
  return <article className="product-card">
    <div className="product-photo"><img src={imageUrl(product.image, 700)} alt={product.name} loading="lazy" /><span className="product-tag">{product.tag}</span><button className={saved ? "save-btn saved" : "save-btn"} onClick={() => setSaved(!saved)} aria-label="Save product"><Heart size={18} fill={saved ? "currentColor" : "none"} /></button></div>
    <div className="product-info"><div className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span>({Math.round(product.rating * 121)})</span></div><h3>{product.name}</h3><p>{product.tone}</p><div className="price-line"><strong>₹{product.price.toLocaleString("en-IN")}</strong><del>₹{product.oldPrice.toLocaleString("en-IN")}</del><em>{Math.round((1-product.price/product.oldPrice)*100)}% OFF</em></div><button className="add-btn" onClick={() => onAdd(product)}>ADD TO BAG <Plus size={15}/></button></div>
  </article>;
}

function CartDrawer({ items, onClose, onChange }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><small>YOUR BAG</small><h2>Good choice.</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    {items.length ? <><div className="cart-items">{items.map(item => <div className="cart-row" key={item.id}><img src={imageUrl(item.image, 180)} alt={item.name}/><div className="cart-copy"><b>{item.name}</b><strong>₹{item.price.toLocaleString("en-IN")}</strong><div className="qty"><button onClick={() => onChange(item.id, -1)}><Minus size={13}/></button>{item.qty}<button onClick={() => onChange(item.id, 1)}><Plus size={13}/></button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><b>₹{total.toLocaleString("en-IN")}</b></div><button className="primary-btn full">CONTINUE TO CHECKOUT <ArrowRight size={16}/></button><p className="cart-note">Taxes calculated at checkout. Free delivery on eligible orders.</p></> : <div className="empty-cart"><ShoppingBag size={36}/><h3>Your bag is taking a nap.</h3><p>Add something lovely to get started.</p><button className="primary-btn" onClick={onClose}>EXPLORE PRODUCTS</button></div>}
  </aside></div>;
}

export default function App() {
  if (window.location.pathname.startsWith("/admin")) return <Admin />;
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [slide, setSlide] = useState(0);
  const productSource = productsOverride ?? products;\n  const filtered = useMemo(() => activeCategory === "All" ? productSource : productSource.filter(p => p.category === activeCategory), [activeCategory, productSource]);
  const addToCart = product => { setCart(old => { const found = old.find(x => x.id === product.id); return found ? old.map(x => x.id === product.id ? {...x, qty:x.qty+1} : x) : [...old, {...product, qty:1}]; }); setCartOpen(true); };
  const changeQty = (id, delta) => setCart(old => old.map(x => x.id === id ? {...x, qty:x.qty+delta} : x).filter(x => x.qty > 0));
  const count = cart.reduce((n, x) => n + x.qty, 0);
  const slides = [{ eyebrow:"THE ART OF DEEP REST", title:"Great comfort\nstarts here.", copy:"Discover sleep that changes the way you feel.", image:"photo-1505693416388-ac5ce068fe85", cta:"EXPLORE MATTRESSES" }, { eyebrow:"LIVE BEAUTIFULLY", title:"Make room\nfor comfort.", copy:"Thoughtfully designed pieces for your everyday.", image:"photo-1600210492486-724fe5c67fb0", cta:"SHOP THE COLLECTION" }];
  return <div className="app-shell">
    <Header cartCount={count} onCart={() => setCartOpen(true)}/>
    <main>
      <section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(15,14,14,.82),rgba(15,14,14,.12)),url(${imageUrl(slides[slide].image, 1800)})`}}>
        <div className="hero-copy"><span className="eyebrow">{slides[slide].eyebrow}</span><h1>{slides[slide].title.split("\\n").map((line,i)=><span key={i}>{line}</span>)}</h1><p>{slides[slide].copy}</p><a className="hero-cta" href="#shop">{slides[slide].cta} <ArrowUpRight size={16}/></a></div>
        <div className="hero-controls"><button onClick={() => setSlide((slide+1)%2)} aria-label="Previous slide"><ChevronLeft/></button><span>0{slide+1} <i/> 02</span><button onClick={() => setSlide((slide+1)%2)} aria-label="Next slide"><ChevronRight/></button></div>
        <div className="hero-stamp"><b>REST</b><span>IS AN ART.</span></div>
      </section>
      <div className="benefit-strip"><div><Truck/><span><b>FREE DELIVERY</b><small>On orders above ₹999</small></span></div><div><ShieldCheck/><span><b>10 YEAR WARRANTY</b><small>Comfort you can trust</small></span></div><div><CheckCircle2/><span><b>TRIED & TESTED</b><small>Made for better living</small></span></div><div><Headphones/><span><b>HERE TO HELP</b><small>We're one call away</small></span></div></div>
      <section className="section category-section" id="collections"><div className="section-heading"><div><span className="eyebrow red">FIND YOUR KIND OF COMFORT</span><h2>Shop by category</h2></div><a href="#shop" className="text-link">VIEW ALL CATEGORIES <ArrowRight size={15}/></a></div><div className="category-row">{categories.map(c=><button key={c.name} className="category-tile" onClick={()=>{setActiveCategory(c.name);document.getElementById("shop").scrollIntoView({behavior:"smooth"});}}><div><img src={imageUrl(c.image,360)} alt={c.name}/></div><b>{c.name}</b><small>{c.count}</small></button>)}</div></section>
      <section className="sleep-banner"><div><span className="eyebrow">BETTER SLEEP BEGINS WITH THE RIGHT SUPPORT</span><h2>Not sleeping right?<br/><em>Let's fix that.</em></h2></div><a href="#shop">FIND YOUR IDEAL MATTRESS <ArrowRight size={16}/></a></section>
      <section className="section products-section" id="shop"><div className="section-heading"><div><span className="eyebrow red">CURATED FOR YOUR COMFORT</span><h2>Handpicked for you.</h2></div><a href="#shop" className="text-link">SHOP ALL <ArrowRight size={15}/></a></div><div className="filter-tabs">{["All","Mattresses","Beds","Sofas","Recliners","Pillows"].map(c=><button className={activeCategory===c?"active":""} key={c} onClick={()=>setActiveCategory(c)}>{c}</button>)}</div><div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p} onAdd={addToCart}/>)}</div></section>
      <section className="offer-band"><div><span>LIMITED-PERIOD OFFER</span><h2>Make comfort yours.</h2></div><strong>UP TO <b>40%</b> OFF</strong><a href="#shop">EXPLORE OFFERS <ArrowRight size={15}/></a></section>
      <section className="press-section"><span className="eyebrow red">A LITTLE LOVE FROM THE PRESS</span><h2>Recommended by those who know.</h2><div className="press-grid"><blockquote><b className="press-logo">THE DAILY EDIT</b><p>“Thoughtful design that makes everyday comfort feel special.”</p><small>— HOME & LIVING</small></blockquote><blockquote><b className="press-logo serif">Living</b><p>“A fresh take on the way we think about rest and our spaces.”</p><small>— THE DESIGN REVIEW</small></blockquote><blockquote><b className="press-logo">urban nest</b><p>“Beautifully considered essentials for a slower, softer life.”</p><small>— WEEKEND JOURNAL</small></blockquote></div></section>
      <section className="feature-split" id="why"><div className="feature-image"><img src={imageUrl("photo-1616486338812-3dadae4b4ace",1100)} alt="Warm and inviting bedroom interior"/></div><div className="feature-copy"><span className="eyebrow red">COMFORT IS PERSONAL</span><h2>Good sleep.<br/><em>Better days.</em></h2><p>We believe the right comfort can change everything. That's why every Restora piece brings together considered materials, thoughtful details and a little more care.</p><a href="#shop" className="text-link">DISCOVER OUR STORY <ArrowRight size={16}/></a></div></section>
      <section className="help-section"><span className="eyebrow red">HERE WHEN YOU NEED US</span><h2>Still need help deciding?</h2><div className="help-grid"><div><img src={imageUrl("photo-1600210492486-724fe5c67fb0",600)} alt="Explore our showroom"/><h3>Visit a showroom</h3><p>See, touch and feel your next favourite.</p><a href="#business">FIND A STORE <ArrowRight size={14}/></a></div><div><img src={imageUrl("photo-1551836022-d5d88e9218df",600)} alt="Speak to an expert"/><h3>Talk to an expert</h3><p>Get a little help finding your perfect fit.</p><a href="mailto:hello@restora.example">TALK TO US <ArrowRight size={14}/></a></div><div><img src={imageUrl("photo-1556228720-195a672e8a03",600)} alt="Sleep advice"/><h3>Explore the journal</h3><p>Simple ideas for better rest and living.</p><a href="#stories">READ OUR STORIES <ArrowRight size={14}/></a></div></div></section>
      <section className="story-section" id="stories"><div><span className="eyebrow red">THE RESTORA JOURNAL</span><h2>Everything comfort<br/>and everything in between.</h2><p>Thoughts, tips and inspiration to make your everyday feel a little more restful.</p><a href="#stories" className="text-link">READ ALL STORIES <ArrowRight size={15}/></a></div><img src={imageUrl("photo-1616486338812-3dadae4b4ace",1000)} alt="A calm, considered home"/></section>
      <section className="business-section" id="business"><img src={imageUrl("photo-1600210492486-724fe5c67fb0",1000)} alt="Premium hospitality interior"/><div><span className="eyebrow red">THOUGHTFUL SPACES, TOGETHER</span><h2>Restora for business.</h2><p>Comfort solutions for hotels, designers and workspaces. Let's create spaces people love to return to.</p><a href="mailto:business@restora.example" className="primary-btn">LET'S WORK TOGETHER <ArrowRight size={15}/></a></div></section>
      <section className="newsletter"><div><span className="eyebrow">A SOFTER SIDE OF YOUR INBOX</span><h2>Good things, delivered.</h2><p>Sign up for new collections, thoughtful reads and members-only offers.</p></div><form onSubmit={e=>{e.preventDefault();if(email.includes("@"))setSubscribed(true);}}><input type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button>{subscribed?"YOU'RE ON THE LIST":"SIGN ME UP"} <ArrowRight size={15}/></button>{subscribed&&<small className="success-msg">Thank you for subscribing.</small>}</form></section>
    </main>
    <footer><div className="footer-top"><a className="brand footer-brand" href="#"><span className="brand-mark">R</span><span>RESTORA<small>COMFORT, BEAUTIFULLY MADE</small></span></a><p>Make space for the good stuff.<br/>Make room for comfort.</p><div className="footer-links"><div><b>EXPLORE</b><a href="#shop">Mattresses</a><a href="#shop">Beds & furniture</a><a href="#shop">Sofas & recliners</a><a href="#collections">All collections</a></div><div><b>WE'RE HERE</b><a href="#business">Contact us</a><a href="#business">Store locator</a><a href="#why">Our story</a><a href="#stories">Journal</a></div><div><b>THE DETAILS</b><a href="#footer">Shipping policy</a><a href="#footer">Returns & refunds</a><a href="#footer">Privacy policy</a><a href="#footer">Terms of use</a></div></div></div><div className="footer-bottom"><span>© 2026 RESTORA. ALL RIGHTS RESERVED.</span><span>MADE WITH CARE, FOR BETTER LIVING.</span><span>INSTAGRAM　 PINTEREST　 FACEBOOK</span></div></footer>
    {cartOpen&&<CartDrawer items={cart} onClose={()=>setCartOpen(false)} onChange={changeQty}/>}
  </div>;
}
function ConnectedStorefront() {
  const rows = useQuery(anyApi.products.featured, {});
  const liveProducts = rows?.map((p) => ({ id: p._id, name: p.name, category: p.category, price: p.price, oldPrice: p.compareAtPrice ?? p.price, tag: p.tags?.[0] ?? (p.featured ? "FEATURED" : "NEW"), rating: 4.7, image: p.images?.[0] ?? "photo-1505693416388-ac5ce068fe85", tone: p.description ?? "Thoughtfully designed comfort" })) ?? [];
  return <Storefront productsOverride={rows === undefined || rows.length === 0 ? products : liveProducts} />;
}

export default function App() {
  if (window.location.pathname.startsWith("/admin")) return <Admin />;
  return import.meta.env.VITE_CONVEX_URL ? <ConnectedStorefront /> : <Storefront />;
}
