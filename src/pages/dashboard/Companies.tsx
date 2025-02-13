import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAppSelector } from '../../store/hooks';

export default function Companies() {
  const companies = useAppSelector((state) => state.company.companies);
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen"></div>
    </DashboardLayout>
  );
}
