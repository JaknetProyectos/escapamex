"use client";

import { Link } from "@/i18n/routing";
import {
  Phone,
  Mail,
  ShoppingCart,
  Menu,
  X,
  Home,
  FileText,
  Contact,
  CreditCard,
  Store
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Header() {
  const { itemCount, total } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("Header");

  return (
    <header className="w-full top-0 z-10">
      {/* Top Contact Bar */}
      <div className="bg-[#03807a] text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#fcb239]" />
            <span>{t("phone")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#fcb239]" />
            <span>{t("email")}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white py-4 px-4 shadow-md border-b border-[#08aab9]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Image src="/favicon.png" width={50} height={30} alt="Logo" className="object-contain" />
              <Image src="/title.png" width={150} height={30} alt="Title" className="object-contain" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium">
              <Home className="w-4 h-4" /> {t("home")}
            </Link>

            <Link href="/cotiza-tu-plan" className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium">
              <FileText className="w-4 h-4" /> {t("quotePlan")}
            </Link>

            <Link href="/contacto" className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium">
              <Contact className="w-4 h-4" /> {t("contact")}
            </Link>

            <Link href="/paga-tu-cotizacion/" className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium">
              <CreditCard className="w-4 h-4" /> {t("payQuote")}
            </Link>

            <Link href="/tienda" className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium">
              <Store className="w-4 h-4" /> {t("store")}
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/carrito"
              className="relative p-2 rounded-full border border-[#08aab9]/30 hover:border-[#e87b1c] transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-[#e87b1c]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fcb239] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}

              {/* Cart preview on hover */}
              {itemCount > 0 && (
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-3 min-w-[200px] border border-[#08aab9]/20">
                  <p className="text-sm text-gray-600">
                    {itemCount} {t("items")}
                  </p>
                  <p className="text-lg font-bold text-[#e87b1c]">
                    ${total.toLocaleString("es-MX")} MXN
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("viewCart")}
                  </p>
                </div>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#03807a]" />
              ) : (
                <Menu className="w-6 h-6 text-[#03807a]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 border-[#08aab9]/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" /> {t("home")}
              </Link>

              <Link
                href="/tienda"
                className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Store className="w-4 h-4" /> {t("store")}
              </Link>

              <Link
                href="/cotiza-tu-plan"
                className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" /> {t("quotePlan")}
              </Link>

              <Link
                href="/contacto"
                className="flex items-center gap-2 text-gray-700 hover:text-[#03807a] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Contact className="w-4 h-4" /> {t("contact")}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}