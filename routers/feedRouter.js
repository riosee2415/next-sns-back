const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Feed } = require("../models");

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

router.post("/create", async (req, res, next) => {
  const { content, imagePath } = req.body;

  let title = "";

  if (content.length > 10) {
    title = String(content).substring(0, 9);
  } else {
    title = content;
  }

  try {
    await Feed.create({
      title,
      content,
      imagePath,
      UserId: req.user.id,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("피드를 생성할 수 없습니다.");
  }
});

// GET _ api/feed/list
router.get("/list", async (req, res, next) => {
  try {
    const feeds = await Feed.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(feeds);
  } catch (error) {
    console.error(error);
    return res.status(401).send("피드를 가지고올 수 없습니다.");
  }
});

module.exports = router;
