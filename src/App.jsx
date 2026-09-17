import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { DashboardRouter } from './pages/dashboards/DashboardRouter';
import { MyTasksPage } from './pages/tasks/MyTasksPage';
import { TaskAssignmentPage } from './pages/tasks/TaskAssignmentPage';
import { LeaveRequestsPage } from './pages/leave/LeaveRequestsPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { HolidaysPage } from './pages/holidays/HolidaysPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { MastersPage } from './pages/masters/MastersPage';

import { SalesDashboardPage } from './pages/sales/SalesDashboardPage';
import { OTDTasksPage } from './pages/sales/OTDTasksPage';
import { SalesOrdersPage } from './pages/sales/SalesOrdersPage';
import { OrderTrackingPage } from './pages/sales/OrderTrackingPage';
import { CustomersPage } from './pages/sales/CustomersPage';
import { ProductsPage } from './pages/sales/ProductsPage';
import { EmployeesPage } from './pages/sales/EmployeesPage';
import { OTDMastersPage } from './pages/sales/OTDMastersPage';
import { OTDTatPage } from './pages/sales/OTDTatPage';
import { OTDReportsPage } from './pages/sales/OTDReportsPage';
import { OTDAuditLogPage } from './pages/sales/OTDAuditLogPage';
import { OTDDataManagementPage } from './pages/sales/OTDDataManagementPage';

// 12 Workflow Stage Pages for Order To Delivery
import { NewOrderPage } from './pages/sales/NewOrderPage';
import { OrderVerificationPage } from './pages/sales/OrderVerificationPage';
import { OrderApprovalPage } from './pages/sales/OrderApprovalPage';
import { AdvancePaymentPage } from './pages/sales/AdvancePaymentPage';
import { StockCheckPage } from './pages/sales/StockCheckPage';
import { OrderProcessingPage } from './pages/sales/OrderProcessingPage';
import { QualityCheckPage } from './pages/sales/QualityCheckPage';
import { ReadyForDispatchPage } from './pages/sales/ReadyForDispatchPage';
import { DispatchPage } from './pages/sales/DispatchPage';
import { DeliveredPage } from './pages/sales/DeliveredPage';
import { PaymentCollectionPage } from './pages/sales/PaymentCollectionPage';
import { OrderClosedPage } from './pages/sales/OrderClosedPage';

// Master System Module Pages
import { MasterOverviewPage } from './pages/masterSystem/MasterOverviewPage';
import { MasterCompanyDetailsPage } from './pages/masterSystem/MasterCompanyDetailsPage';
import { MasterVendorsPage } from './pages/masterSystem/MasterVendorsPage';
import { MasterDepartmentsPage } from './pages/masterSystem/MasterDepartmentsPage';
import { MasterHolidaysPage } from './pages/masterSystem/MasterHolidaysPage';

// 9 Workflow Stage Pages for Purchase System
import { PurchaseIndentPage } from './pages/purchase/PurchaseIndentPage';
import { IndentApprovalPage } from './pages/purchase/IndentApprovalPage';
import { PurchaseOrderPage } from './pages/purchase/PurchaseOrderPage';
import { MaterialLiftingPage } from './pages/purchase/MaterialLiftingPage';
import { MaterialDeliveryPage } from './pages/purchase/MaterialDeliveryPage';
import { MaterialReceivingPage } from './pages/purchase/MaterialReceivingPage';
import { PurchaseQCPage } from './pages/purchase/PurchaseQCPage';
import { GRNPage } from './pages/purchase/GRNPage';
import { PurchasePaymentPage } from './pages/purchase/PurchasePaymentPage';

// Lead To Orders System Pages
import { LeadPipelinePage } from './pages/leadToOrders/LeadPipelinePage';
import { ActiveDealsPage } from './pages/leadToOrders/ActiveDealsPage';
import { OrderConversionsPage } from './pages/leadToOrders/OrderConversionsPage';

