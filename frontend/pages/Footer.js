// frontend/components/Footer.js
import Link from 'next/link';
import { useEffect } from 'react';
import anime from 'animejs';

export default function Footer({ settings }) {
  useEffect(() => {
    // Animation au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.footer-section',
              opacity: [0, 1],
              translateY: [30, 0],
              delay: anime.stagger(100),
              duration: 800,
              easing: 'easeOutExpo'
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector('.site-footer');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const siteName = settings.site_name || 'Restaurant Gourmet';
  const sitePhone = settings.site_phone || '';
  const siteEmail = settings.site_email || '';
  const siteAddress = settings.site_address || '';
  const footerText = settings.footer_text || '';
  const copyrightText = settings.copyright_text || `© ${new Date().getFullYear()} - Tous droits réservés`;
  
  const facebookUrl = settings.facebook_url || '';
  const instagramUrl = settings.instagram_url || '';
  const twitterUrl = settings.twitter_url || '';

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* À propos */}
          <div className="footer-section">
            <h3>🍽️ {siteName}</h3>
            <p>{footerText || 'Découvrez une expérience culinaire unique dans notre restaurant.'}</p>
            {(facebookUrl || instagramUrl || twitterUrl) && (
              <div className="social-links">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation rapide */}
          <div className="footer-section">
            <h3>Navigation</h3>
            <Link href="/"><a>Accueil</a></Link>
            <Link href="/categories"><a>Notre Carte</a></Link>
            <Link href="/menus"><a>Menus</a></Link>
            <Link href="/reservation"><a>Réservation</a></Link>
            <Link href="/about"><a>À propos</a></Link>
            <Link href="/search"><a>Rechercher</a></Link>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact</h3>
            {siteAddress && (
              <p>
                <i className="bi bi-geo-alt"></i> {siteAddress}
              </p>
            )}
            {sitePhone && (
              <p>
                <i className="bi bi-telephone"></i> {sitePhone}
              </p>
            )}
            {siteEmail && (
              <p>
                <i className="bi bi-envelope"></i> {siteEmail}
              </p>
            )}
          </div>

          {/* Horaires */}
          <div className="footer-section">
            <h3>Horaires d'ouverture</h3>
            <p>Lundi - Vendredi: 12h - 14h30, 19h - 22h30</p>
            <p>Samedi: 19h - 23h</p>
            <p>Dimanche: Fermé</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>{copyrightText}</p>
          <p className="footer-credits">
            Développé avec ❤️ | <Link href="/mentions-legales"><a>Mentions légales</a></Link> | 
            <Link href="/politique-confidentialite"><a> Politique de confidentialité</a></Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background: #2c3e50;
          color: white;
          padding: 50px 20px 30px;
          margin-top: 60px;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section {
          opacity: 0;
        }

        .footer-section h3 {
          color: #e74c3c;
          margin-bottom: 20px;
          font-size: 1.3em;
          font-weight: 700;
        }

        .footer-section p,
        .footer-section a {
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
          transition: all 0.3s;
        }

        .footer-section a:hover {
          color: white;
          transform: translateX(5px);
        }

        .footer-section p i {
          margin-right: 10px;
          color: #e74c3c;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-links a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          color: white;
          font-size: 1.3em;
          transition: all 0.3s;
          margin-bottom: 0;
        }

        .social-links a:hover {
          background: #e74c3c;
          transform: translateY(-5px) scale(1.1);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }

        .footer-bottom p {
          margin-bottom: 10px;
        }

        .footer-credits {
          font-size: 0.9em;
        }

        .footer-credits a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.3s;
          display: inline;
        }

        .footer-credits a:hover {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .site-footer {
            padding: 40px 20px 20px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-section h3 {
            font-size: 1.1em;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}