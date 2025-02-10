import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Documents(){
const [documents, setDocuments] = useState([]);

    return (
          <DashboardLayout>
            <div>
                <h1>Documents</h1>
            </div>
          </DashboardLayout>

    );
}