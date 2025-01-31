import DashboardLayout from '../components/layout/DashboardLayout';

export default function Companies() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Companies</h1>
        <p className="text-gray-600">Your company details will appear here once formation is complete.</p>
      </div>
    </DashboardLayout>
  );
}