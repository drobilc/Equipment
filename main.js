// The environment is saved in the Environment object. It contains the checked
// items and user defined information that can then be used to display groups of
// items and calculate item quantities.

// The environment object is saved to the user's local storage and is
// reconstructed each time the user visits the page. When the object is saved,
// only its properties are saved. When data is reconstructed, a new empty object
// is created first, then the properties are added to it. This ensures that we
// can define functions on environment that we can the use.
function Environment() {

    this.group = "mc";
    this.hasLongHair = false;
    this.specialMedicalRequirements = false;
    this.boardGameFan = 0;
    this.likesBugs = false;
    this.searchingForLove = false;
    this.isSvit = false;
    this.isClean = false;
    this.isEarlyBird = false;
    this.isThief = false;

    this.numberOfDays = function() {
        if (this.group == 'mc')
            return 7;
        if (this.group == 'gg')
            return 10;
        return 16;
    };

    // Items that the user has checked. This is the only necessary propery of
    // the environment object.
    this.checked = [];
}

// List of items on the equipment list. Each item is an object with properties
// name, quantity and display. The name is a string, quantity is a function that
// accepts environment and returns an integer (or for that matter any string)
// and the display is a function that accepts environment and returns true if
// the item should be displayed and false if not.

// An example item is shown below. The quantity of this item depends on the
// number of days (we assume that users will need two towels a day) and the
// display function simply returns true, which simply means that the item will
// always be displayed.
// {
//     name: "Towel",
//     quantity: (environment) => 2 * environment.numberOfDays(),
//     display: (environment) => true
// }

