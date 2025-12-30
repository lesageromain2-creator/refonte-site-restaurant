// frontend/pages/register.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { register, fetchSettings } from '../utils/api';

export default function Register() {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadSettings();
    animateForm();
  }, []);

  useEffect(() => {
    // Calculer la force du mot de passe
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

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
      targets: '.register-card',
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 800,
      easing: 'easeOutExpo'
    });

    anime({
      targets: '.form-group',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(80, {start: 300}),
      duration: 600,
      easing: 'easeOutExpo'
    });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#e74c3c';
    if (passwordStrength < 60) return '#f39c12';
    if (passwordStrength < 80) return '#3498db';
    return '#27ae60';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Faible';
    if (passwordStrength < 60) return 'Moyen';
    if (passwordStrength < 80) return 'Bon';
    return 'Excellent';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstname.trim()) {
      newErrors.push('Le prénom est requis');
    }
    if (!formData.lastname.trim()) {
      newErrors.push('Le nom est requis');
    }
    if (!formData.email.trim()) {
      newErrors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('L\'email n\'est pas valide');
    }
    if (!formData.password) {
      newErrors.push('Le mot de passe est requis');
    } else if (formData.password.length < 6) {
      newErrors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Les mots de passe ne correspondent pas');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      shakeForm();
      return;
    }

    setLoading(true);

    try {
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });

      // Animation de succès
      anime({
        targets: '.register-card',
        scale: [1, 1.05, 0.95],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInExpo',
        complete: () => {
          router.push('/dashboard');
        }
      });
    } catch (error) {
      setErrors([error.message || 'Une erreur est survenue lors de l\'inscription']);
      setLoading(false);
      shakeForm();
    }
  };

  const shakeForm = () => {
    anime({
      targets: '.register-card',
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
        <title>Inscription - {settings.site_name || 'Restaurant'}</title>
      </Head>

      <Header settings={settings} />

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">✨</div>
            <h1>Créer un compte</h1>
            <p>Rejoignez notre communauté gastronomique</p>
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">
                  <i className="bi bi-person"></i> Prénom
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">
                  <i className="bi bi-person"></i> Nom
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                  disabled={loading}
                />
              </div>
            </div>

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
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        background: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="bi bi-lock-fill"></i> Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="terms">
              <label>
                <input type="checkbox" required disabled={loading} />
                <span>
                  J'accepte les <Link href="/terms"><a>conditions d'utilisation</a></Link> et 
                  la <Link href="/privacy"><a>politique de confidentialité</a></Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Création en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus"></i>
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>Vous avez déjà un compte ?</p>
            <Link href="/login">
              <a className="login-link">
                Se connecter <i className="bi bi-arrow-right"></i>
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
        .register-container {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(255,255,255,0.1);
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 400px;
          height: 400px;
          top: -150px;
          right: -150px;
        }

        .circle-2 {
          width: 250px;
          height: 250px;
          bottom: -80px;
          left: -80px;
          animation-delay: -5s;
        }

        .circle-3 {
          width: 180px;
          height: 180px;
          top: 40%;
          left: 15%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .register-card {
          background: white;
          border-radius: 25px;
          padding: 50px 40px;
          max-width: 580px;
          width: 100%;
          box-shadow: 0 25px 70px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
          opacity: 0;
        }

        .register-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-icon {
          font-size: 4em;
          margin-bottom: 20px;
          animation: rotate 3s infinite ease-in-out;
        }

        @keyframes rotate {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(360deg);
          }
        }

        .register-header h1 {
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 10px;
          font-weight: 800;
        }

        .register-header p {
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
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
          color: #667eea;
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
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
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
          color: #667eea;
        }

        .password-strength {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .strength-bar {
          flex: 1;
          height: 8px;
          background: #ecf0f1;
          border-radius: 10px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s;
          border-radius: 10px;
        }

        .password-strength span {
          font-size: 0.9em;
          font-weight: 600;
          min-width: 70px;
        }

        .terms {
          margin-bottom: 25px;
          font-size: 0.95em;
        }

        .terms label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          color: #7f8c8d;
        }

        .terms input {
          margin-top: 4px;
          cursor: pointer;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .terms a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .terms a:hover {
          text-decoration: underline;
        }

        .btn-submit {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
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

        .register-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #ecf0f1;
        }

        .register-footer p {
          color: #7f8c8d;
          margin-bottom: 15px;
          font-size: 1em;
        }

        .login-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #667eea;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1em;
          transition: all 0.3s;
        }

        .login-link:hover {
          gap: 12px;
          color: #764ba2;
        }

        @media (max-width: 768px) {
          .register-card {
            padding: 40px 30px;
          }

          .register-header h1 {
            font-size: 2em;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 30px 20px;
          }

          .register-header h1 {
            font-size: 1.8em;
          }

          .register-icon {
            font-size: 3em;
          }
        }
      `}</style>
    </>
  );
}