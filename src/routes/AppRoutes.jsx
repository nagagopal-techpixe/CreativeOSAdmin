import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import NavPage from "../pages/Navpage";
import VideoBuilder from "../pages/video/VideoBuilder";
import VoiceBuilder from "../pages/voice/VoiceBuilder";
import ImageBuilder from "../pages/image/ImageBuilder";
import MusicBuilder from "../pages/music/MusicBuilder";
import CharacterBuilder from "../pages/Character/CharacterBuilder";
import StoryboardBuilder from "../pages/storyboard/storyboardBuilder";
import UsersPage from "../pages/Users/UsersPage";
import AdminLogin from "../pages/auth/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";

//  Root redirect component
function RootRedirect() {
  const token = localStorage.getItem("token"); // 🔁 change key to match yours
  return token ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* 🔓 Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔐 Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="items" element={<NavPage />} />
          <Route path="characters" element={<CharacterBuilder />} />
          <Route path="videos" element={<VideoBuilder />} />
          <Route path="voice" element={<VoiceBuilder />} />
          <Route path="images" element={<ImageBuilder />} />
          <Route path="music" element={<MusicBuilder />} />
          <Route path="storyboard" element={<StoryboardBuilder />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
