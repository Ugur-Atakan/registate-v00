import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Lock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerWithEmail } from '../http/requests';
import { saveUserTokens } from '../utils/storage';

interface LocationState {
  email: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = (location.state as LocationState) || { email: '' };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: 'length',
      label: 'At least 8 characters',
      validator: (pass) => pass.length >= 8,
      met: false
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter',
      validator: (pass) => /[A-Z]/.test(pass),
      met: false
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter',
      validator: (pass) => /[a-z]/.test(pass),
      met: false
    },
    {
      id: 'number',
      label: 'At least one number',
      validator: (pass) => /\d/.test(pass),
      met: false
    },
    {
      id: 'special',
      label: 'At least one special character',
      validator: (pass) => /[!@#$%^&*]/.test(pass),
      met: false
    }
  ]);

  useEffect(() => {
    setRequirements(prev => 
      prev.map(req => ({
        ...req,
        met: req.validator(password)
      }))
    );
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // if (!requirements.every(req => req.met)) {
    //   toast.error('Please meet all password requirements');
    //   return;
    // }

    setLoading(true);
    try {
    const register= await registerWithEmail({email, password, firstName, lastName});
    saveUserTokens(register.tokens);
      navigate('/company-formation', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      <div className="flex items-center justify-center p-4 md:p-8 bg-white overflow-auto">
        <div className="w-full max-w-md">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex-shrink-0 mb-6">
              <img
                src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
                alt="Registate"
                className="h-12"
              />
            </div>

            {/* Header */}
            <div className="flex-shrink-0 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('auth.signup.title')}
              </h1>
              <p className="text-gray-600 mt-2">{email}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
              <div className="space-y-4 flex-1">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder={t('auth.signup.firstName')}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder={t('auth.signup.lastName')}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder={t('auth.signup.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <div className="absolute right-3 top-3.5 transition-all duration-200">
                      {password === confirmPassword ? (
                        <Check className="text-green-500" size={20} />
                      ) : (
                        <X className="text-red-500" size={20} />
                      )}
                    </div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Password Requirements:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {requirements.map((req) => (
                      <div 
                        key={req.id}
                        className="flex items-center gap-2 text-sm transition-all duration-300"
                      >
                        {req.met ? (
                          <Check className="text-green-500 transition-all duration-300" size={16} />
                        ) : (
                          <X className="text-red-500 transition-all duration-300" size={16} />
                        )}
                        <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex-shrink-0"
                disabled={loading}
              >
                {loading ? 'Loading...' : t('auth.signup.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:block relative bg-[#1649FF]/5">
        <img
          src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/pexels-pixabay-162539-2.webp"
          alt="Business Setup"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}