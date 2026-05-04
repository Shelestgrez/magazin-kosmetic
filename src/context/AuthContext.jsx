import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { hashPassword, verifyPassword } from "../utils/password";

const USERS_KEY = "glowluxe_users_v1";
const CUSTOMER_SESSION_KEY = "glowluxe_session_customer";
const ADMIN_SESSION_KEY = "glowluxe_session_admin";

/** SHA-256("Admin2026!") — демо-пароль администратора (см. страницу входа в админку). */
const ADMIN_SEED_HASH = "04445e6487736590d1ef50186b414e737e0164683cbbec64e00e73c000fd3bef";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function readSession(key) {
  const s = readJson(key, null);
  if (!s?.userId) return null;
  return s.userId;
}

function writeSession(key, userId) {
  if (!userId) localStorage.removeItem(key);
  else writeJson(key, { userId });
}

function ensureSeedUsers() {
  let users = readJson(USERS_KEY, null);
  if (Array.isArray(users) && users.length > 0) return users;
  const admin = {
    id: "user_admin_1",
    email: "admin@glowluxe.kz",
    passwordHash: ADMIN_SEED_HASH,
    name: "Администратор",
    role: "admin",
    phone: "",
    createdAt: new Date().toISOString(),
  };
  users = [admin];
  writeJson(USERS_KEY, users);
  return users;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => ensureSeedUsers());
  const [customerId, setCustomerId] = useState(() => readSession(CUSTOMER_SESSION_KEY));
  const [adminId, setAdminId] = useState(() => readSession(ADMIN_SESSION_KEY));

  const persistUsers = useCallback((next) => {
    setUsers(next);
    writeJson(USERS_KEY, next);
  }, []);

  const customer = useMemo(() => users.find((u) => u.id === customerId && u.role === "customer") ?? null, [users, customerId]);
  const adminUser = useMemo(() => users.find((u) => u.id === adminId && u.role === "admin") ?? null, [users, adminId]);

  const registerCustomer = useCallback(
    async ({ email, password, name, phone }) => {
      const em = email.trim().toLowerCase();
      if (!em || !password || !name.trim()) return { ok: false, errorKey: "auth_required_fields" };
      if (password.length < 6) return { ok: false, errorKey: "auth_password_short" };
      if (users.some((u) => u.email.toLowerCase() === em)) return { ok: false, errorKey: "auth_email_taken" };
      const passwordHash = await hashPassword(password);
      const user = {
        id: `user_${Date.now().toString(36)}`,
        email: em,
        passwordHash,
        name: name.trim(),
        role: "customer",
        phone: (phone || "").trim(),
        createdAt: new Date().toISOString(),
      };
      const next = [...users, user];
      persistUsers(next);
      setCustomerId(user.id);
      writeSession(CUSTOMER_SESSION_KEY, user.id);
      return { ok: true, user };
    },
    [users, persistUsers]
  );

  const loginCustomer = useCallback(
    async (email, password) => {
      const em = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === em && u.role === "customer");
      if (!user) return { ok: false, errorKey: "auth_user_not_found" };
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return { ok: false, errorKey: "auth_wrong_password" };
      setCustomerId(user.id);
      writeSession(CUSTOMER_SESSION_KEY, user.id);
      return { ok: true, user };
    },
    [users]
  );

  const logoutCustomer = useCallback(() => {
    setCustomerId(null);
    writeSession(CUSTOMER_SESSION_KEY, null);
  }, []);

  const loginAdmin = useCallback(
    async (email, password) => {
      const em = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === em && u.role === "admin");
      if (!user) return { ok: false, errorKey: "auth_admin_not_found" };
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return { ok: false, errorKey: "auth_wrong_password" };
      setAdminId(user.id);
      writeSession(ADMIN_SESSION_KEY, user.id);
      return { ok: true, user };
    },
    [users]
  );

  const logoutAdmin = useCallback(() => {
    setAdminId(null);
    writeSession(ADMIN_SESSION_KEY, null);
  }, []);

  const value = useMemo(
    () => ({
      users,
      customer,
      adminUser,
      isCustomer: !!customer,
      isAdmin: !!adminUser,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      loginAdmin,
      logoutAdmin,
    }),
    [
      users,
      customer,
      adminUser,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      loginAdmin,
      logoutAdmin,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
