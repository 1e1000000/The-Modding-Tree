addLayer("p", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "pt", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    color: "#4BDC13",
    resource: "points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip(){return format(player.points) + " points"},
    update(diff){
        player.points = player.points.min(Decimal.pow(2,1024))
    },
    tabFormat:[
        ["display-text",function(){return `You have <h2 style="color:#4bdc13">` + format(player.points) + `</h2> points`}],
            "blank","blank","buyables","blank","upgrades"
        ],
    buyables:{
        11:{
            title: "Point Producer",
            unlocked(){return true},
            costScaling(){
                let scaling = [new Decimal(5),new Decimal(1.0727),new Decimal(1)]
                if (IPreached(2)) scaling[1] = scaling[1].pow(1.5)
                if (hasUpgrade('p',24)) scaling[0] = scaling[0].div(upgradeEffect('p',24))
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            multiBoost(){
                let eff = [new Decimal(2),new Decimal(10)]
                if (IPreached(1)) eff[1] = eff[1].div(0.4)
                if (hasUpgrade('p',11)) eff[0] = eff[0].add(upgradeEffect('p',11))
                if (hasUpgrade('p',21)) eff[1] = eff[1].mul(upgradeEffect('p',21))
                return eff
            },
            effect(x){
                let level = new Decimal(x)

                let eff = new Decimal(x)
                if (IPreached(1)) eff = eff.pow(buyableEffect("p",12).add(1))
                let boostCount = level.add(1e-10).div(this.multiBoost()[1]).floor()
                //if (IPreached(3) && boostCount.gte(120)) boostCount = boostCount.div(120).pow(0.8).mul(120)
                eff = eff.mul(Decimal.pow(this.multiBoost()[0],boostCount))
                return eff
            },
            bulkEnabled(){
                return true
            },
            buy(){
                if (this.bulkEnabled()) return this.buyMax()
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            display(){
                return `Produce ` + format(Decimal.pow(this.multiBoost()[0],getBuyableAmount(this.layer,this.id).add(1e-10).div(this.multiBoost()[1]).floor())) + ` point per second.<br>` + 
                `Currently: +` + format(buyableEffect(this.layer,this.id)) + `/s<br><br>` + 
                `Cost: ` + format(this.cost()) + ` points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` levels)` : ``) + `<br>` + 
                `Level ` + formatWhole(getBuyableAmount(this.layer,this.id)) + `. (Next boost at Level ` + formatWhole(getBuyableAmount(this.layer,this.id).add(1e-10).div(this.multiBoost()[1]).ceil().mul(this.multiBoost()[1])) + `)`
            },
            style: {'width':'150px','height':'150px'}
        },
        12:{
            title: "Producer Exponent",
            unlocked(){return IPreached(1)},
            costScaling(){
                let scaling = [new Decimal(1e5),new Decimal(100),new Decimal(1.1145)]
                if (IPreached(3)) scaling[0] = scaling[0].div(buyableEffect("p",14))
                if (IPreached(2)) scaling[0] = scaling[0].div(2)
                if (IPreached(2)) scaling[1] = scaling[1].pow(1.5)
                if (atIP(2)) scaling[2] = new Decimal(1)
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            effectBase(){
                let base = new Decimal(0.5)
                if (IPreached(2)) base = base.mul(2)
                if (hasUpgrade('p',12)) base = base.mul(upgradeEffect('p',12))
                return base
            },
            effect(x){
                let level = new Decimal(x)
                if (hasUpgrade('p',22)) level = level.add(upgradeEffect('p',22))

                let eff = level.mul(this.effectBase())
                if (IPreached(2)) eff = eff.pow(0.8)
                if (IPreached(3)) eff = eff.pow(0.8)
                return eff
            },
            bulkEnabled(){
                return false
            },
            buy(){
                if (this.bulkEnabled()) return this.buyMax()
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            display(){
                return `Add ` + format(this.effectBase()) + ` to 'Point Producer' base production exp.<br>` + 
                `Currently: +` + format(buyableEffect(this.layer,this.id)) + `<br><br>` + 
                `Cost: ` + format(this.cost()) + ` points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` levels)` : ``) + `<br>` + 
                `Level ` + formatWhole(getBuyableAmount(this.layer,this.id)) + `.`
            },
            style: {'width':'150px','height':'150px'},
        },
        13:{
            title: "Point Condenser",
            unlocked(){return IPreached(2)},
            costScaling(){
                let scaling = [new Decimal(1e13),new Decimal(1e12),new Decimal(1.12)]
                if (IPreached(3)) scaling[0] = scaling[0].div(buyableEffect("p",14))
                if (hasUpgrade('p',13)) scaling[1] = scaling[1].pow(upgradeEffect('p',13))
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            effectBase(){
                let base = player.points.max(10).log(10)
                if (IPreached(3)) base = base.pow(0.65)
                if (hasUpgrade('p',23)) base = base.pow(upgradeEffect('p',23))
                return base
            },
            effect(x){
                let level = new Decimal(x)
                let eff = this.effectBase().pow(level)
                return eff
            },
            bulkEnabled(){
                return false
            },
            buy(){
                if (this.bulkEnabled()) return this.buyMax()
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            display(){
                return `Multiply points gain by ` + format(this.effectBase()) + `. (based on points)<br>` + 
                `Currently: ` + format(buyableEffect(this.layer,this.id)) + `x<br><br>` + 
                `Cost: ` + format(this.cost()) + ` points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` levels)` : ``) + `<br>` + 
                `Level ` + formatWhole(getBuyableAmount(this.layer,this.id)) + `.`
            },
            style: {'width':'150px','height':'150px'},
        },
        14:{
            title: "Cost Divider",
            unlocked(){return IPreached(3)},
            costScaling(){
                let scaling = [new Decimal(1e16),new Decimal(200),new Decimal(1.62)]
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            effectBase(){
                let base = getBuyableAmount('p',11).add(1)
                return base
            },
            effect(x){
                let level = new Decimal(x)
                let eff = this.effectBase().pow(level)
                return eff
            },
            bulkEnabled(){
                return false
            },
            buy(){
                if (this.bulkEnabled()) return this.buyMax()
                player.points = player.points.sub(this.cost())
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                let bulk = this.bulk()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            display(){
                return `Divide 'Producer Exponent' and 'Point Condenser' cost by ` + format(this.effectBase()) + `. (based on 'Point Producer' level)<br>` + 
                `Currently: /` + format(buyableEffect(this.layer,this.id)) + `<br><br>` + 
                `Cost: ` + format(this.cost()) + ` points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` levels)` : ``) + `<br>` + 
                `Level ` + formatWhole(getBuyableAmount(this.layer,this.id)) + `.`
            },
            style: {'width':'150px','height':'150px'},
        },
    },
    upgrades:{
        11:{
            title(){return "Producer Boost"},
            getCost(){
                let cost = new Decimal(2e49)
                if (IPreached(3)) cost = new Decimal(2e10)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Increase Producer multiplier boost.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.15)
                if (IPreached(3)) eff = new Decimal(0.4)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect())},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(2)},
            style: {'width':'150px','height':'150px'}
        },
        12:{
            title(){return "Exponent Boost"},
            getCost(){
                let cost = new Decimal(1e82)
                if (IPreached(3)) cost = new Decimal(2e24)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply 'Producer Exp' base.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(1.1)
                if (IPreached(3)) eff = new Decimal(1.4)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(2)},
            style: {'width':'150px','height':'150px'}
        },
        13:{
            title(){return "Condenser Boost"},
            getCost(){
                let cost = new Decimal(2e241)
                if (IPreached(3)) cost = new Decimal(2e41)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Reduce 'Point Condenser' scaling.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.933)
                if (IPreached(3)) eff = new Decimal(0.55)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect(),3)},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(2)},
            style: {'width':'150px','height':'150px'}
        },
        14:{
            title(){return "Point Boost"},
            getCost(){
                let cost = new Decimal(1.5e56)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply point gain based on itself.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let e = new Decimal(0.05)
                let eff = player.points.max(1).pow(e).min(1e6)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(3)},
            style: {'width':'150px','height':'150px'}
        },
        21:{
            title(){return "Producer Boost 2"},
            getCost(){
                let cost = new Decimal(2.5e79)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Reduce 'Point Producer' multiplier boost require.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.88)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(3)},
            style: {'width':'150px','height':'150px'}
        },
        22:{
            title(){return "Exponent Boost 2"},
            getCost(){
                let cost = new Decimal(1.11e111)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Give free 'Producer Exponent' level based on 'Point Condenser' Level.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = getBuyableAmount('p',13).max(0).div(2)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect())},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(3)},
            style: {'width':'150px','height':'150px'}
        },
        23:{
            title(){return "Condenser Boost 2"},
            getCost(){
                let cost = new Decimal(2e151)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Raise 'Point Condenser' base based on 'Cost Divider' Level.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = getBuyableAmount('p',14).pow(0.5).div(12).add(1)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect(),3)},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(3)},
            style: {'width':'150px','height':'150px'}
        },
        24:{
            title(){return "Divider Boost"},
            getCost(){
                let cost = new Decimal(2e232)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>'Cost Divider' affect 'Point Producer' with reduced effect.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = buyableEffect('p',14).max(10).log(10).pow(12.7)
                return eff
            },
            effectDisplay(){return "/" + format(this.effect())},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){return IPreached(3)},
            style: {'width':'150px','height':'150px'}
        },
    },
})

