// Define sound frequencies for each nucleotide
const soundMap = {
    'A': 261.63,  // Middle C (C4)
    'T': 293.66,  // D4
    'C': 329.63,  // E4
    'G': 349.23   // F4
};

// Function to play a tone for a given frequency
function playTone(frequency, duration, context) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';  // Type of wave (you can try 'square', 'sawtooth', etc.)
    gainNode.gain.setValueAtTime(0.5, context.currentTime);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
}

// Function to convert the DNA sequence to music
function playDNAMusic() {
    const dnaInput = document.getElementById('dna-sequence').value.toUpperCase();
    const dnaSequence = dnaInput.replace(/[^ATCG]/g, '');  // Remove invalid characters

    if (!dnaSequence.length) {
        alert('Please enter a valid DNA sequence with only A, T, C, G characters.');
        return;
    }

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    let time = 0;
    const duration = 0.4;  // Duration of each sound in seconds

    dnaSequence.split('').forEach((nucleotide) => {
        const frequency = soundMap[nucleotide];
        if (frequency) {
            playTone(frequency, duration, audioContext);
        }
        time += duration;
    });
}
