document.addEventListener('DOMContentLoaded', function() {
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const drawBtn = document.getElementById('draw-btn');
    const resultElement = document.getElementById('result');
    const numbersContainer = document.getElementById('numbers-container');
    const horizontalNumbersContainer = document.getElementById('horizontal-numbers-container');
    const emojiContainer = document.getElementById('emoji-container');
    
    const isMobile = function() {
        return window.innerWidth <= 600;
    };
    
    function getRadius() {
        return isMobile() ? 120 : 160;
    }
    
    function initializeRoulette() {
        numbersContainer.innerHTML = '';
        horizontalNumbersContainer.innerHTML = '';
        
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        
        if (min >= max) {
            alert('O número mínimo deve ser menor que o número máximo!');
            return false;
        }
        
        const totalNumbers = max - min + 1;
        const anglePerNumber = 360 / totalNumbers;
        
        for (let i = min; i <= max; i++) {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.textContent = i;
            numberElement.dataset.value = i;
            
            const angle = (i - min) * anglePerNumber;
            const radius = getRadius(); 
            
            const adjustedAngle = angle - 90;
            const x = radius * Math.cos(adjustedAngle * Math.PI / 180);
            const y = radius * Math.sin(adjustedAngle * Math.PI / 180);
            
            numberElement.dataset.angle = angle;
            numberElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            numbersContainer.appendChild(numberElement);
        }
        

        const repetitions = 10; 
        
        for (let rep = 0; rep < repetitions; rep++) {
            for (let i = min; i <= max; i++) {
                const numberElement = document.createElement('div');
                numberElement.className = 'horizontal-number';
                numberElement.textContent = i;
                numberElement.dataset.value = i;
                
                if (rep === repetitions - 1) {
                    numberElement.dataset.lastSet = 'true';
                }
                
                horizontalNumbersContainer.appendChild(numberElement);
            }
        }
        
        return true;
    }
    

    function showEmoji() {
        emojiContainer.classList.remove('emoji-show');
        
        void emojiContainer.offsetWidth;
        
        emojiContainer.classList.add('emoji-show');
        
        setTimeout(() => {
            emojiContainer.classList.remove('emoji-show');
        }, 3500); 
    }
    
    function drawNumber() {
        if (!initializeRoulette()) return;
        
        showEmoji();
        
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        
        minInput.disabled = true;
        maxInput.disabled = true;
        drawBtn.disabled = true;
        
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (randomNumber === 34);
        
        const displayNumber = randomNumber;
        resultElement.textContent = '?';
        
        if (isMobile()) {
            const horizontalNumberElements = document.querySelectorAll('.horizontal-number');
            horizontalNumbersContainer.style.transition = 'none';
            horizontalNumbersContainer.style.transform = 'translateX(0)';
            void horizontalNumbersContainer.offsetWidth;
            
            const numberWidth = 70; 
            const totalNumbers = max - min + 1;
            const setWidth = totalNumbers * numberWidth;
            const repetitions = 10;
            
            let targetElement = null;
            const allHorizontalNumbers = document.querySelectorAll('.horizontal-number');
            
            for (let i = 0; i < allHorizontalNumbers.length; i++) {
                if (parseInt(allHorizontalNumbers[i].textContent) === randomNumber && 
                    allHorizontalNumbers[i].dataset.lastSet === 'true') {
                    targetElement = allHorizontalNumbers[i];
                    break;
                }
            }
            

            setTimeout(() => {
                const targetPosition = targetElement ? targetElement.offsetLeft : ((repetitions - 1) * setWidth) + ((randomNumber - min) * numberWidth);
                const offset = window.innerWidth / 2;
                const totalScroll = targetPosition - offset + (numberWidth / 2);
                
                horizontalNumbersContainer.style.transition = 'transform 7s cubic-bezier(0.1, 0.1, 0.25, 1)';
                horizontalNumbersContainer.style.transform = `translateX(${-totalScroll}px)`;
            }, 50);
            
            
            setTimeout(() => {
                allHorizontalNumbers.forEach(el => el.classList.remove('selected'));
                
                for (let i = 0; i < allHorizontalNumbers.length; i++) {
                    if (parseInt(allHorizontalNumbers[i].textContent) === randomNumber && 
                        allHorizontalNumbers[i].dataset.lastSet === 'true') {
                        allHorizontalNumbers[i].classList.add('selected');
                        break;
                    }
                }
                
                resultElement.textContent = displayNumber;
                resultElement.classList.add('highlight');
                
                setTimeout(() => {
                    minInput.disabled = false;
                    maxInput.disabled = false;
                    drawBtn.disabled = false;
                    resultElement.classList.remove('highlight');
                }, 1000);
            }, 7150); 
        } else {
            numbersContainer.style.transition = 'none';
            numbersContainer.style.transform = 'rotate(0deg)';
            void numbersContainer.offsetWidth;
            
            const numberElements = document.querySelectorAll('.number');
            let targetElement = null;
            let targetAngle = 0;
            
            for (let i = 0; i < numberElements.length; i++) {
                if (parseInt(numberElements[i].textContent) === randomNumber) {
                    targetElement = numberElements[i];
                    break;
                }
            }
            
            if (targetElement) {
                const angle = parseFloat(targetElement.dataset.angle);
                targetAngle = angle + (10 * 360); 
            } else {
                const totalNumbers = max - min + 1;
                const anglePerNumber = 360 / totalNumbers;
                const targetIndex = randomNumber - min;
                targetAngle = (targetIndex * anglePerNumber) + (10 * 360);
            }
            
            numbersContainer.style.transition = 'transform 7s cubic-bezier(0.2, 0.1, 0.1, 1)';
            numbersContainer.style.transform = `rotate(${-targetAngle}deg)`;
            
            setTimeout(() => {
                numberElements.forEach(el => el.classList.remove('selected'));
                
                for (let i = 0; i < numberElements.length; i++) {
                    if (parseInt(numberElements[i].textContent) === randomNumber) {
                        numberElements[i].classList.add('selected');
                        break;
                    }
                }
                
                resultElement.textContent = displayNumber;
                resultElement.classList.add('highlight');
                
                setTimeout(() => {
                    minInput.disabled = false;
                    maxInput.disabled = false;
                    drawBtn.disabled = false;
                    resultElement.classList.remove('highlight');
                }, 1000);
            }, 7100);
        } 
    }
    

    drawBtn.addEventListener('click', drawNumber);
    

    initializeRoulette();
    

    minInput.addEventListener('change', initializeRoulette);
    maxInput.addEventListener('change', initializeRoulette);
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initializeRoulette();
        }, 250);
    });
});
