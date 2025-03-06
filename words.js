import * as w from '/piscineWords.js';
let wordData;
/* 
async function fetchWords() {
    if (!wordData) {
        try {
            const data = await fs.readFile('/piscineWords.json', 'utf-8');
            wordData = JSON.parse(data);
        } catch (error) {
            console.error('Error reading piscineWords.json file', error);
            throw error;
        }
    }
    return wordData;
} */

async function createWordObject(questName) {
    const words = w.words[questName];
    const word = words[Math.floor(Math.random() * words.length)];
    const numLettersToRemove = word.length <= 5 ? 1 : 2;
    let result = word.split('');
    let missingLetters = [];
    
    for (let i = 0; i < numLettersToRemove; i++) {
        let indexToRemove;
        do {
        indexToRemove = Math.floor(Math.random() * word.length);
        } while (result[indexToRemove] === '_');
        
        missingLetters.push(result[indexToRemove]);
        result[indexToRemove] = '_';
    }


    return {
    [result.join('')]: missingLetters
    };
}

export async function generateWordList(questName) {
    const wordList = [];
    
    for (let i = 0; i < 12; i++) {  // Generate 12 words for each round
        const wordObject = await createWordObject(questName);
        wordList.push(wordObject);
    }
    
    return wordList;
}

export async function collectMissingLetters(wordList) {
    const missingLetters = [];
    
    wordList.forEach(wordObject => {
        const letters = Object.values(wordObject)[0];
        missingLetters.push(...letters);
    });
    
    return missingLetters;
}


export function displayWordsSequentially(wordList) {
    const container = document.getElementById('word-display');
    let currentWordIndex = 0;

    function displayNextWord() {
        if (currentWordIndex < wordList.length) {
            const [word] = Object.keys(wordList[currentWordIndex]);
            container.textContent = word;
            currentWordIndex++;
        } else {
            clearInterval(intervalId); // Stop when all words are displayed
            container.textContent = 'All words completed. Well done!';
        }
    }
    displayNextWord(); //display the first word immediately
    // Set an interval to display words every 10 seconds
    const intervalId = setInterval(displayNextWord, 15000);

}

// async function main() {
//     try {
//         const questOneWordList = await generateWordList('questOne');
//         // const mediumWordList = await generateWordList('medium');
//         // const hardWordList = await generateWordList('hard');

//         console.log("questOne Words:", questOneWordList);
//         // console.log("Medium Words:", mediumWordList);
//         // console.log("Hard Words:", hardWordList);
//     }
//     catch (error) {
//         console.error("An error occurred:", error);
//     }
// }
// main();

//  export { fetchWords, createWordObject, generateWordList };