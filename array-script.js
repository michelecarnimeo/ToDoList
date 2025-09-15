// ========================================
// TO DO LIST MUSEI BOLOGNA - SCRIPT CON ARRAY
// ========================================
// Questo script gestisce la To Do List dei musei di Bologna
// utilizzando un array per memorizzare i task
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

// Array principale per memorizzare tutti i task (musei)
let tasks = [];

/**
 * Dati iniziali - Musei di Bologna
 * Array di oggetti contenente i musei predefiniti con le loro informazioni
 */
const initialMuseums = [
    {
        name: "Museo Civico Archeologico",        // Museo archeologico principale
        date: "2024-02-15",                       // Data di visita programmata
        completed: false                          // Stato: da visitare
    },
    {
        name: "Pinacoteca Nazionale di Bologna",  // Galleria d'arte nazionale
        date: "2024-02-20",
        completed: true                           // Stato: già visitato
    },
    {
        name: "Museo della Storia di Bologna",    // Museo storico della città
        date: "2024-03-01",
        completed: false
    },
    {
        name: "MAMbo - Museo d'Arte Moderna di Bologna", // Museo d'arte contemporanea
        date: "2024-03-10",
        completed: false
    },
    {
        name: "Museo Internazionale della Musica", // Museo dedicato alla musica
        date: "2024-03-15",
        completed: true
    },
    {
        name: "Museo Civico Medievale",           // Museo del periodo medievale
        date: "2024-03-20",
        completed: false
    },
    {
        name: "Museo di Palazzo Poggi",           // Museo universitario
        date: "2024-04-01",
        completed: false
    },
    {
        name: "Museo della Tappezzeria",          // Museo specializzato in tessuti
        date: "2024-04-05",
        completed: false
    }
];

/**
 * Funzione di inizializzazione dell'applicazione
 * Carica i dati iniziali, configura l'interfaccia e avvia l'app
 */
function init() {
    // Converte i dati iniziali in oggetti Task e li carica nell'array
    tasks = initialMuseums.map((museum, index) =>
        new Task(index + 1, museum.name, museum.date, museum.completed)
    );

    // Aggiorna il contatore per il prossimo ID disponibile
    updateNextId();

    // Renderizza la lista dei musei nell'interfaccia
    render();

    // Aggiorna le statistiche (totale, visitati, da visitare)
    updateStats();

    // Aggiorna l'indicatore del tipo di script attivo
    document.getElementById('scriptType').textContent = 'Array';
}

/**
 * Funzione per aggiornare il prossimo ID disponibile
 * Calcola l'ID successivo basandosi sull'ID massimo esistente
 */
function updateNextId() {
    if (tasks.length === 0) {
        // Se l'array è vuoto, inizia dall'ID 1
        window.nextId = 1;
    } else {
        // Trova l'ID massimo e aggiungi 1 per il prossimo ID
        window.nextId = Math.max(...tasks.map(task => task.id)) + 1;
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

    // Aggiunge il nuovo task all'array
    tasks.push(newTask);

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
    // Trova il task nell'array tramite ID
    const task = tasks.find(t => t.id === taskId);

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
        // Filtra l'array rimuovendo il task con l'ID specificato
        tasks = tasks.filter(t => t.id !== taskId);

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
    // Trova il task nell'array tramite ID
    const task = tasks.find(t => t.id === taskId);

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
 * Gestisce filtri, ricerca e ordinamento
 */
function render() {
    // Ottiene riferimenti agli elementi DOM
    const taskList = document.getElementById('taskList');
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;

    // Filtra i task in base ai criteri selezionati
    let filteredTasks = tasks.filter(task => {
        // Filtro per stato: tutti, da visitare, visitati
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' && !task.completed) ||
            (statusFilter === 'completed' && task.completed);

        // Filtro per ricerca nel nome del museo
        const matchesSearch = task.name.toLowerCase().includes(searchTerm);

        // Restituisce true solo se entrambi i filtri sono soddisfatti
        return matchesStatus && matchesSearch;
    });

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
 * Calcola e mostra il numero totale, visitati e da visitare
 */
function updateStats() {
    // Calcola le statistiche
    const totalCount = tasks.length;                                    // Totale musei
    const completedCount = tasks.filter(task => task.completed).length; // Musei visitati
    const pendingCount = totalCount - completedCount;                   // Musei da visitare

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
// OPERAZIONI BULK - Gestione multipla dei task
// ========================================

/**
 * Funzione per segnare tutti i musei come visitati
 * Operazione bulk che modifica lo stato di tutti i task
 */
function markAllAsCompleted() {
    // Controlla se ci sono musei nella lista
    if (tasks.length === 0) {
        alert('Non ci sono musei nella lista!');
        return;
    }

    // Chiede conferma all'utente
    if (confirm('Segnare tutti i musei come visitati?')) {
        // Modifica lo stato di tutti i task a completato
        tasks.forEach(task => {
            task.completed = true;
        });

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per rimuovere tutti i musei visitati
 * Operazione bulk che elimina i task completati
 */
function clearCompleted() {
    // Trova tutti i task completati
    const completedTasks = tasks.filter(task => task.completed);

    // Controlla se ci sono task completati da rimuovere
    if (completedTasks.length === 0) {
        alert('Non ci sono musei visitati da rimuovere!');
        return;
    }

    // Chiede conferma specificando il numero di task da rimuovere
    if (confirm(`Rimuovere ${completedTasks.length} museo/i visitato/i?`)) {
        // Filtra l'array mantenendo solo i task non completati
        tasks = tasks.filter(task => !task.completed);

        // Aggiorna l'interfaccia e le statistiche
        render();
        updateStats();
    }
}

/**
 * Funzione per cancellare tutti i musei dalla lista
 * Operazione bulk che svuota completamente l'array
 */
function clearAll() {
    // Controlla se la lista è già vuota
    if (tasks.length === 0) {
        alert('La lista è già vuota!');
        return;
    }

    // Chiede conferma con avviso che l'azione non può essere annullata
    if (confirm('Sei sicuro di voler cancellare tutti i musei? Questa azione non può essere annullata!')) {
        // Svuota l'array e resetta il contatore ID
        tasks = [];
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
