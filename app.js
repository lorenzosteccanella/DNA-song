// Initialize an empty DNA sequence
let dnaSequence = '';

// Define frequencies for pleasant sounds (valid pairs) and unpleasant sounds (invalid pairs)
const pleasantSoundMap = {
    'AT': 261.63,  // C4 (Middle C)
    'TA': 293.66,  // D4
    'CG': 329.63,  // E4
    'GC': 349.23   // F4
};

const unpleasantSoundFrequency = 220; // Less harsh frequency for unpleasant sounds

// Function to add nucleotides to the sequence when a button is clicked
function addNucleotide(nucleotide) {
    if (dnaSequence.length >= 20) {
        alert('DNA sequence can only be up to 20 nucleotides long.');
        return;
    }

    dnaSequence += nucleotide;
    document.getElementById('sequence-display').textContent = `Your sequence: ${dnaSequence}`;
}

// Function to play a tone based on nucleotide pairs
function playTone(frequency, duration, context, startTime, isPleasant) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Set the oscillator waveform type
    oscillator.type = isPleasant ? 'sine' : 'square'; // Pleasant pairs use 'sine', invalid pairs use 'square'

    // Set the frequency for the oscillator
    oscillator.frequency.value = frequency;

    // Smooth fade-out for pleasant, softer for unpleasant sounds
    gainNode.gain.setValueAtTime(1, startTime);

    if (isPleasant) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else {
        gainNode.gain.setValueAtTime(0.3, startTime); // Lower gain for unpleasant sounds (30% volume)
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
    }

    // Start the oscillator at the provided start time
    oscillator.start(startTime);

    // Stop the oscillator after the given duration
    oscillator.stop(startTime + duration);
}

// Function to play the DNA sequence music based on nucleotide pairs
function playDNAMusic() {
    if (dnaSequence.length < 2) {
        alert('Please create a DNA sequence with at least 2 nucleotides.');
        return;
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    const noteDuration = 0.4;  // Duration of each note in seconds
    const pauseDuration = 0.1; // Pause between notes

    // Process the sequence in pairs of nucleotides
    for (let i = 0; i < dnaSequence.length; i += 2) {
        const pair = dnaSequence.slice(i, i + 2);

        if (pair.length === 2) {
            if (pleasantSoundMap[pair]) {
                // If it's a valid pair, play the pleasant sound
                const frequency = pleasantSoundMap[pair];
                playTone(frequency, noteDuration, audioContext, currentTime, true);
            } else {
                // Invalid pair, play the unpleasant sound
                playTone(unpleasantSoundFrequency, noteDuration, audioContext, currentTime, false);
            }
        } else {
            // Handle the case where an odd nucleotide remains without a pair
            alert('Sequence must be complete pairs of nucleotides.');
        }

        // Increase time for the next note, including the pause
        currentTime += noteDuration + pauseDuration;
    }
}

// Function to clear the current DNA sequence and reset the display
function clearSequence() {
    dnaSequence = '';
    document.getElementById('sequence-display').textContent = 'Your sequence: ';
}
