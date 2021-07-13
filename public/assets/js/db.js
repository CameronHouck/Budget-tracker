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
