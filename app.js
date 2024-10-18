// Initialize an empty DNA sequence
let userDNASequence = '';

// The target DNA sequence to match
const targetDNASequence = "ATGCGTACGATACGTCAGTA";

// Define frequencies for pleasant sounds (valid pairs)
const pleasantSoundMap = {
    'AT': 261.63,  // C4 (Middle C)
    'TA': 293.66,  // D4
    'GC': 329.63,  // E4
    'CG': 349.23   // F4
};

// Function to add nucleotides to the sequence when a button is clicked
function addNucleotide(nucleotide) {
    if (userDNASequence.length >= 20) {
        alert('DNA sequence can only be up to 20 nucleotides long.'); // Keep this alert for length limitation
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

    // Smooth fade-out for pleasant, softer for unpleasant sounds
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
    if (userDNASequence.length < 2) {
        alert('Please create a DNA sequence with at least 2 nucleotides.'); // Keep this alert for minimum length
        return;
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    const noteDuration = 0.4;  // Duration of each note in seconds
    const pauseDuration = 0.1;  // Pause between notes

    // Process the sequence in pairs of nucleotides
    for (let i = 0; i < userDNASequence.length; i += 2) {
        const pair = userDNASequence.slice(i, i + 2);

        if (pair.length === 2) {
            // Check if the pair is valid against the target sequence
            const validPair = (pair === "AT" && targetDNASequence[i] === "A") ||
                              (pair === "TA" && targetDNASequence[i] === "T") ||
                              (pair === "GC" && targetDNASequence[i] === "G") ||
                              (pair === "CG" && targetDNASequence[i] === "C");

            if (validPair) {
                // If it's a valid pair, play the pleasant sound
                const frequency = pleasantSoundMap[pair];
                playTone(frequency, noteDuration, audioContext, currentTime, true);
            } else {
                // Invalid pair, play an unpleasant sound
                playTone(330, noteDuration, audioContext, currentTime, false); // Use a frequency for unpleasant sound
            }
        } else {
            // If the pair is incomplete, we can choose to ignore or handle it differently
            // Here we can just continue to the next iteration
            continue;
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
