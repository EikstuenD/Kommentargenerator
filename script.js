// STANDARD DATA 
// format: low (må jobbes med), med (greit/godkjent), high (meget bra)
const defaultData = [
    {
        category: "Struktur",
        items: [
            { 
                label: "Innledning", 
                low: "Innledningen var noe uklar og manglet en tydelig presentasjon av temaet.", 
                med: "Innledningen var grei og presenterte temaet.", 
                high: "Du hadde en engasjerende innledning som tydelig presenterte problemstillingen." 
            },
            { 
                label: "Rød tråd", 
                low: "Strukturen fremstod noe rotete, og det var vanskelig å følge resonnementene.", 
                med: "Presentasjonen hadde en grei struktur som var mulig å følge.", 
                high: "Presentasjonen hadde en meget god struktur og logisk oppbygning." 
            }
        ]
    },
    {
        category: "Innhold",
        items: [
            { 
                label: "Faglig forståelse", 
                low: "Innholdet bar preg av opplesning og manglet dybde.", 
                med: "Du viser faglig forståelse, men kunne forklart mer med egne ord.", 
                high: "Du viser svært god faglig forståelse og forklarer komplekse sammenhenger godt." 
            },
            { 
                label: "Kildebruk", 
                low: "Kildehenvisninger manglet eller var mangelfulle.", 
                med: "Kildebruken var godkjent.", 
                high: "Du har svært god oversikt over kildene og bruker dem aktivt i presentasjonen." 
            }
        ]
    },
    {
        category: "Framføring",
        items: [
            { 
                label: "Blikkontakt", 
                low: "Du var svært bundet til manuset.", 
                med: "Du hadde noe blikkontakt, men leste en del fra manus.", 
                high: "Du var løsrevet fra manus og hadde god kontakt med publikum." 
            },
            { 
                label: "Stemmebruk", 
                low: "Det var vanskelig å høre hva du sa til tider.", 
                med: "Du snakker tydelig nok.", 
                high: "Du har en tydelig stemme og bruker tempo og pauser virkningsfullt." 
            }
        ]
    }
];

let formData = [];

window.onload = function() {
    loadData();
    renderForm();
};

function loadData() {
    const saved = localStorage.getItem('presFormData_v2'); // Ny nøkkel pga ny struktur
    if (saved) {
        formData = JSON.parse(saved);
    } else {
        formData = JSON.parse(JSON.stringify(defaultData));
    }
}

function saveData() {
    localStorage.setItem('presFormData_v2', JSON.stringify(formData));
    renderForm();
}

// TEGNE SKJEMA MED 3 VALG
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

            // Unikt navn for radiogruppen per punkt
            const groupName = `grp_${catIndex}_${itemIndex}`;

            const label = document.createElement('span');
            label.className = "item-label";
            label.innerText = item.label;

            const radioGroup = document.createElement('div');
            radioGroup.className = "radio-group";
            
            // Lag 3 radio buttons: Lav, Middels, Høy
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
    parts.push(`Hei ${name}. Vurdering av presentasjon om ${topic}.`);

    formData.forEach((cat, catIndex) => {
        cat.items.forEach((item, itemIndex) => {
            const groupName = `grp_${catIndex}_${itemIndex}`;
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            
            if (checked) {
                // Hent tekst basert på valgt nivå (low/med/high)
                const val = checked.value; 
                if (item[val]) {
                    parts.push(item[val]);
                }
            }
        });
    });

    const grade = document.querySelector('input[name="grade"]:checked');
    if (grade) {
        parts.push(`\nKarakter: ${grade.value}`);
    }

    document.getElementById('resultOutput').value = parts.join(" ");
}

// REDIGERING
function toggleEditMode() {
    document.getElementById('editPanel').classList.toggle('hidden');
}

function addItem() {
    const catName = document.getElementById('newCatName').value.trim();
    const label = document.getElementById('newLabel').value.trim();
    const low = document.getElementById('textLow').value.trim();
    const med = document.getElementById('textMed').value.trim();
    const high = document.getElementById('textHigh').value.trim();

    if (!catName || !label || !low || !med || !high) {
        alert("Alle felt må fylles ut.");
        return;
    }

    let category = formData.find(c => c.category.toLowerCase() === catName.toLowerCase());
    if (!category) {
        category = { category: catName, items: [] };
        formData.push(category);
    }

    category.items.push({ label, low, med, high });
    saveData();
    
    // Tøm feltene
    document.getElementById('newLabel').value = "";
    document.getElementById('textLow').value = "";
    document.getElementById('textMed').value = "";
    document.getElementById('textHigh').value = "";
    alert("Punkt lagt til.");
}

function resetToDefault() {
    if(confirm("Dette sletter dine endringer og laster standardsettet. Sikker?")) {
        localStorage.removeItem('presFormData_v2');
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
