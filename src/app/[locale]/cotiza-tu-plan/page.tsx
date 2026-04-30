"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Send, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function CotizaTuPlanPage() {
  const t = useTranslations("CotizaTuPlanPage");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    experiencia: "",
    detalles: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=400&fit=crop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03807a]/80 to-[#08aab9]/70 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-2 text-[#fcb239] mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-sm">{t("hero.badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2e35] mb-4">
              {t("content.title1")}
            </h2>
            <h2 className="text-4xl md:text-4xl font-extrabold text-[#03807a] mb-4">
              {t("content.title2")}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {t("content.paragraph1")}
            </p>
            <p className="text-gray-600 py-2 max-w-2xl">
              {t("content.paragraph2")}
            </p>
            <p className="text-gray-600 max-w-2xl">
              {t("content.paragraph3")}
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] flex flex-row justify-center items-center overflow-hidden shadow-xl border border-[#08aab9]/20">
              <img
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FORM */}
        {isSubmitted ? (
          <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-[#08aab9]/20 text-center">
            <div className="w-20 h-20 bg-[#03807a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#03807a]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b2e35] mb-4">
              {t("success.title")}
            </h3>
            <p className="text-gray-600 mb-8">
              {t("success.description")}
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-[#e87b1c] hover:bg-[#cc6713] text-white px-8 py-4 rounded-full font-semibold"
            >
              {t("success.cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-white to-[#f6fbfb] rounded-[2rem] p-8 shadow-xl border border-[#08aab9]/20"
          >
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("form.name")}
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("form.experience")}
                </label>
                <input
                  type="text"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("form.details")}
                </label>
                <textarea
                  name="detalles"
                  required
                  rows={4}
                  value={formData.detalles}
                  onChange={handleChange}
                  className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#03807a] hover:bg-[#02645f] text-white py-3 rounded-full font-semibold"
              >
                {isSubmitting ? t("form.sending") : t("form.submit")}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* CTA FINAL */}
        <div className="mt-16 bg-gradient-to-r from-[#fff4df] to-[#fff8ee] border border-[#fcb239]/30 rounded-[2rem] p-10 text-center">
          <h3 className="text-2xl font-bold text-[#2b2e35] mb-4">
            {t("cta.title")}
          </h3>
          <p className="text-gray-600 mb-6">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/paga-tu-cotizacion/"
              className="bg-[#e87b1c] hover:bg-[#cc6713] text-white px-6 py-3 rounded-full font-semibold"
            >
              {t("cta.pay")}
            </Link>
            <Link
              href="/tienda"
              className="bg-[#08aab9] hover:bg-[#0793a0] text-white px-6 py-3 rounded-full font-semibold"
            >
              {t("cta.explore")}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}