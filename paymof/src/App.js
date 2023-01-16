import React, { Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loader from "./components/small_comps/loader/Loader";
import Users from "./components/Main/users/Users";
import ErrorBoundary from "./components/small_comps/ErrorBoundary";
const Index = React.lazy(() => import("./components/index/Index"));
const ErrorPage = React.lazy(() =>
  import("./components/small_comps/404/ErrorPage")
);
const Main = React.lazy(() => import("./components/Main/Main"));
const Dashboard = React.lazy(() =>
  import("./components/Main/dashboard/Dashboard.jsx")
);
const Students = React.lazy(() =>
  import("./components/Main/students/Students")
);
const Payment = React.lazy(() => import("./components/Main/payments/Payment"));
const Settings = React.lazy(() =>
  import("./components/Main/settings/Settings")
);
const NotLogged = React.lazy(() =>
  import("./components/small_comps/NotLogged")
);
const NotAuthorize = React.lazy(() =>
  import("./components/small_comps/404/NotAuthorize")
);
const Login = React.lazy(() => import("./components/login/Login"));
const Fees = React.lazy(() => import("./components/Main/fees/Fees"));
const Records = React.lazy(() => import("./components/Main/record/Records"));
const Debtors = React.lazy(() => import("./components/Main/debtors/Debtors"));
const WeeklyReport = React.lazy(() =>
  import("./components/Main/weeklyReport/WeeklyReport")
);
const Notifications = React.lazy(() =>
  import("./components/Main/notifications/Notifications")
);
function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<Loader.BigLoader />}>
          <Routes>
            <Route
              path="index"
              element={
                <ErrorBoundary>
                  <Index />
                </ErrorBoundary>
              }
            />
            <Route
              path="login"
              element={
                <ErrorBoundary>
                  <Login />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path=":school"
              element={
                <ErrorBoundary>
                  <Main />{" "}
                </ErrorBoundary>
              }
            >
              <Route
                path=""
                element={
                  <ErrorBoundary>
                    <Dashboard />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ErrorBoundary>
                    <Dashboard />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="students"
                element={
                  <ErrorBoundary>
                    <Students />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="fees"
                element={
                  <ErrorBoundary>
                    <Fees />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="records"
                element={
                  <ErrorBoundary>
                    <Records />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="payment"
                element={
                  <ErrorBoundary>
                    <Payment />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="settings"
                element={
                  <ErrorBoundary>
                    <Settings />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="users"
                element={
                  <ErrorBoundary>
                    <Users />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="debtors"
                element={
                  <ErrorBoundary>
                    <Debtors />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="notifications"
                element={
                  <ErrorBoundary>
                    <Notifications />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="weekly-report"
                element={
                  <ErrorBoundary>
                    <WeeklyReport />{" "}
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route path="" element={<Navigate to="login" />} />
            <Route
              path="authentication"
              element={
                <ErrorBoundary>
                  <NotLogged />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="authorization"
              element={
                <ErrorBoundary>
                  <NotAuthorize />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="*"
              element={
                <ErrorBoundary>
                  <ErrorPage />{" "}
                </ErrorBoundary>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
