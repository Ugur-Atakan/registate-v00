import DashboardLayout from '../components/layout/DashboardLayout';
import { useAppSelector } from '../store/hooks';

export default function Companies() {
  const companies=useAppSelector(state=>state.company.companies);
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Companies</h1>
        <ul>
          {companies!.map((company) => (
            <li key={company.companyId} className="bg-white p-4 shadow-sm rounded-md mb-4">
              <h2 className="text-lg font-bold">{company.companyName}</h2>
              <p className="text-gray-600">{company.role}</p>
            </li>
          ))}
        </ul>
        <p className="text-gray-600">Your company details will appear here once formation is complete.</p>
      </div>
    </DashboardLayout>
  );
}