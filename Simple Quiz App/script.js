            const quizData = [
            {
                question: "What is the capital of France?",
                answers: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                answers: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
                correct: 2
            },
            {
                question: "Who wrote the play 'Romeo and Juliet'?",
                answers: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
                correct: 1
            },
            {
                question: "What is the chemical symbol for gold?",
                answers: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            }
        ];

    
        let currentQuestion = 0;
        let selectedAnswers = [];
        let score = 0;
        let startTime = Date.now();
        let timerInterval;

        
        const questionText = document.getElementById('question-text');
        const answersContainer = document.getElementById('answers-container');
        const currentQuestionSpan = document.getElementById('current-question');
        const totalQuestionsSpan = document.getElementById('total-questions');
        const questionNumber = document.getElementById('question-number');
        const progressFill = document.getElementById('progress-fill');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const quizContent = document.querySelector('.quiz-content');
        const resultsContainer = document.getElementById('results-container');
        const finalScore = document.getElementById('final-score');
        const scoreMessage = document.getElementById('score-message');
        const scoreDetails = document.getElementById('score-details');
        const timerElement = document.getElementById('timer');

        
        function initQuiz() {
            totalQuestionsSpan.textContent = quizData.length;
            selectedAnswers = new Array(quizData.length).fill(null);
            loadQuestion();
            startTimer();
        }

        
        function startTimer() {
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                timerElement.textContent = `${minutes}:${seconds}`;
            }, 1000);
        }

        
        function loadQuestion() {
            const question = quizData[currentQuestion];
            questionText.textContent = question.question;
            questionNumber.textContent = `Question ${currentQuestion + 1}`;
            currentQuestionSpan.textContent = currentQuestion + 1;
            
            
            const progress = ((currentQuestion) / quizData.length) * 100;
            progressFill.style.width = `${progress}%`;

            
            answersContainer.innerHTML = '';

            
            question.answers.forEach((answer, index) => {
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-option';
                answerElement.innerHTML = `<div class="answer-text">${answer}</div>`;
                
            
                if (selectedAnswers[currentQuestion] === index) {
                    answerElement.classList.add('selected');
                }

                answerElement.addEventListener('click', () => selectAnswer(index));
                answersContainer.appendChild(answerElement);
            });

            
            prevBtn.disabled = currentQuestion === 0;
            prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
            
            if (currentQuestion === quizData.length - 1) {
                nextBtn.classList.add('hidden');
                submitBtn.classList.remove('hidden');
                submitBtn.disabled = selectedAnswers[currentQuestion] === null;
            } else {
                nextBtn.classList.remove('hidden');
                submitBtn.classList.add('hidden');
                nextBtn.disabled = selectedAnswers[currentQuestion] === null;
            }
        }

        
        function selectAnswer(answerIndex) {
            selectedAnswers[currentQuestion] = answerIndex;
            
            
            const answerOptions = document.querySelectorAll('.answer-option');
            answerOptions.forEach((option, index) => {
                option.classList.remove('selected');
                if (index === answerIndex) {
                    option.classList.add('selected');
                }
            });

            
            if (currentQuestion === quizData.length - 1) {
                submitBtn.disabled = false;
            } else {
                nextBtn.disabled = false;
            }
        }

        
        function nextQuestion() {
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                loadQuestion();
            }
        }

        
        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        }

        
        function calculateScore() {
            score = 0;
            selectedAnswers.forEach((answer, index) => {
                if (answer !== null && answer === quizData[index].correct) {
                    score++;
                }
            });
            return score;
        }

        
        function submitQuiz() {
            
            const unansweredQuestions = selectedAnswers.filter(answer => answer === null).length;
            if (unansweredQuestions > 0) {
                alert(`Please answer all questions. You have ${unansweredQuestions} unanswered question(s).`);
                return;
            }
            
            clearInterval(timerInterval);
            calculateScore();
            showResults();
        }

        
        function showResults() {
            
            score = 0;
            selectedAnswers.forEach((answer, index) => {
                if (answer !== null && answer === quizData[index].correct) {
                    score++;
                }
            });
            
            const percentage = Math.round((score / quizData.length) * 100);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;

            
            const finalScoreElement = document.getElementById('final-score');
            const scoreMessageElement = document.getElementById('score-message');
            const scoreDetailsElement = document.getElementById('score-details');

            
            finalScoreElement.textContent = `${score}/${quizData.length} (${percentage}%)`;
            finalScoreElement.style.display = 'block';

            
            let message = '';
            if (percentage >= 90) {
                message = 'Excellent! You\'re a quiz master! 🏆';
            } else if (percentage >= 70) {
                message = 'Great job! Well done! 🎉';
            } else if (percentage >= 50) {
                message = 'Good effort! Keep learning! 📚';
            } else {
                message = 'Don\'t give up! Practice makes perfect! 💪';
            }
            scoreMessageElement.textContent = message;
            scoreMessageElement.style.display = 'block';

            
            scoreDetailsElement.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; max-width: 400px; margin: 0 auto;">
                    <div style="background: #e8f5e8; padding: 10px; border-radius: 8px;">
                        <strong>✅ Correct:</strong> ${score}
                    </div>
                    <div style="background: #ffe8e8; padding: 10px; border-radius: 8px;">
                        <strong>❌ Wrong:</strong> ${quizData.length - score}
                    </div>
                    <div style="background: #e8f0ff; padding: 10px; border-radius: 8px;">
                        <strong>⏱️ Time:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}
                    </div>
                    <div style="background: #fff3e8; padding: 10px; border-radius: 8px;">
                        <strong>📊 Accuracy:</strong> ${percentage}%
                    </div>
                </div>
            `;
            scoreDetailsElement.style.display = 'block';

            
            quizContent.style.display = 'none';
            resultsContainer.style.display = 'block';
            resultsContainer.classList.remove('hidden');

            
            progressFill.style.width = '100%';
        }

        
        function restartQuiz() {
            
            currentQuestion = 0;
            selectedAnswers = new Array(quizData.length).fill(null);
            score = 0;
            startTime = Date.now();
            
            
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            
            
            timerElement.textContent = '00:00';
            
            
            resultsContainer.style.display = 'none';
            resultsContainer.classList.add('hidden');
            quizContent.style.display = 'block';
            quizContent.classList.remove('hidden');
            
            
            progressFill.style.width = '0%';
            
            
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
            nextBtn.disabled = true;
            prevBtn.disabled = true;
            
            
            loadQuestion();
            startTimer();
        }

        
        initQuiz();
    