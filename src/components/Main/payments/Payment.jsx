import React, { useEffect, useState } from "react";
import "./payment.css";
const Payment = () => {
  let date = new Date();
  let dateArr = [date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(), date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth()}` : date.getUTCMonth(), date.getUTCFullYear()];
  let randomNumber = `${Math.floor(Math.random() * 99999)}`.padStart(5, Math.floor(Math.random() * 99999))
  const [autoFees, setAutoFees] = useState('')
  const [name, setName] = useState('')
  const [autoName, setAutoName] = useState([]);
  const [studentClass, setStudentClass] = useState('')
  const [classesArray, setClassesArray] = useState([])
  const [DOG, setDOG] = useState(dateArr.join("/"))
  const [paymentId, setPaymentId] = useState(randomNumber)
  const [DOP, setDOP] = useState('')
  const [term, setTerm] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentFor, setPaymentFor] = useState('')
  const [totalFee, setTotalFee] = useState('')
  const [feePaid, setFeePaid] = useState('')
  const [balance, setBalance] = useState(0)
  const [DOB, setDOB] = useState('')
  const [remark, setRemark] = useState('2021/2022');
  const [autoRemark, setAutoRemark] = useState(true);
  const [error, setError] = useState('');
  const [showDOB, setshowDOB] = useState(false);

  useEffect(() => {
    fetch('http://192.168.43.236:80/main/payment/classes', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
    }).then(res => res.json())
    .then(data => {
        if(data.status){
            let newCls = data.message[0];
            setAutoFees(JSON.parse(newCls.fees));
            setTerm(newCls.current_term.toUpperCase())
            setClassesArray(JSON.parse(newCls.classes))
         }
    })
    .catch(err => console.log(err))
  },[])
  useEffect(() => {
      if(paymentFor === 'PART PAYMENT'){
          setshowDOB(true);
      }else{
          setshowDOB(false)
      }
    if(studentClass.includes('NURSERY')){
        setTotalFee(autoFees.nursery)
    }
    else if(studentClass.includes('PRE NURSERY')){
        setTotalFee(autoFees.pre_nursery)
    }
    else if(studentClass.includes('KINDERGATEN THREE')){
        setTotalFee(autoFees.kindergaten)
    }
    else if(studentClass.includes('BASIC')){
            setTotalFee(autoFees.basic)
    }
    else if(studentClass.includes('BASIC SIX')){
            setTotalFee(autoFees.basic_6)
    }
    else if(studentClass.includes('SS')){
            setTotalFee(autoFees.ss)
    }
    else if(studentClass.includes('JSS')){
            setTotalFee(autoFees.jss)
    }
    else{
        setTotalFee('')
        setFeePaid('')
    }
  }, [paymentFor, studentClass, autoFees])
  
  useEffect(() => {
        if(totalFee < feePaid){
            setError('Total fee cannot be lesser that amount paid')
            document.getElementById('payment_made').style.borderColor = 'red';
        }else {
            setError('')
            document.getElementById('payment_made').style.borderColor = 'grey';
        }
        setBalance(totalFee - feePaid)
  }, [totalFee, feePaid])
  
  
  const findName = (name) => {
      name.length > 0 ?
        fetch('http://192.168.43.236:80/main/payment/findName', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials:'include',
            body: JSON.stringify({name})
        }).then(res => res.json())
        .then(data => {
            if(data.status){
               setAutoName(data.message)
            }
        })
        .catch(err => console.log(err))
        : setAutoName([])
  }
  const clickAutoName = (id) => {
   let details = autoName.find(item => item.id === id )
    setName(details.name.toUpperCase())
    setStudentClass(details.class.toUpperCase())
    setAutoName([])
  }
  const handleSave = (e) => {
      e.preventDefault()
      if(name === '' || paymentId === '' || studentClass === '' || DOP === '' || DOG === '' || paymentFor === '' || paymentMethod === '' || term === '' || totalFee === '' || feePaid === '' || balance === ''){
        setError('All fields are required');
      }else{
        setError('')
        if(DOB === '' && showDOB === true){
            setError('All fields are required');
        }else{
      let datas = {
          name,
          paymentId,
          studentClass,
          DOP,
          DOB,
          DOG,
          paymentFor,
          paymentMethod,
          term,
          totalFee,
          feePaid,
          balance,
          remark: autoRemark && `${term} TERM ${paymentFor} [${paymentMethod}]  ${remark && '~ (' + remark.toUpperCase() + ')'}`
      }
      fetch('http://192.168.43.236:80/main/payment/save', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials:'include',
            body: JSON.stringify({datas})
        }).then(res => res.json())
        .then(data => {
            if(!data.status){
                setError(data.message)
            }else{
              setError('');
              alert('saved')
              reset()


            }
        })
        .catch(err => console.log(err))
        }
    }
  }
  const reset = () => {
    setAutoFees('')
    setName('')
    setStudentClass('')
    setPaymentId(`${Math.floor(Math.random() * 99999)}`.padStart(5, Math.floor(Math.random() * 99999)))
    setDOP('')
    setPaymentMethod('')
    setPaymentFor('')
    setTotalFee('')
    setFeePaid('')
    setBalance(0)
    setDOB('')
    setRemark('')
    setAutoRemark(true)
    setError('');
    setshowDOB(false)
  }
  const handlePrint = (e) => {
      e.preventDefault();
        window.print()
  }
  return (
    <div className="__payment">
      <h2>Make Payment</h2>
      <div style={{color:'red'}}>{error && error}</div>
      <form>
        <div className="input-cont">
            <label htmlFor="name">
                Name
            </label>
            <input type="text" name="" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} onKeyUp={() => findName(name)} autoComplete='off'/>
        </div>
            <div className="output-names">
                {autoName && autoName.map(item => (<div className="names" onClick={() => clickAutoName(item.id)} key={item.id}><span>{item.name}</span> <span>{item.class}</span></div>))}
            </div>
        <div className="input-cont"> 
        <label htmlFor="payment_id">
                Payment ID
            </label>
            <input type="number" name="" id="payment_id" value={paymentId} onChange={(e) => setPaymentId(e.target.value)}/>
        </div>
        <div className="input-cont">
        <label htmlFor="classes">
                Class
            </label>
            <select id="classes" value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                <option value="select class"> Select Class</option>
            {classesArray && classesArray.map(elem => (<option value={elem.toUpperCase()} key={Math.random()}>{elem.toUpperCase()}</option>))}
            </select>
        </div>
            <input
            hidden
            style={{fontFamily:'monospace'}}
            type="text"
            value={DOG} onChange={(e) => setDOG(e.target.value)}/>
        <div className="input-cont">
        <label htmlFor="date_of_payment">
                Date Of Payment
            </label>
            <input type="date" name="" id="date_of_payment" value={DOP} onChange={(e) => setDOP(e.target.value)}/>
        </div>
        <div className="input-cont">
        <label htmlFor="payment_for">
                Payment For
            </label>
            <select id="payment_for" value={paymentFor} onChange={(e) => setPaymentFor(e.target.value)}>
                <option value="payment for">Select Payment for</option>
                <option value="FEES AND PTA">FEES AND PTA</option>
                <option value="FEES AND PTA NO LESSON">FEES AND PTA (NO LESSON)</option>
                <option value="FEES PTA AND LESSON">FEES PTA &nbsp; AND LESSON</option>
                <option value="PART PAYMENT">PART PAYMENT</option>
                <option value="BUS FEE">BUS FEE</option>
                <option value="WAEC FEE">WAEC FEE</option>
                <option value="NECO FEE">NECO FEE</option>
                <option value="OTHERS">OTHERS</option>
            </select>    
        </div>
        <div className="input-cont">
        <label htmlFor="payment_method">
                Payment Method
            </label>
            <select id="payment_method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                <option value="ZENITH BANK TELLER">ZENITH BANK TELLER</option>
                <option value="ZENITH BANK TRANSFER">ZENITH BANK TRANSFER</option>
                <option value="ZENITH BANK POS">ZENITH BANK POS</option>
                <option value="UBA BANK TELLER">UBA BANK TELLER</option>
                <option value="UBA BANK TRANSFER">UBA BANK TRANSFER</option>
                <option value="UBA BANK POS">UBA BANK POS</option>
            </select>  
        </div>
        <div className="input-cont">
        <label htmlFor="term">
                Term
            </label>
            <select id="term" value={term} onChange={(e) => setTerm(e.target.value)}>
                <option value="select term">Select Term</option>
                <option value="1ST">First Term</option>
                <option value="2ND">Second Term</option>
                <option value="3RD">Third Term</option>
            </select>  
        </div>
        <div className="input-cont">
        <label htmlFor="total_fee">
                Total Fee
            </label>
        <input type="number" id="total_fee" value={totalFee} onChange={(e) => setTotalFee(e.target.value)}/>    
        </div>
        <div className="input-cont">
        <label htmlFor="payment_made">
                Advance Fee
            </label>
            <input type="number" id="payment_made" value={feePaid} onChange={(e) => setFeePaid(e.target.value)}/>
        </div>
        { showDOB &&
        <div className="input-cont">
        <label htmlFor="date_of_balance">
                Date Of Balance 
            </label>
            <input type="date" id="date_of_balance" value={DOB} onChange={(e) => setDOB(e.target.value)}/>
        </div>}
        <div className="input-cont">
        <label htmlFor="balance">
                Balance
            </label>
            <input type="number" id="balance" disabled value={balance} onChange={(e) => setBalance(e.target.value)}/>
        </div>
        <div className="auto-remark-cont">
            <span>Auto Remark</span>
            <input type="checkbox" id="auto-remark" checked={autoRemark} onChange={(e) => setAutoRemark(e.target.checked)}/>
        </div>
        {autoRemark && <div className="input-cont">
        <label htmlFor="remark">
                Custom Remark
            </label>
        <textarea name="" id="" placeholder="Remark" value={remark} onChange={(e) => setRemark(e.target.value)}></textarea>
        </div>}
        <div className="btn-cont">  
        <button onClick={handleSave}>Save</button>
        <button onClick={handlePrint}>Print</button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
