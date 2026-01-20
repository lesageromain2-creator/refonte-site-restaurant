import Head from 'next/head';
import {
  ArrowRight,
  CheckCircle2,
  Monitor,
  ShoppingBag,
  AppWindow,
  RefreshCcw,
  HelpCircle,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const demoSettings = {
  site_name: 'Studio Web Breizh',
};

const offers = [
  {
    id: 'vitrine',
    title: 'Site vitrine premium',
    subtitle: 'Idéal pour lancer ou repositionner votre activité',
    icon: Monitor,
    price: 'À partir de 1 900 € HT',
    timeline: '3 à 5 semaines',
    bestFor: ['Indépendants', 'TPE/PME', 'Artisans', 'Studios créatifs'],
    features: [
      'Design sur-mesure, pas de template',
      'Jusqu’à 8 pages (Accueil, Services, À propos, Blog, Contact, etc.)',
      'Optimisation SEO de base (balises, performances, structure)',
      'Formulaire de contact avancé (anti-spam, tracking)',
      'Intégration réseaux sociaux & Analytics',
    ],
    tech: ['Next.js', 'TailwindCSS', 'Vercel'],
    highlight: 'Le point de départ idéal pour une présence professionnelle.',
  },
  {
    id: 'ecommerce',
    title: 'Boutique e-commerce',
    subtitle: 'Pensée pour convertir vos visiteurs en clients',
    icon: ShoppingBag,
    price: 'À partir de 3 900 € HT',
    timeline: '5 à 8 semaines',
    bestFor: ['Marques DTC', 'Commerçants', 'Producteurs locaux'],
    features: [
      'Catalogue produits avec filtres et recherche',
      'Tunnel de commande optimisé mobile-first',
      'Paiements sécurisés (Stripe, autres sur demande)',
      'Gestion des stocks & email de confirmation',
      'Suivi des conversions (Pixel Meta, GA4, etc.)',
    ],
    tech: ['Next.js', 'Stripe', 'Supabase', 'Vercel'],
    highlight:
      'Une expérience d’achat fluide et rassurante, optimisée pour le mobile.',
    isPopular: true,
  },
  {
    id: 'webapp',
    title: 'Application web sur-mesure',
    subtitle: 'Créez l’outil métier qui n’existe pas encore',
    icon: AppWindow,
    price: 'Sur devis',
    timeline: 'À définir selon la complexité',
    bestFor: ['SaaS', 'Startups', 'Equipes internes'],
    features: [
      'Ateliers de cadrage fonctionnel',
      'Architecture scalable (Node.js / Supabase)',
      'Dashboard & espaces clients personnalisés',
      'Gestion des rôles et permissions',
      'Accompagnement UX continu',
    ],
    tech: ['React', 'Node.js', 'Supabase', 'Render'],
    highlight:
      'Une base technique solide pour construire un produit qui peut grandir.',
  },
  {
    id: 'refonte',
    title: 'Refonte & optimisation',
    subtitle: 'Faites passer un cap à votre site actuel',
    icon: RefreshCcw,
    price: 'À partir de 1 200 € HT',
    timeline: '2 à 4 semaines',
    bestFor: ['Sites existants', 'Refonte partielle ou totale'],
    features: [
      'Audit UX, performance et SEO détaillé',
      'Recommandations priorisées et plan d’action',
      'Modernisation du design et de la structure',
      'Optimisation des temps de chargement',
      'Accompagnement à la migration / redirections',
    ],
    tech: ['Next.js', 'Audit Lighthouse', 'SEO'],
    highlight:
      'Idéal si vous souhaitez améliorer sans tout reconstruire from scratch.',
  },
];

const faqs = [
  {
    question: 'Proposez-vous des abonnements ou de la maintenance ?',
    answer:
      'Oui. Nous pouvons mettre en place un forfait mensuel incluant mises à jour, petites évolutions, monitoring et support prioritaire.',
  },
  {
    question: 'Les contenus (textes, photos) sont-ils inclus ?',
    answer:
      'Nous pouvons vous accompagner sur la structure éditoriale et vous recommander des partenaires (rédaction, photo, vidéo) si besoin.',
  },
  {
    question: 'Pouvez-vous reprendre un projet déjà entamé ?',
    answer:
      'Nous réalisons d’abord un audit technique pour valider ce qui peut être conservé, puis nous vous proposons un plan de reprise clair.',
  },
];

export default function Offres() {
  return (
    <>
      <Head>
        <title>
          Offres & Tarifs – Studio Web Breizh | Sites vitrines, e-commerce,
          applications web
        </title>
        <meta
          name="description"
          content="Découvrez nos offres pour la création de sites vitrines, boutiques e-commerce, applications web sur-mesure et refontes optimisées. Pensées pour accompagner chaque étape de votre croissance."
        />
      </Head>

      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <section className="mx-auto max-w-5xl text-center">
            <h1 className="font-heading text-3xl font-black text-white md:text-4xl">
              Des offres claires,
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                pensées pour vos objectifs.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Nous construisons avec vous un cadre budgétaire réaliste, sans
              surprise, avec un planning précis et des jalons clairement
              définis.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              {offers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <article
                    key={offer.id}
                    id={offer.id}
                    className={`relative flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl ${
                      offer.isPopular ? 'ring-2 ring-secondary/60' : ''
                    }`}
                  >
                    {offer.isPopular && (
                      <div className="absolute -top-3 right-6 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg">
                        Offre la plus choisie
                      </div>
                    )}

                    <header className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                            {offer.title}
                          </h2>
                          <p className="mt-1 text-xs text-slate-300 md:text-sm">
                            {offer.subtitle}
                          </p>
                        </div>
                      </div>
                    </header>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-200 md:text-sm">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                          Budget indicatif
                        </p>
                        <p className="mt-1 font-semibold text-white">
                          {offer.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                          Durée moyenne
                        </p>
                        <p className="mt-1 text-slate-200">
                          {offer.timeline}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        Idéal pour
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-100">
                        {offer.bestFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white/5 px-3 py-1"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2 text-xs text-slate-200 md:text-sm">
                      {offer.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-secondary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {offer.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-slate-300 md:text-sm">
                      {offer.highlight}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
                      <a
                        href="/reservation"
                        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Planifier un appel projet
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                      <a
                        href="/contact"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10"
                      >
                        Demander un devis détaillé
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mx-auto mt-16 max-w-4xl border-t border-white/10 pt-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="md:w-1/3">
                <h2 className="font-heading text-xl font-semibold text-white md:text-2xl">
                  Questions fréquentes.
                </h2>
                <p className="mt-2 text-xs text-slate-300 md:text-sm">
                  Vous avez un cas particulier ou un besoin très spécifique ?
                  Nous sommes là pour en discuter et proposer un cadre adapté.
                </p>
              </div>
              <div className="md:w-2/3 space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-left"
                  >
                    <div className="mt-1">
                      <HelpCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white md:text-sm">
                        {faq.question}
                      </p>
                      <p className="mt-1 text-xs text-slate-300 md:text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}

