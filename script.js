// DATA STRUKTUR (Sjekklisten)
const defaultData = [
    {
        category: "Struktur & Oppbygning",
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
        category: "Faglig innhold",
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
                label: "Kildekritikk", 
                low: "du viser at du ikke helt vet hvordan du skal være kildekritisk", 
                med: "du viser delvis at du kan antyde om en kilde er god eller ikke", 
                high: "du viser at du forstår kildekritikk ganske godt, og kan vurdere om kilder er gode eller ikke" 
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
    // V4 brukes for å sikre at vi har riktig datastruktur
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

// TEGNE SKJEMAET
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

// GENERERE TEKST
function generateComment() {
    const name = document.getElementById('studentName').value.trim() || "Eleven";
    const topic = document.getElementById('topic').value.trim() || "temaet";
    
    let fullText = `Hei ${name}.\n\nTakk for presentasjonen din om ${topic}. Her er min vurdering:\n\n`;

    // 1. GÅ GJENNOM KATEGORIENE
    formData.forEach((cat, index) => {
        let categorySentences = [];

        cat.items.forEach((item, itemIndex) => {
            const groupName = `grp_${index}_${itemIndex}`;
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            
            if (checked && item[checked.value]) {
                categorySentences.push(item[checked.value]);
            }
        });

        if (categorySentences.length > 0) {
            let introPhrase = "";
            
            if (index === 0) introPhrase = "Når det gjelder struktur og oppbygning, ser jeg at ";
            else if (index === 1) introPhrase = "Ser vi på det faglige innholdet, ";
            else if (index === formData.length - 1) introPhrase = "Til slutt vil jeg nevne fremføringen, hvor ";
            else introPhrase = `Når det gjelder ${cat.category.toLowerCase()}, `;

            let paragraph = introPhrase + categorySentences.join(". Dessuten ");
            if (!paragraph.endsWith(".")) paragraph += ".";
            fullText += paragraph + "\n\n";
        }
    });

    // 2. BEHANDLE SPØRSMÅLET
    const qTopic = document.getElementById('questionTopic').value.trim();
    const qResponse = document.querySelector('input[name="question_response"]:checked');

    if (qResponse) {
        // Bruker standardtekst "temaet" hvis læreren glemte å skrive inn spørsmålet
        const topicText = qTopic ? qTopic : "temaet vi diskuterte";
        let qText = "";

        if (qResponse.value === "none") {
            qText = `Du klarte dessverre ikke å svare på spørsmålet om ${topicText}.`;
        } else if (qResponse.value === "part") {
            qText = `Du svarte delvis på spørsmålet om ${topicText}, men her manglet det litt dybde.`;
        } else if (qResponse.value === "full") {
            qText = `I samtalen etterpå svarte du godt og reflektert på spørsmålet om ${topicText}.`;
        }

        fullText += "Oppfølgingsspørsmål: " + qText + "\n\n";
    }

    // 3. KARAKTER
    const grade = document.querySelector('input[name="grade"]:checked');
    if (grade) {
        fullText += `Alt i alt en gjennomføring som kvalifiserer til karakter: ${grade.value}`;
    } else {
        fullText += "Lykke til videre med arbeidet!";
    }

    document.getElementById('resultOutput').value = fullText;
}

// REDIGERING OG RESET
function toggleEditMode() {
    const panel = document.getElementById('editPanel');
    panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function addItem() {
    const catName = document.getElementById('newCatName').value.trim();
    const label = document.getElementById('newLabel').value.trim();
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
    alert("Lagt til!");
}

function resetToDefault() {
    if(confirm("Er du sikker? Sletter alle endringer.")) {
        localStorage.removeItem('pres_data_v4');
        loadData();
        renderForm();
    }
}

function resetForm() {
    document.getElementById('studentName').value = "";
    document.getElementById('topic').value = "";
    document.getElementById('questionTopic').value = ""; // Tøm spørsmål
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('resultOutput').value = "";
}

function copyText() {
    const el = document.getElementById("resultOutput");
    el.select();
    navigator.clipboard.writeText(el.value);
}
