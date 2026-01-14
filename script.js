// DATA-STRUKTUR
// low: Må jobbes med | med: Godt/Greit | high: Fremragende
const defaultData = [
    {
        category: "Struktur",
        items: [
            { 
                label: "Innledning", 
                low: "var innledningen noe utydelig, og du bør prøve å definere problemstillingen klarere", 
                med: "hadde du en grei innledning som presenterte temaet", 
                high: "fanget du oppmerksomheten umiddelbart med en tydelig og engasjerende innledning" 
            },
            { 
                label: "Rød tråd", 
                low: "var det litt vanskelig å følge strukturen i presentasjonen", 
                med: "hadde presentasjonen en logisk oppbygning", 
                high: "var det en veldig god struktur og rød tråd gjennom hele foredraget" 
            },
            { 
                label: "Avslutning", 
                low: "sluttet presentasjonen litt brått uten oppsummering", 
                med: "rundet du av greit med en oppsummering", 
                high: "hadde du en svært god konklusjon som samlet trådene på en elegant måte" 
            }
        ]
    },
    {
        category: "Innhold",
        items: [
            { 
                label: "Forståelse", 
                low: "bar stoffet litt preg av opplesning av fakta uten at du forklarte så mye med egne ord", 
                med: "viser du god faglig forståelse", 
                high: "viser du svært høy faglig kompetanse og forklarer komplekse ting på en enkel måte" 
            },
            { 
                label: "Relevans", 
                low: "sporet du litt av i forhold til oppgaveteksten", 
                med: "holdt du deg fint til temaet", 
                high: "var innholdet veldig relevant og svarte presist på problemstillingen" 
            },
            { 
                label: "Kildebruk", 
                low: "må du huske å oppgi kilder tydeligere", 
                med: "var kildebruken godkjent", 
                high: "viste du en meget god og ryddig kildebruk" 
            }
        ]
    },
    {
        category: "Framføring",
        items: [
            { 
                label: "Blikkontakt", 
                low: "var du veldig bundet til manuset", 
                med: "hadde du noe blikkontakt, men så også en del i papirene", 
                high: "var du helt løsrevet fra manus og hadde super kontakt med publikum" 
            },
            { 
                label: "Stemmebruk", 
                low: "bør du prøve å snakke høyere og tydeligere neste gang", 
                med: "snakker du tydelig og greit", 
                high: "bruker du stemmen aktivt og variert for å holde på oppmerksomheten" 
            }
        ]
    }
];

let formData = [];

// LAST INN DATA
window.onload = function() {
    loadData();
    renderForm();
};

function loadData() {
    // Endrer versjonsnavn til v4 for å tvinge frem den nye teksten med bedre flyt
    const saved = localStorage.getItem('pres_data_v4'); 
    
    if (saved) {
        formData = JSON.parse(saved);
    } else {
        formData = JSON.parse(JSON.stringify(defaultData));
    }
}

function saveData() {
    localStorage.setItem('pres_data_v4', JSON.stringify(formData));
    renderForm();
}

// TEGNE SKJEMAET (Uendret logikk)
function renderForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = ""; 

    formData.forEach((cat, catIndex) => {
        const catDiv = document.createElement('div');
        catDiv.className = "category";
        
        const h3 = document.createElement('h3');
        h3.innerText = cat.category;
        catDiv.appendChild(h3);

        cat.items.forEach((item, itemIndex) => {
            const row = document.createElement('div');
            row.className = "item-row";
            const groupName = `grp_${catIndex}_${itemIndex}`;

            const label = document.createElement('span');
            label.className = "item-label";
            label.innerText = item.label;

            const radioGroup = document.createElement('div');
            radioGroup.className = "radio-group";
            
            radioGroup.innerHTML = `
                <label><input type="radio" name="${groupName}" value="low"> Må jobbes med</label>
                <label><input type="radio" name="${groupName}" value="med"> Godt</label>
                <label><input type="radio" name="${groupName}" value="high"> Fremragende</label>
            `;

            row.appendChild(label);
            row.appendChild(radioGroup);
            catDiv.appendChild(row);
        });
        container.appendChild(catDiv);
    });
}

