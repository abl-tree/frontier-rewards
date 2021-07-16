const prod = {
    url: {
        API_URL: 'https://fr-api.thedreamteamdigitalmarketing.com/v1',
        API_URL_USERS: 'https://fr-api.thedreamteamdigitalmarketing.com',
        BASE_URL: 'https://fr-api.thedreamteamdigitalmarketing.com',
        BROADCAST_URL: 'localhost',
        BROADCAST_KEY: 'FRPUSHERKEY',
        TIMEZONE: "Asia/Manila"
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8000/v1',
        BASE_URL: 'http://localhost:8000',
        BROADCAST_URL: 'localhost',
        // BROADCAST_KEY: 'FRPUSHERKEY'
        BROADCAST_KEY: 'ca3b395b209c42fd56c7',
        TIMEZONE: "Asia/Manila"
    }
};

export const config = process.env.NODE_ENV == 'development' ? dev : prod;