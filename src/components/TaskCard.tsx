const TaskCard=({task})=>{
    return (
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-id-card text-white"></i>
          </div>
          <div>
            <h3 className="font-semibold">Verify Business Address</h3>
            <p className="text-sm text-neutral-500">Due by Mar 20, 2025</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs bg-neutral-700 text-white rounded-full">
          Medium Priority
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <i className="fa-regular fa-circle text-neutral-400"></i>
          <span className="text-sm text-neutral-600">
            Upload Utility Bill
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="fa-regular fa-circle text-neutral-400"></i>
          <span className="text-sm text-neutral-600">
            Submit Lease Agreement
          </span>
        </div>
      </div>
    </div>
    )
  }
  export default TaskCard;