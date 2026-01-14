// STANDARD DATA (Brukes hvis ingenting er lagret)
const defaultData = [
    {
        category: "Struktur",
        items: [
            { id: "str1", label: "Tydelig innledning", yes: "Du hadde en god innledning som vekket interesse.", no: "Innledningen kunne vært tydeligere definert." },
            { id: "str2", label: "Rød tråd", yes: "Presentasjonen hadde en logisk og god oppbygning.", no: "Strukturen var tidvis litt vanskelig å følge." },
            { id: "str3", label: "Avslutning", yes: "Du rundet av med en fin oppsummering.", no: "Husk å avslutte med en tydelig oppsummering." }
        ]
    },
    {
        category: "Innhold",
        items: [
            { id: "con1", label: "Faglig forståelse", yes: "Du viser god faglig forståelse.", no: "Prøv å forklare mer med egne ord for å vise forståelse." },
            { id: "con2", label: "Relevans", yes: "Du holdt deg godt til temaet.", no: "Pass på å holde deg strengt til oppgaveteksten." },
            { id: "con3", label: "Kildebruk", yes: "God bruk av kilder.", no: "Kildehenvisningene må komme tydeligere frem." }
        ]
    },
    {
        category: "Framføring",
        items: [
            { id: "del1", label: "Stemmebruk", yes: "Du snakker tydelig og i godt tempo.", no: "Prøv å snakke høyere og roligere." },
            { id: "del2", label: "Blikkontakt", yes: "God kontakt med publikum.", no: "Prøv å frigjøre deg mer fra manuset." }
        ]
    }
];

// DATA HÅNDTERING
let formData = [];

// Last inn data ved oppstart
window.onload = function() {
    loadData();
    renderForm();
};

function loadData() {
    const saved = localStorage.getItem('presentationFormData');
    if (saved) {
        formData = JSON.parse(saved);
    } else {
        formData = JSON.parse(JSON.stringify(defaultData)); // Kopi av default
    }
}

function saveData() {
    localStorage.setItem('presentationFormData', JSON.stringify(formData));
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
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" id="chk_${catIndex}_${itemIndex}"> ${item.label}`;
            catDiv.appendChild(label);
        });

        container.appendChild(catDiv);
    });
}

// GENERER TEKST
function generateComment() {
    const name = document.getElementById('studentName').value.trim() || "Eleven";
    const topic = document.getElementById('topic').value.trim() || "temaet";
    
    let textParts = [];
    
    // Start
    textParts.push(`Hei ${name}. Takk for presentasjonen om ${topic}.`);

    // Gå gjennom sjekkpunkter
    formData.forEach((cat, catIndex) => {
        cat.items.forEach((item, itemIndex) => {
            const checkbox = document.getElementById(`chk_${catIndex}_${itemIndex}`);
            if (checkbox && checkbox.checked) {
                textParts.push(item.yes);
            } else {
                textParts.push(item.no);
            }
        });
    });

    // Avslutning
    textParts.push("Alt i alt en grei gjennomføring.");

    // Karakter
    const grade = document.querySelector('input[name="grade"]:checked');
    if (grade) {
        textParts.push(`\nKarakter: ${grade.value}`);
    }

    // Sett sammen teksten (med mellomrom)
    document.getElementById('resultOutput').value = textParts.join(" ");
}

// REDIGERING
function toggleEditMode() {
    const panel = document.getElementById('editPanel');
    panel.classList.toggle('hidden');
}

function addItem() {
    const catName = document.getElementById('newCatName').value.trim();
    const label = document.getElementById('newLabel').value.trim();
    const yes = document.getElementById('newYes').value.trim();
    const no = document.getElementById('newNo').value.trim();

    if (!catName || !label || !yes || !no) {
        alert("Fyll ut alle felt.");
        return;
    }

    // Sjekk om kategori finnes
    let category = formData.find(c => c.category.toLowerCase() === catName.toLowerCase());
    
    if (!category) {
        category = { category: catName, items: [] };
        formData.push(category);
    }

    category.items.push({ id: Date.now(), label, yes, no });
    saveData();
    
    // Tøm feltene
    document.getElementById('newLabel').value = "";
    document.getElementById('newYes').value = "";
    document.getElementById('newNo').value = "";
    alert("Lagt til!");
}

function resetToDefault() {
    if(confirm("Dette sletter alle egne endringer. Er du sikker?")) {
        localStorage.removeItem('presentationFormData');
        loadData();
        renderForm();
    }
}

// UTILS
function resetForm() {
    document.getElementById('studentName').value = "";
    document.getElementById('topic').value = "";
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    document.querySelectorAll('input[name="grade"]').forEach(r => r.checked = false);
    document.getElementById('resultOutput').value = "";
}

function copyText() {
    const el = document.getElementById("resultOutput");
    el.select();
    navigator.clipboard.writeText(el.value);
}
