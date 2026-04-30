"use client";

import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  GlassWater,
  Globe,
  PhoneCall,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useContact } from "@/hooks/useContact";
import { useTranslations } from "next-intl";

const CloudSVG = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M80 40C90 40 95 32 95 25C95 18 90 12 82 12C80 5 73 0 64 0C55 0 48 6 47 14C42 14 38 18 38 24C38 30 42 34 48 34C48 38 52 40 57 40H80Z"
      fill="#08aab9"
      fillOpacity="0.18"
    />
    <path
      d="M25 45C32 45 36 39 36 33C36 27 32 23 26 23C25 18 20 14 13 14C6 14 1 19 0 25C-3 25 -6 28 -6 32C-6 36 -3 39 1 39C1 42 4 45 8 45H25Z"
      fill="#fcb239"
      fillOpacity="0.18"
    />
  </svg>
);

const DecorativeDot = ({ color = "teal", className = "" }: { color?: "teal" | "yellow" | "blue" | "orange"; className?: string }) => {
  const colorClasses = {
    teal: "bg-[#03807a]",
    yellow: "bg-[#fcb239]",
    blue: "bg-[#08aab9]",
    orange: "bg-[#e87b1c]",
  };
  return <div className={`w-3 h-3 rounded-full ${colorClasses[color]} ${className}`} />;
};

const SectionLabel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="w-8 h-[2px] bg-[#03807a]" />
    <span className="text-[#03807a] font-semibold text-sm uppercase tracking-[0.22em]">{children}</span>
    <div className="w-8 h-[2px] bg-[#03807a]" />
  </div>
);

