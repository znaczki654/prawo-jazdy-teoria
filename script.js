let questions = [];
let examQuestions = [];

let currentQuestion = 0;

let userAnswers = {};

let examTime = 25 * 60;
let examTimerInterval;

let questionTime = 0;
let questionTimerInterval;

let examStarted = false;





document
    .getElementById("startButton")
    .addEventListener("click", startExam);





// ===============================
// START
// ===============================


function startExam() {


    document
        .getElementById("startScreen")
        .style.display = "none";


    document
        .getElementById("examScreen")
        .style.display = "block";



    loadExcel();


}





// ===============================
// WCZYTANIE EXCELA
// ===============================


function loadExcel() {


    fetch("baza05-2026.xlsx")

        .then(response => response.arrayBuffer())

        .then(buffer => {


            let workbook =
                XLSX.read(buffer);



            let sheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];



            questions =
                XLSX.utils.sheet_to_json(sheet);



            console.log(
                "Załadowano pytań:",
                questions.length
            );



            createExam();



        })

        .catch(error => {

            console.error(error);

            alert(
                "Nie udało się wczytać bazy pytań"
            );

        });


}






// ===============================
// TWORZENIE EGZAMINU
// ===============================


function createExam() {


    let categoryB =
        questions.filter(q =>

            String(q["Kategorie"])
                .includes("B")

        );



    let basic =

        categoryB.filter(q =>

            q["Zakres struktury"]
            ===
            "PODSTAWOWY"

        );



    let specialist =

        categoryB.filter(q =>

            q["Zakres struktury"]
            ===
            "SPECJALISTYCZNY"

        );



    console.log(
        "Podstawowe:",
        basic.length
    );


    console.log(
        "Specjalistyczne:",
        specialist.length
    );



    examQuestions = [

        ...shuffle(basic).slice(0,20),

        ...shuffle(specialist).slice(0,12)

    ];



    startTimers();


    showQuestion();


}





function shuffle(array) {


    return array
        .sort(
            () =>
                Math.random() - 0.5
        );

}






// ===============================
// TIMER EGZAMINU
// ===============================


function startTimers() {


    examTimerInterval =
        setInterval(() => {


            examTime--;


            let min =
                Math.floor(
                    examTime / 60
                );


            let sec =
                examTime % 60;



            document
                .getElementById("examTimer")
                .innerHTML =

                min +
                ":" +
                String(sec)
                    .padStart(2,"0");



            if(examTime <= 0){

                finishExam();

            }



        },1000);


}







// ===============================
// WYŚWIETLENIE PYTANIA
// ===============================


function showQuestion(){


    clearInterval(
        questionTimerInterval
    );



    let q =
        examQuestions[currentQuestion];



    document
        .getElementById("counter")
        .innerHTML =

        `${currentQuestion+1}/${examQuestions.length}`;



    document
        .getElementById("question")
        .innerHTML =

        q["Pytanie"];




    showMedia(
        q["Media"]
    );



    createAnswers(q);



    startQuestionTimer(q);


}







// ===============================
// ODPOWIEDZI
// ===============================


function createAnswers(q){


    let box =
        document.getElementById("answers");



    box.innerHTML = "";



    let isBoolean =

        !q["Odpowiedź A"] &&
        !q["Odpowiedź B"] &&
        !q["Odpowiedź C"];




    if(isBoolean){


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


    }

    else{


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





function createAnswer(text,value,box){


    box.innerHTML += `


<label class="answer">


<input type="radio"
name="answer"
value="${value}">


${value}. ${text}


</label>


`;

}







// ===============================
// MEDIA
// ===============================


function showMedia(file){


    let box =
        document.getElementById("mediaBox");



    box.innerHTML="";



    if(!file)
        return;



    let path =
        "media/" + file;



    if(
        file.match(
            /\.(jpg|jpeg|png)$/i
        )
    ){


        box.innerHTML =

        `
        <img src="${path}">
        `;


    }



    else if(
        file.match(
            /\.(mp4|wmv)$/i
        )
    ){


        box.innerHTML =


        `

        <video id="questionVideo"
        controls
        autoplay>

        <source src="${path}">

        </video>

        `;


    }


}






// ===============================
// TIMER PYTANIA
// ===============================


function startQuestionTimer(q){



    let specialist =

        q["Zakres struktury"]
        ===
        "SPECJALISTYCZNY";



    questionTime =
        specialist
        ?
        50
        :
        35;



    updateQuestionTimer();



    questionTimerInterval =

        setInterval(()=>{


            questionTime--;


            updateQuestionTimer();



            if(questionTime <= 0){


                clearInterval(
                    questionTimerInterval
                );


                nextQuestion();


            }



        },1000);


}





function updateQuestionTimer(){


    document
        .getElementById("questionTimer")
        .innerHTML =

        questionTime + " s";


}







// ===============================
// NASTĘPNE
// ===============================


document
.getElementById("nextButton")
.addEventListener(
"click",
nextQuestion
);





function nextQuestion(){


    let selected =

        document.querySelector(
            'input[name="answer"]:checked'
        );



    if(selected)

        userAnswers[currentQuestion] =
            selected.value;

    else

        userAnswers[currentQuestion] =
            null;




    currentQuestion++;



    if(
        currentQuestion >=
        examQuestions.length
    ){

        finishExam();

    }

    else{

        showQuestion();

    }



}







// ===============================
// KONIEC
// ===============================


function finishExam(){


    clearInterval(
        examTimerInterval
    );


    clearInterval(
        questionTimerInterval
    );



    document
        .getElementById("examScreen")
        .style.display="none";



    document
        .getElementById("resultScreen")
        .style.display="block";



    showResult();


}







function finishExam(){


    clearInterval(examTimerInterval);

    clearInterval(questionTimerInterval);


    document.getElementById("examScreen")
        .style.display="none";


    document.getElementById("resultScreen")
        .style.display="block";


    showResult();

}








function showResult(){


    let result =
        document.getElementById("result");


    result.innerHTML="";



    let points = 0;



    examQuestions.forEach(
        (q,index)=>{


            let user =
                userAnswers[index];


            let correct =
                String(q["Poprawna odp"]);



            let className;


            if(user === null){

                className="empty";

            }

            else if(user == correct){

                className="correct";


                points +=
                Number(
                    q["Liczba punktów"]
                ) || 0;


            }

            else{

                className="wrong";

            }



            result.innerHTML += `


<div class="result-item ${className}">


<b>
Pytanie ${index+1}
</b>


<br>


Twoja odpowiedź:
${user ?? "brak"}


<br>


Poprawna:
${correct}



<br>


Punkty:
${q["Liczba punktów"] || 0}


</div>


`;



        }
    );



    result.innerHTML =

    `

<h2>
Zdobyte punkty: ${points}
</h2>

<hr>

`
+
result.innerHTML;



}