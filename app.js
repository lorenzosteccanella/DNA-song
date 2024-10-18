// Define sound frequencies for each nucleotide with a harmonic second frequency for a fuller sound
const soundMap = {
    'A': [261.63, 329.63],  // Middle C (C4) and E4
    'T': [293.66, 370.00],  // D4 and F#4
    'C': [329.63, 392.00],  // E4 and G4
    'G': [349.23, 440.00]   // F4 and A4
};

// Function to play a tone for a given frequency and duration
function playTone(frequencies, duration, context, startTime) {
    frequencies.forEach(frequency => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Set the waveform type (try 'triangle', 'sawtooth' or 'square' for richer sounds)
        oscillator.type = 'triangle';

        // Set the frequency for the oscillator
        oscillator.frequency.value = frequency;

        // Start the oscillator at the provided start time
        oscillator.start(startTime);

        // Stop the oscillator after the given duration
        oscillator.stop(startTime + duration);
    });
}

// Function to convert the DNA sequence to music with a 0.1 second pause between notes
function playDNAMusic() {
    const dnaInput = document.getElementById('dna-sequence').value.toUpperCase();
    const dnaSequence = dnaInput.replace(/[^ATCG]/g, '');  // Clean invalid characters

    if (!dnaSequence.length) {
        alert('Please enter a valid DNA sequence with only A, T, C, G characters.');
        return;
    }

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    let currentTime = audioContext.currentTime;
    const noteDuration = 0.1;  // Duration of each sound in seconds
    const pauseDuration = 1; // Pause between notes in seconds

    dnaSequence.split('').forEach((nucleotide) => {
        const frequencies = soundMap[nucleotide];

        if (frequencies) {
            // Play the tone for the nucleotide
            playTone(frequencies, noteDuration, audioContext, currentTime);
        }

        // Increase time for the next note, including a pause
        currentTime += noteDuration + pauseDuration;
    });
}
