const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();

/**
 * ROUTER       : userRouter
 * URL          : "/create"
 * METHOD       : POST
 * AUTHOR       : 4LEAF.YSH
 * DESC         : Create New User
 * PARAMS       : {email, password, nickname}
 * PARAMS TYPE  : BODY
 * DEV_DATE     : 2021-09-07
 * RESPONSES    : 201, 400, 403
 * PACKAGES     : bcrypt
 * CONFIRM      : 4LEAF.KHJ
 * CONFIRM_DATE : 2021-09-07
 * CURRENT CODE : YELLOW
 *
 */
router.post("/create", async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    const hasPassword = await bcrypt.hash(password, 12);

    const createResult = await User.create({
      email,
      password: hasPassword,
      nickname,
    });

    if (!createResult) {
      return res.status(403).send("잘못된 요청 입니다. 다시 시도해주세요.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("새로운 사용자를 생성할 수 없습니다.");
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error);
      return next(error);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      const fullUser = await User.findOne({
        where: { id: parseInt(user.id) },
        attributes: {
          include: ["id", "email", "nickname", "createdAt", "updatedAt"],
        },
      });

      return res.send(200).json(fullUser);
    });
  });
});

module.exports = router;
