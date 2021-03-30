const prod = {
    url: {
        API_URL: 'https://fr-api.thedreamteamdigitalmarketing.com/v1',
        API_URL_USERS: 'https://fr-api.thedreamteamdigitalmarketing.com'
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8000/v1'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;