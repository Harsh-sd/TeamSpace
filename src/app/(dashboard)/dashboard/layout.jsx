import DashboardNavbar from "@/components/navbar/DashBoardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}