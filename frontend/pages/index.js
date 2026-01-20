import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
  Star,
  Users,
  Zap,
  Monitor,
  ShoppingBag,
  AppWindow,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const heroWords = [
  'sites vitrines',
  'e-commerces performants',
  'applications web sur-mesure',
];

const services = [
  {
    id: 'vitrine',
    title: 'Site vitrine premium',
    description:
      'Une présence en ligne élégante et optimisée pour présenter votre activité et générer des contacts qualifiés.',
    icon: Monitor,
    tag: 'Branding & visibilité',
  },
  {
    id: 'ecommerce',
    title: 'Boutique e-commerce',
    description:
      'Une expérience d’achat fluide et rassurante, pensée pour convertir vos visiteurs en clients fidèles.',
    icon: ShoppingBag,
    tag: 'Conversion & ventes',
  },
  {
    id: 'webapp',
    title: 'Application web',
    description:
      'Des outils métiers sur-mesure, performants et scalables pour accompagner la croissance de votre entreprise.',
    icon: AppWindow,
    tag: 'Sur-mesure & performance',
  },
  {
    id: 'refonte',
    title: 'Refonte & optimisation',
    description:
      'Audit complet, modernisation UI/UX, optimisation des performances et du référencement de votre site actuel.',
    icon: Rocket,
    tag: 'Refonte & SEO',
  },
];

const processSteps = [
  {
    title: 'Découverte',
    description:
      'Un échange structuré pour comprendre vos objectifs business, votre audience et vos contraintes.',
  },
  {
    title: 'Design',
    description:
      'Maquettes haute-fidélité, identité visuelle et parcours utilisateur pensés pour la conversion.',
  },
  {
    title: 'Développement',
    description:
      'Intégration Next.js, backend sécurisé et mise en place des connexions aux outils clés.',
  },
  {
    title: 'Lancement & suivi',
    description:
      'Mise en production, monitoring, optimisations continues et accompagnement post-lancement.',
  },
];

const portfolioHighlights = [
  {
    title: 'Studio Breizh Surf',
    category: 'Site vitrine',
    description:
      'Refonte complète de l’identité digitale d’une école de surf bretonne, avec réservation en ligne intégrée.',
    tech: ['Next.js', 'Supabase', 'Framer Motion'],
  },
  {
    title: 'Armor Café',
    category: 'E-commerce',
    description:
      'Boutique en ligne pour un torréfacteur artisanal, optimisée pour le mobile et le SEO local.',
    tech: ['Next.js', 'Stripe', 'Tailwind'],
  },
  {
    title: 'Keltia Tech',
    category: 'Application web',
    description:
      'Dashboard SaaS pour piloter des campagnes marketing multi-canales en temps réel.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
  },
];

const testimonials = [
  {
    name: 'Julie M.',
    role: 'Fondatrice, Studio Breizh Surf',
    quote:
      'Nous avons doublé nos réservations en ligne en une saison. L’équipe a parfaitement compris nos enjeux locaux.',
  },
  {
    name: 'Thomas L.',
    role: 'Gérant, Armor Café',
    quote:
      'Un site rapide, beau, et surtout qui vend. Le back-office est simple et l’accompagnement au top.',
  },
  {
    name: 'Claire R.',
    role: 'CMO, Keltia Tech',
    quote:
      'Une application web robuste et évolutive, livrée dans les temps avec une qualité irréprochable.',
  },
];

