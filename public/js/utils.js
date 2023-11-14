function levelCounter(team){
    let acc = 0
    team.forEach((p) => {
        acc = acc + p.lv
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
    sort: async (players, roles) => {
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
                        lv: 0
                    },
                    teamTwo: {
                        roster: utils.assignMod(shuffle.slice(shuffle.length / 2),roles),
                        lv: 0
                    }
                }
                thisTry.teamOne.lv = levelCounter(thisTry.teamOne.roster)
                thisTry.teamTwo.lv = levelCounter(thisTry.teamTwo.roster)
                
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

                if (thisTry.teamOne.lv >= minLv && thisTry.teamTwo.lv >= minLv) {

                    if ((thisTry.teamOne.roster.length >= thisTry.teamTwo.roster.length && thisTry.teamOne.lv <= thisTry.teamTwo.lv ) || (thisTry.teamTwo.roster.length >= thisTry.teamOne.roster.length && thisTry.teamTwo.lv <= thisTry.teamOne.lv )) {
                            console.log("Coincidencia en el " + ( i + 1 ) + " intento");
                            console.log("thisTry.teamOne.lv",thisTry.teamOne.lv);
                            console.log(thisTry.teamOne.roster.map(p => p.name));
                            console.log("thisTry.teamTwo.lv",thisTry.teamTwo.lv);
                            console.log(thisTry.teamTwo.roster.map(p => p.name));
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
                if(role == assignedRole){
                    value =  refObj[index]
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
            let newObj = {
                name: player.name,
                role: lanes[index],
                lv: player.lv * (roles.length == 0 ? 1+((Math.random()*0.2)-0.1) : mod(lanes[index], player.lineas)),
                summonner: player.invocador
            }
            acc.push(newObj)
        })
        return acc
    },
    createTeams: async (defPlayers) => {
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
        let result = await utils.sort(playersAcc, rolesAcc)
        console.log(`En ${aramChecker.checked ? "ARAM" : "Grieta"}, los equipos quedarían así:`);
        let rounds = (rolesAcc.length > 0 ? rolesAcc.length : 5 );
        for (let i = 0; i < rounds; i++) {
            const rol = rolesAcc[i];
            // if (!aramChecker.checked) {
            console.log(result.teamOneLv, result.teamTwoLv);
            // console.log(`${!aramChecker.checked ? "En "+rol+": " :""}${result.teamOne[i] ? result.teamOne[i].name: "      "} ${!aramChecker.checked ? "vs" : " "} ${result.teamTwo[i] ? result.teamTwo[i].name: ""}`);
            
            if (result.teamOne && result.teamOne[i]) {
                teamOneDiv.innerHTML += `<span><img src="/img/one/${!aramChecker.checked ? rol : "mid"}.png"><p>${result.teamOne[i].name}</p></span>`
            }
            if (result.teamTwo && result.teamTwo[i]) {
                teamTwoDiv.innerHTML += `<span><p>${result.teamTwo[i].name}</p><img src="/img/two/${!aramChecker.checked ? rol : "mid"}.png"></span>`
            }
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
            }
        }
        if (!result.teamOne) {
            teamBar.style.display = "none";
        }
    }
}