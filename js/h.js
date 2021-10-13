// H0NDE LAYER

addLayer("h", {
    name: "h0nde", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: true,
        points: new Decimal(0),
      points2: new Decimal(0),
      best: new Decimal(0),
      total: new Decimal(0),
      autoUpgrade: false,
      autoBuyable11: false,
      autoBuyable12: false,
      autoBuyable13: false,
      autoBuyable21: false,
      autoBuyable31: false,
      maxBuyable11CD: 0.1,
    }},
    color: "#406da2",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "h0nde powers", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
      let gain = buyableEffect("h",11)
      return gain
    },
    passiveGeneration(){
      return 1
    },
    getNextAt(){
      return ""
    },
    canReset(){
      return false
    },
    update(diff){
      player.points = tmp.h.getAccounts
      player.bestPoints = player.bestPoints.max(player.points)
      player.bestEverh0ndePower = player.bestEverh0ndePower.max(player.h.points)
      player.h.maxBuyable11CD = Math.max(0,player.h.maxBuyable11CD-diff)
      player.h.points2 = player.h.points2.add(tmp.t.getSuperPowSpeed.mul(diff))
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: [
          "main-display",
          ["display-text",
            function(){
              return (player.h.points.gte(new Decimal("1e1000")) ? "+" : "You are gaining ") + format(layers.h.getResetGain()) + (player.h.points.gte(new Decimal("1e1000")) ? " h0nde powers/s" : " h0nde powers per second")
            }
          ],
          function(){
            return player.t.points.gte(1) ? "blank" : ""
          },
          ["display-text",
            function(){
              return player.t.points.gte(1) ? "You have " + format(player.h.points2) + " h0nde super powers (+" + format(tmp.t.getSuperPowSpeed) + "/s), which multiply h0nde powers gain by " + (shiftDown ? "(x+1)" + `<sup>` + format(tmp.h.superPowerEffExp, 3) + `</sup>` + ", softcap at " + format(tmp.h.superPowerEffSCStart) + "x" : format(tmp.h.superPowerEff) + " (Shift click for more info)") : ""
            }
          ],
          function(){
            return player.t.points.gte(1) ? "blank" : ""
          },
          "blank","clickables","buyables","blank",
          ["display-text", function(){
            return !hasMilestone("t",14) ? "" : "Note: You can buy 3rd row of h0nde Upgrades if you are not in Prestige Challenge."
          }],
          "upgrades"
    ],
    superPowerEff(){
      let eff = player.h.points2.add(1).pow(tmp.h.superPowerEffExp)
      if (eff.gte(tmp.h.superPowerEffSCStart)) eff = new Decimal(10).pow(eff.log(10).div(tmp.h.superPowerEffSCStart.log(10)).pow(0.5).mul(tmp.h.superPowerEffSCStart.log(10)))
      return eff
    },
    superPowerEffSCStart(){
      let start = new Decimal("1e900")
      if (hasAchievement("a",74)) start = start.mul(achievementEffect("a",74))
      start = start.mul(buyableEffect("p",12)[1])
      return start
    },
    superPowerEffExp(){
      if (inChallenge("p",42)) return new Decimal(0)
      let exp = new Decimal(20)
      if (hasAchievement("a",62)) exp = exp.add(4)
      if (hasMilestone("t", 5)) exp = exp.add(tmp.t.milestones[5].effect)
      if (hasUpgrade("t",34)) exp = exp.add(upgradeEffect("t",34))
      if (hasChallenge("p",42)) exp = exp.add(challengeEffect("p",42)[0])
      exp = exp.add(buyableEffect("p",12)[0])
      return exp
    },
    doReset(resettingLayer) {
      let keep = ["autoUpgrade","autoBuyable11","autoBuyable12","autoBuyable13","autoBuyable21","autoBuyable31"];
      if (layers[resettingLayer].row > this.row) layerDataReset("h", keep)
    },
    getAccounts(){ // credit to c0vid for this
      let amt = player.h.points.add(1).log(10)
  
      if (amt.lt(1)) return amt
  
      let times = amt.log(tmp.h.getAccmult).plus(1).log(2).floor()
      let a = Decimal.pow(2, times)
  
      let mul = Decimal.pow(tmp.h.getAccmult, times)
      let mul2 = amt.div(Decimal.pow(tmp.h.getAccmult, a.sub(1))).root(a)
  
      return mul.times(mul2)
    },
    getAccmult() { 
      let mul = new Decimal(10)
      if (player.t.unlocked) mul = mul.add(tmp.t.effect[1])
      if (hasUpgrade("h",31)) mul = mul.add(upgradeEffect("h",31))
      return mul
    },
    automate(){
      if (hasMilestone("p",2) && player.h.autoBuyable11 && tmp.h.buyables[11].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[11].buyMax()
      if (hasMilestone("p",3) && player.h.autoBuyable12 && tmp.h.buyables[12].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[12].buyMax()
      if (hasMilestone("p",3) && player.h.autoBuyable13 && tmp.h.buyables[13].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[13].buyMax()
      if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[21].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[21].buyMax()
      if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[22].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[22].buyMax()
      if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[23].unlocked || player.dev.autoAllBuyables) tmp.h.buyables[23].buyMax()
      if (false || player.dev.autoAllBuyables) tmp.h.buyables[31].buyMax()
    },
    buyables: {
      11: {
        title(){return "Generator" + (tmp.h.buyables[31].totalLevel.gt(0) ? `<sup>` + formatWhole(tmp.h.buyables[31].totalLevel.add(1)) + `</sup>` : "")},
        display(){
          return "Produce " + format(tmp.h.buyables[11].effectBase) + " h0nde powers per second, then raise the production by " + format(tmp.h.buyables[11].productionExp, 3) + "." + `<br>` +
          "Currently: " + format(buyableEffect("h",11)) + "/s " + (buyableEffect("h",11).gte(tmp.h.buyables[11].effectCap) ? " (hardcapped)" : "") + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[11].costBase, 2, true) + "×" + format(tmp.h.buyables[11].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[11].cost, 2, true) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 11)) + (tmp.h.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[11].freeLevel)) + (player.p.breakLimit ? "" : " / " + formatWhole(tmp.h.buyables[11].purchaseLimit)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(5)
          if (!inChallenge("p",51)){
            if (hasUpgrade("h",12)) base = base.div(upgradeEffect("h",12))
            base = base.div(buyableEffect("h",13))
          }
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){
          let scaling = new Decimal(1.05)
          if (hasUpgrade("p",34)) scaling = scaling.sub(0.01)
          if (hasUpgrade("p",44)) scaling = scaling.sub(0.005)
          if (hasAchievement("a",71)) scaling = scaling.sub(0.003)
          if (hasMilestone("t",13)) scaling = scaling.sub(0.002)
          if (inChallenge("p",12)) scaling = scaling.pow(69)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          if (x.eq(0)) return new Decimal(0)
          let a = tmp.h.buyables[11].costBase
          let r = tmp.h.buyables[11].costScaling
          return a.mul(r.pow(x.sub(1)))
        },
        purchaseLimit(){
          let lim = new Decimal(2500)
          if (player.p.breakLimit) lim = new Decimal(Infinity)
          return lim
        },
        freeLevel(){
          if (inChallenge("p",12)) return new Decimal(0)
          let free = new Decimal(0)
          if (hasUpgrade("h",15)) free = free.add(upgradeEffect("h",15))
          if (hasAchievement("a",34)) free = free.add(1)
          if (hasChallenge("p",12) && getBuyableAmount("h", 11).gt(0)) free = free.add(challengeEffect("p",12))
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 11).add(tmp.h.buyables[11].freeLevel)
        },
        multiBoostDensity(){
          let d = new Decimal(50)
          if (hasUpgrade("h",13)) d = d.div(2)
          if (hasUpgrade("p",22)) d = d.div(1.25)
          if (hasUpgrade("t",63)) d = d.sub(8)
          return d
        },
        multiBoostMultiplier(){
          if (inChallenge("p",22)) return new Decimal(1)
          let m = new Decimal(1)
          if (hasUpgrade("h",11)) m = m.add(1)
          if (hasUpgrade("h",13)) m = m.sub(0.4)
          if (hasAchievement("a",25)) m = m.add(0.1)
          if (hasAchievement("a",32)) m = m.add(achievementEffect("a",32))
          if (hasUpgrade("p",24)) m = m.add(0.1)
          if (hasUpgrade("p",32)) m = m.add(upgradeEffect("p",32))
          if (hasChallenge("p",22)) m = m.add(0.2)
          if (hasUpgrade("t",52)) m = m.add(upgradeEffect("t",52))
          if (hasMilestone("t",12)) m = m.add(tmp.t.milestones[12].effect)
          m = m.add(buyableEffect("h",31)[0])
  
          if (inChallenge("p",51)) m = m.pow(9)
          return m
        },
        multiBoostAmountSCStart(){
          let s = new Decimal(100)
          if (hasUpgrade("p",35)) s = s.add(40)
          if (hasUpgrade("p",45)) s = s.add(20)
          return s
        },
        effectBoost(){
          let a = tmp.h.buyables[11].totalLevel // current amount
          let d = tmp.h.buyables[11].multiBoostDensity // for every d level, boost production
          let s = tmp.h.buyables[11].multiBoostAmountSCStart // after s boosts, effect start to softcap
          let n = a.div(d).floor() // multi boost times
          if (n.gte(s)) n = n.div(s).pow(0.5).mul(s)
          let x = tmp.h.buyables[11].multiBoostMultiplier.pow(n) // base prod with multi boost
          return x
        },
        effectBase(){
          let x = tmp.h.buyables[11].effectBoost
          x = x.mul(buyableEffect("h",12))
          if (hasAchievement("a", 12)) x = x.mul(achievementEffect("a", 12))
          if (hasAchievement("a", 14)) x = x.mul(achievementEffect("a", 14))
          if (hasAchievement("a", 22)) x = x.mul(achievementEffect("a", 22))
          if (hasAchievement("a", 24)) x = x.mul(achievementEffect("a", 24))
          if (player.p.unlocked) x = x.mul(tmp.p.effect)
          if (hasUpgrade("p", 11)) x = x.mul(upgradeEffect("p", 11))
          if (hasUpgrade("p", 12)) x = x.mul(upgradeEffect("p", 12))
          if (hasUpgrade("p", 15)) x = x.mul(upgradeEffect("p", 15))
          if (hasUpgrade("p", 25)) x = x.mul(upgradeEffect("p", 25)[1])
          x = x.mul(buyableEffect("h",22))
          if (hasAchievement("a", 52)) x = x.mul(69)
          if (player.t.unlocked) x = x.mul(tmp.h.superPowerEff)
          if (hasMilestone("t", 2)) x = x.mul(tmp.t.milestones[2].effect)
          if (hasUpgrade("t", 33)) x = x.mul(upgradeEffect("t", 33))
          return x
        },
        effectExp(){
          if (inChallenge("p",22)) return new Decimal(0)
          let e = new Decimal(1)
          e = e.add(buyableEffect("h",21))
          if (hasUpgrade("p",13)) e = e.add(0.7)

          if (hasUpgrade("t",22)) e = e.mul(1.2)
          e = e.mul(new Decimal(1).add(buyableEffect("h",31)[1]))
          return e
        },
        effectMul(){
          let x = tmp.h.buyables[11].totalLevel
          x = x.pow(tmp.h.buyables[11].effectExp)
          return x
        },
        productionExp(){
          let e = new Decimal(1)
          e = e.add(buyableEffect("h",23))
          if (hasMilestone("t",11)) e = e.add(tmp.t.milestones[11].effect)
          if (hasUpgrade("t",72)) e = e.mul(upgradeEffect("t",72))
          if (inChallenge("p",11)) e = e.mul(0.25)
          return e
        },
        effect(){
          let x = tmp.h.buyables[11].effectMul.mul(tmp.h.buyables[11].effectBase).pow(tmp.h.buyables[11].productionExp)
          if (inChallenge("p",62) && x.gte(10)) x = new Decimal(10).pow(x.log(10).pow(0.5))
          if (inChallenge("p",52) && x.gte(1e100)) x = x.log(10).pow(50)
          if (hasUpgrade("t",54) && inChallenge("p",52) && !inChallenge("p",61)) x = x.pow(1.1)
          if (hasUpgrade("t",62) && inChallenge("p",61)) x = x.pow(1.265)
          if (x.gte(tmp.h.buyables[11].effectCap)) x = tmp.h.buyables[11].effectCap
          return x
        },
        effectCap(){
          if (player.dev.uncapProduction) return new Decimal(10).tetrate(Number.MAX_VALUE)
          let tetr = new Decimal(5)
          if (hasUpgrade("t",75)) tetr = tetr.add(0.0125)
          let x = Decimal.tetrate(2, tetr)
          return x
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[11].cost)
        },
        buy(){
          let cost = tmp.h.buyables[11].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 11, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[11].purchaseLimit.sub(getBuyableAmount("h", 11))
          let bulk
          let a = tmp.h.buyables[11].cost
          let r = tmp.h.buyables[11].costScaling
          let x = player.h.points
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else{
            if (!hasMilestone("p",5)) bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
            else bulk = x.div(a).log(r).add(1).floor()
          }
          bulk = bulk.min(maxBulk)
          let cost = new Decimal(0)
          if (!a.eq(0) && !hasMilestone("p",5)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
          addBuyables("h", 11, bulk)
          player.h.points = player.h.points.sub(cost)
        },
        unlocked(){ return true},
      },
      12: {
        title: "Multiplier",
        display(){
          return "Increase h0nde powers gain by " + format(tmp.h.buyables[12].effectBase.mul(100)) + "%, then raise this effect by " + format(tmp.h.buyables[12].effectExp) + "." + `<br>` +
          "Currently: " + (shiftDown ? "(1+" + format(tmp.h.buyables[12].effectBase) + "x)^" + format(tmp.h.buyables[12].effectExp) : format(buyableEffect("h",12)) + "x") + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[12].costBase, 2, true) + "×" + format(tmp.h.buyables[12].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[12].cost) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 12)) + (tmp.h.buyables[12].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[12].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(1e7)
          if (!inChallenge("p",51)){
            if (hasUpgrade("h",22)) base = base.div(buyableEffect("h",13))
          }
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){
          let scaling = new Decimal(2)
          if (hasAchievement("a",23)) scaling = scaling.mul(0.9)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[12].costBase
          let r = tmp.h.buyables[12].costScaling
          return a.mul(r.pow(x))
        },
        freeLevel(){
          let free = new Decimal(0)
          if (hasUpgrade("h",21)) free = free.add(upgradeEffect("h",21))
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 12).add(tmp.h.buyables[12].freeLevel)
        },
        effectBase(){
          let x = new Decimal(0.5)
          if (hasAchievement("a",21)) x = x.add(achievementEffect("a", 21))
          if (hasUpgrade("h",24)) x = x.mul(2)
          return x
        },
        effectExp(){
          if (inChallenge("p",21)) return new Decimal(0)
          let e = new Decimal(1)
          if (hasAchievement("a",15)) e = e.mul(2)
          if (hasUpgrade("h",21)) e = e.mul(1.25)
          if (hasUpgrade("h",23)) e = e.mul(1.5)
          if (hasUpgrade("p",14)) e = e.mul(1.25)
          if (hasUpgrade("p",33)) e = e.mul(2)
          if (hasUpgrade("t",23)) e = e.mul(2)
          if (hasChallenge("p",21)) e = e.add(challengeEffect("p",21))
          return e
        },
        effect(){
          let x = tmp.h.buyables[12].totalLevel.mul(tmp.h.buyables[12].effectBase).add(1)
          x = x.pow(tmp.h.buyables[12].effectExp)
          return x
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[12].cost)
        },
        buy(){
          let cost = tmp.h.buyables[12].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 12, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[12].purchaseLimit.sub(getBuyableAmount("h", 12))
          let bulk
          let a = tmp.h.buyables[12].cost
          let r = tmp.h.buyables[12].costScaling
          let x = player.h.points
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else{
            if (!hasMilestone("p",5)) bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
            else bulk = x.div(a).log(r).add(1).floor()
          }
          bulk = bulk.min(maxBulk)
          let cost = new Decimal(0)
          if (!a.eq(0) && !hasMilestone("p",5)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
          addBuyables("h", 12, bulk)
          player.h.points = player.h.points.sub(cost)
        },
        unlocked(){ return hasAchievement("a",14)},
      },
      13: {
        title: "Divider",
        display(){
          return "Increase Generator buyable cost divider by " + format(tmp.h.buyables[13].effectBase) + ", then raise this effect by " + format(tmp.h.buyables[13].effectExp) + "." + `<br>` +
          "Currently: " + (shiftDown ? "(1+" + format(tmp.h.buyables[13].effectBase) + "x)^" + format(tmp.h.buyables[13].effectExp) : "/" + format(buyableEffect("h",13))) + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[13].costBase, 2, true) + "×" + format(tmp.h.buyables[13].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[13].cost) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 13)) + (tmp.h.buyables[13].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[13].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(1e15)
          if (!inChallenge("p",51)){
            if (hasAchievement("a",53)) base = base.div(upgradeEffect("h",12))
          }
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){
          let scaling = new Decimal(5)
          if (hasAchievement("a",23)) scaling = scaling.mul(0.9)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[13].costBase
          let r = tmp.h.buyables[13].costScaling
          return a.mul(r.pow(x))
        },
        freeLevel(){
          let free = new Decimal(0)
          if (hasUpgrade("h",25)) free = free.add(upgradeEffect("h",25))
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 13).add(tmp.h.buyables[13].freeLevel)
        },
        effectBase(){
          let x = new Decimal(1)
          if (hasUpgrade("p",21)) x = x.add(upgradeEffect("p",21))
          return x
        },
        effectExp(){
          if (inChallenge("p",21)) return new Decimal(0)
          let e = new Decimal(2)
          if (hasUpgrade("h",23)) e = e.mul(1.5)
          if (hasAchievement("a",35)) e = e.mul(2)
          if (hasAchievement("a",45)) e = e.mul(1.7)
          if (hasUpgrade("t",23)) e = e.mul(2)
          if (hasChallenge("p",21)) e = e.add(challengeEffect("p",21))
          return e
        },
        effect(){
          let x = tmp.h.buyables[13].totalLevel.mul(tmp.h.buyables[13].effectBase).add(1)
          x = x.pow(tmp.h.buyables[13].effectExp)
          return x
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[13].cost)
        },
        buy(){
          let cost = tmp.h.buyables[13].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 13, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[13].purchaseLimit.sub(getBuyableAmount("h", 13))
          let bulk
          let a = tmp.h.buyables[13].cost
          let r = tmp.h.buyables[13].costScaling
          let x = player.h.points
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else{
            if (!hasMilestone("p",5)) bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
            else bulk = x.div(a).log(r).add(1).floor()
          }
          bulk = bulk.min(maxBulk)
          let cost = new Decimal(0)
          if (!a.eq(0) && !hasMilestone("p",5)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
          addBuyables("h", 13, bulk)
          player.h.points = player.h.points.sub(cost)
        },
        unlocked(){ return hasAchievement("a",21)},
      },
      21: {
        title: "Power",
        display(){
          return "Increase Generator buyable level to h0nde power production exponent by " + format(tmp.h.buyables[21].effectBase) + "." + `<br>` +
          "Currently: " + (shiftDown ? format(tmp.h.buyables[21].effectBase) + "x, softcap at " + format(tmp.h.buyables[21].effectSoftcapStart) : "+" + format(buyableEffect("h",21)) + (buyableEffect("h",21).gte(tmp.h.buyables[21].effectSoftcapStart) ? " (softcapped)" : "")) + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[21].costBase, 2, true) + "^" + format(tmp.h.buyables[21].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[21].cost) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 21)) + (tmp.h.buyables[21].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[21].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(5e33)
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(1.2)
          if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[21].costBase
          let r = tmp.h.buyables[21].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          if (hasMilestone("p",4)) free = free.add(1)
          if (hasUpgrade("p",41)) free = free.add(2)
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 21).add(tmp.h.buyables[21].freeLevel)
        },
        effectBase(){
          if (inChallenge("p",21)) return new Decimal(0)
          let x = new Decimal(0.5)
          if (hasUpgrade("p",31)) x = x.add(0.2)
          if (hasUpgrade("t",33)) x = x.add(0.1)
          if (hasUpgrade("t",44)) x = x.add(upgradeEffect("t",44))
          return x
        },
        effect(){
          let x = tmp.h.buyables[21].totalLevel.mul(tmp.h.buyables[21].effectBase)
          if (x.gte(tmp.h.buyables[21].effectSoftcapStart)) x = x.div(tmp.h.buyables[21].effectSoftcapStart).pow(0.5).mul(tmp.h.buyables[21].effectSoftcapStart)
          return x
        },
        effectSoftcapStart(){
          let start = new Decimal(10)
          if (hasUpgrade("t",51)) start = start.add(10)
          return start
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[21].cost)
        },
        buy(){
          let cost = tmp.h.buyables[21].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 21, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[21].purchaseLimit.sub(getBuyableAmount("h", 21))
          let bulk
          let a = tmp.h.buyables[21].cost.log(10)
          let r = tmp.h.buyables[21].costScaling
          let x = player.h.points.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("h", 21, bulk)
          if (!hasMilestone("p",5)) player.h.points = player.h.points.sub(new Decimal(10).pow(cost))
        },
        unlocked(){ return hasAchievement("a",24)},
      },
      22: {
        title: "Booster",
        display(){
          return "Multiply h0nde power gain by " + format(tmp.h.buyables[22].effectBase) + "." + `<br>` +
          "Currently: " + (shiftDown ? format(tmp.h.buyables[22].effectBase) + "^x^" + format(tmp.h.buyables[22].effectExp) + ", softcap at " + format(tmp.h.buyables[22].effectSoftcapStart) : format(buyableEffect("h",22)) + "x" + (buyableEffect("h",22).gte(tmp.h.buyables[22].effectSoftcapStart) ? " (softcapped)" : "")) + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[22].costBase, 2, true) + "^" + format(tmp.h.buyables[22].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[22].cost) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 22)) + (tmp.h.buyables[22].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[22].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(1e140)
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(1.1)
          if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[22].costBase
          let r = tmp.h.buyables[22].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          if (hasUpgrade("p",41)) free = free.add(2)
          if (hasAchievement("a",55)) free = free.add(2)
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 22).add(tmp.h.buyables[22].freeLevel)
        },
        effectBase(){
          if (inChallenge("p",21)) return new Decimal(1)
          let x = new Decimal(1000)
          if (hasChallenge("p", 11)) x = x.mul(10)
          if (hasUpgrade("p", 42)) x = x.mul(10)
          if (hasAchievement("a", 63)) x = x.mul(10)
          if (hasUpgrade("t", 42)) x = x.mul(upgradeEffect("t", 42))
          if (hasChallenge("p",62)) x = (x.pow(new Decimal(1).add(challengeEffect("p",62)[1])) || decimalZero)
          return x
        },
        effectExp(){
          let exp = new Decimal(1)
          if (hasUpgrade("t",31)) exp = exp.add(0.1)
          return exp
        },
        effect(){
          let x = tmp.h.buyables[22].effectBase.pow(tmp.h.buyables[22].totalLevel.pow(tmp.h.buyables[22].effectExp))
          if (x.gte(tmp.h.buyables[22].effectSoftcapStart)) x = new Decimal(10).pow(x.log(10).div(tmp.h.buyables[22].effectSoftcapStart.log(10)).pow(0.5).mul(tmp.h.buyables[22].effectSoftcapStart.log(10)))
          return x
        },
        effectSoftcapStart(){
          let start = new Decimal("1e1300")
          return start
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[22].cost)
        },
        buy(){
          let cost = tmp.h.buyables[22].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 22, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[22].purchaseLimit.sub(getBuyableAmount("h", 22))
          let bulk
          let a = tmp.h.buyables[22].cost.log(10)
          let r = tmp.h.buyables[22].costScaling
          let x = player.h.points.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("h", 22, bulk)
          if (!hasMilestone("p",5)) player.h.points = player.h.points.sub(new Decimal(10).pow(cost))
        },
        unlocked(){ return hasAchievement("a",41)},
      },
      23: {
        title: "Exponentiator",
        display(){
          return "Increase h0nde power gain exponent by " + format(tmp.h.buyables[23].effectBase) + "." + `<br>` +
          "Currently: " + (shiftDown ? format(tmp.h.buyables[23].effectBase) + "x, after level " + formatWhole(tmp.h.buyables[23].effectLevelSoftcapStart) + ", the level amount will be divided by " + format(tmp.h.buyables[23].effectLevelSoftcapStrength) + ", after level " + formatWhole(tmp.h.buyables[23].effectLevelSoftcapStart2) + ", the level amount will be rooted by " + format(tmp.h.buyables[23].effectLevelSoftcapStrength2) : "+" + format(buyableEffect("h",23),3) + (tmp.h.buyables[23].totalLevel.gt(tmp.h.buyables[23].effectLevelSoftcapStart) ? " (softcapped)" + (tmp.h.buyables[23].totalLevel.gt(tmp.h.buyables[23].effectLevelSoftcapStart2) ? "^2" : "") : "")) + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.h.buyables[23].costBase, 2, true) + "^" + format(tmp.h.buyables[23].costScaling, 3) + "^x" : "Cost: " + format(tmp.h.buyables[23].cost) + " h0nde power") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 23)) + (tmp.h.buyables[23].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[23].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal("1e500")
          if (inChallenge("p",51)) base = base.pow(99)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(1.6)
          if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
          if (inChallenge("p",51)) scaling = scaling.pow(99)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[23].costBase
          let r = tmp.h.buyables[23].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          if (hasUpgrade("t",65)) free = free.add(1)
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 23).add(tmp.h.buyables[23].freeLevel)
        },
        effectBase(){
          if (inChallenge("p",21)) return new Decimal(0)
          let x = new Decimal(0.05)
          if (hasUpgrade("t",25)) x = x.add(0.003)
          return x
        },
        effectLevelSoftcapStart(){
          let start = new Decimal(3)
          if (hasChallenge("p",61)) start = start.add(1)
          return start
        },
        effectLevelSoftcapStrength(){
          let eff = new Decimal(3)
          if (hasUpgrade("t",65)) eff = eff.sub(0.6)
          return eff
        },
        effectLevelSoftcapStart2(){
          let start = new Decimal(9)
          return start
        },
        effectLevelSoftcapStrength2(){
          let eff = new Decimal(3)
          return eff
        },
        effect(){
          let lvl = tmp.h.buyables[23].totalLevel
          let start = tmp.h.buyables[23].effectLevelSoftcapStart
          let start2 = tmp.h.buyables[23].effectLevelSoftcapStart2
          let strength = tmp.h.buyables[23].effectLevelSoftcapStrength
          let strength2 = tmp.h.buyables[23].effectLevelSoftcapStrength2
          if (lvl.gte(start2)) lvl = lvl.div(start2).root(strength2).mul(start2)
          if (lvl.gte(start)) lvl = lvl.sub(start).div(strength).add(start)
          let x = tmp.h.buyables[23].effectBase.mul(lvl)
          return x
        },
        canAfford(){
          return player.h.points.gte(tmp.h.buyables[23].cost)
        },
        buy(){
          let cost = tmp.h.buyables[23].cost
          if (player.h.points.lt(cost)) return
          addBuyables("h", 23, new Decimal(1))
          if (!hasMilestone("p",5)) player.h.points = player.h.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[23].purchaseLimit.sub(getBuyableAmount("h", 23))
          let bulk
          let a = tmp.h.buyables[23].cost.log(10)
          let r = tmp.h.buyables[23].costScaling
          let x = player.h.points.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("h", 23, bulk)
          if (!hasMilestone("p",5)) player.h.points = player.h.points.sub(new Decimal(10).pow(cost))
        },
        unlocked(){ return hasAchievement("a",52)},
      },
      31: {
        title: "Generator Enhancer",
        display(){
          return "Increase Generator buyable multi boost by " + format(tmp.h.buyables[31].effectBase) + " and exponent multi by " + format(tmp.h.buyables[31].effectBase2) + "." + `<br>` +
          "Currently: +" + format(buyableEffect("h",31)[0]) + ", +" + format(buyableEffect("h",31)[1]) + `x<br>` + `<br>` + 
          (shiftDown ? "Require Formula:" + `<br>` + format(tmp.h.buyables[31].costBase, 2, true) + "×" + format(tmp.h.buyables[31].costScaling, 3) + "^x" : "Require: " + format(tmp.h.buyables[31].cost) + " non-free Generator buyable level") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("h", 31)) + (tmp.h.buyables[31].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[31].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal(1e6)
          return base 
        },
        costScaling(){
          let scaling = new Decimal(2)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.h.buyables[31].costBase
          let r = tmp.h.buyables[31].costScaling
          return a.mul(r.pow(x))
        },
        freeLevel(){
          let free = new Decimal(0)
          return free
        },
        totalLevel(){
          return getBuyableAmount("h", 31).add(tmp.h.buyables[31].freeLevel)
        },
        effectBase(){
          let x = new Decimal(1)
          return x
        },
        effectBase2(){
          let x = new Decimal(0.5)
          return x
        },
        effect(){
          let x = [tmp.h.buyables[31].effectBase.mul(tmp.h.buyables[31].totalLevel),tmp.h.buyables[31].effectBase2.mul(tmp.h.buyables[31].totalLevel)]
          return x
        },
        canAfford(){
          return player.h.buyables[11].gte(tmp.h.buyables[31].cost)
        },
        buy(){
          let cost = tmp.h.buyables[31].cost
          if (player.h.buyables[11].lt(cost)) return
          addBuyables("h", 31, new Decimal(1))
        },
        buyMax(){
          let maxBulk = tmp.h.buyables[31].purchaseLimit.sub(getBuyableAmount("h", 31))
          let bulk
          let a = tmp.h.buyables[31].cost
          let r = tmp.h.buyables[31].costScaling
          let x = player.h.buyables[11]
          if (x.lt(a)) return
          bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          addBuyables("h", 31, bulk)
        },
        unlocked(){ return hasMilestone("t",13)},
      },
    },
    clickables: {
      11: {
        title() {return "Buy max Generator buyable"},
        display() {return "Cooldown: " + formatWhole(player.h.maxBuyable11CD*1000) + "ms"},
        canClick(){return true},
        onClick(){
          if (player.h.maxBuyable11CD <= 1e-10){
            if (player.h.points.gte(tmp.h.buyables[11].cost)) player.h.maxBuyable11CD = 0.1
            layers.h.buyables[11].buyMax()
          }
        },
        onHold(){
          if (player.h.maxBuyable11CD <= 1e-10){
            if (player.h.points.gte(tmp.h.buyables[11].cost)) player.h.maxBuyable11CD = 0.1
            layers.h.buyables[11].buyMax()
          }
        },
        unlocked(){return hasAchievement("a",22) && !hasMilestone("p",2)},
     },
     12: {
      title() {return "Buy max Multiplier and Divider buyable"},
      canClick(){return true},
        onClick(){
          layers.h.buyables[12].buyMax()
          layers.h.buyables[13].buyMax()
        },
        onHold(){
          layers.h.buyables[12].buyMax()
          layers.h.buyables[13].buyMax()
        },
        unlocked(){return hasAchievement("a",25) && !hasMilestone("p",3)},
      },
    },
    autoUpgrade(){
      return hasMilestone("p",1) && player.h.autoUpgrade
    },
    upgrades: {
      11: {
        title: "Doubler",
        description(){return "For every 50 Generator buyable levels, double h0nde power gain" + (hasAchievement("a",31) ? "." : ", you need 100 Generator buyable level to buy this upgrade)")},
        cost: new Decimal(10000),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return hasAchievement("a",13)
        },
        canAfford(){
          return (tmp.h.buyables[11].totalLevel.gte(100) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      12: {
        title: "Cheaper",
        description(){return "Divide Generator buyable cost based on h0nde discord accounts" + (hasAchievement("a",31) ? "." : ", you need 175 Generator buyable level to buy this upgrade")},
        cost: new Decimal(2e5),
        effect(){
          let eff = player.points.add(1)
          if (hasChallenge("p", 31)) eff = new Decimal(10).pow(eff).max(eff)
          if (hasMilestone("t",14)) eff = eff.pow(11)
          return eff
        },
        effectDisplay(){
          return shiftDown ? (hasChallenge("p", 31) ? (hasMilestone("t",14)? "1e11^(x+1)" : "10^(x+1)") : (hasMilestone("t",14)? "(x+1)^11" : "x+1")) : "/" + format(upgradeEffect("h",12))
        },
        unlocked(){
          return hasAchievement("a",13)
        },
        canAfford(){
          return (tmp.h.buyables[11].totalLevel.gte(175) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      13: {
        title: "Faster",
        description(){return "Generator buyable multiplier boost occur twice as fast, but the base multiplier is reduced by 0.4" + (hasAchievement("a",31) ? "." : ", you need 3 Multiplier buyable level to buy this upgrade")},
        cost: new Decimal(5e7),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return hasAchievement("a",13)
        },
        canAfford(){
          return (tmp.h.buyables[12].totalLevel.gte(3) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      14: {
        title: "Stronger",
        description(){return "An Alt account achievement reward is squared" + (hasAchievement("a",31) ? "." : ", you need 16 Multiplier buyable level to buy this upgrade")},
        cost: new Decimal(1e12),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return hasAchievement("a",13)
        },
        canAfford(){
          return (tmp.h.buyables[12].totalLevel.gte(16) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      15: {
        title: "Extra",
        description(){return "Each Multiplier buyable level give a free level on Generator buyable" + (hasAchievement("a",31) ? "." : ", you need 3 Divider buyable level to buy this upgrade")},
        cost: new Decimal(5e16),
        effect(){
          let eff = tmp.h.buyables[12].totalLevel
          return eff
        },
        unlocked(){
          return hasAchievement("a",13)
        },
        canAfford(){
          return (tmp.h.buyables[13].totalLevel.gte(3) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      21: {
        title: "Extra 2",
        description(){return "Each Divider buyable level give a free level on Multiplier buyable, and Multiplier buyable boost ^1.25" + (hasAchievement("a",31) ? "." : ", you need 900 Generator buyable level to buy this upgrade")},
        cost: new Decimal(5e17),
        effect(){
          let eff = tmp.h.buyables[13].totalLevel
          return eff
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 1) >= 5
        },
        canAfford(){
          return (tmp.h.buyables[11].totalLevel.gte(900) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      22: {
        title: "Cheaper 2",
        description(){return "Divider buyable divide the cost of Multiplier buyable" + (hasAchievement("a",31) ? "." : ", you need 60 Multiplier buyable level to buy this upgrade")},
        cost: new Decimal(5e21),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 1) >= 5
        },
        canAfford(){
          return (tmp.h.buyables[12].totalLevel.gte(60) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      23: {
        title: "Super MultiDivider",
        description(){return "Raise Multiplier and Divider buyable effect by 1.5" + (hasAchievement("a",31) ? "." : ", you need 85 Multiplier buyable level to buy this upgrade")},
        cost: new Decimal(1e23),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 1) >= 5
        },
        canAfford(){
          return (tmp.h.buyables[12].totalLevel.gte(85) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      24: {
        title: "Doubler 2",
        description(){return "Double the base of Multiplier buyable" + (hasAchievement("a",31) ? "." : ", you need 35 Divider buyable level to buy this upgrade")},
        cost: new Decimal(5e37),
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 1) >= 5
        },
        canAfford(){
          return (tmp.h.buyables[13].totalLevel.gte(35) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      25: {
        title: "New Layer",
        description(){return "Unlock a new Layer" + (hasAchievement("a",31) ? ", each Power buyable level give " + format(tmp.h.upgrades[25].effectBase) +" free levels on Divider buyable." : ", you need 3 Power buyable level and 2,500 non-free Generator buyable level to buy this upgrade")},
        cost: new Decimal(1e50),
        effect(){
          let base = new Decimal(2)
          if (hasAchievement("a",34)) base = base.mul(2)
          let eff = hasAchievement("a",31) ? tmp.h.buyables[21].totalLevel.mul(base) : new Decimal(0)
          return eff
        },
        effectBase(){
          let base = new Decimal(2)
          if (hasAchievement("a",34)) base = base.mul(2)
          return base
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 1) >= 5
        },
        canAfford(){
          return ((tmp.h.buyables[21].totalLevel.gte(3) && getBuyableAmount("h",11).gte(2500)) || hasAchievement("a",31)) && !inChallenge("p",31)
        },
      },
      31: {
        title: "2^^5",
        description(){return "Increase h0nde discord accounts sqrt multi by 0.03625"},
        cost: Decimal.pow(2,Decimal.pow(2,16)),
        effect(){
          let eff = new Decimal(0.03625)
          return eff
        },
        unlocked(){
          return getBoughtUpgradesRow("h", 2) >= 5 && hasMilestone("t",14)
        },
        canAfford(){
          return !player.p.activeChallenge
        },
      },
    },
  })