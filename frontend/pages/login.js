// frontend/pages/login.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { login, fetchSettings } from '../utils/api';

export default function Login() {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSettings();
    animateForm();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erreur settings:', error);
    }
  };

  const animateForm = () => {
    anime({
      targets: '.login-card',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: 'easeOutExpo'
    });

    anime({
      targets: '.form-group',
      opacity: [0, 1],
      translateX: [-30, 0],
      delay: anime.stagger(100, {start: 300}),
      duration: 600,
      easing: 'easeOutExpo'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer les erreurs lors de la saisie
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Validation côté client
    const newErrors = [];
    if (!formData.email.trim()) {
      newErrors.push('L\'email est requis');
    }
    if (!formData.password) {
      newErrors.push('Le mot de passe est requis');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      shakeForm();
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // Animation de succès
      anime({
        targets: '.login-card',
        scale: [1, 0.95],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInExpo',
        complete: () => {
          router.push('/dashboard');
        }
      });
    } catch (error) {
      setErrors([error.message || 'Email ou mot de passe incorrect']);
      setLoading(false);
      shakeForm();
    }
  };

  const shakeForm = () => {
    anime({
      targets: '.login-card',
      translateX: [
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: 0, duration: 50 }
      ],
      easing: 'easeInOutSine'
    });
  };

  return (
    <>
      <Head>
        <title>Connexion - {settings.site_name || 'Restaurant'}</title>
      </Head>

      <Header settings={settings} />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Connexion</h1>
            <p>Accédez à votre espace personnel</p>
          </div>

          {errors.length > 0 && (
            <div className="error-box">
              <i className="bi bi-exclamation-circle"></i>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="bi bi-envelope"></i> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="bi bi-lock"></i> Mot de passe
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password">
                <a className="forgot-link">Mot de passe oublié ?</a>
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Connexion...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Pas encore de compte ?</p>
            <Link href="/register">
              <a className="register-link">
                Créer un compte <i className="bi bi-arrow-right"></i>
              </a>
            </Link>
          </div>
        </div>

        {/* Décoration */}
        <div className="decoration-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .login-container {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
        }

        .decoration-circles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(192, 57, 43, 0.1));
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          left: -100px;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          right: -50px;
          animation-delay: -5s;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: 10%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .login-card {
          background: white;
          border-radius: 25px;
          padding: 50px 40px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          position: relative;
          z-index: 1;
          opacity: 0;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          font-size: 4em;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .login-header h1 {
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 10px;
          font-weight: 800;
        }

        .login-header p {
          color: #7f8c8d;
          font-size: 1.1em;
        }

        .error-box {
          background: #fee;
          border: 2px solid #fcc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
          animation: slideDown 0.3s ease;
        }

        .error-box i {
          color: #e74c3c;
          font-size: 1.2em;
          margin-right: 10px;
        }

        .error-box ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .error-box li {
          color: #c0392b;
          font-weight: 600;
          margin-bottom: 5px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group {
          margin-bottom: 25px;
          opacity: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          color: #2c3e50;
          font-weight: 600;
          font-size: 1em;
        }

        .form-group label i {
          margin-right: 8px;
          color: #e74c3c;
        }

        .form-group input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #ecf0f1;
          border-radius: 12px;
          font-size: 1em;
          transition: all 0.3s;
          background: #f8f9fa;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e74c3c;
          background: white;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-input {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
          font-size: 1.2em;
          padding: 5px;
          transition: color 0.3s;
        }

        .toggle-password:hover {
          color: #e74c3c;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          font-size: 0.95em;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #7f8c8d;
        }

        .remember-me input {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }

        .forgot-link {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .forgot-link:hover {
          color: #c0392b;
          text-decoration: underline;
        }

        .btn-submit {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1em;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #ecf0f1;
        }

        .login-footer p {
          color: #7f8c8d;
          margin-bottom: 15px;
          font-size: 1em;
        }

        .register-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e74c3c;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1em;
          transition: all 0.3s;
        }

        .register-link:hover {
          gap: 12px;
          color: #c0392b;
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 40px 30px;
          }

          .login-header h1 {
            font-size: 2em;
          }

          .form-options {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 1.8em;
          }

          .login-icon {
            font-size: 3em;
          }
        }
      `}</style>
    </>
  );
}