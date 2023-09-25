export default function markup(img) {
    return img
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
          <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width='370'/></a>
          <div class="info">
          <div class="info-item">
          <p>
          <b>Likes: </b><br>${likes}
          </p>
          </div>
          <div class="info-item">
          <p>
          <b>Views: </b><br>${views}
          </p>
          </div>
          <div class="info-item">
          <p>
          <b>Comments: </b><br>${comments}
          </p>
          </div>
          <div class="info-item">
          <p>
          <b>Downloads: </b><br>${downloads}
          </p>
          </div>
          </div>
          </div>`;
        }
      )
      .join('');
  }