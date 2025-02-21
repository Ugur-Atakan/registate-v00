import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Download, Calendar, Info, Search, ExternalLink } from 'lucide-react';
import { getCompanyDocuments } from '../../http/requests/companyRequests';

interface Document {
  id: string;
  companyId: string;
  uploadedById: string;
  name: string;
  key: string;
  bucketName: string;
  link: string;
  fromStaff: boolean;
  createdAt: string;
  updatedAt: string;
  documentType: string;
  fileType: string;
  description?: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeType, setActiveType] = useState<string>('COMPANY');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
         const docs = await getCompanyDocuments();
         setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    }
    fetchDocuments();
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '').toUpperCase();
    if (hash) {
      setActiveType(hash);
    }
  }, [location]);

  const filteredDocuments = documents
    .filter(doc => doc.documentType === activeType)
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentTypeTitle = (type: string) => {
    switch (type) {
      case 'COMPANY':
        return 'Company Documents';
      case 'EIN':
        return 'EIN Documents';
      case 'ANNUAL':
        return 'Annual Report Filing';
      case 'BOI':
        return 'BOI Report Filing';
      default:
        return 'Documents';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{getDocumentTypeTitle(activeType)}</h1>
          <p className="text-gray-600">
            View and manage your important business documents
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Document Management</h3>
              <p className="text-sm text-blue-700 mt-1">
                All documents are securely stored and managed by our team. If you need to update any information,
                please contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="space-y-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-medium text-gray-900 break-words mb-1">{doc.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 break-words">{doc.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} className="shrink-0" />
                      <span className="truncate">Updated {formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                    <a
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[--primary] transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a
                      href={doc.link}
                      download={doc.name}
                      className="p-2 text-gray-400 hover:text-[--primary] transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms"
                    : "Documents will appear here once they are processed"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}