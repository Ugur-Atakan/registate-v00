import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Documents(){
const [documents, setDocuments] = useState([]);

    return (
          <DashboardLayout>
            <DocumentsPage />
          </DashboardLayout>

    );
}


const DocumentsPage = () => {
  return (
    <div className="bg-neutral-50">
       <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Documents</h1>
            <p className="text-sm text-neutral-500">Manage your company documents</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>
        <div id="documents-content" className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Company Documents</h2>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg">
                <i className="fa-solid fa-filter mr-2"></i>
                Filter
              </button>
              <button className="px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg">
                <i className="fa-solid fa-upload mr-2"></i>
                Upload Document
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Document Item 1 */}
            <div className="flex items-center p-4 hover:bg-neutral-50 rounded-lg border-l-4 border border-neutral-900">
              <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center mr-4">
                <i className="fa-regular fa-file-pdf text-white"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Certificate of Formation.pdf</p>
                  <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                    Registate Generated
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Added on Jan 15, 2025</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-neutral-400 hover:text-neutral-600">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            </div>

            {/* Document Item 2 */}
            <div className="flex items-center p-4 hover:bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fa-regular fa-file-pdf text-neutral-600"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Business Plan.pdf</p>
                  <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                    User Uploaded
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Added on Jan 16, 2025</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-neutral-400 hover:text-neutral-600">
                  <i className="fa-solid fa-download"></i>
                </button>
                <button className="p-2 text-neutral-400 hover:text-neutral-600">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Document Section */}
          <div id="upload-document" className="mt-6 border-t border-neutral-200 pt-6">
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Document Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900">
                    <option>Company Document</option>
                    <option>Financial Document</option>
                    <option>Legal Document</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8">
                  <div className="text-center">
                    <i className="fa-solid fa-cloud-upload text-4xl text-neutral-400 mb-3"></i>
                    <p className="text-sm font-medium">Drag and drop your file here</p>
                    <p className="text-xs text-neutral-500 mt-1">or</p>
                    <button className="mt-3 px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg">
                      Browse Files
                    </button>
                    <p className="text-xs text-neutral-500 mt-2">Maximum file size: 10MB</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg">
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg">
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