addLayer("i", {
    name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        page: 1
    }},
    color: "#FFFF00",
    resource: "infinites", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    prestigeButtonText(){return `Do an Infinity reset.<br>It will unlock a new feature, but make the game harder.<br><br>Req: ` + format(this.baseAmount()) + ` / ` + format(this.requires().mul(Decimal.pow(2,player.i.points))) + ` points`},
    update(diff){

    },
    requires(){
        if (player[this.layer].points.gt(2.5)) return new Decimal(Infinity)
        else return new Decimal(2).pow(1024).div(Decimal.pow(2,player.i.points))
    },
    base: new Decimal(2),
    exponent: new Decimal(1),
    branches: ["p"],
    tabFormat:[
        "main-display",
        "prestige-button",
        "blank","blank",
        "clickables",
    ],
    clickables: {
        12: {
            title(){return formatWhole(player.i.page) + " Infinites"},
            marked(){return player.i.points.gte(player.i.page)},
            textString: [null,
                `Unlock 'Productor Exponent' buyable.<br>Increase 'Point Producer' multiplier boost require by 150%.`,
                `Unlock 'Point Condenser' buyable and point upgrades.<br>Raise 'Point Producer' scaling by 1.5.<br>Raise the effect of 'Producer Exp' by 0.8 but double the effect base.<br>Raise 'Producer Exp' scaling by 1.5 but divide the cost by 2 and remove the scaling exp.`,
                `Unlock 'Cost Divider' buyable.<br>Unlock more Point upgrades, the existent upgrades will be adjusted.<br>Raise the effect of 'Producer Exp' by 0.8 again, the scaling exp is readded.<br>'Point Condenser' is 35% weaker.`,
                `???`,
            ],
            display(){
                return `<br>` + this.textString[player.i.page]
            },
            tooltip: "If Star appear this mean the effect is active.",
            style: {'width':'225px','height':'225px'}
        },
        11: {
            canClick(){return player.i.page>1.5},
            onClick(){player.i.page--},
            display(){
                return `←`
            },
            style: {'font-size':'64px','width':'100px','min-height':'100px','height':'100px'}
        },
        13: {
            canClick(){return player.i.page<tmp.i.clickables[12].textString.length-1.5},
            onClick(){player.i.page++},
            display(){
                return `→`
            },
            style: {'font-size':'64px','width':'100px','min-height':'100px','height':'100px'}
        },
    }
})

function IPreached(x){
    return player.i.points.gte(x)
}

function atIP(x){
    return player.i.points.eq(x)
}

function addPts(seconds = 0){
    player.points = player.points.add(getPointGen().mul(seconds))
}