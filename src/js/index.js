import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
import FetchImg from './pixabay-api';
import markup from './markup'


const refs = {
    formEl: document.querySelector('.search-form'),
    formInputField: document.querySelector('input[name="searchQuery"]'),
    formBtn: document.querySelector('.submit'),
    imgCard: document.querySelector('.gallery'),
    preloader: document.querySelectorAll('.loader div'),
};

const fetchImg = new FetchImg();
let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

refs.formEl.addEventListener('submit', onSearchImages);

async function onSearchImages(evt) {
    evt.preventDefault();

    fetchImg.inputTitle = evt.currentTarget.elements.searchQuery.value.trim();
    resetMarkup();
    fetchImg.resetPage();
    fetchImg.resetCurrentHits();

    if (fetchImg.inputTitle === '') {
        Notiflix.Notify.warning('Field must not be empty');
        refs.formInputField.value = '';
        return;
    }

    refs.preloader.forEach(e => {
        e.style.display = 'block';
    });

    refs.formInputField.value = '';

    try {
        const data = await fetchImg.fetchImg();
        if (data.totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        } else if (fetchImg.currentHits >= data.totalHits) {
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        } else if (fetchImg.page === 2) {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        };
        
        refs.imgCard.insertAdjacentHTML('beforeend', markup(data.hits));
        gallerySimpleLightbox.refresh();
        refs.preloader.forEach(e => { e.style.display = 'none'; });
    } catch (err) {
        console.log(err);
        resetMarkup();
        refs.preloader.forEach(e => { e.style.display = 'none';  });
    }
}

async function onLoadMore() {
    try {
        const data = await fetchImg.fetchImg();
    
        if (fetchImg.currentHits >= data.totalHits) {
            Notiflix.Notify.warning(
                "We're sorry, but you've reached the end of search results."
            );
        } else {
            refs.imgCard.insertAdjacentHTML('beforeend', markup(data.hits));
            gallerySimpleLightbox.refresh();
            refs.preloader.forEach(e => { e.style.display = 'none'; });
        }
    } catch (err) {
        console.log(err);
    }
    const { height: cardHeight } = refs.imgCard.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}

const onScrollListener = debounce((e) => {
        const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 1) {
        onLoadMore();
    }
}, 200);

window.addEventListener('scroll', onScrollListener);

function resetMarkup() {
    refs.imgCard.innerHTML = '';
}