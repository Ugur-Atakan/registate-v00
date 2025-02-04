import { Calendar, Clock, Zap } from "lucide-react";

 const apiStateFeees= {
    "stateFee": {
      "id": "a3f5333c-b241-4012-9931-ce944b6a2de4",
      "fee": 110,
      "createdAt": "2025-02-02T18:52:09.893Z",
      "updatedAt": "2025-02-02T18:52:09.893Z",
      "companyType": {
        "id": "52f51620-f4db-4ba3-9910-27279588e445",
        "name": "LLC"
      }
    },

    "expeditedFees": [
      {
        "id": "a1b4e8a9-da2f-4dfe-9b0d-64f3c96e3572",
        "tierName": "Same-Day Filing",
        "description": "Same business day",
        "baseAmount": 100
      },
      {
        "id": "8b3f936c-f931-4a68-9692-9e153b0fa109",
        "tierName": "24-Hour Filing",
        "description": "24 hours",
        "baseAmount": 50
      },
      {
        "id": "5da2f854-aaf0-44e2-a8f9-796a79245417",
        "tierName": "Standard Processing",
        "description": "3-5 weeks",
        "baseAmount": 0
      }
    ]
  }

  interface FilingOption {
    id: string;
    name: string;
    description: string;
    processingTime: string;
    additionalFee: number;
    icon: React.ElementType;
  }


  export const staticStateFees: FilingOption[] = [
    {
      id: 'standard',
      name: 'Standard Processing',
      description: 'Standard processing with regular state filing fees',
      processingTime: '3-5 weeks',
      additionalFee: 0,
      icon: Calendar
    },
    {
      id: '24hour',
      name: '24-Hour Filing',
      description: 'Expedited processing within 24 hours',
      processingTime: '24 hours',
      additionalFee: 50,
      icon: Clock
    },
    {
      id: 'sameday',
      name: 'Same-Day Filing',
      description: 'Ultra-fast processing on the same business day',
      processingTime: 'Same business day',
      additionalFee: 100,
      icon: Zap
    }
  ];
