// frontend/pages/categories.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import anime from 'animejs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, fetchCategories, fetchDishes, fetchDishesByCategory } from '../utils/api';

export default function Categories() {
  const router = useRouter();
  const { cat } = router.query;

  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [cat]);

  useEffect(() => {
    if (!loading) {
      animateElements();
    }
  }, [loading]);

  const loadData = async () => {
    try {
      const [settingsData, categoriesData] = await Promise.all([
        fetchSettings(),
        fetchCategories()
      ]);

      setSettings(settingsData);
      setCategories(categoriesData.categories || []);

      // Si une catégorie est sélectionnée
      if (cat) {
        const dishesData = await fetchDishesByCategory(cat);
        setDishes(dishesData.dishes || []);
        const category = categoriesData.categories.find(c => c.id_category == cat);
        setSelectedCategory(category);
      } else {
        const dishesData = await fetchDishes({ limit: 100 });
        setDishes(dishesData.dishes || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateElements = () => {
    anime({
      targets: '.category-filter-btn',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(50),
      duration: 600,
      easing: 'easeOutExpo'
    });

    anime({
      targets: '.dish-card',
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: anime.stagger(80, {start: 300}),
      duration: 600,
      easing: 'easeOutExpo'
    });
  };

  const handleCategoryClick = (categoryId) => {
    router.push(categoryId ? `/categories?cat=${categoryId}` : '/categories');
  };

  const categoryIcons = {
    'Entrées': '🥗',
    'Plats': '🍖',
    'Desserts': '🍰',
    'Boissons': '🍷',
    'Poissons': '🐟',
    'Viandes': '🥩'
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notre Carte - {settings.site_name || 'Restaurant'}</title>
        <meta name="description" content="Découvrez tous nos plats" />
      </Head>

      <Header settings={settings} />

      <div className="categories-page">
        {/* Hero */}
        <section className="page-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>🍽️ Notre Carte</h1>
            <p>Découvrez notre sélection de plats raffinés</p>
          </div>
        </section>

        <div className="container">
          {/* Filtres de catégories */}
          <div className="category-filters">
            <button
              className={`category-filter-btn ${!cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              <span className="filter-icon">🎯</span>
              Tout voir
            </button>
            {categories.map((category) => (
              <button
                key={category.id_category}
                className={`category-filter-btn ${cat == category.id_category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id_category)}
              >
                <span className="filter-icon">
                  {categoryIcons[category.name] || '🍴'}
                </span>
                {category.name}
                <span className="filter-count">{category.dish_count}</span>
              </button>
            ))}
          </div>

          {/* En-tête de la section */}
          <div className="section-header">
            <h2>
              {selectedCategory 
                ? `${categoryIcons[selectedCategory.name] || '🍴'} ${selectedCategory.name}` 
                : '🌟 Tous nos plats'}
            </h2>
            <p className="dishes-count">{dishes.length} plat{dishes.length > 1 ? 's' : ''}</p>
          </div>

          {/* Grille de plats */}
          {dishes.length > 0 ? (
            <div className="dishes-grid">
              {dishes.map((dish) => (
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
                      <p className="dish-description">{dish.description}</p>
                    )}

                    {dish.allergens && settings.show_allergens === '1' && (
                      <div className="dish-allergens">
                        ⚠️ Allergènes: {dish.allergens}
                      </div>
                    )}

                    <div className="dish-footer">
                      {settings.show_prices === '1' && (
                        <div className="dish-price">{dish.price.toFixed(2)}€</div>
                      )}
                      <button 
                        className="btn-order"
                        onClick={() => alert('Réservez une table pour commander ce plat !')}
                      >
                        <i className="bi bi-cart-plus"></i>
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-dishes">
              <div className="no-dishes-icon">🍽️</div>
              <h3>Aucun plat disponible</h3>
              <p>Cette catégorie ne contient pas encore de plats.</p>
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
          border-top: 4px solid #e74c3c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .categories-page {
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

        .category-filters {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 50px;
          padding: 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .category-filter-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 25px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 50px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          color: #2c3e50;
          opacity: 0;
        }

        .category-filter-btn:hover {
          background: #e74c3c;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        }

        .category-filter-btn.active {
          background: #e74c3c;
          color: white;
          border-color: #c0392b;
        }

        .filter-icon {
          font-size: 1.3em;
        }

        .filter-count {
          padding: 3px 10px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          font-size: 0.85em;
        }

        .category-filter-btn.active .filter-count {
          background: rgba(255,255,255,0.3);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .section-header h2 {
          font-size: 2.5em;
          color: #2c3e50;
          font-weight: 800;
        }

        .dishes-count {
          color: #7f8c8d;
          font-size: 1.1em;
          font-weight: 600;
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
          opacity: 0;
        }

        .dish-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
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
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-order:hover {
          background: #c0392b;
          transform: scale(1.05);
        }

        .no-dishes {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .no-dishes-icon {
          font-size: 5em;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-dishes h3 {
          font-size: 2em;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .no-dishes p {
          color: #7f8c8d;
          font-size: 1.1em;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5em;
          }

          .category-filters {
            justify-content: center;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .section-header h2 {
            font-size: 2em;
          }

          .dishes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}