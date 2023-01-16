// require important modules
const path = require("path");
const express = require("express");
const app = express(); // server module
const conn = require("./conn&apis/conn");
const session = require("express-session");
const server = require("http").createServer(app);
const chalk = require("chalk");
const cron = require("node-cron");
let error = chalk.bold.red;
let warning = chalk.hex("#FFA500");
let success = chalk.bold.green;
const os = require("os");
let WebSok = require("./conn&apis/webSok");
const { warn } = require("console");
const { exec } = require("child_process");
// url module
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.43.92:3000",
      "http://192.168.137.2:3000",
    ],
  },
});
const MysqlStore = require("express-mysql-session")(session);
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const sessionStore = new MysqlStore({
  database: "paymof",
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000 * 20,
  createDatabaseTable: true,
  connectionLimit: 1,
  endconnectionOnClose: true,
  charset: "utf8mb4_bin",
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});
let wifiConected;
const addresses = [];
let mainAddress = addresses[0] || "localhost";
let minutes = 0.5;
// let wifiTask = cron.schedule(`*/${minutes} * * * *`, () => {
//     const interfaces = os.networkInterfaces()

//     for (const name of Object.keys(interfaces)){
//         for(const interface of interfaces[name]){
//             if(interface.family === 'IPv4' && !interface.internal && name.startsWith('Wi-Fi')){
//                 addresses.push(interface.address)
//                 mainAddress = addresses[0]
//                 wifiConected = true;
//                 break;
//             }
//         }
//     }
//     if(wifiConected){
//        console.log(success(`Wi-Fi network found ${addresses[0]}`))
//        server.listen(PORT, mainAddress, async () => {
//         console.log(chalk.blue.bold('starting app server'))
//         console.clear()
//         console.log(success(`Success`))
//         console.log(chalk.blueBright.bold(`Listening on network http://${mainAddress}:${PORT}`))
//         let command;
//             command = `explorer "http://${mainAddress}:${PORT}/"`
//         exec(command)

//         wifiTask.stop()

//     });
//     }else {
//         console.clear()
//         console.log(error('Error:'));
//         console.log(error(`Couldnt find any network`))
//         console.log(warning(`Trying again after ${minutes} minutes`));
//     }

// })
// cron.
// custom modules
const regRouter = require("./Routers/regRouter");
const loginRouter = require("./Routers/loginRouter");
const mainRouter = require("./Routers/mainRouter");

// app.set('trust proxy', 1)
// app.use(express.static(path.resolve(__dirname, "../paymof/build")))
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://192.168.43.92:3000",
      `http://${mainAddress}:5000`,
      "http://192.168.137.2:3000",
    ],
    credentials: true,
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "This is a secret",
    key: "paymof",
    store: sessionStore,
    cookie: {
      maxAge: 20 * 24 * 60 * 60 * 100,
      sameSite: "lax",
      secure: false,
    },
  })
);
WebSok(io, conn);

app.use(express.json());
app.use("/reg", regRouter);
app.use("/login", loginRouter);
app.use("/main", mainRouter);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.error(err);
    }
    console.log("The session has been destroyed!");
    return res.json({
      status: true,
      logout: true,
    });
  });
});

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../paymof/build", "index.html"))
// })
server.listen(PORT, "192.168.137.2", (err) => {
  if (err) throw err;
  console.log(chalk.blue.bold("starting app server"));
  console.clear();
  console.log(success(`Success`));
  console.log(success(`Listening on network http://${mainAddress}:${PORT}`));
});
