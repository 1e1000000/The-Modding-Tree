addLayer("am", {
    name(){return modInfo.pointsName}, // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "#ff0000",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource(){return modInfo.pointsName}, // Name of prestige currency
    baseResource(){return modInfo.pointsName}, // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    tooltip(){return format(player.points) + " " + modInfo.pointsName + "^" + format(tmp.am.getAMExp,3)},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
        ["display-text",function(){return inChallenge('inf',72) ? "There is " + format(player.matter) + " matter" : ""}],
        ["display-text",function(){return "You have <h2 style='color: red'>" + format(player.points) + "</h2> " + modInfo.pointsName + "<sup>" + format(tmp.am.getAMExp,3) + "</sup> (" + getRateChangewithExp(player.points,tmp.am.getAMProd,tmp.am.getAMExp) + "/s)"}],
        ["display-text",function(){return (tmp.am.getAMExp.gte(tmp.am.getAMExpSoftcaps.start)) ? "Due to the softcap of antimatter exponent at " + format(tmp.am.getAMExpSoftcaps.start,3) + ", AM exponent is divided by " + format(tmp.am.getPreSCAMExp.div(tmp.am.getAMExp), 3) : ""}],
        "blank",
        ["display-text",function(){return "You have <b style='color: red'>" + format(player.points.root(tmp.am.getAMExp)) + "</b> " + modInfo.pointsName + " before exp (" + getRateChangewithExp(player.points.root(tmp.am.getAMExp),tmp.am.getAMProd) + "/s)"}],
        ["bar","progressBar"],
        ["display-text",function(){return player.inf.break?"Your best ever " + modInfo.pointsName + " was <b style='color: red'>" + format(player.bestAM) + "</b>":""}],
        "blank","clickables",
        ["display-text",function(){return "Total Buyable level: " + formatWhole(tmp.am.totalLevel)}],
        "buyables",
    ],
    update(diff){
        player.points = tmp.am.getAMProd.eq(0)?new Decimal(1):player.points.root(tmp.am.getAMExp).add(tmp.am.getAMProd.mul(diff)).pow(tmp.am.getAMExp).max(0).min(player.inf.break?1/0:Decimal.pow(2,1024))
        player.bestAM = player.bestAM.max(player.points)
        if (inChallenge('inf',72)) player.matter = player.matter.mul(Decimal.pow(10,getBuyableAmount('am',11).pow(0.5)).pow(diff))
    },
    automate(){
        if (tmp.auto.clickables.am11.canRun) tmp.am.buyables[11].buyMax()
        if (tmp.auto.clickables.am12.canRun) tmp.am.buyables[12].buyMax()
        if (tmp.auto.clickables.am13.canRun) tmp.am.buyables[13].buyMax()
        if (tmp.auto.clickables.am21.canRun) tmp.am.buyables[21].buyMax()
        if (tmp.auto.clickables.am22.canRun) tmp.am.buyables[22].buyMax()
        if (tmp.auto.clickables.am23.canRun) tmp.am.buyables[23].buyMax()
        if (tmp.auto.clickables.am31.canRun) tmp.am.buyables[31].buyMax()
        if (tmp.auto.clickables.am32.canRun) tmp.am.buyables[32].buyMax()
        if (tmp.auto.clickables.am33.canRun) tmp.am.buyables[33].buyMax()
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row>this.row){
            let keep = []
            layerDataReset(this.layer, keep)
        }
    },
    getAMProd(){
        let prod = buyableEffect('am', 11)
        prod = prod.mul(buyableEffect('am', 13))
        prod = prod.mul(buyableEffect('am', 22))
        if (player.inf.unlocked) prod = prod.mul(tmp.inf.effect)
        if (hasUpgrade('inf',51)) prod = prod.mul(tmp.inf.getIPowEff)
        if (hasUpgrade('inf',11)) prod = prod.mul(upgradeEffect('inf',11))
        if (hasUpgrade('inf',21)) prod = prod.mul(upgradeEffect('inf',21))
        if (hasUpgrade('inf',31)) prod = prod.mul(upgradeEffect('inf',31))
        if (hasUpgrade('inf',41)) prod = prod.mul(upgradeEffect('inf',41))
        if (hasUpgrade('inf',13)) prod = prod.mul(Decimal.pow(2,tmp.inf.totalComp))
        if (inChallenge('inf',31) && !inChallenge('inf',51) && getBuyableAmount('am',22).gte(10)) prod = prod.mul(20)
        prod = prod.pow(buyableEffect('am', 31))

        if (inChallenge('inf',42)) {
            if (inChallenge('inf',51)) prod = prod.root(2).div(1e12)
            else prod = prod.root(1.64).min(prod.div(1e6))
        }
        if (inChallenge('inf',72)) prod = prod.divide(player.matter)
        return prod
    },
    getPreMultAMExp(){
        let exp = buyableEffect('am', 12)
        if (hasUpgrade('inf',12)) exp = exp.add(upgradeEffect('inf',12))
        if (hasUpgrade('inf',22)) exp = exp.add(upgradeEffect('inf',22))
        if (hasUpgrade('inf',42)) exp = exp.add(upgradeEffect('inf',42))
        if (hasUpgrade('inf',53)) exp = exp.add(upgradeEffect('inf',53))
        if (inChallenge('inf',52)) exp = exp.min(1)
        return exp
    },
    getPreSCAMExp(){
        let exp = tmp.am.getPreMultAMExp

        exp = exp.add(exp.max(1).log10().mul(buyableEffect('am', 32)))
        if (hasChallenge('inf',12)) exp = exp.mul(1.05)
        if (hasUpgrade('inf',73)) exp = exp.mul(upgradeEffect('inf',73))

        if (inChallenge('inf',12)) {
            if (inChallenge('inf',51)) exp = exp.root(1.5).div(3)
            exp = exp.root(1.24).min(exp.div(1.5))
        }
        if (hasUpgrade('inf',71) && inChallenge('inf',51)) exp = exp.mul(1.2)
        if (inChallenge('inf',52)) exp = exp.min(1)
        return exp
    },
    getAMExp(){
        let exp = tmp.am.getPreSCAMExp

        if (exp.gte(tmp.am.getAMExpSoftcaps.start)) exp = exp.div(tmp.am.getAMExpSoftcaps.start).pow(tmp.am.getAMExpSoftcaps.exp).mul(tmp.am.getAMExpSoftcaps.start)
        if (inChallenge('inf',82)) exp = exp.mul(Decimal.pow(0.9,player.inf.ic8Time))
        if (inChallenge('inf',52)) exp = exp.min(1)
        return exp
    },
    getAMExpSoftcaps(){
        let scStart = new Decimal(9)
        let scExp = new Decimal(0.5)

        //if (hasChallenge('inf',52)) scStart = scStart.add(1)
        if (inChallenge('inf',51)) scStart = scStart.div(10).sub(0.1)

        if (hasUpgrade('inf',53)) scExp = scExp.add(0.15)
        if (hasUpgrade('inf',63)) scExp = scExp.add(0.1)
        return {start: scStart, exp: scExp}
    },
    hotkeys:[
        {
            key: "m",
            description: "m: max all " + modInfo.pointsName + " buyables (require ach21)",
            onPress(){
                if (hasAchievement('ach',21)){
                    tmp.am.clickables[11].onClick()
                }
            }
        }
    ],
    clickables:{
        11:{
            title:"Buy Max Antimatter Buyables",
            unlocked(){return hasAchievement('ach',21)},
            canClick(){return true},
            onClick(){
                tmp.am.buyables[11].buyMax()
                tmp.am.buyables[12].buyMax()
                tmp.am.buyables[13].buyMax()
                tmp.am.buyables[21].buyMax()
                tmp.am.buyables[22].buyMax()
                tmp.am.buyables[23].buyMax()
                tmp.am.buyables[31].buyMax()
                tmp.am.buyables[32].buyMax()
                tmp.am.buyables[33].buyMax()
            },
            onHold(){this.onClick()},
        },
        12:{
            title:"Perform an Infinity reset",
            unlocked(){return hasAchievement('ach',21)},
            canClick(){return tmp.inf.canReset},
            onClick(){
                doReset('inf')
            },
            display(){return "+" + formatWhole(tmp.inf.resetGain) + " IP"},
            style(){
                if (this.canClick()) return {"background-color": "yellow"}
                else return {"background-color": "#BF8F8F"}
            },
        },
    },
    totalLevel(){
        let level = new Decimal(0)
        for (let i=1;i<=3;i++){
            for (let j=1;j<=3;j++){
                level = level.add(player.am.buyables[i*10+j])
            }
        }
        return level
    },
    buyables:{
        11:{
            title: "Producer",
            costScaling(){
                let scaling = [new Decimal(1),new Decimal(2),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                if (hasChallenge('inf',11)) scaling[2] = scaling[2].sub(0.1)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = this.costScaling()[0].mul(this.costScaling()[1].pow(x.pow(this.costScaling()[2])))
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            purchaseLimit(){
                if (inChallenge('inf',11)) return new Decimal(1)
                else return new Decimal(1/0)
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Produce " + modInfo.pointsName + "<br>Currently: +" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                if (inChallenge('inf',41)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                let total = x.add(free)
                let amount = total.mul(strength)
                let eff = amount
                let exp = buyableEffect('am', 21)
                if (inChallenge('inf',22)) {
                    if (inChallenge('inf',51)) exp = exp.pow(2).mul(2)
                    else exp = exp.root(1.5).div(2)
                }
                eff = eff.pow(exp)
                return eff
            },
            unlocked(){return true},
        },
        12:{
            title: "AM Exp",
            costScaling(){
                let scaling = [new Decimal(100),new Decimal(5),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Increase " + modInfo.pointsName + " exponent<br>Currently: +" + format(buyableEffect(this.layer,this.id).sub(1),3)
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                if (inChallenge('inf',41)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                let total = x.add(free)
                if (total.gte(58)) total = total.sub(58).div(2).add(58)
                let amount = total.mul(strength)
                let e = new Decimal(0.5)
                if (hasUpgrade('inf',32)) e = e.add(0.005)
                if (hasUpgrade('inf',63)) e = e.add(0.01)
                let eff = amount.add(1).pow(e)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 11).gte(inChallenge('inf',11)?1:4) || (hasUpgrade('inf',13) && !player.inf.activeChallenge)},
        },
        13:{
            title: "Multiplier",
            costScaling(){
                let scaling = [new Decimal(1e6),new Decimal(10),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Multiply base " + modInfo.pointsName + " production<br>Currently: x" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let b = new Decimal(2).add(buyableEffect('am', 23))
                if (hasChallenge('inf',21)) b = b.mul(1.1)
                if (inChallenge('inf',51)) b = b.div(2).max(1)
                if (inChallenge('inf',32)) b = b.root(2).max(1)
                let strength = new Decimal(1)
                if (inChallenge('inf',41)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                if (hasChallenge('inf',32)) free = free.add(getBuyableAmount('am',23).mul(2))
                let total = x.add(free)
                if (total.gte(52)) {
                    if (hasUpgrade('inf',61)) total = total.sub(52).div(2).add(52)
                    else total = total.div(52).root(2).mul(52)
                }
                let amount = total.mul(strength)
                if (inChallenge('inf',21)) amount = amount.root(1.4)
                let eff = new Decimal(1)
                if (inChallenge('inf',61)){
                    eff = Decimal.mul(b.sub(1),amount).add(1)
                } else {
                    eff = Decimal.pow(b,amount)
                }
                if (eff.gte(Decimal.pow(2,1024))) eff = Decimal.pow(2,eff.log(2).div(1024).pow(0.5).mul(1024))
                return eff
            },
            unlocked(){return getBuyableAmount('am', 12).gte(4) || (hasUpgrade('inf',23) && !player.inf.activeChallenge)},
        },
        21:{
            title: "Producer Exp",
            costScaling(){
                let scaling = [new Decimal(1e9),new Decimal(20),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Increase <b>Producer</b> exponent<br>Currently: ^" + format(buyableEffect(this.layer,this.id),3)
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                if (inChallenge('inf',41)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                let total = x.add(free)
                if (total.gte(38)) total = total.sub(38).div(2).add(38)
                let amount = total.mul(strength)
                let exp = new Decimal(0.5)
                if (hasChallenge('inf',22)) exp = exp.add(0.03)
                let eff = amount.add(1).pow(exp)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 13).gte(3) || (hasUpgrade('inf',33) && !player.inf.activeChallenge)},
        },
        22:{
            title: "Condenser",
            costScaling(){
                let scaling = [new Decimal(1e30),new Decimal(1e10),new Decimal(1.5)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                if (inChallenge('inf',51)) scaling[2] = new Decimal(1.25)
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && (tmp[this.layer].buyables[this.id].unlocked || inChallenge('inf',31))
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Multiply base " + modInfo.pointsName + " production based on itself<br>Currently: x" + format(buyableEffect(this.layer,this.id), 2, true)
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                if (hasChallenge('inf',31) && !inChallenge('inf',31)) strength = strength.mul(1.5)
                if (inChallenge('inf',41) && !inChallenge('inf',31)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                let total = x.add(free)
                if (total.gte(10)) total = total.sub(10).div(2).add(10)
                let amount = total.mul(strength)
                let exp = amount.pow(0.5)
                if (hasUpgrade('inf',71) && !inChallenge('inf',31)) exp = exp.pow(1.2)
                if (inChallenge('inf',31)) {
                    if (inChallenge('inf',51)) exp = exp.pow(3).mul(-2)
                    else exp = exp.pow(2).mul(-0.68)
                }
                let eff = Decimal.pow(player.points.max(10).log10(),exp)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 21).gte(7) || (hasUpgrade('inf',43) && !player.inf.activeChallenge)},
        },
        23:{
            title: "Multiplier Boost",
            costScaling(){
                let scaling = [new Decimal(1e135),new Decimal(1e25),new Decimal(2)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Increase <b>Multiplier</b> base<br>Currently: +" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let b = new Decimal(0.16).add(buyableEffect('am', 33))
                if (inChallenge('inf',32)) b = new Decimal(0)
                let strength = new Decimal(1)
                if (inChallenge('inf',41)) strength = strength.mul(tmp.inf.challenges[41].nerf)
                let free = new Decimal(0)
                let total = x.add(free)
                if (total.gte(3)) {
                    if (hasUpgrade('inf',61)) total = total.sub(3).div(2).add(3)
                    else total = total.div(3).root(2).mul(3)
                }
                let amount = total.mul(strength)
                let eff = amount.mul(b)
                if (eff.gte(2)) eff = eff.div(2).pow(0.5).mul(2)
                return eff
            },
            unlocked(){return getBuyableAmount('am', 22).gte(5) || (hasUpgrade('inf',43) && !player.inf.activeChallenge)},
        },
        31:{
            title: "Exponent",
            costScaling(){
                let scaling = [new Decimal(2).pow(1024),new Decimal(2).pow(256),new Decimal(2)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Raise base " + modInfo.pointsName + " production<br>Currently: ^" + format(buyableEffect(this.layer,this.id), 4)
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let b = new Decimal(0.01)
                let strength = new Decimal(1)
                let free = new Decimal(0)
                let total = x.add(free)
                let amount = total.mul(strength)
                if (amount.gte(12)) amount = amount.div(12).pow(0.5).mul(12)
                let eff = b.mul(amount).add(1)
                return eff
            },
            unlocked(){return hasUpgrade('inf',54) && (!player.inf.activeChallenge || (getBuyableAmount('am', 23).gte(3) && player.inf.activeChallenge))},
        },
        32:{
            title: "Exp Condenser",
            costScaling(){
                let scaling = [new Decimal(2).pow(4096),new Decimal(2).pow(2048),new Decimal(2)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Increase AM exponent based on itself before multiplication, challenges and softcaps<br>Currently: +log10(" + format(tmp.am.getPreMultAMExp,3) + ")*" + format(buyableEffect(this.layer,this.id),3)
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let free = new Decimal(0)
                let total = x.add(free)
                let amount = total.mul(strength)
                let eff = amount.pow(0.5).min(amount.add(4).pow(1/3))
                return eff
            },
            unlocked(){return hasUpgrade('inf',64) && (!player.inf.activeChallenge || (getBuyableAmount('am', 31).gte(4) && player.inf.activeChallenge))},
        },
        33:{
            title: "Multiplier Superboost",
            costScaling(){
                let scaling = [new Decimal(2).pow(2**14),new Decimal(2).pow(2**14),new Decimal(2)] // base cost, cost scaling, scaling exp
                if (inChallenge('inf',81)) scaling[0] = new Decimal(1/0)
                if (inChallenge('inf',62)){
                    scaling[1] = scaling[1].pow(2)
                    scaling[2] = scaling[2].mul(2)
                }
                return scaling
            },
            cost(x){
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                let cost = Decimal.pow(this.costScaling()[1],x.pow(this.costScaling()[2])).mul(this.costScaling()[0])
                return cost
            },
            canAfford(){
                return player.points.gte(this.cost()) && tmp[this.layer].buyables[this.id].unlocked
            },
            buy(){
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost())
                addBuyables(this.layer, this.id, new Decimal(1))
                player.inf.ic8Time = 0
            },
            bulk(){
                let x = getBuyableAmount(this.layer,this.id)
                if (inChallenge('inf',71)) x = tmp.am.totalLevel
                if (!this.canAfford) return new Decimal(0)
                return player.points.div(this.costScaling()[0]).max(1).log(this.costScaling()[1]).root(this.costScaling()[2]).add(1).min(this.purchaseLimit).sub(x).max(0).floor()
            },
            buyMax(){
                if (!this.canAfford) return
                let bulk = this.bulk()
                if (!hasMilestone('inf',8)) player.points = player.points.sub(this.cost(getBuyableAmount(this.layer,this.id).add(bulk).sub(1)))
                addBuyables(this.layer,this.id,bulk)
                player.inf.ic8Time = 0
            },
            display() {return "Increase <b>Multiplier Boost</b> base<br>Currently: +" + format(buyableEffect(this.layer,this.id))
            + "<br><br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>(ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.cost(),tmp.am.getAMExp))
            + ")<br><br>Level " + formatWhole(getBuyableAmount(this.layer,this.id))},
            effect(x = getBuyableAmount(this.layer,this.id)){
                let strength = new Decimal(1)
                let free = new Decimal(0)
                let total = x.add(free)
                let amount = total.mul(strength)
                let eff = amount.mul(0.02)
                return eff
            },
            unlocked(){return hasUpgrade('inf',74) && (!player.inf.activeChallenge || (getBuyableAmount('am', 32).gte(3) && player.inf.activeChallenge))},
        },
    },
    bars: {
        progressBar: {
            direction: RIGHT,
            width: 600,
            height: 25,
            target(){
                let goal = Decimal.pow(2,1024)
                let step = player.points.log(Decimal.pow(2,1024)).max(1).log(2).ceil()
                if (player.inf.break) goal = goal.pow(Decimal.pow(2, step))
                if (inChallenge('inf',51)) goal = tmp.inf.challenges[51].goal
                return goal
            },
            progress(){return player.points.max(1).log(this.target()).min(1)},
            display(){return "Percentage to " + (player.inf.break?format(this.target())+" " +modInfo.pointsName:"Infinity") + ": " + format(this.progress().mul(100),3) + "% (ETA: " + formatTime(getAMUpgETA(player.points,tmp.am.getAMProd,this.target(),tmp.am.getAMExp)) + ")"},
            fillStyle(){return {"background-color": "green"}},
        },
    },
})