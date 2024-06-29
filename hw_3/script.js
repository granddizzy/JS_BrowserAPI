const unsplashApiKey = '7jYubC3nifxliXTJ0Nad6-2v7oGSfr4lRjuXGmRTEvA';
const apiUrl = 'https://api.unsplash.com/photos/random';

const photoEl = document.querySelector('.photo');
const photoImgEl = photoEl.querySelector('.photo__img');
const photographerEl = photoEl.querySelector('.photo__photographer');
const likeButtonEl = photoEl.querySelector('.photo__like-btn');
const likesCountEl = photoEl.querySelector('.photo__likes');

async function getRandomPhoto() {
  try {
    const response = await fetch(`${apiUrl}`, {
      headers: {'Authorization': `Client-ID ${unsplashApiKey}`}
    });
    if (!response.ok) {
      throw new Error('Failed to fetch random photo');
    }
    const data = await response.json();
    const {urls, user} = data;
    photoImgEl.src = urls.regular;
    photoImgEl.alt = data.alt_description || 'Random Photo';
    photographerEl.textContent = `Photo by ${user.name}`;
    // updateLikesCount(getLikesCount(data.id));
  } catch (error) {
    console.error('Error fetching random photo:', error.message);
  }
}

getRandomPhoto();