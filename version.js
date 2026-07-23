function loadVersion(){

    fetch("version.json")
    .then(r=>r.json())
    .then(v=>{

        let version =
        document.getElementById("version");

        if(!version)
            return;

        document
        .getElementById("version-block")
        .style.display="block";

        version.innerHTML =
        v.version;

    });

}

loadVersion();