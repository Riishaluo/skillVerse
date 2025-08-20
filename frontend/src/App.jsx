import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/user/register";
import OtpVerification from "./pages/user/otpPage";
import SkillsOffered from "./pages/user/skillsOffer";
import SkillsWanted from "./pages/user/skillWanted";
import Home from "./pages/user/home";
import Login from "./pages/user/login";
import CreatePost from "./pages/user/post";
import AdminLogin from "./pages/admin/adminLogin";
import Dashboard from './pages/admin/dashboard'
import SkillManagement from "./pages/admin/skills";
import UserManagement from "./pages/admin/userMangement";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/skills-offered" element={<SkillsOffered />} />
        <Route path="/skills-wanted" element={<SkillsWanted />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<CreatePost />} />
{/* ADMIN */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills-management" element={<SkillManagement />} />
        <Route path="/user-management" element={<UserManagement/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
