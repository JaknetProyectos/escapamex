"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { processEtominPayment } from "@/lib/payment";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

type CheckoutForm = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  telefono: string;
  direccion: string;
  city: string;
  state: string;
  cp: string;
  country: string;
  cardNumber: string;
  cardName: string;
  month: string;
  year: string;
  cvv: string;
};

export default function CarritoPage() {
  const t = useTranslations("CarritoPage");
  const locale = useLocale();
  const dateLocale = locale === "en" ? "en-US" : "es-MX";
  const { items, itemCount, total, removeFromCart, updateQuantity, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    telefono: "",
    direccion: "",
    city: "",
    state: "",
    cp: "",
    country: locale === "en" ? "Mexico" : "México",
    cardNumber: "",
    cardName: "",
    month: "",
    year: "",
    cvv: "",
  });

  const orderId = useMemo(() => {
    return `EMX-${Date.now()}`;
  }, [isPaid]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setCheckoutError(null);

    if (items.length === 0) {
      setCheckoutError(t("errors.emptyCart"));
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "telefono",
      "direccion",
      "city",
      "state",
      "cp",
      "country",
      "cardNumber",
      "cardName",
      "month",
      "year",
      "cvv",
    ] as const;

    const hasMissing = requiredFields.some((field) => !String(form[field]).trim());

    if (hasMissing) {
      setCheckoutError(t("errors.missingFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentResponse = await processEtominPayment({
        amount: total,
        orderId,
        cardData: {
          number: form.cardNumber,
          name: form.cardName,
          month: form.month,
          year: form.year,
          cvv: form.cvv,
        },
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          middleName: form.middleName || undefined,
          email: form.email,
          telefono: form.telefono,
          direccion: form.direccion,
          city: form.city,
          state: form.state,
          cp: form.cp,
          country: form.country,
        },
      });

      const checkoutPayload = {
        orderId,
        total,
        currency: "MXN",
        items: items.map((item) => ({
          id: item.experience.id,
          title: item.experience.title,
          category: item.experience.category,
          quantity: item.quantity,
          price: item.experience.price,
          selectedDate: item.selectedDate ?? null,
          image: item.experience.image,
        })),
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          middleName: form.middleName || "",
          email: form.email,
          telefono: form.telefono,
          direccion: form.direccion,
          city: form.city,
          state: form.state,
          cp: form.cp,
          country: form.country,
        },
        paymentResult: paymentResponse,
      };

      const emailResponse = await fetch(`/${locale ?? "es"}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutPayload),
      });

      if (!emailResponse.ok) {
        const result = await emailResponse.json().catch(() => null);
        console.error("Error enviando confirmación:", result);
      }

      clearCart();
      setIsPaid(true);
    } catch (err) {
      const message = t("errors.paymentFailed");
      setCheckoutError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isPaid) {
    return (
      <main className="min-h-screen bg-[#fbfafb]">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t("emptyState.title")}
          </h1>
          <p className="text-gray-600 mb-8">
            {t("emptyState.description")}
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#ea580c] text-white px-8 py-4 rounded-full font-semibold transition-all"
          >
            {t("emptyState.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  if (isPaid) {
    return (
      <main className="min-h-screen bg-[#fbfafb]">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t("paidState.title")}
          </h1>
          <p className="text-gray-600 mb-8">
            {t("paidState.description")}
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-[#4fb6b9] hover:bg-[#027f77] text-white px-8 py-4 rounded-full font-semibold transition-all"
          >
            {t("paidState.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfafb]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {t("header.title", {
              count: itemCount,
            })}
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t("header.clearCart")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.experience.id}
                className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6"
              >
                <Link href={`/tienda/${item.experience.slug}`} className="shrink-0">
                  <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden">
                    <img
                      src={item.experience.image}
                      alt={item.experience.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                <div className="flex-1">
                  <Link href={`/tienda/${item.experience.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-[#4fb6b9] transition-colors">
                      {item.experience.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.experience.category}
                  </p>

                  {item.selectedDate && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(item.selectedDate).toLocaleDateString(dateLocale, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.experience.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.experience.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-[#f59e0b]">
                        ${(item.experience.price * item.quantity).toLocaleString(dateLocale)} MXN
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.experience.price.toLocaleString(dateLocale)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.experience.id)}
                  className="self-start p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Customer form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {t("buyer.title")}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.firstName")} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("buyer.firstNamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.lastName")} *
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("buyer.lastNamePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.email")} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("buyer.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.phone")} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("buyer.phonePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.country")} *
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("buyer.countryPlaceholder")}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.address")} *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("buyer.addressPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.city")} *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("buyer.cityPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.state")} *
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("buyer.statePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("buyer.postalCode")} *
                  </label>
                  <input
                    name="cp"
                    value={form.cp}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("buyer.postalCodePlaceholder")}
                  />
                </div>
              </div>
            </div>

            {/* Payment form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {t("payment.title")}
                </h2>

                <div>
                  <Image src="/etomin.png" width={150} height={30} alt="Visa" className="object-contain" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("payment.cardName")} *
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("payment.cardNamePlaceholder")}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("payment.cardNumber")} *
                  </label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    maxLength={16}
                    inputMode="numeric"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("payment.cardNumberPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("payment.month")} *
                  </label>
                  <input
                    name="month"
                    value={form.month}
                    maxLength={2}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("payment.monthPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("payment.year")} *
                  </label>
                  <input
                    name="year"
                    value={form.year}
                    maxLength={2}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                    placeholder={t("payment.yearPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("payment.cvv")} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      inputMode="numeric"
                      type="password"
                      className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4fb6b9]"
                      placeholder={t("payment.cvvPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {checkoutError && (
                <div className="mt-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-[#f59e0b] hover:bg-[#ea580c] disabled:opacity-60 text-white py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? t("payment.processing") : t("payment.payNow")}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="flex flex-row items-center justify-center p-6">
                <Image src="/secure-payment.png" width={150} height={30} alt="Visa" className="object-contain" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {t("summary.title")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {t("summary.subtotal", { count: itemCount })}
                  </span>
                  <span>${total.toLocaleString(dateLocale)} MXN</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("summary.tax")}</span>
                  <span className="text-green-600">{t("summary.taxValue")}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {t("summary.total")}
                  </span>
                  <span className="text-2xl font-bold text-[#f59e0b]">
                    ${total.toLocaleString(dateLocale)} MXN
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                {t("summary.note")}
              </p>

              <Link
                href="/tienda"
                className="block text-center mt-4 text-[#4fb6b9] hover:underline"
              >
                {t("summary.continueShopping")}
              </Link>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  {t("summary.accepted")}
                </p>
                <div className="flex gap-2">
                  <Image src="/visa.png" width={50} height={30} alt="Visa" className="object-contain" />
                  <Image src="/mastercard.png" width={50} height={30} alt="Mastercard" className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}