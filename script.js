document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const mainScreen = document.getElementById('main-screen');
    const gameContainer = document.getElementById('game-container');
    const popup = document.getElementById('popup');
    const questionElement = document.getElementById('question');
    const answerElement = document.getElementById('answer');
    let currentQuestion = null;
    let currentStage = 1;
    fetch('./questions/questions.json')
    .then(response => response.json())
    .then(data => {
        const questions = data;
        questions.forEach((q, index) => {
            const sceneDiv = document.createElement('div');
            sceneDiv.className = 'scene hidden';
            sceneDiv.id = `scene${index + 1}`;

            const img = document.createElement('img');
            img.src = `./resources/bg/${index + 1}.jpg`;
            img.alt = `Background ${index + 1}`;
            img.className = 'background-image';
            sceneDiv.appendChild(img);

            const interactiveElement = document.createElement('div');
            interactiveElement.className = 'interactive-element';
            interactiveElement.id = `interactive${index + 1}`;
            interactiveElement.setAttribute('data-index', index + 1);
            sceneDiv.appendChild(interactiveElement);

            gameContainer.appendChild(sceneDiv);
        });

        document.querySelectorAll('.interactive-element').forEach(element => {
            element.addEventListener('click', () => {
                const index = parseInt(element.getAttribute('data-index'));
                const question = questions.find(q => parseInt(q.index) === index);

                if (question) {
                    currentQuestion = question;
                    if (question.video === 'true') {
                        questionElement.innerHTML = `<div class="video-container"><video controls><source src="${question.question}" type="video/mp4"></video></div>`;
                    } else {
                        questionElement.textContent = question.question;
                    }
                    answerElement.textContent = question.answer;
                    questionElement.classList.add('show');
                    popup.style.display = 'block';
                }
            });
        });

        popup.addEventListener('click', (event) => {
            // Prevent the click event from propagating to the video element
            if (event.target.tagName === 'VIDEO') {
                event.stopPropagation();
                return;
            }

            if (currentQuestion && !answerElement.classList.contains('show')) {
                questionElement.classList.remove('show');
                answerElement.classList.add('show');
            } else {
                answerElement.classList.remove('show');
                popup.style.display = 'none';
                if (currentStage < questions.length) {
                    document.getElementById(`scene${currentStage}`).classList.add('hidden');
                    currentStage++;
                    document.getElementById(`scene${currentStage}`).classList.remove('hidden');
                }
            }
        });
    })
    .catch(error => console.error('Error loading questions:', error));
    startButton.addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        document.getElementById(`scene${currentStage}`).classList.remove('hidden');
    });

    
});
