import "./index.css";
import logo from "../../images/logo_new.png";
// import calc_logo from "../../images/calc_logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../small_comps/loader/Loader";

const Index = () => {
  let navigate = useNavigate();
  document.title = 'Index | Paymof'
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showElem, setShowElem] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [url] = useState('http://192.168.137.1:5000')
  const startedBtnFocus = () => {
    document.getElementById("school-name").focus();
  };
  const handleSchoolName = (e) => { 
    e.preventDefault();
    if (schoolName.trim()) {
      setError(false);
      setIsLoading(true);
      fetch(
        `${url}/reg/school?school_name=${schoolName
          .toLowerCase()
          .replace(/ /g, "-")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include'
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          if (data.error) {
            setError(true);
            setErrMsg(data.message);
            return;
          } else {
            setError(false);
            setShowElem(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setError(true);
      setErrMsg("Invalid School Name");
    }
  };
  const handleAdminCred = (e) => {
    e.preventDefault();
    if (!adminCode || !adminName) {
      setError(true);
      setErrMsg("Invalid admin cred");
      return;
    }
    setError(false);
    setIsLoading(true)
    fetch(`${url}/reg/admin-reg`, {
      method: "POST",
      credentials:'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schoolName: schoolName,
        adminName: adminName,
        adminCode: adminCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.error) {
          setError(data.error);
          setErrMsg(data.message);
          return;
        }

        setError(false);
        navigate(`/login`, {
            state: {
              schoolName:schoolName,
              adminName:adminName,
              adminCode:adminCode
            }
          })
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  return (
    <div className="__index">
    <div className="index-container">
      <section className="index-container__image-cont">
        {/* <article>
          <img src={calc_logo} alt="logo" />
          <div>
            <span className="logo-line"></span>
            <p>
              P<small>aymof</small>
            </p>
          </div>
        </article> */}
      </section>
      <section className="index-container__text-cont">
        <div className="index-container__text-cont__header-cont">
          <header>
            <div className="logo">
              <img src={logo} alt="paymof logo" />
            </div>
            <section>
              <div>
                {" "}
                <span>.</span> Easy to implement
              </div>
              <div>
                {" "}
                <span>.</span> User friendly
              </div>
              <div>
                {" "}
                <span>.</span> Financeial Database
              </div>
              <div>
                <button onClick={startedBtnFocus}>Get Started</button>
              </div>
            </section>
          </header>
        </div>
        <div className="index-container__text-cont__img-cont">
          <section className="navigations">
            <nav>
              <div className="active">Home</div>
              <div>About us</div>
              <div>Contact</div>
              <div onClick={() => navigate('../login')}>Sign In</div>
            </nav>
          </section>
          <section className="main-text">
            <h1>Record Financial report with Paymof</h1>
            <form>
            {error ? <div className="err-cont"> {errMsg} </div> : ""}
              {!showElem ? (
                <div className="school-cont">
                  <input
                    type="text"
                    placeholder="Enter School Name"
                    id="school-name"
                    onChange={(e) => setSchoolName(e.target.value)}
                    value={schoolName}
                  />
                  <button disabled={isLoading} onClick={handleSchoolName} style={isLoading ? {cursor:'wait'} : {cursor:'pointer'}}>{isLoading ? <Loader.Loader /> : "Start"}</button>
                </div>
              ) : (
                <div className="reg-admin">
                  <input
                    type="text"
                    value={schoolName}
                    disabled
                    className="disabled_schoolName"
                  />
                  <input
                    type="text"
                    placeholder="Admin Name"
                    id="admin-name"
                    onChange={(e) => setAdminName(e.target.value)}
                    value={adminName}
                  />
                  <input
                    type="password"
                    placeholder="Admin Password"
                    id="admin-code"
                    onChange={(e) => setAdminCode(e.target.value)}
                    value={adminCode}
                  />
                  <button onClick={handleAdminCred} disabled={isLoading} style={isLoading ? {cursor:'wait'} : {cursor:'pointer'}}>{isLoading ? <Loader.Loader /> : "continue"}</button>
                </div>
              )}
              
            </form>
          </section>
        </div>
        <div className="index-container__text-cont__others">
          <section>
            <div className="our-services">
              <h2>What We Do?</h2>
              <div className="box-container">
                <div className="boxes">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, tempora?
                </div>
                <div className="boxes">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, tempora? Lorem, ipsum.
                </div>  
                <div className="boxes">
                  Lorem ipsum dolor Ipsam, tempora? Lorem ipsum dolor sit amet, consectetur adipisicing.
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
    <div className="downward-tex">
    </div>
    </div>

  );
};

export default Index;
