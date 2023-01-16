import React, { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "../Helpers/Context";
import { RiAddLine, RiDeleteBin4Fill, RiEdit2Fill } from "react-icons/ri";
import "./settings.css";
import Loader from "../../small_comps/loader/Loader";
import ModalCont from "../../small_comps/modal/ModalCont";
import { Notifications } from "react-push-notification";

const Settings = () => {
  let { loggedSchool, url, notifications } = useContext(MainContext);
  const [classes, setClasses] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTerm, setCurrentTerm] = useState("");
  const [currentFee, setCurrentFee] = useState("");
  const [newFee, setNewFee] = useState("0");
  const [newClass, setNewClass] = useState("");
  const [newClassFee, setNewClassFee] = useState("");
  const [fees, setFees] = useState([]);
  const [feeEdit, setFeeEdit] = useState([]);
  const [deleteClass, setDeleteClass] = useState("");
  const [sessionArray, setSessionArray] = useState([]);
  const [paymentMethodArr, setPaymentMethodArr] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentForArr, setPaymentForArr] = useState([]);
  const [paymentFor, setPaymentFor] = useState("");
  const [termArray, setTermArray] = useState([]);
  const dataFetchedRef = useRef(false);

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${url}/main/settings?school=${loggedSchool.replace(/ /g, "-")}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data);
        let classes = data.message[0].classes;
        setClasses(JSON.parse(classes));
        setCurrentSession(data.message[0].current_session);
        setCurrentTerm(data.message[0].current_term);
        setFees(new Map(JSON.parse(data.message[0].fees)));
        setTermArray(data.message[0].terms.split(","));
        setSessionArray(data.message[0].sessions.split(","));
        setPaymentMethodArr(data.message[0].payment_method.split(","));
        setPaymentForArr(data.message[0].payment_for.split(","));

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  });
  let saveRequest = (data, updateName) => {
    fetch(`${url}/main/settings/save`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ data: Array.from(data), name: updateName }),
    })
      .then((res) => res.json())
      .then((data) =>
        data.status
          ? notifications.success(data.message)
          : notifications.warning(data.message)
      )
      .catch((err) => console.log(err));
  };
  let saveFees = (id, initValue) => {
    if (
      newFee === "" ||
      newFee === "0" ||
      newFee === 0 ||
      parseInt(currentFee) === parseInt(newFee)
    ) {
    } else {
      console.log(fees);
      let tempSet = fees.set(feeEdit, newFee);
      setFees(tempSet);
      setNewFee("");
      saveRequest(fees, "fees");
      document.getElementsByClassName("one")[0].classList.remove("show-modal");
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    }
  };
  let saveNewClass = (id, initValue) => {
    if (newClass === "" || newClassFee === "") {
      return;
    } else {
      // console.log(newClass, newClassFee);
      try {
        let tempSet = fees.set(newClass, newClassFee);
        setFees(tempSet);
        setClasses([...classes, newClass.toLowerCase()]);
        saveRequest([...classes, newClass.toLowerCase()], "classes");
        saveRequest(fees, "fees");
        setNewFee("");
        setNewClassFee("");
        setNewClass("");
        // console.log(classes);
        document
          .getElementsByClassName("two")[0]
          .classList.remove("show-modal");
        document.body.style.overflow = "auto";
        document.body.style.top = "";
      } catch (error) {
        console.log(error);
      }
    }
  };
  let saveNewSession = (id, initValue) => {
    if (currentSession === "" || sessionArray.includes(currentSession)) {
      return;
    } else {
      setSessionArray([...sessionArray, currentSession]);
      saveRequest([...sessionArray, currentSession], "sessions");

      console.log("get on up");
      document
        .getElementsByClassName("three")[0]
        .classList.remove("show-modal");
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    }
  };
  let savePaymentMethod = (id, initValue) => {
    if (paymentMethod === "" || paymentMethodArr.includes(paymentMethod)) {
      return;
    } else {
      setPaymentMethodArr([...paymentMethodArr, paymentMethod.toLowerCase()]);
      saveRequest(
        [...paymentMethodArr, paymentMethod.toLowerCase()],
        "payment_method"
      );

      document.getElementsByClassName("four")[0].classList.remove("show-modal");
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    }
  };
  let handleEdit = (id, feeValue) => {
    setCurrentFee(feeValue);
    setFeeEdit(id);
    document.getElementsByClassName("one")[0].classList.add("show-modal");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
  };
  let savePaymentFor = (id, initValue) => {
    if (paymentFor === "" || paymentForArr.includes(paymentFor)) {
      return;
    } else {
      setPaymentForArr([...paymentForArr, paymentFor.toLowerCase()]);
      saveRequest([...paymentForArr, paymentFor.toLowerCase()], "payment_for");

      document.getElementsByClassName("five")[0].classList.remove("show-modal");
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    }
  };
  let saveTerm = (id, initValue) => {
    if (currentTerm === "" || termArray.includes(currentTerm)) {
      return;
    } else {
      setTermArray([...termArray, currentTerm.toLowerCase()]);
      saveRequest([...termArray, currentTerm.toLowerCase()], "terms");

      document.getElementsByClassName("six")[0].classList.remove("show-modal");
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    }
  };
  let handleDelete = (arr, id) => {
    if (id !== "") {
      if (arr === "fees") {
        if (window.confirm(`Do you want to delete ${id} fee`)) {
          fees.delete(id);
          setFees(fees);
          setNewFee(0);
          saveRequest(
            fees.filter((elem) => elem !== id),
            arr
          );
        }
      } else if (arr === "classes") {
        if (window.confirm(`Do you want to delete ${id} from class`)) {
          setClasses(classes.filter((elem) => elem !== id));
          fees.delete(id);
          setNewClass("");
          setNewFee(0);
          saveRequest(
            classes.filter((elem) => elem !== id),
            arr
          );
        }
      } else if (arr === "session") {
        if (window.confirm(`Do you want to delete ${id} from session`)) {
          setSessionArray(sessionArray.filter((elem) => elem !== id));
          setNewFee(0);
          saveRequest(
            sessionArray.filter((elem) => elem !== id),
            "sessions"
          );
        }
      } else if (arr === "paymentMethod") {
        if (window.confirm(`Do you want to delete ${id} from payment method`)) {
          setPaymentMethodArr(paymentMethodArr.filter((elem) => elem !== id));
          setNewFee(0);
          setPaymentMethod("");
          saveRequest(
            paymentMethodArr.filter((elem) => elem !== id),
            "payment_method"
          );
        }
      } else if (arr === "paymentFor") {
        if (window.confirm(`Do you want to delete ${id} from paymentType`)) {
          setPaymentForArr(paymentForArr.filter((elem) => elem !== id));
          setNewFee(0);
          saveRequest(
            paymentForArr.filter((elem) => elem !== id),
            "payment_for"
          );
          setPaymentFor("");
        }
      } else if (arr === "term") {
        if (window.confirm(`Do you want to delete ${id} from term`)) {
          setTermArray(termArray.filter((elem) => elem !== id));
          setNewFee(0);
          saveRequest(
            termArray.filter((elem) => elem !== id),
            "terms"
          );
        }
      }
    }
  };
  let changeCurrentSession = (value) => {
    if (
      window.confirm("Do you want to change the current session to " + value)
    ) {
      setCurrentSession(value);
      if (currentSession !== "") {
        fetch(`${url}/main/settings/edit-current-session`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            value,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              notifications.success(data.message);
            } else notifications.warning(data.message);
          })
          .catch((err) => console.log(err));
      } else {
        notifications.warning("Make a selection");
      }
    }
  };
  let changeCurrentTerm = (value) => {
    if (window.confirm("Do you want to change the current term to " + value)) {
      setCurrentTerm(value);
      if (currentTerm !== "") {
        fetch(`${url}/main/settings/edit-current-term`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            value,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              notifications.success(data.message);
            } else notifications.warning(data.message);
          });
      } else {
        notifications.warning("Make a selection");
      }
    }
  };
  let handleAdd = (id) => {
    document.getElementsByClassName(id)[0].classList.add("show-modal");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
    // document.getElementsByClassName(id)[0].style.height = window.innerHeight + "px";
    // console.log(window.innerHeight)
  };
  return (
    <div className="__settings">
      <Notifications position="top-right" />
      <h2>Settings</h2>
      <div className="container">
        <div className="classes">
          <h4 className="h5">Classes</h4>
          {isLoading ? (
            <div>
              <Loader.Loader />
            </div>
          ) : (
            <>
              <div className="add-class-cont">
                <select
                  id=""
                  value={deleteClass}
                  onChange={(e) => setDeleteClass(e.target.value)}
                >
                  {classes &&
                    classes.map((elem) => (
                      <option key={elem + Math.random()} value={elem}>
                        {elem.toUpperCase()}
                      </option>
                    ))}
                </select>
                <div className="btn-add-cont">
                  <button onClick={(e) => handleAdd("two")} title="Add class">
                    {" "}
                    <span>Add</span>
                    <RiAddLine size={20} />
                  </button>
                  <button
                    title="Delete class"
                    onClick={(e) => handleDelete("classes", deleteClass)}
                  >
                    <RiDeleteBin4Fill size={20} fill="#ee2d2d" />
                  </button>
                </div>
              </div>
              <h4 className="h6">Set Current Session</h4>
              <div className="add-session-cont">
                <select
                  id=""
                  value={currentSession}
                  onChange={(e) => changeCurrentSession(e.target.value)}
                >
                  {classes &&
                    sessionArray.map((elem) => (
                      <option key={elem + Math.random()} value={elem}>
                        {elem.toUpperCase()}
                      </option>
                    ))}
                </select>
                <div className="btn-add-cont">
                  <button onClick={(e) => handleAdd("three")} title="Add class">
                    {" "}
                    <span>Add</span>
                    <RiAddLine size={20} />
                  </button>
                  <button
                    title="Delete Session"
                    onClick={(e) => handleDelete("session", currentSession)}
                  >
                    {" "}
                    <RiDeleteBin4Fill size={20} fill="#ee2d2d" />
                  </button>
                </div>
              </div>
              <h4 className="h6">Add Payment Method</h4>
              <div className="add-payment-method-cont">
                <select
                  id=""
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethodArr &&
                    paymentMethodArr.map((elem) => (
                      <option key={elem + Math.random()} value={elem}>
                        {elem.toUpperCase()}
                      </option>
                    ))}
                </select>
                <div className="btn-add-cont">
                  <button onClick={(e) => handleAdd("four")} title="Add class">
                    {" "}
                    <span>Add</span>
                    <RiAddLine size={20} />
                  </button>
                  <button
                    title="Delete payment method"
                    onClick={(e) =>
                      handleDelete("paymentMethod", paymentMethod)
                    }
                  >
                    {" "}
                    <RiDeleteBin4Fill size={20} fill="#ee2d2d" />
                  </button>
                </div>
              </div>
              <h4 className="h6">Add Payment Type</h4>
              <div className="add-payment-for-cont">
                <select
                  id=""
                  value={paymentFor}
                  onChange={(e) => setPaymentFor(e.target.value)}
                >
                  {paymentForArr &&
                    paymentForArr.map((elem) => (
                      <option key={elem + Math.random()} value={elem}>
                        {elem.toUpperCase()}
                      </option>
                    ))}
                </select>
                <div className="btn-add-cont">
                  <button onClick={(e) => handleAdd("five")} title="Add class">
                    {" "}
                    <span>Add</span>
                    <RiAddLine size={20} />
                  </button>
                  <button
                    title="Delete payment type"
                    onClick={(e) => handleDelete("paymentFor", paymentFor)}
                  >
                    {" "}
                    <RiDeleteBin4Fill size={20} fill="#ee2d2d" />
                  </button>
                </div>
              </div>
              <h4 className="h6">Add Term</h4>
              <div className="add-term-cont">
                <select
                  id=""
                  value={currentTerm}
                  onChange={(e) => changeCurrentTerm(e.target.value)}
                >
                  {termArray &&
                    termArray.map((elem) => (
                      <option key={elem + Math.random()} value={elem}>
                        {elem.toUpperCase()}
                      </option>
                    ))}
                </select>
                <div className="btn-add-cont">
                  <button title="Add Term" onClick={(e) => handleAdd("six")}>
                    {" "}
                    <span>Add</span>
                    <RiAddLine size={20} />
                  </button>
                  <button
                    title="Delete Term"
                    onClick={(e) => handleDelete("term", currentTerm)}
                  >
                    {" "}
                    <RiDeleteBin4Fill size={20} fill="#ee2d2d" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="fees-cont">
          <h3 className="h5">Fees</h3>
          <table
            border={1}
            cellSpacing={50}
            className="table table-hover table-responsive"
          >
            <thead>
              <tr>
                <th>Class</th>
                <th>amount</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="loading">
                  <td colSpan={2}>
                    <Loader.Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {Array.from(fees).map((item, index) => {
                    return (
                      <tr key={index + item}>
                        <td>{item[0]}</td>
                        <td className="td-input"> {item[1]} </td>
                        <td>
                          <div className="action-cont">
                            <div
                              className="tb-edit"
                              title="Edit"
                              onClick={(e) => handleEdit(item[0], item[1])}
                            >
                              Edit
                              <button>
                                {<RiEdit2Fill size={20} fill="orange" />}
                              </button>
                            </div>
                            <div
                              className="tb-del"
                              title="Delete"
                              onClick={(e) => handleDelete("fees", item[0])}
                            >
                              <button>
                                {<RiDeleteBin4Fill size={20} fill="#ee2d2d" />}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
        <ModalCont
          title={"Set " + feeEdit + " fee"}
          save={saveFees}
          classModal="one"
        >
          <div className="inputs-container">
            {/* <div className="info"></div> */}
            <div className="input-cont">
              <label htmlFor="current-fee">Current Fee</label>
              <input type="text" id="current-fee" value={currentFee} disabled />
            </div>
            <div className="input-cont">
              <label htmlFor="current-fee">New Fee</label>
              <input
                type="number"
                id="new-fee"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
        </ModalCont>
        <ModalCont
          title={"Add Session"}
          classModal="three"
          save={saveNewSession}
        >
          <div className="inputs-container">
            <div className="input-cont">
              <label htmlFor="add-session">Add Session</label>
              <input
                type="text"
                id="add-session"
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
              />
            </div>
          </div>
        </ModalCont>
        <ModalCont
          title={"Add payment method"}
          classModal="four"
          save={savePaymentMethod}
        >
          <div className="inputs-container">
            <div className="input-cont">
              <label htmlFor="add-payment-method">Add payment Method</label>
              <input
                type="text"
                id="add-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </div>
        </ModalCont>
        <ModalCont
          title={"Add payment type"}
          classModal="five"
          save={savePaymentFor}
        >
          <div className="inputs-container">
            <div className="input-cont">
              <label htmlFor="add-payment-type">Add payment type</label>
              <input
                type="text"
                id="add-payment-type"
                value={paymentFor}
                onChange={(e) => setPaymentFor(e.target.value)}
              />
            </div>
          </div>
        </ModalCont>
        <ModalCont title={"Add term"} classModal="six" save={saveTerm}>
          <div className="inputs-container">
            <div className="input-cont">
              <label htmlFor="add-term">Add Term</label>
              <input
                type="text"
                id="add-term"
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
              />
            </div>
          </div>
        </ModalCont>
        <ModalCont title={"Add Class"} classModal="two" save={saveNewClass}>
          <div className="inputs-container">
            <div className="input-cont">
              <label htmlFor="add-class">Class Name</label>
              <input
                type="text"
                id="add-class"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
              />
            </div>
            <div className="input-cont">
              <label htmlFor="current-fee">Fee</label>
              <input
                type="number"
                id="new-fee"
                value={newClassFee}
                onChange={(e) => setNewClassFee(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
        </ModalCont>
      </div>
    </div>
  );
};

export default Settings;
