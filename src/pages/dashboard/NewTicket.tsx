import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  ArrowLeft,
  Paperclip,
  Send,
  Info,
  FileText,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveCompanyId } from '../../utils/storage';
import instance from '../../http/instance';
import { uploadMessageAttachment } from '../../utils/fileUpload';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface TicketMessage {
  ticketId?: string;
  message: string;
  attachments: Attachment[];
}

interface TicketData {
  companyId: string;
  subject: string;
  category: 'ACCOUNT' | 'PAYMENT' | 'TECHNICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  message: TicketMessage[];
}

export default function NewSupportTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [ticketData, setTicketData] = useState<TicketData>({
    companyId: getActiveCompanyId() || '',
    subject: '',
    category: 'TECHNICAL',
    priority: 'LOW',
    message: [{
      message: '',
      attachments: []
    }]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.message[0].message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // In production, you would first upload the files and get their URLs
      const attachments: Attachment[] = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          url: await uploadMessageAttachment(file, "ticket"),
          type: "TicketAttachment",
        }))
      );
      const finalTicketData = {
        ...ticketData,
        message: [{
          ...ticketData.message[0],
          attachments
        }]
      };

      await instance.post('/support/create-ticket', finalTicketData);
      toast.success('Ticket created successfully');
      navigate('/dashboard/support');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard/support')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Create New Support Ticket</h1>
            <p className="text-gray-600 mt-1">
              Submit a new support request and we'll help you as soon as possible
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Support Hours</h3>
              <p className="text-sm text-blue-700 mt-1">
                Our support team is available 24/7. We typically respond to tickets within 2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Subject & Category */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ticketData.subject}
                  onChange={(e) => setTicketData(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData(prev => ({
                    ...prev,
                    category: e.target.value as TicketData['category']
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                >
                  <option value="TECHNICAL">Technical Issue</option>
                  <option value="ACCOUNT">Account Related</option>
                  <option value="PAYMENT">Payment Issue</option>
                </select>
              </div>
            </div>

            {/* Priority Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setTicketData(prev => ({
                      ...prev,
                      priority: priority as TicketData['priority']
                    }))}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-300
                      ${ticketData.priority === priority
                        ? 'border-[--primary] bg-[--primary]/5 text-[--primary]'
                        : 'border-gray-200 hover:border-[--primary]/30'
                      }`}
                  >
                    {priority}
                    <p className="text-sm text-gray-500 mt-1">
                      {priority === 'LOW' && 'General inquiry'}
                      {priority === 'MEDIUM' && 'Important issue'}
                      {priority === 'HIGH' && 'Critical problem'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={ticketData.message[0].message}
                onChange={(e) => setTicketData(prev => ({
                  ...prev,
                  message: [{
                    ...prev.message[0],
                    message: e.target.value
                  }]
                }))}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent resize-none"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            {/* File Attachments */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="mb-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-600">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors cursor-pointer">
                  <Paperclip size={20} />
                  <span>Attach Files</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Max file size: 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[--primary] text-white 
                rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}