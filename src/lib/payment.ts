'use server';

import axios from 'axios';

interface PaymentData {
    amount: number;
    cardData: {
        number: string;
        name: string;
        month: string;
        year: string;
        cvv: string;
    };
    customer: {
        firstName: string;
        lastName: string;
        city: string;
        email: string;
        telefono: string;
        direccion: string;
        state: string;
        middleName?: string;
        cp: string;
        country: string;
    };
    orderId: string;
}

const OCTANO_BASE_URL = 'https://pagos.octanopayments.com/api/v1';

export async function processEtominPayment(payment: PaymentData) {
    try {
        // 1. Autenticación
        const authResponse = await axios.post(
            `${OCTANO_BASE_URL}/signin`,
            {
                email: process.env.OCTANO_USER,
                password: process.env.OCTANO_PASSWORD,
            },
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            }
        );

        const authToken = authResponse.data?.authToken;

        if (!authToken) {
            throw new Error('Error al autenticarse con Octano');
        }

        const config = {
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        };

        // 2. Tokenizar tarjeta
        const tokenResponse = await axios.post(
            `${OCTANO_BASE_URL}/card/tokenizer`,
            {
                cardData: {
                    cardNumber: payment.cardData.number.replace(/\s/g, ''),
                    cardholderName: payment.cardData.name,
                    expirationYear: payment.cardData.year,
                    expirationMonth: payment.cardData.month,
                },
            },
            config
        );

        const cardToken = tokenResponse.data?.cardNumberToken;

        if (!cardToken) {
            throw new Error('No se pudo tokenizar la tarjeta');
        }

        // 3. Venta
        const saleResponse = await axios.post(
            `${OCTANO_BASE_URL}/sale`,
            {
                amount: payment.amount,

                customerInformation: {
                    firstName: payment.customer.firstName,
                    lastName: payment.customer.lastName,
                    middleName: payment.customer.middleName ?? '',
                    email: payment.customer.email,
                    phone1: payment.customer.telefono,
                    city: payment.customer.city,
                    address1: payment.customer.direccion,
                    postalCode: payment.customer.cp,
                    state: payment.customer.state,
                    country: payment.customer.country,
                    ip: '127.0.0.1',
                },

                cardData: {
                    cardNumberToken: cardToken,
                    cvv: payment.cardData.cvv,
                },

                currency: '484',
                reference: payment.orderId,
            },
            config
        );

        return saleResponse.data;

    } catch (error: any) {
        console.error(
            '❌ Error en pasarela Octano:',
            error.response?.data || error.message
        );

        throw new Error(
            error.response?.data?.message ||
            'Error al procesar el pago con Octano'
        );
    }
}