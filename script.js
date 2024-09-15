document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const playSelfButton = document.getElementById('play-self');
    const autoPlay1Button = document.getElementById('auto-play-1');
    const autoPlay2Button = document.getElementById('auto-play-2');
    const autoPlayIndicator = document.createElement('div');
    autoPlayIndicator.className = 'auto-play-indicator';
    document.querySelector('.piano-container').appendChild(autoPlayIndicator);

    const notes = {
        'C': 261.63,
        'C#': 277.18,
        'D': 293.66,
        'D#': 311.13,
        'E': 329.63,
        'F': 349.23,
        'F#': 369.99,
        'G': 392.00,
        'G#': 415.30,
        'A': 440.00,
        'A#': 466.16,
        'B': 493.88
    };

    let manualPlay = true;
    let autoPlayInterval;

    // Play Yourself Button (manual mode)
    playSelfButton.addEventListener('click', () => {
        manualPlay = true;
        clearAutoPlay();
        enableKeys();
        autoPlayIndicator.style.display = 'none';  // Hide indicator
    });

    // Auto Play Button 1 (predefined rhythm)
    autoPlay1Button.addEventListener('click', () => {
        manualPlay = false;
        clearAutoPlay();
        disableKeys();
        playAutoMusic(['C', 'E', 'G', 'C', 'E', 'G', 'B', 'C']);
        showAutoPlayIndicator('Playing Auto Music 1...');
    });

    // Auto Play Button 2 (another rhythm)
    autoPlay2Button.addEventListener('click', () => {
        manualPlay = false;
        clearAutoPlay();
        disableKeys();
        playAutoMusic(['A', 'C', 'E', 'G', 'A', 'F', 'D', 'A']);
        showAutoPlayIndicator('Playing Auto Music 2...');
    });

    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (manualPlay) {
                const note = key.dataset.note;
                playSound(notes[note]);
                animateKeyPress(key);
            }
        });
    });

    function playAutoMusic(sequence) {
        let index = 0;
        autoPlayInterval = setInterval(() => {
            if (index < sequence.length) {
                const note = sequence[index];
                const key = document.querySelector(`.key[data-note="${note}"]`);
                playSound(notes[note]);
                animateKeyPress(key);
                index++;
            } else {
                clearInterval(autoPlayInterval);
                manualPlay = true;
                enableKeys();
                autoPlayIndicator.style.display = 'none';  // Hide indicator after auto play
            }
        }, 500);
    }

    function clearAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function disableKeys() {
        keys.forEach(key => {
            key.style.pointerEvents = 'none';
        });
    }

    function enableKeys() {
        keys.forEach(key => {
            key.style.pointerEvents = 'auto';
        });
    }

    function playSound(frequency) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
    }

    function animateKeyPress(key) {
        key.classList.add('active');
        setTimeout(() => {
            key.classList.remove('active');
        }, 200);
    }

    // Function to show the auto-play indicator
    function showAutoPlayIndicator(message) {
        autoPlayIndicator.innerText = message;
        autoPlayIndicator.style.display = 'block';
    }
});
