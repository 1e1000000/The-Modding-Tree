addLayer("p", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "pt", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        auto11: false,
        auto12: false,
        auto13: false,
    }},
    color: "#4BDC13",
    resource: "points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip(){return format(player.points) + " points (+" + format(getPointGen()) + "/s)"},
    update(diff){
        player.points = player.points.min(Decimal.pow(2,1024))
    },
    automate(){
        if (hasMilestone('pp',1) && tmp.p.buyables[11].unlocked && player.p.auto11) tmp.p.buyables[11].buyMax()
        if (hasMilestone('pp',2) && tmp.p.buyables[12].unlocked && player.p.auto12) tmp.p.buyables[12].buyMax()
        if (hasMilestone('pp',3) && tmp.p.buyables[13].unlocked && player.p.auto13) tmp.p.buyables[13].buyMax()
    },
    doReset(resettingLayer){
        let keep = ["auto11","auto12","auto13"]
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    tabFormat:[
        ["display-text",function(){return `You have <h2 style="color:#4bdc13">` + format(player.points) + `</h2> points`}],
            "blank","blank","buyables","blank","h-line","blank","upgrades"
        ],
    buyables:{
        11:{
            title: "Point Producer",
            unlocked(){return IPreached(0)},
            costScaling(){
                let scaling = [new Decimal(5),new Decimal(1.0727),new Decimal(1)]
                if (IPreached(2)) scaling[1] = scaling[1].pow(1.5)
                if (hasUpgrade('p',24)) scaling[0] = scaling[0].div(upgradeEffect('p',24))
                if (hasAchievement("pp",13)) scaling[1] = scaling[1].pow(0.9)
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
                if (IPreached(4) && eff[0].gte(1)) eff[0] = eff[0].sub(1).div(2).add(1)
                return eff
            },
            effectBase(){
                let base = new Decimal(1)
                if (IPreached(4)) base = base.div(4)
                let boostCount = getBuyableAmount('p',11).add(1e-10).div(this.multiBoost()[1]).floor()
                if (IPreached(4) && boostCount.gte(100)) boostCount = boostCount.div(100).pow(0.75).mul(100)
                base = base.mul(Decimal.pow(this.multiBoost()[0],boostCount))
                if (IPreached(2)) base = base.mul(buyableEffect("p",13))
                if (hasUpgrade("p",14)) base = base.mul(upgradeEffect("p",14))
                if (hasUpgrade("pp",11)) base = base.mul(upgradeEffect("pp",11))
                if (hasUpgrade("pp",31)) base = base.mul(upgradeEffect("pp",31))
                if (hasUpgrade("pp",42)) base = base.mul(upgradeEffect('pp',42))


                return base
            },
            effect(x){
                let eff = this.effectBase()
                let level = new Decimal(x)
                if (IPreached(1)) level = level.pow(buyableEffect("p",12).add(1))
                eff = eff.mul(level)
                return eff
            },
            bulkEnabled(){
                return true
            },
            buy(){
                if (!this.canAfford) return
                if (this.bulkEnabled) return this.buyMax()
                if (!hasMilestone('pp',1)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id)))
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('pp',1)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
            },
            canAfford(){return player.points.gte(this.cost())},
            display(){
                return `Produce ` + format(this.effectBase()) + ` point per second.<br>` + 
                `Currently: +` + format(buyableEffect(this.layer,this.id)) + `/s<br><br>` + 
                `Cost: ` + format(this.cost()) + ` points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` levels)` : ``) + `<br>` + 
                `Level ` + formatWhole(getBuyableAmount(this.layer,this.id)) + `. (Next boost at Level ` + formatWhole(getBuyableAmount(this.layer,this.id).add(1e-10).div(this.multiBoost()[1]).ceil().mul(this.multiBoost()[1])) + `)`
            },
            style: {'width':'150px','height':'150px'}
        },
        12:{
            title: "Producer Exponent",
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",21)
                else return IPreached(1)
            },
            costScaling(){
                let scaling = [new Decimal(1e5),new Decimal(100),new Decimal(1.1145)]
                if (IPreached(3)) scaling[0] = scaling[0].div(buyableEffect("p",14))
                if (IPreached(2)) scaling[0] = scaling[0].div(2)
                if (IPreached(2)) scaling[1] = scaling[1].pow(1.5)
                if (IPreached(4)) scaling[1] = scaling[1].root(1.5)
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
                if (IPreached(4)) base = base.div(2)
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
                if (!this.canAfford) return
                if (this.bulkEnabled()) return this.buyMax()
                if (!hasMilestone('pp',2)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id)))
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('pp',2)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
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
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",22)
                else return IPreached(2)
            },
            costScaling(){
                let scaling = [new Decimal(1e13),new Decimal(1e12),new Decimal(1.12)]
                if (IPreached(3)) scaling[0] = scaling[0].div(buyableEffect("p",14))
                if (hasUpgrade('p',13)) scaling[1] = scaling[1].pow(upgradeEffect('p',13))
                if (IPreached(4)) scaling[0] = scaling[0].div(1e5)
                if (IPreached(4)) scaling[1] = scaling[1].root(6)
                if (IPreached(4)) scaling[2] = scaling[2].pow(3)
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
                if (IPreached(4)) base = base.pow(0.8)
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
                if (!this.canAfford) return
                if (this.bulkEnabled()) return this.buyMax()
                if (!hasMilestone('pp',3)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id)))
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('pp',3)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
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
            unlocked(){
                if (IPreached(4)) return false
                else return IPreached(3)
            },
            costScaling(){
                let scaling = [new Decimal(1e16),new Decimal(200),new Decimal(1.62)]
                if (IPreached(4)) scaling[0] = new Decimal(Infinity)
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
                if (!this.canAfford) return
                if (this.bulkEnabled()) return this.buyMax()
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id)))
                addBuyables(this.layer,this.id,new Decimal(1))
            },
            bulk(){
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
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
                if (IPreached(4)) cost = new Decimal(1e11)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Increase Producer multiplier boost.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.15)
                if (IPreached(3)) eff = new Decimal(0.4)
                if (IPreached(4)) eff = new Decimal(0.6)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect())},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",32)
                else return IPreached(2)
            },
            style: {'width':'150px','height':'150px'}
        },
        12:{
            title(){return "Exponent Boost"},
            getCost(){
                let cost = new Decimal(1e82)
                if (IPreached(3)) cost = new Decimal(2e24)
                if (IPreached(4)) cost = new Decimal(5e21)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply 'Producer Exp' base.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(1.1)
                if (IPreached(3)) eff = new Decimal(1.4)
                if (IPreached(4)) eff = new Decimal(1.2)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",32)
                else return IPreached(2)
            },
            style: {'width':'150px','height':'150px'}
        },
        13:{
            title(){return "Condenser Boost"},
            getCost(){
                let cost = new Decimal(2e241)
                if (IPreached(3)) cost = new Decimal(2e41)
                if (IPreached(4)) cost = new Decimal(1e70)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Reduce 'Point Condenser' scaling.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.933)
                if (IPreached(3)) eff = new Decimal(0.55)
                if (IPreached(4)) eff = new Decimal(0.7)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect(),3)},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",32)
                else return IPreached(2)
            },
            style: {'width':'150px','height':'150px'}
        },
        14:{
            title(){return "Point Boost"},
            getCost(){
                let cost = new Decimal(1.5e56)
                if (IPreached(4)) cost = new Decimal(1.5e50)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply point gain based on itself.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let p = player.points.max(1)
                if (p.gte(1e120)){
                    if (!hasAchievement("pp",12)) p = p.min(1e120)
                }
                let e = new Decimal(0.05)
                if (IPreached(4)) e = new Decimal(0.1)
                let eff = p.pow(e)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",32)
                else return IPreached(3)
            },
            style: {'width':'150px','height':'150px'}
        },
        21:{
            title(){return "Producer Boost 2"},
            getCost(){
                let cost = new Decimal(2.5e79)
                if (IPreached(4)) cost = new Decimal(1e133)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Reduce 'Point Producer' multiplier boost require.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = new Decimal(0.88)
                if (IPreached(4)) eff = new Decimal(0.72)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",51)
                else return IPreached(3)
            },
            style: {'width':'150px','height':'150px'}
        },
        22:{
            title(){return "Exponent Boost 2"},
            getCost(){
                let cost = new Decimal(1.11e111)
                if (IPreached(4)) cost = new Decimal(5e202)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Give free 'Producer Exponent' level based on 'Point Condenser' Level.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + format(this.getCost()) + ` points`},
            effect(){
                let eff = getBuyableAmount('p',13).max(0).div(2)
                if (IPreached(4)) eff = getBuyableAmount('p',13).max(0).div(1.5)
                return eff
            },
            effectDisplay(){return "+" + format(this.effect())},
            canAfford(){return player.points.gte(this.getCost())},
            pay(){player.points = player.points.sub(this.getCost())},
            unlocked(){
                if (IPreached(4)) return hasUpgrade("pp",51)
                else return IPreached(3)
            },
            style: {'width':'150px','height':'150px'}
        },
        23:{
            title(){return "Condenser Boost 2"},
            getCost(){
                let cost = new Decimal(2e151)
                if (IPreached(4)) cost = new Decimal(Infinity)
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
            unlocked(){
                if (IPreached(4)) return false
                else return IPreached(3)
            },
            style: {'width':'150px','height':'150px'}
        },
        24:{
            title(){return "Divider Boost"},
            getCost(){
                let cost = new Decimal(2e232)
                if (IPreached(4)) cost = new Decimal(Infinity)
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
            unlocked(){
                if (IPreached(4)) return false
                else return IPreached(3)
            },
            style: {'width':'150px','height':'150px'}
        },
    },
})

addLayer("pp", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "pp", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
        theorem: new Decimal(0),
    }},
    color: "#31aeb0",
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return IPreached(4)},
    prestigeButtonText(){return `Reset for +<b>` + formatWhole(this.getResetGain()) + `</b> ` + this.resource + ` (` + format(this.getResetGain().div(player.pp.resetTime).mul(60)) + `/m).<br><br>Next at ` + format(this.getNextAt()) + ` points.`},
    tooltip(){return formatWhole(player.pp.points) + " prestige points (+" + formatWhole(this.getResetGain()) + ")"},
    update(diff){

    },
    requires(){
        return new Decimal(2000)
    },
    getResetGain(){
        let gain = Decimal.pow(10,player.points.mul(5).max(1).log10().pow(0.5)).div(100)
        gain = gain.mul(this.gainMult())
        return gain.floor()
    },
    gainMult(){
        let mul = new Decimal(1)
        if (hasUpgrade("pp",32)) mul = mul.mul(upgradeEffect('pp',32))
        if (hasUpgrade("pp",33)) mul = mul.mul(upgradeEffect('pp',33))
        if (hasAchievement("pp",11)) mul = mul.mul(achievementEffect('pp',11))
        if (hasUpgrade("pp",62)) mul = mul.mul(upgradeEffect('pp',62))
        if (hasUpgrade("pp",72)) mul = mul.mul(upgradeEffect('pp',72))
        if (hasAchievement("pp",14)) mul = mul.mul(achievementEffect('pp',14))
        return mul
    },
    prestigeNotify(){return this.getResetGain().div(player.pp.points.max(1)).gte(0.1) && this.getResetGain().gte(1)},
    getNextAt(){
        let next = Decimal.pow(10,this.getResetGain().add(1).div(this.gainMult()).mul(100).log10().pow(2)).div(5)
        return next
    },
    canReset(){return this.baseAmount().gte(this.requires())},
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    totalTheorems(){
        return getBuyableAmount('pp',11)
    },
    branches: [["p",3]],
    tabFormat:{
        "Main":{
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank","blank",
                ["row",[["buyable",11],["clickable",11]]],
                "blank",
                ["display-text",function(){return `You have ` + formatWhole(player.pp.theorem) + ` unspent prestige theorem.`}],
                ["row",[["upgrade",11]]],
                "blank",
                ["row",[["upgrade",21],"blank",["upgrade",22]]],
                "blank",
                ["row",[["upgrade",31],"blank",["upgrade",32],"blank",["upgrade",33]]],
                "blank",
                ["row",[["upgrade",41],"blank",["upgrade",42]]],
                "blank",
                ["row",[["upgrade",51]]],
                "blank",
                ["row",[["upgrade",61],"blank",["upgrade",62]]],
                "blank",
                ["row",[["upgrade",71],"blank",["upgrade",72]]],
            ]
        },
        "Milestones":{
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank","blank",
                "milestones"
            ]
        },
        "Fates":{
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank","blank",
                "achievements"
            ],
            unlocked(){return hasMilestone('pp',5)}
        },
    },
    clickables: {
        11: {
            title: "Respec Upgrades",
            canClick(){return player.pp.upgrades.length >= 1},
            onClick(){
                if (confirm("Are you want to reset Prestige Upgrades? You will do a forced prestige reset and refund your spent prestige theorems")){
                    doReset('pp',true)
                    player.pp.theorem = tmp.pp.totalTheorems
                    player.pp.upgrades = []
                }
            },
            display(){
                return `Refund ` + formatWhole(tmp.pp.totalTheorems.sub(player.pp.theorem)) + ` prestige theorems.`
            },
            style: {'width':'130px','min-height':'130px','height':'130px'}
        },
    },
    buyables:{
        11:{
            title: "Prestige Theorem",
            unlocked(){return true},
            costScaling(){
                let scaling = [new Decimal(1),new Decimal(2),new Decimal(1)]
                return scaling
            },
            cost(x){
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            bulkEnabled(){
                return false
            },
            buy(){
                if (!this.canAfford) return
                if (this.bulkEnabled()) return this.buyMax()
                player.pp.points = player.pp.points.sub(this.cost(getBuyableAmount(this.layer,this.id))).round()
                addBuyables(this.layer,this.id,new Decimal(1))
                player.pp.theorem = player.pp.theorem.add(1)
            },
            bulk(){
                return player.pp.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                player.pp.points = player.pp.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1))).round()
                addBuyables(this.layer,this.id,bulk)
                player.pp.theorem = player.pp.theorem.add(bulk)
            },
            canAfford(){return player.pp.points.gte(this.cost())},
            display(){
                return `Cost: ` + formatWhole(this.cost()) + ` prestige points.` + (this.bulkEnabled() ? `<br>(Bulking ` + formatWhole(this.bulk()) + ` theorems)` : ``) + `<br>` + 
                `Bought: ` + formatWhole(getBuyableAmount(this.layer,this.id))
            },
            style: {'width':'130px','height':'130px'}
        },
    },
    upgrades: {
        11:{
            title(){return "11"},
            getCost(){
                let cost = new Decimal(1)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply points gain based on total prestige points.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = player.pp.total.add(1)
                if (hasUpgrade("pp",61)) eff = eff.pow(upgradeEffect('pp',61))
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost())},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
        },
        21:{
            title(){return "21"},
            getCost(){
                let cost = new Decimal(2)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Unlcok 'Producer Exponent' buyable.<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(1)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',11)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[11,function(){return hasUpgrade('pp',11)?1:2}]],
        },
        22:{
            title(){return "22"},
            getCost(){
                let cost = new Decimal(4)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Unlcok 'Point Condenser' buyable.<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(1)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',11)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[11,function(){return hasUpgrade('pp',11)?1:2}]],
        },
        31:{
            title(){return "31"},
            getCost(){
                let cost = new Decimal(2)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply points gain based on total prestige theorems.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = tmp.pp.totalTheorems.max(1)
                if (hasUpgrade("pp",41)) eff = eff.pow(upgradeEffect('pp',41))
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',21)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[21,function(){return hasUpgrade('pp',21)?1:2}]],
        },
        32:{
            title(){return "32"},
            getCost(){
                let cost = new Decimal(1)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Unlock 4 point upgrades, each point upgrade ` + (hasUpgrade("pp",51) ? `multiply PP gain by 1.5.<br>` : `increase PP gain by 50%.<br>`) 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(0.5).mul(player.p.upgrades.length).add(1)
                if (hasUpgrade("pp",51)) eff = new Decimal(1.5).pow(player.p.upgrades.length)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',21) && hasUpgrade('pp',22)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[21,function(){return hasUpgrade('pp',21)?1:3}],[22,function(){return hasUpgrade('pp',22)?1:3}]],
        },
        33:{
            title(){return "33"},
            getCost(){
                let cost = new Decimal(7)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply PP gain based on itself and 'Point Condenser' Level.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let exp = getBuyableAmount('p',13).pow(0.5)
                if (exp.gte(3)) exp = exp.log(3).add(2)
                let eff = player.pp.points.max(10).log10().pow(exp)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',22)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[22,function(){return hasUpgrade('pp',22)?1:2}]],
        },
        41:{
            title(){return "41"},
            getCost(){
                let cost = new Decimal(14)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Raise '31' effect based on total prestige theorems.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = tmp.pp.totalTheorems.max(1).pow(0.5)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect())},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',31) && hasUpgrade('pp',32)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[31,function(){return hasUpgrade('pp',31)?1:3}],[32,function(){return hasUpgrade('pp',32)?1:3}]],
        },
        42:{
            title(){return "42"},
            getCost(){
                let cost = new Decimal(13)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply points gain.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(1e6)
                if (hasUpgrade("pp",71)) eff = eff.pow(upgradeEffect('pp',71))
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',32) && hasUpgrade('pp',33)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[32,function(){return hasUpgrade('pp',32)?1:3}],[33,function(){return hasUpgrade('pp',33)?1:3}]],
        },
        51:{
            title(){return "51"},
            getCost(){
                let cost = new Decimal(6)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Unlock 2 point upgrades, '32' uses a better formula.<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(1)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',41) && hasUpgrade('pp',42)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[41,function(){return hasUpgrade('pp',41)?1:3}],[42,function(){return hasUpgrade('pp',42)?1:3}]],
        },
        61:{
            title(){return "61"},
            getCost(){
                let cost = new Decimal(25)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Raise '11' effect.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(1.5)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect())},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',51) && !hasUpgrade('pp',62)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[51,function(){return (hasUpgrade('pp',51)&&!hasUpgrade('pp',62))||hasUpgrade('pp',61)?"#4bdc13":"#266e0a"}]],
        },
        62:{
            title(){return "62"},
            getCost(){
                let cost = new Decimal(10)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply PP gain based on 'Producer Exponent' effect.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = buyableEffect('p',12).max(0).add(1).pow(2)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',51) && !hasUpgrade('pp',61)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[51,function(){return (hasUpgrade('pp',51)&&!hasUpgrade('pp',61))||hasUpgrade('pp',62)?"#31aeb0":"#195758"}]],
        },
        71:{
            title(){return "71"},
            getCost(){
                let cost = new Decimal(13)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Raise '42' effect.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = new Decimal(3.35)
                return eff
            },
            effectDisplay(){return "^" + format(this.effect())},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',61)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[61,function(){return hasUpgrade('pp',61)?1:2}]],
        },
        72:{
            title(){return "72"},
            getCost(){
                let cost = new Decimal(11)
                return cost
            },
            fullDisplay(){return `<h2>` + this.title() + `</h2><br>Multiply PP gain based on total prestige theorems.<br>` 
            + `Currently: ` + this.effectDisplay() + `<br><br>Cost: ` + formatWhole(this.getCost()) + ` prestige theorem.`},
            effect(){
                let eff = tmp.pp.totalTheorems.max(1).pow(0.5)
                return eff
            },
            effectDisplay(){return format(this.effect()) + "x"},
            canAfford(){return player.pp.theorem.gte(this.getCost()) && hasUpgrade('pp',62)},
            pay(){player.pp.theorem = player.pp.theorem.sub(this.getCost())},
            unlocked(){return IPreached(4)},
            style: {'width':'135px','height':'135px'},
            branches: [[62,function(){return hasUpgrade('pp',62)?1:2}]],
        },
    },
    milestones:{
        1: {
            requirementDescription: "10 total prestige theorems",
            effectDescription: "Autobuy 'Point Producer', they no longer spent anything.",
            done(){return tmp.pp.totalTheorems.gte(10)},
            toggles: [['p','auto11']]
        },
        2: {
            requirementDescription: "20 total prestige theorems",
            effectDescription: "Autobuy 'Producer Exponent', they no longer spent anything.",
            done(){return tmp.pp.totalTheorems.gte(20)},
            toggles: [['p','auto12']]
        },
        3: {
            requirementDescription: "30 total prestige theorems",
            effectDescription: "Autobuy 'Point Condenser', they no longer spent anything.",
            done(){return tmp.pp.totalTheorems.gte(30)},
            toggles: [['p','auto13']]
        },
        5: {
            requirementDescription: "50 total prestige theorems",
            effectDescription: "Unlock Fates.",
            done(){return tmp.pp.totalTheorems.gte(50)},
        },
    },
    achievements:{
        11: {
            name: "Fate 1",
            done(){return IPreached(4) && hasMilestone('pp',5) && (getBuyableAmount('p',11).gte(1000) && getBuyableAmount('p',12).lt(0.5) && getBuyableAmount('p',13).lt(0.5) && getBuyableAmount('p',14).lt(0.5) && player.p.upgrades.length == 0)},
            tooltip(){return "Reach 1000 'Point Producer' level without any other point buyables or point upgrades, reward: 'Point Producer' Level multiply PP gain, currently: " + format(this.effect()) + "x"},
            effect(){return getBuyableAmount('p',11).max(1).root(3)},
        },
        12: {
            name: "Fate 2",
            done(){return IPreached(4) && hasMilestone('pp',5) && (player.points.gte(1e54) && player.p.upgrades.length == 0 && player.pp.upgrades.length <= 3)},
            tooltip(){return "Reach 1e54 points without any point upgrades or more than 3 prestige upgrades, reward: uncap 'Point Boost' effect."},
            effect(){return new Decimal(1)},
        },
        13: {
            name: "Fate 3",
            done(){return IPreached(4) && hasMilestone('pp',5) && (player.points.gte(1e82) && getBuyableAmount('p',11).lte(1))},
            tooltip(){return "Reach 1e82 points with only one 'Point Producer' level, reward: raise 'Point Producer' scaling by 0.9."},
            effect(){return new Decimal(1)},
        },
        14: {
            name: "Fate 4",
            done(){return IPreached(4) && hasMilestone('pp',5) && (player.points.gte(1e28) && getPointGen().gte(1e26) && getBuyableAmount('p',11).lte(1) && getBuyableAmount('p',12).lt(0.5) && getBuyableAmount('p',13).lt(0.5) && getBuyableAmount('p',14).lt(0.5) && player.p.upgrades.length == 0 && player.pp.upgrades.length <= 3)},
            tooltip(){return "Reach 1e28 points with at least 1e26 point production, but you need to meet all the limitation of Feat 1-3, reward: multiply PP gain based on points, currently: " + format(this.effect()) + "x"},
            effect(){return player.points.max(10).log10().pow(0.5)},
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
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    prestigeButtonText(){return `Do an Infinity reset.<br>It will unlock a new feature, but make the game harder.<br><br>Req: ` + format(this.baseAmount()) + ` / ` + format(this.requires().mul(Decimal.pow(2,player.i.points))) + ` points`},
    tooltip(){return formatWhole(player.i.points) + " infinites (" + format(player.points.max(1).log10().div(getInfReq().log10()).mul(100)) + "%)"},
    update(diff){

    },
    requires(){
        if (player[this.layer].points.gt(3.5)) return new Decimal(Infinity)
        else {
            let req = getInfReq()
            return req.div(Decimal.pow(2,player.i.points))
        }
    },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    base: new Decimal(2),
    exponent: new Decimal(1),
    branches: [["p",1,10]],
    tabFormat:[
        "main-display",
        "prestige-button",
        "blank","blank",
        ["clickable",12],
        ["row",[["clickable",11],["clickable",13]]]
    ],
    clickables: {
        12: {
            title(){return formatWhole(player.i.page) + " Infinites"},
            marked(){return IPreached(player.i.page)},
            textString: [
                `Unlock 'Point Producer' buyable.`,
                `Unlock 'Productor Exponent' buyable.<br>Increase 'Point Producer' multiplier boost require by 150%.`,
                `Unlock 'Point Condenser' buyable and point upgrades.<br>Raise 'Point Producer' scaling by 1.5.<br>Raise the effect of 'Producer Exp' by 0.8 but double the effect base.<br>Raise 'Producer Exp' scaling by 1.5 but divide the cost by 2 and remove the scaling exp.`,
                `Unlock 'Cost Divider' buyable.<br>Unlock more Point upgrades, the existent upgrades will be adjusted.<br>Raise the effect of 'Producer Exp' by 0.8 again, the scaling exp is readded.<br>'Point Condenser' is 35% weaker.`,
                `Unlock a Prestige Layer.<br>Divide points gain by 4 and 'Point Producer' multiplier boost effect past 1 by 2, and the boost count after 100 is softcapped.<br>All point upgrades and buyables except 'Point Producer' are no longer always show.<br>Half the effect base of 'Producer Exp' and 'Point Condenser' is 20% weaker (multiplicative with Infinity #3 effect).<br>Root the cost scaling of 'Producer Exp' by 1.5, Divide 'Point Condenser' cost by 100,000 and root the scaling by 6 but cube the scaling exp.`,
            ],
            display(){
                return `<br>` + this.textString[player.i.page] + `<br><br>Reach ` + format(Decimal.pow(2,1024)) + ` points to ` + (player.i.page == tmp.i.clickables[12].textString.length-1 ? ` beat the game.` : ` infinity #` + formatWhole(player.i.page+1) + ".")
            },
            tooltip: "If Star appear this mean the effect is active.",
            style: {'width':'400px','height':'400px'}
        },
        11: {
            canClick(){return player.i.page>0.5},
            onClick(){player.i.page--},
            display(){
                return `←`
            },
            style: {'font-size':'64px','width':'100px','min-height':'100px','height':'100px'}
        },
        13: {
            canClick(){return player.i.page<Math.min(player.i.points.toNumber()+0.5,tmp.i.clickables[12].textString.length-1.5)},
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

function getInfReq(x = player.i.points){
    return Decimal.pow(2,1024)
}