import axios from 'axios';
export async function fetchImages(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '39461527-cc44880e901c052d11d5fc552';
  const resp = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return await resp.data;
}