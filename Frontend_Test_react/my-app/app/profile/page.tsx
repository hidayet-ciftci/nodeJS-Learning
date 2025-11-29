"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// User tipine yeni alanları ekledik
interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  profileImage?: string; // Backend'den gelen dosya yolu
  cvFile?: string; // Backend'den gelen dosya yolu
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Dosya Yükleme State'leri
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000";

  // --- SAYFA YÜKLENİNCE PROFİLİ ÇEK ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, [router]);

  // --- DOSYA YÜKLEME FONKSİYONU ---
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage && !selectedCV) {
      setMessage("Lütfen en az bir dosya seçin.");
      return;
    }

    setUploading(true);
    setMessage("");

    // 1. FormData Oluştur (Mektup Zarfı)
    const formData = new FormData();

    // Eğer resim seçildiyse zarfa koy
    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }
    // Eğer CV seçildiyse zarfa koy
    if (selectedCV) {
      formData.append("cvFile", selectedCV);
    }

    try {
      const token = localStorage.getItem("token");

      // 2. İsteği Gönder (POST)
      const res = await fetch(`${API_URL}/api/users/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DİKKAT: 'Content-Type': 'multipart/form-data' YAZMIYORUZ!
          // Tarayıcı bunu FormData görünce otomatik ayarlar.
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Dosyalar başarıyla yüklendi! ✅");
        // Ekranda hemen güncel hali görünsün diye user state'ini güncelle
        setUser(data.user);
        // Inputları temizle
        setSelectedImage(null);
        setSelectedCV(null);
      } else {
        setMessage("Hata: " + data.message);
      }
    } catch (error) {
      setMessage("Sunucu hatası oluştu.");
    }
    setUploading(false);
  };

  // --- YARDIMCI: DOSYA URL DÜZELTİCİ ---
  // Windows'ta yollar "uploads\resim.png" (ters slaş) gelebilir.
  // Tarayıcılar "uploads/resim.png" (düz slaş) ister. Bunu düzeltiyoruz.
  const getFileUrl = (path: string) => {
    if (!path) return "";
    const cleanPath = path.replace(/\\/g, "/"); // Ters slaşları düzelt
    return `${API_URL}/${cleanPath}`;
  };

  if (!user) return <div className="text-black p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {/* --- KART 1: PROFİL BİLGİLERİ --- */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
          {/* Profil Resmi Alanı */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-4 bg-gray-200 flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={getFileUrl(user.profileImage)}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span> // Resim yoksa ikon
            )}
          </div>

          <h1 className="text-3xl font-bold text-black">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>

          {/* Rol Etiketi */}
          <span
            className={`mt-2 px-3 py-1 rounded-full text-sm font-bold uppercase ${
              user.role === "admin"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {user.role}
          </span>

          {/* CV İndirme Butonu (Varsa Göster) */}
          {user.cvFile && (
            <a
              href={getFileUrl(user.cvFile)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              📄 CV'yi İndir / Görüntüle
            </a>
          )}
        </div>

        {/* --- KART 2: DOSYA YÜKLEME FORMU --- */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4 border-b pb-2">
            Dosya Yükle / Güncelle
          </h2>

          {message && (
            <div
              className={`p-3 rounded mb-4 text-center font-bold ${
                message.includes("Hata")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleFileUpload} className="space-y-4">
            {/* Resim Seçme */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Profil Resmi (JPG, PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
                className="w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>

            {/* CV Seçme */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                CV Dosyası (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setSelectedCV(e.target.files ? e.target.files[0] : null)
                }
                className="w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {uploading ? "Yükleniyor..." : "Dosyaları Kaydet"}
            </button>
          </form>
        </div>

        {/* --- ALT BUTONLAR --- */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            className="text-gray-600 font-bold hover:text-black"
          >
            ← Çıkış Yap
          </button>

          {user.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md"
            >
              Admin Paneline Git →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
