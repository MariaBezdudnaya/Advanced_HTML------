let prevBtn;
let nextBtn;
let submitBtn;

let currentStep = 1; // текущий шаг

let inputsInStep = -1; // количество инпутов в текущем шаге, равен -1, чтобы при сравнении сразу они не были равны
let validInput = 0; // количество валидных инпутов

function showStep() { // Функция обновляющая инпуты в зависимости от шага:
  const steps = document.querySelectorAll('.form-step');
  steps.forEach((step, idx) => {
    if (idx + 1 === currentStep) { // если текущий шаг равен idx + 1, 
      step.style.display = 'block'; // то отображаем этот шаг
    } else {
      step.style.display = 'none'; // иначе скрываем
    }
  });

  if (currentStep === steps.length) { // если текущий шаг последний
    nextBtn.style.display = 'none'; // скрываем кнопку далее
    submitBtn.style.display = 'block'; // и отображаем кнопку отправить
  } else {
    nextBtn.style.display = 'block'; // иначе отображаем кнопку далее
    submitBtn.style.display = 'none'; // и скрываем кнопку отправить
  }

  if (currentStep > 1) { // если текущий шаг не первый
    prevBtn.style.display = 'block'; // отображаем кнопку назад
  } else {
    prevBtn.style.display = 'none'; // иначе скрываем
  }

  setButtonEnabled();
}

function prevStep() { // функция перехода на предыдущий шаг
  unsubscribeInputsChange(); // отписываемся от изменений инпутов при переходе на следующий шаг, если валидация прошла
  currentStep--;
  showStep();
  subscribeInputsChange(); // подписываемся на изменения инпутов
  updateStepsIndicators(1); // если текущий шаг например 2, то мы его уменьшили на 1, поэтому увеличиваем индикатор на 1, чтобы показать предыдущий шаг
}

function nextStep() { // функция перехода на следующий шаг
  if (!validateStep()) return;
  unsubscribeInputsChange(); // отписываемся от изменений инпутов
  currentStep++;
  showStep(); // показываем все нужные инпуты, обновляем счётчики
  subscribeInputsChange(); // подписываемся на изменения инпутов
  updateStepsIndicators(-1); // обновляем индикаторы
}

function updateStepsIndicators(diff) { // функция индикаторов шага формы
  const currentIndicator = document.querySelector(`#step-${currentStep}`); // получаем индикатор текущего шага
  const prevIndicator = document.querySelector(`#step-${currentStep + diff}`); // получаем индикатор предыдущего шага

  if (prevIndicator) { // если индикатор предыдущего шага существует
    prevIndicator.removeAttribute('data-active'); // удаляем активный класс из индикатора предыдущего шага
  }
  if (currentIndicator) { // если индикатор текущего шага существует
    currentIndicator.setAttribute('data-active', ''); // добавляем активный класс к текущему индикатору
  }
}

function validateStep () { // функция валидации формы
  const inputs = document.querySelectorAll(`.form#form-step-${currentStep} .input`); // получаем все инпуты
  let isValid = true; // по умолчанию степ корректен, все его инпуты валидны

  for (const input of inputs) { // для каждого инпута
    isValid = validateInput(input) && isValid; // проверяем валидность, передавая в функцию текущий инпут, и если всё валидно, то возвращается true
  }

  return isValid;
}

function validateInput (input) { // функция валидации ввода
  const errorTextContainer = document.querySelector(`p#${input.getAttribute('name')}-error`); // получаем сообщение об ошибке

  let isInputValid = true; // по умолчанию ввод корректен

  if (!input.checkValidity()) { // если ввод некорректен
    isInputValid = false; // то ввод некорректен
    errorTextContainer.innerHTML = input.validationMessage; // отображаем сообщение об ошибке
  } else {
    errorTextContainer.innerHTML = ''; // иначе скрываем сообщение об ошибке
  }

  if (input.name === 'email' && !/[a-zA-Z0-9]+@[a-zA-Z0-9]+\./.test(input.value)) { // валидация email: только email
    isInputValid = false;
    errorTextContainer.innerHTML = 'Введите корректный email.';
  } else if (input.name === 'phone' && !/^\+7\(\d{3}\)-\d{3}-\d{4}$/.test(input.value)) { // валидация телефона: только телефон
    isInputValid = false;
    errorTextContainer.innerHTML = 'Неверный формат.';
  }

  return isInputValid; // возвращаем результат валидации
}

function onInputChange(e) { // подписываемся на изменения инпута
  if (validateInput(e.target)) { // если ввод в текущем инпуте корректен
      validInput++; // увеличиваем количество валидных инпутов
  }
  setButtonEnabled(); // проверяем нужные и ненужные кнопки
}

function subscribeInputsChange() { // вешаем обработчик собитий на каждом шаге
  const inputs = document.querySelectorAll(`.form-step#form-step-${currentStep} .input`); // получаем все инпуты на текущем шаге

  inputsInStep = inputs.length; // обновляем количество инпутов в текущем шаге
  validInput = 0; // обнуляем количество валидных инпутов

  inputs.forEach(input => input.addEventListener('change', onInputChange)); // подписываем обработчик событий на каждый инпут
}

function unsubscribeInputsChange() { // убираем обработчик собитий при изменении шага
  const inputs = document.querySelectorAll(`.form-step#form-step-${currentStep} .input`); // получаем все инпуты на текущем шаге

  inputs.forEach(input => input.removeEventListener('change', onInputChange)); // убираем обработчик событий на каждый инпут
}

function setButtonEnabled() { // функция включения кнопки, пока не заполнена и корректна форма
  const shouldBeEnabled = inputsInStep === validInput; // если количество валидных инпутов равно количеству инпутов в текущем шаге
  const btn = submitBtn.style.display !== 'none' ? submitBtn : nextBtn; // если кнопка отправить существует, тогда мы на последнем шаге и мы должны показать кнопку отправить, если нет, то мы должны показать кнопку далее

  if (shouldBeEnabled) { // если нужно включить кнопку
    btn.removeAttribute('disabled'); // убираем атрибут disabled
  } else {
    btn.setAttribute('disabled', 1); // иначе добавляем
  }
}

function sendForm(e) { // функция отправки формы
  e.preventDefault(); // отменяем стандартное поведение браузера
  alert('Форма отправлена!');

  const formData = new FormData(e.target);
  const data = {};
  for (const [key, value] of formData) {
    data[key] = value;
  }

  // После отправки формы очищаем все поля формы
  const inputs = document.querySelectorAll('.input');
  inputs.forEach(input => {
    input.value = '';
    input.classList.remove('valid');
  });

  // Убираем активный класс с последнего шага
  const steps = document.getElementById('step-3');
  steps.removeAttribute('data-active');

  currentStep = 1;
  updateStepsIndicators(currentStep);
  subscribeInputsChange();
  showStep();
}

window.addEventListener('load', () => {
  const form = document.forms.namedItem('contact-form'); // получаем форму
  form.addEventListener('submit', sendForm); // подписываемся на события submit

  prevBtn = document.getElementById('prev-step-btn');
  nextBtn = document.getElementById('next-step-btn');
  submitBtn = document.getElementById('submit-form-btn');

  subscribeInputsChange();
  showStep();
});