export default function Home() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    years: 0,
    satisfaction: 0,
  });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const demoSettings = {
    site_name: 'LE SAGE',
    site_description:
      'Création de sites web professionnels sur-mesure — Restaurant • Commerce • Service',
    email: 'lesage.pro.dev@gmail.com',
    phone_number: '+33 07 86 18 18 40',
    city: 'Lyon',
    website: 'www.LeSageDev.com',
  };

  useEffect(() => {
    const animateValue = (target, duration, callback) => {
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        callback(target * progress);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    };

    setTimeout(() => {
      animateValue(48, 1800, (val) =>
        setStats((prev) => ({ ...prev, projects: Math.floor(val) })),
      );
      animateValue(32, 1700, (val) =>
        setStats((prev) => ({ ...prev, clients: Math.floor(val) })),
      );
      animateValue(5, 1600, (val) =>
        setStats((prev) => ({ ...prev, years: Math.floor(val) })),
      );
      animateValue(4.9, 2000, (val) =>
        setStats((prev) => ({
          ...prev,
          satisfaction: parseFloat(val.toFixed(1)),
        })),
      );
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const currentHeroWord = heroWords[currentWordIndex];

  return (
    <>
      <Head>
        <title>
          Studio Web Breizh – Création de sites vitrines, e-commerce &
          applications web
        </title>
        <meta
          name="description"
          content="Agence web bretonne spécialisée dans la création de sites vitrines, e-commerce et applications web modernes, performantes et orientées business."
        />
      </Head>

      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        {/* HERO */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#030712] via-[#020617] to-[#020617]">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 0% 0%, rgba(0,102,255,0.55) 0, transparent 55%), radial-gradient(circle at 100% 100%, rgba(0,217,255,0.55) 0, transparent 55%)',
              }}
            />
          </div>

          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24 md:flex-row md:items-center">
            <div className="flex-1 space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-200 backdrop-blur">
                <Sparkles className="h-3 w-3 text-secondary" />
                Agence web créative basée en Bretagne
              </span>

              <h1 className="font-heading text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                Nous concevons des
                <span className="relative ml-2 inline-block align-baseline">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    expériences digitales
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-secondary" />
                </span>
                <br className="hidden md:block" />
                qui transforment votre business.
              </h1>

              <p className="max-w-xl text-base text-slate-300 md:text-lg">
                Sites vitrines, boutiques en ligne et applications web
                performantes, pensées pour vos utilisateurs et vos objectifs
                business. Nous accompagnons les marques bretonnes et
                francophones dans leur croissance digitale.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <span className="text-slate-400">Nous créons</span>
                <span className="relative inline-flex min-w-[190px] justify-start overflow-hidden">
                  <span className="animate-[fadeIn_0.6s_ease-out] bg-gradient-to-r from-secondary to-primary bg-clip-text font-medium text-transparent">
                    {currentHeroWord}
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/reservation"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Démarrer mon projet
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-medium text-slate-100 backdrop-blur transition hover:bg-white/10"
                >
                  Voir nos réalisations
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-300 md:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Score Lighthouse &gt; 90 garanti</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Hébergement optimisé sur Vercel & Render</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Approche SEO & accessibilité by design</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex-1 md:mt-0">
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 backdrop-blur-xl shadow-2xl">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Projets en cours
                  </span>
                  <span className="text-slate-400">Next.js · Supabase</span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-950/60 p-4 ring-1 ring-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                          E-commerce
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          Armor Café – Boutique en ligne
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        En production
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[82%] bg-gradient-to-r from-secondary to-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                    <div className="rounded-2xl bg-slate-950/60 p-3 ring-1 ring-white/5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        SEO / Performance
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        96
                        <span className="ml-1 text-xs text-emerald-400">
                          /100
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Score moyen Lighthouse
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-950/60 p-3 ring-1 ring-white/5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        Taux de conversion
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        +38%
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        En moyenne après refonte
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block">
            <div className="flex flex-col items-center gap-3 text-xs text-slate-300">
              <span>Faites défiler</span>
              <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
                <div className="h-3 w-1.5 animate-bounce rounded-full bg-white/80" />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative -mt-16 z-20 px-6 pb-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: Zap,
                value: stats.projects,
                label: 'Projets livrés',
              },
              {
                icon: Users,
                value: stats.clients,
                label: 'Clients accompagnés',
              },
              {
                icon: Star,
                value: stats.satisfaction,
                label: 'Note moyenne',
              },
              {
                icon: TrendingUp,
                value: stats.years,
                label: "Années d'expérience",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl shadow-lg transition-all hover:-translate-y-1 hover:border-secondary/60 hover:shadow-2xl"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Sparkles className="h-4 w-4 text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="text-2xl font-black text-white md:text-3xl">
                    {stat.value}
                    {stat.label === 'Note moyenne' && (
                      <span className="ml-1 text-sm text-slate-400">/5</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className="px-6 py-20 md:py-24 bg-slate-950/60 border-y border-white/5"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start">
            <div className="md:w-1/3">
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Des offres pensées pour
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  chaque étape de votre croissance.
                </span>
              </h2>
              <p className="mt-4 text-sm text-slate-300 md:text-base">
                Que vous lanciez votre activité ou que vous souhaitiez
                scaler un business existant, nous concevons une
                présence digitale alignée sur vos objectifs.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  Sites vitrines, e-commerce, applications web
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  Design sur-mesure, pas de templates recyclés
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  Suivi & accompagnement après le lancement
                </li>
              </ul>
            </div>

            <div className="md:w-2/3">
              <div className="grid gap-6 md:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={service.title}
                      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-200">
                          {service.tag}
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-lg font-semibold text-white md:text-xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm text-slate-300">
                        {service.description}
                      </p>
                      <a
                        href={`/offres#${service.id}`}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-secondary transition group-hover:text-white"
                      >
                        Découvrir l’offre
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section
          id="process"
          className="px-6 py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Un processus clair,
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {' '}
                  sans jargon.
                </span>
              </h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Nous vous guidons pas à pas, de la première idée au
                lancement, avec une méthodologie éprouvée.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto pb-4">
              <div className="flex min-w-full items-stretch gap-6 md:grid md:grid-cols-4 md:gap-6">
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="group relative flex min-w-[240px] flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-slate-400">Étape</span>
                        <span className="font-semibold text-secondary">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="h-7 w-7 rounded-full border border-white/15 bg-white/5 text-[11px] font-semibold text-slate-200 flex items-center justify-center">
                        {index === 0 && 'Brief'}
                        {index === 1 && 'UX/UI'}
                        {index === 2 && 'Dev'}
                        {index === 3 && 'Go live'}
                      </div>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-white md:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 md:text-sm">
                      {step.description}
                    </p>
                    {index < processSteps.length - 1 && (
                      <div className="pointer-events-none absolute inset-y-1 -right-4 hidden items-center md:flex">
                        <div className="h-px w-6 bg-gradient-to-r from-secondary/70 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO HIGHLIGHTS */}
        <section
          id="portfolio"
          className="px-6 py-20 md:py-24 bg-slate-900/95 border-y border-white/5"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                  Quelques projets
                  <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    qui parlent pour nous.
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm text-slate-300 md:text-base">
                  Une sélection de réalisations menées pour des acteurs
                  locaux et nationaux, avec des résultats mesurables.
                </p>
              </div>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-medium text-slate-100 backdrop-blur transition hover:bg-white/10"
              >
                Voir tout le portfolio
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {portfolioHighlights.map((project) => (
                <article
                  key={project.title}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                      {project.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {project.tech.join(' · ')}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-white md:text-lg">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs text-slate-300 md:text-sm">
                    {project.description}
                  </p>
                  <button className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-secondary transition group-hover:text-white">
                    Voir le cas client
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS + STATS BLOCK */}
        <section
          id="temoignages"
          className="px-6 py-20 md:py-24 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900"
        >
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] md:items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Ils nous font confiance.
              </h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Nous construisons des relations durables avec nos clients,
                basées sur la transparence, la pédagogie et les résultats.
              </p>

              <div className="mt-8 rounded-3xl border border-white/15 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    <span>4,9 / 5 sur les retours clients</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Afficher le témoignage ${index + 1}`}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-1.5 w-5 rounded-full transition ${
                          currentTestimonial === index
                            ? 'bg-secondary'
                            : 'bg-white/15 hover:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-slate-100 md:text-base">
                    “{testimonials[currentTestimonial].quote}”
                  </p>
                  <div className="mt-4 text-sm font-medium text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-slate-100 backdrop-blur-xl shadow-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-200">
                  Engagement qualité
                </p>
                <p className="mt-2 text-sm text-slate-100">
                  Chaque projet fait l’objet d’un contrôle qualité
                  approfondi : performance, accessibilité, SEO et sécurité.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    Audit Lighthouse complet avant mise en ligne
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    Code revu et testé sur les principaux navigateurs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    Support technique après lancement
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Taux de recommandation
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">94%</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    clients prêts à nous recommander
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Délai moyen de livraison
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    6-8
                    <span className="ml-1 text-sm text-slate-400">
                      semaines
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    pour un site vitrine complet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          id="cta"
          className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent px-6 py-20 md:py-24"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-slate-900/40 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center text-white">
            <Star className="h-10 w-10 md:h-12 md:w-12" />
            <h2 className="mt-4 font-heading text-3xl font-black md:text-4xl">
              Prêt à lancer votre prochain projet web ?
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base">
              Partagez-nous vos objectifs, vos contraintes et vos idées.
              Nous revenons vers vous sous 24h avec une première
              proposition d’accompagnement et un créneau de rendez-vous.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/reservation"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                Réserver un appel découverte
                <Calendar className="h-4 w-4 transition-transform group-hover:-rotate-3" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Nous écrire un message
              </a>
            </div>
          </div>
        </section>

        <Footer settings={demoSettings} />

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}