const Hero = () => {
  const t = useTranslations("Home");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f6fbfb] via-white to-[#fff8ee] py-16 md:py-24">
      <CloudSVG className="absolute top-10 left-10 w-32 opacity-70 animate-pulse" />
      <CloudSVG className="absolute top-20 right-20 w-24 opacity-50" style={{ animationDelay: "1s" }} />
      <DecorativeDot color="teal" className="absolute top-32 right-1/4" />
      <DecorativeDot color="yellow" className="absolute bottom-16 left-10" />

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#08aab9]/10 px-4 py-2 text-[#03807a] mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">{t("hero.badge")}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2b2e35] leading-tight mb-6">
            {t("hero.title.line1")}
            <span className="block text-[#03807a]">{t("hero.title.line2")}</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-[#e87b1c] hover:bg-[#cc6713] text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-[1.03] shadow-lg shadow-[#e87b1c]/20"
            >
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <CloudSVG className="absolute -top-8 -right-8 w-20 opacity-70" />
          <div className="absolute -left-4 top-10 hidden md:flex flex-col gap-3">
            <div className="rounded-2xl bg-white shadow-lg border border-[#08aab9]/15 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcb239]/20 flex items-center justify-center text-[#e87b1c]">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t("hero.card.title")}</p>
                <p className="text-xs text-gray-500">{t("hero.card.subtitle")}</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-white">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop"
              alt={t("hero.imageAlt")}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03807a]/35 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const t = useTranslations("Home");

  const features = [
    {
      icon: <GlassWater className="w-8 h-8" />,
      title: t("features.items.logistics.title"),
      description: t("features.items.logistics.description"),
      card: "bg-gradient-to-br from-[#fff4df] to-[#fffaf2]",
      iconBg: "bg-[#fcb239]/20",
      iconColor: "text-[#e87b1c]",
      border: "border-[#fcb239]/25",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("features.items.personalized.title"),
      description: t("features.items.personalized.description"),
      card: "bg-gradient-to-br from-[#e8fbfb] to-[#f5fffe]",
      iconBg: "bg-[#08aab9]/15",
      iconColor: "text-[#03807a]",
      border: "border-[#08aab9]/25",
    },
    {
      icon: <PhoneCall className="w-8 h-8" />,
      title: t("features.items.support.title"),
      description: t("features.items.support.description"),
      card: "bg-gradient-to-br from-[#edf8f0] to-[#f8fff9]",
      iconBg: "bg-[#03807a]/12",
      iconColor: "text-[#03807a]",
      border: "border-[#03807a]/20",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <SectionLabel>{t("features.sectionLabel")}</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#2b2e35]">
            {t("features.heading")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`text-center group rounded-[2rem] border ${feature.border} ${feature.card} p-8 shadow-sm hover:shadow-xl transition-all`}>
              <div className={`w-24 h-24 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <div className={feature.iconColor}>{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-[#2b2e35] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const t = useTranslations("Home");

  return (
    <section className="py-20 bg-gradient-to-br from-[#f6fbfb] to-[#fff8ee]" id="about">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl mx-auto ring-8 ring-[#08aab9]/10">
              <img
                src="https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=500&h=500&fit=crop"
                alt={t("about.imageAlt1")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 md:right-0 w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white ring-4 ring-[#fcb239]/10">
              <img
                src="https://images.unsplash.com/photo-1518638150340-f706e86654de?w=500&h=500&fit=crop"
                alt={t("about.imageAlt2")}
                className="w-full h-full object-cover"
              />
            </div>
            <DecorativeDot color="teal" className="absolute top-0 right-1/4" />
            <DecorativeDot color="orange" className="absolute bottom-12 left-6" />
          </div>
        </div>

        <div className="relative">
          <DecorativeDot color="blue" className="absolute -top-4 left-0" />
          <SectionLabel className="justify-start mb-4">{t("about.sectionLabel")}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2e35] mb-6">
            {t("about.title")}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            {t("about.description")}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white shadow-md border border-[#08aab9]/15 p-4 flex items-start gap-3">
              <div className="rounded-full bg-[#08aab9]/15 p-2 text-[#03807a]"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-[#2b2e35]">{t("about.items.trust.title")}</p>
                <p className="text-sm text-gray-600">{t("about.items.trust.description")}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white shadow-md border border-[#fcb239]/20 p-4 flex items-start gap-3">
              <div className="rounded-full bg-[#fcb239]/20 p-2 text-[#e87b1c]"><MapPin className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-[#2b2e35]">{t("about.items.experiences.title")}</p>
                <p className="text-sm text-gray-600">{t("about.items.experiences.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CustomPlan = () => {
  const t = useTranslations("Home");

  return (
    <section className="py-20 bg-white" id="plan">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#08aab9]/20 bg-gradient-to-br from-[#ecfbfb] via-white to-[#fff6e8] p-12 text-center shadow-lg">
          <CloudSVG className="absolute -top-6 left-8 w-16 opacity-60" />
          <DecorativeDot color="teal" className="absolute top-8 right-1/4" />
          <DecorativeDot color="yellow" className="absolute bottom-12 left-12" />
          <DecorativeDot color="orange" className="absolute top-1/3 right-12" />

          <SectionLabel className="justify-center mb-4">{t("customPlan.sectionLabel")}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2e35] mb-6">
            {t("customPlan.title")}
          </h2>
          <p className="text-[#03807a] font-semibold mb-2">{t("customPlan.question")}</p>
          <p className="text-gray-600 font-black mb-2">{t("customPlan.emphasis")}</p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {t("customPlan.text")}
          </p>
          <Link
            href="/cotiza-tu-plan"
            className="inline-flex items-center gap-2 bg-[#03807a] hover:bg-[#02645f] text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-[1.03] shadow-lg shadow-[#03807a]/20"
          >
            {t("customPlan.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="absolute -bottom-2 left-8 w-14 h-14 flex items-center justify-center opacity-80">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <rect x="20" y="16" width="24" height="32" rx="4" fill="#08aab9" fillOpacity="0.22" />
              <rect x="24" y="12" width="16" height="8" rx="2" fill="#fcb239" />
              <circle cx="32" cy="36" r="6" fill="#03807a" />
            </svg>
          </div>
          <div className="absolute bottom-6 right-8 w-10 h-10 flex items-center justify-center opacity-80">
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
              <circle cx="24" cy="24" r="20" stroke="#e87b1c" strokeWidth="2" fill="none" />
              <path d="M24 8V24L34 34" stroke="#e87b1c" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const t = useTranslations("Home");

  const reasons = [
    { number: "01", title: t("why.items.first"), color: "bg-[#03807a]" },
    { number: "02", title: t("why.items.second"), color: "bg-[#08aab9]" },
    { number: "03", title: t("why.items.third"), color: "bg-[#e87b1c]" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#fffaf2] to-[#f6fbfb]">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionLabel className="justify-start mb-4">{t("why.sectionLabel")}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2e35] mb-10">
            {t("why.title")}
          </h2>

          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className={`w-14 h-14 ${reason.color} rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform shadow-md`}>
                  {reason.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-700">{reason.title}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[2rem] overflow-hidden shadow-lg border border-[#08aab9]/15">
              <img
                src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&h=400&fit=crop"
                alt={t("why.imageAlt1")}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-lg mt-8 border border-[#fcb239]/15">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop"
                alt={t("why.imageAlt2")}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 right-4 w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full opacity-75">
              <rect x="16" y="20" width="32" height="24" rx="3" fill="#08aab9" fillOpacity="0.2" />
              <circle cx="32" cy="32" r="8" fill="#fcb239" fillOpacity="0.65" />
              <path d="M32 26V38M26 32H38" stroke="#e87b1c" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const t = useTranslations("Home");
  const { sendContactForm, isLoading } = useContact();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.mensaje) {
      return;
    }

    const res = await sendContactForm({
      nombre: form.nombre,
      email: form.email,
      mensaje: form.mensaje,
    });

    if (res.success) {
      setForm({
        nombre: "",
        email: "",
        mensaje: "",
      });
    }
  };

  return (
    <section className="py-20 bg-white" id="contacto">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div>
          <SectionLabel className="justify-start mb-4">{t("contact.sectionLabel")}</SectionLabel>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2e35] mb-6">
            {t("contact.title")}
          </h2>

          <p className="text-gray-600 mb-8">
            {t("contact.text")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] bg-gradient-to-br from-[#f6fbfb] to-white p-6 md:p-8 shadow-sm border border-[#08aab9]/15">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t("contact.form.name.label")} <span className="text-[#e87b1c]">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-4 focus:ring-[#08aab9]/10 outline-none bg-white transition"
                placeholder={t("contact.form.name.placeholder")}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t("contact.form.email.label")} <span className="text-[#e87b1c]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-4 focus:ring-[#08aab9]/10 outline-none bg-white transition"
                placeholder={t("contact.form.email.placeholder")}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t("contact.form.message.label")} <span className="text-[#e87b1c]">*</span>
              </label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-4 focus:ring-[#08aab9]/10 outline-none bg-white transition resize-none"
                placeholder={t("contact.form.message.placeholder")}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e87b1c] px-8 py-3 font-semibold text-white transition-all hover:bg-[#cc6713] disabled:opacity-50 shadow-lg shadow-[#e87b1c]/20"
            >
              {isLoading ? t("contact.form.sending") : t("contact.form.submit")}
            </button>
          </form>

          <div className="mt-12">
            <h3 className="text-2xl font-extrabold text-[#2b2e35] mb-6">{t("contact.infoTitle")}</h3>

            <div className="space-y-4">
              <Link href="mailto:info@escapamex.com" className="flex items-center gap-3 text-gray-600 hover:text-[#03807a] transition-colors">
                <Mail className="w-5 h-5 text-[#08aab9]" />
                {t("contact.info.email")}
              </Link>

              <Link href="tel:+521551456789" className="flex items-center gap-3 text-gray-600 hover:text-[#03807a] transition-colors">
                <Phone className="w-5 h-5 text-[#08aab9]" />
                {t("contact.info.phone")}
              </Link>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-[#08aab9]" />
                {t("contact.info.location")}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute -top-6 -left-6 rounded-2xl bg-[#fcb239] px-4 py-3 shadow-lg">
            <p className="text-sm font-bold text-[#2b2e35]">{t("contact.badge.title")}</p>
            <p className="text-xs text-[#2b2e35]/70">{t("contact.badge.subtitle")}</p>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-[#08aab9]/10">
            <img
              src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&h=700&fit=crop"
              alt={t("contact.imageAlt")}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <About />
      <CustomPlan />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </main>
  );
}