import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await instance.get("/admin/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <AdminDashboardLayout>
      <h2 className="text-3xl">Tasks</h2>
      {tasks.length > 0 ? (
        tasks.map((task: any) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </AdminDashboardLayout>
  );
}
