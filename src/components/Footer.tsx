"use client";

import Image from "next/image";
import { FileText, Store, ShieldCheck, Receipt } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocaleContext } from "@/context/LocaleContext";

export function Footer() {
  const t = useTranslations("Footer");
  
  const {switchLanguage,isPending,locale} = useLocaleContext()

  return (
    <footer className="bg-[#03807a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/favicon.png" width={50} height={30} alt="Logo" className="object-contain" />
              <Image src="/title.png" width={150} height={30} alt="Title" className="object-contain brightness-0 invert" />
            </div>
            <p className="text-white/80 max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#fcb239]">
              {t("plansTitle.line1")}<br />{t("plansTitle.line2")}
            </h3>

            <ul className="space-y-4">
              <li>
                <Link href="/cotiza-tu-plan" className="flex items-center gap-2 text-white/80 hover:text-[#fcb239] transition-colors">
                  <FileText className="w-4 h-4" /> {t("quotePlan")}
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="flex items-center gap-2 text-white/80 hover:text-[#fcb239] transition-colors">
                  <Store className="w-4 h-4" /> {t("experiences")}
                </Link>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="flex gap-4 mt-8">
              <div className="rounded px-4 py-2 flex items-center gap-2 bg-white/10 backdrop-blur-sm">
                <div className="bg-white rounded px-2 py-1 flex items-center h-6">
                  <span className="text-blue-800 font-black text-[10px]">VISA</span>
                </div>

                <div className="bg-white rounded px-2 py-1 flex items-center h-6">
                  <div className="flex">
                    <div className="w-3 h-3 bg-[#eb001b] rounded-full -mr-1" />
                    <div className="w-3 h-3 bg-[#f79e1b] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Language Switch */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => switchLanguage("es")}
                className={`px-3 py-1 rounded text-sm ${locale === "es" ? "bg-[#fcb239] text-black" : "bg-white/10"}`}
              >
                ES
              </button>
              <button
                onClick={() => switchLanguage("en")}
                className={`px-3 py-1 rounded text-sm ${locale === "en" ? "bg-[#fcb239] text-black" : "bg-white/10"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#08aab9]/30">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            {t("rights")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link href="/legal/terminos" className="flex items-center gap-1 text-white/70 hover:text-[#fcb239] transition-colors">
              <ShieldCheck className="w-4 h-4" /> {t("terms")}
            </Link>
            <Link href="/legal/privacidad" className="flex items-center gap-1 text-white/70 hover:text-[#fcb239] transition-colors">
              <FileText className="w-4 h-4" /> {t("privacy")}
            </Link>
            <Link href="/legal/reembolsos" className="flex items-center gap-1 text-white/70 hover:text-[#fcb239] transition-colors">
              <Receipt className="w-4 h-4" /> {t("refunds")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}