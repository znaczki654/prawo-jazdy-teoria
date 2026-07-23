// =========================
// WYNIK EGZAMINU
// =========================


function showResult(result, points){


    hideAll();



    document
    .getElementById("resultScreen")
    .style.display="block";



    let box =
    document.getElementById("result");



    let percent =

    ((points / MAX_POINTS) * 100)
    .toFixed(1);




    let passed =

    points >= PASS_POINTS;




    box.innerHTML =


    `
    <div class="score">


        <h2>
            ${points}/${MAX_POINTS} pkt
        </h2>



        <p>
            Skuteczność:
            ${percent}%
        </p>



        <h2>

        ${
            passed
            ?
            "✅ ZDANY"
            :
            "❌ NIEZDANY"
        }

        </h2>


    </div>
    `;







    result.forEach(q=>{



        let cls;



        if(q.user === null)

            cls="empty";


        else if(q.user === q.correct)

            cls="correct";


        else

            cls="wrong";







        box.innerHTML +=


        `
        <div class="result-item ${cls}">


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





            <p>

                Twoja odpowiedź:

                ${translateAnswer(q.user)}

            </p>





            <p>

                Poprawna:

                ${translateAnswer(q.correct)}

            </p>





            ${createResultAnswers(q)}






            <p>

                Punkty:

                ${q.user === q.correct ? q.points : 0}/${q.points}

            </p>




        </div>

        `;



    });



}





// =========================
// ODPOWIEDZI WYNIKU
// =========================


function createResultAnswers(q){


    // pytania TAK/NIE
    if(
        q.correct==="T" ||
        q.correct==="N"
    ){

        return "";

    }





    let html="";





    let answers=[


        {
            v:"A",
            t:q.answerA
        },


        {
            v:"B",
            t:q.answerB
        },


        {
            v:"C",
            t:q.answerC
        }


    ];







    answers.forEach(a=>{



        let icon="";




        if(a.v === q.correct)

            icon="✅";





        if(
            a.v === q.user &&
            a.v !== q.correct
        )

            icon="❌";






        html +=


        `
        <p>

            ${a.v})
            ${a.t ?? ""}

            ${icon}

        </p>
        `;



    });





    return html;


}