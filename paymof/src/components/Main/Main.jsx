import React, { Suspense, useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainContext } from "./Helpers/Context";
import {
  RiMoneyCnyCircleFill,
  RiExchangeFill,
  RiDatabaseFill,
  RiUserAddFill,
  RiNotification2Fill,
  RiDeviceFill,
  RiUser4Fill,
  RiMoneyCnyCircleLine,
  RiExchangeLine,
  RiDatabaseLine,
  RiUserAddLine,
  RiDashboardLine,
  RiDashboardFill,
  RiNotification2Line,
  RiDeviceLine,
  RiSettings3Fill,
  RiSettings3Line,
  RiFileUserFill,
  RiFileUserLine,
  RiLogoutCircleRLine,
  RiWifiOffLine,
  RiWifiLine,
  RiNotification3Fill,
  RiCloseFill,
  RiAdminFill,
} from "react-icons/ri";
import "./main.css";
import Loader from "../small_comps/loader/Loader";
import socketIOClient from "socket.io-client";
import notifications from "./Helpers/Notifications";
const Main = () => {
  const [loggedSchool, setloggedSchool] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [admin, setAdmin] = useState(false);
  const [url] = useState("http://192.168.137.2:5000");
  const [isConnected, setIsConnected] = useState(true);
  const [notificationsArr, setNotificationsArr] = useState([]);
  let disConnect = useRef(0);
  let navigate = useNavigate();
  const io = socketIOClient(url);
  const connectionAlert = useRef(null);
  const [notiNum, setNotiNum] = useState("");
  let location = useLocation();
  let pathtitle = location.pathname.split("/");
  try {
    if (loggedSchool) {
      if (pathtitle[pathtitle.length - 1] !== "")
        document.title = `${pathtitle[
          pathtitle.length - 1
        ][0].toUpperCase()}${pathtitle[pathtitle.length - 1].substring(
          1
        )} | ${loggedSchool.toUpperCase()}`;
      else document.title = `Dashboard | ${loggedSchool.toUpperCase()}`;
    }
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    if (isConnected) {
      if (disConnect.current === 1) {
        !connectionAlert.current.classList.contains("connected") &&
          connectionAlert.current.classList.add("connected");
        connectionAlert.current.classList.contains("disconnected") &&
          connectionAlert.current.classList.remove("disconnected");
        document.getElementById("conn").innerText = "Back online";
        setTimeout(
          () => connectionAlert.current.classList.remove("connected"),
          3000
        );
      }
    } else {
      !connectionAlert.current.classList.contains("disconnected") &&
        connectionAlert.current.classList.add("disconnected");
      connectionAlert.current.classList.contains("connected") &&
        connectionAlert.current.classList.remove("connected");
      document.getElementById("conn").innerText = "Connection lost";
    }
  }, [isConnected]);

  useEffect(() => {
    io.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
      if (loggedSchool) {
        io.emit("get-notification", { loggedSchool });
      }
    });
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
    io.on("connect_failed", () => {
      console.log("failed");
      setIsConnected(false);
    });
    io.on("connect_error", () => {
      console.log("error");
      console.clear();
      setIsConnected(false);
    });
    io.on("disconnect", () => {
      console.log("disconnected");
      disConnect.current = 1;
      setIsConnected(false);
    });
    io.on("show_notification", (data) => {
      if (data) {
        setNotificationsArr([...notificationsArr, data]);
      }
    });
    return () => {
      io.off("connection");
      io.off("disconnect");
      io.off("get-notification");
      io.close();
    };
  }, [io, loggedSchool, notiNum, notificationsArr]);

  useEffect(() => {
    let RemoveArr = setInterval(() => {
      if (notificationsArr.length === 0) {
        clearInterval(RemoveArr);
      } else {
        let tempNo = notificationsArr;
        tempNo.pop();
        setNotificationsArr(tempNo);
      }
    }, 6500);
    return () => {
      clearInterval(RemoveArr);
    };
  }, [notificationsArr]);

  useEffect(() => {
    fetch(`${url}/main`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.creds) {
          if (data.creds.school) {
            setLoggedUser(data.creds.user);
            setloggedSchool(data.creds.school);
            setAdmin(data.creds.admin);
            if (data.creds.admin === false) {
              let pathname = location.pathname.split("/");
              let unauthorizePage = ["users", "settings"];
              pathname[pathname.length - 1] === "" && pathname.pop();
              if (unauthorizePage.includes(pathname[pathname.length - 1])) {
                navigate("../../authorization");
              } else {
              }
            }
          }
        } else {
          navigate("../authentication");
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("../login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.readyState]);

  useEffect(() => {
    if (loggedSchool) {
      let pathname = location.pathname.split("/");
      let path_arr = [];
      pathname.forEach((path) => {
        if (path === loggedSchool.replace(/ /g, "_")) {
          path_arr.push(path);
          return;
        }
      });
      path_arr[0] !== loggedSchool.replace(/ /g, "_") && navigate("not-found");
    }
  });
  const handleLogout = () => {
    window.confirm("do you want to logout?") &&
      fetch(`${url}/logout`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.logout) {
            navigate("../login");
          }
        })
        .catch((err) => console.log(err));
  };
  const removeNoti = (notiID) => {
    setNotificationsArr(notificationsArr.filter((noti) => noti.id !== notiID));
  };
  return (
    <div className="home">
      <MainContext.Provider
        value={{
          loggedSchool,
          loggedUser,
          admin,
          url,
          notifications,
          io,
          setNotiNum,
        }}
      >
        <div className="connection-container" ref={connectionAlert}>
          {isConnected ? <RiWifiLine size={17} /> : <RiWifiOffLine size={17} />}{" "}
          <span id="conn"></span>{" "}
        </div>
        {notificationsArr.length > 0 && (
          <div className="noti-cont">
            {notificationsArr.length > 0 &&
              notificationsArr.map((notification, index) => (
                <div className="noti-container" key={Math.random() * 2}>
                  <div
                    className="close"
                    onClick={() => removeNoti(notification.id)}
                  >
                    <RiCloseFill fill="red" />{" "}
                  </div>
                  <div className="title">
                    <RiNotification3Fill /> Notification
                  </div>
                  <div className="notification-body">
                    {notification.message}
                    <p>Now</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="vert__nav">
          <div className="slogan">
            <RiUser4Fill size={40} title={loggedUser + " logged in"} />
            <p>Admin Fee Record</p>
          </div>
          <nav>
            <NavLink
              to="dashboard"
              className={
                location.pathname ===
                  "/" + loggedSchool.replace(/ /g, "_") + "/" && "active"
              }
            >
              {" "}
              <RiDashboardFill /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="students">
              {" "}
              <RiFileUserFill /> <span> Students</span>
            </NavLink>
            <NavLink to="payment">
              {" "}
              <RiMoneyCnyCircleFill /> <span>Make Payment</span>
            </NavLink>
            <NavLink to="fees">
              {" "}
              <RiExchangeFill /> <span>Fees</span>
            </NavLink>
            <NavLink to="records">
              {" "}
              <RiDatabaseFill /> <span>Record</span>
            </NavLink>
            {admin && (
              <>
                <NavLink to="users" className="admin">
                  {" "}
                  <RiUserAddFill /> <span>Users</span>
                </NavLink>
                <NavLink to="settings" className="admin">
                  {" "}
                  <RiSettings3Fill /> <span>Settings</span>
                </NavLink>
                <NavLink to="backup" className="admin">
                  {" "}
                  <RiDeviceFill /> <span>Backup</span>
                </NavLink>
              </>
            )}
            <NavLink to="notifications" className="">
              {" "}
              <RiNotification2Fill /> <span>Notifications</span>{" "}
              {notiNum !== "" && (
                <span
                  className="badge "
                  style={{ background: "#dc3545", marginLeft: "5px" }}
                >
                  {notiNum}
                </span>
              )}
            </NavLink>
            <button className="desktop" onClick={() => handleLogout()}>
              {" "}
              <RiLogoutCircleRLine /> <span>Logout</span>
            </button>
          </nav>
        </div>
        <header>
          <h4 className="school-name">{loggedSchool}</h4>
          <button onClick={() => handleLogout()} className="phone">
            <RiLogoutCircleRLine style={{ marginLeft: ".3rem" }} size={21} />
          </button>
          <div className="user" title={loggedUser + " logged in"}>
            <RiAdminFill size={21} />
            <small>{loggedUser}</small>
          </div>
        </header>
        <div className="hor-nav">
          <nav>
            <NavLink
              to="dashboard"
              className={
                location.pathname ===
                  "/" + loggedSchool.replace(/ /g, "_") + "/" &&
                "active".concat(" noselect")
              }
            >
              {" "}
              <RiDashboardLine size={20} />{" "}
            </NavLink>
            <NavLink to="students" className="noselect">
              {" "}
              <RiFileUserLine size={20} />{" "}
            </NavLink>
            <NavLink to="payment" className="noselect">
              {" "}
              <RiMoneyCnyCircleLine size={20} />
            </NavLink>
            <NavLink to="fees" className="noselect">
              {" "}
              <RiExchangeLine size={20} />{" "}
            </NavLink>
            <NavLink to="records" className="noselect">
              {" "}
              <RiDatabaseLine size={20} />
            </NavLink>

            {admin && (
              <>
                <NavLink to="users" className="admin noselect">
                  {" "}
                  <RiUserAddLine size={20} />{" "}
                </NavLink>
                <NavLink to="settings" className="admin noselect">
                  {" "}
                  <RiSettings3Line size={20} />{" "}
                </NavLink>
                <NavLink to="backup" className="admin noselect">
                  {" "}
                  <RiDeviceLine size={20} />{" "}
                </NavLink>
              </>
            )}
            <NavLink to="notifications" className="noselect">
              {" "}
              <RiNotification2Line size={20} />{" "}
              {notiNum !== "" && (
                <span
                  className="badge "
                  style={{ background: "#dc3545", marginLeft: "5px" }}
                >
                  {notiNum}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
        <main className="content">
          <Suspense fallback={<Loader.AudioLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </MainContext.Provider>
    </div>
  );
};

export default Main;
