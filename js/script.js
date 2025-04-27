// Import an array of words and hints from an external file
// The 'words' array contains objects like { word: "apple", hint: "A common fruit" }
import words from './word.js'

// Select DOM elements (parts of the webpage we want to work with)
const wordText = document.querySelector(".word");         // Where the scrambled word appears
const hinttext = document.querySelector(".hint span");    // Where the hint appears
const refreshBtn = document.querySelector(".refresh-word"); // Refresh button
const checkBtn = document.querySelector(".check-word");   // Check answer button
const inputField = document.querySelector("input");       // Where user types their answer
const timeText = document.querySelector(".time b")        // Timer display

// Variables we'll use throughout the game
let selectedWord;  // Will store the correct word for the current round
let timer;        // Will store our timer interval

/**
 * Sets up a countdown timer for the game
 * @param {number} maxTime - The starting time (in seconds) for the countdown
 */
const initTimer = maxTime => {
    // First clear any existing timer so we don't have multiple timers running
    clearInterval(timer);
    
    // Set up a new timer that runs every 1000ms (1 second)
    timer = setInterval(() => {
        // If time remains...
        if (maxTime > 0) {
            maxTime--; // Decrease the time by 1 second
            timeText.innerHTML = maxTime; // Update the timer display
            return; // Exit the function early
        }
        
        // If time runs out...
        clearInterval(timer); // Stop the timer
        alert(`Sorry, time's up! ${selectedWord.toUpperCase()} was the correct answer!`);
        initGame(); // Start a new game
    }, 1000);
}

/**
 * Initializes a new game round:
 * - Starts timer
 * - Picks a random word
 * - Scrambles the word
 * - Displays the scrambled word and hint
 */
const initGame = () => {
    initTimer(30); // Start 30-second timer
    
    // Pick a random word object from our imported list
    const randomObj = words[Math.floor(Math.random() * words.length)];
    selectedWord = randomObj.word.toLowerCase(); // Store the correct word in lowercase
    const hint = randomObj.hint; // Get the hint for this word

    // Split the word into an array of letters to scramble it
    // Example: "apple" becomes ["a", "p", "p", "l", "e"]
    let wordArray = selectedWord.split("");
    
    // Fisher-Yates shuffle algorithm - scrambles the letters randomly
    for (let i = wordArray.length - 1; i > 0; i--) {
        // Pick a random index between 0 and i
        let j = Math.floor(Math.random() * (i + 1));
        // Swap letters at positions i and j
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    // Display the scrambled word by joining the array back into a string
    wordText.innerHTML = wordArray.join("");
    hinttext.innerHTML = hint; // Show the hint
    inputField.value = ""; // Clear the input field
    inputField.setAttribute("maxlength", selectedWord.length); // Limit input length

    // Helpful for debugging (only visible in browser console)
    console.log("Hint:", hint);
    console.log({ 
        shuffledWord: wordArray.join(" "), // Shows scrambled letters with spaces
        selectedWord // The correct word
    });
};

/**
 * Checks if the user's answer is correct
 */
const checkWord = () => {
    // Get what the user typed and convert to lowercase
    let userWord = inputField.value.toLowerCase();
    
    // If input is empty, show alert and exit function
    if (!userWord) return alert("Please enter a word to check!");
    
    // If answer is wrong, show alert with incorrect word and exit function
    if (userWord !== selectedWord) {
        return alert(`Oops! ${userWord} is not the correct word`);
    }
    
    // If we get here, the answer was correct!
    alert(`Congratulations! ${userWord.toUpperCase()} is correct!`);
    initGame(); // Start a new round
};

// Set up event listeners (what happens when buttons are clicked)
refreshBtn.addEventListener("click", initGame); // New word when refresh clicked
checkBtn.addEventListener("click", checkWord); // Check answer when button clicked

// Start the game when the page first loads
initGame();