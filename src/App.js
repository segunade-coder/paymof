import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/login/Login'
import Index from './components/index/Index'
import ErrorPage from './components/small_comps/404/ErrorPage';
import Main from './components/Main/Main';
import Dashboard from './components/Main/dashboard/Dashboard.jsx';
import Students from './components/Main/students/Students';
import Payment from './components/Main/payments/Payment';
import Settings from './components/Main/settings/Settings';
import NotLogged from './components/small_comps/NotLogged';
function App() {
  
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="index" element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path=":school" element={<Main />} >
          <Route path='' element={<Navigate to='dashboard' />}/>
          <Route path='dashboard' element={<Dashboard />}/>
          <Route path='students' element={<Students />}/>
          <Route path='payment' element={<Payment />}/>
          <Route path='settings' element={<Settings />}/>
          </Route>
        <Route path="" element={<Navigate to="login"/>} />
        <Route path="authentication" element={<NotLogged />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
