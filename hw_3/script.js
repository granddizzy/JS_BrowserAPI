const unsplashApiKey = '7jYubC3nifxliXTJ0Nad6-2v7oGSfr4lRjuXGmRTEvA';
const apiUrl = 'https://api.unsplash.com';

const randomPhotoEl = document.querySelector('.random-photo');
const randomPhotoImgEl = randomPhotoEl.querySelector('.random-photo__img');
const randomPhotographerEl = randomPhotoEl.querySelector('.random-photo__photographer');
const randomDescriptionEl = randomPhotoEl.querySelector('.random-photo__description');
const randomLikeButtonEl = randomPhotoEl.querySelector('.random-photo__like-btn');
const randomNextButtonEl = randomPhotoEl.querySelector('.random-photo__next-btn');
const randomLikesCountEl = randomPhotoEl.querySelector('.random-photo__likes');

const likedPhotosEl = document.querySelector('.liked-photos');
const likedPhotosContainerEl = document.querySelector('.liked-photos__container');
const likedPhotosNavigationEl = document.querySelector('.liked-photos__navigation');
const likedPhotosPrevButtonEl = likedPhotosNavigationEl.querySelector('.liked-photos__prev-button');
const likedPhotosNextButtonEl = likedPhotosNavigationEl.querySelector('.liked-photos__next-button');
const likedPhotosAllPageEl = likedPhotosNavigationEl.querySelector('.liked-photos__allPages');
const likedPhotosPageEl = likedPhotosNavigationEl.querySelector('.liked-photos__page');

const modalEl = document.getElementById("modal");
const modalUnlikeBtnEl = modalEl.querySelector(".modal__unlike-btn");
const modalDescriptionEl = modalEl.querySelector(".modal__description");
const modalPhotographerEl = modalEl.querySelector(".modal__photographer");
const modalImgEl = modalEl.querySelector(".modal__img");

const scriptURL = document.currentScript.src;
const scriptURLObj = new URL(scriptURL);
const scriptDir = scriptURLObj.origin + scriptURLObj.pathname.substring(0, scriptURLObj.pathname.lastIndexOf('/'));

let likedPhotosPage = 1;
const likedPhotosPerPage = 4;

showRandomPhoto();
showLikedPhotos(likedPhotosPage);

// событие кнопки следующей случайной фотки
randomNextButtonEl.addEventListener('click', e => {
  showRandomPhoto();
})

// событие открытия модального окна
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

// событие кнопки модального окна
modalUnlikeBtnEl.addEventListener('click', e => {
  const photoId = modalEl.getAttribute('data-id');
  unlikePhoto(photoId);
  closeModalWindow();

  if (randomPhotoEl.getAttribute('data-id') === photoId) {
    updateRandomPhotoLikeButton(false);
    updateRandomPhotoLikesCount(randomLikesCountEl.textContent = +randomLikesCountEl.textContent - 1);
  }

  showLikedPhotos(likedPhotosPage);
});

// события навигации лайкнутыми фотографиями
likedPhotosNavigationEl.addEventListener('click', e => {
  if (e.target.classList.contains('liked-photos__prev-button')) {
    likedPhotosPage--;
    showLikedPhotos(likedPhotosPage);
  } else if (e.target.classList.contains('liked-photos__next-button')) {
    likedPhotosPage++;
    showLikedPhotos(likedPhotosPage);
  }
})

/**
 * Закрывает модальное окно просмотра лайкнутой фотографии
 */
function closeModalWindow() {
  modalEl.classList.remove("show");
  setTimeout(() => {
    modalEl.style.display = "none";
  }, 300);
}

/**
 * Ручка закрытия модального окна просмотра лайкнутой фотографии
 */
function handleCloseModalWindow(e) {
  if (e.target === modalEl) {
    closeModalWindow();

    // удаляем обработчик закрытия при клике вне окна
    window.removeEventListener('click', handleCloseModalWindow);
  }
}

/**
 * Открывает модальное окно просмотра лайкнутой фотографии
 */