// Instead of writing objects for each item, we define a buildItem(name,
// quantityFunction, displayFunction)) function that has 3 arguments. The name
// is a required parameter. The quantityFunction defaults to function that
// always returns 1 (so (environment) => 1) and the display function defaults to
// function that always returns true (so (environment) => true).
// Two additional helper functions are defined:
//     * fixedQuantity(quantity), which always returns the specified quantity
//     * alwaysDisplay(), which always displays the item 
var EQUIPMENT = [
    buildItem("<strong>Izjava staršev ali skrbnikov</strong>"),
    
    // Najbolj nujne stvari (podloge za spanje in spalna vreca)
    buildItem("Samonapihljiva blazina"),
    buildItem("Armafleks (za bivakiranje)"),
    buildItem("Topla spalna vreča"),
    
    // Pripomocki za bivanje v naravi
    buildItem("Baterijska svetilka in dodatni baterijski vložki"),
    buildItem("Palerina ali anorak"),
    buildItem("Dežnik"),
    
    // Zepni noz priporocamo skupinam, ki niso MC
    buildItem("Žepni nož (🌳)", fixedQuantity(1), (environment) => environment.group != 'mc'),
    
    // Pripomocki za kopanje
    buildItem("Kopalke", fixedQuantity(2)),
    buildItem("Kopalna brisača", fixedQuantity(2)),
    
    // Potrebna oblacila, ponavadi napisemo kot eno alinejo, tukaj je smiselno razpisati
    buildItem("Kratka majica", (environment) => environment.numberOfDays() + 1),
    buildItem("Kratke hlače", (environment) => Math.ceil(environment.numberOfDays() / 3)),
    buildItem("Dolga majica (hoodie)", (environment) => Math.ceil(environment.numberOfDays() / 3)),
    buildItem("Dolge hlače", (environment) => Math.ceil(environment.numberOfDays() / 3)),
    buildItem("Debelejša majica (flis) ali lažja bunda"),
    buildItem("Zimska pižama ali trenirka za spanje"),

    // Za tiste, ki iscejo ljubezen dodamo se komplet lepih stvari
    buildItem("Crop top (❤)", (environment) => Math.ceil(environment.numberOfDays() / 2), (environment) => environment.searchingForLove),
    buildItem("Lepe hlače (❤)", fixedQuantity(2), (environment) => environment.searchingForLove),
    buildItem("Lepa kratka majica (❤)", (environment) => Math.ceil(environment.numberOfDays() / 2), (environment) => environment.searchingForLove),
    buildItem("Lepa dolga majica (❤)", (environment) => Math.ceil(environment.numberOfDays() / 2), (environment) => environment.searchingForLove),

    // Spodnje perilo
    buildItem("Spodnje hlače", (environment) => environment.numberOfDays() + 2),
    buildItem("Nogavice", (environment) => environment.numberOfDays() + 2),

    // Obutev - japonke in cevlji
    buildItem("Lahka obutev - natikači"),
    buildItem("Obutev za po vodi"),
    buildItem("Telovadni copati (radi se zmočijo)", fixedQuantity(2)),
    buildItem("Močnejši telovadni copati - pohodniški čevlji ali dodatni močnejši telovadni copati"),

    // Pribor za osebno higieno
    buildItem("Brisača za obraz"),
    buildItem("Zobna ščetka"),
    buildItem("Zobna pasta"),
    buildItem("Bio Milo"),
    buildItem("Bio Šampon"),
    buildItem("Glavnik"),

    // Za osebe z dolgimi lasmi dodamo se lastike za lase in balzam
    buildItem("Elastika za lase (💇)", fixedQuantity(2), (environment) => environment.hasLongHair),
    buildItem("Bio Balzam (💇)", fixedQuantity(1), (environment) => environment.hasLongHair),

    // Soncne kreme in spreji proti klopom
    buildItem("Zaščita pred soncem (krema z visokim zaščitnim faktorjem)"),
    buildItem("Sončna očala"),
    buildItem("Klobuk ali kapa"),
    buildItem("Zaščita za komarje in klope in za posledice"),

    // Pripomocki za prehranjevanje
    buildItem("Jedilni pribor (žlica, vilica, nož)"),
    buildItem("Velik globok krožnik in velik nizek krožnik (ali menažka, <strong>vendar ne vojaška</strong>)"),
    buildItem("Kozarček za pijačo"),
    buildItem("Bombažna vrečka za posodo"),

    buildItem("Sladkarije (🐜)", fixedQuantity(1), (environment) => environment.likesBugs),

    // Ostali pripomocki
    buildItem("Čutara ali več pol-literskih plastenk"),

    // Taborniske stvari
    buildItem("Taborniška rutka"),
    buildItem("Taborniški kroj (zložen na vrhu nahrbtnika)"),
    buildItem("Obešalnik za taborniški kroj (🧼)", fixedQuantity(1), (environment) => environment.isClean),
    buildItem("Obešalnik za taborniški kroj sostanovalca (🧼)", fixedQuantity(1), (environment) => environment.isClean),
    buildItem("Razpored za čiščenje šotora (🧼)", fixedQuantity(1), (environment) => environment.isClean),

    // Zdravstveni pripomocki
    buildItem("Zdravstvena kartica"),
    buildItem("Zdravila (💉)", fixedQuantity(1), (environment) => environment.specialMedicalRequirements),

    buildItem("Osebna izkaznica ali potni list"),

    buildItem("Komplet navadnih igralnih kart (🃏)", fixedQuantity(1), (environment) => environment.boardGameFan >= 1),
    buildItem("Komplet igralnih kart za briškolo (🃏)", fixedQuantity(1), (environment) => environment.boardGameFan >= 2),
    buildItem("Komplet igralnih kart za Tarok (🃏)", fixedQuantity(1), (environment) => environment.boardGameFan >= 3),

    buildItem("Igrača za spanje (🌳)", fixedQuantity(1), (environment) => environment.group == 'mc'),

    buildItem("Budilka (🌄 ali ⭐)", fixedQuantity(1), (environment) => environment.isEarlyBird || environment.isThief),
    buildItem("Pisno opravičilo sostanovalcu zaradi hrupa ali čepke za ušesa (🌄 ali ⭐)", fixedQuantity(1), (environment) => environment.isEarlyBird || environment.isThief),
    buildItem("Načrt za krajo zastave (⭐)", fixedQuantity(1), (environment) => environment.isThief),

    buildItem("Ribiška palica (🧔)", fixedQuantity(1), (environment) => environment.isSvit),
    buildItem("Dovoljenje za ribolov (🧔)", fixedQuantity(1), (environment) => environment.isSvit),
    buildItem("Sekira (🧔)", fixedQuantity(1), (environment) => environment.isSvit),
    buildItem("Ročna žaga (🧔)", fixedQuantity(1), (environment) => environment.isSvit),
    buildItem("Sušice (🧔)", fixedQuantity(12), (environment) => environment.isSvit),
];

