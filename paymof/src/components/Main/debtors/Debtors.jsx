import React, { useContext, useEffect, useState } from "react";
import { Notifications } from "react-push-notification";
import { MainContext } from "../Helpers/Context";
import "./debtors.css";
import { RiSearchLine } from "react-icons/ri";
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
const Debtors = () => {
  const [filteredClass, setFilteredClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");
  const [filteredSess, setFilteredSess] = useState("");
  const [filteredTerm, setFilteredTerm] = useState("");
  const [sort, setSort] = useState("debtors");
  const [debtors, setDebtors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [others, setOthers] = useState([])
  const [paymentForArr, setPaymentForArr] = useState([])
  const [overAllTotal, setOverAllTotal] = useState(0)
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
            setFilteredSess(newCls.current_session);
            setFilteredTerm(newCls.current_term.toUpperCase());
            setPaymentForArr(newCls.payment_for.split(","))
          } catch {
            notifications.warning("failed to set datas. Try reloading");
          }
        }
      })

      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchFilters();
    return () => {
      setTerms([]);
      setSessions([]);
      setClasses([]);
    };
  }, [document.readyState]);

  let findRecord = (e) => {
    e.preventDefault();
    if(filteredDate === "" || filteredClass === "" || filteredTerm === "" || filteredSess === "" || sort === ""){
        notifications.warning("Enter the necessaey fields")
        return;
    }
    else{
      setIsLoading(true)
        fetch(`${url}/main/records/debtors`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                filteredDate,
                filteredClass:filteredClass.toLowerCase(),
                filteredSess,
                filteredTerm:filteredTerm.toLowerCase(),
                sort:sort.toLowerCase(),
            })
          }).then(res => res.json())
          .then(data => {
            setIsLoading(false)
            if(data.status){
              setDebtors(data.message)
              setOthers(data.totalArr)
              setOverAllTotal(0)
              
            }else{
              notifications.warning(data.message)
            }
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
          })
    }

  };
  let autoTotal = () => {
    let overTotal = 0;
    if(others){
      others.map(total => {
        overTotal += total.totalPaid;
      });
      setOverAllTotal(overTotal)
    }
  }
  return (
    <div className="__debtors">
      <Notifications position="top-right" />
      <h2>Debtors</h2>
      <form className="search-container container">
        <label htmlFor="name">Date</label>
        <div className="input-filter-cont">
          <input
            type="date"
            value={filteredDate}
            onChange={(e) => setFilteredDate(e.target.value)} required
          />
        </div>
        <select
          value={filteredClass}
          onChange={(e) => setFilteredClass(e.target.value)}
          className="filter-class" required
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
          onChange={(e) => setFilteredTerm(e.target.value)}
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
          onChange={(e) => setFilteredSess(e.target.value)}
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
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="filter-sort"
        >
          <option value="debtors">DEBTORS</option>
          <option value="cleared">CLEARED</option>
          <option value="all">ALL</option>
          {paymentForArr &&
            paymentForArr.map((elem) => (
              <option value={elem.toUpperCase()} key={Math.random()}>
                {elem.toUpperCase()}
              </option>
            ))}
        </select>
        <div className="btn-cont">
          <button onClick={(e) => findRecord(e)} className="btn btn-success btn-sm">
            <RiSearchLine />
            <span style={{marginLeft:'.3rem'}}>Find</span>
          </button>
        </div>
      </form>
      <div className="debtors-table">
      {debtors.length !== 0 && (
      <><table border={1} className="table table-responsive table-bordered" id="table-to-xls">
            <thead className="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Id</th>
                    <th>Class</th>
                    <th>Total paid</th>
                    <th>Balance</th>
                    <th>Total Fee</th>
                    <th>DOG</th>
                    <th>DOB</th>
                </tr>
            </thead>
            <tbody>
            {isLoading ? (<tr className="loading"><td colSpan={8} >loading...</td></tr>) : 
            debtors.length === 0 ? (<tr className="loading"><td colSpan={8} style={{textAlign:'center'}}>No debtors available yet!</td></tr>) : 
            (debtors.map((record, index) => (<tr key={record.keyid + new Date() + Math.random()} title={record.remark}>
        <td>{record.name.toUpperCase()} <small><b>({others[index].total})</b></small> </td> 
        <td>{record.payment_id} </td>
        <td>{record.class.toUpperCase()} </td>
        <td>{parseInt(others[index].totalPaid).toLocaleString()} </td>
        <td>{parseInt(record.balance).toLocaleString()} </td>
        <td>{parseInt(record.expected_payment).toLocaleString()} </td>
        <td>{record.DOP} </td>
        <td> { record.balance  > 0 && (<><span>{record.balance_date || "No Date"}</span> <span>{new Date(record.balance_date) < new Date(Date.now()) && "(Expired)"}</span></>)}  </td>
      </tr>)))}    
        <tr colSpan={8}>
          <td onClick={() => autoTotal()} style={{fontWeight:'bold',cursor:'pointer'}} title="click for total">Total: </td>
          <td colSpan={7}>&#x20A6;<span>{overAllTotal && overAllTotal.toLocaleString()}</span></td>
          </tr>
            </tbody>
        </table> 
        <div className="container">
          <ReactHTMLTableToExcel 
          id="xls-button"
          className="xls-button btn btn-dark btn-sm"
          table="table-to-xls"
          filename={filteredClass + "-" + filteredDate}
          sheet="tablexls"
          buttonText="Download XLS"

          />
          </div></>)}
      </div>
    </div>
  );
};

export default Debtors;
