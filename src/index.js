import { getImages } from './js/fetch-search';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let simpleLightBox;
let request = '';
let page = 1;
const perPage = 40;

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;
  request = inputEl.value.trim();

  if (request !== '') {
    getImages(request, page, perPage)
      .then(data => {
        if (data.hits.length === 0) {
          loadMoreBtn.classList.add('is-hidden');
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          galleryEl.innerHTML = '';
          insertGallery(data.hits);
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          simpleLightBox = new SimpleLightbox('.gallery a').refresh();
          loadMoreBtn.classList.remove('is-hidden');
        }
      })
      .catch(error => console.log(error));
  } else {
    Notify.info('Enter your request in the field');
  }
}

function onLoadMore() {
  page += 1;
  getImages(request, page, perPage)
    .then(data => {
      if (page > data.totalHits / perPage) {
        loadMoreBtn.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else insertGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    })
    .catch(error => console.log(error));
}

const createGallery = item =>
  `<a href="${item.largeImageURL}" class="photo-link">
      <div class="photo-card">
        <img class="photo-img" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes:<br> ${item.likes}</b></p>
            <p class="info-item"><b>Views:<br> ${item.views}</b></p>
            <p class="info-item"><b>Comments:<br> ${item.comments}</b></p>
            <p class="info-item"><b>Downloads:<br> ${item.downloads}</b></p>
        </div>
    </div>
  </a>`;

const generateGallery = array =>
  array.reduce((acc, item) => acc + createGallery(item), '');

const insertGallery = array => {
  const result = generateGallery(array);
  galleryEl.insertAdjacentHTML('beforeend', result);
};
