import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import About from "./pages/About";
import AllJobs from "./pages/AllJobs";
import Applications from "./pages/Applications";
import ApplyJob from "./pages/ApplyJob";
import CandidatesSignup from "./pages/CandidatesSignup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import RecruiterSignup from "./pages/RecruiterSignup";
import Dashborad from "./pages/Dashborad";
import AddJobs from "./pages/AddJobs";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterRedirect from "./components/RecruiterRedirect";
import { AppContext } from "./context/AppContext";

const App = () => {
  // No longer needed - using unified user system

  return (
    <Routes>
      <Route path="/" element={
        <RecruiterRedirect>
          <AppLayout>
            <Home />
          </AppLayout>
        </RecruiterRedirect>
      } />
      <Route path="/all-jobs/:category" element={
        <RecruiterRedirect>
          <AppLayout>
            <AllJobs />
          </AppLayout>
        </RecruiterRedirect>
      } />
      <Route path="/terms" element={
        <RecruiterRedirect>
          <AppLayout>
            <Terms />
          </AppLayout>
        </RecruiterRedirect>
      } />
      <Route path="/about" element={
        <RecruiterRedirect>
          <AppLayout>
            <About />
          </AppLayout>
        </RecruiterRedirect>
      } />
      <Route path="/apply-job/:id" element={
        <RecruiterRedirect>
          <AppLayout>
            <ApplyJob />
          </AppLayout>
        </RecruiterRedirect>
      } />
      <Route path="/applications" element={
        <AppLayout>
          <ProtectedRoute userType="candidate">
            <Applications />
          </ProtectedRoute>
        </AppLayout>
      } />
      <Route path="/login" element={
        <AppLayout>
          <Login />
        </AppLayout>
      } />
      <Route path="/candidate-signup" element={
        <AppLayout>
          <CandidatesSignup />
        </AppLayout>
      } />
      <Route path="/recruiter-signup" element={
        <AppLayout>
          <RecruiterSignup />
        </AppLayout>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute userType="recruiter">
          <Dashborad />
        </ProtectedRoute>
      }>
        <Route path="add-job" element={<AddJobs />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="view-applications" element={<ViewApplications />} />
      </Route>
    </Routes>
  );
};

export default App;
