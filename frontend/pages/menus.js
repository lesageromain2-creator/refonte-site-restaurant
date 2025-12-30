// frontend/pages/menus.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, fetchMenus, fetchMenuById } from '../utils/api';

export default function Menus() {
  const router = useRouter();
  const { id } = router.query;

  const [settings, setSettings] = useState({});
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      animateElements();
    }
  }, [loading]);

  const loadData = async () => {
    try {
      const settingsData = await fetchSettings();
      setSettings(settingsData);

      if (id) {
        // Charger un menu spécifique
        const menuData = await fetchMenuById(id);
        setSelectedMenu(menuData);
      } else {
        // Charger tous les menus
        const menusData = await fetchMenus();
        setMenus(menusData.menus || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateElements = () => {
    if (selectedMenu) {
      anime({
        targets: '.menu-detail',
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 800,
        easing: 'easeOutExpo'
      });

      anime({
        targets: '.dish-item',
        opacity: [0, 1],
        translateX: [-30, 0],
        delay: anime.stagger(100, {start: 300}),
        duration: 600,
        easing: 'easeOutExpo'
      });
    } else {
      anime({
        targets: '.menu-card',
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  };

  const groupDishesByCourse = (dishes) => {
    const grouped = {};
    dishes.forEach(dish => {
      const courseType = dish.course_type || 'Autres';
      if (!grouped[courseType]) {
        grouped[courseType] = [];
      }
      grouped[courseType].push(dish);
    });
    return grouped;
  };

  const courseIcons = {
    'Entrée': '🥗',
    'Plat': '🍖',
    'Dessert': '🍰',
    'Fromage': '🧀',
    'Boisson': '🍷'
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement des menus...</p>
      </div>
    );
  }

  // Affichage détail d'un menu
  if (selectedMenu) {
    const groupedDishes = selectedMenu.dishes ? groupDishesByCourse(selectedMenu.dishes) : {};

    return (
      <>
        <Head>
          <title>{selectedMenu.title} - {settings.site_name || 'Restaurant'}</title>
        </Head>

        <Header settings={settings} />

        <div className="menus-page">
          <section className="page-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>📋 {selectedMenu.title}</h1>
              <p>{selectedMenu.description}</p>
            </div>
          </section>

          <div className="container">
            <button 
              className="back-button"
              onClick={() => router.push('/menus')}
            >
              <i className="bi bi-arrow-left"></i> Retour aux menus
            </button>

            <div className="menu-detail">
              {selectedMenu.image && (
                <div className="menu-image-container">
                  <img src={selectedMenu.image} alt={selectedMenu.title} />
                </div>
              )}

              <div className="menu-info">
                <div className="menu-price-large">
                  {selectedMenu.price.toFixed(2)}€
                  <span>par personne</span>
                </div>

                {selectedMenu.available_date && (
                  <div className="menu-availability">
                    📅 Disponible jusqu'au {new Date(selectedMenu.available_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>

              {Object.keys(groupedDishes).length > 0 ? (
                <div className="menu-courses">
                  {Object.entries(groupedDishes).map(([courseType, dishes]) => (
                    <div key={courseType} className="course-section">
                      <h2 className="course-title">
                        {courseIcons[courseType] || '🍴'} {courseType}
                      </h2>
                      <div className="dishes-list">
                        {dishes.map((dish) => (
                          <div key={dish.id_dish} className="dish-item">
                            <div className="dish-info">
                              <h3>{dish.name}</h3>
                              {dish.description && (
                                <p>{dish.description}</p>
                              )}
                              {dish.allergens && (
                                <span className="dish-allergens">
                                  ⚠️ {dish.allergens}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-dishes-info">
                  <p>Les plats de ce menu seront bientôt disponibles.</p>
                </div>
              )}

              <div className="menu-actions">
                <button 
                  className="btn-reserve"
                  onClick={() => router.push('/reservation')}
                >
                  <i className="bi bi-calendar-check"></i>
                  Réserver ce menu
                </button>
              </div>
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
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .menus-page {
            min-height: 100vh;
            background: #f5f7fa;
          }

          .page-hero {
            height: 300px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
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
            max-width: 800px;
            padding: 0 20px;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 50px 20px;
          }

          .back-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 25px;
            background: white;
            border: 2px solid #ecf0f1;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 30px;
          }

          .back-button:hover {
            background: #3498db;
            color: white;
            border-color: #3498db;
            transform: translateX(-5px);
          }

          .menu-detail {
            background: white;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            opacity: 0;
          }

          .menu-image-container {
            width: 100%;
            height: 400px;
            overflow: hidden;
          }

          .menu-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .menu-info {
            padding: 40px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .menu-price-large {
            font-size: 3.5em;
            font-weight: 800;
            display: flex;
            flex-direction: column;
          }

          .menu-price-large span {
            font-size: 0.3em;
            font-weight: 400;
            opacity: 0.9;
          }

          .menu-availability {
            background: rgba(255,255,255,0.2);
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 1.1em;
          }

          .menu-courses {
            padding: 50px 40px;
          }

          .course-section {
            margin-bottom: 50px;
          }

          .course-title {
            font-size: 2.2em;
            color: #2c3e50;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #3498db;
            font-weight: 800;
          }

          .dishes-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .dish-item {
            padding: 25px;
            background: #f8f9fa;
            border-radius: 15px;
            border-left: 5px solid #3498db;
            transition: all 0.3s;
            opacity: 0;
          }

          .dish-item:hover {
            transform: translateX(10px);
            box-shadow: 0 5px 20px rgba(52, 152, 219, 0.2);
          }

          .dish-info h3 {
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 700;
          }

          .dish-info p {
            color: #7f8c8d;
            line-height: 1.7;
            margin-bottom: 10px;
          }

          .dish-allergens {
            display: inline-block;
            padding: 6px 12px;
            background: #fff3cd;
            color: #856404;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
          }

          .no-dishes-info {
            padding: 100px 40px;
            text-align: center;
            color: #7f8c8d;
            font-size: 1.2em;
          }

          .menu-actions {
            padding: 40px;
            background: #f8f9fa;
            text-align: center;
          }

          .btn-reserve {
            padding: 20px 50px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1.3em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 12px;
          }

          .btn-reserve:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4);
          }

          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 2.5em;
            }

            .menu-info {
              flex-direction: column;
              gap: 20px;
              text-align: center;
            }

            .menu-price-large {
              font-size: 2.5em;
            }

            .menu-courses {
              padding: 30px 20px;
            }

            .course-title {
              font-size: 1.8em;
            }

            .dish-item {
              padding: 20px;
            }

            .menu-actions {
              padding: 30px 20px;
            }

            .btn-reserve {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </>
    );
  }

  // Affichage liste des menus
  return (
    <>
      <Head>
        <title>Nos Menus - {settings.site_name || 'Restaurant'}</title>
        <meta name="description" content="Découvrez nos menus" />
      </Head>

      <Header settings={settings} />

      <div className="menus-page">
        <section className="page-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>📋 Nos Menus</h1>
            <p>Des expériences culinaires complètes</p>
          </div>
        </section>

        <div className="container">
          {menus.length > 0 ? (
            <div className="menus-grid">
              {menus.map((menu) => (
                <div 
                  key={menu.id_menu} 
                  className="menu-card"
                  onClick={() => router.push(`/menus?id=${menu.id_menu}`)}
                >
                  {menu.image ? (
                    <img src={menu.image} alt={menu.title} className="menu-image" />
                  ) : (
                    <div className="menu-image menu-placeholder">📋</div>
                  )}

                  <div className="menu-body">
                    <h3 className="menu-title">{menu.title}</h3>

                    {menu.description && (
                      <p className="menu-description">{menu.description}</p>
                    )}

                    {menu.available_date && (
                      <div className="menu-availability">
                        📅 Jusqu'au {new Date(menu.available_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}

                    <div className="menu-footer">
                      <div className="menu-price">{menu.price.toFixed(2)}€</div>
                      <button className="btn-view-menu">
                        Voir détails <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-menus">
              <div className="no-menus-icon">📋</div>
              <h3>Aucun menu disponible</h3>
              <p>Nos menus seront bientôt disponibles.</p>
            </div>
          )}
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
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .menus-page {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .page-hero {
          height: 300px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
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

        .menus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 30px;
        }

        .menu-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: all 0.3s;
          cursor: pointer;
          opacity: 0;
        }

        .menu-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }

        .menu-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .menu-placeholder {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 5em;
        }

        .menu-body {
          padding: 30px;
        }

        .menu-title {
          font-size: 1.8em;
          margin-bottom: 15px;
          color: #2c3e50;
          font-weight: 700;
        }

        .menu-description {
          color: #666;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .menu-availability {
          background: #e3f2fd;
          padding: 10px 15px;
          border-radius: 10px;
          font-size: 0.9em;
          color: #1976d2;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .menu-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 2px solid #ecf0f1;
        }

        .menu-price {
          font-size: 2.2em;
          font-weight: bold;
          color: #27ae60;
        }

        .btn-view-menu {
          padding: 12px 30px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-view-menu:hover {
          background: #2980b9;
          transform: scale(1.05);
        }

        .no-menus {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .no-menus-icon {
          font-size: 5em;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-menus h3 {
          font-size: 2em;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .no-menus p {
          color: #7f8c8d;
          font-size: 1.1em;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5em;
          }

          .menus-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}