import Lottie from "lottie-react";
import companyAnimation from './companyAnimation.json';

export const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="p-6 shadow-lg rounded-2xl bg-white flex flex-col items-center">
        <Lottie animationData={companyAnimation} className="w-48 h-48" />
        <p className="mt-4 text-xl font-semibold text-blue-600 animate-pulse">
          Registate ®, {'\n'} Company Formation in USA
        </p>
      </div>
    </div>
  );
}

export default LoadingComponent;
