addLayer("y", {
    name: "years", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#008000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "years", // Name of prestige currency
    baseResource: "money", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    scalings(){
        let scalings = {scaling1: new Decimal(100), cap: new Decimal(15)}
        return scalings
    },
    getResetGain(){
        let x = this.baseAmount()
        let gain = x.max(1).log(10)
        if (gain.gte(tmp.y.scalings.scaling1)) gain = gain.div(tmp.y.scalings.scaling1).root(2).mul(tmp.y.scalings.scaling1)
        return gain.min(tmp.y.scalings.cap).floor().sub(player[this.layer].points).min(1)
    },
    getNextAt(){
        let x = player[this.layer].points.add(1)
        if (x.sub(1).gt(tmp.y.scalings.cap.sub(1e-10))) return new Decimal(1/0)
        if (x.gte(tmp.y.scalings.scaling1)) x = x.div(tmp.y.scalings.scaling1).pow(2).mul(tmp.y.scalings.scaling1)
        return Decimal.pow(10,x)
    }, // all of the 2 is strength
    canReset(){
        return this.baseAmount().gte(this.getNextAt())
    },
    prestigeButtonText(){return "Warp the time by <b>" + formatWhole(this.getResetGain().max(1)) + "</b> years.<br>Next at <b>" + format(this.getNextAt()) + "</b> money"},
    effect(){
        let b1 = new Decimal(0.1)
        let eff1 = Decimal.pow(b1.add(1),player[this.layer].points)
        return {money: eff1}
    },
    effectDescription(){return " which multiply money generation by " + format(tmp.y.effect.money)},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat:{
        "Upgrades":{
            content:[
                "main-display",
                ["clickable",11],
                "resource-display",
                "blank",
                "buyables",
                "blank",
                "upgrades",
            ]
        },
        "Milestones":{
            content:[
                "main-display",
                ["clickable",11],
                "resource-display",
                "blank",
                "achievements",
            ]
        },
    },
    clickables:{
        11:{
            display(){return tmp.y.prestigeButtonText},
            canClick(){return tmp.y.canReset},
            onClick(){
                player.y.upgrades = []
                let array = [11,12]
                for (let i=0;i<array.length-0.5;i++){
                    setBuyableAmount('y',array[i],new Decimal(0))
                }
                doReset('y')
            },
            style:{
                'width':'180px',
                'height':'120px',
                'border-radius': '25%',
                'border': '4px solid',
                'border-color': 'rgba(0, 0, 0, 0.125)',
            }
        }
    },
    achievements:{
        11:{
            name: "1",
            done(){return player.y.points.gte(1)},
            tooltip(){return "Unlock a new buyable"},
        },
        12:{
            name: "2",
            done(){return player.y.points.gte(2)},
            tooltip(){return "Unlock a new upgrade, add 4 to upgrade 11 effect base"},
        },
        13:{
            name: "3",
            done(){return player.y.points.gte(3)},
            tooltip(){return "Reduce Buyable 11 scaling by 0.5"},
        },
        14:{
            name: "4",
            done(){return player.y.points.gte(4)},
            tooltip(){return "For every 10 Buyable 11 level, double the buyable effect"},
        },
        15:{
            name: "5",
            done(){return player.y.points.gte(5)},
            tooltip(){return "Unlock a new upgrade"},
        },
        21:{
            name: "6",
            done(){return player.y.points.gte(6)},
            tooltip(){return "Unlock a new buyable, reduce Buyable 11 scaling by 0.1"},
        },
        22:{
            name: "7",
            done(){return player.y.points.gte(7)},
            tooltip(){return "Add Upgrade 11 base effect by 0.25 per year, currently: +" + format(this.effect())},
            effect(){return player.y.points.mul(0.25)},
        },
        23:{
            name: "8",
            done(){return player.y.points.gte(8)},
            tooltip(){return "Upgrade 11 effect multiply points gain with reduced effect, currently: x" + format(this.effect())},
            effect(){return upgradeEffect('y',11).max(1).pow(0.1)},
        },
        24:{
            name: "9",
            done(){return player.y.points.gte(9)},
            tooltip(){return "Unlock a Upgrade, multiply points gain based on years, currently: x" + format(this.effect())},
            effect(){return player.y.points.max(1).pow(0.5)},
        },
        25:{
            name: "10",
            done(){return player.y.points.gte(10)},
            tooltip(){return "Add 1 to Upgrade 13 cap"},
        },
        31:{
            name: "11",
            done(){return player.y.points.gte(11)},
            tooltip(){return "Multiplier boost require 10% fewer Buyable 11 level, and the effect is 20% sttronger"},
        },
        32:{
            name: "12",
            done(){return player.y.points.gte(12)},
            tooltip(){return "Add Upgrade 11 base effect by 0.1 and 0.5 Buyable 11 level per Buyable 12 level, currently: +" + format(this.effect()[0]) + ", +" + format(this.effect()[1])},
            effect(){return [getBuyableAmount('y',12).mul(0.1),getBuyableAmount('y',12).mul(0.5)]},
        },
        33:{
            name: "13",
            done(){return player.y.points.gte(13)},
            tooltip(){return "Unlock a new upgrade"},
        },
        34:{
            name: "14",
            done(){return player.y.points.gte(14)},
            tooltip(){return "The hardcap of Upgrade 13 effect become softcap, and Free Level is counted into the effect"},
        },
        35:{
            name: "15",
            done(){return player.y.points.gte(15)},
            tooltip(){return "Unlock coins (WIP)"},
        },
    },
    upgrades:{
        11:{
            fullDisplay(){return "Generate " + format(this.effect()) + " money per second<br><br>Cost: " + formatWhole(this.getCost) + " points"},
            effect(){
                let eff = new Decimal(1)
                if (hasAchievement('y',12)) eff = eff.add(4)
                if (hasAchievement('y',22)) eff = eff.add(achievementEffect('y',22))
                if (hasAchievement('y',32)) eff = eff.add(achievementEffect('y',32)[0])
                if (hasUpgrade('y',13)) eff = eff.pow(upgradeEffect('y',13))

                if (hasUpgrade('y',15)) eff = eff.mul(upgradeEffect('y',15))
                return eff
            },
            getCost: new Decimal(0),
            canAfford(){return player.points.gte(this.getCost)},
            pay(){player.points = player.points.sub(this.getCost)},
            unlocked(){return true},
        },
        12:{
            fullDisplay(){return "Square Buyable 11 base effect<br><br>Cost: " + formatWhole(this.getCost) + " points"},
            effect(){
                let eff = new Decimal(1)
                return eff
            },
            getCost: new Decimal(300),
            canAfford(){return player.points.gte(this.getCost)},
            pay(){player.points = player.points.sub(this.getCost)},
            unlocked(){return hasAchievement('y',12)},
        },
        13:{
            fullDisplay(){return "Raise Upgrade 11 base effect by " + format(this.effect(),3) + " (based on "+(hasAchievement('y',34)?"total ":"non-extra ")+"Buyable 11 level)<br><br>Cost: " + formatWhole(this.getCost) + " points"},
            effect(){
                let amt = getBuyableAmount('y',11)
                if (hasAchievement('y',34)) amt = amt.add(tmp.y.buyables[11].freeLevel)
                let eff = amt.max(1).root(2)
                let cap = new Decimal(7)
                if (hasAchievement('y',25)) cap = cap.add(1)
                let exp = new Decimal(0)
                if (hasAchievement('y',34)) exp = new Decimal(0.5)
                if (eff.gte(cap)) eff = eff.div(cap).pow(exp).mul(cap)
                return eff
            },
            getCost: new Decimal(1e5),
            canAfford(){return player.points.gte(this.getCost)},
            pay(){player.points = player.points.sub(this.getCost)},
            unlocked(){return hasAchievement('y',15)},
        },
        14:{
            fullDisplay(){return "Raise Buyable 12 effect by 1.6<br><br>Cost: " + formatWhole(this.getCost) + " points"},
            getCost: new Decimal(2e9),
            canAfford(){return player.points.gte(this.getCost)},
            pay(){player.points = player.points.sub(this.getCost)},
            unlocked(){return hasAchievement('y',24)},
        },
        15:{
            fullDisplay(){return "Buyable 12 effect affect Upgrade 11 effect with reduced rate, currently: x" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.getCost) + " points"},
            effect(){
                let eff = buyableEffect('y',12).max(1).pow(0.5)
                return eff
            },
            getCost: new Decimal(2e13),
            canAfford(){return player.points.gte(this.getCost)},
            pay(){player.points = player.points.sub(this.getCost)},
            unlocked(){return hasAchievement('y',15)},
        },
    },
    buyables:{
        11:{
            title:"11",
            display(){
                return "Increase money production.<br>" + 
                "Currently: " + format(this.effect()) + "<br><br>" +
                "Cost: " + format(this.cost()) + "<br>" + 
                "Level " + formatWhole(getBuyableAmount(this.layer,this.id)) + (this.freeLevel().gt(0)?" + " + format(this.freeLevel()):"")
            },
            costScaling(){
                let scaling = [new Decimal(10),new Decimal(2),new Decimal(1)]
                if (hasAchievement('y',13)) scaling[1] = scaling[1].sub(0.5)
                if (hasAchievement('y',21)) scaling[1] = scaling[1].sub(0.1)
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            freeLevel(){
                let extra = new Decimal(0)
                if (hasAchievement('y',32)) extra = extra.add(achievementEffect('y',32)[1])
                return extra
            },
            effect(){
                let amt = getBuyableAmount(this.layer,this.id).add(this.freeLevel())
                let eff = amt

                if (hasUpgrade('y',12)) eff = eff.pow(2)
                if (hasAchievement('y',21)) eff = eff.mul(buyableEffect('y',12))

                let multiEff = new Decimal(1)
                let freq = new Decimal(10)

                if (hasAchievement('y',14)) multiEff = new Decimal(2)
                if (hasAchievement('y',31)) multiEff = multiEff.mul(1.2)

                if (hasAchievement('y',31)) freq = freq.sub(1)

                let multi = Decimal.pow(multiEff,amt.add(1e-10).div(freq).floor())

                return eff.mul(multi)
            },
            bulkEnabled(){
                return true
            },
            buy(){
                if (!player.points.gte(this.cost())) return
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                let x = player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1)
                
                return x.sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            unlocked(){return hasAchievement('y',11)}
        },
        12:{
            title:"12",
            display(){
                return "Multiply Buyable 11 effect.<br>" + 
                "Currently: x" + format(this.effect()) + "<br><br>" +
                "Cost: " + format(this.cost()) + "<br>" + 
                "Level " + formatWhole(getBuyableAmount(this.layer,this.id)) + (this.freeLevel().gt(0)?" + " + format(this.freeLevel()):"")
            },
            costScaling(){
                let scaling = [new Decimal(1e4),new Decimal(3),new Decimal(1)]
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            freeLevel(){
                let extra = new Decimal(0)
                return extra
            },
            effect(){
                let amt = getBuyableAmount(this.layer,this.id).add(this.freeLevel())
                let eff = amt.add(1)
                if (hasUpgrade('y',14)) eff = eff.pow(1.6)
                return eff
            },
            bulkEnabled(){
                return true
            },
            buy(){
                if (!player.points.gte(this.cost())) return
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                let x = player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1)
                
                return x.sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            unlocked(){return hasAchievement('y',21)}
        },
    },
})
