//@ts-nocheck
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const response = await instance.get("admin/users");
        setUsers(response.data.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AdminDashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Company</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">{user.roles.join(", ")}</td>
                                    <td className="py-2 px-4">{user.isActive ? "Active" : "Inactive"}</td>
                                    <td className="py-2 px-4">
                                        {user.companies.length > 0 ? user.companies.map(company => (
                                            <div key={company.companyId} className="text-sm">
                                                {company.companyName} ({company.role})
                                            </div>
                                        )) : "No Company"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminDashboardLayout>
    );
}
