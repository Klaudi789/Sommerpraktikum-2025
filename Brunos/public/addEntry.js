import { addEintrag } from "./dataManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("eintragForm");
  const recurrence = document.getElementById("recurrence");
  const endDate = document.getElementById("end_date");
  const unbegrenzt = document.getElementById("unbegrenzt");
  const meldung = document.getElementById("meldung");
  // Intervall-Änderung
  recurrence.addEventListener("change", () => {
    const isOnce = recurrence.value === "einmalig";
    endDate.disabled = isOnce || unbegrenzt.checked;
    if (isOnce) endDate.value = "";
  });

  // Unbegrenzt-Checkbox
  unbegrenzt.addEventListener("change", () => {
    endDate.disabled = recurrence.value === "einmalig" || unbegrenzt.checked;
    if (unbegrenzt.checked) endDate.value = "laufend";
    else if (recurrence.value !== "einmalig") endDate.value = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const neuerEintrag = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      intervall: recurrence.value,
      startdatum: document.getElementById("start_date").value,
      enddatum: unbegrenzt.checked ? "laufend" : endDate.value || null,
      betrag: parseFloat(document.getElementById("amount").value),
      description: document.getElementById("description").value || "",
      editable: true,
      konto: "konto1", // Hier kannst du das Konto anpassen, falls nötig
    };

    try {
      await addEintrag(neuerEintrag);
      window.location.href = "verwaltung.html";
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      meldung.textContent = "Eintrag konnte nicht gespeichert werden.";
      console.log(err);
    }
  });
});

document.getElementById("abbrechenButton").addEventListener("click", () => {
  window.location.href = "verwaltung.html";  // oder eine andere Zielseite
});

