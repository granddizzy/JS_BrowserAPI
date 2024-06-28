const sliders = getSliders();
const sliderContainerEl = document.querySelector('.slider__container')
sliders.forEach(el => {
  sliderContainerEl.append(createSlideNode(el));
});

let currentSlide = 1;
const totalSlides = sliders.length;
const navContainerEl = document.querySelector('.slider__nav');

const intervalId = setInterval(nextSlide, 5000);

sliders.forEach((el, index) => {
  const navDot = document.createElement('div');
  navDot.classList.add('slider__nav-dot');
  if (index === 0) navDot.classList.add('slider__nav-dot--active');
  navDot.addEventListener('click', () => {
    currentSlide = index + 1;
    updateSlidePosition();
    updateNavDots();
  });
  navContainerEl.append(navDot);
});

const sliderControls = document.querySelector('.slider__controls');
sliderControls.addEventListener('click', (e) => {
  if (e.target.classList.contains('slider__control--prev')) {
    prevSlide();
    clearInterval(intervalId);
  } else if (e.target.classList.contains('slider__control--next')) {
    nextSlide();
    clearInterval(intervalId);
  }
});

function nextSlide() {
  currentSlide = (currentSlide < totalSlides) ? currentSlide + 1 : 1;
  updateSlidePosition();
  updateNavDots();
}

function prevSlide() {
  currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides;
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