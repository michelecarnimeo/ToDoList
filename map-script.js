// ========================================
// TO DO LIST MUSEI BOLOGNA - SCRIPT CON MAP
// ========================================
// Questo script gestisce la To Do List dei musei di Bologna
// utilizzando una Map per memorizzare i task
// Autore: Michele Carnimeo
// Data: 2025

/**
 * Classe Task per rappresentare un museo nella lista
 * @param {number} id - Identificatore univoco del task
 * @param {string} name - Nome del museo
 * @param {string} date - Data della visita (formato YYYY-MM-DD)
 * @param {boolean} completed - Stato di completamento (visitato/non visitato)
 */
class Task {
    constructor(id, name, date, completed = false) {
        this.id = id;                                    // ID univoco del museo
        this.name = name;                                // Nome del museo
        this.date = date;                                // Data programmata per la visita
        this.completed = completed;                      // Stato: true = visitato, false = da visitare
        this.createdAt = new Date().toISOString();      // Timestamp di creazione
    }
}

// Map principale per memorizzare tutti i task (chiave: id, valore: Task)
// Utilizza Map invece di Array per una gestione più efficiente tramite ID
let tasksMap = new Map();

/**
 * Dati iniziali - Musei di Bologna
 * Array di oggetti contenente i musei predefiniti con le loro informazioni
 */
const initialMuseums = [
    {
        name: "Museo Civico Archeologico",        // Museo archeologico principale
        date: "2025-02-15",                       // Data di visita programmata
        completed: false                          // Stato: da visitare
    },
    {
        name: "Pinacoteca Nazionale di Bologna",  // Galleria d'arte nazionale
        date: "2025-02-20",
        completed: true                           // Stato: già visitato
    },
    {
        name: "Museo della Storia di Bologna",    // Museo storico della città
        date: "2025-03-01",
        completed: false
    },
    {
        name: "MAMbo - Museo d'Arte Moderna di Bologna", // Museo d'arte contemporanea
        date: "2025-03-10",
        completed: false
    },
    {
        name: "Museo Internazionale della Musica", // Museo dedicato alla musica
        date: "2025-03-15",
        completed: true
    },
    {
        name: "Museo Civico Medievale",           // Museo del periodo medievale
        date: "2025-03-20",
        completed: false
    },
    {
        name: "Museo di Palazzo Poggi",           // Museo universitario
        date: "2025-04-01",
        completed: false
    },
    {
        name: "Museo della Tappezzeria",          // Museo specializzato in tessuti
        date: "2025-04-05",
        completed: false
    }
];

/**
 * Funzione di inizializzazione dell'applicazione
 * Carica i dati iniziali nella Map, configura l'interfaccia e avvia l'app
 */
function init() {
    // Converte i dati iniziali in oggetti Task e li carica nella Map
    initialMuseums.forEach((museum, index) => {
        const task = new Task(index + 1, museum.name, museum.date, museum.completed);
        tasksMap.set(task.id, task);  // Usa set() per aggiungere alla Map
    });

    // Aggiorna il contatore per il prossimo ID disponibile
    updateNextId();

    // Renderizza la lista dei musei nell'interfaccia
    render();

    // Aggiorna le statistiche (totale, visitati, da visitare)
    updateStats();
}

/**
 * Funzione per aggiornare il prossimo ID disponibile
 * Calcola l'ID successivo basandosi sull'ID massimo esistente nella Map
 */
function updateNextId() {
    if (tasksMap.size === 0) {
        // Se la Map è vuota, inizia dall'ID 1
        window.nextId = 1;
    } else {
        // Trova l'ID massimo tra tutte le chiavi della Map usando for...of
        let maxId = 0;
        for (const id of tasksMap.keys()) {
            if (id > maxId) maxId = id;
        }
        window.nextId = maxId + 1;
    }
}

/**
 * Funzione per aggiungere un nuovo museo alla lista
 * @param {string} name - Nome del museo
 * @param {string} date - Data della visita (formato YYYY-MM-DD)
 */
