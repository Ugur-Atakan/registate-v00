import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('welcome.emailRequired'));
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists in Firestore, redirect to login with incomplete check flag
        navigate('/login', { 
          state: { 
            email: normalizedEmail,
            checkIncomplete: true 
          },
          replace: true 
        });
      } else {
        // User doesn't exist, redirect to signup
        navigate('/signup', { 
          state: { email: normalizedEmail },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-email')) {
          toast.error(t('welcome.invalidEmail'));
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
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
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12"
            />
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {t('welcome.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('welcome.subtitle')}
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-6">
            <div className="relative">
              <Mail 
                className="absolute left-3 top-3.5 text-gray-400" 
                size={20} 
              />
              <input
                type="email"
                className="input-field pl-10"
                placeholder={t('welcome.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : t('welcome.continue')}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-image-side">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
          alt="Business"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}