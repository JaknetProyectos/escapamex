"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Send, CheckCircle, Sparkles } from "lucide-react";
import { useContact } from "@/hooks/useContact";
import { useTranslations } from "next-intl";

export default function ContactoPage() {
  const t = useTranslations("ContactoPage");
  const { sendContactForm, isLoading } = useContact();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      return;
    }

    const res = await sendContactForm({
      nombre: formData.nombre,
      email: formData.email,
      mensaje: formData.mensaje,
    });

    if (res.success) {
      setIsSubmitted(true);
      setFormData({ nombre: "", email: "", mensaje: "" });
    }
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#03807a]/80 to-[#08aab9]/70 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-[#fcb239] mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">{t("hero.badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* FORM */}
          <div>
            <h2 className="text-2xl font-bold text-[#2b2e35] mb-6">
              {t("form.title")}
            </h2>

            {isSubmitted ? (
              <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-[#08aab9]/20 text-center">
                <div className="w-20 h-20 bg-[#03807a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[#03807a]" />
                </div>
                <h3 className="text-xl font-bold text-[#2b2e35] mb-4">
                  {t("form.successTitle")}
                </h3>
                <p className="text-gray-600">
                  {t("form.successMessage")}
                </p>
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
                      className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none"
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
                      className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      {t("form.message")}
                    </label>
                    <textarea
                      name="mensaje"
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleChange}
                      className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#e87b1c] hover:bg-[#cc6713] text-white py-3 rounded-full font-semibold"
                  >
                    {isLoading ? t("form.sending") : t("form.submit")}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#03807a] to-[#08aab9] text-white rounded-[2rem] p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-8">
                {t("info.title")}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#fcb239]" />
                  <p>{t("info.location")}</p>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#fcb239]" />
                  <a href="tel:+521551234567">{t("info.phone")}</a>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-[#fcb239]" />
                  <a href="mailto:info@escapamex.com">
                    {t("info.email")}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}