function addTask(name, date) {
    // Validazione: controlla che il nome non sia vuoto
    if (!name.trim()) {
        alert('Inserisci il nome del museo!');
        return;
    }

    // Validazione: controlla che sia stata selezionata una data
    if (!date) {
        alert('Seleziona una data!');
        return;
    }

    // Crea un nuovo oggetto Task con i dati forniti
    const newTask = new Task(window.nextId, name.trim(), date, false);

    // Aggiunge il nuovo task alla Map usando set()
    tasksMap.set(newTask.id, newTask);

    // Incrementa l'ID per il prossimo task
    window.nextId++;

    // Aggiorna l'interfaccia e le statistiche
    render();
    updateStats();

    // Pulisce i campi di input per permettere l'inserimento di un nuovo museo
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

/**
 * Funzione per cambiare lo stato di completamento di un museo
 * @param {number} taskId - ID del task da modificare
 */
function toggleDone(taskId) {
    // Trova il task nella Map tramite ID usando get()
    const task = tasksMap.get(taskId);

    if (task) {
        // Inverte lo stato di completamento (visitato ↔ da visitare)
        task.completed = !task.completed;

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per rimuovere un museo dalla lista
 * @param {number} taskId - ID del task da rimuovere
 */
function removeTask(taskId) {
    // Chiede conferma all'utente prima di eliminare
    if (confirm('Sei sicuro di voler eliminare questo museo dalla lista?')) {
        // Rimuove il task dalla Map usando delete()
        tasksMap.delete(taskId);

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per modificare un museo esistente
 * @param {number} taskId - ID del task da modificare
 */
function editTask(taskId) {
    // Trova il task nella Map tramite ID usando get()
    const task = tasksMap.get(taskId);

    // Se il task non esiste, esce dalla funzione
    if (!task) return;

    // Chiede all'utente di modificare il nome del museo
    const newName = prompt('Modifica il nome del museo:', task.name);
    if (newName && newName.trim() && newName.trim() !== task.name) {
        // Aggiorna il nome se è diverso da quello esistente
        task.name = newName.trim();
        render();
    }

    // Chiede all'utente di modificare la data
    const newDate = prompt('Modifica la data (YYYY-MM-DD):', task.date);
    if (newDate && newDate !== task.date) {
        // Validazione del formato data (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(newDate)) {
            // Aggiorna la data se il formato è valido
            task.date = newDate;
            render();
        } else {
            alert('Formato data non valido! Usa YYYY-MM-DD');
        }
    }
}

/**
 * Funzione principale per renderizzare la lista dei musei
 * Gestisce filtri, ricerca e ordinamento utilizzando Map.values()
 */
function render() {
    // Ottiene riferimenti agli elementi DOM
    const taskList = document.getElementById('taskList');
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;

    // Filtra i task usando for...of su Map.values() (non for index su array)
    let filteredTasks = [];
    for (const task of tasksMap.values()) {
        // Filtro per stato: tutti, da visitare, visitati
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' && !task.completed) ||
            (statusFilter === 'completed' && task.completed);

        // Filtro per ricerca nel nome del museo
        const matchesSearch = task.name.toLowerCase().includes(searchTerm);

        // Restituisce true solo se entrambi i filtri sono soddisfatti
        if (matchesStatus && matchesSearch) {
            filteredTasks.push(task);
        }
    }

    // Ordina i task in base al criterio selezionato
    filteredTasks.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                // Ordinamento alfabetico per nome
                return a.name.localeCompare(b.name);
            case 'date':
                // Ordinamento cronologico per data
                return new Date(a.date) - new Date(b.date);
            case 'status':
                // Ordinamento per stato (da visitare prima, poi visitati)
                return a.completed - b.completed;
            default:
                return 0;
        }
    });

    // Renderizza i task nell'interfaccia
    if (filteredTasks.length === 0) {
        // Se non ci sono task che corrispondono ai filtri, mostra un messaggio
        taskList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>Nessun museo trovato con i filtri selezionati.</p>
            </div>
        `;
        return;
    }

    // Genera l'HTML per ogni task filtrato
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleDone(${task.id})">
            <div class="task-content">
                <div class="task-name">${task.name}</div>
                <div class="task-date">📅 ${formatDate(task.date)}</div>
                <div class="task-status ${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? 'Visitato' : 'Da visitare'}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Modifica</button>
                <button class="delete-btn" onclick="removeTask(${task.id})">Elimina</button>
            </div>
        </div>
    `).join('');
}

/**
 * Funzione per aggiornare le statistiche nella dashboard
 * Calcola e mostra il numero totale, visitati e da visitare usando Map.values()
 */
function updateStats() {
    let totalCount = 0;
    let completedCount = 0;

    // Conta usando for...of su Map.values() (non for index su array)
    for (const task of tasksMap.values()) {
        totalCount++;
        if (task.completed) {
            completedCount++;
        }
    }

    const pendingCount = totalCount - completedCount;

    // Aggiorna gli elementi DOM con i nuovi valori
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('pendingCount').textContent = pendingCount;
}

/**
 * Funzione per formattare la data in formato italiano leggibile
 * @param {string} dateString - Data in formato YYYY-MM-DD
 * @returns {string} Data formattata in italiano
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',    // Nome del giorno della settimana
        year: 'numeric',    // Anno a 4 cifre
        month: 'long',      // Nome del mese
        day: 'numeric'      // Giorno del mese
    });
}

// ========================================
// OPERAZIONI BULK - Gestione multipla dei task con Map
// ========================================

/**
 * Funzione per segnare tutti i musei come visitati
 * Operazione bulk che modifica lo stato di tutti i task usando Map.values()
 */
function markAllAsCompleted() {
    // Controlla se ci sono musei nella lista
    if (tasksMap.size === 0) {
        alert('Non ci sono musei nella lista!');
        return;
    }

    // Chiede conferma all'utente
    if (confirm('Segnare tutti i musei come visitati?')) {
        // Usa for...of su Map.values() per aggiornare tutti i task
        for (const task of tasksMap.values()) {
            task.completed = true;
        }

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per rimuovere tutti i musei visitati
 * Operazione bulk che elimina i task completati usando Map.entries()
 */
function clearCompleted() {
    // Trova i task completati usando for...of su Map.values()
    let completedCount = 0;
    for (const task of tasksMap.values()) {
        if (task.completed) completedCount++;
    }

    // Controlla se ci sono task completati da rimuovere
    if (completedCount === 0) {
        alert('Non ci sono musei visitati da rimuovere!');
        return;
    }

    // Chiede conferma specificando il numero di task da rimuovere
    if (confirm(`Rimuovere ${completedCount} museo/i visitato/i?`)) {
        // Rimuovi i task completati dalla Map usando entries() e delete()
        for (const [id, task] of tasksMap.entries()) {
            if (task.completed) {
                tasksMap.delete(id);
            }
        }

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per cancellare tutti i musei dalla lista
 * Operazione bulk che svuota completamente la Map
 */
function clearAll() {
    // Controlla se la lista è già vuota
    if (tasksMap.size === 0) {
        alert('La lista è già vuota!');
        return;
    }

    // Chiede conferma con avviso che l'azione non può essere annullata
    if (confirm('Sei sicuro di voler cancellare tutti i musei? Questa azione non può essere annullata!')) {
        // Svuota la Map e resetta il contatore ID
        tasksMap.clear();
        window.nextId = 1;

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

// ========================================
// EVENT LISTENERS - Gestione eventi dell'interfaccia
// ========================================

/**
 * Event listener principale che si attiva quando il DOM è completamente caricato
 * Configura tutti gli event listener e inizializza l'applicazione
 */
document.addEventListener('DOMContentLoaded', function () {
    // Inizializza l'applicazione
    init();

    // Event listener per il pulsante "Aggiungi"
    document.getElementById('addBtn').addEventListener('click', function () {
        const name = document.getElementById('taskInput').value;
        const date = document.getElementById('dateInput').value;
        addTask(name, date);
    });

    // Event listener per il tasto Enter nel campo nome
    // Permette di aggiungere un museo premendo Enter
    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const name = document.getElementById('taskInput').value;
            const date = document.getElementById('dateInput').value;
            addTask(name, date);
        }
    });

    // Event listeners per i filtri e l'ordinamento
    // Si attivano automaticamente quando cambiano i valori
    document.getElementById('statusFilter').addEventListener('change', render);
    document.getElementById('searchInput').addEventListener('input', render);
    document.getElementById('sortBy').addEventListener('change', render);

    // Event listeners per le operazioni bulk
    document.getElementById('markAllBtn').addEventListener('click', markAllAsCompleted);
    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    // Imposta la data di oggi come valore predefinito nel campo data
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').value = today;
});

// ========================================
// FUNZIONI GLOBALI - Esposizione per i pulsanti inline
// ========================================

/**
 * Espone le funzioni principali come proprietà globali del window object
 * Necessario per permettere l'uso di onclick negli elementi HTML generati dinamicamente
 */
window.toggleDone = toggleDone;    // Funzione per cambiare stato di completamento
window.removeTask = removeTask;    // Funzione per rimuovere un museo
window.editTask = editTask;        // Funzione per modificare un museo
