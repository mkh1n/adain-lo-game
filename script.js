document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const switchButton = document.getElementById('switchButton');
    const titanContainer = document.getElementById('titanContainer');
    const mainScreen = document.getElementById('main-screen');
    const gameContainer = document.getElementById('game-container');
    const popup = document.getElementById('popup');
    const mossElements = document.querySelectorAll('.mossEl'); // Используем querySelectorAll для выбора всех элементов с классом mossEl
    const questionElement = document.getElementById('question');
    const answerElement = document.getElementById('answer');
    const victoryScreen = document.getElementById('victory-screen');
    let currentQuestion = null;
    let currentStage = 1;

    // Function to preload images
    function preloadImage(src) {
        const img = new Image();
        img.src = src;
        img.style.display = 'none'; // Hide the image
        document.body.appendChild(img);
    }

    fetch('./questions/questions.json')
    .then(response => response.json())
    .then(data => {
        const questions = data;

        // Preload background images
        questions.forEach((q, index) => {
            preloadImage(`./resources/bg/${index + 1}.jpg`);
        });

        // Preload interactive elements
        questions.forEach((q, index) => {
            preloadImage(`./resources/interactive-elements/${index + 1}.png`);
        });

        // Preload videos if any
        questions.forEach(q => {
            if (q.video === 'true') {
                const video = document.createElement('video');
                video.src = q.question;
                video.style.display = 'none'; // Hide the video
                document.body.appendChild(video);
            }
        });

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

            // Add false-interactive-element with 50% probability
            if (Math.random() < 0.5) {
                const falseInteractiveElement = document.createElement('div');
                falseInteractiveElement.className = 'false-interactive-element';
                falseInteractiveElement.id = `false-interactive${index + 1}`;
                falseInteractiveElement.setAttribute('data-index', index + 1);
                sceneDiv.appendChild(falseInteractiveElement);
            }

            gameContainer.appendChild(sceneDiv);
        });

        document.querySelectorAll('.interactive-element').forEach(element => {
            element.addEventListener('click', () => {
                const index = parseInt(element.getAttribute('data-index'));
                const question = questions.find(q => parseInt(q.index) === index);

                if (question) {
                    currentQuestion = question;
                    questionElement.innerHTML = ''; // Clear previous content
                    if (question.video === 'true') {
                        const parts = question.question.split(';');
                        const questionText = parts[0].trim();
                        const videoPath = parts[1].trim();

                        questionElement.innerHTML = `${questionText}<div class="video-container"><video controls><source src="${videoPath}" type="video/mp4"></video></div>`;
                    } else {
                        const parts = question.question.split(';');
                        const questionText = parts[0].trim();
                        const imagePaths = parts.slice(1).map(path => path.trim());

                        questionElement.innerText = questionText;

                        if (question.hasImages === 'true') {
                            const imageContainer = document.createElement('div');
                            imageContainer.className = 'image-container';
                            imagePaths.forEach(path => {
                                const img = document.createElement('img');
                                img.src = path;
                                img.className = 'question-image';
                                imageContainer.appendChild(img);
                            });
                            questionElement.appendChild(imageContainer);
                        }
                    }
                    answerElement.textContent = question.answer;
                    questionElement.classList.add('show');
                    popup.style.display = 'block';
                }
            });
        });

        switchButton.addEventListener('click', (event) => {
            titanContainer.classList.toggle('showTitanContainer');
        });

        mossElements.forEach((mossElement) => {
            mossElement.addEventListener('click', (e) => {
                mossElement.classList.add('visibleMoss');
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
                } else {
                    // Show victory screen
                    victoryScreen.style.display = 'block';
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
