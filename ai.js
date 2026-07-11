async function explainWithAI(examIndex, questionIndex, button){

    const history =
    JSON.parse(localStorage.getItem("egzaminy"));


    const q =
    history[examIndex].questions[questionIndex];


    const answerBox =
    button.nextElementSibling;


    answerBox.innerHTML =
    "⏳ AI analizuje pytanie...";


    try{


        const response = await fetch(
            "https://janek925.synology.me/api/ai.php",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    question:q.pytanie,

                    answerA:q.answerA,
                    answerB:q.answerB,
                    answerC:q.answerC,

                    userAnswer:q.user,

                    correctAnswer:q.correct,

                    points:q.points

                })

            }
        );


        const data =
        await response.json();


        if(data.error){

            answerBox.innerHTML =
            "❌ Błąd AI: " + data.error;

            return;

        }


        answerBox.innerHTML =

        `
        <div class="ai-answer">

        <h3>🤖 Wyjaśnienie AI</h3>

        ${data.answer}

        </div>
        `;


    }
    catch(error){

        console.error(error);

        answerBox.innerHTML =
        "❌ Nie udało się połączyć z AI";

    }


}