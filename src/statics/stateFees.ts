import { Calendar, Clock, Zap } from "lucide-react";

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
