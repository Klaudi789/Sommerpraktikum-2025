import { generateUUID } from "./utils.js"; // Importiere die UUID-Funktion

export async function loadData(url = '/api/data') {
  const res = await fetch(url); // Diese Funktion lädt Daten von einer angegebenen URL
  if (!res.ok) throw new Error('Fehler beim Laden der Daten');
  return await res.json();
}

export async function saveData(data) {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Fehler beim Speichern der Daten');
  return await res.json();
}

export async function addEintrag(neuerEintrag, data = null) { // Diese Funktion fügt einen neuen Eintrag hinzu
  if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }

  // Falls keine ID vorhanden ist, automatisch generieren
  if (!neuerEintrag.ID) {
    neuerEintrag.ID = generateUUID();
  }

  data.push(neuerEintrag);
  await saveData(data); // Speichern der aktualisierten Daten
  return data;
}

export async function delEintragId(ID, data = null) { // Diese Funktion entfernt einen Eintrag anhand seiner ID
  if (!data) { 
    data = await loadData(); // <-- richtige Initialisierung
  }
  const new_data = data.filter(eintrag => eintrag.ID !== ID);
  await saveData(new_data); // Speichern der aktualisierten Daten
  return new_data;
}


export async function trenneEinAusgaben(data = null) { // Diese Funktion trennt Einnahmen und Ausgaben
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  const einnahmen = data.filter(eintrag => eintrag.type === 'income');
  const ausgaben = data.filter(eintrag => eintrag.type === 'expense');
  return { einnahmen, ausgaben };
}

export async function trenneEinmalMehrmals(data = null) { // Diese Funktion trennt einmalige und mehrmalige Einträge
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  const einmalig = [];
  const merhmals = [];

  for (const eintrag of data) {
    if (eintrag.intervall === 'einmalig') {
      einmalig.push(eintrag);
    } else {
      merhmals.push(eintrag);
    }
  }

  return { einmalig, merhmals };
}

// Alphabetisch nach name sortieren
export async function sortiereAlphabetisch( data = null) { // Diese Funktion sortiert die Daten alphabetisch nach dem Namen
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
}

// Nach amount absteigend sortieren (größter Betrag zuerst)
export async function sortiereAmount(data = null) { // Diese Funktion sortiert die Daten nach dem Betrag (amount) absteigend
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  return [...data].sort((a, b) => b.betrag - a.betrag);
}

// Nach neustem Datum sortieren (start_date), neueste zuerst
export async function sortiereNeueste(data = null) { // Diese Funktion sortiert die Daten nach dem Startdatum (start_date) absteigend
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  return [...data].sort((a, b) => new Date(b.startdatum) - new Date(a.startdatum));
}

// Nach ältestem Datum sortieren (start_date), älteste zuerst
export async function sortiereAelteste(data = null) { // Diese Funktion sortiert die Daten nach dem Startdatum (start_date) aufsteigend
    if (!data) {
    data = await loadData(); // <-- richtige Initialisierung
  }
  return [...data].sort((a, b) => new Date(a.startdatum) - new Date(b.startdatum));
}