addLayer("inf", {
    name(){return "Infinity"}, // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#ffff00",
    requires: new Decimal(2).pow(1024), // Can be a function that takes requirement increases into account
    resource(){return "Infinity Points"}, // Name of prestige currency
    baseResource(){return modInfo.pointsName}, // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/1024,
    gainMult(){
        let mult = new Decimal(1)
        return mult
    },
    gainExp(){
        let exp = new Decimal(1)
        return exp
    },
    effect(){
        let eff = player.inf.total.max(0).add(1)
        if (hasChallenge('inf',42)) eff = eff.pow(1.5)
        return eff
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["am"],
    layerShown(){return getBuyableAmount('am', 23).gte(3) || player.inf.unlocked},
    hotkeys:[
        {
            key: "i",
            description: "i: reset for Infinity Points",
            onPress(){if (canReset(this.layer)) doReset(this.layer)}
        }
    ],
    tabFormat:{
        "Upgrades":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text",function(){return "Your total Infinity Points multiply base " + modInfo.pointsName + " production by <b style='color: yellow'>" + format(tmp.inf.effect) + "</b> "}],
                "blank",["display-text",function(){return "You need previous Infinity upgrade in that column to bought the next Infinity upgrade"}],
                "upgrades"
            ],
            unlocked(){return true},
        },
        "Challenges":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text",function(){return "Your total Infinity Points multiply base " + modInfo.pointsName + " production by <b style='color: yellow'>" + format(tmp.inf.effect) + "</b>"}],
                "blank",["display-text",function(){return "You don't have to complete Challenges in order<br>Each completion multiply base " + modInfo.pointsName + " production by 2"}],
                "challenges"
            ],
            unlocked(){return hasUpgrade('inf',13)},
        },
        "Milestones":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text",function(){return "Your total Infinity Points multiply base " + modInfo.pointsName + " production by <b style='color: yellow'>" + format(tmp.inf.effect) + "</b>"}],
                "blank",
                "milestones"
            ],
            unlocked(){return hasUpgrade('inf',13)},
        },
    },
    update(diff){

    },
    automate(){
        if (tmp.auto.clickables.infReset.canRun && true) doReset('inf') // nothing to toggle yet, the true will be turned to something later, only reset when possible
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row>this.row){
            let keep = []
            layerDataReset(this.layer, keep)
        }
    },
    upgrades:{
        11:{
            title: "inf11",
            description(){return modInfo.pointsName + " exponent multiply base " + modInfo.pointsName + " production"},
            cost: new Decimal(2),
            effect(){
                let eff = tmp.am.getAMExp.max(1)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            unlocked(){return true},
            canAfford(){return true},
        },
        12:{
            title: "inf12",
            description(){return "Producer increase " + modInfo.pointsName + " exponent"},
            cost: new Decimal(3),
            effect(){
                let eff = getBuyableAmount('am',11).max(0).pow(0.4).div(37.5)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect(), 3)},
            unlocked(){return true},
            canAfford(){return true},
        },
        13:{
            title: "inf13",
            description(){return "<b>AM Exp</b> buyable is always show, unlock Challenges"},
            cost: new Decimal(89),
            unlocked(){return true},
            canAfford(){return true},
        },
        21:{
            title: "inf21",
            description(){return "Infinity time multiply base " + modInfo.pointsName + " production"},
            cost: new Decimal(5),
            effect(){
                let eff = new Decimal(player.inf.resetTime).max(1).root(4)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',11)},
        },
        22:{
            title: "inf22",
            description(){return "Condenser increase " + modInfo.pointsName + " exponent"},
            cost: new Decimal(8),
            effect(){
                let eff = getBuyableAmount('am',22).max(0).pow(0.6).div(24)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect(), 3)},
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',12)},
        },
        23:{
            title: "inf23",
            description(){return "<b>Multiplier</b> buyable is always show"},
            cost: new Decimal(144),
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',13)},
        },
        31:{
            title: "inf31",
            description(){return "For every Producer Level, multiply base " + modInfo.pointsName + " producion by " + format(tmp.inf.upgrades[31].effectBase, 3)},
            cost: new Decimal(13),
            effectBase(){
                let b = new Decimal(1.025)
                if (hasChallenge('inf',41)) b = b.add(0.01)
                return b
            },
            effect(){
                let eff = tmp.inf.upgrades[31].effectBase.pow(getBuyableAmount('am',11))
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',21)},
        },
        32:{
            title: "inf32",
            description(){return "<b>AM Exp</b> effect is better (^0.5 -> ^0.505)"},
            cost: new Decimal(21),
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',22)},
        },
        33:{
            title: "inf33",
            description(){return "<b>Producer Exp</b> buyable is always show"},
            cost: new Decimal(233),
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',23)},
        },
        41:{
            title: "inf41",
            description(){return "Achievement completions multiply base " + modInfo.pointsName + " production"},
            cost: new Decimal(34),
            effect(){
                let b = new Decimal(1.3)
                let eff = b.pow(player.ach.achievements.length)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',31)},
        },
        42:{
            title: "inf42",
            description(){return "Best " + modInfo.pointsName + " increase " + modInfo.pointsName + " exponent"},
            cost: new Decimal(55),
            effect(){
                let eff = player.bestAM.max(2).log(2).log(2).pow(0.5).div(20)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect(), 3)},
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',32)},
        },
        43:{
            title: "inf43",
            description(){return "<b>Condenser</b> and <b>Multiplier Boost</b> buyable are always show"},
            cost: new Decimal(377),
            unlocked(){return true},
            canAfford(){return hasUpgrade('inf',33)},
        },
    },
    milestones:{
        1:{
            requirementDescription: "1 Challenge Completion",
            effectDescription: "Unlock autobuyer for <b>Producer</b>",
            done(){return tmp.inf.totalComp>=1}
        },
        2:{
            requirementDescription: "2 Challenge Completions",
            effectDescription: "Unlock autobuyer for <b>AM Exp</b>",
            done(){return tmp.inf.totalComp>=2}
        },
        3:{
            requirementDescription: "3 Challenge Completions",
            effectDescription: "Unlock autobuyer for <b>Multiplier</b>",
            done(){return tmp.inf.totalComp>=3}
        },
        4:{
            requirementDescription: "4 Challenge Completions",
            effectDescription: "Unlock autobuyer for <b>Producer Exp</b>",
            done(){return tmp.inf.totalComp>=4}
        },
        5:{
            requirementDescription: "5 Challenge Completions",
            effectDescription: "Unlock autobuyer for <b>Condenser</b>",
            done(){return tmp.inf.totalComp>=5}
        },
        6:{
            requirementDescription: "6 Challenge Completions",
            effectDescription: "Unlock autobuyer for <b>Multiplier Boost</b>",
            done(){return tmp.inf.totalComp>=6}
        },
        7:{
            requirementDescription: "7 Challenge Completions",
            effectDescription: "Unlock autobuyer for Infinity reset",
            done(){return tmp.inf.totalComp>=7}
        },
        8:{
            requirementDescription: "8 Challenge Completions",
            effectDescription(){return "Buying " + modInfo.pointsName + " buyables no longer cost anything"},
            done(){return tmp.inf.totalComp>=8}
        },
    },
    totalComp(){
        let comp = 0
        for (let i=1;i<=4;i++){
            for (let j=1;j<=2;j++){
                comp = comp+player.inf.challenges[i*10+j]
            }
        }
        return comp
    },
    challenges:{
        11:{
            name: "Hardened Producer",
            challengeDescription(){return "You can only bought up to 1 Producers"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Producer scaling is weaker (-0.1 to scaling exp)"
        },
        12:{
            name: "Reduced Exponent",
            challengeDescription(){return modInfo.pointsName + " exponent is rooted by 1.24 or divided by 1.5, whenever which is lower"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Multiply AM Exp by 1.05"
        },
        21:{
            name: "Weakened Multiplier",
            challengeDescription(){return "Multiplier level amount to effect is rooted by 1.4"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Multiplier base is multiplied 1.1"
        },
        22:{
            name: "Reduced Producer",
            challengeDescription(){return "The exponent of Producer effect is rooted by 1.6 and divided by 2"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Producer exp is stronger (^0.5 -> ^0.53)"
        },
        31:{
            name: "Anti-Condenser",
            challengeDescription(){return "Condenser effect exponent become -0.7*level, the autobuyer will be forced to be active even when locked, Condenser at Level 10+ gives 20x base " + modInfo.pointsName + " production"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Condenser level amount to effect is multiplied 1.5"
        },
        32:{
            name: "Multiplier Anti-Boost",
            challengeDescription(){return "Multiplier Boost have no effect, Multiplier effect is square rooted"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Each Multiplier Boost gives 2 free Multiplier Levels"
        },
        41:{
            name: "Weakened Buyables",
            challengeDescription(){return "All Buyables will only have 71% of amount taken into effect"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "inf31 base is increased by 0.01",
            nerf: 0.71
        },
        42:{
            name: "Reduced production",
            challengeDescription(){return "Base " + modInfo.pointsName + " production is rooted by 1.65 or divided by 1e6, whenever which is lower"},
            goalDescription(){return format(Decimal.pow(2,1024)) + " " + modInfo.pointsName},
            canComplete(){return player.points.gte(Decimal.pow(2,1024))},
            rewardDescription: "Base AM production from IP ^1.5"
        },
    },
})