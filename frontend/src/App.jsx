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
import Network from "./pages/user/network";
import ForgotPassword from "./pages/user/forgotEmail";
import ResetPassword from "./pages/user/confirmPass";
import PrivateRoute from "./middleware/privateRoute";
import PublicRoute from "./middleware/publicRoute";
import ProfileSection from "./pages/user/profile";
import ChatDropdown from "./pages/user/chat";
import Alerts from "./pages/user/alert";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgotEmail" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/adminLogin" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/chat" element={<ChatDropdown />} />



        <Route path="/" element={<Home />} />
        <Route path="/skills-offered" element={<SkillsOffered />} />
        <Route path="/skills-wanted" element={<SkillsWanted />} />
        <Route path="/post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/network" element={<PrivateRoute><Network /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/profile" element={<ProfileSection />} />

        <Route path="/dashboard" element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>} />
        <Route path
          ="/skills-management" element={<PrivateRoute role="admin"><SkillManagement /></PrivateRoute>} />
        <Route path="/user-management" element={<PrivateRoute role="admin"><UserManagement /></PrivateRoute>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App;
