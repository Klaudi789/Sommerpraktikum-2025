// linechart.js
// Diese Funktion lädt die Daten aus einer JSON-Datei und erzeugt das Chart.
async function erstelleLineChartAusDatei(canvasId, datenPfad) {
  const response = await fetch(datenPfad);
  if (!response.ok) {
    console.error("Fehler beim Laden der Datei:", datenPfad);
    return;
  }
  const inputDaten = await response.json();

  const monate = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const einkommenDaten = new Array(12).fill(0);
  const ausgabenDaten = new Array(12).fill(0);

  inputDaten.forEach(eintrag => {
    const startMonat = new Date(eintrag.start_datum).getMonth();

    // Endmonat bestimmen: "laufend" = bis Dezember, sonst tatsächlicher Endmonat
    let endMonat;
    if (
      typeof eintrag.enddatum === "string" &&
      (eintrag.enddatum.toLowerCase() === "laufend" || eintrag.enddatum === "")
    ) {
      endMonat = 11;
    } else if (eintrag.enddatum) {
      endMonat = new Date(eintrag.enddatum).getMonth();
    } else {
      endMonat = startMonat;
    }

    if (eintrag.intervall === "monatlich") {
      for (let i = startMonat; i <= endMonat; i++) {
        if (eintrag.type === "income") {
          einkommenDaten[i] += eintrag.betrag;
        } else if (eintrag.type === "expense") {
          ausgabenDaten[i] += eintrag.betrag;
        }
      }
    } else if (eintrag.intervall === "jährlich") {
      if (eintrag.type === "income") {
        einkommenDaten[startMonat] += eintrag.betrag;
      }
    } else if (eintrag.intervall === "einmalig") {
      if (eintrag.type === "income") {
        einkommenDaten[startMonat] += eintrag.betrag;
      } else if (eintrag.type === "expense") {
        ausgabenDaten[startMonat] += eintrag.betrag;
      }
    }
  });

  const data = {
    labels: monate,
    datasets: [
      {
        label: "Einkommen",
        data: einkommenDaten,
        borderColor: "#5899DA",
        backgroundColor: "rgba(88, 153, 218, 0.1)",
        fill: false,
        borderWidth: 1,
        pointRadius: 1
      },
      {
        label: "Ausgaben",
        data: ausgabenDaten,
        borderColor: "#E8743B",
        backgroundColor: "rgba(232, 116, 59, 0.1)",
        fill: false,
        borderWidth: 1,
        pointRadius: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Monate' },
        grid: { display: false }
      },
      y: {
        grid: { drawTicks: false, drawBorder: false, color: "#CCCCCC", lineWidth: 0.5 },
        ticks: { stepSize: 500 },
        title: { display: true, text: 'Beträge (€)' }
      }
    }
  };

  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, { type: 'line', data: data, options: options });
}