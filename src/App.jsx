import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import AppsOverview from "@/components/pages/AppsOverview";
import UserAnalytics from "@/components/pages/UserAnalytics";
import AIAnalysis from "@/components/pages/AIAnalysis";
import Reports from "@/components/pages/Reports";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Layout>
          <Routes>
            <Route path="/" element={<AppsOverview />} />
            <Route path="/users" element={<UserAnalytics />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
};

export default App;