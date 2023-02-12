addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "#ffff00",
    tooltip(){return "Achievements"},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
        ["display-text",function(){return "You have completed <h2 style='color: yellow'>" + formatWhole(player.ach.achievements.length) + "</h2> achievements"}],
        ["blank","34px"],"achievements"
    ],
    achievements:{
        11:{
            name: "Muscler",
            tooltip(){return "Purchase first " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',11).gte(1)},
        },
        12:{
            name: "Is that Antimatter Dimension reference?",
            tooltip(){return "Purchase second " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',12).gte(1)},
        },
        13:{
            name: "Antimatter Amplifier",
            tooltip(){return "Purchase third " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',13).gte(1)},
        },
        14:{
            name: "Stronger",
            tooltip(){return "Purchase fourth " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',21).gte(1)},
        },
        15:{
            name: "Self Boost",
            tooltip(){return "Purchase fifth " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',22).gte(1)},
        },
        16:{
            name: "Antimatter Intensifier",
            tooltip(){return "Purchase sixth " + modInfo.pointsName + " buyable"},
            done(){return getBuyableAmount('am',23).gte(1)},
        },
        21:{
            name: "To Infinity!",
            tooltip(){return "Perform an Infinity Reset<br><i>Reward: Unlock Buy Max for Antimatter Buyables</i>"},
            done(){return player.inf.total.gte(1)},
        },
        22:{
            name: "5 hours till the update",
            tooltip(){return "Play for 5 hours"},
            done(){return player.timePlayed >= 18000},
        },
        23:{
            name: "The 9th Dimension is a lie",
            tooltip(){return "Reach 8 " + modInfo.pointsName + " Exponent"},
            done(){return tmp.am.getAMExp.gte(8)},
        },
        24:{
            name: "Challenged",
            tooltip(){return "Complete a Challenge"},
            done(){return tmp.inf.totalComp >= 1},
        },
        25:{
            name: "The 9th Challenge is a lie",
            tooltip(){return "Complete 8 Challenges"},
            done(){return tmp.inf.totalComp >= 8},
        },
        26:{
            name: "Upgraded",
            tooltip(){return "Bought 12 Infinity Upgrades"},
            done(){return player.inf.upgrades.length >= 12},
        },
    },
})

addLayer("auto", {
    name: "autobuyers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        am:{
            am11: false,
            am12: false,
            am13: false,
            am21: false,
            am22: false,
            am23: false,
        },
        inf:{
            infReset: false
        }
    }},
    color: "#ffff00",
    tooltip(){return "Autobuyers"},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade('inf',13)},
    tabFormat:[
        ["display-text",function(){return "<h2>Antimatter</h2>"}],
        ["row",[["clickable","am11"],["clickable","am12"],["clickable","am13"],["clickable","am21"],["clickable","am22"],["clickable","am23"],]],
        "blank",
        ["display-text",function(){return "<h2>Infinity</h2>"}],
        ["row",[["clickable","infReset"],]],
        "blank",
    ],
    clickables:{
        am11:{
            set: "am",
            title: "Producer",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',1)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am12:{
            set: "am",
            title: "AM Exp",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',2)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am13:{
            set: "am",
            title: "Multiplier",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',3)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am21:{
            set: "am",
            title: "Producer Exp",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',4)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am22:{
            set: "am",
            title: "Condenser",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',5)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',31)) return true
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am23:{
            set: "am",
            title: "Multiplier Boost",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',6)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        infReset:{
            set: "inf",
            title: "Infinity Reset",
            display(){return Boolean(player.auto[this.set][this.id])},
            canClick(){return hasMilestone('inf',7)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "yellow"}
                else return {"background-color": "#BF8F8F"}
            },
        },
    },
})