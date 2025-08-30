const axios = require('axios');
const FormData = require('form-data');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { photoData } = JSON.parse(event.body);

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7642910841:AAFQTtl2sRrvZxXjYvuFnwI_g8pUIBWWFWc';
        const CHAT_ID = process.env.CHAT_ID || '5764387936';

        const buffer = Buffer.from(photoData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', buffer, {
            filename: 'hasil_foto.jpeg',
            contentType: 'image/jpeg',
        });

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        if (response.data.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Foto berhasil dikirim ke Telegram!' })
            };
        } else {
            console.error('Telegram API Error:', response.data);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Gagal mengirim foto ke Telegram.' })
            };
        }
    } catch (error) {
        console.error('Server Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Terjadi kesalahan pada server.', error: error.message })
        };
    }
};
