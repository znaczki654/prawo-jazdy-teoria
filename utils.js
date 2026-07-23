// =========================
// STAŁE
// =========================

const MAX_POINTS = 74;
const PASS_POINTS = 68;


// =========================
// MENU
// =========================

function hideAll(){

    document
    .querySelectorAll(".container > div")
    .forEach(x=>{

        x.style.display="none";

    });

}


function showMenu(){

    hideAll();

    document
    .getElementById("menuScreen")
    .style.display="block";

    if(typeof loadVersion==="function"){
        loadVersion();
    }

}


// =========================
// LOSOWANIE
// =========================

function shuffle(arr){

    return arr.sort(
        ()=>Math.random()-0.5
    );

}


// =========================
// LOSOWANIE WG PUNKTÓW
// =========================

function getQuestionsByPoints(array, three, two, one){

    let q3 =
    shuffle(
        array.filter(q =>
            Number(q["Liczba punktów"])===3
        )
    ).slice(0,three);

    let q2 =
    shuffle(
        array.filter(q =>
            Number(q["Liczba punktów"])===2
        )
    ).slice(0,two);

    let q1 =
    shuffle(
        array.filter(q =>
            Number(q["Liczba punktów"])===1
        )
    ).slice(0,one);

    return [
        ...q3,
        ...q2,
        ...q1
    ];

}


// =========================
// TŁUMACZENIE
// =========================

function translateAnswer(value){

    if(value==="T")
        return "TAK";

    if(value==="N")
        return "NIE";

    return value ?? "brak";

}

