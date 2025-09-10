document.addEventListener('DOMContentLoaded', function() {
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const drawBtn = document.getElementById('draw-btn');
    const resultElement = document.getElementById('result');
    const numbersContainer = document.getElementById('numbers-container');
    const emojiContainer = document.getElementById('emoji-container');
    
    function initializeRoulette() {
        numbersContainer.innerHTML = '';
        
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
            const radius = 160; 
            

            const adjustedAngle = angle - 90;
            const x = radius * Math.cos(adjustedAngle * Math.PI / 180);
            const y = radius * Math.sin(adjustedAngle * Math.PI / 180);
            
            numberElement.dataset.angle = angle;
            numberElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            numbersContainer.appendChild(numberElement);
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
        
        numbersContainer.style.transition = 'none';
        numbersContainer.style.transform = 'rotate(0deg)';
        void numbersContainer.offsetWidth;
        
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (randomNumber === 34);
        

        const displayNumber = randomNumber;
        resultElement.textContent = '?';
        
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
    

    drawBtn.addEventListener('click', drawNumber);
    

    initializeRoulette();
    

    minInput.addEventListener('change', initializeRoulette);
    maxInput.addEventListener('change', initializeRoulette);
});
