const unsplashApiKey = '7jYubC3nifxliXTJ0Nad6-2v7oGSfr4lRjuXGmRTEvA';
const user = 'granddizzy';
const apiUrl = 'https://api.unsplash.com';

const randomPhotoEl = document.querySelector('.random-photo');
const randomPhotoImgEl = randomPhotoEl.querySelector('.random-photo__img');
const randomPhotographerEl = randomPhotoEl.querySelector('.random-photo__photographer');
const randomDescriptionEl = randomPhotoEl.querySelector('.random-photo__description');
const randomLikeButtonEl = randomPhotoEl.querySelector('.random-photo__like-btn');
const randomLikesCountEl = randomPhotoEl.querySelector('.random-photo__likes');

const likedPhotosEl = document.querySelector('.liked-photos');
const likedPhotosContainerEl = document.querySelector('.liked-photos__container');
const likedPhotosNavigationEl = document.querySelector('.liked-photos__navigation');
const likedPhotosPrevButtonEl = likedPhotosNavigationEl.querySelector('.liked-photos__prev-button');
const likedPhotosNextButtonEl = likedPhotosNavigationEl.querySelector('.liked-photos__next-button');

const modalEl = document.getElementById("modal");
const modalUnlikeBtnEl = modalEl.querySelector(".modal__unlike-btn");
const modalDescriptionEl = modalEl.querySelector(".modal__description");
const modalPhotographerEl = modalEl.querySelector(".modal__photographer");
const modalImgEl = modalEl.querySelector(".modal__img");

let likedPhotosPage = 1;

showRandomPhoto();
showLikedPhotos(likedPhotosPage);

// открытие модального окна
likedPhotosEl.addEventListener('click', (e) => {
  const likedPhoto = e.target.closest('.liked-photo');
  if (likedPhoto) {
    modalEl.setAttribute('data-id', likedPhoto.getAttribute('data-id'));
    modalImgEl.src = likedPhoto.querySelector('img').src;
    modalDescriptionEl.textContent = likedPhoto.querySelector('.liked-photo__description').textContent;
    modalPhotographerEl.textContent = likedPhoto.querySelector('.liked-photo__photographer').textContent;
    openModalWindow();
  }
});

// закрытие модального окна
window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModalWindow();
  }
});

// событие кнопки модального окна
modalUnlikeBtnEl.addEventListener('click', e => {
  const photoId = modalEl.getAttribute('data-id');
  unlikePhoto(photoId);
  closeModalWindow();
  showLikedPhotos(likedPhotosPage);
});

// события навигации лайкнутыми изображениями
likedPhotosNavigationEl.addEventListener('click', e => {
  if (e.target.classList.contains('liked-photos__prev-button')) {
    likedPhotosPage--;
    likedPhotosPrev();
  } else if (e.target.classList.contains('liked-photos__next-button')) {
    likedPhotosPage++;
    likedPhotosNext();
  }
})

function likedPhotosPrev() {
  const offset = -(likedPhotosPage - 1) * 100;
  showLikedPhotos(likedPhotosPage);
}

function likedPhotosNext() {
  const offset = -(likedPhotosPage + 1) * 100;
  showLikedPhotos(likedPhotosPage);
}

function closeModalWindow() {
  modalEl.classList.remove("show");
  setTimeout(() => {
    modalEl.style.display = "none";
  }, 300);
}

function openModalWindow() {
  modalEl.style.display = "block";
  setTimeout(() => {
    modalEl.classList.add("show");
  }, 10);
}

/**
 * Функция показа случайной фотографии
 * @returns {Promise<void>}
 */
async function showRandomPhoto() {
  try {
    const request = '/photos/random';
    const response = await fetch(`${apiUrl}${request}`, {
      headers: {'Authorization': `Client-ID ${unsplashApiKey}`}
    });
    if (!response.ok) {
      throw new Error('Failed to fetch random photo');
    }
    const data = await response.json();
    const {urls, user} = data;
    randomPhotoEl.setAttribute('data-id', data.id);
    randomPhotoImgEl.src = urls.regular;
    randomPhotoImgEl.alt = data.alt_description || 'Random Photo';
    randomPhotographerEl.textContent = `${user.name}`;
    randomDescriptionEl.textContent = data.description;
    updateLikesCount(data.likes);
    updateLikeButton(data.liked_by_user);
  } catch (error) {
    console.error('Error fetching random photo:', error.message);
  }
}

