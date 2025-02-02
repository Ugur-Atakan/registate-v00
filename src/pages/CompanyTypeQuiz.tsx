import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

type Answer = 'Yes' | 'No' | 'Not Sure' | null;

interface Question {
  id: number;
  text: string;
  answer: Answer;
}

export default function CompanyTypeQuiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'Are you planning to raise money or go through an accelerator/incubator program?',
      answer: null
    },
    {
      id: 2,
      text: 'Do you intend to offer stock to your employees, advisors, or partners?',
      answer: null
    }
  ]);

  const handleAnswer = (answer: Answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentStep].answer = answer;
    setQuestions(updatedQuestions);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getRecommendation = (): 'LLC' | 'C-CORP' => {
    return questions.some(q => q.answer === 'Yes') ? 'C-CORP' : 'LLC';
  };

  const handleComplete = () => {
    const recommendation = getRecommendation();
    navigate('/company-formation', { state: { fromQuiz: true, recommendation } });
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const canComplete = questions.every(q => q.answer !== null);

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12 mb-8"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Company Type Quiz</h1>
            <p className="text-gray-600">Answer a few questions to find the best company structure for you</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-[--primary]">
                    {Math.round(((currentStep + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[--primary] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

              <div className="space-y-3">
                {(['Yes', 'No', 'Not Sure'] as Answer[]).map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswer(answer)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300
                      ${currentQuestion.answer === answer
                        ? 'border-[--primary] bg-[--primary]/5 text-[--primary]'
                        : 'border-gray-200 hover:border-[--primary]/30'}`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>

            {isLastQuestion && canComplete && (
              <button
                onClick={handleComplete}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                See Recommendation <ArrowRight size={20} />
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-gray-600">
              <HelpCircle size={18} />
              <span>Need help?</span>
              <button className="text-[--primary] font-medium hover:underline">
                Contact our experts
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-image-side !bg-[#1649FF]/5">
        <div className="w-full max-w-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[--primary]">Why Take This Quiz?</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Make an Informed Decision</h3>
              <p className="text-gray-700">
                Choosing the right business structure is crucial for your company's future. 
                This quiz helps you evaluate key factors that influence this decision:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[--primary] font-bold">•</span>
                  <span>Future funding needs and investment opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[--primary] font-bold">•</span>
                  <span>Employee stock options and ownership structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[--primary] font-bold">•</span>
                  <span>Tax implications and liability protection</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[--primary]/10">
              <h3 className="font-semibold text-[--primary] mb-2">Expert Tip</h3>
              <p className="text-gray-700">
                Your business structure can be changed later as your company grows, 
                but choosing the right structure from the start can save time and money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}