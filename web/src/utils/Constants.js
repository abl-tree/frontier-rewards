const prod = {
    url: {
        API_URL: 'https://fr-api.thedreamteamdigitalmarketing.com/v1',
        API_URL_USERS: 'https://fr-api.thedreamteamdigitalmarketing.com',
        BROADCAST_URL: 'localhost',
        BROADCAST_KEY: 'FRPUSHERKEY'
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8000/v1',
        BASE_URL: 'http://localhost:8000',
        BROADCAST_URL: 'localhost',
        BROADCAST_KEY: 'FRPUSHERKEY'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;