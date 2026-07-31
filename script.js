// Если на странице есть форма теста — запускаем логику прохождения вопросов
if (document.querySelector('.container__form')) {
    const img = document.querySelector('.container__img');
    const label = document.querySelector('.container__text');
    const form = document.querySelector('.container__form');
    const input = document.querySelector('.container__input');
    const button = document.querySelector('.container__button');

    // Массив вопросов
    const questions = [
        {
            img: "img/1.png",
            label: "Тюмень"
        },
        {
            img: "img/2.png",
            label: "Зелень"
        },
        {
            img: "img/3.png",
            label: "Ашан"
        },
        {
            img: "img/4.png",
            label: "Каток"
        },
        {
            img: "img/5.png",
            label: "Каток"
        }
    ]
    
    // Массив для сохранения ответов пользователя
    const results = [];
    
    // Индекс текущего вопроса
    let currentQuestion = 0;
    
    // Отображает текущий вопрос
    function renderQuestion() {
        const question = questions[currentQuestion];
        img.src = question.img;
        label.textContent = `Напечатай: ${question.label}`;
        input.value = "";
        button.disabled = true;
    }
    
    // Функция обновления пагинации
    function updatePagination() {
        const paginationButtons = document.querySelectorAll('.pagination__button');
        const currentButton = paginationButtons[currentQuestion];
    
        currentButton.classList.remove('pagination__button--active');
        currentButton.classList.add('pagination__button--done');
    
        const nextButton = paginationButtons[currentQuestion + 1];
        if (nextButton) {
            nextButton.classList.add('pagination__button--active');
        }
    }
    
    // Переход на страницу с таблицей результатов
    function showResults() {
        window.location.href = 'result.html';
        if (currentQuestion === questions.length - 1) {
            updatePagination();
        }
    }
    
    renderQuestion();

    // Сбрасывает поле ввода после возврата на страницу из истории браузера
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            input.value = "";
            button.disabled = true;
        }
    });
    
    // Кнопка активна только тогда, когда пользователь вводит значение в поле
    input.addEventListener('input', () => {
        if (input.value.trim() === '') {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    })
    
    /* Обработка отправки формы:
       сохраняем ответ, проверяем, последний ли это вопрос,
       либо переключаемся на следующий */
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const answer = {
            question: questions[currentQuestion],
            userAnswer: input.value
        }
        results.push(answer);
        localStorage.setItem('results', JSON.stringify(results));
    
        if (currentQuestion === questions.length - 1) {
            showResults();
            return;
        }
    
        updatePagination();
        currentQuestion++;
        renderQuestion();
        input.value = "";
        button.disabled = true;
        input.focus();
    })
}

// Подставляем значения вводов пользователя в таблицу результатов
if (document.querySelector('.table__body')) {
    const savedResults = JSON.parse(localStorage.getItem('results')) || [];
    const answerCells = document.querySelectorAll('.table__cell--answer');
    const paginationButtons = document.querySelectorAll('.pagination__button');
    const testImg = document.querySelectorAll('.icon');

    // Все страницы, кроме последней помечены как сделанные
    for (let i = 0; i < paginationButtons.length - 1; i++) {
        paginationButtons[i].classList.add('pagination__button--done');
        paginationButtons[i].classList.remove('pagination__button--active');
    }

    // Кнопку последней страницы делаем активной
    paginationButtons[paginationButtons.length - 1].classList.add('pagination__button--active');

    // Показываем галочку или крестик в зависимости от того, верно ли введ пользователь слово или с ошибкой
    for (let i = 0; i < savedResults.length; i++) {
        answerCells[i].textContent = savedResults[i].userAnswer;
        testImg[i].src = savedResults[i].userAnswer === savedResults[i].question.label ? "img/ok.png" : "img/error.png";
    }
}

// Сбрасываем прогресс
const resetBtn = document.querySelector('.reset__btn');
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('results');
    window.location.href = 'index.html'
})