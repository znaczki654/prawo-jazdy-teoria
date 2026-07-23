let questions = [];
let examQuestions = [];

let currentQuestion = 0;

let userAnswers = {};

let examTime = 25 * 60;
let examTimerInterval;

let questionTimerInterval;
let questionTime = 0;

let currentPhase = "";

document.getElementById("startButton").onclick = loadExcel;
document.getElementById("historyButton").onclick = showHistory;
document.getElementById("backMenuButton").onclick = showMenu;
document.getElementById("backAfterResult").onclick = showMenu;
document.getElementById("backHistoryButton").onclick = showHistory;

document.getElementById("nextButton").onclick = nextQuestion;

document.addEventListener("contextmenu", function(e){

    let exam =
    document.getElementById("examScreen");

    if(
        exam &&
        exam.style.display==="block"
    ){

        e.preventDefault();

    }

});