let difficultQuestions = [];
let difficultCurrentQuestion = 0;
let difficultAnswers = {};


// =========================
// START TRYBU TRUDNEGO
// =========================

function startDifficultMode() {

    hideAll();

    document
        .getElementById("examScreen")
        .style.display = "block";


    difficultAnswers = {};
    difficultCurrentQuestion = 0;


    createDifficultExam();


    showDifficultQuestion();

}




// =========================
// TWORZENIE TESTU TRUDNEGO
// =========================

function createDifficultExam() {


    let categoryB =
        questions.filter(q =>
            String(q["Kategorie"]).includes("B")
        );



    let basic =
        categoryB.filter(q =>
            q["Zakres struktury"] === "PODSTAWOWY"
        );



    let specialist =
        categoryB.filter(q =>
            q["Zakres struktury"] === "SPECJALISTYCZNY"
        );



    let basicQuestions =
        getDifficultByPoints(
            basic,
            10,
            6,
            4
        );



    let specialistQuestions =
        getDifficultByPoints(
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
        "Trudny test:",
        difficultQuestions.length
    );

}






// =========================
// WYBÓR PYTAŃ
// =========================


function getDifficultByPoints(array, three, two, one) {


    let result = [];



    result.push(
        ...pickDifficult(
            array,
            3,
            three
        )
    );


    result.push(
        ...pickDifficult(
            array,
            2,
            two
        )
    );


    result.push(
        ...pickDifficult(
            array,
            1,
            one
        )
    );


    return result;

}






function pickDifficult(array, points, amount) {


    let history =
        getQuestionHistory();



    let wrong =
        history.wrong;



    let used =
        history.used;



    let pool =
        array.filter(q =>
            Number(q["Liczba punktów"]) === points
        );




    // najpierw błędne

    let hard =

        pool.filter(q =>
            wrong.includes(
                String(q["Numer pytania"])
            )
        );




    // potem nowe

    let fresh =

        pool.filter(q =>

            !used.includes(
                String(q["Numer pytania"])
            )

        );




    // potem stare

    let old =

        pool.filter(q =>

            used.includes(
                String(q["Numer pytania"])
            )

        );




    let selected = [

        ...markStatus(hard,"hard"),

        ...markStatus(fresh,"new"),

        ...markStatus(old,"old")

    ];



    return selected.slice(0,amount);

}






// =========================
// HISTORIA
// =========================

function getQuestionHistory() {


    let history =
        JSON.parse(
            localStorage.getItem("egzaminy")
        ) || [];



    let used = [];
    let wrong = [];



    history.forEach(exam => {


        exam.questions.forEach(q => {


            used.push(
                String(q.numer)
            );


            if(q.user !== q.correct){

                wrong.push(
                    String(q.numer)
                );

            }


        });


    });



    return {

        used,
        wrong

    };

}





// =========================
// STATUS PYTANIA
// =========================


function markStatus(array,status){


    return array.map(q => {


        return {

            ...q,

            difficultyStatus:status

        };


    });


}