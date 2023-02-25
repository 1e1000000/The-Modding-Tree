addLayer("stat", {
    name: "statistics", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "#ffffff",
    tooltip(){return "Statistics"},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:{
        "Main":{
            content:[
                ["display-text",function(){return getStatTab()}]
            ]
        },
        "Really Antimatter Dimensions":{
            content:[
                ["display-text",function(){return getDimensionsDisplay(player.points,tmp.am.getAMProd,tmp.am.getAMExp)}]
            ]
        },
    },
})

addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "gold",
    tooltip(){return "Achievements"},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
        ["display-text",function(){return "You have completed <h2 style='color: gold'>" + formatWhole(player.ach.achievements.length) + "</h2> achievements"}],
        ["blank","34px"],"achievements"
    ],
    achievements:{
        11:{
            name: "Muscler",
            tooltip(){return "Purchase first antimatter buyable"},
            done(){return getBuyableAmount('am',11).gte(1)},
        },
        12:{
            name: "Is that Antimatter Dimension reference?",
            tooltip(){return "Purchase second antimatter buyable"},
            done(){return getBuyableAmount('am',12).gte(1)},
        },
        13:{
            name: "Antimatter Amplifier",
            tooltip(){return "Purchase third antimatter buyable"},
            done(){return getBuyableAmount('am',13).gte(1)},
        },
        14:{
            name: "Stronger",
            tooltip(){return "Purchase fourth antimatter buyable"},
            done(){return getBuyableAmount('am',21).gte(1)},
        },
        15:{
            name: "Self Boost",
            tooltip(){return "Purchase fifth antimatter buyable"},
            done(){return getBuyableAmount('am',22).gte(1)},
        },
        16:{
            name: "Antimatter Intensifier",
            tooltip(){return "Purchase sixth antimatter buyable"},
            done(){return getBuyableAmount('am',23).gte(1)},
        },
        21:{
            name: "To Infinity!",
            tooltip(){return "Perform an Infinity Reset<br><i>Reward: Unlock Buy Max for Antimatter Buyables, you can also perform Infinity reset on Antimatter node</i>"},
            done(){return player.inf.total.gte(1)},
        },
        22:{
            name: "5 hours till the update",
            tooltip(){return "Play for 5 hours"},
            done(){return player.timePlayed >= 18000},
        },
        23:{
            name: "9th Dimension?",
            tooltip(){return "Reach 8 antimatter Exponent"},
            done(){return tmp.am.getAMExp.gt(8)},
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
        31:{
            name: "Limit Break",
            tooltip(){return "Break Infinity<br><i>Reward: Unlock IP multiplier Buyable</i>"},
            done(){return player.inf.break},
        },
        32:{
            name: "New Dimensions?",
            tooltip(){return "Begin the generation of Infinity Power"},
            done(){return getBuyableAmount('inf',21).gte(1)},
        },
        33:{
            name: "New Buyable?",
            tooltip(){return "Purchase seventh antimatter buyable<br><i>Reward: Unlock autobuyer for this Buyable</i>"},
            done(){return getBuyableAmount('am',31).gte(1)},
        },
        34:{
            name: "Another Amplifier?",
            tooltip(){return "Purchase third Infinity Power buyable<br>"},
            done(){return getBuyableAmount('inf',23).gte(1)},
        },
        35:{
            name: "How this boost can even be a thing?",
            tooltip(){return "Purchase eighth antimatter buyable<br><i>Reward: Unlock autobuyer for this Buyable</i>"},
            done(){return getBuyableAmount('am',32).gte(1)},
        },
        36:{
            name: "That's a lot of Infinity",
            tooltip(){return "Reach " + format(1e10) + " Infinity Points<br><i>Reward: Unlock a new challenge</i>"},
            done(){return player.inf.points.gte(1e10)},
        },
        41:{
            name: "Infinitely Challenging",
            tooltip(){return "Complete Infinity Challenge 1 once"},
            done(){return challengeCompletions('inf',51)>=1},
        },
        42:{
            name: "Can't hold all these Infinites",
            tooltip(){return "Reach " + format(Decimal.pow(2,1024)) + " base antimatter production per second"},
            done(){return tmp.am.getAMProd.gte(Decimal.pow(2,1024))},
        },
        43:{
            name: "Truely Infinitely Challenging",
            tooltip(){return "Complete Infinity Challenge 1 8 times"},
            done(){return challengeCompletions('inf',51)>=8},
        },
        44:{
            name: "1 hour of writing",
            tooltip(){return "Reach 1000...0000 (10,799 zeroes) "+ "antimatter"},
            done(){return player.points.gte("1e10799")},
        },
        45:{
            name: "Stacked Boost?",
            tooltip(){return "Purchase ninth antimatter buyable<br><i>Reward: Unlock autobuyer for this Buyable</i>"},
            done(){return getBuyableAmount('am',33).gte(1)},
        },
        46:{
            name: "Producer is OP",
            tooltip(){return "Reach " + format(Decimal.pow(2,2048)) + " antimatter with only Producer buyable<br><i>Reward: Normal Producer multiply base Infinity Power production (" + format(achievementEffect(this.layer,this.id)) + "x)</i>"},
            done(){return player.points.gte(Decimal.pow(2,2048)) && tmp.am.totalLevel.eq(getBuyableAmount('am',11))},
            effect(){return getBuyableAmount('am',11).add(2).log(2).pow(1/3)},
        },
    },
})

