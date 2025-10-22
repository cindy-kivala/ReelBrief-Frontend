import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

export default function ClientDashboard() {
  return (
    <div className="dashboard-layout flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <Navbar />

        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-gray-500">Here's what's happening with your projects</p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="stat-card">
            <p className="stat-number">3</p>
            <p className="stat-label">Active Projects</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">1</p>
            <p className="stat-label">In Review</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">12</p>
            <p className="stat-label">Completed</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">$24.5k</p>
            <p className="stat-label">Total Spent</p>
          </div>
        </section>

        {/* Recent Projects Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <button className="btn-link">View All</button>
          </div>

          <div className="project-card">
            <h3 className="font-semibold">Logo Design for TechCo</h3>
            <p className="text-sm text-gray-500">Freelancer: Sarah Johnson</p>
            <div className="flex justify-between text-sm mt-1">
              <span>$1,500</span>
              <span>Due Apr 25, 2025</span>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress w-[60%]" />
            </div>
          </div>

          <div className="project-card">
            <h3 className="font-semibold">Website Copy</h3>
            <p className="text-sm text-gray-500">Freelancer: Michael Chen</p>
            <div className="flex justify-between text-sm mt-1">
              <span>$2,200</span>
              <span>Due Apr 22, 2025</span>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress w-full" />
            </div>
          </div>

          <div className="project-card">
            <h3 className="font-semibold">Video Editing</h3>
            <p className="text-sm text-gray-500">Freelancer: Jane Smith</p>
            <div className="flex justify-between text-sm mt-1">
              <span>$800</span>
              <span>Due Apr 30, 2025</span>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress w-full bg-green-500" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
