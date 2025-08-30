const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { photoData } = JSON.parse(event.body);

        // Ubah data Base64 menjadi buffer
        const buffer = Buffer.from(photoData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        
        // Buat FormData untuk mengirim file
        const formData = new FormData();
        
        // Masukkan token dan chat_id Anda di sini atau sebagai environment variables
        const TELEGRAM_BOT_TOKEN = '7642910841:AAFQTtl2sRrvZxXjYvuFnwI_g8pUIBWWFWc';
        const CHAT_ID = '5764387936';

        formData.append('chat_id', CHAT_ID);
        formData.append('photo', buffer, 'hasil_foto.jpeg');

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        
        if (result.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Foto berhasil dikirim ke Telegram!' })
            };
        } else {
            console.error('Telegram API Error:', result);
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
