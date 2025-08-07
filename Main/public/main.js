import { 
    loadData,
    trenneEinAusgaben,
    trenneEinmalMehrmals,
    sortiereAlphabetisch, 
    sortiereNeueste,
    sortiereAmount, 
    sortiereAelteste, 
    delEintragId,
    addEintrag } from './dataManager.js';

import { renderFlexibleTable } from './tableRenderer.js'

document.getElementById("anzeigenButton").addEventListener("click", async () => {
  const daten = await loadData();

  const idFilter = document.getElementById("filterID").value.trim().toLowerCase();
  const nameFilter = document.getElementById("filterName").value.trim().toLowerCase();
  const typeFilter = document.getElementById("filterType").value;
  const intervalFilter = document.getElementById("filterInterval").value;
  const kontoFilter = document.getElementById("filterAccount").value.trim().toLowerCase();
  const startDateFrom = document.getElementById("startDateFrom").value;
  const startDateTo = document.getElementById("startDateTo").value;
  const sortOption = document.getElementById("sortierung").value;

  let gefiltert = daten.filter(eintrag => {
    const passtID = !idFilter || (eintrag.ID && eintrag.ID.toLowerCase().includes(idFilter));
    const passtName = !nameFilter || (eintrag.name && eintrag.name.toLowerCase().includes(nameFilter));
    const passtTyp = (typeFilter === "all") || (eintrag.type === typeFilter);
    const passtIntervall = (intervalFilter === "all") || (eintrag.intervall === intervalFilter);
    const passtKonto = !kontoFilter || (eintrag.konto && eintrag.konto.toLowerCase().includes(kontoFilter));

    const startDatum = eintrag.startdatum ? new Date(eintrag.startdatum) : null;
    const vonDatum = startDateFrom ? new Date(startDateFrom) : null;
    const bisDatum = startDateTo ? new Date(startDateTo) : null;

    const passtStartDatum =
      (!vonDatum || (startDatum && startDatum >= vonDatum)) &&
      (!bisDatum || (startDatum && startDatum <= bisDatum));

    return passtID && passtName && passtTyp && passtIntervall && passtKonto && passtStartDatum;
  });

  // 🔽 Sortierung anwenden
  switch (sortOption) {
    case "nameAZ":
      gefiltert.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "betragAuf":
      gefiltert.sort((a, b) => (a.betrag ?? 0) - (b.betrag ?? 0));
      break;
    case "betragAb":
      gefiltert.sort((a, b) => (b.betrag ?? 0) - (a.betrag ?? 0));
      break;
    case "startAltJung":
      gefiltert.sort((a, b) => new Date(a.startdatum) - new Date(b.startdatum));
      break;
    case "startJungAlt":
      gefiltert.sort((a, b) => new Date(b.startdatum) - new Date(a.startdatum));
      break;
  }

  renderFlexibleTable(gefiltert, ["ID", "name", "betrag", "intervall", "startdatum", "enddatum", "konto"], "tabelle1");
});

document.getElementById("hinzufuegenButton").addEventListener("click", () => {
  window.location.href = "hinzufuegen.html";  // oder eine andere Zielseite
});