// GENERERE TEKST MED FLYT
function generateComment() {
    const name = document.getElementById('studentName').value.trim() || "Eleven";
    const topic = document.getElementById('topic').value.trim() || "temaet";
    
    let fullText = `Hei ${name}.\n\nTakk for presentasjonen din om ${topic}. Her er min vurdering:\n\n`;

    // Gå gjennom hver hovedkategori for å lage avsnitt
    formData.forEach((cat, index) => {
        let categorySentences = [];

        // Samle alle setninger som er krysset av i denne kategorien
        cat.items.forEach((item, itemIndex) => {
            const groupName = `grp_${index}_${itemIndex}`;
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            
            if (checked) {
                const val = checked.value; 
                if (item[val]) {
                    categorySentences.push(item[val]);
                }
            }
        });

        // Hvis vi har setninger i denne kategorien, lim dem sammen
        if (categorySentences.length > 0) {
            
            // 1. Legg til en innledende frase basert på hvilken kategori det er (for flyt)
            let introPhrase = "";
            
            // Logikk for binde-fraser basert på rekkefølgen i skjemaet
            if (index === 0) {
                introPhrase = "Når det gjelder struktur og oppbygning, ser jeg at ";
            } else if (index === 1) {
                introPhrase = "Ser vi på det faglige innholdet, ";
            } else if (index === formData.length - 1) { // Siste kategori
                introPhrase = "Til slutt vil jeg nevne fremføringen, hvor ";
            } else {
                introPhrase = `Når det gjelder ${cat.category.toLowerCase()}, `;
            }

            // 2. Slå sammen setningene. 
            // Vi bruker ". " som skille, men fjerner stor bokstav i starten av setningene våre i dataen 
            // slik at de passer etter intro-frasen.
            
            // Bygg avsnittet
            let paragraph = introPhrase + categorySentences.join(". Dessuten ");
            
            // Legg til punktum til slutt hvis det mangler
            if (!paragraph.endsWith(".")) {
                paragraph += ".";
            }

            fullText += paragraph + "\n\n";
        }
    });

    // Avslutning og karakter
    const grade = document.querySelector('input[name="grade"]:checked');
    if (grade) {
        fullText += `Alt i alt en gjennomføring som kvalifiserer til karakter: ${grade.value}`;
    } else {
        fullText += "Lykke til videre med arbeidet!";
    }

    document.getElementById('resultOutput').value = fullText;
}

// REDIGERING
function toggleEditMode() {
    const panel = document.getElementById('editPanel');
    panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function addItem() {
    const catName = document.getElementById('newCatName').value.trim();
    const label = document.getElementById('newLabel').value.trim();
    
    // Tips i placeholderne for å få god flyt
    const low = document.getElementById('textLow').value.trim();
    const med = document.getElementById('textMed').value.trim();
    const high = document.getElementById('textHigh').value.trim();

    if (!catName || !label || !low || !med || !high) {
        alert("Fyll ut alle felt.");
        return;
    }

    let category = formData.find(c => c.category.toLowerCase() === catName.toLowerCase());
    if (!category) {
        category = { category: catName, items: [] };
        formData.push(category);
    }

    category.items.push({ label, low, med, high });
    saveData();
    
    // Nullstill inputs
    document.getElementById('newLabel').value = "";
    document.getElementById('textLow').value = "";
    document.getElementById('textMed').value = "";
    document.getElementById('textHigh').value = "";
    alert("Lagt til! Husk å skrive setningene slik at de passer inn i en setning (med liten for-bokstav).");
}

function resetToDefault() {
    if(confirm("Er du sikker? Dette sletter alle endringer.")) {
        localStorage.removeItem('pres_data_v4');
        loadData();
        renderForm();
    }
}

function resetForm() {
    document.getElementById('studentName').value = "";
    document.getElementById('topic').value = "";
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('resultOutput').value = "";
}

function copyText() {
    const el = document.getElementById("resultOutput");
    el.select();
    navigator.clipboard.writeText(el.value);
}
