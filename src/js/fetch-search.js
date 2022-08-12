import axios from 'axios';
export { getImages };

const API_KEY = '29175615-30f269a9a3b7d578ba66f288c';

async function getImages(request, page, perPage) {
  try {
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
