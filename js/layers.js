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
    },
})

addLayer("am", {
    name: "antimatter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "#ff0000",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "antimatter", // Name of prestige currency
    baseResource: "antimatter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    tooltip(){return format(player.points) + " antimatter^" + format(tmp.am.getAMExp)},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
        ["display-text",function(){return "You have <h2 style='color: red'>" + format(player.points) + "</h2> antimatter<sup>" + format(tmp.am.getAMExp) + "</sup>"}],
        ["display-text",function(){return "You have <b style='color: red'>" + format(player.points.root(tmp.am.getAMExp)) + "</b> antimatter before exp (+" + format(tmp.am.getAMProd) + "/s)"}],
        ["bar","progressBar"],
        "blank","buyables"
    ],
    update(diff){
        player.points = player.points.root(tmp.am.getAMExp).add(tmp.am.getAMProd.mul(diff)).pow(tmp.am.getAMExp).min(Decimal.pow(2,1024))
    },
    getAMProd(){
        let prod = buyableEffect('am', 11)
        prod = prod.mul(buyableEffect('am', 13))
        prod = prod.mul(buyableEffect('am', 22))
        return prod
    },
    getAMExp(){
        let exp = buyableEffect('am', 12)
        return exp
    },
    buyables:{
        11:{
            title: "Producer",
            costScaling(){
                let scaling = [new Decimal(1),new Decimal(2),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Produce antimatter<br>Currently: +" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = amount
                eff = eff.pow(buyableEffect('am', 21))
                return eff
            },
            unlocked(){return true},
        },
        12:{
            title: "AM Exp",
            costScaling(){
                let scaling = [new Decimal(100),new Decimal(5),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Increase antimatter exponent<br>Currently: +" + format(buyableEffect(this.layer,this.id).sub(1))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = amount.add(1).pow(0.5)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 11).gte(4)},
        },
        13:{
            title: "Multiplier",
            costScaling(){
                let scaling = [new Decimal(1e6),new Decimal(10),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Multiply base antimatter production<br>Currently: x" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let b = new Decimal(2).add(buyableEffect('am', 23))
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = Decimal.pow(b,amount)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 12).gte(4)},
        },
        21:{
            title: "Producer Exp",
            costScaling(){
                let scaling = [new Decimal(1e9),new Decimal(20),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Increase <b>Producer</b> exponent<br>Currently: ^" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = amount.add(1).pow(0.5)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 13).gte(3)},
        },
        22:{
            title: "Condenser",
            costScaling(){
                let scaling = [new Decimal(1e30),new Decimal(1e10),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Multiply base antimatter production based on antimatter<br>Currently: x" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = Decimal.pow(player.points.max(10).log10(),amount.root(2))
                return eff
            },
            unlocked(){return getBuyableAmount('am', 21).gte(7)},
        },
        23:{
            title: "Multiplier Boost",
            costScaling(){
                let scaling = [new Decimal(1e135),new Decimal(1e25),new Decimal(2)] // base cost, cost scaling, scaling exp
                return scaling
            },
            cost(x){
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost())
            },
            buy(){
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
            },
            bulk(){
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(getBuyableAmount(this.layer,this.id)).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            display() {return "Increase <b>Multiplier</b> base<br>Currently: +" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " antimatter<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let amount = x.mul(strength)
                let eff = amount.mul(0.16)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 22).gte(5)},
        },
    },
    bars: {
        progressBar: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress(){return player.points.max(1).log2().div(1024)},
            display(){return "Percentage to Infinity: " + format(this.progress().mul(100),3) + "% (ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,Decimal.pow(2,1024),tmp.am.getAMExp)) + ")"},
            fillStyle(){return {"background-color": "green"}},
        },
    },
})

function getAMUpgETA(curr, prod, goal, exp=new Decimal(1)){
    curr = new Decimal(curr)
    prod = new Decimal(prod)
    goal = new Decimal(goal)
    let currRT = curr.root(exp)
    let goalRT = goal.root(exp)
    let t = goalRT.sub(currRT).div(prod)
    return t.max(0)
}