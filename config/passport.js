let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt; // 製作出來的token拿出來使用
const User = require("../models/user-model");

module.exports = (passport) => {
  // 請看passport-jwt文件
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); // 定義了從 HTTP 請求中提取 JWT token 的方法。
  opts.secretOrKey = process.env.PASSPORT_SECRET; // secret

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // req.user <= foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
