import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sezone from "./pages/Sezone";
import Dogadjaji from "./pages/Dogadjaji";
import RangListaSezone from "./pages/RangListaSezone";
import RangListaDogadjaja from "./pages/RangListaDogadjaja";
import KreiranjeSezone from "./pages/KreiranjeSezone";
import KreiranjeDogadjaja from "./pages/KreiranjeDogadjaja";
import StatistikaTima from "./pages/StatistikaTima";
import QuizLocation from "./pages/QuizLocation";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <Routes>
          {!user && (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {user && (
            <>
              <Route path="/sezone" element={<Sezone />} />
              <Route path="/sezone/:id/dogadjaji" element={<Dogadjaji />} />
              <Route
                path="/sezone/:id/rang-lista"
                element={<RangListaSezone />}
              />
              <Route
                path="/dogadjaj/:id/rang"
                element={<RangListaDogadjaja />}
              />
              <Route path="/kreiraj-sezonu" element={<KreiranjeSezone />} />
              <Route path="/statistika" element={<StatistikaTima />} />
              <Route
                path="/sezone/:id/kreiraj-dogadjaj"
                element={<KreiranjeDogadjaja />}
              />
              <Route path="/lokacija" element={<QuizLocation />} />
              <Route path="*" element={<Navigate to="/sezone" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
