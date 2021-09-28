const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없습니다. 새로 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출 (.png)
      const basename = path.basename(file.originalname, ext);

      done(null, basename + "_" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 2024 }, // 10MB
});

// /api/feed/~
const router = express.Router();

router.post("/image", upload.single("image"), async (req, res, next) => {
  return res.status(201).json({ path: req.file.path });
});

module.exports = router;
