"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Yönlendirme için

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [roleInput, setRoleInput] = useState("user");
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Giriş işlemi başladı..."); // KONSOL KONTROL

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("2. Backend Cevabı:", data); // KONSOL KONTROL

      if (res.ok && (data.token || data.accessToken)) {
        localStorage.setItem("token", data.token || data.accessToken);
        console.log("Yönlendiriliyor...");
        window.location.href = "/profile"; // router.push yerine bunu kullan
      } else {
        console.log("HATA: Token gelmedi veya cevap hatalı");
        setError(data.message || "Giriş Başarısız");
      }
    } catch (err) {
      console.error("TRY-CATCH HATASI:", err);
      setError("Sunucu Hatası");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: roleInput }),
      });
      if (res.ok) {
        alert("Kayıt Başarılı! Giriş yapınız.");
        setIsLoginView(true);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Sunucu Hatası");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isLoginView ? "Giriş Yap" : "Kayıt Ol"}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-900 p-2 mb-4 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={isLoginView ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {!isLoginView && (
            <>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded text-black placeholder-black"
                required
              />
              <select
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded text-black bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 p-2 rounded text-black placeholder-black"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-400 p-2 rounded text-black placeholder-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded font-bold hover:bg-gray-800"
          >
            {isLoginView ? "Giriş" : "Kayıt"}
          </button>
        </form>
        <p
          className="mt-4 text-center text-blue-600 cursor-pointer"
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? "Hesap Oluştur" : "Giriş Yap"}
        </p>
      </div>
    </div>
  );
}