addLayer("auto", {
    name: "autobuyers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        am:{
            am11: false,
            am12: false,
            am13: false,
            am21: false,
            am22: false,
            am23: false,
            am31: false,
            am32: false,
            am33: false,
        },
        inf:{
            infReset: false,
            infResetDynamic: true,
        },
        infResetOpt: new Decimal(1),
    }},
    color: "#ffff3f",
    tooltip(){return "Autobuyers"},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.inf.unlocked},
    tabFormat:[
        ["display-text",function(){return "<h2>Antimatter</h2>"}],
        ["row",[["clickable","am11"],["clickable","am12"],["clickable","am13"],["clickable","am21"],["clickable","am22"],]],
        ["row",[["clickable","am23"],["clickable","am31"],["clickable","am32"],["clickable","am33"],]],
        "blank",
        ["display-text",function(){return "<h2>Infinity</h2>"}],
        ["row",[["column",[["clickable","infReset"], function(){return player.inf.break?["text-input","infResetOpt"]:[]}]],["clickable","infResetDynamic"]]],
        "blank",
    ],
    clickables:{
        am11:{
            set: "am",
            title: "Producer",
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',1)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
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
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',2)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
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
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',3)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
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
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',4)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
                if (inChallenge('inf',51)) return true
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
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',5)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
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
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasMilestone('inf',6)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return true},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am31:{
            set: "am",
            title: "Exponent",
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasAchievement('ach',33)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return player.inf.break},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am32:{
            set: "am",
            title: "Exp Condenser",
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasAchievement('ach',35)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return player.inf.break},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        am33:{
            set: "am",
            title: "Multiplier Superboost",
            display(){return Boolean(player.auto[this.set][this.id])?"On":"Off"},
            canClick(){return hasAchievement('ach',45)},
            onClick(){
                player.auto[this.set][this.id] = Boolean(1-player.auto[this.set][this.id])
            },
            canRun(){
                if (inChallenge('inf',71)) return false
                return player.auto[this.set][this.id] && tmp.auto.clickables[this.id].canClick
            },
            unlocked(){return player.inf.break},
            style(){
                if (this.canClick()) return {"background-color": "red"}
                else return {"background-color": "#BF8F8F"}
            },
        },
        infReset:{
            set: "inf",
            title: "Infinity Reset",
            display(){
                let a = "reset when it is possible"
                if (player.inf.break) a = "reset when you can get " + formatWhole(player.auto.infResetOpt) + " IP on reset"
                return Boolean(player.auto[this.set][this.id]) ? ("On, " + a)  :"Off"
            },
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
        infResetDynamic:{
            set: "inf",
            title: "Infinity Reset Option",
            display(){
                let a = "Double requirement when bought IP multiplier: "
                return a + (Boolean(player.auto[this.set][this.id]) ? "On" :"Off")
            },
            canClick(){return hasAchievement('ach',31) && hasMilestone('inf',7)},
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

function getRepresentation(res = player.points){
    res = new Decimal(res)

    var pLcube = new Decimal(4.22419e-105)
    let time = res.log10().floor().add(1).div(3)
    let yrs = time.div(31556952)

    let p = "Your antimatter is making up " + (res.gte(pLcube.mul(Decimal.pow(2,1024)))?"":"with a size of ")
    if (res.gte("1e10799")) p = "If you " + (yrs.gte(new Date().getFullYear()) && yrs.lte(1.38e8)?"wanted to finish writing":"write") + " your antimatter amount at a rate of 3 digits per second, you would "
    let s 

    if (res.gte("1e10799")){
        if (yrs.gte(1.38e10)) s = "span " + format(yrs.div(1.38e10), 3) + "x the age of the universe"
        else if (yrs.gte(1.38e8)) s = "span " + format(yrs.div(1.38e8), 3) + "% of the age of the universe"
        else if (yrs.gte(new Date().getFullYear())) s = "need to start it in " + formatWhole(yrs.sub(new Date().getFullYear())) + " BCE"
        else if (yrs.gte(79.3)) s = "be a ghost for " + format(yrs.sub(79.3).div(yrs).mul(100), 3) + "% of the session"
        else if (yrs.gte(7.93)) s = "waste " + format(yrs.div(0.793), 3) + "% of your projected average lifespan"
        else s = "take " + formatTime(time, true) + " to write it"
    } else {
        if (res.gte(pLcube.recip().mul(Decimal.pow(2,1024)))) s = format(res.mul(pLcube).div(Decimal.pow(2,1024))) + " Infinity Dimensions"
        else if (res.gte(pLcube.recip().mul(3.4e80))) s = format(res.mul(pLcube).div(3.4e80)) + " observable universes"
        else if (res.gte(pLcube.recip())) s = format(res.mul(pLcube)) + "m<sup>3</sup>"
        else s = format(res) + "pL<sup>3</sup>"
    }
    return p+s
}

function getStatTab(){
    let br = "<br>"
    let x = "<h2 style='color: red'>Antimatter</h2>"
    x += br
    x += "You have " + format(player.points) + " antimatter"
    x += br
    x += "Your best antimatter was " + format(player.bestAM)
    x += br
    if (player.inf.unlocked){
        x += br
        x += "<h2 style='color: yellow'>Infinity</h2>"
        x += br
        x += "You have " + formatWhole(player.inf.points) + " Infinity Points (" + formatWhole(player.inf.total) + " total)"
        x += br
        x += "You have spent " + formatTime(player.inf.resetTime, true) + " in this Infinity"
        x += br
    }
    x += br
    x += "<h2>Main</h2>"
    x += br
    x += "You have played for " + formatTime(player.timePlayed, true)
    x += br
    x += getRepresentation(player.points)

    return x
}

function getDimensionsDisplay(res,prod,exp){
    res = new Decimal(res)
    prod = new Decimal(prod)
    exp = new Decimal(exp)
    let dims = exp.ceil().max(1)
    let opt = "You have <h2>" + format(res) + "</h2> antimatter<br><br>"
    if(dims.lte(8)){
        for (let i = new Decimal(1); i.lte(dims); i = i.add(1)){
            if (i.gte(exp)) opt += "<h2>" + ordNum(i) + " Antimatter Dimension</h2> x" + format(prod.pow(exp.sub(i).add(1))) + ": " + format(1) + "<br><br>"
            else opt += "<h2>" + ordNum(i) + " Antimatter Dimension</h2> x" + format(prod) + ": " + format(res.root(exp).pow(exp.sub(i))) + "<br><br>"
        }
    } else {
        for (let i = new Decimal(1); i.lte(3); i = i.add(1)){
            opt += "<h2>" + ordNum(i) + " Antimatter Dimension</h2> x" + format(prod) + ": " + format(res.root(exp).pow(exp.sub(i))) + "<br><br>"
        }
        opt += "...<br>"
        for (let i = new Decimal(3); i.gte(0); i = i.sub(1)){
            if (i.eq(0)) opt += "<h2>" + ordNum(dims) + " Antimatter Dimension</h2> x" + format(prod.pow(exp.sub(dims).add(1))) + ": " + format(1) + "<br><br>"
            else opt += "<h2>" + ordNum(dims.sub(i)) + " Antimatter Dimension</h2> x" + format(prod) + ": " + format(res.root(exp).pow(exp.sub(dims).add(i))) + "<br><br>"
        }
    }
    return opt
}

function ordNum(num){
    num = new Decimal(num)
    let div100 = num.div(100)
    let mod100 = Math.round(div100.sub(div100.floor()).mul(100).toNumber())
    let ord = ""
    if (Math.floor(mod100 / 10) == 1 || num.gte(1e9)) ord = "th"
    else {
        switch(mod100%10){
            case 1:
                ord = "st"
                break;
            case 2:
                ord = "nd"
                break;
            case 3:
                ord = "rd"
                break;
            default:
                ord = "th"
        }
    }
    return formatWhole(num) + ord
}
