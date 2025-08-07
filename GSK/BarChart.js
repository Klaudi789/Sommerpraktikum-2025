// Diese Funktion lädt die Daten aus einer JSON-Datei und erstellt ein gestapeltes Balkendiagramm.
async function erstelleBarchartAusDatei(canvasId, datenPfad) {
  try {
    const response = await fetch(datenPfad);
    if (!response.ok) {
      console.error("Fehler beim Laden der Datei:", datenPfad);
      return;
    }

    const inputDaten = await response.json();

    const monate = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    const gewinnDaten = new Array(12).fill(0);
    const kostenDaten = new Array(12).fill(0);

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

      // Werte basierend auf dem Intervall hinzufügen
      if (eintrag.intervall === "monatlich") {
        for (let i = startMonat; i <= endMonat; i++) {
          if (eintrag.type === "income") {
            gewinnDaten[i] += eintrag.betrag;
          } else if (eintrag.type === "expense") {
            kostenDaten[i] += eintrag.betrag;
          }
        }
      } else if (eintrag.intervall === "einmalig") {
        if (eintrag.type === "income") {
          gewinnDaten[startMonat] += eintrag.betrag;
        } else if (eintrag.type === "expense") {
          kostenDaten[startMonat] += eintrag.betrag;
        }
      }
    });

    const data = {
      labels: monate,
      datasets: [
        {
          label: "Gewinn",
          data: gewinnDaten,
          backgroundColor: "#5899DA", // Blau für Gewinn
        },
        {
          label: "Kosten",
          data: kostenDaten,
          backgroundColor: "#E8743B", // Orange für Kosten
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
          devicePixelRatio: 1.5,

      plugins: {
        legend: {
          position: "top", // Legende unten
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.raw.toLocaleString("de-DE") + " €";
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Monate",
          },
          grid: {
            drawOnChartArea: false,
          },
          categoryPercentage: 0.7,
          barPercentage: 0.9,
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Beträge (€)",
          },
          ticks: {
            callback: function (value) {
              return value.toLocaleString("de-DE") + " €";
            },
          },
          grid: {
            drawBorder: false,
            color: "#e0e0e0",
          },
        }
      }
    };

    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des Diagramms:", error);
  }
}
