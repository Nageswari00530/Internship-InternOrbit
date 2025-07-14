let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;
        let lastOperator = '';
        let lastOperand = '';

        function updateDisplay() {
            display.textContent = currentInput;
            
            // Add visual feedback for long numbers
            if (currentInput.length > 12) {
                display.style.fontSize = '2rem';
            } else if (currentInput.length > 8) {
                display.style.fontSize = '2.5rem';
            } else {
                display.style.fontSize = '3rem';
            }
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }

            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                // Prevent multiple operators in a row
                const lastChar = currentInput.slice(-1);
                const operators = ['+', '-', '*', '/'];
                
                if (operators.includes(value) && operators.includes(lastChar)) {
                    currentInput = currentInput.slice(0, -1) + value;
                } else if (value === '.' && currentInput.includes('.')) {
                    // Prevent multiple decimal points in the same number
                    const parts = currentInput.split(/[+\-*/]/);
                    const lastPart = parts[parts.length - 1];
                    if (lastPart.includes('.')) {
                        return;
                    }
                    currentInput += value;
                } else {
                    currentInput += value;
                }
            }
            
            updateDisplay();
            addButtonFeedback();
        }

        function clearDisplay() {
            currentInput = '0';
            shouldResetDisplay = false;
            lastOperator = '';
            lastOperand = '';
            display.classList.remove('error', 'calculating');
            updateDisplay();
            addButtonFeedback();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            display.classList.remove('error');
            updateDisplay();
            addButtonFeedback();
        }

        function calculatePercentage() {
            try {
                if (currentInput === '0' || currentInput === '') return;
                
                // If there's an operator in the expression, calculate percentage of the last number
                const operators = ['+', '-', '*', '/'];
                let hasOperator = false;
                let operatorIndex = -1;
                
                for (let i = currentInput.length - 1; i >= 0; i--) {
                    if (operators.includes(currentInput[i])) {
                        hasOperator = true;
                        operatorIndex = i;
                        break;
                    }
                }
                
                if (hasOperator) {
                    // Get the number after the operator
                    const beforeOperator = currentInput.substring(0, operatorIndex + 1);
                    const afterOperator = currentInput.substring(operatorIndex + 1);
                    
                    if (afterOperator) {
                        const percentage = parseFloat(afterOperator) / 100;
                        currentInput = beforeOperator + percentage.toString();
                    }
                } else {
                    // Convert the entire number to percentage
                    const result = parseFloat(currentInput) / 100;
                    currentInput = result.toString();
                }
                
                updateDisplay();
                addButtonFeedback();
            } catch (error) {
                showError();
            }
        }

        function calculate() {
            try {
                display.classList.add('calculating');
                
                // Add a small delay for visual feedback
                setTimeout(() => {
                    try {
                        // Replace display symbols with actual operators
                        let expression = currentInput
                            .replace(/×/g, '*')
                            .replace(/÷/g, '/')
                            .replace(/−/g, '-');
                        
                        // Validate expression
                        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
                            throw new Error('Invalid expression');
                        }
                        
                        // Store the last operation for repeat calculations
                        const operators = ['+', '-', '*', '/'];
                        for (let i = expression.length - 1; i >= 0; i--) {
                            if (operators.includes(expression[i])) {
                                lastOperator = expression[i];
                                lastOperand = expression.substring(i + 1);
                                break;
                            }
                        }
                        
                        let result = eval(expression);
                        
                        // Handle division by zero and other edge cases
                        if (!isFinite(result)) {
                            throw new Error('Invalid calculation');
                        }
                        
                        // Round to avoid floating point precision issues
                        result = Math.round(result * 100000000) / 100000000;
                        
                        // Format large numbers with scientific notation
                        if (Math.abs(result) > 999999999) {
                            result = result.toExponential(6);
                        }
                        
                        currentInput = result.toString();
                        shouldResetDisplay = true;
                        display.classList.remove('calculating');
                        updateDisplay();
                        addButtonFeedback();
                    } catch (error) {
                        showError();
                    }
                }, 200);
            } catch (error) {
                showError();
            }
        }

        function showError() {
            display.classList.remove('calculating');
            display.classList.add('error');
            currentInput = 'Error';
            shouldResetDisplay = true;
            updateDisplay();
            
            // Reset after showing error
            setTimeout(() => {
                clearDisplay();
            }, 2000);
        }

        function addButtonFeedback() {
            // Add haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }

        // Enhanced keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if ('0123456789+-*/.=Enter%cCEscape'.includes(key)) {
                event.preventDefault();
            }
            
            if (key >= '0' && key <= '9') {
                appendToDisplay(key);
            } else if (key === '.') {
                appendToDisplay('.');
            } else if (key === '+') {
                appendToDisplay('+');
            } else if (key === '-') {
                appendToDisplay('-');
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                appendToDisplay('/');
            } else if (key === '%') {
                calculatePercentage();
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace' || key === 'Delete') {
                deleteLast();
            }
        });

        // Touch gesture support for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        display.addEventListener('touchstart', function(event) {
            touchStartY = event.changedTouches[0].screenY;
        });

        display.addEventListener('touchend', function(event) {
            touchEndY = event.changedTouches[0].screenY;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - clear
                    clearDisplay();
                } else {
                    // Swipe down - delete last
                    deleteLast();
                }
            }
        }

        // Add visual feedback to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'translateY(-1px) scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // Initialize display
        updateDisplay();
    
