if (!localStorage.getItem('lessons')) {
  localStorage.setItem('lessons', getInitialData());
}

const lessons = loadLessonsFromLocalStorage();
const lessonsContainerEl = document.querySelector('.lessonsContainer')
lessons.forEach((el) => {
  lessonsContainerEl.append(createLessonNode(el))
})

lessonsContainerEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('lessonButtons__signup')) {
    const lessonEl = e.target.closest('.lesson');
    lessonSignup(+lessonEl.getAttribute('data-id'));
  } else if (e.target.classList.contains('lessonButtons__cancel')) {
    const lessonEl = e.target.closest('.lesson');
    lessonCancel(+lessonEl.getAttribute('data-id'));
  }
})

function lessonSignup(lessonId) {
  const lessonObj = getLessonById(lessonId);
  if (lessonObj && lessonObj.currentParticipants < lessonObj.maxParticipants) {
    lessonObj.currentParticipants++;
    lessonObj.enrolled = true;
    updateLessonNode(lessonObj);
    saveToLocalStorage(lessons);
  }
}

function lessonCancel(lessonId) {
  const lessonObj = getLessonById(lessonId);
  if (lessonObj && lessonObj.enrolled) {
    lessonObj.currentParticipants--;
    lessonObj.enrolled = false;
    updateLessonNode(lessonObj);
    saveToLocalStorage(lessons);
  }
}

function getLessonById(lessonId) {
  return lessons.find(el => el.id === lessonId);
}

function loadLessonsFromLocalStorage() {
  const storedLessons = localStorage.getItem('lessons');
  return storedLessons ? JSON.parse(storedLessons) : [];
}

function saveToLocalStorage(lessons) {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

function createLessonNode(lessonObj) {
  const lessonTemplateEl = document.querySelector('.lessonTemplate');
  const lessonNode = lessonTemplateEl.content.cloneNode(true);
  lessonNode.querySelector('.lesson').setAttribute('data-id', lessonObj.id);
  lessonNode.querySelector('.lesson__name').textContent = lessonObj.name;
  lessonNode.querySelector('.lesson__time').textContent = lessonObj.time;
  lessonNode.querySelector('.lesson__maxParticipants').textContent = lessonObj.maxParticipants;
  lessonNode.querySelector('.lesson__currentParticipants').textContent = lessonObj.currentParticipants;
  checkLessonButtons(lessonNode, lessonObj);
  return lessonNode;
}

function getInitialData() {
  return `
[
  {
    "id": 1,
    "name": "Йога",
    "time": "10:00 - 11:00",
    "maxParticipants": 15,
    "currentParticipants": 15
  },
  {
    "id": 2,
    "name": "Пилатес",
    "time": "11:30 - 12:30",
    "maxParticipants": 10,
    "currentParticipants": 5
  },
  {
    "id": 3,
    "name": "Кроссфит",
    "time": "13:00 - 14:00",
    "maxParticipants": 20,
    "currentParticipants": 15
  },
  {
    "id": 4,
    "name": "Танцы",
    "time": "14:30 - 15:30",
    "maxParticipants": 12,
    "currentParticipants": 10
  },
  {
    "id": 5,
    "name": "Бокс",
    "time": "16:00 - 17:00",
    "maxParticipants": 8,
    "currentParticipants": 6
  }
]
`;
}

function checkLessonButtons(lessonEl, lessonObj) {
  const lessonButtonSignupEl = lessonEl.querySelector('.lessonButtons__signup');
  lessonButtonSignupEl.disabled = lessonObj.enrolled || lessonObj.currentParticipants >= lessonObj.maxParticipants;

  const lessonButtonCancelEl = lessonEl.querySelector('.lessonButtons__cancel');
  lessonButtonCancelEl.disabled = !lessonObj.enrolled;
}

function updateLessonNode(lessonObj) {
  const lessonEl = document.querySelector(`.lesson[data-id="${lessonObj.id}"]`);
  if (lessonEl) {
    lessonEl.querySelector('.lesson__currentParticipants').textContent = lessonObj.currentParticipants;
    checkLessonButtons(lessonEl, lessonObj);
  }
}