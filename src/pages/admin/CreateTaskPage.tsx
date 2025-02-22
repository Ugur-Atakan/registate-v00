import React, { useState } from 'react';
import { ArrowLeft, Bell, Upload, X, Calendar, Clock, Search, Building2, Check } from 'lucide-react';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';

interface CreateTaskPageProps {
  onBack: () => void;
}

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface Company {
  id: string;
  companyName: string;
}

export default function CreateTaskPage({ onBack }: CreateTaskPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [priority, setPriority] = useState('MEDIUM');
  const [type, setType] = useState('GENERAL');
  const [dueDate, setDueDate] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  // Demo companies data - replace with actual data from API
  const companies: Company[] = [
    { id: '269eef1d-5af2-4e67-a2e2-0cde8884eb65', companyName: 'Better LLC' },
    { id: '369eef1d-5af2-4e67-a2e2-0cde8884eb66', companyName: 'Tech Solutions LLC' },
    { id: '469eef1d-5af2-4e67-a2e2-0cde8884eb67', companyName: 'Digital Ventures Corp' },
    { id: '569eef1d-5af2-4e67-a2e2-0cde8884eb68', companyName: 'Innovation Labs Inc' },
    { id: '669eef1d-5af2-4e67-a2e2-0cde8884eb69', companyName: 'Future Systems Ltd' },
  ];

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      alert('Please select a company');
      return;
    }
    
    const taskData = {
      title,
      description,
      icon: "https://example.com/icon.png", // Replace with actual icon URL
      status,
      priority,
      type,
      companyId: selectedCompany.id,
      dueDate: new Date(dueDate).toISOString(),
      attachments: attachments.map(attachment => ({
        ...attachment,
        taskId: 'task-uuid' // This will be handled by the backend
      }))
    };

    console.log('Task Data:', taskData);
    // Here you would make the API call to create the task
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real implementation, you would upload these files to your storage
      // and get back URLs. This is just for demonstration.
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.split('/')[1]
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Create New Task</h1>
            <p className="text-sm text-gray-500">Create a new task for a company</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    placeholder="Enter task description"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Task Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Task Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                      required
                    />
                    <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="GENERAL">General</option>
                    <option value="LEGAL">Legal</option>
                    <option value="ADMINISTRATIVE">Administrative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Attachments</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or</p>
                    <label className="px-4 py-2 bg-[#1649FF] text-white rounded-lg cursor-pointer hover:bg-blue-600">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1649FF] text-white rounded-lg hover:bg-blue-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>

        {/* Company Selection Panel */}
        <div className="lg:w-80">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h2 className="text-lg font-medium mb-4">Select Company</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={companySearchQuery}
                  onChange={(e) => setCompanySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => setSelectedCompany(company)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCompany?.id === company.id
                        ? 'bg-[#EEF2FF] text-[#1649FF]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm font-medium">{company.companyName}</span>
                    </div>
                    {selectedCompany?.id === company.id && (
                      <Check className="w-5 h-5 text-[#1649FF]" />
                    )}
                  </button>
                ))}
              </div>
              {selectedCompany && (
                <div className="mt-4 p-4 bg-[#EEF2FF] rounded-lg">
                  <p className="text-sm font-medium text-[#1649FF]">Selected Company</p>
                  <p className="text-sm mt-1">{selectedCompany.companyName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </AdminDashboardLayout>  );
}