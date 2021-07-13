let db;

const request = indexedDB.open("budget", 1);

request.onsuccess = function (e) {
  db = e.target.result;
  if (navigator.onLine) {
    console.log("Backend Online!");
    checkDatabase();
  }
};

function saveRecord(record) {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const store = transaction.objectStore("budgetStore");
  store.add(record);
}

function checkDatabase() {
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

request.onerror = function (e) {
  console.log("Whoops!" + e.target.errorCode);
};

window.addEventListener("online", checkDatabase);
