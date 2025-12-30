// frontend/pages/reservation.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, createReservation, checkAuth } from '../utils/api';

export default function Reservation() {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    reservation_date: '',
    reservation_time: '',
    number_of_people: 2,
    special_requests: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
    animateForm();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, authData] = await Promise.all([
        fetchSettings(),
        checkAuth()
      ]);

      setSettings(settingsData);
      
      if (authData.authenticated) {
        setUser(authData.user);
      }

      // Définir la date minimum (aujourd'hui)
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({...prev, reservation_date: today}));

    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const animateForm = () => {
    anime({
      targets: '.reservation-form',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo'
    });

    anime({
      targets: '.form-section',
      opacity: [0, 1],
      translateX: [-20, 0],
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
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.reservation_date) {
      newErrors.push('La date est requise');
    }
    
    if (!formData.reservation_time) {
      newErrors.push('L\'heure est requise');
    }
    
    if (formData.number_of_people < 1 || formData.number_of_people > 20) {
      newErrors.push('Le nombre de personnes doit être entre 1 et 20');
    }

    // Vérifier que la date est future
    const reservationDateTime = new Date(`${formData.reservation_date}T${formData.reservation_time}`);
    if (reservationDateTime < new Date()) {
      newErrors.push('La date et l\'heure doivent être dans le futur');
    }

    // Vérifier les horaires
    const [hour, minute] = formData.reservation_time.split(':').map(Number);
    const timeInMinutes = hour * 60 + minute;
    
    const lunchStart = 12 * 60;
    const lunchEnd = 14 * 60 + 30;
    const dinnerStart = 19 * 60;
    const dinnerEnd = 22 * 60 + 30;

    const isLunchTime = timeInMinutes >= lunchStart && timeInMinutes <= lunchEnd;
    const isDinnerTime = timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd;

    if (!isLunchTime && !isDinnerTime) {
      newErrors.push('Horaires disponibles : 12h00-14h30 et 19h00-22h30');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      router.push('/login?redirect=/reservation');
      return;
    }

    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      shakeForm();
      return;
    }

    setLoading(true);

    try {
      await createReservation(formData);
      
      setSuccess(true);
      
      // Animation de succès
      anime({
        targets: '.success-message',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutExpo'
      });

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      setErrors([error.message || 'Une erreur est survenue']);
      setLoading(false);
      shakeForm();
    }
  };

  const shakeForm = () => {
    anime({
      targets: '.reservation-form',
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

  if (success) {
    return (
      <>
        <Head>
          <title>Réservation confirmée - {settings.site_name}</title>
        </Head>

        <Header settings={settings} />

        <div className="success-page">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h1>Réservation enregistrée !</h1>
            <p>Votre demande de réservation a été envoyée avec succès.</p>
            <p>Nous vous confirmerons votre réservation par email dans les plus brefs délais.</p>
            <div className="reservation-summary">
              <h3>Récapitulatif</h3>
              <p>📅 Date : {new Date(formData.reservation_date).toLocaleDateString('fr-FR')}</p>
              <p>🕐 Heure : {formData.reservation_time}</p>
              <p>👥 Personnes : {formData.number_of_people}</p>
            </div>
            <button 
              className="btn-dashboard"
              onClick={() => router.push('/dashboard')}
            >
              Voir mes réservations
            </button>
          </div>
        </div>

        <Footer settings={settings} />

        <style jsx>{`
          .success-page {
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
          }

          .success-message {
            background: white;
            padding: 60px 40px;
            border-radius: 25px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            opacity: 0;
          }

          .success-icon {
            font-size: 6em;
            margin-bottom: 20px;
            animation: bounce 1s infinite;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          .success-message h1 {
            font-size: 2.5em;
            color: #27ae60;
            margin-bottom: 20px;
            font-weight: 800;
          }

          .success-message p {
            font-size: 1.2em;
            color: #666;
            line-height: 1.7;
            margin-bottom: 15px;
          }

          .reservation-summary {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            text-align: left;
          }

          .reservation-summary h3 {
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
          }

          .reservation-summary p {
            font-size: 1.1em;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 600;
          }

          .btn-dashboard {
            padding: 18px 40px;
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1.1em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
          }

          .btn-dashboard:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(39, 174, 96, 0.4);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Réserver une table - {settings.site_name || 'Restaurant'}</title>
      </Head>

      <Header settings={settings} />

      <div className="reservation-page">
        <section className="page-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>📅 Réserver une table</h1>
            <p>Réservez votre table en quelques clics</p>
          </div>
        </section>

        <div className="container">
          <div className="reservation-container">
            {/* Informations */}
            <div className="info-sidebar">
              <div className="info-card">
                <h3>🕐 Horaires d'ouverture</h3>
                <div className="info-item">
                  <strong>Déjeuner</strong>
                  <p>12h00 - 14h30</p>
                </div>
                <div className="info-item">
                  <strong>Dîner</strong>
                  <p>19h00 - 22h30</p>
                </div>
                <div className="info-item">
                  <strong>Dimanche</strong>
                  <p>Fermé</p>
                </div>
              </div>

              <div className="info-card">
                <h3>📞 Contact</h3>
                {settings.site_phone && (
                  <div className="info-item">
                    <strong>Téléphone</strong>
                    <p>{settings.site_phone}</p>
                  </div>
                )}
                {settings.site_email && (
                  <div className="info-item">
                    <strong>Email</strong>
                    <p>{settings.site_email}</p>
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>ℹ️ Informations</h3>
                <ul className="info-list">
                  <li>✓ Réservation confirmée par email</li>
                  <li>✓ Annulation gratuite jusqu'à 2h avant</li>
                  <li>✓ Maximum 20 personnes par réservation</li>
                  <li>✓ Délai de retard maximum: 15 minutes</li>
                </ul>
              </div>
            </div>

            {/* Formulaire */}
            <div className="reservation-form">
              <h2>Formulaire de réservation</h2>

              {!user && (
                <div className="auth-notice">
                  <i className="bi bi-info-circle"></i>
                  <p>
                    Vous devez être connecté pour réserver. 
                    <a href="/login?redirect=/reservation"> Se connecter</a>
                  </p>
                </div>
              )}

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
                <div className="form-section">
                  <h3>📅 Date et heure</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reservation_date">Date de réservation</label>
                      <input
                        type="date"
                        id="reservation_date"
                        name="reservation_date"
                        value={formData.reservation_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={loading || !user}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reservation_time">Heure</label>
                      <select
                        id="reservation_time"
                        name="reservation_time"
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required
                        disabled={loading || !user}
                      >
                        <option value="">Choisir...</option>
                        <optgroup label="Déjeuner (12h-14h30)">
                          <option value="12:00">12:00</option>
                          <option value="12:30">12:30</option>
                          <option value="13:00">13:00</option>
                          <option value="13:30">13:30</option>
                          <option value="14:00">14:00</option>
                        </optgroup>
                        <optgroup label="Dîner (19h-22h30)">
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                          <option value="20:30">20:30</option>
                          <option value="21:00">21:00</option>
                          <option value="21:30">21:30</option>
                          <option value="22:00">22:00</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>👥 Nombre de personnes</h3>
                  
                  <div className="people-selector">
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() => setFormData({...formData, number_of_people: Math.max(1, formData.number_of_people - 1)})}
                      disabled={loading || !user || formData.number_of_people <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="number_of_people"
                      value={formData.number_of_people}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      required
                      disabled={loading || !user}
                      className="people-input"
                    />
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() => setFormData({...formData, number_of_people: Math.min(20, formData.number_of_people + 1)})}
                      disabled={loading || !user || formData.number_of_people >= 20}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-section">
                  <h3>💬 Demandes spéciales</h3>
                  
                  <div className="form-group">
                    <label htmlFor="special_requests">
                      Allergies, régimes alimentaires, occasion spéciale...
                    </label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Ex: Allergie aux fruits à coque, anniversaire, chaise haute..."
                      disabled={loading || !user}
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading || !user}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check"></i>
                      Réserver ma table
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .reservation-page {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .page-hero {
          height: 300px;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
          background-size: cover;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3.5em;
          margin-bottom: 15px;
          font-weight: 800;
        }

        .hero-content p {
          font-size: 1.4em;
          opacity: 0.95;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 50px 20px;
        }

        .reservation-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
        }

        .info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .info-card h3 {
          font-size: 1.5em;
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .info-item {
          margin-bottom: 20px;
        }

        .info-item strong {
          display: block;
          color: #e74c3c;
          font-size: 1em;
          margin-bottom: 5px;
        }

        .info-item p {
          color: #7f8c8d;
          font-size: 1.1em;
        }

        .info-list {
          list-style: none;
          padding: 0;
        }

        .info-list li {
          padding: 10px 0;
          color: #7f8c8d;
          border-bottom: 1px solid #ecf0f1;
        }

        .info-list li:last-child {
          border-bottom: none;
        }

        .reservation-form {
          background: white;
          padding: 50px;
          border-radius: 25px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          opacity: 0;
        }

        .reservation-form h2 {
          font-size: 2.5em;
          color: #2c3e50;
          margin-bottom: 30px;
          font-weight: 800;
        }

        .auth-notice {
          background: #e3f2fd;
          border: 2px solid #2196f3;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .auth-notice i {
          font-size: 1.5em;
          color: #2196f3;
        }

        .auth-notice p {
          margin: 0;
          color: #1976d2;
          font-weight: 600;
        }

        .auth-notice a {
          color: #1565c0;
          text-decoration: underline;
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

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #ecf0f1;
          opacity: 0;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h3 {
          font-size: 1.5em;
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          color: #2c3e50;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #ecf0f1;
          border-radius: 12px;
          font-size: 1em;
          transition: all 0.3s;
          background: #f8f9fa;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e74c3c;
          background: white;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .people-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .btn-counter {
          width: 60px;
          height: 60px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 2em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-counter:hover:not(:disabled) {
          background: #c0392b;
          transform: scale(1.1);
        }

        .btn-counter:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .people-input {
          width: 100px;
          text-align: center;
          font-size: 2em;
          font-weight: bold;
          color: #2c3e50;
        }

        .btn-submit {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.2em;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(231, 76, 60, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
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

        @media (max-width: 1024px) {
          .reservation-container {
            grid-template-columns: 1fr;
          }

          .info-sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5em;
          }

          .reservation-form {
            padding: 30px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .people-selector {
            padding: 20px;
          }

          .btn-counter {
            width: 50px;
            height: 50px;
            font-size: 1.5em;
          }

          .people-input {
            width: 80px;
            font-size: 1.5em;
          }
        }
      `}</style>
    </>
  );
}