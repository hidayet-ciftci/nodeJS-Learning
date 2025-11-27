"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Tüm kullanıcıları çekmeye çalış
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 403) {
          setError("BU SAYFAYA ERİŞİM YETKİNİZ YOK! (Sadece Admin)");
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUsers(data); // Kullanıcı listesini state'e at
          setLoading(false);
        }
      });
  }, [router]);

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
        <h1 className="text-3xl font-bold text-red-700 mb-4">⛔ {error}</h1>
        <button
          onClick={() => router.push("/profile")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Profile Dön
        </button>
      </div>
    );

  if (loading)
    return (
      <div className="text-black p-10">Admin yetkileri kontrol ediliyor...</div>
    );

  return (
    <div className="min-h-screen bg-red-50 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-800">
            🔒 Yönetici Paneli
          </h1>
          <button
            onClick={() => router.push("/profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
          >
            Profile Dön
          </button>
        </div>

        <p className="mb-4 text-black">
          Aşağıda sistemdeki tüm kullanıcıları görebilirsiniz:
        </p>

        <div className="bg-white rounded shadow overflow-hidden border border-red-200">
          <table className="min-w-full">
            <thead className="bg-red-100 border-b border-red-200">
              <tr>
                <th className="text-left p-4 text-red-900 font-bold">
                  Kullanıcı Adı
                </th>
                <th className="text-left p-4 text-red-900 font-bold">Email</th>
                <th className="text-left p-4 text-red-900 font-bold">Rol</th>
                <th className="text-left p-4 text-red-900 font-bold">ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-black font-semibold">
                    {user.username}
                  </td>
                  <td className="p-4 text-black">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        user.role === "admin"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
