import axios from 'axios';

// Create an Axios instance with base CoinGecko API or standard fallbacks
const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  }
});

// Helper functions for crypto price data
export const getLivePrices = async (ids = 'bitcoin,ethereum,arbitrum') => {
  try {
    const response = await apiClient.get('/simple/price', {
      params: {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_market_cap: 'true',
        include_24hr_vol: 'true',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching live prices:', error);
    throw error;
  }
};

export default apiClient;
