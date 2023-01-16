import React, { useContext, useEffect, useState } from "react";
import "./fees.css";
import ModalCont from "../../small_comps/modal/ModalCont";
import { MainContext } from "../Helpers/Context";
import { Notifications } from "react-push-notification";
import { useRef } from "react";
import { RiRefreshLine, RiSearchLine } from "react-icons/ri";
const Fees = () => {
  let date = new Date();
  let dateArr = [
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
    date.getUTCMonth() + 1 < 10
      ? `0${date.getUTCMonth() + 1}`
      : date.getUTCMonth() + 1,
    date.getUTCFullYear(),
  ];
  const [name, setName] = useState("");
  const [filteredClass, setFilteredClass] = useState("");
  const [filteredSess, setFilteredSess] = useState("");
  const [filteredTerm, setFilteredTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [autoname, setAutoName] = useState([]);
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState(0);
  const [paymentForArr, setPaymentForArr] = useState([]);
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodArr, setPaymentMethodArr] = useState([]);
  const [balanceUser, setBalanceUser] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [total, setTotal] = useState(0);
  const [remark, setRemark] = useState("");
  const [term, setTerm] = useState("");
  const [session, setSession] = useState("");
  const [DOG] = useState(dateArr.join("/"));
  const [DOP, setDOP] = useState("");
  const [balanceDate, setBalanceDate] = useState("");
  const [advance, setAdvance] = useState(0);
  const [keyId, setkeyId] = useState("");
  const [balancePayment, setBalancePayment] = useState("");
  const [balanceClass, setBalanceClass] = useState("");
  const [showDOB, setShowDOB] = useState(false);
  const filterArray = [];
  const [records, setRecords] = useState([]);
  const [ErrArr, setErrArr] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  const limit = 8;
  let autoCom = useRef();
  let { url, loggedUser, notifications, io } = useContext(MainContext);
  let fetchFilters = () => {
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
          try {
            setTerms(newCls.terms.split(","));
            setSessions(newCls.sessions.split(","));
            setClasses(JSON.parse(newCls.classes));
            setPaymentForArr(newCls.payment_for.split(","));
            setPaymentMethodArr(newCls.payment_method.split(","));
          } catch {
            console.log("failed to set datas");
          }
        }
      })

      .catch((err) => console.log(err));
  };

  let fetchRecord = () => {
    setIsLoading(true);
    fetch(`${url}/main/fees/records?page=${currentPage}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.status) {
          try {
            setRecords(data.message);
            setTotalPages(Math.ceil(data.total / limit));
          } catch {
            notifications.warning("Failed to set datas");
          }
        } else {
          notifications.warning(data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  useEffect(() => {
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.readyState]);
  let autoCompleteName = () => {
    setSearchId(0);
    if (name.length > 1) {
      if (filteredClass !== "") {
        filterArray.push({ class: filteredClass });
      }
      if (filteredSess !== "") {
        filterArray.push({ session: filteredSess });
      }
      if (filteredTerm !== "") {
        filterArray.push({ term: filteredTerm });
      }
      if (filterArray.length > 0) {
        fetch(`${url}/main/fees/find-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            condition: true,
            filterArray,
          }),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              setAutoName(data.message);
            }
          })

          .catch((err) => console.log(err));
      } else {
        fetch(`${url}/main/fees/find-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            condition: false,
          }),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              setAutoName(data.message);
            }
          })

          .catch((err) => console.log(err));
      }
    } else {
      setAutoName([]);
    }
  };
  let handlePageChange = (newPage) => {
    setcurrentPage(newPage);
    fetch(`${url}/main/fees/records?page=${currentPage}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.status) {
          try {
            setRecords(data.message);
            // console.log(data.message)
          } catch {
            console.log("failed to set datas");
          }
        } else {
          notifications.warning(data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  const clickAutoName = (id) => {
    let details = autoname.find((item) => item.id === id);
    setName(details.name.toUpperCase());
    setAutoName([]);
    setSearchId(id);
  };
  let findId = (e) => {
    e.preventDefault();
    setAutoName([]);
    let status = false;
    if (searchId > 0) status = true;
    else status = false;
    let datas = {
      searchId,
      name: name.trim().toLowerCase(),
      status,
    };
    if (searchId || name) {
      fetch(`${url}/main/fees/findId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datas),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setRecords((prev) => data.message);
          }
        })

        .catch((err) => console.log(err));
    } else {
      notifications.warning("Empty search");
    }
  };
  let setFilteredClassFnc = (e) => {
    setFilteredClass(e.target.value);
    if (e.target.value !== "") {
      document.querySelector(".filter-class").classList.add("filter");
    } else {
      document.querySelector(".filter-class").classList.remove("filter");
    }
    throw new Error();
  };
  let setFilteredTermFnc = (e) => {
    setFilteredTerm(e.target.value);
    if (e.target.value !== "") {
      document.querySelector(".filter-term").classList.add("filter");
    } else {
      document.querySelector(".filter-term").classList.remove("filter");
    }
  };
  let setFilteredSessFnc = (e) => {
    setFilteredSess(e.target.value);
    if (e.target.value !== "") {
      document.querySelector(".filter-sess").classList.add("filter");
    } else {
      document.querySelector(".filter-sess").classList.remove("filter");
    }
  };
  let setAdvanceFee = (e) => {
    setAdvance(e.target.value);
    if (parseInt(e.target.value) > parseInt(balancePayment)) {
      e.target.style.border = "1px solid red";
      notifications.warning("Advance is greater than balance");
      setErrArr(["advance is greater than balance"]);
    } else {
      e.target.style.border = "1px solid gainsboro";
      setErrArr([]);
    }
  };
  let reset = () => {
    setBalanceUser("");
    setPaymentId("");
    setTotal("");
    setBalancePayment("");
    setTerm("");
    setSession("");
    setkeyId("");
    setAdvance(0);
    setPaymentFor("");
    setPaymentMethod("");
    setDOP("");
    setRemark("");
    setBalanceDate("");
  };
  let balanceFeeBtn = (key) => {
    reset();
    let balanceDetails = records.find((record) => record.keyid === key);
    setBalanceUser(balanceDetails.name.toUpperCase());
    setBalanceClass(balanceDetails.class.toUpperCase());
    setPaymentId(balanceDetails.payment_id);
    setTotal(parseInt(balanceDetails.expected_payment));
    setBalancePayment(parseInt(balanceDetails.balance));
    setTerm(balanceDetails.term);
    setSession(balanceDetails.session);
    setkeyId(balanceDetails.keyid);
    document.getElementsByClassName("fee-modal")[0].classList.add("show-modal");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
  };
  let saveBalance = () => {
    if (
      paymentFor === "" ||
      paymentMethod === "" ||
      advance === "" ||
      date === ""
    ) {
      notifications.warning("Fill in all fields");
    } else {
      if (remark === "") setRemark(paymentFor);
      if (ErrArr.length > 0) notifications.warning(ErrArr[0]);
      else {
        fetch(`${url}/main/fees/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: balanceUser.toLowerCase(),
            payment_id: paymentId,
            amount_paid: advance,
            expected_payment: total,
            balance: balancePayment - advance,
            term: term.toLowerCase(),
            session,
            DOG,
            DOP,
            balanceClass,
            balance_date: balanceDate,
            remark: remark ? remark.toLowerCase() : paymentFor.toLowerCase(),
            keyid: keyId,
            payment_for: paymentFor.toLowerCase(),
            payment_method: paymentMethod.toLowerCase(),
            accountant: loggedUser.toLowerCase(),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              notifications.success(data.message);
              fetchRecord();
              io.emit("display_notification", {
                type:
                  parseInt(balancePayment) - parseInt(advance) === 0
                    ? "cleared"
                    : "part",
                name: balanceUser.toLowerCase(),
                payment_id: paymentId,
                amount_paid: advance,
              });
              document
                .getElementsByClassName("fee-modal")[0]
                .classList.remove("show-modal");
              document.body.style.overflow = "auto";
              document.body.style.top = "";
              reset();
            } else {
              notifications.warning(data.message);
            }
          })

          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  let dob = () => {
    if (advance > 0) {
      if (
        ErrArr.length === 0 &&
        parseInt(balancePayment) - parseInt(advance) > 0
      ) {
        setShowDOB(true);
      }
      if (
        ErrArr.length === 0 &&
        parseInt(balancePayment) - parseInt(advance) === 0
      ) {
        setShowDOB(false);
      }
    } else {
      setShowDOB(false);
    }
  };
  let autoAdvance = () => {
    if (balancePayment) {
      setAdvance(balancePayment);
    }
  };
  let clear = (e) => {
    e.preventDefault();
    setName("");
    setAutoName([]);
    fetchRecord();
  };
  let setDOBFnc = (e) => {
    if (new Date(e.target.value) < new Date(Date.now())) {
      notifications.warning("Balance Date is should be in the future");
      e.target.style.border = "1px solid red";
    } else {
      e.target.style.border = "1px solid gray";
      setBalanceDate(e.target.value);
    }
  };
  useEffect(() => {
    let handleBlur = (e) => {
      if (autoCom.current) {
        if (!autoCom.current.contains(e.target)) {
          setAutoName([]);
        }
      }
    };
    document.addEventListener("click", handleBlur);
    return () => {
      document.removeEventListener("click", handleBlur);
    };
  }, [autoCom]);

  return (
    <div className="__fees">
      <Notifications position="top-right" />
      <h2>Balance Fee</h2>
      <form className="search-container">
        <label htmlFor="name">Name</label>
        <div className="input-filter-cont">
          <input
            type="select"
            id="name"
            value={name}
            onKeyUp={() => autoCompleteName(name)}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Enter Name to search"
          />
          <div className="output-container" id="form-id" ref={autoCom}>
            <div className="output-names">
              {autoname &&
                autoname.map((item) => (
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
        <select
          value={filteredClass}
          onChange={(e) => setFilteredClassFnc(e)}
          className="filter-class"
        >
          <option value="">Class</option>
          {classes &&
            classes.map((elem) => (
              <option value={elem.toUpperCase()} key={Math.random()}>
                {elem.toUpperCase()}
              </option>
            ))}
        </select>
        <select
          value={filteredTerm}
          onChange={(e) => setFilteredTermFnc(e)}
          className="filter-term"
        >
          <option value="">Term</option>
          {terms &&
            terms.map((elem) => (
              <option value={elem.toUpperCase()} key={Math.random()}>
                {elem.toUpperCase()}
              </option>
            ))}
        </select>
        <select
          value={filteredSess}
          onChange={(e) => setFilteredSessFnc(e)}
          className="filter-sess"
        >
          <option value="">Session</option>
          {sessions &&
            sessions.map((elem) => (
              <option value={elem.toUpperCase()} key={Math.random()}>
                {elem.toUpperCase()}
              </option>
            ))}
        </select>
        <div className="btn-cont">
          <button onClick={(e) => findId(e)} className="btn btn-success btn-sm">
            {" "}
            <RiSearchLine />
            <span style={{ marginLeft: ".3rem" }}>Find</span>
          </button>
          <button onClick={(e) => clear(e)} className="btn btn-danger btn-sm">
            Clear
          </button>
        </div>
      </form>
      <div className="balance-table">
        <div
          className="refresh"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: ".2rem 0",
          }}
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() => fetchRecord()}
            title="Refresh"
          >
            <RiRefreshLine />
          </span>
        </div>
        <table border={1} className="table table-responsive table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>payment id</th>
              <th>Class</th>
              <th>Balance (&#x20A6;)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="loading">
                <td colSpan={5} style={{ textAlign: "center" }}>
                  loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr className="loading">
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No records available
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.keyid + new Date() + Math.random()}>
                  <td>{record.name}</td>
                  <td>{record.payment_id} </td>
                  <td>{record.class} </td>
                  <td>{parseInt(record.balance).toLocaleString()} </td>
                  <td>
                    <div className="action-cont">
                      <div
                        onClick={() => balanceFeeBtn(record.keyid)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        balance Fee
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {records.length > 0 && (
          <div className="pagination-buttons">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="first-page"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="prev-page"
            >
              Prev
            </button>
            {Array.from(Array(totalPages).keys()).map((page) => {
              if (page <= 7) {
                return (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={currentPage - 1 === page ? "active" : ""}
                  >
                    {page + 1}
                  </button>
                );
              } else {
                return "";
              }
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="next-page"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="last-page"
            >
              Last
            </button>
          </div>
        )}
      </div>
      <ModalCont title="Balance Fee" classModal="fee-modal" save={saveBalance}>
        <form action="">
          <div className="input-cont">
            <label htmlFor="balance-user">Name</label>
            <input type="text" value={balanceUser} disabled id="balance-user" />
          </div>
          <div className="input-cont">
            <label htmlFor="payment-id">Payment ID</label>
            <input type="text" value={paymentId} disabled id="payment-id" />
          </div>
          <div className="input-cont">
            <label htmlFor="class">Class</label>
            <input type="text" value={balanceClass} disabled id="class" />
          </div>
          <div className="input-cont">
            <label htmlFor="total">Total</label>
            <input
              type="text"
              value={total.toLocaleString()}
              disabled
              id="total"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="balance-payment">Balance</label>
            <input
              type="text"
              value={balancePayment.toLocaleString()}
              onChange={(e) => setBalancePayment(e.target.value)}
              disabled
              id="balance-payment"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="payment-type">Payment Type</label>
            <select
              value={paymentFor}
              onChange={(e) => setPaymentFor(e.target.value)}
              className="payment-for"
              id="payment-type"
            >
              <option value="">Select Payment Type</option>
              {paymentForArr &&
                paymentForArr.map((elem) => (
                  <option value={elem.toUpperCase()} key={Math.random()}>
                    {elem.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>
          <div className="input-cont">
            <label htmlFor="payment-method">Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method"
              id="payment-method"
            >
              <option value="">Select Payment Method</option>
              {paymentMethodArr &&
                paymentMethodArr.map((elem) => (
                  <option value={elem.toUpperCase()} key={Math.random()}>
                    {elem.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>
          <div className="input-cont">
            <label htmlFor="advance">Advance</label>
            <input
              type="number"
              value={advance}
              onChange={(e) => setAdvanceFee(e)}
              onDoubleClick={() => autoAdvance()}
              id="advance"
              placeholder="Enter Advance"
              onBlur={() => dob()}
            />
          </div>
          {showDOB && (
            <div className="input-cont">
              <label htmlFor="dob">Date of Balance</label>
              <input
                type="date"
                value={balanceDate}
                onChange={(e) => setDOBFnc(e)}
                id="dob"
                placeholder="Date of Balance"
              />
            </div>
          )}
          <div className="input-cont">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              value={DOP}
              onChange={(e) => setDOP(e.target.value)}
              id="date"
              placeholder="Date of payment"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="remark">Remark</label>
            <textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter Remark"
            ></textarea>
          </div>
        </form>
      </ModalCont>
    </div>
  );
};

export default Fees;
