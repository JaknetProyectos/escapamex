"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useExperiences } from "@/hooks/useExperiences";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, MapPin, Search } from "lucide-react";
import type { Experience } from "@/data/experiences";

function ExperienceCard({ experience }: { experience: Experience }) {
  const t = useTranslations("store.card");
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(experience.id);

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-[#08aab9]/10">
      <div className="relative h-56 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-4 left-4">
          <span className="bg-[#03807a] text-white text-xs px-3 py-1 rounded-full">
            {experience.category}
          </span>
        </div>

        {experience.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#e87b1c] text-white text-xs px-3 py-1 rounded-full">
              {t("featured")}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <Link href={`/tienda/${experience.slug}`}>
          <h3 className="text-lg font-semibold text-[#2b2e35] mb-2 hover:text-[#03807a] line-clamp-2">
            {experience.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {experience.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#08aab9]" />
            {experience.location}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#e87b1c]">
              ${experience.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {t("currency")}
            </span>
          </div>

          <Link href={`/tienda/${experience.slug}`}>
            <button
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${inCart
                  ? "bg-green-500 text-white"
                  : "bg-[#03807a] hover:bg-[#02645f] text-white"
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inCart ? t("inCart") : t("add")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] shadow-lg animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function TiendaPage() {
  const t = useTranslations("store");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const { data: experiences, isLoading, error, total, hasMore } =
    useExperiences({
      search: debouncedSearch,
      page,
      pageSize,
    });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#03807a] to-[#08aab9] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          {t("heroTitle")}
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* SEARCH */}
        <div className="mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* COUNT */}
        <p className="text-gray-600 mb-6 text-center">
          {isLoading
            ? t("loading")
            : t("results", { count: total })}
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
            {error.message}
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))
            : experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
        </div>

        {/* EMPTY */}
        {!isLoading && experiences.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">{t("noResults")}</p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#03807a] font-semibold"
            >
              {t("clear")}
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && experiences.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 border rounded-full disabled:opacity-50 hover:border-[#08aab9]"
            >
              {t("prev")}
            </button>

            <span className="font-medium text-gray-600">
              {t("page")} {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="px-5 py-2 border rounded-full disabled:opacity-50 hover:border-[#08aab9]"
            >
              {t("next")}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}