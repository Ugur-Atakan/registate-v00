import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onContinue: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export default function IncompleteRegistrationModal({ 
  isOpen, 
  onContinue, 
  onRestart, 
  onClose 
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Continue Registration?
          </h2>
          <p className="text-gray-600 mb-6">
            We noticed you have an incomplete company registration. Would you like to continue where you left off or start fresh?
          </p>

          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-[--primary] text-white py-3 px-4 rounded-lg font-medium 
                transition-all duration-200 hover:bg-[--primary]/90"
            >
              Continue Registration
            </button>
            <button
              onClick={onRestart}
              className="w-full border-2 border-[--primary] text-[--primary] py-3 px-4 rounded-lg font-medium 
                transition-all duration-200 hover:bg-[--primary]/5"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}