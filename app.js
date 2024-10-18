// Initialize an empty DNA sequence
let userDNASequence = '';

// The target DNA sequence to match
const targetDNASequence = "ATGCGTACGATACGTCAGTA";

// Define frequencies for pleasant sounds (valid pairs)
const pleasantSoundMap = {
    'AT': 261.63,  // C4 (Middle C)
    'TA': 293.66,  // D4
    'CG': 329.63,  // E4
    'GC': 349.23   // F4
};

// Function to add nucleotides to the sequence when a button is clicked
function addNucleotide(nucleotide) {
    if (userDNASequence.length >= 20) {
        alert('DNA sequence can only be up to 20 nucleotides long.');
        return;
    }

    userDNASequence += nucleotide;
    document.getElementById('sequence-display').textContent = `Your sequence: ${userDNASequence}`;
}

// Function to play a tone based on nucleotide pairs
function playTone(frequency, duration, context, startTime, isPleasant) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Set the oscillator waveform type
    oscillator.type = isPleasant ? 'sine' : 'triangle'; // Pleasant pairs use 'sine', invalid pairs use 'triangle'

    // Set the frequency for the oscillator
    oscillator.frequency.value = frequency;

    // Smooth fade-out for pleasant sounds
    gainNode.gain.setValueAtTime(1, startTime);
    if (isPleasant) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else {
        gainNode.gain.setValueAtTime(0.1, startTime); // Set to 10% volume for unpleasant sounds
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
    }

    // Start the oscillator at the provided start time
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Function to play the user's DNA sequence music based on nucleotide pairs
function playDNAMusic() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    const noteDuration = 0.4;  // Duration of each note in seconds
    const pauseDuration = 0.1;  // Pause between notes

    // Process the sequence nucleotide by nucleotide
    for (let i = 0; i < userDNASequence.length; i++) {
        if (i >= targetDNASequence.length) {
            break; // Stop if we've reached the end of the target sequence
        }
        const userNucleotide = userDNASequence[i];
        const targetNucleotide = targetDNASequence[i];

        // Determine the pair
        let pair = '';
        if (targetNucleotide === 'A' && userNucleotide === 'T') {
            pair = 'AT';
        } else if (targetNucleotide === 'T' && userNucleotide === 'A') {
            pair = 'TA';
        } else if (targetNucleotide === 'C' && userNucleotide === 'G') {
            pair = 'CG';
        } else if (targetNucleotide === 'G' && userNucleotide === 'C') {
            pair = 'GC';
        }

        // Check if it's a valid pair and play the corresponding sound
        if (pair in pleasantSoundMap) {
            const frequency = pleasantSoundMap[pair];
            playTone(frequency, noteDuration, audioContext, currentTime, true); // Pleasant sound
        } else {
            playTone(220, noteDuration, audioContext, currentTime, false); // Unpleasant sound for invalid pairs
        }

        // Increase time for the next note, including the pause
        currentTime += noteDuration + pauseDuration;
    }
}

// Function to clear the current DNA sequence and reset the display
function clearSequence() {
    userDNASequence = '';
    document.getElementById('sequence-display').textContent = 'Your sequence: ';
}
