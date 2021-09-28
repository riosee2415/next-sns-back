const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // 사용자가 전달 한 이메일로 데이터베이스에서 검색!
          const exUser = await User.findOne({
            where: { email },
          });

          // 없으면? 등록되지 않은 이메일 입니다.  -종료-
          if (!exUser) {
            return done(null, false, {
              reason: "존재하지 않는 이메일 입니다.",
            });
          }

          // 이메일을 통해 검색된 사용자의 정보와
          // 사용자가 전송한 비밀번호를 검증
          const result = await bcrypt.compare(password, exUser.password);

          // 검증한게 true라면, 유저를 done 한다.
          if (result) {
            return done(null, exUser);
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
