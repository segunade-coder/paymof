import React, { useContext, useEffect, useState } from "react";
import { Notifications } from "react-push-notification";
import { MainContext } from "../Helpers/Context";
import "./weeklyreport.css";
import { MultiSelect } from "react-multi-select-component";
const Debtors = () => {
  const [filteredClass, setFilteredClass] = useState([]);
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");
  const [filteredSess, setFilteredSess] = useState("");
  const [filteredTerm, setFilteredTerm] = useState("");
  const [weekly, setWeekly] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [others, setOthers] = useState([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.readyState]);

  let focusSelect = () => {
    let tempArr = [];
    classes.map((label) => {
      const element = {
        label: String(label)?.toString().toUpperCase(),
        value: String(label)?.toString().toUpperCase(),
      };
      tempArr.push(element);
      return element;
    });
    setClasses(tempArr);
  };

  let createWeek = (e) => {
    e.preventDefault();
    if (
      filteredClass.length === 0 ||
      filteredTerm === "" ||
      filteredSess === "" ||
      filteredDate === ""
    ) {
      notifications.warning("Enter all important fields");
      return;
    } else {
      setIsLoading(true);
      let value = filteredClass.map((val) => val.value.toLowerCase());
      fetch(`${url}/main/records/weekly`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classes: value,
          date: filteredDate,
          term: filteredTerm.toLowerCase(),
          sess: filteredSess,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          isLoading(false);
          if (data.status) {
            setWeekly(data.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };
  return (
    <div className="__weekly">
      <Notifications position="top-right" />
      <h2>Debtors</h2>
      <form className="search-container container">
        <label htmlFor="name">Date</label>
        <input
          type="date"
          value={filteredDate}
          onChange={(e) => setFilteredDate(e.target.value)}
          required
          onFocus={() => focusSelect()}
        />
        {/* <select
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
        </select> */}
        <MultiSelect
          options={classes}
          value={filteredClass}
          onChange={setFilteredClass}
          labelledBy="Select class"
        />
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
        <div className="btn-cont">
          <button
            className="btn btn-success btn-sm"
            onClick={(e) => createWeek(e)}
          >
            Create
          </button>
        </div>
      </form>
      <div className="weekly-table">
        {weekly && weekly.map((week) => <div>week</div>)}
      </div>
    </div>
  );
};

export default Debtors;
