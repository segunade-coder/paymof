import React, { useContext, useEffect, useState } from "react";
import "./notifications.css";
import { MainContext } from "../Helpers/Context";
import { RiDeleteBin3Fill, RiNotification3Fill } from "react-icons/ri";
const Notifications = () => {
  let { url, io, loggedSchool, setNotiNum, notifications } =
    useContext(MainContext);
  const [noti, setNoti] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${url}/main/records/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.status) setNoti(data.message);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (loggedSchool) {
      io.emit("get-notification", { loggedSchool });
    }
    io.on("notification", (data) => {
      // console.log(data);
      if (data[0].count > 0) {
        if (data[0].count > 100) {
          setNotiNum("99+");
        } else {
          setNotiNum(data[0].count);
        }
      } else {
        setNotiNum("");
      }
    });
  }, []);
  let removeNoti = (id) => {
    if (id) {
      fetch(`${url}/main/records/deleteNoti?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            notifications.success(data.message);
            setNoti(noti.filter((notifi) => notifi.id !== id));
          } else {
            notifications.warning(data.message);
          }
        })
        .catch((err) => {
          notifications.warning("Something went wrong");
          console.log(err);
        });
    }
  };
  return (
    <div className="__notifications">
      <h2>Notifications</h2>
      <div className="notification__container">
        {isLoading ? (
          <div>Loading...</div>
        ) : noti.length === 0 ? (
          <div>No Notifications yet!</div>
        ) : (
          noti.map((notification) => (
            <div
              key={notification.payment_id + Math.random()}
              className={
                notification.status === "1"
                  ? "alert alert-secondary noti__cont seen"
                  : "alert alert-primary noti__cont not-seen"
              }
            >
              <div
                className="close"
                onClick={() => removeNoti(notification.id)}
              >
                <RiDeleteBin3Fill fill="red" />
              </div>
              <div className="title alert-heading h6">
                {" "}
                <RiNotification3Fill />
                {notification.title}
              </div>
              <div className="body alert-body">
                <div className="content">{notification.text}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <small>
                  {new Date(notification.created_at).toLocaleDateString()}{" "}
                  &nbsp;{" "}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
