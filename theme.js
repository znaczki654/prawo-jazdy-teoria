if(localStorage.getItem("darkMode")==="true"){

    document.body.classList.add("dark");

    document
    .getElementById("darkModeButton")
    .innerHTML="☀️ Tryb jasny";

}


document
.getElementById("darkModeButton")
.onclick=()=>{

    document.body.classList.toggle("dark");

    let dark =
    document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        dark
    );

    document
    .getElementById("darkModeButton")
    .innerHTML =
    dark
    ?
    "☀️ Tryb jasny"
    :
    "🌙 Tryb ciemny";

};