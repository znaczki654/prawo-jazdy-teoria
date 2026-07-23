// =========================
// ŁADOWANIE EXCELA
// =========================

function loadExcel() {

    fetch("baza05-2026.xlsx")

        .then(r => r.arrayBuffer())

        .then(data => {


            let workbook =
                XLSX.read(data);

            let sheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            questions =
                XLSX.utils.sheet_to_json(sheet);



            console.log(
                "Pytań:",
                questions.length
            );

            createExam();

        });

}



// =========================
// TWORZENIE EGZAMINU
// =========================

function createExam() {


    let categoryB =

        questions.filter(q =>

            String(q["Kategorie"])
            .includes("B")

        );

    let basic =

        categoryB.filter(q =>

            q["Zakres struktury"] ===
            "PODSTAWOWY"

        );


    let specialist =

        categoryB.filter(q =>

            q["Zakres struktury"] ===
            "SPECJALISTYCZNY"

        );



    let basicQuestions =

        getQuestionsByPoints(
            basic,
            10,
            6,
            4
        );


    let specialistQuestions =

        getQuestionsByPoints(
            specialist,
            6,
            4,
            2
        );


    examQuestions = [

        ...shuffle(basicQuestions),

        ...shuffle(specialistQuestions)

    ];

    console.log(
        "Egzamin:",
        examQuestions.length
    );



    console.log(
        "Max punkty:",
        examQuestions.reduce(
            (sum, q) =>
            sum + Number(q["Liczba punktów"]),
            0
        )
    );

    startExam();

}

// =========================
// START EGZAMINU
// =========================

function startExam() {


    hideAll();

    document
        .getElementById("examScreen")
        .style.display = "block";

    currentQuestion = 0;


    userAnswers = {};

    examTime =
        25 * 60;

    startExamTimer();
    showQuestion();

}


// =========================
// TIMER EGZAMINU
// =========================

function startExamTimer() {


    clearInterval(examTimerInterval);

    examTimerInterval =

        setInterval(() => {


            examTime--;


            let m =
                Math.floor(examTime / 60);



            let s =
                examTime % 60;




            document
                .getElementById("examTimer")
                .innerHTML =

                m + ":" +
                String(s).padStart(2, "0");

            if (examTime <= 0) {

                finishExam();

            }

        }, 1000);

}


// =========================
// WYŚWIETLENIE PYTANIA
// =========================


function showQuestion() {


    clearInterval(questionTimerInterval);



    let q =
        examQuestions[currentQuestion];



    document
        .getElementById("questionId")
        .innerHTML =
        "ID: " + q["Numer pytania"];




    document
        .getElementById("counter")
        .innerHTML =

        `${currentQuestion+1}/${examQuestions.length}`;




    document
        .getElementById("question")
        .innerHTML =

        q["Pytanie"];




    hideMedia();




    document
        .getElementById("startMediaButton")
        .style.display = "none";



    createAnswers(q);




    if (
        q["Zakres struktury"] ===
        "SPECJALISTYCZNY"

    ) {

        startSpecialist(q);


    } else {


        startBasic(q);


    }


}



// =========================
// PODSTAWOWE
// =========================

function startBasic(q) {


    clearInterval(questionTimerInterval);



    currentPhase = "czytanie";



    document
        .getElementById("phaseInfo")
        .innerHTML =

        "Pytanie podstawowe - zapoznanie się z pytaniem: 20 sekund";




    let button =
        document.getElementById("startMediaButton");



    button.style.display = "block";



    document
        .getElementById("nextButton")
        .style.display = "none";



    let started = false;




    button.onclick = () => {


        if (started)
            return;



        started = true;



        showMedia(q);



        document
            .getElementById("nextButton")
            .style.display = "block";



        startAnswerTime(q);



    };




    questionTime = 20;



    runTimer(() => {



        if (!started) {



            started = true;



            showMedia(q);



            document
                .getElementById("nextButton")
                .style.display = "block";



            startAnswerTime(q);



        }



    });



}




