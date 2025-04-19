import axios from 'axios';

/**
 * Base API configuration with default settings
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all notations for a user with optional date filtering
 * 
 * @param {string} name - User's name
 * @param {string} startDate - Optional start date (YYYY/MM/DD format)
 * @param {string} endDate - Optional end date (YYYY/MM/DD format)
 * @returns {Promise} - Promise with notation data
 */
export const getUserNotations = async (name, startDate = null, endDate = null) => {
  let url = `/notations/${name}`;
  const params = {};
  
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notations:', error);
    throw error;
  }
};

/**
 * Get statistical information about user's notations
 * 
 * @param {string} name - User's name
 * @param {number} days - Number of days to analyze
 * @returns {Promise} - Promise with stats data
 */
export const getNotationStats = async (name, days = 30) => {
  try {
    const response = await api.get(`/notations/stats/${name}`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notation stats:', error);
    throw error;
  }
};

/**
 * Get raw input entries for a user
 * 
 * @param {string} name - User's name
 * @param {number} limit - Maximum number of entries to return
 * @returns {Promise} - Promise with input data
 */
export const getUserInputs = async (name, limit = 50) => {
  try {
    const response = await api.get(`/inputs/${name}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching inputs:', error);
    throw error;
  }
};

/**
 * Get latest input entry for a user
 * 
 * @param {string} name - User's name
 * @returns {Promise} - Promise with latest input data
 */
export const getLatestInput = async (name) => {
  try {
    const response = await api.get(`/inputs/latest/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest input:', error);
    throw error;
  }
};

/**
 * Get AI-generated outputs for a user
 * 
 * @param {string} name - User's name
 * @param {number} limit - Maximum number of entries to return
 * @returns {Promise} - Promise with AI output data
 */
export const getUserAIOutputs = async (name, limit = 10) => {
  try {
    const response = await api.get(`/ai-output/${name}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI outputs:', error);
    throw error;
  }
};

/**
 * Get latest AI-generated output for a user
 * 
 * @param {string} name - User's name
 * @returns {Promise} - Promise with latest AI output data
 */
export const getLatestAIOutput = async (name) => {
  try {
    const response = await api.get(`/ai-output/latest/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest AI output:', error);
    throw error;
  }
}; 