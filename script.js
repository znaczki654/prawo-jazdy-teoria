let questions=[];
let exam=[];
let current=0;

let answers={};


let examSeconds=25*60;


setInterval(()=>{

    if(examSeconds<=0)
        return;

    examSeconds--;

    let m=Math.floor(examSeconds/60);
    let s=examSeconds%60;

    document.getElementById("examTimer")
    .innerHTML =
    `${m}:${s.toString().padStart(2,'0')}`;

},1000);



// wczytanie Excela

fetch("pytania.xlsx")
.then(r=>r.arrayBuffer())
.then(buffer=>{


let workbook=XLSX.read(buffer);

let sheet=
workbook.Sheets[
workbook.SheetNames[0]
];


questions=
XLSX.utils.sheet_to_json(sheet);



startExam();

});



function startExam(){


let available =
questions.filter(q=>
String(q["Kategorie"])
.includes("B")
);


let basic =
available.filter(q=>
q["Zakres struktury"]
==="PODSTAWOWY");


let specialist =
available.filter(q=>
q["Zakres struktury"]
==="SPECJALISTYCZNY");



exam=[
...shuffle(basic).slice(0,20),
...shuffle(specialist).slice(0,12)
];


showQuestion();

}



function shuffle(arr){

return arr.sort(
()=>Math.random()-0.5
);

}




function showQuestion(){


let q=exam[current];


document.getElementById("counter")
.innerHTML=
`${current+1}/${exam.length}`;


document.getElementById("question")
.innerHTML=
q["Pytanie"];



showMedia(q["Media"]);



let box=
document.getElementById("answers");


box.innerHTML="";


if(!q["Odpowiedź A"]){

createAnswer("TAK","T");
createAnswer("NIE","N");

}
else{


createAnswer(
q["Odpowiedź A"],"A"
);

createAnswer(
q["Odpowiedź B"],"B"
);

createAnswer(
q["Odpowiedź C"],"C"
);

}


}



function createAnswer(text,value){

let box=
document.getElementById("answers");


box.innerHTML+=`

<label class="answer">

<input type="radio"
name="answer"
value="${value}">

${text}

</label>

`;

}




function showMedia(file){


let box=
document.getElementById("mediaBox");


box.innerHTML="";


if(!file)
return;


let path=
"media/"+file;


if(file.match(/\.(jpg|png)$/i)){


box.innerHTML=
`
<img src="${path}">
`;

}


else if(file.match(/\.(mp4|wmv)$/i)){


box.innerHTML=
`

<video controls>
<source src="${path}">
</video>

`;

}


}



document
.getElementById("next")
.onclick=()=>{


let selected=
document.querySelector(
'input[name="answer"]:checked'
);


if(selected){

answers[current]=selected.value;

}


current++;


if(current>=exam.length){

finish();

}
else{

showQuestion();

}


};



function finish(){

document.getElementById("questionBox")
.innerHTML=
`
<h2>Koniec egzaminu</h2>
`;

}