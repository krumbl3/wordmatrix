//////////////////////// Variables
// All combos are stored here
let combos = [];

// Text area element
let textArea = document.getElementById("wordList");

// "Generate" button
let generateBtn = document.getElementById("generate");

// "Concatenate" checkbox
let concatenateBox = document.getElementById("concat");

// "separator" input
let separatorInput = document.getElementById("separator");

// All the exemples links
let exLinks = document.getElementsByClassName("exLink");

// Class wordMatrix to save the matrix (wordlist + options) 
class wordMatrix {
    text;
    isConcat;
    separator;

    constructor(text, isConcat, separator) {
        this.text = text;
        this.isConcat = isConcat;
        this.separator = separator;
    }
}

// Examples are a collection of wordMatrixes
let examples = [
    new wordMatrix("Blueberry, Honey, Peach \nCake, Pie, Crumble", false, " "),
    new wordMatrix("Super, Mega, Giga \nmouse, cat, dog\n ,31", true, ""),
    new wordMatrix("Mary, Ahmed, Miguel \nJulia, Piotr, Suza \nGiovani, Hans, Sasha", false, " + "),
    new wordMatrix("sin(, cos(, tan( \n12, 26, 89 \n) \n+, -, * \n100, 50, 25", true, ""),
]


/////////////////////////// Methods
// Generate combo (recursive) function
let generateCombos = function(lists, prefix, separator) {
    if (lists.length == 0) {
        combos.push(prefix);
        return;
    }

    let currentList = lists[0]; // first list of the super list
    let remainingLists = lists.slice(1); // all lists of the super list except the 1rst

    // Loop through the curent list
    for (let i = 0; i < currentList.length; i++) {
        
        // Append the word after the current prefix to create a new prefix 
        let newPrefix;
        if(prefix == "") {
            newPrefix =  currentList[i];
        } else {
            newPrefix = prefix + separator + currentList[i];
        }

        generateCombos(remainingLists, newPrefix, separator);
    }
}

// Create a word list
let createWordsList = function(e) {
    // Get the text area content
    let rawList = textArea.value;

    // Create a word list
    let listOfWordsList = rawList.split("\n"); // array of word lists
    for (let i = 0; i < listOfWordsList.length; i++) {
        // Spilt words in a sub array, separated by , or ; or .
        listOfWordsList[i] = listOfWordsList[i].split(new RegExp("[,;.]"));

        // Clean up spaces
        for (let j = 0; j < listOfWordsList[i].length; j++) {
            listOfWordsList[i][j] = listOfWordsList[i][j].replace(new RegExp(/\s/g),"");
        }
    }

    combos = []; // empty the combo list

    let separator = " "; // by default the word separator is a space

    // Check if the concatenate option is on
    if(concatenateBox.checked) {
        // if the separator is "space", then remove it
        if(separatorInput.value == " ") {
            separatorInput.value = "";
        }
        separator = separatorInput.value;
    } else {
        separator = " "+separatorInput.value+" ";
    }

    // Generate combos with the list of word lists
    generateCombos(listOfWordsList, "", separator);

    // Show results in the paragraph
    showResult();
}

let showResult = function(e) {
    let resultZone = document.getElementById("result");

    resultZone.innerHTML = "";
    combos.forEach(combo => {
        resultZone.innerHTML = resultZone.innerHTML + "<p>"+ combo +"</p>";
    });

}

let fillWithExample = function(e) {
    let exNo = e.target.dataset.no; // Numero of example
    let wordMatrix = examples[exNo-1]; // wordMatrix to load

    // Put the text attribute in the textArea
    textArea.value = wordMatrix.text;

    // Check/uncheck the box "concatenate"
    concatenateBox.checked = wordMatrix.isConcat ? true : false;
    
    // Put the "separator" attribute in the separatorInput
    separatorInput.value = wordMatrix.separator;

    // Generate the wordList
    createWordsList();
}

// Events listeners
generateBtn.addEventListener('click',createWordsList);
textArea.addEventListener('blur',createWordsList);
textArea.addEventListener('paste',createWordsList);
textArea.addEventListener('input',createWordsList);
separatorInput.addEventListener('input',createWordsList);
concatenateBox.addEventListener('click',createWordsList);

for (let i = 0; i < exLinks.length; i++) {
    exLinks[i].addEventListener('click',fillWithExample);
}

// A media queries check to resize textarea
const mediaQuery = window.matchMedia('(max-aspect-ratio: 2.6/2)')
// Check if the media query is true
if (mediaQuery.matches) {
  textArea.rows = 8;
}



