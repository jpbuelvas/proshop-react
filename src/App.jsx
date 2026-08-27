import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Cart from "./components/Cart";
import Catalog from "./components/Catalog";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import {
  CAT,
  COLOR_MAP,
  DESC,
  EDIT_LINKS,
  EDIT_SUBS,
  EDIT_TITLES,
  fmt,
} from "./data/products";
import AuthCallback from "./pages/AuthCallback";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistory from "./pages/OrderHistory";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import api from "./services/api";
import { useAuthStore } from "./stores/authStore";

const SHIPPING_FEE = 12900;
const COUNTDOWN_DATE = "2026-07-26";
const CART_STORAGE_KEY = "proshop_cart";
const FAVS_STORAGE_KEY = "proshop_favs";

function loadStoredList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ProductNotFound({ onCatalog }) {
  return (
    <div style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3rem)", textTransform: "uppercase", margin: "0 0 12px" }}>
        Producto no encontrado
      </h1>
      <p style={{ color: "#555", fontSize: 14, margin: "0 0 28px" }}>
        Este producto ya no está disponible o el enlace es incorrecto.
      </p>
      <button
        onClick={onCatalog}
        style={{ padding: "14px 32px", background: "#111", color: "#fff", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", border: "none", cursor: "pointer" }}
      >
        VER CATÁLOGO
      </button>
    </div>
  );
}

function RouteNotFound({ onHome }) {
  return (
    <div style={{ padding: "100px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem, 7vw, 4.4rem)", textTransform: "uppercase", margin: "0 0 12px" }}>
        404
      </h1>
      <p style={{ color: "#555", fontSize: 15, margin: "0 0 28px" }}>
        Esta página no existe.
      </p>
      <button
        onClick={onHome}
        style={{ padding: "14px 32px", background: "#111", color: "#fff", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", border: "none", cursor: "pointer" }}
      >
        VOLVER AL INICIO
      </button>
    </div>
  );
}

function AppShell() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/*" element={<AppMain />} />
    </Routes>
  );
}

function AppMain() {
  const { token, setUser, user } = useAuthStore();
  const [modal, setModal] = useState(null); // 'login' | 'register' | 'admin' | null
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Productos desde la BD ──────────────────────────────────
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const mapped = res.data.map((p) => {
          const variants = p.variants || [];
          // Tamaños únicos disponibles con stock > 0 (excluye 'U' = talla única)
          const sizes = [...new Set(
            variants.filter((v) => v.size !== 'U' && v.available > 0).map((v) => v.size)
          )];
          // Colores únicos disponibles con stock > 0 (excluye 'U' = sin variante de color)
          const colors = [...new Set(
            variants.filter((v) => v.color !== 'U' && v.available > 0).map((v) => v.color)
          )];
          const totalStock = variants.reduce((sum, v) => sum + (v.available || 0), 0);
          return {
            id: p.id,
            name: p.name,
            cats: p.categories || [],
            gender: p.gender || ["U"],
            price: Number(p.price),
            old: p.previousPrice ? Number(p.previousPrice) : 0,
            rating: p.rating ? Number(p.rating) : 0,
            reviews: p.reviews || 0,
            sizes: sizes.length > 0 ? sizes : null,
            colors: colors.length > 0 ? colors : null, // nombres de color reales
            img: p.imageUrl || null,
            variants, // variantes completas para stock y precio especial
            outOfStock: variants.length > 0 && totalStock === 0,
          };
        });
        setProducts(mapped);
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  // ── Configuración del sitio (banner outlet / envío gratis) ──
  const [settings, setSettings] = useState({ outletDiscountPercent: null, freeShippingThreshold: null });

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings({
        outletDiscountPercent: res.data.outletDiscountPercent != null ? Number(res.data.outletDiscountPercent) : null,
        freeShippingThreshold: res.data.freeShippingThreshold != null ? Number(res.data.freeShippingThreshold) : null,
      }))
      .catch(() => {});
  }, []);

  const freeShipFrom = settings.freeShippingThreshold;

  const bannerText = useMemo(() => {
    const parts = [];
    if (settings.outletDiscountPercent != null) parts.push(`HASTA ${settings.outletDiscountPercent}% OFF`);
    if (freeShipFrom != null) parts.push(`ENVÍO GRATIS DESDE ${fmt(freeShipFrom)}`);
    return parts.length > 0 ? ["OUTLET", ...parts].join(" · ") : null;
  }, [settings, freeShipFrom]);

  const findProduct = useCallback(
    (id) => products.find((p) => p.id === id) || products[0] || { price: 0, old: 0, sizes: null, cats: ["ropa"], gender: ["U"], rating: 0, reviews: 0 },
    [products],
  );

  // ── Auth ───────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {});
    }
  }, [token]);

  // ── Estado de catálogo / producto derivado de la URL ────────
  const cat = searchParams.get("cat") || "todos";
  const gender = searchParams.get("gender") || "todos";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const pid = useMemo(() => {
    const m = location.pathname.match(/^\/product\/(.+)$/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
  }, [location.pathname]);

  // ── Estado local (no reflejado en la URL) ───────────────────
  const [state, setState] = useState({
    qty: 1,
    size: "M",
    color: null,   // nombre del color seleccionado (string) o null si no aplica
    cart: loadStoredList(CART_STORAGE_KEY),
    favs: loadStoredList(FAVS_STORAGE_KEY),
    query: "",
    editTab: "ropa",
  });

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const flash = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  }, []);

  // Al cambiar de página (no de query params) volver arriba, igual que antes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const toCatalog = useCallback(
    (c) => {
      const params = new URLSearchParams();
      if (c && c !== "todos") params.set("cat", c);
      navigate(params.toString() ? `/catalog?${params.toString()}` : "/catalog");
    },
    [navigate],
  );

  const setCat = useCallback((newCat) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!newCat || newCat === "todos") next.delete("cat"); else next.set("cat", newCat);
      next.delete("page");
      return next;
    });
  }, [setSearchParams]);

  const setGender = useCallback((newGender) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!newGender || newGender === "todos") next.delete("gender"); else next.set("gender", newGender);
      next.delete("page");
      return next;
    });
  }, [setSearchParams]);

  const setPage = useCallback((p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (p <= 1) next.delete("page"); else next.set("page", String(p));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [setSearchParams]);

  const openProduct = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  // Al entrar a un producto (o cuando ya cargaron los productos), resetear
  // cantidad/talla/color seleccionados en base a la variante disponible.
  useEffect(() => {
    if (pid == null) return;
    const p = products.find((pr) => pr.id === pid);
    if (!p) return;
    setState((s) => ({
      ...s,
      qty: 1,
      size: p.sizes ? p.sizes[0] : null,
      color: p.colors ? p.colors[0] : null,
    }));
  }, [pid, products]);

  const addToCart = useCallback(
    (id, qty, size, color) => {
      qty = qty || 1;
      const p = findProduct(id);
      const variantColor = color || 'U';
      const variantSize = size || 'U';
      const variant = (p.variants || []).find(
        (v) => v.color === variantColor && v.size === variantSize,
      );
      // Si no hay variante o no tiene stock suficiente, bloquear
      if (!variant || variant.available < qty) {
        flash('SIN STOCK DISPONIBLE');
        return;
      }
      setState((s) => {
        const cart = [...s.cart];
        // key única por combinación producto + color + talla
        const k = `${id}|${color || ""}|${size || ""}`;
        const i = cart.findIndex(
          (c) => `${c.id}|${c.color || ""}|${c.size || ""}` === k,
        );
        if (i >= 0) {
          cart[i] = { ...cart[i], qty: cart[i].qty + qty };
        } else {
          cart.push({ id, qty, size: size || null, color: color || null });
        }
        return { ...s, cart };
      });
      flash("AGREGADO AL CARRITO");
    },
    [flash, findProduct],
  );

  const setQty = useCallback((idx, delta) => {
    setState((s) => {
      const cart = [...s.cart];
      cart[idx] = { ...cart[idx], qty: Math.max(1, cart[idx].qty + delta) };
      return { ...s, cart };
    });
  }, []);

  const removeItem = useCallback((idx) => {
    setState((s) => ({ ...s, cart: s.cart.filter((_, i) => i !== idx) }));
  }, []);

  const toggleFav = useCallback((id) => {
    setState((s) => ({
      ...s,
      favs: s.favs.includes(id)
        ? s.favs.filter((x) => x !== id)
        : s.favs.concat(id),
    }));
  }, []);

  const checkout = useCallback(() => {
    // Ir a la página de checkout real (Wompi)
    navigate("/checkout");
  }, [navigate]);

  const vm = useCallback(
    (p) => {
      const sale = !!p.old && p.old > p.price;
      const disc = sale ? Math.round((1 - p.price / p.old) * 100) : 0;
      const fav = state.favs.includes(p.id);
      return {
        id: p.id,
        name: p.name,
        tile: CAT[p.cats?.[0]],
        catLabel: CAT[p.cats?.[0]],
        img: p.img || "",
        noImg: !p.img,
        price: fmt(p.price),
        old: sale ? fmt(p.old) : "",
        onSale: sale,
        discText: `-${disc}%`,
        rating: p.rating.toFixed(1),
        reviews: p.reviews,
        fav,
        favIcon: fav ? "♥" : "♡",
        outOfStock: !!p.outOfStock,
        onView: () => openProduct(p.id),
        onAdd: () =>
          addToCart(
            p.id,
            1,
            p.sizes ? p.sizes[0] : null,
            p.colors ? p.colors[0] : null,
          ),
        onFav: () => toggleFav(p.id),
      };
    },
    [state.favs, openProduct, addToCart, toggleFav],
  );

  const cartCount = useMemo(
    () => state.cart.reduce((a, c) => a + c.qty, 0),
    [state.cart],
  );

  const subtotalNum = useMemo(
    () => state.cart.reduce((a, c) => a + findProduct(c.id).price * c.qty, 0),
    [state.cart, findProduct],
  );
  const savingsNum = useMemo(
    () =>
      state.cart.reduce((a, c) => {
        const p = findProduct(c.id);
        return a + (p.old && p.old > p.price ? (p.old - p.price) * c.qty : 0);
      }, 0),
    [state.cart, findProduct],
  );
  const shippingNum =
    subtotalNum === 0 ? 0 : freeShipFrom != null && subtotalNum >= freeShipFrom ? 0 : SHIPPING_FEE;

  const cartSummary = useMemo(() => {
    const items = state.cart.map((c, idx) => {
      const p = findProduct(c.id) || {};
      const colorHex = c.color ? (COLOR_MAP[c.color] || "#555") : null;
      const parts = [c.color && c.color !== 'U' ? c.color : null, c.size ? `Talla ${c.size}` : null].filter(Boolean);
      const variant = parts.join(' / ');
      return {
        name: p.name,
        img: p.img || "",
        noImg: !p.img,
        variant,
        hasVariant: !!variant,
        colorHex,
        price: fmt(p.price),
        qty: c.qty,
        onInc: () => setQty(idx, 1),
        onDec: () => setQty(idx, -1),
        onRemove: () => removeItem(idx),
      };
    });
    return {
      empty: state.cart.length === 0,
      hasItems: state.cart.length > 0,
      items,
      subtotal: fmt(subtotalNum),
      savings: fmt(savingsNum),
      hasSavings: savingsNum > 0,
      shipping: shippingNum === 0 ? "Gratis" : fmt(shippingNum),
      total: fmt(subtotalNum + shippingNum),
      freeProg: freeShipFrom != null ? Math.min(100, Math.round((subtotalNum / freeShipFrom) * 100)) : 0,
      freeRemaining: freeShipFrom != null ? fmt(Math.max(0, freeShipFrom - subtotalNum)) : "",
      hasRemaining: freeShipFrom != null && freeShipFrom - subtotalNum > 0 && subtotalNum > 0,
      reached: freeShipFrom != null && subtotalNum >= freeShipFrom && subtotalNum > 0,
      onCheckout: checkout,
      onShop: () => toCatalog("todos"),
    };
  }, [
    state.cart,
    subtotalNum,
    savingsNum,
    shippingNum,
    freeShipFrom,
    findProduct,
    setQty,
    removeItem,
    checkout,
    toCatalog,
  ]);

  const productExists = useMemo(
    () => pid != null && products.some((p) => p.id === pid),
    [products, pid],
  );

  const product = useMemo(() => {
    const cp = findProduct(pid);
    const sizes = (cp.sizes || []).map((sz) => ({
      label: sz,
      active: state.size === sz,
      onClick: () => setState((s) => ({ ...s, size: sz })),
    }));
    // Colores desde las variantes reales del producto
    const colors = (cp.colors || []).map((colorName) => ({
      name: colorName,
      hex: COLOR_MAP[colorName] || '#555',
      active: state.color === colorName,
      onClick: () => setState((s) => ({ ...s, color: colorName })),
    }));
    const related = products.filter(
        (p) => p.id !== cp.id && (p.cats || []).some((c) => (cp.cats || []).includes(c)),
      )
      .slice(0, 4)
      .map((p) => vm(p));

    // Stock de la variante actualmente seleccionada
    const selectedColor = cp.colors ? state.color : 'U';
    const selectedSize = cp.sizes ? state.size : 'U';
    const selectedVariant = (cp.variants || []).find(
      (v) => v.color === (selectedColor || 'U') && v.size === (selectedSize || 'U'),
    );
    const variantOutOfStock = !selectedVariant || selectedVariant.available < 1;

    return {
      ...vm(cp),
      outOfStock: variantOutOfStock,
      hasSizes: !!cp.sizes,
      sizes,
      colors,
      desc: DESC[cp.cats?.[0]],
      qty: state.qty,
      onInc: () => setState((s) => ({ ...s, qty: s.qty + 1 })),
      onDec: () => setState((s) => ({ ...s, qty: Math.max(1, s.qty - 1) })),
      onAdd: () =>
        addToCart(cp.id, state.qty, cp.sizes ? state.size : null, cp.colors ? state.color : null),
      onHome: () => navigate("/"),
      onCat: () => toCatalog(cp.cats?.[0] || "todos"),
      related,
    };
  }, [
    pid,
    state.size,
    state.color,
    state.qty,
    findProduct,
    products,
    vm,
    addToCart,
    toCatalog,
    navigate,
  ]);

  const catalog = useMemo(() => {
    const q = (state.query || "").trim().toLowerCase();
    const filtered = products.filter((p) => {
      const catOk = cat === "todos" || (p.cats || []).includes(cat);
      const genOk =
        gender === "todos" || (p.gender || ["U"]).includes(gender);
      const qOk = !q || p.name.toLowerCase().includes(q);
      return catOk && genOk && qOk;
    });
    const catalogItems = filtered.map((p) => vm(p));
    const PAGE_SIZE = 12;
    const totalPages = Math.max(1, Math.ceil(catalogItems.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = catalogItems.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
    const chipDef = [
      ["todos", "TODOS"],
      ["ropa", "ROPA"],
      ["accesorios", "ACCESORIOS"],
      ["equipos", "EQUIPOS"],
      ["outlet", "OUTLET"],
    ];
    const chips = chipDef.map(([c, label]) => ({
      label,
      active: cat === c,
      onClick: () => setCat(c),
    }));
    const genderChips = [
      { label: "TODOS", value: "todos" },
      { label: "HOMBRE", value: "M" },
      { label: "MUJER", value: "W" },
      { label: "UNISEX", value: "U" },
    ].map((g) => ({
      label: g.label,
      active: gender === g.value,
      onClick: () => setGender(g.value),
    }));
    const catLabel =
      cat === "todos"
        ? "TODOS LOS PRODUCTOS"
        : (CAT[cat] || "").toUpperCase();
    return {
      title: catLabel,
      catLabel: cat === "todos" ? "TODOS" : (CAT[cat] || "").toUpperCase(),
      count: catalogItems.length,
      chips,
      genderChips,
      items: pageItems,
      hasItems: catalogItems.length > 0,
      empty: catalogItems.length === 0,
      page: currentPage,
      totalPages,
      onPageChange: setPage,
    };
  }, [cat, gender, state.query, page, products, vm, setCat, setGender, setPage]);

  const homeData = useMemo(() => {
    const sp = products[0] || { price: 0, old: 0, id: null };
    const spSale = sp.old && sp.old > sp.price;
    const spotlight = {
      price: fmt(sp.price),
      old: spSale ? fmt(sp.old) : "",
      disc: spSale ? `-${Math.round((1 - sp.price / sp.old) * 100)}%` : "",
      onView: () => sp.id && openProduct(sp.id),
    };
    const trust = [
      freeShipFrom != null && {
        key: "shipping",
        title: "Envío gratis",
        sub: `En pedidos desde ${fmt(freeShipFrom)}`,
      },
      { key: "returns", title: "30 días", sub: "Cambios y devoluciones" },
      { key: "secure", title: "Pago seguro", sub: "Cifrado en cada transacción" },
      { key: "rating", title: "+12.000 clientes", sub: "Califican 4.8 / 5.0" },
    ].filter(Boolean);
    const offerItems = products
      .filter((p) => p.old && p.old > p.price)
      .slice(0, 8)
      .map((p) => vm(p));
    const bestItems = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
      .map((p) => vm(p));
    const editTabDef = [
      { label: "ROPA", cat: "ropa" },
      { label: "ACCESORIOS", cat: "accesorios" },
      { label: "EQUIPOS", cat: "equipos" },
      { label: "OUTLET", cat: "outlet" },
    ];
    const editTabs = editTabDef.map((et) => ({
      label: et.label,
      active: state.editTab === et.cat,
      onClick: () => setState((s) => ({ ...s, editTab: et.cat })),
    }));
    const editItems = products
      .filter((p) => (p.cats || []).includes(state.editTab))
      .map((p) => vm(p));
    return {
      spotlight,
      trust,
      offerItems,
      bestItems,
      editTabs,
      editItems,
      editCampaignTitle: EDIT_TITLES[state.editTab] || "EQUÍPATE PARA RENDIR",
      editCampaignSub: EDIT_SUBS[state.editTab] || "COLECCIÓN 2026",
      editCampaignLink: EDIT_LINKS[state.editTab] || "VER COLECCIÓN →",
      onEditAll: () => toCatalog(state.editTab),
      onOffersAll: () => toCatalog("todos"),
      onBestAll: () => toCatalog("todos"),
      onHeroCta: () => toCatalog("todos"),
      onHeroCta2: () => toCatalog("todos"),
      onCampaignShop: () => toCatalog("ropa"),
      countdownDate: COUNTDOWN_DATE,
    };
  }, [state.editTab, products, vm, openProduct, toCatalog, freeShipFrom]);

  const nav = useMemo(() => {
    const navDef = [
      { label: "ROPA", cat: "ropa" },
      { label: "ACCESORIOS", cat: "accesorios" },
      { label: "EQUIPOS", cat: "equipos" },
      { label: "OUTLET", cat: "outlet", outlet: true },
    ];
    return navDef.map((n) => {
      const active = location.pathname === "/catalog" && cat === n.cat;
      return {
        label: n.label,
        active,
        outlet: n.outlet,
        onClick: () => toCatalog(n.cat),
      };
    });
  }, [location.pathname, cat, toCatalog]);

  const onSearch = useCallback((value) => {
    setState((s) => ({ ...s, query: value }));
    if (value && location.pathname !== "/catalog") {
      navigate("/catalog");
    }
  }, [location.pathname, navigate]);

  const onSearchKey = useCallback((e) => {
    if (e.key === "Enter" && location.pathname !== "/catalog") {
      navigate("/catalog");
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  // Persistir carrito y favoritos para que sobrevivan a un refresh de página
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch {}
  }, [state.cart]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(state.favs));
    } catch {}
  }, [state.favs]);

  if (loadingProducts) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.1em", fontSize: 14, textTransform: "uppercase" }}>
        Cargando productos...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Hanken Grotesk', sans-serif",
        color: "#111",
        background: "#fff",
      }}
    >
      <Header
        nav={nav}
        bannerText={bannerText}
        query={state.query}
        onSearch={onSearch}
        onSearchKey={onSearchKey}
        onLogo={() => navigate("/")}
        onCart={() => navigate("/cart")}
        onOrders={() => navigate("/orders")}
        onSidebar={() => toCatalog("todos")}
        cartCount={cartCount}
        hasCart={cartCount > 0}
        onLogin={() => setModal('login')}
        onRegister={() => setModal('register')}
        onAdmin={() => setModal('admin')}
      />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home data={homeData} />} />
          <Route path="/catalog" element={<Catalog data={catalog} onHome={() => navigate("/")} />} />
          <Route
            path="/product/:id"
            element={
              productExists
                ? <ProductPage data={product} />
                : <ProductNotFound onCatalog={() => toCatalog("todos")} />
            }
          />
          <Route path="/cart" element={<Cart data={cartSummary} />} />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={state.cart.map((c) => ({
                  id: c.id,
                  qty: c.qty,
                  price: findProduct(c.id).price,
                  size: c.size,
                  color: c.color,
                }))}
                total={subtotalNum + shippingNum}
                onBack={() => navigate("/cart")}
                onSuccess={() => { setState((s) => ({ ...s, cart: [] })); navigate("/orders"); }}
              />
            }
          />
          <Route path="/orders" element={<OrderHistory onHome={() => navigate("/")} />} />
          <Route path="*" element={<RouteNotFound onHome={() => navigate("/")} />} />
        </Routes>
      </main>
      <Footer onLogo={() => navigate("/")} />

      {/* Modales auth / admin */}
      {modal === 'login' && (
        <LoginPage
          onSuccess={() => { setModal(null); flash('SESIÓN INICIADA'); }}
          onGoRegister={() => setModal('register')}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'register' && (
        <RegisterPage
          onSuccess={() => { setModal(null); flash('CUENTA CREADA — ¡BIENVENIDO!'); }}
          onGoLogin={() => setModal('login')}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'admin' && user?.role === 'admin' && (
        <AdminPage onClose={() => setModal(null)} />
      )}

      {toast && (
        <div
          className="toast-animate"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            padding: "13px 26px",
            fontWeight: 700,
            fontSize: 13.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            zIndex: 60,
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default AppShell;
