"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Token yoksa login'e at
      return;
    }

    // Profil bilgisini çek
    fetch("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          // Token süresi dolmuşsa
          localStorage.removeItem("token");
          router.push("/");
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, [router]);

  if (!user) return <div className="text-black p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow border border-blue-200">
        <h1 className="text-3xl font-bold text-black mb-4">Profil Sayfası</h1>
        <div className="space-y-2 text-black">
          <p>
            <strong>Kullanıcı Adı:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>

        {/* Eğer Admin ise Admin Paneline Git Butonu Göster */}
        {user.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 mr-2"
          >
            Admin Paneline Git
          </button>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/");
          }}
          className="mt-6 bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-black"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
