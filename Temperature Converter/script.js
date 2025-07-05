class TemperatureConverter {
    constructor() {
        this.temperatureInput = document.getElementById('temperature');
        this.unitSelect = document.getElementById('unit');
        this.errorMessage = document.getElementById('error-message');
        this.celsiusValue = document.getElementById('celsius-value');
        this.fahrenheitValue = document.getElementById('fahrenheit-value');
        this.kelvinValue = document.getElementById('kelvin-value');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.temperatureInput.addEventListener('input', () => this.convert());
        this.unitSelect.addEventListener('change', () => this.convert());
        this.convert();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.temperatureInput.style.borderColor = '#dc3545';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
        this.temperatureInput.style.borderColor = '#dee2e6';
    }

    isValidInput(value) {
        return value !== '' && !isNaN(value) && isFinite(value);
    }

    celsiusToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
    }

    fahrenheitToKelvin(fahrenheit) {
        return this.celsiusToKelvin(this.fahrenheitToCelsius(fahrenheit));
    }

    kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    kelvinToFahrenheit(kelvin) {
        return this.celsiusToFahrenheit(this.kelvinToCelsius(kelvin));
    }

    formatTemperature(value) {
        if (value === null || value === undefined) return '--';
        return Math.round(value * 100) / 100;
    }

    resetDisplay() {
        this.celsiusValue.textContent = '--';
        this.fahrenheitValue.textContent = '--';
        this.kelvinValue.textContent = '--';
    }

    convert() {
        const inputValue = this.temperatureInput.value.trim();
        const inputUnit = this.unitSelect.value;

        if (inputValue === '') {
            this.hideError();
            this.resetDisplay();
            return;
        }

        if (!this.isValidInput(inputValue)) {
            this.showError('Please enter a valid number');
            this.resetDisplay();
            return;
        }

        const temperature = parseFloat(inputValue);

        if (inputUnit === 'kelvin' && temperature < 0) {
            this.showError('Kelvin cannot be negative');
            this.resetDisplay();
            return;
        }

        if (inputUnit === 'celsius' && temperature < -273.15) {
            this.showError('Temperature cannot be below absolute zero (-273.15°C)');
            this.resetDisplay();
            return;
        }

        if (inputUnit === 'fahrenheit' && temperature < -459.67) {
            this.showError('Temperature cannot be below absolute zero (-459.67°F)');
            this.resetDisplay();
            return;
        }

        this.hideError();

        let celsius, fahrenheit, kelvin;

        switch (inputUnit) {
            case 'celsius':
                celsius = temperature;
                fahrenheit = this.celsiusToFahrenheit(celsius);
                kelvin = this.celsiusToKelvin(celsius);
                break;
            case 'fahrenheit':
                fahrenheit = temperature;
                celsius = this.fahrenheitToCelsius(fahrenheit);
                kelvin = this.fahrenheitToKelvin(fahrenheit);
                break;
            case 'kelvin':
                kelvin = temperature;
                celsius = this.kelvinToCelsius(kelvin);
                fahrenheit = this.kelvinToFahrenheit(kelvin);
                break;
        }

        this.celsiusValue.textContent = this.formatTemperature(celsius);
        this.fahrenheitValue.textContent = this.formatTemperature(fahrenheit);
        this.kelvinValue.textContent = this.formatTemperature(kelvin);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});
