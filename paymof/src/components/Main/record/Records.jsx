import React, { useContext, useEffect, useState } from "react";
import "./records.css";
import { MainContext } from "../Helpers/Context";
import { Notifications } from "react-push-notification";
import ModalCont from "../../small_comps/modal/ModalCont";
import { useNavigate } from "react-router-dom";
import { RiEdit2Line, RiRefreshLine, RiSearchLine } from "react-icons/ri";
import { useRef } from "react";
import logo from "../../../images/receipt_logo.jpeg";
const Records = () => {
  const navigate = useNavigate();
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
  const filterArray = [];
  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  const [viewName, setViewName] = useState("");
  const [viewClass, setViewClass] = useState("");
  const [viewPaymentId, setViewPaymentId] = useState("");
  const [viewTotal, setViewTotal] = useState("");
  const [viewBalance, setViewBalance] = useState("");
  const [DOG, setDOG] = useState([]);
  const [viewRemark, setViewRemark] = useState([]);
  const [amountsPaid, setamountsPaid] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [viewDOB, setViewDOB] = useState("");
  const [autoFees, setAutoFees] = useState([]);
  const limit = 6;
  let viewdate = useRef([]);
  let editKey = useRef("");
  let { url, notifications } = useContext(MainContext);
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
            setAutoFees(new Map(JSON.parse(newCls.fees)));
          } catch {
            console.log("failed to set datas");
          }
        }
      })

      .catch((err) => console.log(err));
  };
  let fetchRecord = () => {
    setIsLoading(true);
    fetch(`${url}/main/records/records?page=${currentPage}&limit=${limit}`, {
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
  useEffect(() => {
    fetchFilters();
  }, [document.readyState]);

  useEffect(() => {
    fetchRecord();
  }, [currentPage]);

  let changeClass = (e) => {
    setViewClass(e.target.value);
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
        setViewTotal(autoFees.get(splitName.join(" ").toLowerCase()));
    } catch (error) {
      console.log(error);
    }
  };
  let handlePageChange = (newPage) => {
    setcurrentPage(newPage);
    fetch(`${url}/main/records/records?page=${currentPage}&limit=${limit}`, {
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
        fetch(`${url}/main/records/find-name`, {
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
        fetch(`${url}/main/records/find-name`, {
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
      fetch(`${url}/main/records/findId`, {
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
      notifications.warning("empty search");
    }
  };
  let setFilteredClassFnc = (e) => {
    setFilteredClass(e.target.value);
    if (e.target.value !== "") {
      document.querySelector(".filter-class").classList.add("filter");
    } else {
      document.querySelector(".filter-class").classList.remove("filter");
    }
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
  let reset = () => {
    setViewName("");
    setViewClass("");
    setViewPaymentId();
    setViewTotal("");
    setViewBalance("");
    viewdate.current = [];
    setViewRemark([]);
    setamountsPaid([]);
    setTotalPaid("");
    setDOG([]);
    setViewDOB("");
  };
  let viewRecord = (key) => {
    reset();
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
            setViewDOB(data.message[0].balance_date);
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
              setDOG(DOGArr);
            } else {
              setViewRemark([data.message[0].remark]);
              viewdate.current = [data.message[0].DOP];
              setamountsPaid([data.message[0].amount_paid]);
              setTotalPaid(data.message[0].amount_paid);
              setDOG([data.message[0].DOG]);
            }
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
  let clear = (e) => {
    e.preventDefault();
    setName("");
    setAutoName([]);
    fetchRecord();
  };
  let deleteRecord = (key) => {
    console.log("hi");
    if (key) {
      if (window.confirm("Do you want to delete this record")) {
        fetch(`${url}/main/records/delete?key=${key}`, {
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
              setRecords(records.filter((data) => data.keyid !== key));
            } else {
              notifications.warning(data.message);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };
  let editRecord = (key) => {
    reset();
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
            setViewName(data.message[0].name);
            setViewClass(data.message[0].class.toUpperCase());
            setViewPaymentId(data.message[0].payment_id);
            setViewTotal(data.message[0].expected_payment);
            setViewBalance(data.message[0].balance);
            setViewDOB(data.message[0].balance_date);
            editKey.current = data.message[0].keyid;
            if (data.message.length > 1) {
              data.message.forEach((details) => {
                dateArr.push(details.DOP);
                remarks.push(details.remark);
                amountPaidArr.push(details.amount_paid);
                totalPaid1 += parseInt(details.amount_paid);
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
            }
            document
              .getElementsByClassName("edit-modal")[0]
              .classList.add("show-modal");
            document.body.style.overflow = "hidden";
            window.scrollTo(0, parseInt(window.scrollY || "0") * -1);
          } else {
            notifications.warning(data.message);
          }
          // console.log(data.message[0].name, viewRemark);
        })
        .catch((err) => console.log(err));
    }
  };
  let saveEdit = () => {
    let status = viewDOB === "" ? false : true;
    if (
      editKey.current === "" ||
      viewName === "" ||
      viewClass === "" ||
      viewTotal === "" ||
      viewBalance === ""
    ) {
      notifications.warning("Try refreshing this page.");
    } else {
      fetch(`${url}/main/records/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: editKey.current,
          name: viewName,
          studentClass: viewClass,
          balanceDate: viewDOB,
          total: viewTotal,
          balance: viewBalance,
          status,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            notifications.success(data.message);
            document
              .getElementsByClassName("edit-modal")[0]
              .classList.remove("show-modal");
            document.body.style.overflow = "auto";
            document.body.style.top = "";
            fetchRecord();
          } else {
            notifications.warning(data.message);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  let handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    if (viewTotal && totalPaid) {
      let sub = viewTotal - totalPaid;
      setViewBalance(sub);
    }
  }, [viewTotal, totalPaid]);

  return (
    <div className="__records">
      <Notifications position="top-right" />
      <h2>Records</h2>
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
          <div className="output-container" id="form-id">
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
            <RiSearchLine />
            <span style={{ marginLeft: ".3rem" }}>Find</span>
          </button>
          <button onClick={(e) => clear(e)} className="btn btn-danger btn-sm">
            Clear
          </button>
        </div>
      </form>
      <div className="view-debtor-cont">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate("../debtors")}
        >
          View Debtors
        </button>
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => navigate("../weekly-report")}
        >
          Weekly Report
        </button>
      </div>
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
            title="Refresh"
            style={{ cursor: "pointer" }}
            onClick={() => fetchRecord()}
          >
            <RiRefreshLine />
          </span>
        </div>
        <div className="table-cont">
          <div className="our-table">
            <div className="header">Name</div>
            <div className="header">payment id</div>
            <div className="header">Class</div>
            <div className="header">Total (&#x20A6;)</div>
            <div className="header">Balance (&#x20A6;)</div>
            <hr />
            {isLoading ? (
              <div
                className="table-row loading"
                style={{ textAlign: "center", padding: ".3rem" }}
              >
                loading...
              </div>
            ) : records.length === 0 ? (
              <div
                className="table-row"
                style={{ textAlign: "center", padding: ".3rem" }}
              >
                No records available
              </div>
            ) : (
              records.map((record, index) => (
                <details
                  className="table-row"
                  key={record.keyid + new Date() + Math.random()}
                >
                  <summary>
                    <span>{record.name}</span>
                    <span>{record.payment_id}</span>
                    <span>{record.class}</span>
                    <span>
                      {parseInt(record.expected_payment).toLocaleString()}
                    </span>
                    <span>{parseInt(record.balance).toLocaleString()}</span>
                  </summary>
                  <p className="alert alert-info">
                    <small className="alert-heading h5">Details</small>
                    <span className="details-content">
                      <span>Name</span>
                      <span>{record.name}</span>
                    </span>
                    <span className="details-content">
                      <span>Total</span>
                      <span>
                        &#x20A6;
                        {parseInt(record.expected_payment).toLocaleString()}
                      </span>
                    </span>
                    <span className="details-content">
                      <span>Balance</span>
                      <span>
                        &#x20A6;{parseInt(record.balance).toLocaleString()}
                      </span>
                    </span>
                    <span className="details-content">
                      <span>Date of Payment</span>
                      <span>{record.DOP}</span>
                    </span>
                    <span className="details-content">
                      <span>Remark</span>
                      <span>{record.remark}</span>
                    </span>
                    <span className="details-content">
                      <span>Payment Method</span>
                      <span>{record.payment_method}</span>
                    </span>
                    <span className="details-content">
                      <span>Payment For</span>
                      <span>{record.payment_for}</span>
                    </span>
                    {record.balance_date && (
                      <span className="details-content">
                        <span>Balance Date</span>
                        <span>{record.balance_date}</span>
                      </span>
                    )}
                    <span className="details-content">
                      <span>Date of Genetation</span>
                      <span>{record.DOG}</span>
                    </span>
                    <span className="details-content">
                      <span>Accountant</span>
                      <span>{record.accountant}</span>
                    </span>
                    <span className="details-content">
                      <button
                        onClick={() => viewRecord(record.keyid)}
                        className="btn btn-secondary btn-sm mt-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteRecord(record.keyid)}
                        className="btn btn-danger btn-sm mt-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => editRecord(record.keyid)}
                        className="btn btn-light btn-sm mt-2"
                      >
                        <RiEdit2Line fill="orangered" /> Edit
                      </button>
                    </span>
                  </p>
                </details>
              ))
            )}
          </div>
        </div>
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
      <ModalCont
        title={""}
        classModal="print-modal"
        btn="Print"
        save={handlePrint}
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
            <h4 className="h5">Student Info</h4>
            <div className="table-responsive">
              <div className="p-table">
                <div className="tbody">
                  <span>Name</span>
                  <span className="span">{viewName.toUpperCase()}</span>
                  <span>Class</span>
                  <span className="last span">{viewClass.toUpperCase()}</span>
                  <hr />
                  <span>Payment ID</span>
                  <span className="span">{viewPaymentId}</span>
                  <span>DOP</span>
                  <span className="last span">{viewdate.current[0]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fee-info">
            <h4 className="h5">Fee Info</h4>
            <div className="table-responsive">
              <div className="p-table">
                <div className="tbody">
                  <span>Date</span>
                  <span>Paid</span>
                  <span className="last">Remark</span>
                  {viewRemark &&
                    viewRemark.map((re, index) => (
                      <span
                        key={re + Math.random()}
                        title={DOG[index]}
                        className="tr"
                      >
                        <span>{viewdate.current[index]}</span>
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

      <ModalCont title="Edit Record" classModal="edit-modal" save={saveEdit}>
        <form action="">
          <div className="input-cont">
            <label htmlFor="balance-user">Name</label>
            <input
              type="text"
              value={viewName.toUpperCase()}
              id="balance-user"
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <div className="input-cont">
            <label htmlFor="class">Class</label>
            <select
              id="class"
              value={viewClass}
              onChange={(e) => changeClass(e)}
            >
              <option value="">Class</option>
              {classes &&
                classes.map((elem) => (
                  <option value={elem.toUpperCase()} key={Math.random()}>
                    {elem.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>
          <div className="input-cont">
            <label htmlFor="total">Total</label>
            <input
              type="number"
              value={viewTotal.toLocaleString()}
              disabled
              id="total"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="balance-payment">Balance</label>
            <input
              type="text"
              value={viewBalance.toLocaleString()}
              disabled
              id="balance-payment"
            />
          </div>
          {viewBalance > 0 && (
            <div className="input-cont">
              <label htmlFor="DOB">Date of Balance</label>
              <input
                type="date"
                value={viewDOB}
                id="DOB"
                onChange={(e) => setViewDOB(e.target.value)}
              />
            </div>
          )}
        </form>
      </ModalCont>
    </div>
  );
};

export default Records;
