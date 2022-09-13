import "./login.css";
import React, {useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../small_comps/loader/Loader";

const Login = () => {
  const [school, setSchool] = useState("");
  const [schoolArray, setSchoolArray] = useState([]);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let location = useLocation();
  let navigate = useNavigate();
  if (location.state === null) {
  } else {
    var { schoolName, adminName, adminCode } = location.state;
  }
  useEffect(() => {
    if (schoolName || adminCode || adminName) {
      setSchool(schoolName.toLowerCase());
      setUser(adminName);
      setPass(adminCode);
    }
    fetch("http://192.168.43.236:80/login/schools", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
        fetch("http://192.168.43.236:80/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include',
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
              navigate(`../${school.toLowerCase().replace(/ /g, "_")}/`)
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
  let errorStyle = error ? "#ffcccc" : "transparent";
  return (
    <div className="login__cont">
      <div className="inner__container">
        <div className="img__cont"></div>
        <form method="POST">
          <p style={{ background: `${errorStyle} ` }}>{error}</p>
          <div className="login-label">
            <h1>Login</h1>
            <span>
              Don't have an account? <a href="index">Sign up </a>
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
          />
          <input
            type="password"
            name="password"
            className="password"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            placeholder="Enter Password"
          />
          {loading ? <Loader /> : ""}
          <button onClick={handleClickLogin}>Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
