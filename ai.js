async function explainWithAI(examIndex, questionIndex, button){

    const history =
    JSON.parse(localStorage.getItem("egzaminy"));


    const q =
    history[examIndex].questions[questionIndex];


    const answerBox =
    button.nextElementSibling;


    answerBox.innerHTML =
    "⏳ AI analizuje pytanie...";


    let prompt = `

Jesteś ekspertem od prawa jazdy kategorii B w Polsce.

Wyjaśnij pytanie:

${q.pytanie}


Odpowiedź użytkownika:
${q.user}


Poprawna odpowiedź:
${q.correct}


Wyjaśnij:

1. Dlaczego poprawna odpowiedź jest poprawna.
2. Dlaczego pozostałe odpowiedzi są błędne.
3. Podaj podstawę prawną jeśli znasz.

`;


    try {


        let response = await fetch(
            "https://janek925.synology.me/api/ai.php",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    input:prompt

                })

            }
        );



        let data = await response.json();



        console.log(data);

        console.log(data);

        answerBox.innerHTML =
        (data.answer || "Brak odpowiedzi")
        .replace(/\n/g, "<br>");



    }
    catch(error){

        console.error(error);

        answerBox.innerHTML =
        "❌ Błąd połączenia z AI";

    }


}