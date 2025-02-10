import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await instance.get("/admin/support/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <AdminDashboardLayout>
      <h1 className="text-3xl">Admin Support</h1>

      {tickets.length > 0 ? (
        tickets.map((ticket: any) => (
          <div key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
          </div>
        ))
      ) : (
        <p>No tickets found</p>
      )}
    </AdminDashboardLayout>
  );
}
