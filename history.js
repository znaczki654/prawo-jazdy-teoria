// =========================
// ZAPIS EGZAMINU
// =========================


function saveExam(result, points){



    let history =

    JSON.parse(
        localStorage.getItem("egzaminy")
    )
    ||
    [];





    let number =

    history.length + 1;






    let exam = {


        name:

        "Egzamin "
        +
        String(number)
        .padStart(2,"0"),




        date:

        new Date()
        .toLocaleString("pl-PL"),




        points: points,




        maxPoints:

        MAX_POINTS,




        percent:

        ((points / MAX_POINTS) * 100)
        .toFixed(1),




        passed:

        points >= PASS_POINTS,




        questions: result


    };







    history.push(exam);






    localStorage.setItem(

        "egzaminy",

        JSON.stringify(history)

    );



}






// =========================
// HISTORIA EGZAMINÓW
// =========================


function showHistory(){



    hideAll();




    document
    .getElementById("historyScreen")
    .style.display="block";





    let box =

    document
    .getElementById("historyList");





    box.innerHTML="";






    let history =

    JSON.parse(

        localStorage.getItem("egzaminy")

    )
    ||
    [];







    if(history.length===0){



        box.innerHTML =

        "<p>Brak zapisanych egzaminów</p>";

        return;


    }







    history.forEach((exam,index)=>{





        box.innerHTML +=




        `
        <div class="history-item"

        onclick="openExamHistory(${index})">



            <b>

                ${exam.name}

            </b>



            <br>


            ${exam.date}



            <br>



            Wynik:

            ${exam.points}/${exam.maxPoints}

            pkt



            <br>



            Skuteczność:

            ${exam.percent}%



            <br>



            Rezultat:

            ${
            exam.passed
            ?
            "✅ ZDANY"
            :
            "❌ NIEZDANY"
            }



        </div>

        `;



    });



}







// =========================
// PODGLĄD EGZAMINU
// =========================


function openExamHistory(index){



    let history =

    JSON.parse(

        localStorage.getItem("egzaminy")

    );





    let exam =

    history[index];






    document
    .getElementById("reviewTitle")
    .innerHTML =

    "Podgląd egzaminu "
    +
    exam.name;






    hideAll();





    document
    .getElementById("reviewScreen")
    .style.display="block";






    let box =

    document
    .getElementById("reviewContent");





    box.innerHTML="";








    exam.questions.forEach(q=>{



        let cls;





        if(q.user===null)

            cls="empty";



        else if(q.user===q.correct)

            cls="correct";



        else

            cls="wrong";









        box.innerHTML +=




        `
        <div class="review-item ${cls}">



            <h3>


                Pytanie ${q.lp}



                <span class="question-id">

                    ID: ${q.numer}

                </span>


            </h3>






            <p>

                ${q.pytanie}

            </p>







            ${
            q.media ?

            `

            <button

            onclick="showHistoryMedia(this,'${q.media}')">

                Pokaż multimedia

            </button>



            <div class="history-media"></div>


            `
            :
            ""

            }








            <button

            onclick="explainWithAI(${index}, ${q.lp-1}, this)">

                🤖 Wyjaśnij AI

            </button>




            <div class="ai-answer"></div>








            <div class="answer-summary">



                <p>

                    Twoja odpowiedź:

                    ${translateAnswer(q.user)}

                </p>





                <p>

                    Poprawna odpowiedź:

                    ${translateAnswer(q.correct)}

                </p>





                <p>

                    Punkty:

                    ${
                    q.user===q.correct
                    ?
                    q.points
                    :
                    0
                    }
                    /
                    ${q.points}

                </p>



            </div>






            ${createHistoryAnswers(q)}



        </div>

        `;



    });



}








// =========================
// ODPOWIEDZI W HISTORII
// =========================


function createHistoryAnswers(q){



    if(
        q.correct==="T" ||
        q.correct==="N"
    ){

        return "";

    }






    let html="";







    let answers=[



        {
            value:"A",
            text:q.answerA
        },


        {
            value:"B",
            text:q.answerB
        },


        {
            value:"C",
            text:q.answerC
        }


    ];







    answers.forEach(a=>{



        let icon="";





        if(a.value===q.correct)

            icon="✅";





        if(
            a.value===q.user &&
            a.value!==q.correct
        )

            icon="❌";







        html +=



        `
        <div class="history-answer">

            ${a.value})

            ${a.text ?? ""}

            ${icon}

        </div>

        `;



    });







    return html;


}








// =========================
// POWRÓT Z HISTORII
// =========================


document
.getElementById("backHistoryButton")
.onclick =

showHistory;