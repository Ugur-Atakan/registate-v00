import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginWithEmail } from '../http/requests';
import { useAppDispatch } from '../store/hooks';
import { setUserData } from '../store/slices/userSlice';
import { setCompanies } from '../store/slices/companySlice';
import { saveUserTokens } from '../utils/storage';

interface LocationState {
  email: string;
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = (location.state as LocationState) || { email: '' };
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    try {
     const login= await loginWithEmail(email, password);
      dispatch(setUserData(login.user));
      if(login.user&&login.user.companies){
      dispatch(setCompanies(login.user.companies));
      
      saveUserTokens(login.tokens);
     }
     if(login.user.roles.includes('ADMIN')){
      navigate('/admin', { replace: true });
     }else{
     navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <img
              src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {t('auth.login.title')}
            </h1>
            <p className="text-gray-600 mt-2">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                className="input-field pl-10"
                placeholder={t('auth.login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : t('auth.login.submit')}
            </button>

            <p className="text-center">
              <button
                type="button"
                className="text-primary hover:text-hover-text"
                onClick={() => navigate('/forgot-password')}
              >
                {t('auth.login.forgotPassword')}
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-image-side">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80"
          alt="Business Professional"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}