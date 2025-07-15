const supportedLangs = ['en', 'de', 'es']

const userLang = (() => {
    const lang = navigator.language.split('-')[0].toLowerCase()
    if (supportedLangs.includes(lang)) return lang
    else return 'en'
})()

export const texts = {
    en: {
        resign: 'resign',
        draw: 'draw',
        acceptDraw: 'accept draw',
        rejectDraw: 'reject draw',
        undo: 'undo',
        acceptUndo: 'accept undo',
        rejectUndo: 'reject undo',
        undoCount: 'undo',
        gameResult: {
            'white wins': 'white wins',
            'black wins': 'black wins',
            'white resigns': 'white resigns',
            'black resigns': 'black resigns',
            'draw by agreement': 'draw by agreement',
            'draw by stalemate': 'draw by stalemate',
            'draw by threefold repetition': 'draw by threefold repetition',
            'draw by insufficient material': 'draw by insufficient material',
            'draw by 50 moves': 'draw by 50 moves',
        },
        newGame: 'new game',
        waitingForOpponent: 'Waiting for the opponent to join',
    },
    de: {
        resign: 'aufgeben',
        draw: 'Remis',
        acceptDraw: 'Remis annehmen',
        rejectDraw: 'Remis ablehnen',
        undo: 'Zug zurück',
        acceptUndo: 'Zugrücknahme akzeptieren',
        rejectUndo: 'Zugrücknahme ablehnen',
        undoCount: 'Zugrücknahme',
        gameResult: {
            'white wins': 'Weiß hat gewonnen',
            'black wins': 'Schwarz hat gewonnen',
            'white resigns': 'Weiß hat aufgegeben',
            'black resigns': 'Schwarz hat aufgegeben',
            'draw by agreement': 'Remis durch Übereinkunft',
            'draw by stalemate': 'Remis durch Patt',
            'draw by threefold repetition': 'Remis durch dreifache Stellungswiederholung',
            'draw by insufficient material': 'Remis wegen unzureichenden Materials',
            'draw by 50 moves': 'Remis gemäß der 50-Züge-Regel',
        },
        newGame: 'Neues Spiel',
        waitingForOpponent: 'Warten auf Beitritt des Gegners',
    },
    es: {
        resign: 'abandonar',
        draw: 'tablas',
        acceptDraw: 'aceptar tablas',
        rejectDraw: 'rechazar tablas',
        undo: 'deshacer jugada',
        acceptUndo: 'aceptar deshacer',
        rejectUndo: 'rechazar deshacer',
        undoCount: 'deshacer',
        gameResult: {
            'white wins': 'victoria para las blancas',
            'black wins': 'victoria para las negras',
            'white resigns': 'las blancas han abandonado',
            'black resigns': 'las negras han abandonado',
            'draw by agreement': 'tablas por acuerdo mutuo',
            'draw by stalemate': 'tablas por rey ahogado',
            'draw by threefold repetition': 'tablas por triple repetición',
            'draw by insufficient material': 'tablas por material insuficiente',
            'draw by 50 moves': 'tablas según la regla de las 50 jugadas',
        },
        newGame: 'nueva partida',
        waitingForOpponent: 'Esperando a que el oponente se una',
    },
}[userLang]!
