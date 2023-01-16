let WebSok = (io, conn) => {
  let select = null;
  io.on("connection", (socket) => {
    // conn.query("")
    socket.on("get-notification", ({ loggedSchool }) => {
      if (loggedSchool) {
        loggedSchool = loggedSchool.replace(/ /g, "_") || "";
        conn.query(
          `SHOW TABLES LIKE '${loggedSchool}_notifications'`,
          (err, data) => {
            if (err) throw err;
            if (data.length !== 0) {
              conn.query(
                `SELECT COUNT(*) AS count FROM ${loggedSchool}_notifications WHERE status = 0`,
                (err, data) => {
                  if (err) throw err;
                  select = data;
                }
              );
            } else return;
          }
        );
        if (select) {
          io.emit("notification", select);
        }
      }
    });

    socket.on("display_notification", (data) => {
      let message;
      if (data.type === "part")
        message = `${data.name.toUpperCase()} made a part payment of  ${
          data.amount_paid
        } with ID number ${data.payment_id}`;
      else if (data.type === "cleared")
        message = `${data.name.toUpperCase()} has cleared their outstanding payment with ID number ${
          data.payment_id
        }`;
      else
        message = `${data.name.toUpperCase()} made a payment with ID number ${
          data.payment_id
        }`;

      socket.broadcast.emit("show_notification", {
        id: Math.round(Math.random() / 2),
        message,
      });
    });

    socket.on("disconnect", (user) => {});
  });
};

module.exports = WebSok;