function showLikedPhotos(page) {
  const likedPhotos = getLikedPhotos();

  const perPage = 5;
  const allPages = Math.ceil(likedPhotos.length / perPage);

  if (page > allPages) {
    page = allPages;
    likedPhotosPage = allPages;
  }

  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;
  const pageLikedPhotos = likedPhotos.slice(startIdx, endIdx);

  likedPhotosContainerEl.style.opacity = '0';

  setTimeout(() => {
    likedPhotosContainerEl.innerHTML = '';
    pageLikedPhotos.forEach((el) => {
      likedPhotosContainerEl.append(createLikedPhotoNode(el));
    })
  }, 320);

  setTimeout(() => {
    likedPhotosContainerEl.style.opacity = '1';
  }, 320);

  // контроль доступности кнопок навигации
  likedPhotosPrevButtonEl.disabled = page === 1;
  likedPhotosNextButtonEl.disabled = page === allPages;
}

function createLikedPhotoNode(likedPhotoObj) {
  const likedPhotoTemplateEl = document.querySelector('.liked-photo__template');
  const likedPhotoNode = likedPhotoTemplateEl.content.cloneNode(true);
  likedPhotoNode.querySelector('.liked-photo').setAttribute('data-id', likedPhotoObj.id);
  const likedImg = likedPhotoNode.querySelector('.liked-photo__image');
  likedImg.src = likedPhotoObj.url;
  likedImg.alt = likedPhotoObj.description;
  likedPhotoNode.querySelector('.liked-photo__photographer').textContent = likedPhotoObj.photographer;
  likedPhotoNode.querySelector('.liked-photo__description').textContent = likedPhotoObj.description;
  return likedPhotoNode;
}

function saveLikedPhotos(likedPhotos) {
  localStorage.setItem('likedPhotos', JSON.stringify(likedPhotos));
}

function loadLikedPhotos() {
  const storedLikedPhotos = localStorage.getItem('likedPhotos');
  return storedLikedPhotos ? JSON.parse(storedLikedPhotos) : [];
}

function updateLikesCount(likeCount) {
  randomLikesCountEl.textContent = likeCount;
}

function likeButtonHandler() {
  const photoId = randomPhotoEl.getAttribute('data-id');
  const photoUrl = randomPhotoImgEl.src;
  const photoDescription = randomPhotoEl.querySelector('.random-photo__description').textContent;
  ;
  const photographer = randomPhotoEl.querySelector('.random-photo__photographer').textContent;
  likePhoto(photoId, photoUrl, photoDescription, photographer);
  updateLikesCount(+randomLikesCountEl.textContent + 1);
  updateLikeButton(photoId);
}

function unlikeButtonHandler(e) {
  const photoId = randomPhotoEl.getAttribute('data-id');
  unlikePhoto(photoId);
  updateLikesCount(+randomLikesCountEl.textContent - 1);
  updateLikeButton(photoId);
}

function updateLikeButton(photoId) {
  if (checkLikedPhoto(photoId)) {
    randomLikeButtonEl.textContent = 'UnLike';
    randomLikeButtonEl.removeEventListener('click', likeButtonHandler);
    randomLikeButtonEl.addEventListener('click', unlikeButtonHandler);
  } else {
    randomLikeButtonEl.textContent = 'Like';
    randomLikeButtonEl.removeEventListener('click', unlikeButtonHandler);
    randomLikeButtonEl.addEventListener('click', likeButtonHandler);
  }
}

function checkLikedPhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  return index >= 0;
}

function likePhoto(id, url, description, photographer) {
  const likedPhotos = loadLikedPhotos();
  likedPhotos.push({'id': id, 'url': url, 'description': description, 'photographer': photographer});
  saveLikedPhotos(likedPhotos);
}

function unlikePhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  likedPhotos.splice(index, 1);
  saveLikedPhotos(likedPhotos);
}

function getLikedPhotos() {
  return loadLikedPhotos();
}