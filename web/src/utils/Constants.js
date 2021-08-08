const prod = {
    url: {
        API_URL: 'https://fr-api.thedreamteamdigitalmarketing.com/v1',
        API_URL_USERS: 'https://fr-api.thedreamteamdigitalmarketing.com',
        BASE_URL: 'https://fr-api.thedreamteamdigitalmarketing.com',
        BROADCAST_URL: 'localhost',
        BROADCAST_KEY: '658ad8bb2f982c7fa645',
        TIMEZONE: "Asia/Manila"
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8000/v1',
        BASE_URL: 'http://localhost:8000',
        BROADCAST_URL: 'localhost',
        BROADCAST_KEY: 'd92ca03f4633b565fe7f',
        TIMEZONE: "Asia/Manila"
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;