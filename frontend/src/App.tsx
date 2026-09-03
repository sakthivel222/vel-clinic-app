import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Calendar from './pages/Calendar';
import AppointmentForm from './pages/AppointmentForm';
import Exercises from './pages/Exercises';
import ExerciseForm from './pages/ExerciseForm';
import SessionForm from './pages/SessionForm';
import Payments from './pages/Payments';
import PaymentForm from './pages/PaymentForm';
import Settings from './pages/Settings';
import Login from './pages/Login';

const RequireAuth = ({ children }: { children: any }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/new" element={<AppointmentForm />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="exercises/new" element={<ExerciseForm />} />
        <Route path="sessions/new" element={<SessionForm />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payments/new" element={<PaymentForm />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
