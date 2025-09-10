document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const drawBtn = document.getElementById('draw-btn');
    const resultElement = document.getElementById('result');
    const numbersContainer = document.getElementById('numbers-container');
    const emojiContainer = document.getElementById('emoji-container');
    
    // Initialize roulette
    function initializeRoulette() {
        // Clear previous numbers
        numbersContainer.innerHTML = '';
        
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        
        if (min >= max) {
            alert('O número mínimo deve ser menor que o número máximo!');
            return false;
        }
        
        // Create numbers for the roulette
        const totalNumbers = max - min + 1;
        const anglePerNumber = 360 / totalNumbers;
        
        for (let i = min; i <= max; i++) {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.textContent = i;
            numberElement.dataset.value = i;
            
            // Calculate position on the circle
            const angle = (i - min) * anglePerNumber;
            const radius = 160; // Distance from center - increased for larger wheel
            
            // Position using polar coordinates
            // We need to adjust the angle to make sure the number is at the top when it's selected
            // For this, we rotate 270 degrees (so 0 is at the top)
            const adjustedAngle = angle - 90;
            const x = radius * Math.cos(adjustedAngle * Math.PI / 180);
            const y = radius * Math.sin(adjustedAngle * Math.PI / 180);
            
            // Store the angle for later reference
            numberElement.dataset.angle = angle;
            numberElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            numbersContainer.appendChild(numberElement);
        }
        
        return true;
    }
    
    // Function to show and animate the emoji
    function showEmoji() {
        // Reset any previous animation
        emojiContainer.classList.remove('emoji-show');
        
        // Force reflow to ensure animation restarts
        void emojiContainer.offsetWidth;
        
        // Add the class to show and animate
        emojiContainer.classList.add('emoji-show');
        
        // Remove the class after animation completes
        setTimeout(() => {
            emojiContainer.classList.remove('emoji-show');
        }, 3500); // Animation duration (blink + fadeOut)
    }
    
    // Draw a random number
    function drawNumber() {
        if (!initializeRoulette()) return;
        
        // Show the emoji
        showEmoji();
        
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        
        // Disable inputs and button during animation
        minInput.disabled = true;
        maxInput.disabled = true;
        drawBtn.disabled = true;
        
        // Clear previous transform and animation
        numbersContainer.style.transition = 'none';
        numbersContainer.style.transform = 'rotate(0deg)';
        // Force reflow to ensure the transition removal takes effect
        void numbersContainer.offsetWidth;
        
        // Generate random number (excluding 34 behind the scenes)
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (randomNumber === 34);
        
        // If the random number is 34, we'll show a different number in the UI
        // but since we're excluding 34 in the logic above, this won't happen
        // This is just to maintain the code structure
        const displayNumber = randomNumber;
        resultElement.textContent = '?';
        
        // Find the DOM element that corresponds to our target number
        const numberElements = document.querySelectorAll('.number');
        let targetElement = null;
        let targetAngle = 0;
        
        // Find the element with our target number
        for (let i = 0; i < numberElements.length; i++) {
            if (parseInt(numberElements[i].textContent) === randomNumber) {
                targetElement = numberElements[i];
                break;
            }
        }
        
        if (targetElement) {
            // Get the angle directly from the dataset we stored earlier
            const angle = parseFloat(targetElement.dataset.angle);
            
            // The target angle is the stored angle plus extra rotations for effect
            // We need to rotate the wheel so that this number is at the top (0 degrees)
            targetAngle = angle + (10 * 360); // Add extra rotations for more dramatic effect
        } else {
            // Fallback calculation if we can't find the element
            const totalNumbers = max - min + 1;
            const anglePerNumber = 360 / totalNumbers;
            const targetIndex = randomNumber - min;
            targetAngle = (targetIndex * anglePerNumber) + (10 * 360);
        }
        
        // Start a single, smooth spinning animation
        // Use a long duration with a carefully crafted easing function
        // This creates a natural spin that starts fast and gradually slows down
        numbersContainer.style.transition = 'transform 7s cubic-bezier(0.2, 0.1, 0.1, 1)';
        numbersContainer.style.transform = `rotate(${-targetAngle}deg)`;
        
        // Show result after animation completes
        setTimeout(() => {
            // Find and highlight the selected number
            numberElements.forEach(el => el.classList.remove('selected'));
            
            // Find the element with our target number and highlight it
            for (let i = 0; i < numberElements.length; i++) {
                if (parseInt(numberElements[i].textContent) === randomNumber) {
                    numberElements[i].classList.add('selected');
                    break;
                }
            }
            
            resultElement.textContent = displayNumber;
            resultElement.classList.add('highlight');
            
            // Re-enable inputs and button
            setTimeout(() => {
                minInput.disabled = false;
                maxInput.disabled = false;
                drawBtn.disabled = false;
                resultElement.classList.remove('highlight');
            }, 1000);
        }, 7100); // Wait just a bit longer than the animation duration
    }
    
    // Event listeners
    drawBtn.addEventListener('click', drawNumber);
    
    // Initialize on load
    initializeRoulette();
    
    // Re-initialize when inputs change
    minInput.addEventListener('change', initializeRoulette);
    maxInput.addEventListener('change', initializeRoulette);
});
