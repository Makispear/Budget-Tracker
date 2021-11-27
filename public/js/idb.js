let db;

const request = indexedDB.open('budget', 1)

request.onupgradeneeded = event => {
    const db = event.target.result
    console.log(db)
    db.createObjectStore('new_transaction', { autoIncrement: true })
}

request.onsuccess = event => {
    db = event.target.result 

    if (navigator.onLine) {
        uploadTransaction()
    }
}

request.onerror = event => {
    console.log(event.target.errorCode)
}

saveRecord = record => {
    const transaction = db.transaction(['new_transaction'], 'readwrite')

    const budgetObjectStore = transaction.objectStore('new_transaction')

    budgetObjectStore.add(record)
}

uploadTransaction = () => {
    const transaction = db.transaction(['new_transaction'], 'readwrite')

    const budgetObjectStore = transaction.objectStore('new_transaction')

    const getAll = budgetObjectStore.getAll()

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }

                const transaction = db.transaction(['new_transaction'], 'readwrite')

                const budgetObjectStore = transaction.objectStore('new_transaction')

                budgetObjectStore.clear()

                alert('All offline transactions have been saved!')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

window.addEventListener('online', uploadTransaction)