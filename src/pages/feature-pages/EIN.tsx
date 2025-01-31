import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EIN() {
    return (
        <DashboardLayout>
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Employer Identification Number (EIN)</h1>
            <p className="text-gray-600">This is a unique nine-digit number assigned by the IRS to identify your business.</p>
        </div>
        </DashboardLayout>
    );
    }