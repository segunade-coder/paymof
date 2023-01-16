import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import "./payment.css";
import { MainContext } from "../Helpers/Context";
import Loader from "../../small_comps/loader/Loader";
import { RiRefreshLine } from "react-icons/ri";
import { Notifications } from "react-push-notification";
import ModalCont from "../../small_comps/modal/ModalCont";
import logo from "../../../images/receipt_logo.jpeg";

const Payment = () => {
  let date = new Date();
  let { url, loggedUser, notifications, io } = useContext(MainContext);
  let dateArr = [
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
    date.getUTCMonth() + 1 < 10
      ? `0${date.getUTCMonth() + 1}`
      : date.getUTCMonth() + 1,
    date.getUTCFullYear(),
  ];
  let randomNumber = `${Math.floor(Math.random() * 99999)}`.padStart(
    5,
    Math.floor(Math.random() * 99999)
  );
  const [autoFees, setAutoFees] = useState("");
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [autoName, setAutoName] = useState([]);
  const [studentClass, setStudentClass] = useState("");
  const [classesArray, setClassesArray] = useState([]);
  const [DOG, setDOG] = useState(dateArr.join("/"));
  const [paymentId, setPaymentId] = useState(randomNumber);
  const [DOP, setDOP] = useState("");
  const [term, setTerm] = useState("");
  const [termArray, setTermArray] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [totalFee, setTotalFee] = useState(0);
  const [feePaid, setFeePaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [DOB, setDOB] = useState("");
  const [remark, setRemark] = useState("");
  const [session, setSession] = useState("");
  const [sessionArray, setSessionArray] = useState([]);
  const [error, setError] = useState("");
  const [paymentForArr, setPaymentForArr] = useState([]);
  const [paymentMethodArr, setPaymentMethodArr] = useState([]);
  const [showDOB, setshowDOB] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ErrArr, setErrArr] = useState([]);
  const [PTA, setPTA] = useState("");
  const [lesson, setLesson] = useState("");
  const [viewName, setViewName] = useState("");
  const [viewClass, setViewClass] = useState("");
  const [viewPaymentId, setViewPaymentId] = useState("");
  const [viewTotal, setViewTotal] = useState("");
  const [viewBalance, setViewBalance] = useState("");
  const [viewRemark, setViewRemark] = useState([]);
  const [amountsPaid, setamountsPaid] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [saveTimes, setSaveTimes] = useState(0);
  const viewdate = useRef([]);

  useEffect(() => {
    fetch(`${url}/main/payment/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          let newCls;
          newCls = data.message[0];
          startTransition(() => {
            try {
              setAutoFees(new Map(JSON.parse(newCls.fees)));
              setTermArray(newCls.terms.split(","));
              setPaymentForArr(newCls.payment_for.split(","));
              setSessionArray(newCls.sessions.split(","));
              setPaymentMethodArr(newCls.payment_method.split(","));
              setSession(newCls.current_session);
              setTerm(newCls.current_term.toUpperCase());
              setClassesArray(JSON.parse(newCls.classes));
            } catch {
              notifications.warning("Failed to set datas");
            }
          });
        }
      })

      .catch((err) => console.log(err));
  }, [document.readyState]);

  let changeClass = (e) => {
    setStudentClass(e.target.value);
    autoTotal(e.target.value);
  };

  let autoTotal = (student) => {
    try {
      let splitName = student.split(" ");
      if (
        splitName.length > 2 &&
        splitName[0].toLowerCase() !== "kindergaten"
      ) {
        splitName = splitName.splice(0, 2);
      } else {
        splitName = splitName.splice(0, 1);
      }
      autoFees.has(splitName.join(" ").toLowerCase()) &&
        setTotalFee(autoFees.get(splitName.join(" ").toLowerCase()));
    } catch (error) {
      console.log(error);
    }
  };

  let changePaymentFor = (e) => {
    setPaymentFor(e.target.value);
    if (e.target.value.includes("PART PAYMENT")) {
      setshowDOB(true);
    } else {
      setshowDOB(false);
    }
  };
  useEffect(() => {
    let e = document.getElementById("payment_made");
    if (feePaid) {
      if (parseInt(feePaid) > parseInt(totalFee)) {
        e.style.border = "1px solid red";
        notifications.warning("advance is greater than balance");
        setErrArr(["advance is greater than balance"]);
        setFeePaid(0);
        setBalance(0);
      } else {
        e.style.border = "1px solid gray";
        setBalance(parseInt(totalFee) - parseInt(feePaid));
        setErrArr([]);
      }
    }
  }, [totalFee]);

  let feePaidFnc = (e) => {
    setFeePaid(e.target.value);
    if (parseInt(e.target.value) > parseInt(totalFee)) {
      e.target.style.border = "1px solid red";
      notifications.warning("Advance is greater than balance");
      setErrArr(["advance is greater than balance"]);
      setBalance(parseInt(totalFee) - parseInt(e.target.value));
    } else {
      e.target.style.border = "1px solid gray";
      setBalance(parseInt(totalFee) - parseInt(e.target.value));
      setErrArr([]);
    }
  };

  let autoRemark = () => {
    if (term && paymentFor && paymentMethod) {
      if (paymentFor !== "PART PAYMENT")
        setRemark(
          `${term} PAYMENT FOR ${paymentFor}, THROUGH ${paymentMethod} (${session})`
        );
      else
        setRemark(
          `${paymentFor} MADE FOR ${term}, THROUGH ${paymentMethod} (${session})`
        );
    }
  };

  const findName = (name) => {
    name.length > 1
      ? startTransition(() =>
          fetch(`${url}/main/payment/findName`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ name }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status) {
                setAutoName(data.message);
              }
            })
            .catch((err) => console.log(err))
        )
      : setAutoName([]);
  };
  const clickAutoName = (id) => {
    let details = autoName.find((item) => item.id === id);
    setName(details.name.toUpperCase());
    setStudentClass(details.class.toUpperCase());
    autoTotal(details.class.toUpperCase());
    setAutoName([]);
    autoTotal(studentClass);
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (
      name === "" ||
      paymentId === "" ||
      studentClass === "" ||
      DOP === "" ||
      DOG === "" ||
      paymentFor === "" ||
      paymentMethod === "" ||
      term === "" ||
      totalFee === "" ||
      feePaid === "" ||
      studentClass === "" ||
      remark === "" ||
      balance === ""
    ) {
      setError("All fields are required");
      notifications.warning("All fields are required");
    } else {
      setError("");
      setIsLoading(true);
      if (DOB === "" && showDOB === true) {
        setError("All fields are required");
      } else {
        if (ErrArr.length > 0) {
          setIsLoading(false);
          notifications.warning(ErrArr[0]);
          return;
        } else {
          if (PTA === "" || lesson === "") {
            setIsLoading(false);
            notifications.warning("Set PTA and lesson deduction");
            showModal();
            return;
          } else {
            let datas = {
              name,
              paymentId,
              studentClass,
              DOP,
              DOB,
              DOG,
              lesson,
              PTA,
              paymentFor,
              paymentMethod,
              term,
              totalFee,
              feePaid,
              balance,
              remark,
              session,
              loggedUser,
            };
            fetch(`${url}/main/payment/save`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ datas }),
            })
              .then((res) => res.json())
              .then((data) => {
                setIsLoading(false);
                if (!data.status) {
                  setError(data.message);
                  notifications.warning(data.message);
                } else {
                  setError("");
                  notifications.success("Successful");
                  io.emit("display_notification", {
                    type: "others",
                    name: name.toLowerCase(),
                    payment_id: paymentId,
                    amount_paid: feePaid,
                  });
                  reset();
                }
              })
              .catch((err) => {
                setIsLoading(false);
                console.log(err);
              });
          }
        }
      }
    }
  };
  const reset = () => {
    setName("");
    setStudentClass("");
    setPaymentId(
      `${Math.floor(Math.random() * 99999)}`.padStart(
        5,
        Math.floor(Math.random() * 99999)
      )
    );
    setSaveTimes(0);
    setDOP("");
    setPaymentMethod("");
    setPaymentFor("");
    setTotalFee(0);
    setFeePaid(0);
    setBalance(0);
    setDOB("");
    setRemark("");
    setError("");
    setshowDOB(false);
  };
  let showPrint = (key) => {
    if (key) {
      fetch(`${url}/main/records/get-view?key=${key}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            let remarks = [];
            let amountPaidArr = [];
            let dateArr = [];
            let totalPaid1 = 0;
            let DOGArr = [];
            setViewName(data.message[0].name);
            setViewClass(data.message[0].class);
            setViewPaymentId(data.message[0].payment_id);
            setViewTotal(data.message[0].expected_payment);
            setViewBalance(data.message[0].balance);
            if (data.message.length > 1) {
              data.message.forEach((details) => {
                dateArr.push(details.DOP);
                remarks.push(details.remark);
                amountPaidArr.push(details.amount_paid);
                totalPaid1 += parseInt(details.amount_paid);
                DOGArr.push(details.DOG);
              });
              setViewRemark(remarks);
              setamountsPaid(amountPaidArr);
              setTotalPaid(totalPaid1);
              viewdate.current = dateArr;
            } else {
              setViewRemark([data.message[0].remark]);
              viewdate.current = [data.message[0].DOP];
              setamountsPaid([data.message[0].amount_paid]);
              setTotalPaid(data.message[0].amount_paid);
              setDOG([data.message[0].DOG]);
            }
            reset();
            document
              .getElementsByClassName("print-modal")[0]
              .classList.add("show-modal");
            document.body.style.overflow = "hidden";
            window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
          } else {
            notifications.warning(data.message);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const handlePrint = (e) => {
    e.preventDefault();
    if (saveTimes === 0) {
      if (
        name === "" ||
        paymentId === "" ||
        studentClass === "" ||
        DOP === "" ||
        DOG === "" ||
        paymentFor === "" ||
        paymentMethod === "" ||
        term === "" ||
        totalFee === "" ||
        feePaid === "" ||
        studentClass === "" ||
        remark === "" ||
        balance === ""
      ) {
        setError("All fields are required");
        notifications.warning("All fields are required");
      } else {
        setError("");
        setIsLoading(true);
        if (DOB === "" && showDOB === true) {
          setError("All fields are required");
        } else {
          if (ErrArr.length > 0) {
            setIsLoading(false);
            notifications.warning(ErrArr[0]);
            return;
          } else {
            if (PTA === "" || lesson === "") {
              setIsLoading(false);
              notifications.warning("Set PTA and lesson deduction");
              showModal();
              return;
            } else {
              let datas = {
                name,
                paymentId,
                studentClass,
                DOP,
                DOB,
                DOG,
                lesson,
                PTA,
                paymentFor,
                paymentMethod,
                term,
                totalFee,
                feePaid,
                balance,
                remark,
                session,
                loggedUser,
              };
              fetch(`${url}/main/payment/save`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ datas }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setIsLoading(false);
                  if (!data.status) {
                    setError(data.message);
                    notifications.warning(data.message);
                  } else {
                    setError("");
                    notifications.success("Successful");
                    io.emit("display_notification", {
                      type: "others",
                      name: name.toLowerCase(),
                      payment_id: paymentId,
                      amount_paid: feePaid,
                    });
                    setSaveTimes(1);
                    showPrint(data.key_id);
                  }
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.log(err);
                });
            }
          }
        }
      }
    } else {
      if (window.confirm("Already saved. Do you want to save again?")) {
        handlePrint();
      } else {
        return 0;
      }
    }
  };
  let dob = () => {
    if (feePaid > 0) {
      if (ErrArr.length === 0 && parseInt(totalFee) - parseInt(feePaid) > 0) {
        paymentForArr.includes("part payment") && setPaymentFor("PART PAYMENT");
        setshowDOB(true);
      }
      if (ErrArr.length === 0 && parseInt(totalFee) - parseInt(feePaid) === 0) {
        setshowDOB(false);
      }
    } else {
      setshowDOB(false);
    }
  };
  let autoAdvance = () => {
    if (totalFee) {
      setFeePaid(totalFee);
    }
  };
  let setDOBFnc = (e) => {
    if (new Date(e.target.value) < new Date(Date.now())) {
      notifications.warning("Balance Date is should be in the future");
      e.target.style.border = "1px solid red";
    } else {
      e.target.style.border = "1px solid gray";
      setDOB(e.target.value);
    }
  };
  let showModal = () => {
    document
      .getElementsByClassName("set-lesson")[0]
      .classList.add("show-modal");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
  };
  let closeModal = () => {
    document
      .getElementsByClassName("set-lesson")[0]
      .classList.remove("show-modal");
    document.body.style.overflow = "auto";
    document.body.style.top = "";
  };
  let handlePrint2 = () => {
    window.print();
  };
  return (
    <div className="__payment">
      <Notifications position="top-right" />
      <h2>Make Payment</h2>
      <div style={{ color: "red" }}>{error && error}</div>
      <form>
        <div className="refresh">
          <RiRefreshLine title="refresh" onClick={(e) => reset()} />
        </div>
        <div className="input-cont">
          <label htmlFor="name">Name</label>
          <div className="input-autocomplete-cont">
            <input
              type="text"
              name=""
              id="name"
              placeholder="Name"
              value={name}
              autoFocus={true}
              onChange={(e) => setName(e.target.value)}
              onKeyUp={() => findName(name)}
              autoComplete="off"
            />
            <div className="output-container">
              <div className="output-names">
                {autoName &&
                  autoName.map((item) => (
                    <div
                      className="names"
                      onClick={() => clickAutoName(item.id)}
                      key={item.id}
                    >
                      <span>{item.name}</span> <span>{item.class}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="input-cont">
          <label htmlFor="payment_id">Payment ID</label>
          <input
            type="number"
            name=""
            id="payment_id"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
          />
        </div>
        <div className="input-cont">
          <label htmlFor="classes">Class</label>
          <select
            id="classes"
            value={studentClass}
            onChange={(e) => changeClass(e)}
          >
            <option value=""> Select Class</option>
            {classesArray &&
              classesArray.map((elem) => (
                <option value={elem.toUpperCase()} key={Math.random()}>
                  {elem.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
        <input
          hidden
          style={{ fontFamily: "monospace" }}
          type="text"
          value={DOG}
          onChange={(e) => setDOG(e.target.value)}
        />
        <div className="input-cont">
          <label htmlFor="date_of_payment">Date Of Payment</label>
          <input
            type="date"
            name=""
            id="date_of_payment"
            value={DOP}
            onChange={(e) => setDOP(e.target.value)}
          />
        </div>
        <div className="input-cont">
          <label htmlFor="payment_for">Payment For</label>
          <select
            id="payment_for"
            value={paymentFor}
            onChange={(e) => changePaymentFor(e)}
          >
            <option value="">Select Payment for</option>
            {paymentForArr.map((termVal) => (
              <option value={termVal.trim().toUpperCase()} key={termVal}>
                {termVal.trim().toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="input-cont">
          <label htmlFor="payment_method">Payment Method</label>
          <select
            id="payment_method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            {paymentMethodArr &&
              paymentMethodArr.map((termVal) => (
                <option value={termVal.trim().toUpperCase()} key={termVal}>
                  {termVal.trim().toUpperCase()}
                </option>
              ))}
          </select>
        </div>
        <div className="input-cont">
          <label htmlFor="term">Term</label>
          <select
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="">Select Term</option>
            {termArray.map((termVal) => (
              <option value={termVal.trim().toUpperCase()} key={termVal}>
                {termVal.trim().toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="input-cont">
          <label htmlFor="total_fee">Total Fee</label>
          <input
            type="number"
            id="total_fee"
            value={totalFee}
            onChange={(e) => setTotalFee(e.target.value)}
          />
        </div>
        <div className="input-cont pta">
          <div className="show-pta" onClick={() => showModal()}>
            Deduct PTA and Lesson
          </div>
        </div>
        <div className="input-cont">
          <label htmlFor="payment_made">Advance Fee</label>
          <input
            type="number"
            id="payment_made"
            value={feePaid}
            onChange={(e) => feePaidFnc(e)}
            onBlur={(e) => dob()}
            onDoubleClick={() => autoAdvance()}
          />
        </div>
        <div className="input-cont">
          <label htmlFor="balance">Balance</label>
          <input
            type="number"
            id="balance"
            disabled
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        {showDOB && (
          <div className="input-cont">
            <label htmlFor="date_of_balance">Date Of Balance</label>
            <input
              type="date"
              id="date_of_balance"
              value={DOB}
              onChange={(e) => setDOBFnc(e)}
            />
          </div>
        )}
        <div className="input-cont">
          <label htmlFor="session">Session</label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessionArray.map((sessionVal) => (
              <option value={sessionVal.trim()} key={sessionVal}>
                {sessionVal.trim()}
              </option>
            ))}
          </select>
        </div>
        <div className="input-cont">
          <label htmlFor="remark">Custom Remark</label>
          <textarea
            name=""
            id=""
            placeholder="Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            onDoubleClick={autoRemark}
          ></textarea>
        </div>
        <div className="btn-cont mt-3">
          <button
            onClick={(e) => handleSave(e)}
            className={
              isLoading
                ? "btn btn-outline-success disabled"
                : "btn btn-outline-success"
            }
            disabled={isLoading}
          >
            {isLoading ? <Loader.Loader /> : "Save"}
          </button>
          <button
            onClick={(e) => handlePrint(e)}
            className="btn btn-outline-primary"
          >
            Print
          </button>
        </div>
      </form>

      <ModalCont
        title="Lesson and P.T.A Deduction"
        classModal="set-lesson"
        save={closeModal}
      >
        <form action="">
          <div className="input-cont">
            <label htmlFor="PTA">P.T.A</label>
            <input
              type="number"
              value={PTA}
              id="PTA"
              onChange={(e) => setPTA(e.target.value)}
            />
          </div>
          <div className="input-cont">
            <label htmlFor="lesson">Lesson</label>
            <input
              type="number"
              value={lesson}
              id="total"
              onChange={(e) => setLesson(e.target.value)}
            />
          </div>
        </form>
      </ModalCont>
      <ModalCont
        title={""}
        classModal="print-modal"
        btn="Print"
        save={handlePrint2}
      >
        <div className="print-container">
          <div className="img-cont">
            <img src={logo} alt="logo" />
          </div>
          <h4 className="h5">School Fees Report</h4>
          <div style={{ textAlign: "center" }}>
            DATE & TIME &nbsp; {new Date(Date.now()).toLocaleDateString()}{" "}
            &nbsp; {new Date(Date.now()).toLocaleTimeString()}
          </div>
          <hr />
          <div className="student-info">
            <h4 className="h6">Student Info</h4>
            <div className="table-responsive">
              <div className="p-table">
                <div className="tbody">
                  <span>&nbsp; Name</span>
                  <span className="span">{viewName.toUpperCase()}</span>
                  <span>Class</span>
                  <span className="last span">{viewClass.toUpperCase()}</span>
                  <hr />
                  <span>&nbsp; Payment ID</span>
                  <span className="span">{viewPaymentId}</span>
                  <span>DOP</span>
                  <span className="last span">{viewdate.current[0]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fee-info">
            <h4 className="h6">Fee Info</h4>
            <div className="table-responsive">
              <div className="p-table">
                {/* <thead>
                </thead> */}
                <div className="tbody">
                  <span>&nbsp;Date</span>
                  <span>Paid</span>
                  <span className="last">Remark</span>
                  {viewRemark &&
                    viewRemark.map((re, index) => (
                      <span
                        key={re + Math.random()}
                        title={DOG[index]}
                        className="tr"
                      >
                        <span> &nbsp;{viewdate.current[index]}</span>
                        <span>
                          {parseInt(amountsPaid[index]).toLocaleString()}
                        </span>
                        <span className="last">{re.toUpperCase()}</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="others-cont">
            <div className="others">
              {" "}
              <div>Total Fees:</div>&#x20A6;
              {parseInt(viewTotal).toLocaleString()}
            </div>
            <div className="others">
              {" "}
              <div>Total Paid: </div>&#x20A6;
              {parseInt(totalPaid).toLocaleString()}
            </div>
            <div className="others">
              {" "}
              <div>Balance: </div>&#x20A6;
              {parseInt(viewBalance).toLocaleString()}
            </div>
          </div>
        </div>
      </ModalCont>
    </div>
  );
};

export default Payment;
