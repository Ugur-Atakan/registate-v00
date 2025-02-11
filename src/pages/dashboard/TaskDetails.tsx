import DashboardLayout from "../../components/layout/DashboardLayout";
const TaskDetails = () => {
  return (
<DashboardLayout>
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-solid fa-arrow-left w-5 h-5"></i>
            </button>
            <div>
              <h1 className="text-2xl font-semibold">
                Complete Company Registration
              </h1>
              <p className="text-sm text-neutral-500">Due by Mar 15, 2025</p>
            </div>
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

        <div id="task-details" className="grid grid-cols-3 gap-8">
          {/* Left Column: Description and Ask a Question */}
          <div className="col-span-2 space-y-6">
            {/* Task Description */}
            <div
              id="task-description"
              className="bg-white p-6 rounded-lg border border-neutral-200"
            >
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-neutral-600 mb-4">
                Complete all necessary steps for company registration including
                document submission, fee payment, and EIN number acquisition.
              </p>
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <span className="flex items-center">
                  <i className="fa-regular fa-clock w-4 h-4 mr-1"></i>
                  Created on Mar 1, 2025
                </span>
                <span className="flex items-center">
                  <i className="fa-regular fa-user w-4 h-4 mr-1"></i>
                  Assigned to John Doe
                </span>
              </div>
            </div>

            {/* Ask a Question */}
            <div
              id="ask-question"
              className="bg-white p-6 rounded-lg border border-neutral-200"
            >
              <h2 className="text-lg font-semibold mb-4">Ask a Question</h2>
              <div className="space-y-4">
                <textarea
                  className="w-full p-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400" rows={4}
                  placeholder="Type your question about the registration process..."
                ></textarea>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
                  Submit Question
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Task Status and Attachments */}
          <div className="space-y-6">
            {/* Task Status */}
            <div
              id="task-status"
              className="bg-white p-6 rounded-lg border border-neutral-200"
            >
              <h2 className="text-lg font-semibold mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-500 block mb-2">
                    Current Status
                  </label>
                  <div className="flex flex-col space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800">
                      <i className="fa-solid fa-clock w-3 h-3 mr-1"></i>
                      In Progress
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 text-white">
                      <i className="fa-solid fa-exclamation-circle w-3 h-3 mr-1"></i>
                      High Priority
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-300 text-neutral-700">
                      <i className="fa-solid fa-hourglass-half w-3 h-3 mr-1"></i>
                      Due Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Attachments */}
            <div
              id="task-attachments"
              className="bg-white p-6 rounded-lg border border-neutral-200"
            >
              <h2 className="text-lg font-semibold mb-4">Attachments</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fa-regular fa-file-pdf text-neutral-400"></i>
                    <span className="text-sm">Articles_Draft.pdf</span>
                  </div>
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <i className="fa-solid fa-download"></i>
                  </button>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 p-3 border border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:bg-neutral-50">
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Attachment</span>
                </button>
              </div>
            </div>

            {/* Submit Task Button */}
            <button
              id="submit-task"
              className="w-full py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-check w-5 h-5"></i>
              <span>Complete and Submit</span>
            </button>
          </div>
        </div>
      </main>
</DashboardLayout>
  );
};

export default TaskDetails;
