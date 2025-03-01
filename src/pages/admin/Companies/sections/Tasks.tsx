export default function CompanyTaskSection(){

    const tasks = [
        {
          id: 1,
          title: "Task 1",
          status: "Completed",
        },
        {
          id: 2,
          title: "Task 2",
          status: "Pending",
        },
        {
          id: 3,
          title: "Task 3",
          status: "In Progress",
        },
      ];  
        
    return (


        <div>
              <h2 className="text-xl font-semibold mb-4">Company Tasks</h2>
              {tasks.length > 0 ? (
                <ul className="space-y-4">
                  {tasks.map(task => (
                    <li key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">Status: {task.status}</p>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">Update Task</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks found.</p>
              )}
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Task</button>
            </div>


    )
}
