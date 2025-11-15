import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import ToastNotification from "../components/common/ToastNotification.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import HomePage from "../pages/HomePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import StudentLogin from "../pages/Student/StudentLogin.jsx";
import StudentRegister from "../pages/Student/StudentRegister.jsx";
import StudentDashboard from "../pages/Student/StudentDashboard.jsx";
import Profile from "../pages/Student/Profile.jsx";
import UploadDocuments from "../pages/Student/UploadDocuments.jsx";
import AdmissionForm from "../pages/Student/AdmissionForm.jsx";
import FeePayment from "../pages/Student/FeePayment.jsx";
import ExamFeePayment from "../pages/Student/ExamFeePayment.jsx";
import BacklogPayment from "../pages/Student/BacklogPayment.jsx";
import PaymentHistory from "../pages/Student/PaymentHistory.jsx";
import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import ManageStudents from "../pages/Admin/ManageStudents.jsx";
import ManageAdmissions from "../pages/Admin/ManageAdmissions.jsx";
import ManageFees from "../pages/Admin/ManageFees.jsx";
import ManageBranches from "../pages/Admin/ManageBranches.jsx";
import Notifications from "../pages/Admin/Notifications.jsx";
import PaymentReports from "../pages/Admin/PaymentReports.jsx";
import AdminLayout from "../pages/Admin/AdminLayout.jsx";
import { NotificationProvider } from "../context/NotificationContext.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { BranchesProvider } from "../context/BranchesContext.jsx";
import { StudentProvider } from "../context/StudentContext.jsx";
import { AdminProvider } from "../context/AdminContext.jsx";
import { PaymentProvider } from "../context/PaymentContext.jsx";

export default function AppRouter() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <BranchesProvider>
          <AuthProvider>
            <StudentProvider>
              <PaymentProvider>
                <AdminProvider>
                <div className="flex min-h-screen flex-col" style={{ color: '#0f172a' }}>
                  <Navbar />
                  <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                    <div className="page-shell" style={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'clamp(1.75rem, 3vw, 2.75rem)',
                      padding: 'clamp(1.75rem, 4vw, 3.5rem)',
                      borderRadius: 'calc(24px + 6px)',
                      background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.92), rgba(236, 244, 255, 0.82))',
                      border: '1px solid rgba(148, 163, 184, 0.14)',
                      boxShadow: '0 28px 60px rgba(37, 99, 235, 0.08), 0 16px 40px rgba(14, 23, 42, 0.06)',
                      backdropFilter: 'blur(18px)'
                    }}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/student/login" element={<StudentLogin />} />
                        <Route path="/student/register" element={<StudentRegister />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        <Route
                          path="/student"
                          element={
                            <ProtectedRoute
                              allowedRoles={["student"]}
                              fallback="/student/login"
                            />
                          }
                        >
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<StudentDashboard />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="upload-documents" element={<UploadDocuments />} />
                          <Route path="admission-form" element={<AdmissionForm />} />
                          <Route path="fee-payment" element={<FeePayment />} />
                          <Route path="exam-fee-payment" element={<ExamFeePayment />} />
                          <Route path="backlog-payment" element={<BacklogPayment />} />
                          <Route path="payment-history" element={<PaymentHistory />} />
                        </Route>

                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute
                              allowedRoles={["admin"]}
                              fallback="/admin/login"
                              redirectTo="/admin/login"
                            />
                          }
                        >
                          <Route element={<AdminLayout />}>
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="students" element={<ManageStudents />} />
                          <Route path="admissions" element={<ManageAdmissions />} />
                          <Route path="fees" element={<ManageFees />} />
                          <Route path="branches" element={<ManageBranches />} />
                          <Route path="notifications" element={<Notifications />} />
                          <Route path="reports" element={<PaymentReports />} />
                          </Route>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                  <Footer />
                </div>
                <ToastNotification />
                </AdminProvider>
              </PaymentProvider>
            </StudentProvider>
          </AuthProvider>
        </BranchesProvider>
      </BrowserRouter>
    </NotificationProvider>
  );
}

