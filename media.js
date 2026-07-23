// =========================
// KONFIGURACJA MEDIA
// =========================


const MEDIA_PATH =
"https://janek925.synology.me/media/";




// =========================
// UKRYWANIE MEDIA
// =========================


function hideMedia(){


    let box =
    document.getElementById("mediaBox");



    if(box){

        box.innerHTML="";

    }


}






// =========================
// POKAZANIE MEDIA W EGZAMINIE
// =========================


function showMedia(q){



    let box =
    document.getElementById("mediaBox");



    if(!box)
        return;




    box.innerHTML="";




    if(!q["Media"])
        return;






    let file =

    q["Media"]
    .replace(/\.wmv$/i,".mp4");






    let path =

    MEDIA_PATH + file;







    // =====================
    // OBRAZ
    // =====================


    if(
        file.match(
            /\.(jpg|jpeg|png)$/i
        )
    ){



        box.innerHTML =


        `
        <img

        src="${path}"

        class="media-image">

        `;



    }







    // =====================
    // VIDEO
    // =====================


    else if(
        file.match(
            /\.mp4$/i
        )
    ){



        box.innerHTML =



        `
        <video

        id="videoPlayer"

        autoplay

        playsinline

        controlsList="nodownload noplaybackrate nofullscreen">


            <source

            src="${path}"

            type="video/mp4">


        </video>

        `;







        let video =

        document
        .getElementById("videoPlayer");




        if(video){


            video.controls=false;


            video.oncontextmenu = () => false;


        }



    }



}









// =========================
// MEDIA W HISTORII
// =========================


function showHistoryMedia(button, file){



    if(!file)

        return;





    let box =

    button
    .nextElementSibling;





    if(!box)

        return;







    // ukrywanie

    if(box.innerHTML !== ""){


        box.innerHTML="";

        button.innerHTML =
        "Pokaż multimedia";


        return;


    }







    file =

    file.replace(
        /\.wmv$/i,
        ".mp4"
    );







    let path =

    MEDIA_PATH + file;








    // =====================
    // OBRAZ
    // =====================


    if(
        file.match(
            /\.(jpg|jpeg|png)$/i
        )
    ){



        box.innerHTML =


        `
        <div class="review-media">


            <img

            src="${path}">


        </div>

        `;



    }







    // =====================
    // VIDEO
    // =====================


    else if(
        file.match(
            /\.mp4$/i
        )
    ){



        box.innerHTML =



        `
        <div class="review-media">


            <video controls>


                <source

                src="${path}"

                type="video/mp4">


            </video>


        </div>

        `;



    }






    button.innerHTML =
    "Ukryj multimedia";


}