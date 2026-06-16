const historyElement = document.querySelector('#history');
const resultElement = document.querySelector('#result');
const buttons = document.querySelectorAll('.button');

let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetScreen = false;

const updateDisplay = () => {
    resultElement.textContent = currentValue;
    historyElement.textContent = previousValue ? `${previousValue} ${operation || ''}`.trim() : '0';
};

const appendNumber = (number) => {
    if (number === '.' && currentValue.includes('.')) return;
    if (shouldResetScreen) {
        currentValue = '0';
        shouldResetScreen = false;
    }
    currentValue = currentValue === '0' && number !== '.' ? number : currentValue + number;
};

const chooseOperation = (selectedOperation) => {
    if (currentValue === '') return;
    if (previousValue !== '') {
        compute();
    }
    operation = selectedOperation;
    previousValue = currentValue;
    shouldResetScreen = true;
};

const compute = () => {
    if (!operation || previousValue === '') return;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    if (Number.isNaN(prev) || Number.isNaN(current)) return;

    let computation = 0;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = current === 0 ? 'Erro' : prev / current;
            break;
        case '%':
            computation = (prev * current) / 100;
            break;
        default:
            return;
    }

    currentValue = computation.toString();
    operation = null;
    previousValue = '';
    shouldResetScreen = true;
};

const clearCalculator = () => {
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetScreen = false;
};

const deleteLastDigit = () => {
    if (shouldResetScreen) return;
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
};

const toggleSign = () => {
    if (currentValue === '0') return;
    currentValue = currentValue.startsWith('-') ? currentValue.slice(1) : `-${currentValue}`;
};

const convertPercent = () => {
    const value = parseFloat(currentValue);
    if (Number.isNaN(value)) return;
    currentValue = (value / 100).toString();
};

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const number = button.getAttribute('data-number');
        const action = button.getAttribute('data-action');

        if (number !== null) {
            appendNumber(number);
            updateDisplay();
            return;
        }

        switch (action) {
            case 'clear':
                clearCalculator();
                break;
            case 'delete':
                deleteLastDigit();
                break;
            case 'toggle-sign':
                toggleSign();
                break;
            case 'percent':
                convertPercent();
                break;
            case '=':
                compute();
                break;
            default:
                chooseOperation(action);
                break;
        }
        updateDisplay();
    });
});

const handleKeyboardInput = (event) => {
    const key = event.key;
    const code = event.code;
    const numberPattern = /^[0-9]$/;

    if (numberPattern.test(key)) {
        appendNumber(key);
        updateDisplay();
        return;
    }

    if (key === '.' || key === ',') {
        appendNumber('.');
        updateDisplay();
        return;
    }

    const operationMap = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '÷': '/',
        '×': '*'
    };

    if (operationMap[key]) {
        chooseOperation(operationMap[key]);
        updateDisplay();
        return;
    }

    if (code === 'NumpadAdd') {
        chooseOperation('+');
        updateDisplay();
        return;
    }

    if (code === 'NumpadSubtract') {
        chooseOperation('-');
        updateDisplay();
        return;
    }

    if (code === 'NumpadMultiply') {
        chooseOperation('*');
        updateDisplay();
        return;
    }

    if (code === 'NumpadDivide') {
        chooseOperation('/');
        updateDisplay();
        return;
    }

    if (key === 'Enter' || key === '=') {
        compute();
        updateDisplay();
        return;
    }

    if (key === 'Backspace') {
        deleteLastDigit();
        updateDisplay();
        return;
    }

    if (key === 'Escape') {
        clearCalculator();
        updateDisplay();
        return;
    }

    if (key === '%') {
        convertPercent();
        updateDisplay();
        return;
    }
};

window.addEventListener('keydown', handleKeyboardInput);

updateDisplay();
