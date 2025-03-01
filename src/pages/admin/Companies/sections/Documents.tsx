import { useEffect, useState } from "react";
import instance from "../../../../http/instance";

interface SectionProps {
  companyId: string;
}

export default function CompanyDocumentsSection({ companyId }: SectionProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const getCompanyDocuments = async () => {
    const response = await instance.get(
      `/admin/company/${companyId}/documents`
    );
    setDocuments(response.data);
  };
  useEffect(() => {
    if (companyId) {
      getCompanyDocuments();
    }
  }, [companyId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Documents</h2>
      {documents.length > 0 ? (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{doc.title}</p>
                <p className="text-sm text-gray-500">Type: {doc.type}</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                Update Document
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
        Add Document
      </button>
    </div>
  );
}
