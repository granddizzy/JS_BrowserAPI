const sliders = getSliders();
const sliderContainerEl = document.querySelector('.slider__container')
sliders.forEach(el => {
  sliderContainerEl.append(createSlideNode(el));
});

let currentSlide = 0;
const totalSlides = sliders.length;
const navContainerEl = document.querySelector('.slider__nav');

sliders.forEach((el, index) => {
  const navDot = document.createElement('div');
  navDot.classList.add('slider__nav-dot');
  if (index === 0) navDot.classList.add('slider__nav-dot--active');
  navDot.addEventListener('click', () => {
    currentSlide = index;
    updateSlidePosition();
    updateNavDots();
  });
  navContainerEl.append(navDot);
});

document.querySelector('.slider__control--prev').addEventListener('click', () => {
  currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
  updateSlidePosition();
  updateNavDots();
});

document.querySelector('.slider__control--next').addEventListener('click', () => {
  currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
  updateSlidePosition();
  updateNavDots();
});

function updateSlidePosition() {
  const offset = -currentSlide * 100;
  sliderContainerEl.style.transform = `translateX(${offset}%)`;
}

function updateNavDots() {
  const navDots = document.querySelectorAll('.slider__nav-dot');
  navDots.forEach((dot, index) => {
    dot.classList.toggle('slider__nav-dot--active', index === currentSlide);
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

function getSliders() {
  const slidersJson = getInitialData();
  return slidersJson ? JSON.parse(slidersJson) : [];
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