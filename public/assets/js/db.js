let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (ev) {
  const db = ev.target.result;
  db.createObjectStore("budgetStore", { autoIncrement: true });
};

request.onsuccess = function (ev) {
  db = ev.target.result;
  if (navigator.onLine) {
    console.log("Backend is online!");
    checkDatabase();
  }
};

request.onerror = function (ev) {
  console.log("Uh-Oh!" + ev.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const store = transaction.objectStore("budgetStore");
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const store = transaction.objectStore("budgetStore");
  const getAll = store.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["budgetStore"], "readwrite");
          const store = transaction.objectStore("budgetStore");
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
