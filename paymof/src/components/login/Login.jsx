import "./login.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../small_comps/loader/Loader";

const Login = () => {
  const [school, setSchool] = useState("");
  const [schoolArray, setSchoolArray] = useState([]);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [url] = useState("http://192.168.137.2:5000");
  const [rememberMe, setRememberMe] = useState(true);
  let location = useLocation();
  let navigate = useNavigate();
  document.title = "Login | Paymof";
  try {
    if (location.state === null) {
    } else {
      var { schoolName, adminName, adminCode } = location.state;
    }
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    if (localStorage.getItem("username")) {
      let username = localStorage.getItem("username") || "";
      let password = localStorage.getItem("pass") || "";
      let schl = localStorage.getItem("school") || "";
      if (username && password && schl) {
        setPass(password);
        setUser(username);
        setSchool(schl);
      }
    }
  }, [document.readyState]);

  useEffect(() => {
    if (schoolName || adminCode || adminName) {
      setSchool(schoolName.toLowerCase());
      setUser(adminName);
      setPass(adminCode);
    }
    fetch(`${url}/login/schools`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          navigate("../index");
        }
        if (data.error !== true) {
          setSchoolArray([...data.school]);
          if (schoolName) {
            let arr = [document.getElementsByTagName("select")[0].options];
            for (let i = 0; i < arr[0].length; i++) {
              if (arr[0][i].value === schoolName.toLowerCase()) {
                document.getElementsByTagName(
                  "select"
                )[0].options.selectedIndex = i;

                break;
              }
            }
            // console.log(arr[0].length);
          }
        } else {
          setError(data.message);
        }
      })
      .catch((err) => console.log(err));
  }, [schoolName, adminName, adminCode, location]);

  const handleClickLogin = (e) => {
    e.preventDefault();
    if (school !== "" && user !== "" && pass !== "") {
      if (school !== "Select School") {
        setLoading(true);
        fetch(`${url}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            school: school,
            user: user,
            pass: pass,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setLoading(false);
            if (data.error) {
              setError(data.message);
            } else {
              setError("");
              navigate(`../${school.toLowerCase().replace(/ /g, "_")}/`);
              if (rememberMe) {
                localStorage.setItem("school", school);
                localStorage.setItem("username", user);
                localStorage.setItem("pass", pass);
              } else {
                localStorage.removeItem("school", school);
                localStorage.removeItem("username", user);
                localStorage.removeItem("pass", pass);
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      } else {
        setError("Select a school");
        return;
      }
    } else {
      setError("All fields are required");
    }
  };
  let errorStyle = error ? "alert alert-danger" : "alert alert-light";
  return (
    <div className="login__cont">
      <div className="inner__container">
        {/* <div className="img__cont"></div> */}
        <form method="POST">
          <p className={errorStyle}>{error}</p>
          <div className="login-label">
            <h1>Welcome!</h1>
            <h4>Log in</h4>
            <span>
              <a href="index">Sign up for an account? </a>
            </span>
          </div>
          <h2 className="shool-name">
            {school !== "Select School" ? school : ""}
          </h2>
          <select
            id="schools"
            value={schoolName ? school : school}
            onChange={(e) => setSchool(e.target.value)}
          >
            <option value="Select School">Select School</option>
            {schoolArray.map((elem, index) => (
              <option key={index} value={elem.school}>
                {elem.school}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="username"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            placeholder="Enter Username"
            autoComplete="on"
          />
          <input
            type="password"
            name="password"
            className="password"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            placeholder="Enter Password"
            autoComplete="on"
          />
          <div className="remember-me">
            <input
              type="checkbox"
              name=""
              id=""
              onChange={(e) => setRememberMe(e.target.checked)}
              checked={rememberMe}
            />
            <span>Remember Login</span>
          </div>
          <button
            onClick={handleClickLogin}
            disabled={loading}
            className="btn btn-success btn-block"
          >
            {loading ? <Loader.Loader /> : "Proceed"}
          </button>
          <div className="new-account">
            <span>
              <a href="index">Sign up for an account? </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
