addLayer("r", {
    name: "rank", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        ranks: [
            null,
            [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // rank
            [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // prestige
            [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // ascension
            [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // return
        ]
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff){
        player.devSpeed = (options.pause?1e-300:1)
    },
    layerShown(){return true},
    tooltip(){return "Ranks"},
    tabFormat:{
        "Main":{
            content:[
                ["display-text",function(){return "You have <h1 style='color:red'>" + format(player.points) + "</h1> points."}],
                ["row",[["clickable",11],["clickable",12],["clickable",13],]],
                
                ["display-text",function(){return hasAchievement('ach',13)?("Your Prestige Base is <h1 style='color:orange'>" + format(tmp.r.getPrestigeBase) + "</h1>. (based on product of Ranks)"):""}],
                ["row",[["clickable",21],["clickable",22],["clickable",23],]],
                
                ["display-text",function(){return hasAchievement('ach',24)?("Your Ascension Base is <h1 style='color:yellow'>" + format(tmp.r.getAscensionBase) + "</h1>. (based on product of Prestiges)"):""}],
                ["row",[["clickable",31],["clickable",32],["clickable",33],]],
                
                ["display-text",function(){return hasAchievement('ach',41)?("Your Return Base is <h1 style='color:lime'>" + format(tmp.r.getReturnBase) + "</h1>. (based on product of Ascensions)"):""}],
                ["row",[["clickable",41],["clickable",42],]],
                
                "blank","blank",
            ],
            unlocked(){return true},
        },
        "Rank Reset":{
            content:[
                ["display-text",function(){return "You have <h1 style='color:red'>" + format(player.points) + "</h1> points."}],
                ["display-text",function(){return hasAchievement('ach',13)?("Your Prestige Base is <h1 style='color:orange'>" + format(tmp.r.getPrestigeBase) + "</h1>. (based on product of Ranks)"):""}],
                ["display-text",function(){return hasAchievement('ach',24)?("Your Ascension Base is <h1 style='color:yellow'>" + format(tmp.r.getAscensionBase) + "</h1>. (based on product of Prestiges)"):""}],
                ["display-text",function(){return hasAchievement('ach',41)?("Your Return Base is <h1 style='color:lime'>" + format(tmp.r.getReturnBase) + "</h1>. (based on product of Ascensions)"):""}],
                "blank",
                ["buyable",11],
                ["display-text",function(){return "<h1>Buyable Effect</h1>"}],
                ["display-text",function(){return tmp.r.getBuyableEffect}],
                "blank",
                ["display-text",function(){return tmp.r.getBuyableEffect2}],

                "blank","blank",
            ],
            unlocked(){return player.ach.achievements.length >= 15},
        }
    },
    getPrestigeBase(){
        let x = new Decimal(1)
        for (let i=1;i<=player.r.ranks[1].length-1;i++){
            x = x.mul(player.r.ranks[1][i].add(1))
        }
        return x
    },
    getAscensionBase(){
        let x = new Decimal(1)
        for (let i=1;i<=player.r.ranks[2].length-1;i++){
            x = x.mul(player.r.ranks[2][i].add(1))
        }
        return x
    },
    getReturnBase(){
        let x = new Decimal(1)
        for (let i=1;i<=player.r.ranks[3].length-1;i++){
            x = x.mul(player.r.ranks[3][i].add(1))
        }
        return x
    },
    getBuyableEffect(){
        let x = ""
        if (player.r.buyables[11].gte(1)) x += "Point#1. Points gain is multiplied based on Rank Resets. (x" + format(buyableEffect('r',11)[1]) + ")<br>"
        if (player.r.buyables[11].gte(2)) x += "Point#2. Points gain is multiplied based on itself. (x" + format(buyableEffect('r',11)[2]) + ")<br>"
        if (player.r.buyables[11].gte(4)) x += "Point#3. Points gain is multiplied based on Ranks. (x" + format(buyableEffect('r',11)[3]) + ")<br>"
        return x
    },
    getBuyableEffect2(){
        let x = ""
        if (player.r.buyables[11].gte(1)) x += "Rank#1. Increase ranks effect based on layers. (^" + format(tmp.r.rankEffectExpBase[0],2) + "<sup>x-1</sup>)<br>"
        if (player.r.buyables[11].gte(2)) x += "Rank#2. Increase ranks effect based on tiers. (^x<sup>" + format(tmp.r.rankEffectExpBase[1],2) + "</sup>)<br>"
        return x
    },
    buyables:{
        11:{
            title(){return "<h2>Rank Reset (" + formatWhole(player.r.buyables[11]) + ")</h2>"},
            cost(){ // points requirement
                return [
                    new Decimal(1e7),
                    new Decimal(2e11),
                    new Decimal(1e17),
                    new Decimal(2e24),
                    new Decimal(2e39),
                    new Decimal(1e53),
                    new Decimal(6e71),
                    new Decimal(1/0),
                ][player.r.buyables[11].toNumber()]
            },
            canAfford(){
                return [
                    player.points.gte(1e7) && player.r.ranks[1][2].gte(5) && player.r.ranks[2][1].gte(9),
                    player.points.gte(2e11) && player.r.ranks[2][1].gte(10) && player.r.ranks[4][1].gte(1),
                    player.points.gte(1e17) && player.r.ranks[1][2].gte(6) && player.r.ranks[2][1].gte(11),
                    player.points.gte(2e24) && player.r.ranks[1][2].gte(7) && player.r.ranks[2][1].gte(13),
                    player.points.gte(2e39) && player.r.ranks[1][1].gte(215) && player.r.ranks[2][1].gte(14),
                    player.points.gte(1e53) && player.r.ranks[1][2].gte(8) && player.r.ranks[3][1].gte(6),
                    player.points.gte(6e71) && player.r.ranks[1][1].gte(400) && player.r.ranks[2][2].gte(4),
                    false
                ][player.r.buyables[11].toNumber()]
            },
            display(){
                let effect = [
                    "Double points gain for every Rank Reset.",
                    "Points gain is multiplied based on itself.",
                    "Point#2 effect is squared.",
                    "Points gain is multiplied based on Ranks.",
                    "Point#3 effect is squared.",
                    "Point#3 effect is raised by 1.5.",
                    "Add 1 to Point#1 effect base.",
                    "???",
                ]
                let effect2 = [
                    "Increase ranks effect based on layers.",
                    "Increase ranks effect based on tiers.",
                    "Rank#1 base is increased by 0.5.",
                    "Rank#2 exponent is increased by 1.",
                    "Rank#1 base is increased by 0.5 again.",
                    "Rank#2 exponent is increased by 0.5.",
                    "Rank#2 exponent is increased by 0.37.",
                    "???",
                ]
                let requirement = [
                    "Tier " + formatWhole(player.r.ranks[1][2]) + "/5<br>Prestige " + formatWhole(player.r.ranks[2][1]) + "/9",
                    "Prestige " + formatWhole(player.r.ranks[2][1]) + "/10<br>Return " + formatWhole(player.r.ranks[4][1]) + "/1",
                    "Tier " + formatWhole(player.r.ranks[1][2]) + "/6<br>Prestige " + formatWhole(player.r.ranks[2][1]) + "/11",
                    "Tier " + formatWhole(player.r.ranks[1][2]) + "/7<br>Prestige " + formatWhole(player.r.ranks[2][1]) + "/13",
                    "Rank " + formatWhole(player.r.ranks[1][1]) + "/215<br>Prestige " + formatWhole(player.r.ranks[2][1]) + "/14",
                    "Tier " + formatWhole(player.r.ranks[1][2]) + "/8<br>Ascension " + formatWhole(player.r.ranks[3][1]) + "/6",
                    "Rank " + formatWhole(player.r.ranks[1][1]) + "/400<br>Honor " + formatWhole(player.r.ranks[2][2]) + "/4",
                    "???"
                ]
                return "<h3>Reset all of your ranks, but points gain and ranks effect are increased.<br><br>" +
                "Point Boost: " + effect[player.r.buyables[11].toNumber()] + "<br>" +
                "Rank Boost: " + effect2[player.r.buyables[11].toNumber()] + "<br><br>" +
                "Requirement:<br>" + format(player.points) + "/" + format(this.cost()) + " points<br>" +
                requirement[player.r.buyables[11].toNumber()] + "</h3>"
            },
            buy(){
                player.r.buyables[11] = player.r.buyables[11].add(1)
                player.r.ranks = tmp.r.startData().ranks
                player.points = new Decimal(0)
                updateTemp()
            },
            purchaseLimit: new Decimal(7),
            effect(){
                let b1 = new Decimal(2)
                if (player.r.buyables[11].gte(7)) b1 = b1.add(1)
                let eff = [
                    null,
                    b1.pow(player.r.buyables[11]),
                    player.points.max(1+1e-15).ssqrt().sqrt(), // 1 could break the game, so I use the number that is just larger than 1
                    player.r.ranks[1][1].add(1).pow(1/3)
                ]
                if (player.r.buyables[11].gte(3)) eff[2] = eff[2].pow(2)
                if (player.r.buyables[11].gte(5)) eff[3] = eff[3].pow(2)
                if (player.r.buyables[11].gte(6)) eff[3] = eff[3].pow(1.5)
                return eff
            },
            unlocked(){return player.ach.achievements.length >= 15},
            style(){return {'width':'300px','height':'300px'}},
        },
    },
    rankEffectExpBase(){
        let b = [new Decimal(1),new Decimal(0)]
        if (player.r.buyables[11].gte(1)) b[0] = b[0].add(0.5)
        if (player.r.buyables[11].gte(3)) b[0] = b[0].add(0.5)
        if (player.r.buyables[11].gte(5)) b[0] = b[0].add(0.5)

        if (player.r.buyables[11].gte(2)) b[1] = b[1].add(1)
        if (player.r.buyables[11].gte(4)) b[1] = b[1].add(1)
        if (player.r.buyables[11].gte(6)) b[1] = b[1].add(0.5)
        if (player.r.buyables[11].gte(7)) b[1] = b[1].add(0.37)

        return b
    },
    clickables:{
        11:{
            title(){return "Rank <h2>" + formatWhole(player.r.ranks[1][1]) + "</h2>"},
            display(){
                return "<h3>Require " + format(this.req()) + " points</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.points.gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',25)){
                    player.r.ranks[1][1] = this.bulk()
                } else {
                    player.r.ranks[1][1] = player.r.ranks[1][1].add(1)
                }
                if (true){
                    resetRanks(1,1)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][1].div(multi)))
            },
            bulk(){
                let res = player.points
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[1][1].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(0)).pow(Decimal.pow(1,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return true},
            style(){return {'width':'180px','height':'180px'}},
        },
        12:{
            title(){return "Tier <h2>" + formatWhole(player.r.ranks[1][2]) + "</h2>"},
            display(){
                return "<h3>Require Rank " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[1][1].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',41)){
                    player.r.ranks[1][2] = this.bulk()
                } else {
                    player.r.ranks[1][2] = player.r.ranks[1][2].add(1)
                }
                if (true){
                    resetRanks(1,2)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][2].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[1][1]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[1][2].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(0)).pow(Decimal.pow(2,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',11)},
            style(){return {'width':'180px','height':'180px'}},
        },
        13:{
            title(){return "Tetr <h2>" + formatWhole(player.r.ranks[1][3]) + "</h2>"},
            display(){
                return "<h3>Require Tier " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[1][2].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',54)){
                    player.r.ranks[1][3] = this.bulk()
                } else {
                    player.r.ranks[1][3] = player.r.ranks[1][3].add(1)
                }
                if (true){
                    resetRanks(1,3)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][3].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[1][2]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[1][3].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(0)).pow(Decimal.pow(3,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',23)},
            style(){return {'width':'180px','height':'180px'}},
        },
        
        21:{
            title(){return "Prestige <h2>" + formatWhole(player.r.ranks[2][1]) + "</h2>"},
            display(){
                return "<h3>Require " + format(this.req()) + " Prestige Base</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return tmp.r.getPrestigeBase.gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',34)){
                    player.r.ranks[2][1] = this.bulk()
                } else {
                    player.r.ranks[2][1] = player.r.ranks[2][1].add(1)
                }
                if (true){
                    resetRanks(2,1)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[2][1].div(multi)))
            },
            bulk(){
                let res = tmp.r.getPrestigeBase
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[2][1].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(1)).pow(Decimal.pow(1,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',13)},
            style(){return {'width':'180px','height':'180px'}},
        },
        22:{
            title(){return "Honor <h2>" + formatWhole(player.r.ranks[2][2]) + "</h2>"},
            display(){
                return "<h3>Require Prestige " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[2][1].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',42)){
                    player.r.ranks[2][2] = this.bulk()
                } else {
                    player.r.ranks[2][2] = player.r.ranks[2][2].add(1)
                }
                if (true){
                    resetRanks(2,2)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[2][2].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[2][1]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[2][2].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(1)).pow(Decimal.pow(2,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',21)},
            style(){return {'width':'180px','height':'180px'}},
        },
        23:{
            title(){return "Glory <h2>" + formatWhole(player.r.ranks[2][3]) + "</h2>"},
            display(){
                return "<h3>Require Honor " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[2][2].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (false){
                    player.r.ranks[2][3] = this.bulk()
                } else {
                    player.r.ranks[2][3] = player.r.ranks[2][3].add(1)
                }
                if (true){
                    resetRanks(2,3)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[2][3].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[2][2]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[2][3].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(1)).pow(Decimal.pow(3,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',33)},
            style(){return {'width':'180px','height':'180px'}},
        },
        
        31:{
            title(){return "Ascension <h2>" + formatWhole(player.r.ranks[3][1]) + "</h2>"},
            display(){
                return "<h3>Require " + format(this.req()) + " Ascension Base</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return tmp.r.getAscensionBase.gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',51)){
                    player.r.ranks[3][1] = this.bulk()
                } else {
                    player.r.ranks[3][1] = player.r.ranks[3][1].add(1)
                }
                if (true){
                    resetRanks(3,1)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[3][1].div(multi)))
            },
            bulk(){
                let res = tmp.r.getAscensionBase
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[3][1].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(2)).pow(Decimal.pow(1,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',24)},
            style(){return {'width':'180px','height':'180px'}},
        },
        32:{
            title(){return "Transcension <h2>" + formatWhole(player.r.ranks[3][2]) + "</h2>"},
            display(){
                return "<h3>Require Ascension " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[3][1].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',44)){
                    player.r.ranks[3][2] = this.bulk()
                } else {
                    player.r.ranks[3][2] = player.r.ranks[3][2].add(1)
                }
                if (true){
                    resetRanks(3,2)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[3][2].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[3][1]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[3][2].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(2)).pow(Decimal.pow(2,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',31)},
            style(){return {'width':'180px','height':'180px'}},
        },
        33:{
            title(){return "Recursion <h2>" + formatWhole(player.r.ranks[3][3]) + "</h2>"},
            display(){
                return "<h3>Require Transcension " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[3][2].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (false){
                    player.r.ranks[3][3] = this.bulk()
                } else {
                    player.r.ranks[3][3] = player.r.ranks[3][3].add(1)
                }
                if (true){
                    resetRanks(3,3)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[3][3].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[3][2]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[3][3].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(2)).pow(Decimal.pow(3,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return false},
            style(){return {'width':'180px','height':'180px'}},
        },
        
        41:{
            title(){return "Return <h2>" + formatWhole(player.r.ranks[4][1]) + "</h2>"},
            display(){
                return "<h3>Require " + format(this.req()) + " Return Base</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return tmp.r.getReturnBase.gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (hasAchievement('ach',55)){
                    player.r.ranks[4][1] = this.bulk()
                } else {
                    player.r.ranks[4][1] = player.r.ranks[4][1].add(1)
                }
                if (true){
                    resetRanks(4,1)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[4][1].div(multi)))
            },
            bulk(){
                let res = tmp.r.getReturnBase
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[4][1].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(3)).pow(Decimal.pow(1,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement('ach',41)},
            style(){return {'width':'180px','height':'180px'}},
        },
        42:{
            title(){return "Reincarnation <h2>" + formatWhole(player.r.ranks[4][2]) + "</h2>"},
            display(){
                return "<h3>Require Return " + formatWhole(this.req()) + "</h3><br>"+
                "<h3>Effect: Points gain x" + format(this.effect()) + "</h3>"
            },
            canClick(){
                return player.r.ranks[4][1].gte(this.req()) && this.unlocked()
            },
            onClick(){
                if (false){
                    player.r.ranks[4][2] = this.bulk()
                } else {
                    player.r.ranks[4][2] = player.r.ranks[4][2].add(1)
                }
                if (true){
                    resetRanks(4,2)
                    player.points = new Decimal(0)
                }
                updateTemp()
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[4][2].div(multi)))
            },
            bulk(){
                let res = player.r.ranks[4][1]
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor()
            },
            effect(){
                let eff = player.r.ranks[4][2].add(1)
                eff = eff.pow(tmp.r.rankEffectExpBase[0].pow(3)).pow(Decimal.pow(2,tmp.r.rankEffectExpBase[1]))
                return eff
            },
            unlocked(){return hasAchievement("ach",51)},
            style(){return {'width':'180px','height':'180px'}},
        },

    },
})

function resetRanks(layer, tier){
    for (let i=layer;i>=1;i--){
        if (i==layer){
            for (let j=tier-1;j>=1;j--){
                player.r.ranks[i][j] = new Decimal(0)
            }
        } else {
            for (let j=player.r.ranks[i].length-1;j>=1;j--){
                player.r.ranks[i][j] = new Decimal(0)
            }
        }
    }
}