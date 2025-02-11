import DashboardLayout from "../../components/layout/DashboardLayout";

const NewSupportTicket = () => {
  return (
    <DashboardLayout>
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">New Support Ticket</h1>
            <p className="text-sm text-neutral-500">
              Create a new support request
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

        <div
          id="new-ticket-form"
          className="bg-white p-8 rounded-lg border border-neutral-200"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                placeholder="Enter ticket subject"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg">
                  <option>Low Priority</option>
                  <option>Medium Priority</option>
                  <option>High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg">
                  <option>Technical Issue</option>
                  <option>Billing Question</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg h-32"
                placeholder="Describe your issue in detail"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Attachments</label>
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center">
                <i className="fa-solid fa-cloud-upload text-4xl text-neutral-400 mb-3"></i>
                <p className="text-sm text-neutral-600">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                Cancel
              </button>
              <button className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default NewSupportTicket;
