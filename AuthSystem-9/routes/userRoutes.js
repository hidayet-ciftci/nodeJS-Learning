const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const User = require("../models/User");
const upload = require("../middleware/upload");

//UserRoutes -> veri işlemleri için, -user bilgilerini çekmek , profile erişmek gibi

// "/profile" kısmı -> route , rota olarak geçer.
// app.js'de bu sayfayı çağırdığımız yer yani "/api/users" ise prefix olarak geçer.
// bu fonksiyonlara yani route'lara endpoint denir.
router.get("/profile", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ message: "profile accesed", user });
  } catch (error) {
    next(error);
  }
});

router.get("/", verifyToken, checkRole("admin"), async (req, res, next) => {
  try {
    // Tüm kullanıcıları bul ama şifrelerini getirme
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

/* upload.single('resim'): Sadece TEK bir dosya yükler. 
  (Örn: Sadece profil resmi). Sonuç req.file içine gelir.
  upload.array('resimler', 5): Aynı isimle ÇOKLU dosya yükler. 
  (Örn: Bir ürünün 5 fotoğrafı). Sonuç req.files içine gelir.
  upload.fields([...]): (Bizim kullandığımız) FARKLI İSİMLERLE ÇOKLU dosya yükler. 
  (Örn: Hem 'Avatar' hem 'CV'). Sonuç req.files içine gelir. */

router.post(
  "/upload",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cvFile", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const updateData = {};
      if (req.files.profileImage) {
        updateData.profileImage = req.files.profileImage[0].path;
      }
      if (req.files.cvFile) {
        updateData.cvFile = req.files.cvFile[0].path;
      }
      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
      }).select("-password");
      res.json({ message: "files uploaded successfully", user });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
