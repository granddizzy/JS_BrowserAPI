const slides = getSlides();
const sliderContainerEl = document.querySelector('.slider__container');
slides.forEach(el => {
  sliderContainerEl.append(createSlideNode(el));
});

let currentSlide = 1;
const totalSlides = slides.length;
const navContainerEl = document.querySelector('.slider__nav');

const intervalValue = 3000;
let intervalId = setInterval(nextSlide, intervalValue);

navContainerEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('slider__nav-dot')) {
    currentSlide = +e.target.getAttribute('data-id');
    updateSlidePosition();
    updateNavDots();
  }
});

slides.forEach((el, index) => {
  const navDotEl = document.createElement('div');
  navDotEl.classList.add('slider__nav-dot');
  if (index === 0) navDotEl.classList.add('slider__nav-dot--active');
  navDotEl.setAttribute('data-id', index + 1);
  navContainerEl.append(navDotEl);
});

const sliderControls = document.querySelector('.slider__controls');
sliderControls.addEventListener('click', (e) => {
  if (e.target.classList.contains('slider__control--prev')) {
    prevSlide();
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, intervalValue);
  } else if (e.target.classList.contains('slider__control--next')) {
    nextSlide();
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, intervalValue);
  }
});

function nextSlide() {
  currentSlide = (currentSlide < totalSlides) ? currentSlide + 1 : 1;
  updateSlidePosition();
  updateNavDots();
}

function prevSlide() {
  currentSlide = (currentSlide > 1) ? currentSlide - 1 : totalSlides;
  updateSlidePosition();
  updateNavDots();
}

function updateSlidePosition() {
  const offset = -(currentSlide - 1) * 100;
  sliderContainerEl.style.transform = `translateX(${offset}%)`;
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