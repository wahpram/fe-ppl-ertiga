// services/apiService.js
import axios from 'axios';

const BASE_URL = 'https://be.bitloka.top';

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};
