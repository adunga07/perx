import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { Marketplace } from "./pages/employee/Marketplace";
import { MyBenefits } from "./pages/employee/MyBenefits";
import { PerkDetail } from "./pages/employee/PerkDetail";
import { OnboardingWizard } from "./components/onboarding/OnboardingWizard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/marketplace" element={<Marketplace />} />
        <Route path="/employee/benefits" element={<MyBenefits />} />
        <Route path="/employee/perks/:perkId" element={<PerkDetail />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
