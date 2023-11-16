function detectDefaults(players) {
    switch (players) {
        case 1:
            return ["mid"];
        case 2:
            return ["top","mid"];
        case 3:
            return ["top","mid","adc"];
        case 4:
            return ["top","jg","mid","adc"];
        case 5:
            return ["top","jg","mid","adc","sup"];
        default:
            return [];
    }
}

function createRoleSelector(role){
    let roleSelect = document.createElement("select");
    roleSelect.setAttribute("id", "role-selector-");
    roleSelect.innerHTML = `
        <option value="top" ${role == "top" ? "selected" : ""}>top</option>
        <option value="jg" ${role == "jg" ? "selected" : ""}>jg</option>
        <option value="mid" ${role == "mid" ? "selected" : ""}>mid</option>
        <option value="adc" ${role == "adc" ? "selected" : ""}>adc</option>
        <option value="sup" ${role == "sup" ? "selected" : ""}>sup</option>
    `;
    return roleSelect;
}

// console.log(roleSelect);
function selectCheckeds() {
    let checkeds = document.querySelectorAll('input[name="players"]:checked');
    // console.log(checkeds.values);
    let acc = [];
    checkeds.forEach(p => acc.push(p.value));
    // console.log(acc);
    let rolesList = document.querySelector("div#roles");
    rolesList.innerHTML = "";
    // console.log(Math.ceil(acc.length / 2));
    let defaultRoles = detectDefaults(Math.ceil(acc.length / 2));
    for (let i = 1; i <= Math.ceil(acc.length / 2); i++) {
        let newRoleSelect = createRoleSelector(defaultRoles[i-1]);
        newRoleSelect.id += i;
        rolesList.appendChild(newRoleSelect);
    }

    let notCheckeds = document.querySelectorAll('input[name="players"]:not(:checked)');
    if (acc.length == 10) {
        notCheckeds.forEach(label => {
            // console.log(label);
            label.disabled = true;
        })
    } else {
        notCheckeds.forEach(label => {
            // console.log(label);
            label.disabled = false;
        })
    }
}

window.addEventListener('load', async function() {
    let playersFetch = await fetch('/api/players');
    let players = await playersFetch.json();
    players = players.list;
    // console.log(players);

    let header = document.querySelector("header");
    let toSelectList = document.querySelector("div#to-select > ul");
    let selectedList = document.querySelector("div#selected > ul");

    players.forEach(function(player) {
        // <input type="checkbox" name="players" id="playerOne">
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.name = "players";
        input.id = `p-${player.id}-input`;
        input.value = player.id;
        header.appendChild(input);

        let toSelectLabel = document.createElement("label");
        toSelectLabel.innerHTML = `${player.name}`;
        toSelectLabel.setAttribute("for",`p-${player.id}-input`);
        toSelectList.appendChild(toSelectLabel);

        let selectedLabel = document.createElement("label");
        selectedLabel.innerHTML = `${player.name}`;
        selectedLabel.setAttribute("for",`p-${player.id}-input`);
        selectedLabel.style.display = "none";
        selectedList.appendChild(selectedLabel);

        input.addEventListener("change", () => {
            if (input.checked){
                toSelectLabel.style.display = "none";
                selectedLabel.style.display = "flex";
            } else {
                toSelectLabel.style.display = "flex";
                selectedLabel.style.display = "none";
            }
            selectCheckeds();
        })

    })
    let zzzButton = document.querySelector("#make-zzz-teams");
    zzzButton.addEventListener("click", () =>{
        utils.createTeams(players, "zzz");
    })
    let button = document.querySelector("#make-teams");
    button.addEventListener("click", () =>{
        utils.createTeams(players, "normal");
    })
    let hardcoreButton = document.querySelector("#make-hardcore-teams");
    hardcoreButton.addEventListener("click", () =>{
        utils.createTeams(players, "hardcore");
    })

    let bestButton = document.querySelector("#best");
    bestButton.addEventListener("click", ()=>{
        utils.createTeams(players, "best");
    })
    let worstButton = document.querySelector("#worst");
    worstButton.addEventListener("click", ()=>{
        utils.createTeams(players, "worst");
    })

})