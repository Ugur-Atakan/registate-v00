//@ts-nocheck
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminCompanies() {
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        const response = await instance.get("/company/all");
        setCompanies(response.data);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <AdminDashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Admin Companies</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left">Company Name</th>
                            <th className="py-2 px-4 text-left">State</th>
                            <th className="py-2 px-4 text-left">Type</th>
                            <th className="py-2 px-4 text-left">Business Activity</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Total Shares</th>
                            <th className="py-2 px-4 text-left">Monetary Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{company.companyName}</td>
                                    <td className="py-2 px-4">{company.state.name} ({company.state.abbreviation})</td>
                                    <td className="py-2 px-4">{company.companyType.name}</td>
                                    <td className="py-2 px-4">{company.businessActivity}</td>
                                    <td className="py-2 px-4">{company.status}</td>
                                    <td className="py-2 px-4">{company.totalShares}</td>
                                    <td className="py-2 px-4">${(company.monetaryValue / 100).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No companies found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminDashboardLayout>
    );
}
