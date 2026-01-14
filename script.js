// DATA DATA STRUKTUR
// low: Må jobbes med | med: Godt/Greit | high: Fremragende
const defaultData = [
    {
        category: "Struktur & Oppbygning",
        items: [
            { 
                label: "Innledning", 
                low: "Innledningen var noe utydelig. Prøv å definere problemstillingen klarere.", 
                med: "Du hadde en grei innledning som presenterte temaet.", 
                high: "Du fanget oppmerksomheten umiddelbart med en tydelig og engasjerende innledning." 
            },
            { 
                label: "Rød tråd", 
                low: "Det var litt vanskelig å følge strukturen i presentasjonen.", 
                med: "Presentasjonen hadde en logisk oppbygning.", 
                high: "Veldig god struktur og rød tråd gjennom hele foredraget." 
            },
            { 
                label: "Avslutning", 
                low: "Presentasjonen sluttet litt brått uten oppsummering.", 
                med: "Du rundet av greit med en oppsummering.", 
                high: "Du hadde en svært god konklusjon som samlet trådene." 
            }
        ]
    },
    {
        category: "Faglig innhold",
        items: [
            { 
                label: "Forståelse", 
                low: "Du leste mye opp fakta uten å forklare så mye med egne ord.", 
                med: "Du viser god faglig forståelse.", 
                high: "Du viser svært høy faglig kompetanse og forklarer komplekse ting på en enkel måte." 
            },
            { 
                label: "Relevans", 
                low: "Du sporet litt av i forhold til oppgaveteksten.", 
                med: "Du holdt deg fint til temaet.", 
                high: "Veldig relevant innhold som svarte presist på problemstillingen." 
            },
            { 
                label: "Kildebruk", 
                low: "Husk å oppgi kilder tydeligere.", 
                med: "Kildebruken var godkjent.", 
                high: "Meget god og ryddig kildebruk." 
            }
        ]
    },
    {
        category: "Framføring",
        items: [
            { 
                label: "Blikkontakt", 
                low: "Du var veldig bundet til manuset.", 
                med: "Du hadde noe blikkontakt, men så også en del i papirene.", 
                high: "Du var helt løsrevet fra manus og hadde super kontakt med publikum." 
            },
            { 
                label: "Stemmebruk", 
                low: "Prøv å snakke høyere og tydeligere neste gang.", 
                med: "Du snakker tydelig og greit.", 
                high: "Du bruker stemmen aktivt og variert for å holde på oppmerksomheten." 
            }
        ]
    }
];

let formData = [];

// Når siden lastes
window.onload = function() {
    loadData();
    renderForm();
};

function loadData() {
    // Vi bruker nøkkelen 'pres_data_v3' for å sikre at vi ikke henter gamle datafeil
    const saved = localStorage.getItem('pres_data_v3'); 
    
    if (saved) {
        formData = JSON.parse(saved);
    } else {
        // Hvis ingen data finnes, last standard
        formData = JSON.parse(JSON.stringify(defaultData));
    }
}

function saveData() {
    localStorage.setItem('pres_data_v3', JSON.stringify(formData));
    renderForm();
}

// TEGNE SKJEMAET (Dette lager HTML-en automatisk)
function renderForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = ""; // Tømmer beholderen først

    formData.forEach((cat, catIndex) => {
        // Lag overskrift for kategori (f.eks "Struktur")
        const catDiv = document.createElement('div');
        catDiv.className = "category";
        
        const h3 = document.createElement('h3');
        h3.innerText = cat.category;
        catDiv.appendChild(h3);

        // Lag hver linje med 3 valg
        cat.items.forEach((item, itemIndex) => {
            const row = document.createElement('div');
            row.className = "item-row";

            // Unikt navn for radiogruppen slik at de henger sammen
            const groupName = `grp_${catIndex}_${itemIndex}`;

            // Selve navnet på punktet (f.eks "Blikkontakt")
            const label = document.createElement('span');
            label.className = "item-label";
            label.innerText = item.label;

            // De tre knappene
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

// GENERERE TEKST
function generateComment() {
    const name = document.getElementById('studentName').value.trim() || "Eleven";
    const topic = document.getElementById('topic').value.trim() || "temaet";
    
    let parts = [];
    parts.push(`Hei ${name}. Her er en tilbakemelding på din presentasjon om ${topic}.`);

    // Gå gjennom alle punktene og sjekk hva som er valgt
    formData.forEach((cat, catIndex) => {
        cat.items.forEach((item, itemIndex) => {
            const groupName = `grp_${catIndex}_${itemIndex}`;
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            
            if (checked) {
                const val = checked.value; // 'low', 'med', eller 'high'
                // Legg til teksten som hører til valget
                if (item[val]) {
                    parts.push(item[val]);
                }
            }
        });
    });

    // Legg til karakter hvis valgt
    const grade = document.querySelector('input[name="grade"]:checked');
    if (grade) {
        parts.push(`\nKarakter: ${grade.value}`);
    } else {
        parts.push("\nLykke til videre!");
    }

    // Sett sammen teksten med mellomrom
    document.getElementById('resultOutput').value = parts.join(" ");
}

// REDIGERING
function toggleEditMode() {
    const panel = document.getElementById('editPanel');
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

function addItem() {
    const catName = document.getElementById('newCatName').value.trim();
    const label = document.getElementById('newLabel').value.trim();
    const low = document.getElementById('textLow').value.trim();
    const med = document.getElementById('textMed').value.trim();
    const high = document.getElementById('textHigh').value.trim();

    if (!catName || !label || !low || !med || !high) {
        alert("Alle felt må fylles ut for å legge til.");
        return;
    }

    // Sjekk om kategorien finnes fra før
    let category = formData.find(c => c.category.toLowerCase() === catName.toLowerCase());
    
    // Hvis ikke, lag ny kategori
    if (!category) {
        category = { category: catName, items: [] };
        formData.push(category);
    }

    // Legg til det nye punktet
    category.items.push({ label, low, med, high });
    saveData();
    
    alert("Punkt lagt til!");
    
    // Tøm feltene
    document.getElementById('newLabel').value = "";
    document.getElementById('textLow').value = "";
    document.getElementById('textMed').value = "";
    document.getElementById('textHigh').value = "";
}

function resetToDefault() {
    if(confirm("Er du sikker? Dette sletter alle dine egne kategorier og gjenoppretter standard.")) {
        localStorage.removeItem('pres_data_v3');
        loadData();
        renderForm();
    }
}

// RESET SKJEMA (Fjerner avkrysninger)
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
