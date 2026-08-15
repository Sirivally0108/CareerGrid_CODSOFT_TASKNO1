import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import NotFound from "./pages/NotFound";
import PostJob from "./pages/PostJob";
import Messages from "./pages/Messages";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;