function openModalWindow() {
  // событие закрытия модального окна
  window.addEventListener('click', handleCloseModalWindow);

  modalEl.style.display = "block";
  setTimeout(() => {
    modalEl.classList.add("show");
  }, 10);

  modalImgEl.onload = () => {
    modalImgEl.style.opacity = '1';
  };
}

/**
 * Показывает случайную фотографию
 * @returns {Promise<void>}
 */
async function showRandomPhoto() {
  const data = await getRandomPhoto();
  const {urls, user} = data;

  randomPhotoImgEl.style.opacity = '0';

  randomPhotoEl.setAttribute('data-id', data.id);
  randomPhotoImgEl.alt = data.alt_description || 'Random Photo';
  randomPhotographerEl.textContent = `${user.name}`;
  randomDescriptionEl.textContent = data.description;

  const isLiked = isLikedPhoto(data.id) ? 1 : 0;
  updateRandomPhotoLikesCount(data.likes + (isLiked ? 1 : 0));
  updateRandomPhotoLikeButton(isLiked);

  setTimeout(() => {
    randomPhotoImgEl.src = urls.regular;
  }, 300);

  randomPhotoImgEl.onload = () => {
    randomPhotoImgEl.style.opacity = '1';
  };
}

/**
 * Запрашивает и получает случайную фотографию с сервера
 * @returns {Promise<any>}
 */
