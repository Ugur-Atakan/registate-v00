import { useEffect, useState } from "react";
import instance from "../../../../http/instance";

export default function StatesSection() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">States</h2>
    
    </div>
  );
}