// =========================
// ODPOWIEDŹ
// =========================

function startAnswerTime(q) {


    document
        .getElementById("startMediaButton")
        .style.display = "none";



    document
        .getElementById("phaseInfo")
        .innerHTML =

        "Pytanie podstawowe - czas na odpowiedź: 15 sekund";



    questionTime = 15;



    runTimer(() => {


        nextQuestion();


    });



}




// =========================
// SPECJALISTYCZNE
// =========================

function startSpecialist(q) {



    document
        .getElementById("nextButton")
        .style.display = "block";



    document
        .getElementById("phaseInfo")
        .innerHTML =

        "Pytanie specjalistyczne - 50 sekund";



    showMedia(q);



    questionTime = 50;



    runTimer(() => {


        nextQuestion();


    });



}




// =========================
// TIMER PYTANIA
// =========================

function runTimer(callback) {



    clearInterval(questionTimerInterval);



    updateQuestionTimer();



    questionTimerInterval =

        setInterval(() => {


            questionTime--;



            updateQuestionTimer();




            if (questionTime <= 0) {



                clearInterval(questionTimerInterval);



                callback();



            }



        }, 1000);



}




function updateQuestionTimer() {


    document
        .getElementById("questionTimer")
        .innerHTML =

        questionTime + " s";


}




// =========================
// ODPOWIEDZI
// =========================

function createAnswers(q) {


    let box =
        document.getElementById("answers");



    box.innerHTML = "";



    let booleanQuestion =

        !q["Odpowiedź A"] &&
        !q["Odpowiedź B"] &&
        !q["Odpowiedź C"];




    if (booleanQuestion) {


        createAnswer(
            "TAK",
            "T",
            box
        );



        createAnswer(
            "NIE",
            "N",
            box
        );



    } else {



        createAnswer(
            q["Odpowiedź A"],
            "A",
            box
        );



        createAnswer(
            q["Odpowiedź B"],
            "B",
            box
        );



        createAnswer(
            q["Odpowiedź C"],
            "C",
            box
        );



    }


}




function createAnswer(text, value, box) {


    box.innerHTML +=


        `
<label class="answer">

<input
type="radio"
name="answer"
value="${value}">

${text}

</label>
`;


}




// =========================
// NASTĘPNE PYTANIE
// =========================


document
    .getElementById("nextButton")
    .onclick = nextQuestion;



function nextQuestion() {



    let selected =

        document
        .querySelector(
            'input[name="answer"]:checked'
        );

    if (selected) {
        userAnswers[currentQuestion] =
            selected.value;
    } else {
        userAnswers[currentQuestion] =
            null;
    }

    currentQuestion++;

    if (
        currentQuestion >= examQuestions.length
    ) {
        finishExam();
    } else {
        showQuestion();
    }

}

// =========================
// KONIEC EGZAMINU
// =========================

function finishExam() {


    clearInterval(examTimerInterval);

    clearInterval(questionTimerInterval);

    let result = [];

    let points = 0;

    examQuestions.forEach((q, index) => {

        let user =
            userAnswers[index] ?? null;

        let correct =
            String(q["Poprawna odp"]);

        let qPoints =
            Number(q["Liczba punktów"]) || 0;

        if (
            user &&
            user === correct
        ) {
            points += qPoints;
        }
        result.push({
            lp: index + 1,
            numer: q["Numer pytania"],
            pytanie: q["Pytanie"],
            media: q["Media"],
            answerA: q["Odpowiedź A"],
            answerB: q["Odpowiedź B"],
            answerC: q["Odpowiedź C"],
            user: user,
            correct: correct,
            points: qPoints,
            category: q["Kategorie"],
            structure: q["Zakres struktury"]
        });
    });


    saveExam(
        result,
        points
    );

    showResult(
        result,
        points
    );

}