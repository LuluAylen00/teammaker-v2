let version 
async function getVersion(){
    fetch("https://ddragon.leagueoflegends.com/api/versions.json")
    .then(response => response.json())
    .then(data => {
        version = data[0]
        return data[0]
    });
};
getVersion();
let urls = {
    champList: () => {      
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    },
    spells: () => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`
    },
    icons: () => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/profileicon.json`
    },
    champIcon: (picture) => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${picture}`
    }
}

function levelCounter(team){
    let acc = {
        base: 0,
        modified: 0
    }
    team.forEach((p) => {
        acc.base = acc.base + p.baseLv;
        acc.modified = acc.modified + p.lv;
    })
    return acc 
}

let list = [];

let utils = {
    // Randomizador
    shuffle: (array) => {
        // Primera función para randomizar la lista
        let currentIndex = array.length,
            randomIndex;
        // El while hará la cuenta regresiva para ir cambiando los elementos
        while (currentIndex != 0) {
            // Escojo un elemento aleatorio
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // Y lo cambio por el elemento actual del index
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    },
    sort: async (players, roles, mode) => {
        //console.log(players); [1, 2, 9]
        if (players && players.length > 0) {
            let array = players.map(player => {
                return list.find(p => p.id == player)
            })
            
            let finalObj = {};

            
            
            for (let i = 0; i < 99999; i++) {
                let shuffle = utils.shuffle(array);
                let thisTry = {
                    teamOne: {
                        roster: utils.assignMod(shuffle.slice(0, shuffle.length / 2),roles),
                        lv: 0,
                        baseLv: 0
                    },
                    teamTwo: {
                        roster: utils.assignMod(shuffle.slice(shuffle.length / 2),roles),
                        lv: 0,
                        baseLv: 0
                    }
                }
                thisTry.teamOne.lv = levelCounter(thisTry.teamOne.roster).modified;
                thisTry.teamOne.baseLv = levelCounter(thisTry.teamOne.roster).base;

                thisTry.teamTwo.lv = levelCounter(thisTry.teamTwo.roster).modified;
                thisTry.teamTwo.baseLv = levelCounter(thisTry.teamTwo.roster).base;
                
                // if (i < 2) {/*
                //     console.log(thisTry.teamOne);
                //     console.log(thisTry.teamTwo);*/
                //     console.log(thisTry.teamOne.lv + thisTry.teamTwo.lv);
                //     console.log("thisTry.teamOne.lv",thisTry.teamOne.lv);
                //             console.log(thisTry.teamOne.roster.map(p => p.name));
                //             console.log("thisTry.teamTwo.lv",thisTry.teamTwo.lv);
                //             console.log(thisTry.teamTwo.roster.map(p => p.name));
                // }

                let minLv = (thisTry.teamOne.lv + thisTry.teamTwo.lv) / 2 * 0.95
                // console.log(thisTry);
                let modeCondition = false;
                switch (mode) {
                    case "zzz":
                        modeCondition = (thisTry.teamOne.lv <= thisTry.teamOne.baseLv*0.8 && thisTry.teamTwo.lv <= thisTry.teamTwo.baseLv*0.8)
                        break;
                    case "normal":
                        modeCondition = true;
                        break;
                    case "hardcore":
                        modeCondition = (thisTry.teamOne.lv >= thisTry.teamOne.baseLv*1.15 && thisTry.teamTwo.lv >= thisTry.teamTwo.baseLv*1.15)
                        break;
                    case "worst": 
                        if (i >= 98990) {
                            modeCondition = true;
                        }
                        // console.log(finalObj.teamOne && finalObj.teamTwo);
                        if (!(finalObj.teamOne && finalObj.teamTwo)) {
                            // console.log("entré");
                            finalObj = {
                                teamOne: thisTry.teamOne.roster,
                                teamOneLv: thisTry.teamOne.lv,
                                teamTwo: thisTry.teamTwo.roster,
                                teamTwoLv: thisTry.teamTwo.lv
                            }
                        } 
                        // console.log(finalObj.teamOneLv, thisTry.teamOne.lv);
                        if (finalObj.teamOneLv > thisTry.teamOne.lv && finalObj.teamTwoLv > thisTry.teamTwo.lv){
                            // console.log(`En la iteración ${i} el nivel del equipo seleccionado (${finalObj.teamOneLv}) fue mayor que el de esta iteración (${thisTry.teamOne.lv}), reemplazando...`);
                            finalObj = {
                                teamOne: thisTry.teamOne.roster,
                                teamOneLv: thisTry.teamOne.lv,
                                teamTwo: thisTry.teamTwo.roster,
                                teamTwoLv: thisTry.teamTwo.lv,
                            }
                        }
                        // if (finalObj.teamTwoLv > thisTry.teamTwo.lv){
                        //     finalObj = {
                        //         ...finalObj,
                        //     }
                        // }
                        break;
                    case "best":
                        if (i >= 98990) {
                            modeCondition = true;
                        }
                        // console.log(finalObj.teamOne && finalObj.teamTwo);
                        if (!(finalObj.teamOne && finalObj.teamTwo)) {
                            // console.log("entré");
                            finalObj = {
                                teamOne: thisTry.teamOne.roster,
                                teamOneLv: thisTry.teamOne.lv,
                                teamTwo: thisTry.teamTwo.roster,
                                teamTwoLv: thisTry.teamTwo.lv
                            }
                        } 
                        // console.log(finalObj.teamOneLv, thisTry.teamOne.lv);
                        if (finalObj.teamOneLv < thisTry.teamOne.lv && finalObj.teamTwoLv < thisTry.teamTwo.lv){
                            // console.log(`En la iteración ${i} el nivel del equipo seleccionado (${finalObj.teamOneLv}) fue mayor que el de esta iteración (${thisTry.teamOne.lv}), reemplazando...`);
                            finalObj = {
                                teamOne: thisTry.teamOne.roster,
                                teamOneLv: thisTry.teamOne.lv,
                                teamTwo: thisTry.teamTwo.roster,
                                teamTwoLv: thisTry.teamTwo.lv,
                            }
                        }
                        break;
                    default:
                        break;
                }
                // let hardcoreCondition = hardcore 

                if (thisTry.teamOne.lv >= minLv && thisTry.teamTwo.lv >= minLv && modeCondition) {

                    if ((thisTry.teamOne.roster.length >= thisTry.teamTwo.roster.length && thisTry.teamOne.lv <= thisTry.teamTwo.lv ) || (thisTry.teamTwo.roster.length >= thisTry.teamOne.roster.length && thisTry.teamTwo.lv <= thisTry.teamOne.lv )) {
                            console.log("Coincidencia en el " + ( i + 1 ) + " intento");
                            // console.log("thisTry.teamOne.lv",thisTry.teamOne.lv);
                            // console.log(thisTry.teamOne.roster.map(p => p.name));
                            // console.log("thisTry.teamTwo.lv",thisTry.teamTwo.lv);
                            // console.log(thisTry.teamTwo.roster.map(p => p.name));
                            if (mode != "best" && mode != "worst") {
                                finalObj = {
                                    teamOne: thisTry.teamOne.roster,
                                    teamOneLv: thisTry.teamOne.lv,
                                    teamTwo: thisTry.teamTwo.roster,
                                    teamTwoLv: thisTry.teamTwo.lv
                                }
                            }
                            return finalObj;
                    }
                }

                if (i == 99998) {
                    console.log("Error");
                    alert("Por algún motivo, no se ha encontrado ningún enfrentamiento potable");
                }

            }
            return finalObj
        } else {
            return "No se han seleccionado jugadores"
        }
    },
    assignMod: (team, roles) => {
        const mod = function (assignedRole,playerRoles){
            // assignedRole = rol que le toca al jugador
            // playerRoles = listado de roles por comodidad del jugador
            let refObj = {
                0: 1.4,
                1: 1.2,
                2: 1,
                3: 0.8,
                4: 0.6
            }
            //   0  |  1  |  2  |  3  |  4
            //  1.4 | 1.2 |  1  | 0.8 | 0.6
            let value = 1
            playerRoles.forEach((role, index) => {
                if(role.rol == assignedRole){
                    value = role.multiplicador;
                }
            })
            //console.log("previa",assignedRole,playerRoles);
            
            return value
        }
        // let size = team.length
        let lanes = roles
        // switch (size) {
        //     case 2:
        //         lanes = ["top", "mid"]
        //         break;
        //     case 3:
        //         lanes = ["top", "mid", "adc"]
        //         break;
        //     case 4:
        //         lanes = ["top", "jg", "mid", "adc"]
        //         break;
        //     case 5:
        //         lanes = ["top", "jg", "mid", "adc", "sup"]
        //         break;
        //     default:
        //         lanes = ["mid"]
        //         break;
        // }
        let acc = []
        team.forEach((player,index) => { // lanes[index] = posición asignada en el equipo
            // log
            let newObj = {
                name: player.name,
                role: lanes[index],
                lv: player.lv * (roles.length == 0 ? 1+((Math.random()*0.2)-0.1) : mod(lanes[index], player.lineas)),
                baseLv: player.lv,
                maxLv: Math.max(...player.lineas.map(role => role.multiplicador)) * player.lv,
                minLv: Math.min(...player.lineas.map(role => role.multiplicador)) * player.lv,
                masteries: player.masteries,
                summonner: player.invocador
            }
            acc.push(newObj)
        })
        return acc
    },
    getStars: (value) => {
        let values = [5,4.5,4,3.5,3,2.5,2,1.5,1,0.5];
        let fieldset = document.createElement('fieldset');
        fieldset.classList.add("rating");

        values.forEach(intValue => {
            // console.log(value, intValue);
            let input = document.createElement('input');
            input.disabled = true;
            input.type = "radio";
            let date = Date.now();
            input.id = date + "-star-" + intValue;
            input.setAttribute("name", "rating-"+date);
            input.setAttribute('value', intValue);
            if (value == intValue) {
                // console.log("Encontró coincidencia en "+intValue);
                input.checked = true;
                input.setAttribute('checked', 'checked');
            } else {
                input.checked = false;
            }
            fieldset.appendChild(input);

            let label = document.createElement('label');
            label.classList.add(String(intValue).includes(".5") ? "half" : "full");
            label.for = date + "-star-" + intValue;
            fieldset.appendChild(label);
            // <input disabled type="radio" id="first-star5" name="rating" value="5" ${value == 5 ? "checked" : ""}/>
            // <label class="full" for="first-star5"></label>
        })
    //     let stars = `<fieldset class="rating">
    //     <input disabled type="radio" id="first-star5" name="rating" value="5" ${value == 5 ? "checked" : ""}/>
    //     <label class="full" for="first-star5"></label>
    //     <input disabled type="radio" id="first-star4half" name="rating" value="4 and a half" ${value == 4.5 ? "checked" : ""}/>
    //     <label class="half" for="first-star4half"></label>
    //     <input disabled type="radio" id="first-star4" name="rating" value="4" ${value == 4 ? "checked" : ""}/>
    //     <label class="full" for="first-star4"></label>
    //     <input disabled type="radio" id="first-star3half" name="rating" checked value="3 and a half" ${value == 3.5 ? "checked" : ""}/>
    //     <label class="half" for="first-star3half"></label>
    //     <input disabled type="radio" id="first-star3" name="rating" value="3" ${value == 3 ? "checked" : ""}/>
    //     <label class="full" for="first-star3"></label>
    //     <input disabled type="radio" id="first-star2half" name="rating" value="2 and a half" ${value == 2.5 ? "checked" : ""}/>
    //     <label class="half" for="first-star2half"></label>
    //     <input disabled type="radio" id="first-star2" name="rating" value="2" ${value == 2 ? "checked" : ""}/>
    //     <label class="full" for="first-star2"></label>
    //     <input disabled type="radio" id="first-star1half" name="rating" value="1 and a half" ${value == 1.5 ? "checked" : ""}/>
    //     <label class="half" for="first-star1half"></label>
    //     <input disabled type="radio" id="first-star1" name="rating" value="1" ${value == 1 ? "checked" : ""}/>
    //     <label class="full" for="first-star1"></label>
    //     <input disabled type="radio" id="first-starhalf" name="rating" value="half" ${value == 0.5 ? "checked" : ""} />
    //     <label class="half" for="first-starhalf"></label>
    // </fieldset>`

        return fieldset;
    },
    createTeams: async (defPlayers, mode) => {
        list = defPlayers;

        let players = document.querySelectorAll('input[name="players"]:checked');
        let roles = document.querySelectorAll("select");

        let playersAcc = [];
        players.forEach(p => playersAcc.push(p.value));

        let aramChecker = document.querySelector("#is-aram");
        // console.log(aramChecker.checked);
        let rolesAcc = [];
        if (!aramChecker.checked) {
            roles.forEach(p => rolesAcc.push(p.value));
        } else {

        }

        let main = document.querySelector("main");
        let teamOneDiv = document.querySelector("#team-one");
        teamOneDiv.innerHTML = "";
        let teamTwoDiv = document.querySelector("#team-two");
        teamTwoDiv.innerHTML = "";

        let teamBar = document.querySelector(".team-bar");
        // console.log(playersAcc, rolesAcc);
        let result = await utils.sort(playersAcc, rolesAcc, mode);
        // console.log(`En ${aramChecker.checked ? "ARAM" : "Grieta"}, los equipos quedarían así:`);
        let rounds = (rolesAcc.length > 0 ? rolesAcc.length : 5 );
        // Indice 0 = lv actual
        // Indice 1 = lv maximo posible
        // Indice 2 = Valor en estrellas
        // Indice 3 = lv minimo posible
        let values = [[0,0,0,0],[0,0,0,0]];
        for (let i = 0; i < rounds; i++) {
            const rol = rolesAcc[i];              
                
            if (result.teamOne && result.teamOne[i]) {
                if(i == 0){
                    // console.log(result);
                    result.teamOne.forEach(player => {
                        values[0][0] = values[0][0] + player.lv;
                        values[0][1] = values[0][1] + player.maxLv;
                        values[0][3] = values[0][3] + player.minLv;
                    })
                    values[0][2] = Math.round((( (values[0][0] - values[0][3]) * 100 ) / (values[0][1]- values[0][3])) / 10 ) / 2;
                    teamOneDiv.appendChild(utils.getStars(values[0][2]));
                }
                // teamOneDiv.innerHTML += `<span></span>`
                let span = document.createElement("span");
                span.classList.add('team-one-span');
                span.innerHTML = `<img src="/img/one/${!aramChecker.checked ? rol : "mid"}.png"><p>${result.teamOne[i].name}</p>`;
                span.addEventListener("click", () => {
                    let dataset = teamTwoDiv.querySelector("#dataset");
                    if (dataset) {
                        dataset.remove();
                    } else {
                        let newDataset = document.createElement("div");
                        newDataset.id = 'dataset';
    
                        let table = document.createElement("table");
                        // table.classList.add('table')
                        // table-striped table-dark
                        table.setAttribute("class", "table table-hover table-striped table-dark");
                        table.innerHTML = `<thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Champ</th>
                            <th scope="col">Maestría</th>
                            <th scope="col">Puntos</th>
                            </tr>
                        </thead>`;
                        let tbody = document.createElement("tbody");
                        result.teamOne[i].masteries.forEach((champ) => {
                            let tr = document.createElement("tr");
                            tr.innerHTML = `
                                <th scope="row">${champ.mPosition.selected}</th>
                                <td><img src="${urls.champIcon(champ.image)}" alt="${champ.name}" title="${champ.name}"/></td>
                                <td><img src="/img/masteries/m${champ.mastery}.png" alt="Maestría ${champ.mastery}" title="Maestría ${champ.mastery}" /></td>
                                <td>${champ.points}</td>
                            `
                            tbody.appendChild(tr);
                        })
                        table.appendChild(tbody);
                        newDataset.appendChild(table);
    
                        teamTwoDiv.appendChild(newDataset);
                    }

                })
                teamOneDiv.appendChild(span);
            }
            if (result.teamTwo && result.teamTwo[i]) {
                if(i == 0){
                    result.teamTwo.forEach(player => {
                        values[1][0] = values[1][0] + player.lv;
                        values[1][1] = values[1][1] + player.maxLv;
                        values[1][3] = values[1][3] + player.minLv;
                    })
                    values[1][2] = Math.round((( (values[1][0] - values[1][3]) * 100 ) / (values[1][1]- values[1][3])) / 10 ) / 2;

                    teamTwoDiv.appendChild(utils.getStars(values[1][2]));
                }
                //////////
                // teamTwoDiv.innerHTML += `<span><p>${result.teamTwo[i].name}</p><img src="/img/two/${!aramChecker.checked ? rol : "mid"}.png"></span>`
                let span = document.createElement("span");
                span.classList.add('team-two-span');
                span.innerHTML = `<p>${result.teamTwo[i].name}</p><img src="/img/two/${!aramChecker.checked ? rol : "mid"}.png">`;
                span.addEventListener("click", () => {
                    let dataset = teamOneDiv.querySelector("#dataset");
                    if (dataset) {
                        dataset.remove();
                    } else {
                        let newDataset = document.createElement("div");
                        newDataset.id = 'dataset';
    
                        let table = document.createElement("table");
                        // table.classList.add('table')
                        // table-striped table-dark
                        table.setAttribute("class", "table table-hover table-striped table-dark");
                        table.innerHTML = `<thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Champ</th>
                            <th scope="col">Maestría</th>
                            <th scope="col">Puntos</th>
                            </tr>
                        </thead>`;
                        let tbody = document.createElement("tbody");
                        result.teamTwo[i].masteries.forEach((champ) => {
                            let tr = document.createElement("tr");
                            tr.innerHTML = `
                                <th scope="row">${champ.mPosition.selected}</th>
                                <td><img src="${urls.champIcon(champ.image)}" alt="${champ.name}" title="${champ.name}"/></td>
                                <td><img src="/img/masteries/m${champ.mastery}.png" alt="Maestría ${champ.mastery}" title="Maestría ${champ.mastery}" /></td>
                                <td>${champ.points}</td>
                            `
                            tbody.appendChild(tr);
                        })
                        table.appendChild(tbody);
                        newDataset.appendChild(table);
    
                        teamOneDiv.appendChild(newDataset);
                    }

                })
                teamTwoDiv.appendChild(span);
            }
            
            if (i == rounds - 1) {
                let indicator = document.querySelector("#indicator");
                
                teamBar.style.display = "flex";
                let percentOne = result.teamOneLv * 100 / (result.teamOneLv + result.teamTwoLv);
                // console.log(Number(percentOne.toFixed(1)), Number((100 - percentOne).toFixed(1)));
                indicator.style.width = `${percentOne}%`
                let teamOneIndicator = document.querySelector("#team-one-indicator");
                teamOneIndicator.innerHTML = `${Number(percentOne.toFixed(1))}%`
                let teamTwoIndicator = document.querySelector("#team-two-indicator");
                teamTwoIndicator.innerHTML = `${Number((100 - percentOne).toFixed(1))}%`
                // clearInterval(int);
            }
        }
        // console.log(values);
        if (!result.teamOne) {
            teamBar.style.display = "none";
        }
    }
}