async function getRandomPhoto() {
  try {
    const request = '/photos/random';
    const response = await fetch(`${apiUrl}${request}`, {
      headers: {'Authorization': `Client-ID ${unsplashApiKey}`}
    });

    if (!response.ok) {
      throw new Error('Failed to fetch random photo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching random photo:', error.message);
    showErrorConnection(error.message);
  }
}

/**
 * Показывает изображение ошибки соединения
 */
function showErrorConnection(errorMessage) {
  randomPhotoEl.setAttribute('data-id', '');
  randomPhotoImgEl.alt = '';
  randomPhotographerEl.textContent = ``;
  randomDescriptionEl.textContent = errorMessage;
  updateRandomPhotoLikeButton(false);

  randomPhotoImgEl.src = `${scriptDir}/img/404.jpg`;
  randomPhotoImgEl.style.opacity = '1';
}

/**
 * Выводит список лайнутых фотографий согласно номеру страницы
 * @param page
 */
function showLikedPhotos(page) {
  const likedPhotos = loadLikedPhotos();

  const allPages = Math.ceil(likedPhotos.length / likedPhotosPerPage);

  if (page > allPages) {
    page = allPages;

    if (allPages > 0) likedPhotosPage = allPages;
  }

  const startIdx = (page - 1) * likedPhotosPerPage;
  const endIdx = startIdx + likedPhotosPerPage;
  const pageLikedPhotos = likedPhotos.slice(startIdx, endIdx);

  // контроль доступности кнопок навигации
  likedPhotosPrevButtonEl.disabled = page <= 1;
  likedPhotosNextButtonEl.disabled = page >= allPages;

  // проходим по массиву и заменяем или добавляем нужные фотографии
  const displayedLikedPhotos = likedPhotosContainerEl.querySelectorAll('.liked-photo');
  for (let i = 0; i < pageLikedPhotos.length; i++) {
    if (displayedLikedPhotos.length >= i + 1) {
      if (displayedLikedPhotos[i].getAttribute('data-id') !== pageLikedPhotos[i].id) {
        const newNode = createLikedPhotoNode(pageLikedPhotos[i]);
        const likedPhotoEl = newNode.querySelector('.liked-photo');
        setTimeout(() => {
          likedPhotoEl.style.opacity = '1';
        }, 50);

        displayedLikedPhotos[i].replaceWith(newNode);
      }
    } else {
      const newNode = createLikedPhotoNode(pageLikedPhotos[i]);
      const likedPhotoEl = newNode.querySelector('.liked-photo');
      setTimeout(() => {
        likedPhotoEl.style.opacity = '1';
      }, 50);

      likedPhotosContainerEl.append(newNode);
    }
  }

  // проверим лишние фотографии
  const numberUnnecessaryPhotos = displayedLikedPhotos.length - pageLikedPhotos.length;
  if (numberUnnecessaryPhotos > 0) {
    for (let i = 1; i <= numberUnnecessaryPhotos; i++) {
      displayedLikedPhotos[displayedLikedPhotos.length - i].remove();
    }
  }

  likedPhotosPageEl.textContent = page;
  likedPhotosAllPageEl.textContent = allPages;
}

/**
 * Создает и возвращает узел лайкнутой фотографии
 * @param likedPhotoObj
 * @returns {Node}
 */
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

/**
 * Загружает лайкнутые фоки из localStarage
 * @returns {any|*[]}
 */
function loadLikedPhotos() {
  const storedLikedPhotos = localStorage.getItem('likedPhotos');
  return storedLikedPhotos ? JSON.parse(storedLikedPhotos) : [];
}

function updateRandomPhotoLikesCount(likeCount) {
  randomLikesCountEl.textContent = likeCount;
}

/**
 * Ручка для установки лайка фотографии
 */
function likeButtonHandler() {
  const photoId = randomPhotoEl.getAttribute('data-id');
  const photoUrl = randomPhotoImgEl.src;
  const photoDescription = randomPhotoEl.querySelector('.random-photo__description').textContent;
  const photographer = randomPhotoEl.querySelector('.random-photo__photographer').textContent;
  likePhoto(photoId, photoUrl, photoDescription, photographer);
  updateRandomPhotoLikesCount(+randomLikesCountEl.textContent + 1);
  updateRandomPhotoLikeButton(true);
  showLikedPhotos(likedPhotosPage);
}

/**
 * Ручка для снятия лайка фотографии
 * @param e
 */
function unlikeButtonHandler(e) {
  const photoId = randomPhotoEl.getAttribute('data-id');
  unlikePhoto(photoId);
  updateRandomPhotoLikesCount(+randomLikesCountEl.textContent - 1);
  updateRandomPhotoLikeButton(false);
  showLikedPhotos(likedPhotosPage);
}

/**
 * Обновляет состояние кнопки LIKE у случайной фотографии
 * @param isLiked
 */
function updateRandomPhotoLikeButton(isLiked) {
  const photoId = randomPhotoEl.getAttribute('data-id');
  if (!photoId) {
    randomLikeButtonEl.disabled = true;
    return;
  }
  randomLikeButtonEl.disabled = false;

  if (isLiked) {
    randomLikeButtonEl.textContent = 'UnLike';
    randomLikeButtonEl.removeEventListener('click', likeButtonHandler);
    randomLikeButtonEl.addEventListener('click', unlikeButtonHandler);
  } else {
    randomLikeButtonEl.textContent = 'Like';
    randomLikeButtonEl.removeEventListener('click', unlikeButtonHandler);
    randomLikeButtonEl.addEventListener('click', likeButtonHandler);
  }
}

/**
 * Проверяет по ID лайкнута ли фотография
 * @param photoId
 * @returns {boolean}
 */
function isLikedPhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  return index >= 0;
}

/**
 * Лайкает фотографию
 * @param id
 * @param url
 * @param description
 * @param photographer
 */
function likePhoto(id, url, description, photographer) {
  if (!isLikedPhoto(id)) {
    const likedPhotos = loadLikedPhotos();
    likedPhotos.push({'id': id, 'url': url, 'description': description, 'photographer': photographer});
    saveLikedPhotos(likedPhotos);
  }
}

/**
 * Отменяет лайк фотографии
 * @param photoId
 */
function unlikePhoto(photoId) {
  const likedPhotos = loadLikedPhotos();
  const index = likedPhotos.findIndex(e => e.id === photoId);
  if (index >= 0) {
    likedPhotos.splice(index, 1);
    saveLikedPhotos(likedPhotos);
  }
}