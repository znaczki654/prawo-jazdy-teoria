// =========================
// TRYB TRUDNYCH PYTAŃ
// =========================


let difficultQuestions = [];

let difficultCurrent = 0;

let difficultAnswers = {};




// =========================
// START TRUDNYCH PYTAŃ
// =========================

function startDifficultMode(){


    hideAll();


    document
    .getElementById("examScreen")
    .style.display="block";



    difficultCurrent = 0;

    difficultAnswers = {};



    createDifficultQuestions();


    showDifficultQuestion();


}





// =========================
// LOSOWANIE TRUDNYCH PYTAŃ
// =========================


function createDifficultQuestions(){


    let categoryB =

    questions.filter(q =>

        String(q["Kategorie"])
        .includes("B")

    );



    difficultQuestions =


    shuffle(

        categoryB.filter(q =>


            Number(q["Liczba punktów"]) >= 2

        )

    )
    .slice(0,30);



    console.log(
        "Trudne pytania:",
        difficultQuestions.length
    );


}





// =========================
// WYŚWIETLENIE PYTANIA
// =========================


function showDifficultQuestion(){



    let q =
    difficultQuestions[difficultCurrent];



    document
    .getElementById("questionId")
    .innerHTML =
    "ID: " + q["Numer pytania"];




    document
    .getElementById("counter")
    .innerHTML =

    `${difficultCurrent+1}/${difficultQuestions.length}`;




    document
    .getElementById("question")
    .innerHTML =
    q["Pytanie"];




    hideMedia();


    showMedia(q);


    createAnswers(q);



    document
    .getElementById("phaseInfo")
    .innerHTML =
    "🔥 Tryb trudnych pytań";



}





// =========================
// NASTĘPNE TRUDNE PYTANIE
// =========================


function nextDifficultQuestion(){



    let selected =

    document
    .querySelector(
        'input[name="answer"]:checked'
    );



    if(selected){

        difficultAnswers[difficultCurrent]
        =
        selected.value;

    }
    else{

        difficultAnswers[difficultCurrent]
        =
        null;

    }



    difficultCurrent++;




    if(
        difficultCurrent >= difficultQuestions.length
    ){

        finishDifficultMode();

    }
    else{

        showDifficultQuestion();

    }


}





// =========================
// KONIEC
// =========================


function finishDifficultMode(){


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
            user===correct
        ){

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

            points:qPoints

        });


    });



    showResult(
        result,
        points
    );


}