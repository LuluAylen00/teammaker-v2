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
                            return finalObj = {
                            teamOne: thisTry.teamOne.roster,
                            teamOneLv: thisTry.teamOne.lv,
                            teamTwo: thisTry.teamTwo.roster,
                            teamTwoLv: thisTry.teamTwo.lv
                        }
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
            console.log(value, intValue);
            let input = document.createElement('input');
            input.disabled = true;
            input.type = "radio";
            let date = Date.now();
            input.id = date + "-star-" + intValue;
            input.setAttribute("name", "rating-"+date);
            input.setAttribute('value', intValue);
            if (value == intValue) {
                console.log("Encontró coincidencia en "+intValue);
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
        let values = [[0,0,0],[0,0,0]];
        for (let i = 0; i < rounds; i++) {
            const rol = rolesAcc[i];
            // if (!aramChecker.checked) {
            // console.log(result.teamOne, result.teamTwo);
            // console.log(result);
            // console.log(`${!aramChecker.checked ? "En "+rol+": " :""}${result.teamOne[i] ? result.teamOne[i].name: "      "} ${!aramChecker.checked ? "vs" : " "} ${result.teamTwo[i] ? result.teamTwo[i].name: ""}`);
            // let int = setInterval(() => {
               
                
            if (result.teamOne && result.teamOne[i]) {
                if(i == 0){
                    result.teamOne.forEach(player => {
                        values[0][0] = values[0][0] + player.lv;
                        values[0][1] = values[0][1] + player.maxLv;
                    })
                    values[0][2] = Math.round((( values[0][0] * 100 ) / values[0][1]) / 10 ) / 2;
                    /*teamOneDiv.innerHTML += `
                    <fieldset class="rating">
                        <input disabled type="radio" id="first-star5" name="rating" value="5" ${values[0][2] == 5 ? "checked" : ""}/>
                        <label class="full" for="first-star5"></label>
                        <input disabled type="radio" id="first-star4half" name="rating" value="4 and a half" ${values[0][2] == 4.5 ? "checked" : ""}/>
                        <label class="half" for="first-star4half"></label>
                        <input disabled type="radio" id="first-star4" name="rating" value="4" ${values[0][2] == 4 ? "checked" : ""}/>
                        <label class="full" for="first-star4"></label>
                        <input disabled type="radio" id="first-star3half" name="rating" checked value="3 and a half" ${values[0][2] == 3.5 ? "checked" : ""}/>
                        <label class="half" for="first-star3half"></label>
                        <input disabled type="radio" id="first-star3" name="rating" value="3" ${values[0][2] == 3 ? "checked" : ""}/>
                        <label class="full" for="first-star3"></label>
                        <input disabled type="radio" id="first-star2half" name="rating" value="2 and a half" ${values[0][2] == 2.5 ? "checked" : ""}/>
                        <label class="half" for="first-star2half"></label>
                        <input disabled type="radio" id="first-star2" name="rating" value="2" ${values[0][2] == 2 ? "checked" : ""}/>
                        <label class="full" for="first-star2"></label>
                        <input disabled type="radio" id="first-star1half" name="rating" value="1 and a half" ${values[0][2] == 1.5 ? "checked" : ""}/>
                        <label class="half" for="first-star1half"></label>
                        <input disabled type="radio" id="first-star1" name="rating" value="1" ${values[0][2] == 1 ? "checked" : ""}/>
                        <label class="full" for="first-star1"></label>
                        <input disabled type="radio" id="first-starhalf" name="rating" value="half" ${values[0][2] == 0.5 ? "checked" : ""} />
                        <label class="half" for="first-starhalf"></label>
                    </fieldset>
                    `*/
                    teamOneDiv.appendChild(utils.getStars(values[0][2]));
                }
                teamOneDiv.innerHTML += `<span><img src="/img/one/${!aramChecker.checked ? rol : "mid"}.png"><p>${result.teamOne[i].name}</p></span>`
            }
            if (result.teamTwo && result.teamTwo[i]) {
                if(i == 0){
                    result.teamTwo.forEach(player => {
                        values[1][0] = values[1][0] + player.lv;
                        values[1][1] = values[1][1] + player.maxLv;
                    })
                    values[1][2] = Math.round((( values[1][0] * 100 ) / values[1][1]) / 10 ) / 2;
                    // teamTwoDiv.innerHTML += `
                    // <fieldset class="rating">
                    //     <input disabled type="radio" id="second-star5" name="rating-two" value="5" ${values[1][2] == 5 ? "checked" : ""}/>
                    //     <label class="full" for="second-star5"></label>
                    //     <input disabled type="radio" id="second-star4half" name="rating-two" value="4 and a half" ${values[1][2] == 4.5 ? "checked" : ""}/>
                    //     <label class="half" for="second-star4half"></label>
                    //     <input disabled type="radio" id="second-star4" name="rating-two" value="4" ${values[1][2] == 4 ? "checked" : ""}/>
                    //     <label class="full" for="second-star4"></label>
                    //     <input disabled type="radio" id="second-star3half" name="rating-two" checked value="3 and a half" ${values[1][2] == 3.5 ? "checked" : ""}/>
                    //     <label class="half" for="second-star3half"></label>
                    //     <input disabled type="radio" id="second-star3" name="rating-two" value="3" ${values[1][2] == 3 ? "checked" : ""}/>
                    //     <label class="full" for="second-star3"></label>
                    //     <input disabled type="radio" id="second-star2half" name="rating-two" value="2 and a half" ${values[1][2] == 2.5 ? "checked" : ""}/>
                    //     <label class="half" for="second-star2half"></label>
                    //     <input disabled type="radio" id="second-star2" name="rating-two" value="2" ${values[1][2] == 2 ? "checked" : ""}/>
                    //     <label class="full" for="second-star2"></label>
                    //     <input disabled type="radio" id="second-star1half" name="rating-two" value="1 and a half" ${values[1][2] == 1.5 ? "checked" : ""}/>
                    //     <label class="half" for="second-star1half"></label>
                    //     <input disabled type="radio" id="second-star1" name="rating-two" value="1" ${values[1][2] == 1 ? "checked" : ""}/>
                    //     <label class="full" for="second-star1"></label>
                    //     <input disabled type="radio" id="second-starhalf" name="rating-two" value="half" ${values[1][2] == 0.5 ? "checked" : ""} />
                    //     <label class="half" for="second-starhalf"></label>
                    // </fieldset>
                    // `
                    teamTwoDiv.appendChild(utils.getStars(values[1][2]));
                }
                teamTwoDiv.innerHTML += `<span><p>${result.teamTwo[i].name}</p><img src="/img/two/${!aramChecker.checked ? rol : "mid"}.png"></span>`
            }
            // },1500)
            if (i == rounds - 1) {
                // teamOneDiv.innerHTML += `<span class="level-indicator">${result.teamOneLv}</span>`;
                // teamTwoDiv.innerHTML += `<span class="level-indicator">${result.teamTwoLv}</span>`;
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
        console.log(values);
        if (!result.teamOne) {
            teamBar.style.display = "none";
        }
    }
}