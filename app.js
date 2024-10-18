// Initialize an empty DNA sequence
let dnaSequence = '';

// Define smooth frequencies for each nucleotide (based on C major scale)
const soundMap = {
    'A': 261.63,  // C4 (Middle C)
    'T': 293.66,  // D4
    'C': 329.63,  // E4
    'G': 349.23   // F4
};

// Function to add nucleotides to the sequence when a button is clicked
function addNucleotide(nucleotide) {
    if (dnaSequence.length >= 20) {
        alert('DNA sequence can only be up to 20 nucleotides long.');
        return;
    }

    dnaSequence += nucleotide;
    document.getElementById('sequence-display').textContent = `Your sequence: ${dnaSequence}`;
}

// Function to play a smooth tone for a given frequency and duration
function playSmoothTone(frequency, duration, context, startTime) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Use 'sine' for smoother sound
    oscillator.type = 'sine';

    // Set the frequency for the oscillator
    oscillator.frequency.value = frequency;

    // Smooth fade-out
    gainNode.gain.setValueAtTime(1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Start the oscillator at the provided start time
    oscillator.start(startTime);

    // Stop the oscillator after the given duration
    oscillator.stop(startTime + duration);
}

// Function to convert the DNA sequence to music with pauses between notes
function playDNAMusic() {
    if (!dnaSequence.length) {
        alert('Please create a DNA sequence first by clicking the buttons.');
        return;
    }

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    let currentTime = audioContext.currentTime;
    const noteDuration = 0.4;  // Duration of each note in seconds
    const pauseDuration = 0.1; // Pause between notes

    dnaSequence.split('').forEach((nucleotide) => {
        const frequency = soundMap[nucleotide];

        if (frequency) {
            // Play the smooth tone for the nucleotide
            playSmoothTone(frequency, noteDuration, audioContext, currentTime);
        }

        // Increase time for the next note, including the pause
        currentTime += noteDuration + pauseDuration;
    });
}

// Function to clear the current DNA sequence and reset the display
function clearSequence() {
    dnaSequence = '';
    document.getElementById('sequence-display').textContent = 'Your sequence: ';
}
