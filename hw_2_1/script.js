const slides = getSlides();
const sliderContainerEl = document.querySelector('.slider__container');
slides.forEach(el => {
  sliderContainerEl.append(createSlideNode(el));
});

const sliderItems = sliderContainerEl.querySelectorAll('.slider__item');
const sliderItemsArr = Array.from(sliderItems);
// сдвигаю сразу на 2 чтобы первая картинка стала по центру
sliderItemsArr.unshift(...sliderItemsArr.splice(-2));

let currentSlide = 1;
const totalSlides = slides.length;
const navContainerEl = document.querySelector('.slider__nav');

const intervalValue = 3000;
let intervalId = setInterval(nextSlide, intervalValue);

// добавляем слайды
slides.forEach((el, index) => {
  const navDotEl = document.createElement('div');
  navDotEl.classList.add('slider__nav-dot');
  if (index === 0) navDotEl.classList.add('slider__nav-dot--active');
  navDotEl.setAttribute('data-id', index + 1);
  navContainerEl.append(navDotEl);
});

// событие на точки
navContainerEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('slider__nav-dot')) {
    const currentSlideNum = +e.target.getAttribute('data-id');

    if (currentSlideNum === currentSlide) return;

    if (currentSlideNum < currentSlide) {
      for (let i = currentSlideNum; i < currentSlide; i++) {
        sliderItemsArr.unshift(sliderItemsArr.pop());
      }
    } else {
      for (let i = currentSlide; i < currentSlideNum; i++) {
        sliderItemsArr.push(sliderItemsArr.shift());
      }
    }

    currentSlide = currentSlideNum;
    updateSlidePosition();
    updateNavDots();
    resetInterval();
  }
});

// событие на управление
const sliderControls = document.querySelector('.slider__controls');
sliderControls.addEventListener('click', (e) => {
  if (e.target.classList.contains('slider__control--prev')) {
    nextSlide();
    resetInterval();
  } else if (e.target.classList.contains('slider__control--next')) {
    prevSlide();
    resetInterval();
  }
});

// Добавляем поддержку свайпов
let touchStartX = 0;
let touchEndX = 0;

sliderContainerEl.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

sliderContainerEl.addEventListener('touchmove', (e) => {
  touchEndX = e.changedTouches[0].screenX;
});

sliderContainerEl.addEventListener('touchend', (e) => {
  handleGesture();
});

updateSlidePosition();

function handleGesture() {
  if (touchEndX < touchStartX) {
    nextSlide();
  } else if (touchEndX > touchStartX) {
    prevSlide();
  }
  resetInterval();
}

function resetInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(nextSlide, intervalValue);
}

function prevSlide() {
  currentSlide = (currentSlide > 1) ? currentSlide - 1 : totalSlides;
  sliderItemsArr.unshift(sliderItemsArr.pop());
  updateSlidePosition();
  updateNavDots();
}

function nextSlide() {
  currentSlide = (currentSlide < totalSlides) ? currentSlide + 1 : 1;
  sliderItemsArr.push(sliderItemsArr.shift());
  updateSlidePosition();
  updateNavDots();
}

function updateSlidePosition() {
  sliderItems.forEach(el => {
    el.classList.remove('slider__item-1', 'slider__item-2', 'slider__item-3', 'slider__item-4', 'slider__item-5');
  });

  // слайдов может быть больше 5 поэтому делаем срез
  sliderItemsArr.slice(0, 5).forEach((el, i) => {
    el.classList.add(`slider__item-${i + 1}`);
  });
}

function updateNavDots() {
  const navDots = document.querySelectorAll('.slider__nav-dot');
  navDots.forEach((dot, index) => {
    dot.classList.toggle('slider__nav-dot--active', index === currentSlide - 1);
  });
}

function createSlideNode(slideObj) {
  const slideTemplateEl = document.querySelector('.slider__templateItem');
  const slideNode = slideTemplateEl.content.cloneNode(true);
  slideNode.querySelector('img').setAttribute('src', slideObj.imgPath);
  slideNode.querySelector('img').setAttribute('alt', slideObj.name);
  slideNode.querySelector('.slider__item').setAttribute('data-id', slideObj.id);
  return slideNode;
}

function getSlides() {
  const slidesJson = getInitialData();
  return slidesJson ? JSON.parse(slidesJson) : [];
}

function getInitialData() {
  return `
[
  {
    "id": 1,
    "name": "Картинка 1",
    "imgPath": "./img/1.jpg"
  },
  {
    "id": 2,
    "name": "Картинка 2",
    "imgPath": "./img/2.jpg"
  },
  {
    "id": 3,
    "name": "Картинка 3",
    "imgPath": "./img/3.jpg"
  },
  {
    "id": 4,
    "name": "Картинка 4",
    "imgPath": "./img/4.jpg"
  },
  {
    "id": 5,
    "name": "Картинка 5",
    "imgPath": "./img/5.jpg"
  }
]
`;
}