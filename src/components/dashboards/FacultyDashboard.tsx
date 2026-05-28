import SuperAdminDashboard from "./SuperAdminDashboard";
// Faculty has the exact same write capabilities as Super Admin.
export default function FacultyDashboard() {
  return <SuperAdminDashboard />;
}
