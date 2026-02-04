import DashboardNavbar from "@/components/navbar/DashBoardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
               {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}