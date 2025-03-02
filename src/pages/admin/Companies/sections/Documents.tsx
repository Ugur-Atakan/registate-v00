import { useEffect, useState } from "react";
import { 
  Search, Plus, FileText, Download, Eye, Trash2, Filter,
  Calendar, Info, ChevronDown, ArrowUpDown, X
} from "lucide-react";
import toast from "react-hot-toast";
import instance from "../../../../http/instance";
import FileUploadComponent from "../../../../components/FileUpload";
import { uploadDocument } from "../../../../utils/fileUpload";

interface SectionProps {
  companyId: string;
}

interface Document {
  id: string;
  companyId: string;
  uploadedById: string;
  name: string;
  key: string;
  bucketName: string;
  link: string;
  documentType: string;
  fileType: string;
  fromStaff: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DocumentUploadData {
  companyId: string;
  uploadedById: string;
  name: string;
  key: string;
  bucketName: string;
  link: string;
  documentType: string;
  fileType: string;
  fromStaff: boolean;
}

export default function CompanyDocumentsSection({ companyId }: SectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedDocumentType, setSelectedDocumentType] = useState('profile');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await instance.get(`/admin/company/${companyId}/documents`);
        setDocuments(response.data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchDocuments();
    }
  }, [companyId]);

  const filteredDocuments = documents.filter(doc => {
    if (!doc) return false;
    
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.documentType === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    
    const order = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'name':
        return order * a.name.localeCompare(b.name);
      case 'type':
        return order * a.documentType.localeCompare(b.documentType);
      default:
        return order * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      // First upload file to Supabase
      const fileUrl = await uploadDocument(file, selectedDocumentType);
      
      // Prepare document data
      const documentData: DocumentUploadData = {
        companyId: companyId,
        uploadedById: "c8f3de36-c259-4e8f-b944-9f37b8c161fb", // This should come from user context
        name: file.name,
        key: `documents/${selectedDocumentType}/${file.name}`,
        bucketName: "company-documents",
        link: fileUrl,
        documentType: selectedDocumentType,
        fileType: file.name.split('.').pop() || '',
        fromStaff: true // This should be determined based on user role
      };

      // Send document data to API
      await instance.post('/admin/company/upload-document', documentData);
      
      toast.success('Document uploaded successfully');
      
      // Refresh documents list
      const response = await instance.get(`/admin/company/${companyId}/documents`);
      setDocuments(response.data || []);
      
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'download') => {
    if (!selectedDocuments.length) return;

    try {
      if (action === 'delete') {
        await Promise.all(selectedDocuments.map(id => 
          instance.delete(`/admin/company/document/${id}`)
        ));
        toast.success('Selected documents deleted successfully');
        const response = await instance.get(`/admin/company/${companyId}/documents`);
        setDocuments(response.data || []);
      } else {
        selectedDocuments.forEach(id => {
          const doc = documents.find(d => d?.id === id);
          if (doc?.link) {
            window.open(doc.link, '_blank');
          }
        });
      }
      setSelectedDocuments([]);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-8">
        <Info className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Company ID Required</h3>
        <p className="text-gray-600">Please select a company to view documents.</p>
      </div>
    );
  }

  return (
    <div>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Company Documents</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[--primary] text-white rounded-lg 
            hover:bg-[--primary]/90 transition-colors"
        >
          <Plus size={20} />
          Upload Document
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-[--primary]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                  hover:bg-gray-50"
              >
                <Filter size={16} />
                <span>Filters</span>
                <ChevronDown size={16} />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border 
                  border-gray-200 p-4 z-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="all">All Types</option>
                      <option value="profile">Profile</option>
                      <option value="formation">Formation</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('download')}
                  className="px-4 py-2 text-[--primary] bg-[--primary]/10 rounded-lg 
                    hover:bg-[--primary]/20"
                >
                  Download Selected
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Documents Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || selectedType !== 'all'
                ? "Try adjusting your filters"
                : "Upload documents to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-8 p-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === paginatedDocuments.length}
                        onChange={(e) => {
                          setSelectedDocuments(
                            e.target.checked
                              ? paginatedDocuments.map(doc => doc.id)
                              : []
                          );
                        }}
                        className="rounded border-gray-300 text-[--primary] focus:ring-[--primary]"
                      />
                    </th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 
                          hover:text-gray-700"
                      >
                        Document
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Source</th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 
                          hover:text-gray-700"
                      >
                        Uploaded
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedDocuments.map((doc) => doc && (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={(e) => {
                            setSelectedDocuments(prev =>
                              e.target.checked
                                ? [...prev, doc.id]
                                : prev.filter(id => id !== doc.id)
                            );
                          }}
                          className="rounded border-gray-300 text-[--primary] focus:ring-[--primary]"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[--primary]/10 rounded-lg">
                            <FileText className="w-5 h-5 text-[--primary]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                          font-medium bg-[--primary]/10 text-[--primary]">
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                          font-medium bg-gray-100 text-gray-800">
                          {doc.fromStaff ? 'Staff' : 'User'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(doc.link, '_blank')}
                            className="p-2 text-gray-400 hover:text-[--primary] hover:bg-[--primary]/10 
                              rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <a
                            href={doc.link}
                            download
                            className="p-2 text-gray-400 hover:text-[--primary] hover:bg-[--primary]/10 
                              rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download size={18} />
                          </a>
                          <button
                            onClick={() => {
                              // Handle delete
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                              rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <select
                  value={itemsPerPage}
                  className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-500">entries</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? 'bg-[--primary] text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-900">Managing Documents</h3>
            <p className="text-sm text-blue-700 mt-1">
              Upload and manage important company documents here. You can view, download, or update documents 
              as needed. Use filters and search to quickly find specific documents.
            </p>
          </div>
        </div>
      </div>
    </div>
          {/* Upload Modal */}
          {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Document Type */}
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  placeholder="Document Name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-[--primary]"
                />
            
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                >
                  <option value="profile">Profile</option>
                  <option value="formation">Formation</option>
                  <option value="compliance">Compliance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <FileUploadComponent
                file={null}
                setFile={(file) => {
                  if (file) {
                    handleUpload(file);
                  }
                }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                label="document"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}