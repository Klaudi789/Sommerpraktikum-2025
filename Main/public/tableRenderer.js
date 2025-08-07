export function renderFlexibleTable(datenListe, felder, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Kein Container mit der ID "${containerId}" gefunden.`);
    return;
  }

  if (!Array.isArray(datenListe) || datenListe.length === 0) {
    container.innerHTML = '<p>Keine Daten zum Anzeigen.</p>';
    return;
  }

  const table = document.createElement('table');
  table.classList.add('activity-table');

  // Tabellenkopf erstellen
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  felder.forEach(feld => {
    const th = document.createElement('th');
    const feldname = feld.charAt(0).toUpperCase() + feld.slice(1);
    th.textContent = feld === 'betrag' ? `${feldname} (EUR)` : feldname;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tabellenkörper erstellen
  const tbody = document.createElement('tbody');

  datenListe.forEach(eintrag => {
    const row = document.createElement('tr');

    felder.forEach(feld => {
      const td = document.createElement('td');

      if (feld === 'betrag') {
        const betrag = parseFloat(eintrag[feld]);
        const type = eintrag.type;
        const istIncome = type === 'income';
        const istExpense = type === 'expense';

        td.textContent = `${istIncome ? '+' : istExpense ? '-' : ''} ${betrag.toFixed(2)} (EUR)`;

        td.classList.add(istIncome ? 'plus' : istExpense ? 'minus' : '');
      } else {
        td.textContent = eintrag[feld] ?? '';
      }

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Tabelle im Container einfügen
  container.innerHTML = ''; // Leeren
  container.appendChild(table);
}
