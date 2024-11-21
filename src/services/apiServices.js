import axios from 'axios';

const BASE_URL = 'https://be.bitloka.top';

export const getData = async (endpoint, { limit } = {}) => {
  try {
    const url = limit 
      ? `${BASE_URL}/${endpoint}?limit=${limit}` 
      : `${BASE_URL}/${endpoint}`;
    
    const response = await axios.get(url);
    return {
      data: response.data,
      total: response.data.length
    };
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};