// FRASE-BANKEN
// Her kan du endre teksten som genereres.
// 'yes': Tekst hvis boksen er krysset av (Mestret).
// 'no':  Tekst hvis boksen IKKE er krysset av (Tips til forbedring).

const feedbackData = {
    // Struktur
    structure_intro: {
        yes: "Du hadde en veldig tydelig og god innledning som fanget interessen min med en gang.",
        no: "Til neste gang bør du jobbe med å få en tydeligere innledning, slik at vi med en gang forstår hva du skal snakke om."
    },
    structure_thread: {
        yes: "Det var lett å følge presentasjonen din; den hadde en god rød tråd og logisk oppbygning.",
        no: "Strukturen var litt hoppende til tider. Prøv å lage en disposisjon på forhånd for å sikre en mer logisk rekkefølge."
    },
    structure_conclusion: {
        yes: "Du rundet av med en god oppsummering som samlet trådene fint.",
        no: "Presentasjonen sluttet litt brått. Husk alltid å ha en kort oppsummering eller konklusjon til slutt."
    },

    // Innhold
    content_depth: {
        yes: "Du viser god faglig forståelse og forklarer stoffet med egne ord i stedet for å bare lese opp fakta.",
        no: "Innholdet ble litt preget av opplisting. Prøv å gå mer i dybden og forklar 'hvorfor' og 'hvordan' i stedet for bare 'hva'."
    },
    content_relevance: {
        yes: "Du var flink til å holde deg til temaet og svare på problemstillingen.",
        no: "Noen ganger sporet du litt av. Vær nøye med at alt du sier er relevant for selve temaet ditt."
    },
    content_sources: {
        yes: "Veldig bra at du refererte til kilder underveis og hadde en kildeliste.",
        no: "Husk at kildebruk er viktig. Du må alltid oppgi hvor du har hentet informasjonen fra."
    },

    // Framføring
    delivery_voice: {
        yes: "Du snakker med tydelig stemme og i et behagelig tempo.",
        no: "Prøv å snakke litt høyere og saktere neste gang, så blir det enda lettere å få med seg alt du sier."
    },
    delivery_contact: {
        yes: "Du hadde super blikkontakt med oss i publikum og virket trygg på stoffet.",
        no: "Du ble stående og lese mye fra manuset. Prøv å øve mer på forhånd slik at du kan se mer på publikum."
    },
    delivery_aids: {
        yes: "Lysarkene dine var oversiktlige med lite tekst og gode bilder, noe som støttet presentasjonen godt.",
        no: "PowerPointen hadde litt mye tekst. Husk at den bare skal være stikkord til publikum, ikke manuset ditt."
    }
};

function generateComment() {
    // Hent input
    const name = document.getElementById('studentName').value.trim() || "Eleven";
    const topic = document.getElementById('topic').value.trim() || "emnet";
    
    let comment = `Hei ${name}!\n\n`;
    comment += `Takk for presentasjonen din om ${topic}. Her er min tilbakemelding:\n\n`;

    // Funksjon for å bygge avsnitt
    // Vi går gjennom ID-ene i HTML-en vår
    
    // Del 1: Struktur
    comment += "**Struktur:**\n";
    comment += checkItem('structure_intro');
    comment += checkItem('structure_thread');
    comment += checkItem('structure_conclusion');
    comment += "\n\n";

    // Del 2: Innhold
    comment += "**Faglig innhold:**\n";
    comment += checkItem('content_depth');
    comment += checkItem('content_relevance');
    comment += checkItem('content_sources');
    comment += "\n\n";

    // Del 3: Framføring
    comment += "**Framføring:**\n";
    comment += checkItem('delivery_voice');
    comment += checkItem('delivery_contact');
    comment += checkItem('delivery_aids');
    comment += "\n\n";

    comment += "Stå på videre!";

    // Legg teksten i tekstboksen
    document.getElementById('resultOutput').value = comment;
}

// Hjelpefunksjon som sjekker om boksen er krysset av eller ikke
function checkItem(id) {
    const checkbox = document.getElementById(id);
    if (!checkbox) return ""; // Sikkerhet hvis ID er feil

    const text = feedbackData[id];
    
    if (checkbox.checked) {
        return text.yes + " ";
    } else {
        return text.no + " ";
    }
}

// Funksjon for å kopiere tekst
function copyText() {
    const copyText = document.getElementById("resultOutput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobil */
    
    navigator.clipboard.writeText(copyText.value).then(() => {
        alert("Teksten er kopiert!");
    });
}

// Funksjon for å nullstille skjemaet
function resetForm() {
    document.getElementById('studentName').value = "";
    document.getElementById('topic').value = "";
    document.getElementById('resultOutput').value = "";
    
    // Fjern alle kryss
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => box.checked = false);
}
