"use client";

import React, { useState, useEffect } from "react";

// --- TİP TANIMLAMALARI ---
interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthResponse {
  message?: string;
  token?: string;
  error?: string;
  user?: User;
}

export default function Home() {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [roleInput, setRoleInput] = useState("user");
  const [isLoginView, setIsLoginView] = useState(true);

  // Backend Adresi (5000 Portu)
  const API_URL = "http://localhost:5000";

  // --- SAYFA YÜKLENİNCE ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    }
  }, []);

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: roleInput }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
        setIsLoginView(true);
      } else {
        setError(data.message || "Kayıt hatası");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        fetchProfile(data.token);
      } else {
        setError(data.message || "Giriş başarısız");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // --- PROFİL ÇEKME ---
  const fetchProfile = async (currentToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        if (response.status === 401) {
          handleLogout();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- EKRAN 1: GİRİŞ YAPMIŞ KULLANICI ---
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-xl w-full max-w-md text-center border border-gray-200">
          {/* Başlıklar Siyah */}
          <h1 className="text-3xl font-bold mb-2 text-black">Hoşgeldin!</h1>
          <h2 className="text-xl font-semibold text-black">{user.username}</h2>

          <div className="mt-6 p-4 bg-gray-50 rounded text-left space-y-2 border border-gray-300">
            {/* Etiketler ve Değerler Siyah */}
            <p className="text-black">
              <span className="font-bold text-black">Email:</span> {user.email}
            </p>
            <p className="text-black">
              <span className="font-bold text-black">ID:</span>{" "}
              <span className="text-xs">{user._id}</span>
            </p>
            <p className="text-black">
              <span className="font-bold text-black">Rol:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs uppercase font-bold ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.role}
              </span>
            </p>
          </div>

          {/* SADECE ADMIN GÖREBİLİR */}
          {user.role === "admin" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-bold text-black">🔒 Yönetici Paneli</h3>
              <p className="text-sm text-black">
                Bu alanı sadece Admin rolüne sahip kullanıcılar görebilir.
              </p>
              <button className="mt-2 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 font-bold">
                Kullanıcıları Yönet
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition font-bold"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  // --- EKRAN 2: LOGIN FORM ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isLoginView ? "Giriş Yap" : "Kayıt Ol"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-900 border border-red-400 p-2 rounded mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={isLoginView ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {/* Sadece Kayıt Olurken Görünür */}
          {!isLoginView && (
            <>
              <div>
                <label className="block text-black text-sm font-bold mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin"
                  className="w-full border border-gray-400 p-2 rounded text-black placeholder-black focus:outline-none focus:border-black"
                  required
                />
              </div>

              {/* Rol Seçimi */}
              <div>
                <label className="block text-black text-sm font-bold mb-1">
                  Rol Seç (Test İçin)
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:outline-none focus:border-black"
                >
                  <option value="user">User (Standart)</option>
                  <option value="admin">Admin (Yönetici)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-black text-sm font-bold mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full border border-gray-400 p-2 rounded text-black placeholder-black focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-black text-sm font-bold mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="w-full border border-gray-400 p-2 rounded text-black placeholder-black focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition font-bold"
          >
            {loading ? "..." : isLoginView ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p
          className="mt-4 text-center text-black font-semibold cursor-pointer hover:underline"
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? "Hesap Oluştur" : "Giriş Yap"}
        </p>
      </div>
    </div>
  );
}
