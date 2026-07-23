// =========================
// TRYB TRUDNYCH PYTAŃ
// =========================

let difficultQuestions = [];

let difficultCurrentQuestion = 0;

let difficultAnswers = {};




// =========================
// START
// =========================

function startDifficultMode(){

    currentMode = "difficulty";


    hideAll();


    document
    .getElementById("examScreen")
    .style.display="block";


    difficultCurrentQuestion=0;

    difficultAnswers={};


    createDifficultExam();

    showDifficultQuestion();

}






// =========================
// TWORZENIE TESTU
// =========================

function createDifficultExam() {


    let categoryB = questions.filter(q =>
        String(q["Kategorie"]).includes("B")
    );



    let basic = categoryB.filter(q =>
        q["Zakres struktury"] === "PODSTAWOWY"
    );



    let specialist = categoryB.filter(q =>
        q["Zakres struktury"] === "SPECJALISTYCZNY"
    );



    let basicQuestions = getDifficultByPoints(
        basic,
        10,
        6,
        4
    );



    let specialistQuestions = getDifficultByPoints(
        specialist,
        6,
        4,
        2
    );



    difficultQuestions = [

        ...shuffle(basicQuestions),
        ...shuffle(specialistQuestions)

    ];



    console.log(
        "Trudne pytania:",
        difficultQuestions.length
    );

}






// =========================
// WYBÓR WG PUNKTÓW
// =========================

function getDifficultByPoints(array, three, two, one) {


    return [

        ...pickDifficult(array,3,three),

        ...pickDifficult(array,2,two),

        ...pickDifficult(array,1,one)

    ];

}







// =========================
// WYBÓR PYTAŃ
// =========================

function pickDifficult(array, points, amount) {


    let pool = array.filter(q =>
        Number(q["Liczba punktów"]) === points
    );



    let history =
        getDifficultyHistory();



    let hard =
        [];

    let fresh =
        [];

    let normal =
        [];




    pool.forEach(q => {


        let id =
        String(q["Numer pytania"]);



        if(history.wrong.includes(id)) {


            q.difficultyStatus = "hard";

            hard.push(q);


        }
        else if(!history.used.includes(id)) {


            q.difficultyStatus = "new";

            fresh.push(q);


        }
        else {


            q.difficultyStatus = "old";

            normal.push(q);


        }


    });





    return [

        ...shuffle(hard),

        ...shuffle(fresh),

        ...shuffle(normal)

    ]
    .slice(0,amount);


}








// =========================
// HISTORIA ODPOWIEDZI
// =========================

function getDifficultyHistory() {


    let exams = JSON.parse(
        localStorage.getItem("egzaminy")
    ) || [];



    let used = [];

    let wrong = [];





    exams.forEach(exam => {


        exam.questions.forEach(q => {


            let id =
            String(q.numer);



            used.push(id);



            // źle lub brak odpowiedzi

            if(
                q.user === null ||
                q.user !== q.correct
            ) {

                wrong.push(id);

            }



        });


    });





    return {

        used:[...new Set(used)],

        wrong:[...new Set(wrong)]

    };


}







// =========================
// WYŚWIETLENIE PYTANIA
// =========================

function showDifficultQuestion() {


    let q =
    difficultQuestions[difficultCurrentQuestion];



    document
        .getElementById("questionId")
        .innerHTML =
        "ID: " + q["Numer pytania"];




    document
        .getElementById("counter")
        .innerHTML =
        `${difficultCurrentQuestion + 1}/${difficultQuestions.length}`;





    document
        .getElementById("question")
        .innerHTML =
        q["Pytanie"];





    document
        .getElementById("phaseInfo")
        .innerHTML =
        getDifficultyStatus(q);





    hideMedia();

    showMedia(q);


    createAnswers(q);


}







// =========================
// STATUS
// =========================

function getDifficultyStatus(q) {


    if(q.difficultyStatus === "hard") {

        return "❌ TRUDNE PYTANIE - wcześniej źle lub brak odpowiedzi";

    }



    if(q.difficultyStatus === "new") {

        return "🆕 NOWE PYTANIE - jeszcze nie było w historii";

    }



    return "📚 PYTANIE Z BAZY - wcześniej rozwiązane";

}








// =========================
// NASTĘPNE
// =========================

function nextDifficultQuestion() {


    let selected =
    document.querySelector(
        'input[name="answer"]:checked'
    );



    if(selected) {

        difficultAnswers[difficultCurrentQuestion] =
            selected.value;

    }
    else {

        difficultAnswers[difficultCurrentQuestion] =
            null;

    }




    difficultCurrentQuestion++;





    if(
        difficultCurrentQuestion >= difficultQuestions.length
    ) {

        finishDifficultMode();

    }
    else {

        showDifficultQuestion();

    }


}







// =========================
// KONIEC
// =========================

function finishDifficultMode() {


    let result = [];

    let points = 0;




    difficultQuestions.forEach((q,index)=>{


        let user =
        difficultAnswers[index] ?? null;



        let correct =
        String(q["Poprawna odp"]);




        let qPoints =
        Number(q["Liczba punktów"]) || 0;




        if(
            user &&
            user === correct
        ) {

            points += qPoints;

        }





        result.push({

            lp:index+1,

            numer:q["Numer pytania"],

            pytanie:q["Pytanie"],

            media:q["Media"],


            answerA:q["Odpowiedź A"],

            answerB:q["Odpowiedź B"],

            answerC:q["Odpowiedź C"],


            user:user,

            correct:correct,


            points:qPoints,


            category:q["Kategorie"],

            structure:q["Zakres struktury"]

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