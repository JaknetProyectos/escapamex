"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useExperience, useRelatedExperiences } from "@/hooks/useExperience";
import { useCart } from "@/context/CartContext";
import {
  MapPin,
  Clock,
  Check,
  ChevronLeft,
  Plus,
  Minus,
} from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import { Tarifa } from "@/data/experiences";

export default function ExperienceDetailPage() {
  const t = useTranslations("experience");

  const params = useParams();
  const slug = params.slug as string;

  const { data: experience, isLoading, error } = useExperience(slug);
  const { data: relatedExperiences } = useRelatedExperiences(
    experience?.id || ""
  );

  const { addToCart, isInCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const inCart = experience ? isInCart(experience.id) : false;
  const { showAlert } = useAlert()

  function getTarifaPorCantidad(tarifas: Tarifa[], cantidad: number) {
    return tarifas.find((t) => {
      if (t.max === null) return cantidad >= t.min;
      return cantidad >= t.min && cantidad <= t.max;
    });
  }

  const handleAddToCart = () => {
    if (!experience) return;

    if (!selectedDate) {
      showAlert({
        title: t("errorTitle"),
        message: t("selectDateError"),
        type: "warning",
      });
      return;
    }

    let finalExperience = experience;

    // 👉 Si hay tarifas, recalculamos precio
    if (experience.tafiras && experience.tafiras.length > 0) {
      const tarifa = getTarifaPorCantidad(experience.tafiras, quantity);

      if (!tarifa) {
        showAlert({
          title: t("errorTitle"),
          message: t("noPricingAvailable"),
          type: "error",
        });
        return;
      }

      finalExperience = {
        ...experience,
        price: tarifa.precioPorPersona, // 🔥 clave
      };
    }

    addToCart(finalExperience, quantity, selectedDate);

    showAlert({
      title: t("successTitle"),
      message: t("addedToCart"),
      type: "success",
    });
  };

  if (isLoading) return null;
  if (error || !experience) return null;

  const images = experience.images?.length
    ? experience.images
    : [experience.image];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Back */}
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-[#03807a] hover:underline mb-8"
        >
          <ChevronLeft /> {t("back")}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* GALLERY */}
          <div>
            <div className="h-[420px] rounded-3xl overflow-hidden mb-4 shadow-lg">
              <img
                src={images[selectedImage]}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2 ${selectedImage === i
                    ? "border-[#03807a]"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold mb-4 text-[#2b2e35]">
              {experience.title}
            </h1>

            <div className="flex gap-6 mb-6 text-gray-600">
              <div className="flex gap-2 items-center">
                <MapPin className="w-4 h-4 text-[#08aab9]" />
                {experience.location}
              </div>
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-[#08aab9]" />
                {experience.duration}
              </div>
            </div>



            {/* PRICE BOX */}
            <div className="bg-[#f8fafc] border border-[#08aab9]/20 rounded-2xl p-6 mb-6">

              <div className="text-3xl font-bold text-[#e87b1c] mb-4">
                ${experience.price.toLocaleString()} MXN
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full mb-4 border rounded-lg px-4 py-3 focus:border-[#03807a] outline-none"
              />

              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus />
                </button>
              </div>

              <div className="mb-4 font-semibold">
                {t("total")}: $
                {(experience.price * quantity).toLocaleString()}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#03807a] hover:bg-[#02645f] text-white py-3 rounded-full"
              >
                {inCart ? t("addMore") : t("addToCart")}
              </button>
            </div>

            {/* INCLUDED */}
            <ul className="space-y-2">
              {experience.included?.map((item, i) => (
                <li key={i} className="flex gap-2 items-center text-gray-600">
                  <Check className="text-green-500 w-4 h-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {experience.tafiras && experience.tafiras.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-[#03807a]">
              {t("tarifas")}
            </h3>

            <div className="overflow-hidden rounded-2xl border border-[#08aab9]/20">
              <table className="w-full text-sm">
                <thead className="bg-[#f0fafa] text-[#2b2e35]">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      {t("person")}
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      {t("costforPerson")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {experience.tafiras.map((tarifa, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-700">
                        {tarifa.cantidadLabel}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#e87b1c]">
                        ${tarifa.precioPorPersona.toLocaleString("es-MX")}{" "}
                        {tarifa.moneda}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-[#03807a]">
            {t("about")}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {experience.description}
          </p>
        </div>

        {/* RELATED */}
        {relatedExperiences?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              {t("related")}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedExperiences.map((exp, i) => (
                <Link key={i} href={`/tienda/${exp.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                    <img src={exp.image} className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-[#e87b1c] font-bold">
                        ${exp.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}