import dayjs from 'dayjs';

const API_KEY = '87de9079e74c828116acce677f6f255b';
const BASE_URL = 'https://api.themoviedb.org/3';

// Simple in-memory cache matching AngularJS $http cache: true behavior
const cache = new Map();

async function makeRequest(url, params = {}) {
  let requestUrl = `${BASE_URL}/${url}?api_key=${API_KEY}`;
  Object.entries(params).forEach(([key, value]) => {
    requestUrl += `&${key}=${value}`;
  });

  if (cache.has(requestUrl)) {
    return cache.get(requestUrl);
  }

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      console.error('You are unauthorised to access the requested resource (401)');
      throw new Error('Unauthorized (401)');
    }
    if (response.status === 404) {
      console.error('The requested resource could not be found (404)');
      throw new Error('Not Found (404)');
    }
    if (response.status === 500) {
      console.error('Internal server error (500)');
      throw new Error('Server Error (500)');
    }

    const data = await response.json();
    cache.set(requestUrl, data);
    return data;
  } catch (error) {
    console.error('XHR Failed for ShowService');
    console.error(error);
    throw error;
  }
}

export async function getPremieres() {
  // Get first day of the current month — same logic as original
  const date = new Date();
  date.setDate(1);
  const formatted = dayjs(date).format('DD-MM-YYYY');
  const data = await makeRequest('discover/tv', {
    'first_air_date.gte': formatted,
    'append_to_response': 'genres',
  });
  return data.results;
}

export async function getShow(id) {
  return makeRequest(`tv/${id}`, {});
}

export async function getCast(id) {
  return makeRequest(`tv/${id}/credits`, {});
}

export async function searchShows(query) {
  const data = await makeRequest('search/tv', { query });
  return data.results;
}

export async function getPopular() {
  const data = await makeRequest('tv/popular', {});
  return data.results;
}
