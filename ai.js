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
        formatAI(data.answer);



    }
    catch(error){

        console.error(error);

        answerBox.innerHTML =
        "❌ Błąd połączenia z AI";

    }


}

function formatAI(text){

    if(!text) return "Brak odpowiedzi";


    text = text
    // escape HTML
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");


    // bold **tekst**
    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // nagłówki ###
    text = text.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );


    text = text.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );


    // linia pozioma
    text = text.replace(
        /^---$/gm,
        "<hr>"
    );


    // cytaty >
    text = text.replace(
        /^> (.*)$/gm,
        "<blockquote>$1</blockquote>"
    );


    // listy *
    text = text.replace(
        /^\* (.*)$/gm,
        "<li>$1</li>"
    );


    // grupowanie li
    text = text.replace(
        /(<li>.*<\/li>)/gs,
        "<ul>$1</ul>"
    );


    // nowe linie
    text = text.replace(
        /\n/g,
        "<br>"
    );


    return text;

}