import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { OnboardingWizard } from "./components/onboarding/OnboardingWizard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
