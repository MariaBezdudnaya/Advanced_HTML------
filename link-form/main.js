let submitBtn;
let validInput = 0; // количество валидных инпутов
let inputsInForm = 0; // количество инпутов

function validateInput (input) { // функция валидации формы
  const errorTextContainer = document.getElementById(`${input.getAttribute('name')}-error`); // получаем сообщение об ошибке

  let isInputValid = true; // по умолчанию ввод корректен

  if (!input.checkValidity()) { // если ввод некорректен
    isInputValid = false; // то ввод некорректен
    errorTextContainer.innerHTML = input.validationMessage; // отображаем сообщение об ошибке
  } else {
    errorTextContainer.innerHTML = ''; // иначе скрываем сообщение об ошибке
  }

  // Валидация email: только email
  if (input.name === 'email' && !/[a-zA-Z0-9]+@[a-zA-Z0-9]+\./.test(input.value)) {
    isInputValid = false;
    errorTextContainer.innerHTML = 'Введите корректный email.';
  }

  if (input.name === 'phone' && !/^\+7\(\d{3}\)-\d{3}-\d{4}$/.test(input.value)) {
    isInputValid = false;
    errorTextContainer.innerHTML = 'Введите номер телефона в формате +7(ХХХ)-ХХХ-ХХХХ.';
  }

  // Валидация загружаемого файла: только JPEG
  if (input.name === 'cv' && input.files.length > 0) {
      const file = input.files[0];
      if (!['image/jpeg'].includes(file.type)) {
        isInputValid = false;
        errorTextContainer.innerHTML = 'Допускаются только JPEG файлы.';
      }
  }

  return isInputValid; // возвращаем результат валидации
}

function onInputChange(e) { // подписываемся на изменения инпута
  const isInputValid = validateInput(e.target); // проверяем валидность инпута
  
  if (isInputValid) { // если ввод в текущем инпуте корректен
    if (!e.target.classList.contains('valid')) { // если инпут еще не помечен как валидный
      validInput++; // увеличиваем количество валидных инпутов
      e.target.classList.add('valid'); // помечаем инпут как валидный
    }
  } else {
    if (e.target.classList.contains('valid')) { // если инпут помечен как валидный
      validInput--; // уменьшаем количество валидных инпутов
      e.target.classList.remove('valid'); // убираем метку валидности
    }
  }

  setButtonEnabled(); // проверяем нужные и ненужные кнопки
}

function subscribeInputsChange() {
  const inputs = document.querySelectorAll('.input'); // получаем все инпуты
  inputsInForm = inputs.length; // количество инпутов

  inputs.forEach(input => input.addEventListener('change', onInputChange)); //  вешаем обработчик событий на каждый инпут
  inputs.forEach(input => input.addEventListener('input', onInputChange)); //  вешаем обработчик событий на каждый инпут
}


function setButtonEnabled() { // функция включения кнопки, пока не заполнена и корректна форма
  const shouldBeEnabled = inputsInForm === validInput; // если количество валидных инпутов равно количеству инпутов в текущем шаге
  submitBtn.disabled = !shouldBeEnabled; // включает или отключает кнопку
}

function sendForm(e) { // функция отправки формы
  e.preventDefault(); // отменяем стандартное поведение браузера

  const formData = new FormData(event.target);
  const data = {};
  for (const [key, value] of formData) {
    data[key] = value;
  }
  console.log('Форма отправлена:', data);
  
  alert('Ваше сообщение отправлено.');

    // После отправки формы очищаем все поля
    const inputs = document.querySelectorAll('.input');
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('valid');
    });
    validInput = 0;
    setButtonEnabled();
}

window.addEventListener('load', () => {
  submitBtn = document.getElementById('submit-form-btn'); // получаем кнопку
  subscribeInputsChange();
  setButtonEnabled();
  
  document.querySelector('.form').addEventListener('submit', sendForm);// добавляем обработчик события отправки формы
});