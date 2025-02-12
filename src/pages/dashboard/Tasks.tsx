import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Task } from "../../types/types";
import { useEffect, useState } from "react";
import instance from "../../http/instance";
import TaskCard from "../../components/TaskCard";

const companyId: string = "269eef1d-5af2-4e67-a2e2-0cde8884eb65";
const Tasks = () => {
  const [loading,setloading]=useState<boolean>(false);
  const [tasks, setTasks] = useState<[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTasks = async () => {
      setloading(true);
      const response = await instance.get(`/company/${companyId}/tasks`);
      console.log(response.data);
      setTasks(response.data);
      setloading(false);
    };
    fetchTasks();
  }, []);


  const goTaskDetails = (taskId: string) => {
    navigate("/dashboard/tasks/details", { state: { taskId } });
  };

  if(loading){
    return <div>Loading...</div>
  }
  return (
    <DashboardLayout>
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-neutral-500">
              Your pending tasks and requirements
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5"></i>
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Tasks List */}
        <div id="tasks-list" className="space-y-4">
          {/* Task Item 1 */}
          {tasks.map((task: Task) => (
            <TaskCard task={task} onclick={goTaskDetails} />
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Tasks;
