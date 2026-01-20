import Link from 'next/link';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear();

  const siteName = settings.site_name || 'LE SAGE';
  const siteDescription =
    settings.site_description ||
    'Création de sites web professionnels sur-mesure — design moderne, performance et maintenance continue.';

  const email = settings.email || 'lesage.pro.dev@gmail.com';
  const phone = settings.phone_number || '+33 07 86 18 18 40';
  const city = settings.city || 'Lyon';
  const website = settings.website || 'www.LeSageDev.com';

  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
                <span className="font-heading text-sm font-black text-white">
                  LS
                </span>
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-white">
                  {siteName}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Studio & agence web
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm text-slate-300">
              {siteDescription}
            </p>

            <p className="mt-4 text-xs text-slate-400">
              Design moderne • Base de données sécurisée • Hébergement & domaine
              • Maintenance continue
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/offres" className="hover:text-white">
                  Offres
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Présentation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-secondary" />
                <a className="hover:text-white" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-secondary" />
                <a className="hover:text-white" href={`tel:${phone}`}>
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                <span>{city}</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 text-secondary" />
                <a
                  className="hover:text-white"
                  href={`https://${website.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 md:flex-row">
          <p>
            © {currentYear} {siteName}. Tous droits réservés.
          </p>
          <p className="text-slate-500">
            Création de sites web professionnels sur-mesure — Restaurant •
            Commerce • Service
          </p>
        </div>
      </div>
    </footer>
  );
}