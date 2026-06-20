import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