// HR System Pages
import { HRDashboardPage } from './pages/hr/HRDashboardPage';
import { EmployeeDirectoryPage } from './pages/hr/EmployeeDirectoryPage';
import { AttendancePage } from './pages/hr/AttendancePage';
import { PayrollPage } from './pages/hr/PayrollPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnlyRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function TaskAssignmentRoute({ children }) {
  const { user, isAdmin, isManager } = useAuth();
  if (isAdmin || isManager) return children;
  if (user?.self_assign_enabled !== false) return children;
  return <Navigate to="/my-tasks" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Checklist & Core System Routes */}
        <Route path="dashboard" element={<DashboardRouter />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route
          path="task-assignment"
          element={
            <TaskAssignmentRoute>
              <TaskAssignmentPage />
            </TaskAssignmentRoute>
          }
        />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route path="leave-requests" element={<LeaveRequestsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="holidays" element={<HolidaysPage />} />
        <Route
          path="masters"
          element={
            <AdminOnlyRoute>
              <MastersPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />

        {/* Order To Delivery System Routes */}
        <Route path="sales/new-order" element={<NewOrderPage />} />
        <Route path="sales/verification" element={<OrderVerificationPage />} />
        <Route path="sales/approval" element={<OrderApprovalPage />} />
        <Route path="sales/advance-payment" element={<AdvancePaymentPage />} />
        <Route path="sales/stock-check" element={<StockCheckPage />} />
        <Route path="sales/processing" element={<OrderProcessingPage />} />
        <Route path="sales/qc" element={<QualityCheckPage />} />
        <Route path="sales/ready-dispatch" element={<ReadyForDispatchPage />} />
        <Route path="sales/dispatch" element={<DispatchPage />} />
        <Route path="sales/delivered" element={<DeliveredPage />} />
        <Route path="sales/payment-collection" element={<PaymentCollectionPage />} />
        <Route path="sales/closed" element={<OrderClosedPage />} />

        <Route path="sales/dashboard" element={<SalesDashboardPage />} />
        <Route path="sales/tasks" element={<OTDTasksPage />} />
        <Route path="sales/orders" element={<SalesOrdersPage />} />
        <Route path="sales/tracking" element={<OrderTrackingPage />} />
        <Route path="sales/reports" element={<OTDReportsPage />} />
        <Route path="sales/audit-log" element={<OTDAuditLogPage />} />
        <Route path="sales/data-management" element={<OTDDataManagementPage />} />

        {/* Master System Module Routes */}
        <Route path="master-system/overview" element={<MasterOverviewPage />} />
        <Route path="master-system/company-details" element={<MasterCompanyDetailsPage />} />
        <Route path="master-system/vendors" element={<MasterVendorsPage />} />
        <Route path="master-system/products" element={<ProductsPage />} />
        <Route path="master-system/departments" element={<MasterDepartmentsPage />} />
        <Route path="master-system/users" element={<EmployeesPage />} />
        <Route path="master-system/tat" element={<OTDTatPage />} />
        <Route path="master-system/holidays" element={<MasterHolidaysPage />} />

        {/* Purchase System Routes */}
        <Route path="purchase/indent" element={<PurchaseIndentPage />} />
        <Route path="purchase/indent-approval" element={<IndentApprovalPage />} />
        <Route path="purchase/po" element={<PurchaseOrderPage />} />
        <Route path="purchase/lifting-dispatch" element={<MaterialLiftingPage />} />
        <Route path="purchase/delivery" element={<MaterialDeliveryPage />} />
        <Route path="purchase/receiving" element={<MaterialReceivingPage />} />
        <Route path="purchase/qc" element={<PurchaseQCPage />} />
        <Route path="purchase/grn" element={<GRNPage />} />
        <Route path="purchase/payment" element={<PurchasePaymentPage />} />

        {/* Lead To Orders Routes */}
        <Route path="lead-to-orders/pipeline" element={<LeadPipelinePage />} />
        <Route path="lead-to-orders/deals" element={<ActiveDealsPage />} />
        <Route path="lead-to-orders/conversions" element={<OrderConversionsPage />} />

        {/* HR System Routes */}
        <Route path="hr/dashboard" element={<HRDashboardPage />} />
        <Route path="hr/employees" element={<EmployeeDirectoryPage />} />
        <Route path="hr/attendance" element={<AttendancePage />} />
        <Route path="hr/payroll" element={<PayrollPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
