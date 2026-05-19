'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import React, { useState } from 'react'
import { CreditCard, CheckCircle, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAlert } from '@/context/AlertContext'
import { Link } from '@/i18n/routing'

export default function Page() {
    const t = useTranslations('payQuote')
    const { showAlert, hideAlert } = useAlert()

    const { addToCart } = useCart()

    const [cotizacion, setCotizacion] = useState('')
    const [price, setPrice] = useState<number | "">("");
    const [added, setAdded] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!cotizacion) {
            showAlert({
                type: "error",
                title: "Error",
                message: t('form.error')
            })
            return
        }

        const experience = {
            id: `custom-${cotizacion}`,
            slug: `quote-${cotizacion}`,
            title: `Quote #${cotizacion}`,
            category: 'custom',
            description: `Custom quote #${cotizacion}`,
            shortDescription: 'Custom experience',
            price: Number(price),
            currency: 'MXN',
            image: '/favicon.png',
            images: [],
            included: [],
            duration: 'Custom',
            location: 'Mexico',
            rating: 0,
            reviews: 0,
            featured: false
        }

        addToCart(experience, 1, new Date().toDateString())
        setAdded(true)
    }

    return (
        <>
            <Header />

            {/* HERO */}
            <section className="bg-gradient-to-r from-[#03807a] to-[#08aab9] text-white py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    {t('hero.title')}
                </h1>
                <p className="text-white/90 max-w-2xl mx-auto">
                    {t('hero.description')}
                </p>
            </section>

            <div className="min-h-screen bg-[#f9ffff] flex items-center justify-center px-4 py-16">
                <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">

                    {/* VISUAL */}
                    <div className="relative">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#fcb239]/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#e87b1c]/20 rounded-full blur-2xl" />

                        <div className="bg-white rounded-[2rem] shadow-xl p-10 flex justify-center border border-[#08aab9]/20">
                            <Image
                                src="/favicon.png"
                                alt="plane"
                                width={260}
                                height={260}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* FORM */}
                    <div>
                        {added ? (
                            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-[#08aab9]/20 text-center">
                                <div className="w-20 h-20 bg-[#03807a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-[#03807a]" />
                                </div>

                                <h2 className="text-2xl font-bold text-[#2b2e35] mb-4">
                                    {t('success.title')}
                                </h2>

                                <p className="text-gray-600 mb-6">
                                    {t('success.description')}
                                </p>

                                <Link
                                    href="/carrito"
                                    className="inline-flex items-center gap-2 bg-[#e87b1c] hover:bg-[#cc6713] text-white px-6 py-3 rounded-full font-semibold"
                                >
                                    {t('success.cta')}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white rounded-[2rem] p-8 shadow-xl border border-[#08aab9]/20"
                            >
                                <div className="flex items-center gap-2 mb-6 text-[#03807a]">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-semibold">{t('form.title')}</span>
                                </div>

                                <div className="space-y-6">

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">
                                            {t('form.quoteNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            value={cotizacion}
                                            onChange={(e) => setCotizacion(e.target.value)}
                                            className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none"
                                            placeholder={t('form.quotePlaceholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">
                                            {t('form.price')}
                                        </label>
                                        <input
                                            type="number"
                                            value={price}
                                            min={0}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                if (value === "") {
                                                    setPrice("");
                                                    return;
                                                }

                                                setPrice(Number(value));
                                            }}
                                            className="w-full mt-2 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#08aab9] focus:ring-2 focus:ring-[#08aab9]/20 outline-none"
                                            placeholder={t('form.pricePlaceholder')}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-[#03807a] hover:bg-[#02645f] text-white py-3 rounded-full font-semibold"
                                    >
                                        {t('form.submit')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}