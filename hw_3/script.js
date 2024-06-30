const unsplashApiKey = '7jYubC3nifxliXTJ0Nad6-2v7oGSfr4lRjuXGmRTEvA';
const user = 'granddizzy';
const apiUrl = 'https://api.unsplash.com';

const photoEl = document.querySelector('.random-photo');
const photoImgEl = photoEl.querySelector('.random-photo__img');
const photographerEl = photoEl.querySelector('.random-photo__photographer');
const descriptionEl = photoEl.querySelector('.random-photo__description');
const likeButtonEl = photoEl.querySelector('.random-photo__like-btn');
const likesCountEl = photoEl.querySelector('.random-photo__likes');
const likedPhotosEl = document.querySelector('.liked-photos');
const modalEl = document.getElementById("modal");
const modalUnlikeBtnEl = modalEl.querySelector(".modal__unlike-btn");

//showRandomPhoto();
showLikedPhotos();

// открытие модального окна
likedPhotosEl.addEventListener('click', (e) => {
  const likedPhoto = e.target.closest('.liked-photo');
  if (likedPhoto) {
    // const description = likedPhoto.querySelector('.random-photo__description').textContent;
    modalEl.setAttribute('data-id', likedPhoto.getAttribute('data-id'));
    modalEl.querySelector('img').src = likedPhoto.querySelector('img').src;
    // modalEl.querySelector('.modal__description').textContent = description;
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
});

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
    photoEl.setAttribute('data-id', data.id);
    photoImgEl.src = urls.regular;
    photoImgEl.alt = data.alt_description || 'Random Photo';
    photographerEl.textContent = `Photo by ${user.name}`;
    descriptionEl.textContent = data.description;
    updateLikesCount(data.likes);
    updateLikeButton(data.liked_by_user);
  } catch (error) {
    console.error('Error fetching random photo:', error.message);
  }
}

async function showLikedPhotos() {
  const likedPhotos = await getLikedPhotos();
  likedPhotos.forEach((el) => {
    likedPhotosEl.append(createLikedPhotoNode(el));
  })
}

function createLikedPhotoNode(likedPhotoObj) {
  const likedPhotoTemplateEl = document.querySelector('.liked-photo__template');
  const likedPhotoNode = likedPhotoTemplateEl.content.cloneNode(true);
  likedPhotoNode.querySelector('.liked-photo').setAttribute('data-id', likedPhotoObj.id);
  likedPhotoNode.querySelector('.liked-photo__image').src = likedPhotoObj.url;
  // likedPhotoNode.querySelector('.liked-photo__image').alt = likedPhotoObj.description;
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
  likesCountEl.textContent = likeCount;
}

function likeButtonHandler() {
  const photoId = photoEl.getAttribute('data-id');
  const photoUrl = photoImgEl.src;
  const photoDescription = photoEl.alt;
  likePhoto(photoId, photoUrl, photoDescription);
  updateLikesCount(+likesCountEl.textContent + 1);
  updateLikeButton(photoId);
}

function unlikeButtonHandler(e) {
  const photoId = photoEl.getAttribute('data-id');
  unlikePhoto(photoId);
  updateLikesCount(+likesCountEl.textContent - 1);
  updateLikeButton(photoId);
}

function updateLikeButton(photoId) {
  if (checkLikedPhoto(photoId)) {
    likeButtonEl.textContent = 'UnLike';
    likeButtonEl.removeEventListener('click', likeButtonHandler);
    likeButtonEl.addEventListener('click', unlikeButtonHandler);
  } else {
    likeButtonEl.textContent = 'Like';
    likeButtonEl.removeEventListener('click', unlikeButtonHandler);
    likeButtonEl.addEventListener('click', likeButtonHandler);
  }
}

function checkLikedPhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  return index >= 0;
}

function likePhoto(id, url, description) {
  const likedPhotos = loadLikedPhotos();
  likedPhotos.push({'id': id, 'url': url, 'description': description});
  saveLikedPhotos(likedPhotos);
}

function unlikePhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  likedPhotos.splice(index, 1);
  saveLikedPhotos(likedPhotos);
}

async function getLikedPhotos() {
  return loadLikedPhotos();
}