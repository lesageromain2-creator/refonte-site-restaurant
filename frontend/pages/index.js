// frontend/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, fetchDishes, fetchCategories, fetchMenus } from '../utils/api';

export default function Home() {
  const [settings, setSettings] = useState({});
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [stats, setStats] = useState({
    dishes: 0,
    categories: 0,
    menus: 0,
    rating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      animateElements();
    }
  }, [loading]);

  const loadData = async () => {
    try {
      const [settingsData, dishesData, categoriesData, menusData] = await Promise.all([
        fetchSettings(),
        fetchDishes({ limit: 6 }),
        fetchCategories({ limit: 6 }),
        fetchMenus({ limit: 3 })
      ]);

      setSettings(settingsData);
      setDishes(dishesData.dishes || []);
      setCategories(categoriesData.categories || []);
      setMenus(menusData.menus || []);
      setStats({
        dishes: dishesData.total || 0,
        categories: categoriesData.total || 0,
        menus: menusData.total || 0,
        rating: 4.8
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateElements = () => {
    // Animation hero
    anime({
      targets: '.hero-content',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      easing: 'easeOutExpo'
    });

    // Animation stats
    anime({
      targets: '.stat-card',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100, {start: 300}),
      duration: 800,
      easing: 'easeOutExpo'
    });

    // Animation cartes
    anime({
      targets: '.dish-card, .category-card, .menu-card',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(80, {start: 500}),
      duration: 600,
      easing: 'easeOutExpo'
    });
  };

  const categoryIcons = ['🥗', '🍖', '🍝', '🍟', '🍰', '🍷'];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  const siteName = settings.site_name || 'Restaurant Gourmet';
  const siteDescription = settings.site_description || 'Découvrez notre cuisine raffinée';
  const restaurantStatus = settings.restaurant_status || 'open';
  const bookingEnabled = settings.booking_enabled === '1';

  return (
    <>
      <Head>
        <title>{siteName} - Accueil</title>
        <meta name="description" content={siteDescription} />
      </Head>

      <Header settings={settings} />

      {/* Alerte */}
      {settings.show_alert === '1' && settings.alert_message && (
        <div className="alert-banner">
          <i className="bi bi-exclamation-triangle"></i>
          {settings.alert_message}
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {settings.site_logo && (
            <img 
              src={`/uploads/logos/${settings.site_logo}`}
              alt={siteName}
              className="hero-logo"
            />
          )}
          <h1 className="hero-title">🍽️ {siteName}</h1>
          <p className="hero-subtitle">{siteDescription}</p>
          
          <div className="hero-buttons">
            <Link href="/categories">
              <a className="btn-hero btn-hero-primary">Découvrir notre carte</a>
            </Link>
            {bookingEnabled && restaurantStatus === 'open' ? (
              <Link href="/reservation">
                <a className="btn-hero btn-hero-secondary">Réserver une table</a>
              </Link>
            ) : (
              <span className="btn-hero btn-hero-secondary disabled">
                Réservations fermées
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon">🍴</div>
            <div className="stat-number">{stats.dishes}</div>
            <div className="stat-label">Plats au menu</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-number">{stats.categories}</div>
            <div className="stat-label">Catégories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">{stats.menus}</div>
            <div className="stat-label">Menus</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{stats.rating}</div>
            <div className="stat-label">Note moyenne</div>
          </div>
        </div>

        {/* Categories */}
        <div className="section-header">
          <h2 className="section-title">🎨 Nos catégories</h2>
          <Link href="/categories"><a className="view-all">Voir tout →</a></Link>
        </div>
        
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link href={`/categories?cat=${cat.id_category}`} key={cat.id_category}>
              <a className="category-card">
                <div className="category-icon">
                  {categoryIcons[index % categoryIcons.length]}
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">
                  {cat.dish_count} plat{cat.dish_count > 1 ? 's' : ''}
                </div>
              </a>
            </Link>
          ))}
        </div>

        {/* Latest Dishes */}
        <div className="section-header">
          <h2 className="section-title">🔥 Nos spécialités</h2>
          <Link href="/categories"><a className="view-all">Voir tout →</a></Link>
        </div>
        
        <div className="dishes-grid">
          {dishes.map(dish => (
            <div key={dish.id_dish} className="dish-card">
              {dish.image ? (
                <img src={dish.image} alt={dish.name} className="dish-image" />
              ) : (
                <div className="dish-image dish-placeholder">🍽️</div>
              )}
              
              <div className="dish-body">
                {dish.category_name && (
                  <span className="dish-category">{dish.category_name}</span>
                )}
                <h3 className="dish-name">{dish.name}</h3>
                {dish.description && (
                  <p className="dish-description">
                    {dish.description.substring(0, 120)}
                    {dish.description.length > 120 ? '...' : ''}
                  </p>
                )}
                {dish.allergens && (
                  <div className="dish-allergens">
                    ⚠️ Allergènes: {dish.allergens}
                  </div>
                )}
                <div className="dish-footer">
                  <div className="dish-price">{dish.price.toFixed(2)}€</div>
                  <button className="btn-order">Commander</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2 className="cta-title">🎉 Réservez votre table dès maintenant</h2>
          <p className="cta-description">
            Vivez une expérience culinaire inoubliable dans notre restaurant
          </p>
          <div className="cta-buttons">
            <Link href="/reservation">
              <a className="btn-cta btn-cta-primary">Réserver maintenant</a>
            </Link>
            <Link href="/categories">
              <a className="btn-cta btn-cta-secondary">Découvrir la carte</a>
            </Link>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f5f7fa;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 4px solid #ecf0f1;
          border-top: 4px solid #e74c3c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hero-section {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
          border-radius: 10px;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-logo {
          max-width: 150px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        }

        .hero-title {
          font-size: 3.5em;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .hero-subtitle {
          font-size: 1.4em;
          margin-bottom: 40px;
          opacity: 0.95;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-hero {
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 1.1em;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
          border: 2px solid white;
        }

        .btn-hero-primary {
          background: white;
          color: #e74c3c;
        }

        .btn-hero-secondary {
          background: transparent;
          color: white;
        }

        .btn-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .btn-hero.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 50px 20px;
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
          margin-top: -50px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 3em;
          margin-bottom: 15px;
        }

        .stat-number {
          font-size: 2.5em;
          font-weight: bold;
          color: #e74c3c;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #7f8c8d;
          font-size: 1em;
          font-weight: 600;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .section-title {
          font-size: 2.5em;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .view-all {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1em;
          transition: color 0.3s;
        }

        .view-all:hover {
          color: #c0392b;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 25px;
          margin-bottom: 60px;
        }

        .category-card {
          background: white;
          padding: 35px;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 3px 15px rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .category-icon {
          font-size: 4em;
          margin-bottom: 15px;
        }

        .category-name {
          font-size: 1.4em;
          font-weight: 700;
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .category-count {
          color: #7f8c8d;
          font-size: 0.95em;
        }

        .dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .dish-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0,0,0,0.1);
          transition: all 0.3s;
          cursor: pointer;
        }

        .dish-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 35px rgba(0,0,0,0.2);
        }

        .dish-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }

        .dish-placeholder {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 4em;
        }

        .dish-body {
          padding: 25px;
        }

        .dish-category {
          display: inline-block;
          padding: 6px 14px;
          background: #ffe8e6;
          color: #e74c3c;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .dish-name {
          font-size: 1.6em;
          margin-bottom: 12px;
          color: #2c3e50;
          font-weight: 700;
        }

        .dish-description {
          color: #666;
          line-height: 1.7;
          margin-bottom: 18px;
          font-size: 0.95em;
        }

        .dish-allergens {
          background: #fff3cd;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.85em;
          color: #856404;
          margin-bottom: 15px;
        }

        .dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 2px solid #ecf0f1;
        }

        .dish-price {
          font-size: 2em;
          font-weight: bold;
          color: #27ae60;
        }

        .btn-order {
          padding: 12px 25px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-order:hover {
          background: #c0392b;
        }

        .cta-section {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 70px 40px;
          border-radius: 25px;
          text-align: center;
          margin-bottom: 60px;
          box-shadow: 0 10px 40px rgba(231, 76, 60, 0.3);
        }

        .cta-title {
          font-size: 2.8em;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .cta-description {
          font-size: 1.3em;
          margin-bottom: 35px;
          opacity: 0.95;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta {
          padding: 18px 45px;
          border-radius: 50px;
          font-size: 1.2em;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
        }

        .btn-cta-primary {
          background: white;
          color: #e74c3c;
        }

        .btn-cta-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2em;
          }
          .hero-subtitle {
            font-size: 1.1em;
          }
          .dishes-grid,
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 1.8em;
          }
          .stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}