// List of questions that the user can use to customize the equipment list. Each
// question has a question and an emoji. The emoji is shown above the question
// text and can be used to show user why some item is on the list.

// Each answer has a text that is displayed inside the button and a callback
// function that accepts and changes the environment. When user clicks on the
// button, the current user environment is passed to the function, which then
// changes the environment properties. After each click, the environment is
// saved, so user can exit the questionare at any time.
var QUESTIONS = [
    {
        question: "V katero taborniško družino spadaš?", answers: [
            { answer: "Medvedki in čebelice", callback: (environment) => environment.group = "mc" },
            { answer: "Gozdovniki in gozdovnice", callback: (environment) => environment.group = "gg" },
            { answer: "Popotniki in popotnice", callback: (environment) => environment.group = "pp" },
            { answer: "Raziskovalci in raziskovalke", callback: (environment) => environment.group = "rr" },
            { answer: "Grče", callback: (environment) => environment.group = "grce" },
        ],
        emoji: "🌳"
    },
    {
        question: "Imaš kakšno zdravstveno posebnost?", answers: [
            { answer: "Ja", callback: (environment) => environment.specialMedicalRequirements = true },
            { answer: "Ne", callback: (environment) => environment.specialMedicalRequirements = false },
        ],
        emoji: "💉"
    },
    {
        question: "Imaš dolge lase?", answers: [
            { answer: "Ja", callback: (environment) => environment.hasLongHair = true },
            { answer: "Ne", callback: (environment) => environment.hasLongHair = false },
        ],
        emoji: "💇"
    },
    {
        question: "Si navdušenec nad družabnimi igrami?", answers: [
            { answer: "Sploh ne maram družabnih iger.", callback: (environment) => environment.boardGameFan = 0 },
            { answer: "Včasih odigram kakšno igro remija.", callback: (environment) => environment.boardGameFan = 1 },
            { answer: "Dan ni popoln če ne vržem par rund briškole.", callback: (environment) => environment.boardGameFan = 2 },
            { answer: "Rodil sem se s kartami v žepu", callback: (environment) => environment.boardGameFan = 3 },
        ],
        emoji: "🃏"
    },
    {
        question: "Boš na akciji iskal ljubezen?", answers: [
            { answer: "Ja", callback: (environment) => environment.searchingForLove = true },
            { answer: "Ne", callback: (environment) => environment.searchingForLove = false }
        ],
        emoji: "❤"
    },
    {
        question: "Imaš rad mravlje v šotoru?", answers: [
            { answer: "Ja", callback: (environment) => environment.likesBugs = true },
            { answer: "Ne", callback: (environment) => environment.likesBugs = false }
        ],
        emoji: "🐜"
    },
    {
        question: "Si pionirec Svit?", answers: [
            { answer: "Ja", callback: (environment) => environment.isSvit = true },
            { answer: "Ne", callback: (environment) => environment.isSvit = false }
        ],
        emoji: "🧔"
    },
    {
        question: "Imaš rad čist in urejen šotor?", answers: [
            { answer: "Ja", callback: (environment) => environment.isClean = true },
            { answer: "Ne", callback: (environment) => environment.isClean = false }
        ],
        emoji: "🧼"
    },
    {
        question: "Se rad zbudiš pol ure pred vsemi in opazuješ sončni vzhod?", answers: [
            { answer: "Ja", callback: (environment) => environment.isEarlyBird = true },
            { answer: "Ne", callback: (environment) => environment.isEarlyBird = false }
        ],
        emoji: "🌄"
    },
    {
        question: "Bi rad straži ukradel zastavo?", answers: [
            { answer: "Ja", callback: (environment) => environment.isThief = true },
            { answer: "Ne", callback: (environment) => environment.isThief = false }
        ],
        emoji: "⭐"
    },
];