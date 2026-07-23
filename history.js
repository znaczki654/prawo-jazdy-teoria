// history.js

const HISTORY_KEY = "egzaminy";

/**
 * Pobiera historię egzaminów
 */
function getExamHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}


/**
 * Zapisuje wynik egzaminu do historii
 */
function saveExamResult(result) {
    const history = getExamHistory();

    history.unshift({
        name: result.name || "Egzamin",
        date: new Date().toLocaleString("pl-PL"),
        points: result.points,
        maxPoints: result.maxPoints,
        percent: result.percent,
        passed: result.passed
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}


/**
 * Usuwa całą historię
 */
function clearExamHistory() {
    localStorage.removeItem(HISTORY_KEY);
    loadHistory();
}


/**
 * Ładuje historię do tabeli/listy
 */
function loadHistory() {

    const container = document.getElementById("historyContainer");

    if (!container) return;

    const history = getExamHistory();

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                Brak wykonanych egzaminów
            </div>
        `;
        return;
    }


    container.innerHTML = history.map((exam, index) => {

        return `
            <div class="history-item">

                <div class="history-header">
                    <strong>${exam.name}</strong>

                    <span class="${exam.passed ? "passed" : "failed"}">
                        ${exam.passed ? "ZALICZONY" : "NIEZALICZONY"}
                    </span>
                </div>


                <div class="history-info">
                    <p>
                        📅 ${exam.date}
                    </p>

                    <p>
                        ⭐ Punkty:
                        ${exam.points}/${exam.maxPoints}
                    </p>

                    <p>
                        📊 Wynik:
                        ${exam.percent}%
                    </p>
                </div>

            </div>
        `;

    }).join("");
}


/**
 * Usuwa pojedynczy egzamin
 */
function deleteExam(index) {

    let history = getExamHistory();

    history.splice(index, 1);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    loadHistory();
}


/**
 * Eksport historii do JSON
 */
function exportHistory() {

    const history = getExamHistory();

    const blob = new Blob(
        [
            JSON.stringify(history, null, 2)
        ],
        {
            type: "application/json"
        }
    );


    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "historia_egzaminow.json";

    a.click();

    URL.revokeObjectURL(url);
}


// automatyczne załadowanie po wejściu na stronę historii
document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadHistory();
    }
);