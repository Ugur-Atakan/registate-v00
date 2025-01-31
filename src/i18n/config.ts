import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translations: {
        welcome: {
          title: 'Welcome to Registate',
          subtitle: 'Your gateway to establishing your business in the United States',
          emailPlaceholder: 'Enter your email address',
          continue: 'Continue',
          emailRequired: 'Email is required',
          invalidEmail: 'Please enter a valid email'
        },
        auth: {
          signup: {
            title: 'Create your account',
            firstName: 'First Name',
            lastName: 'Last Name',
            password: 'Password',
            submit: 'Create Account',
            passwordRequirements: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
          },
          login: {
            title: 'Welcome back',
            password: 'Password',
            submit: 'Sign In',
            forgotPassword: 'Forgot Password?'
          }
        }
      }
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});