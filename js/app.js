// app.js

let spellData = [];

const schoolColors = {
    abjuration: '#ddd826',
    conjuration: '#4a3c9e',
    divination: '#990099',
    enchantment: '#74fdff',
    evocation: '#e23d23',
    illusion: '#fc7315',
    necromancy: '#830410',
    transmutation: '#00da28'
};

const damageTypeColors = {
    slashing: '#e6194B',
    piercing: '#3cb44b',
    bludgeoning: '#ffe119',
    poison: '#4363d8',
    acid: '#f58231',
    fire: '#e6194B',
    cold: '#42d4f4',
    radiant: '#fabed4',
    necrotic: '#911eb4',
    lightning: '#bfef45',
    thunder: '#469990',
    force: '#dcbeff',
    psychic: '#9A6324'
};

async function loadSpellData() {
    const response = await fetch('./data/spells.json');
    spellData = await response.json();
    renderSpellList();
}

function renderSpellList() {
    const spellList = document.getElementById('spell-list');
    spellList.innerHTML = spellData.map(spell => `
        <div class="spell-item" onclick="renderSpellCard('${spell.Name}')">
            ${spell.Name}
        </div>
    `).join('');
}

function renderSpellCard(spellName) {
    const spell = spellData.find(s => s.Name === spellName);
    if (!spell) return;

    document.getElementById('spell-name').textContent = spell.Name;
    
    const levelSchoolElem = document.getElementById('spell-level-school');
    levelSchoolElem.textContent = spell.Level === 'cantrip' 
        ? `${spell.School} cantrip`
        : `${ordinalNumber(spell.Level)}-level ${spell.School.toLowerCase()}`;
    levelSchoolElem.style.color = schoolColors[spell.School.toLowerCase()] || '#000000';

    document.getElementById('school-icon').src = `./images/school-icons/${spell.School.toLowerCase()}.svg`;

    renderStatIcons(spell);
    renderDescription(spell);
    renderFooter(spell);
}

function renderStatIcons(spell) {
    const statIconsContainer = document.querySelector('.flexStatIcons');
    statIconsContainer.innerHTML = `
        <div class="DurationFlexAll">
            <img src="./images/noun-sand-clock-1610904.svg" class="DurationIcon" alt="Duration icon">
            <div class="CastingTextFlex">
                ${spell['Casting Time']}<br>${spell.Duration}
            </div>
        </div>
        <div class="FlexRangeRitual">
            <div class="RangeFlex">
                ${spell.Range}
                <img src="./images/noun-range-2931108.svg" class="RangeIcon" alt="Range icon">
            </div>
            <img src="images/noun-ritual-5105870.svg" class="RitualIcon ${spell.Ritual ? '' : 'inactive'}" alt="Ritual icon">
        </div>
        <div class="CompFlex">
            <img src="./images/noun-x-hand-sign-4134185.svg" class="SomaticIcon ${spell.Components.somatic ? '' : 'inactive'}" alt="Somatic icon">
            <img src="./images/noun-speaking-6509212.svg" class="VocalIcon ${spell.Components.verbal ? '' : 'inactive'}" alt="Vocal icon">
            <img src="./images/noun-focus-6059259.svg" class="ConcentrationIcon ${spell.Concentration ? '' : 'inactive'}" alt="Concentration icon">
        </div>
    `;
}

function renderDescription(spell) {
    const descriptionElem = document.getElementById('spell-description');
    let description = replaceWithIcons(spell.Description);
    if (spell['At Higher Levels']) {
        description += `<br><br><strong>At Higher Levels:</strong> ${replaceWithIcons(spell['At Higher Levels'])}`;
    }
    descriptionElem.innerHTML = description;
}

function renderFooter(spell) {
    const materialComponentsElem = document.getElementById('material-components');
    materialComponentsElem.innerHTML = spell.Components.material 
        ? replaceWithIcons(spell.Components.material)
        : '';
    document.getElementById('material-icon').classList.toggle('inactive', !spell.Components.material);

    const classIconsContainer = document.getElementById('class-icons');
    classIconsContainer.innerHTML = spell['Spell Lists'].map(className => 
        `<img src="./images/class-icons/${className.toLowerCase()}.png" alt="${className} class icon">`
    ).join('');
}

function replaceWithIcons(text) {
    const diceReplacements = {
        'd4': 'd4-icon.svg',
        'd6': 'd6-icon.svg',
        'd8': 'd8-icon.svg',
        'd10': 'd10-icon.svg',
        'd12': 'd12-icon.svg',
        'd20': 'd20-icon.svg',
        'd100': 'd100-icon.svg'
    };

    Object.keys(diceReplacements).forEach(key => {
        const regex = new RegExp(key, 'g');
        text = text.replace(regex, `<img src="./images/dice-icons/${diceReplacements[key]}" class="dice-icon" alt="${key}">`);
    });

    Object.keys(damageTypeColors).forEach(damageType => {
        const regex = new RegExp(`(\\d+\\s*(?:<img[^>]+>\\s*)?(?:\\+\\s*\\d+)?\\s*${damageType})\\s*damage\\b`, 'gi');
        text = text.replace(regex, (match) => {
            const color = damageTypeColors[damageType.toLowerCase()];
            return `<span class="damage-type" style="--damage-color: ${color};">${match}</span>`;
        });
    });

    return text;
}

function ordinalNumber(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

window.onload = loadSpellData;