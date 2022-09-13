// require important modules
const app = require("express")(); // server module
const session = require('express-session');
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:3000'}});
const mysqlStore = require('express-mysql-session')(session);
const cors = require("cors");
const jsonParser = require("body-parser").json();
const PORT = process.env.PORT || 80;
const sessionStore = new mysqlStore({}, conn);
const path = require('path')
// custom modules 
const regRouter = require('./Routers/regRouter')
const loginRouter = require('./Routers/loginRouter');
const mainRouter = require('./Routers/mainRouter');
const conn = requir('./conn&apis/conn')
// app.set('trust proxy', 1)
// app.use(express.static(path.resolve(__dirname, "../paymof/build")))
app.use(
cors({
    origin: ["http://localhost:3000", "http://localhost:5000", "http://192.168.43.236:80"],
    credentials:true,
}));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'This is a secret',
    cookie:{
        maxAge:1000 * 60 * 60, 
        sameSite:'lax',
        secure:false  },
        store: sessionStore,
}))

app.use("/reg", jsonParser, regRouter);
app.use("/login", jsonParser, loginRouter);
app.use("/main", jsonParser, mainRouter);
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../paymof/build", "index.html"))
// })
server.listen(PORT, '192.168.43.236', () => console.log(`Listening at port ${PORT}`));