import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';
import { fetchImages } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityLoad, options);

let page = 1;

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  list: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

refs.form.addEventListener('submit', onInputName);

async function onInputName(evt) {
  evt.preventDefault();

  const name = refs.input.value;
  if (!name) {
    return;
  }
  page = 1;
  try {
    const data = await fetchImages(name, page);
    if (!data.total) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      return;
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    const markup = createMarkup(data);
    newMarkup(markup);
    lightbox.refresh();
    observer.observe(refs.guard);
  } catch (error) {
    createErrorMessage(error);
  }
}

function createMarkup(data) {
  const markup = data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `   
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <br>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          <br>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          <br>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <br>${downloads}
        </p>
      </div>
    </div>`
  );
  return markup.join('');
}

function newMarkup(markup) {
  refs.list.innerHTML = markup;
}

function addMarkup(markup) {
  refs.list.insertAdjacentHTML('beforeend', markup);
}

function createErrorMessage(err) {
  Notify.failure(`${err}`);
}

async function onInfinityLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchImages(refs.input.value, page)
        .then(data => {
          const markup = createMarkup(data);
          addMarkup(markup);
          lightbox.refresh();
          if (data.totalHits / 40 <= page) {
            observer.unobserve(refs.guard);
            Notify.success(
              `We're sorry, but you've reached the end of search results.`
            );
          }
        })
        .catch(createErrorMessage);
    }
  });
}

const lightbox = new SimpleLightbox('.gallery a');
