import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { INITIAL_PRODUCTS } from "../data/products";

const CART_KEY = "glowluxe_cart_v2_kzt";
const ORDERS_KEY = "glowluxe_orders_v3_kzt";
const PRODUCTS_KEY = "glowluxe_products_v1";

export const ORDER_STATUS_OPTIONS = [
  { value: "new", label: "Новый" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Отправлен" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменён" },
];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const ShopContext = createContext(null);

function cloneInitialProducts() {
  return structuredClone(INITIAL_PRODUCTS);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));
  const [products, setProducts] = useState(() => {
    const saved = readStorage(PRODUCTS_KEY, null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return cloneInitialProducts();
  });

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(ORDERS_KEY, orders);
  }, [orders]);

  useEffect(() => {
    writeStorage(PRODUCTS_KEY, products);
  }, [products]);

  const getProductById = useCallback((id) => products.find((p) => p.id === id), [products]);

  const addToCart = useCallback(
    (productId, qty = 1) => {
      const product = getProductById(productId);
      if (!product || product.stock < 1) return false;
      let ok = false;
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        const nextQty = (existing?.qty ?? 0) + qty;
        if (nextQty > product.stock) return prev;
        ok = true;
        if (existing) {
          return prev.map((l) => (l.productId === productId ? { ...l, qty: nextQty } : l));
        }
        return [...prev, { productId, qty: Math.min(qty, product.stock) }];
      });
      return ok;
    },
    [getProductById]
  );

  const setLineQty = useCallback(
    (productId, qty) => {
      const product = getProductById(productId);
      if (!product) return;
      const q = Math.max(0, Math.min(qty, product.stock));
      setCart((prev) => {
        if (q === 0) return prev.filter((l) => l.productId !== productId);
        const has = prev.some((l) => l.productId === productId);
        if (!has) return q > 0 ? [...prev, { productId, qty: q }] : prev;
        return prev.map((l) => (l.productId === productId ? { ...l, qty: q } : l));
      });
    },
    [getProductById]
  );

  const removeLine = useCallback((productId) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartLinesDetailed = useMemo(() => {
    return cart
      .map((line) => {
        const p = getProductById(line.productId);
        if (!p) return null;
        return {
          ...line,
          product: p,
          subtotal: p.price * line.qty,
        };
      })
      .filter(Boolean);
  }, [cart, getProductById]);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const cartTotal = useMemo(() => cartLinesDetailed.reduce((s, l) => s + l.subtotal, 0), [cartLinesDetailed]);

  const placeOrder = useCallback(
    (customer, buyerUserId) => {
      if (cart.length === 0) return null;
      const items = cartLinesDetailed.map((l) => ({
        productId: l.productId,
        name: l.product.name,
        brand: l.product.brand,
        price: l.product.price,
        qty: l.qty,
      }));
      const total = items.reduce((s, i) => s + i.price * i.qty, 0);
      const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const order = {
        id,
        createdAt: new Date().toISOString(),
        status: "new",
        userId: buyerUserId ?? null,
        customer,
        items,
        total,
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, cartLinesDetailed]
  );

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const updateProduct = useCallback((productId, patch) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const next = { ...p, ...patch };
        if (patch.name != null) next.name = String(patch.name).trim() || p.name;
        if (patch.brand != null) next.brand = String(patch.brand).trim() || p.brand;
        if (patch.category != null) next.category = patch.category;
        if (patch.price != null) next.price = Math.max(0, Math.round(Number(patch.price)) || 0);
        if (patch.stock != null) next.stock = Math.max(0, Math.round(Number(patch.stock)) || 0);
        return next;
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      products,
      getProductById,
      cart,
      cartLinesDetailed,
      cartCount,
      cartTotal,
      orders,
      addToCart,
      setLineQty,
      removeLine,
      clearCart,
      placeOrder,
      updateOrderStatus,
      updateProduct,
    }),
    [
      products,
      getProductById,
      cart,
      cartLinesDetailed,
      cartCount,
      cartTotal,
      orders,
      addToCart,
      setLineQty,
      removeLine,
      clearCart,
      placeOrder,
      updateOrderStatus,
      updateProduct,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
