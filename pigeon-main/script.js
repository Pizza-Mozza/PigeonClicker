let pigeonCount = 0;
let pigeonsPerClick = 1;

// Gestion des améliorations de clic manuel
let upgrades = {
    1: { cost: 10, multiplier: 2 },
    2: { cost: 50, multiplier: 5 }
};

// Gestion des améliorations passives
let passiveUpgrades = {
    couveuse: { cost: 100, clicksPerSecond: 1, quantity: 0 },
    miettes: { cost: 1000, clicksPerSecond: 5, quantity: 0 }
};

// Pigeons générés par seconde
let pigeonsPerSecond = 0;

// Objectifs
let goals = [
    { goal: 10, message: "Conquête de la Rue : Atteignez 100 pigeons pour contrôler le quartier." },
    { goal: 100, message: "Conquête du Quartier : Atteignez 10,000 pigeons pour conquérir la ville." },
    { goal: 10000, message: "Conquête de la Ville : Atteignez 1 milliard de pigeons pour dominer le monde !" },
    { goal: 1000000000, message: "Domination Mondiale : Conquête de l'Espace débloquée !" }
];

let currentGoalIndex = 0;

// Gestion de l'évolution des images (œuf -> pigeon -> pigeons de couleur)
let isEgg = true;
let isCrackedEgg = false;
let isDefaultPigeon = true;

// Gestion des clics manuels
function clickPigeon() {
    pigeonCount += pigeonsPerClick;
    updatePigeonImage();
    updateUI();
}

// Mise à jour de l'image en fonction des clics
function updatePigeonImage() {
    const pigeonImg = document.getElementById("pigeon");

    if (isEgg && pigeonCount >= 100) {
        pigeonImg.src = "crackedEgg.png"; // Œuf fissuré
        isEgg = false;
        isCrackedEgg = true;
    } else if (isCrackedEgg && pigeonCount >= 1000) {
        pigeonImg.src = "Pigeons.png"; // Pigeon normal
        isCrackedEgg = false;
        isDefaultPigeon = true;
    } else if (isDefaultPigeon && pigeonCount >= 10000) {
        pigeonImg.src = "PigeonBleu.png"; // Pigeon bleu
        isDefaultPigeon = false;
    } else if (pigeonCount >= 100000) {
        pigeonImg.src = "PigeonDoree.png"; // Pigeon doré
    }
}

// Achat d'améliorations de clic manuel
function buyUpgrade(upgradeId) {
    if (pigeonCount >= upgrades[upgradeId].cost) {
        pigeonCount -= upgrades[upgradeId].cost;
        pigeonsPerClick *= upgrades[upgradeId].multiplier;
        upgrades[upgradeId].cost *= 2;
        updateUI();
    }
}

// Achat d'améliorations passives
function buyPassiveUpgrade(upgradeName) {
    let upgrade = passiveUpgrades[upgradeName];
    if (pigeonCount >= upgrade.cost) {
        pigeonCount -= upgrade.cost;
        upgrade.quantity++;
        pigeonsPerSecond += upgrade.clicksPerSecond;

        upgrade.cost = Math.ceil(upgrade.cost + (upgrade.cost * 0.2));

        if ([10, 25, 50, 100].includes(upgrade.quantity)) {
            pigeonsPerSecond += upgrade.clicksPerSecond * upgrade.quantity;
        }

        updateUI();
    }
}

// Génération automatique de clics passifs
function generatePassiveClicks() {
    pigeonCount += pigeonsPerSecond;
    updatePigeonImage();
    updateUI();
}

// Mise à jour de l'interface utilisateur
function updateUI() {
    document.getElementById("pigeonCount").textContent = pigeonCount;
    document.getElementById("pigeonsPerSecond").textContent = pigeonsPerSecond;

    for (let id in upgrades) {
        document.getElementById(`cost${id}`).textContent = upgrades[id].cost;
        document.getElementById(`upgrade${id}`).disabled = pigeonCount < upgrades[id].cost;
    }

    for (let upgradeName in passiveUpgrades) {
        let upgrade = passiveUpgrades[upgradeName];
        document.getElementById(`cost_${upgradeName}`).textContent = upgrade.cost;
        document.getElementById(`quantity_${upgradeName}`).textContent = upgrade.quantity;
    }

    if (currentGoalIndex < goals.length && pigeonCount >= goals[currentGoalIndex].goal) {
        document.getElementById("goal").textContent = goals[currentGoalIndex].message;
        currentGoalIndex++;
    }
}

// Déclenche les clics passifs toutes les secondes
setInterval(generatePassiveClicks, 1000);
