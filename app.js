const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken')

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const { mongodb, port, secret, expiresIn } = require("./src/config");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async (jwtPayload, next) => {
      // 根据jwt中的id，查找数据库中是否存在改用户
      const user = await User.findOne({ _id: jwtPayload.id });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    }
  )
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(passport.initialize());

// 创建mongodb数据库连接，并暴露在全局global
global.db = mongoose.createConnection(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//定义user模型
const User = db.model(
  "Users",
  new Schema({
    name: String,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.get(
  "/admin",
  (req, res, next) => {
    passport.authenticate("jwt", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ status: 0, message: "未授权" });
      }
    })(req, res, next);
  },
  (req, res) => {
    res.json({ status: 1, message: "profile", data: req.user });
  }
);
app.post("/login", async (req, res, next) => {
  const { username, password: userPassword } = req.body;
  const dbUser = await User.findOne({ username });
	debugger
  if (!dbUser) {
    return res.json({ status: 0, message: "用户不存在" });
  }
	// 不知道为什么直接读对象可以读出来，但是通过对象取数据就需要后面加上'_doc'
  const { _id, password } = dbUser['_doc'];
  if (userPassword === password) {
    const payload = { id: _id };
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
    res.json({ status: 1, message: "ok", data: { token: token } });
  } else {
    res.json({ status: 0, message: "用户名或密码错误" });
  }
});

// 添加user路由
const user = require("./src/routes/user");
app.use("/api/user", user);
// 定义路由
// app.get("/users", async (req, res) => {
//   const list = await User.find({});
//   res.send(list);
// });

app.listen(port, () => {
  console.log(`start listening localhost:${port}`);
});
