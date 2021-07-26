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
    maxBuyable11CD: 0.1,
  }},
  color: "#4BDC13",
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
    player.h.maxBuyable11CD = Math.max(0,player.h.maxBuyable11CD-diff)
    player.h.points2 = player.h.points2.add(tmp.t.getSuperPowSpeed.mul(diff))
  },
  row: 0, // Row the layer is in on the tree (0 is the first row)
  layerShown(){return true},
  tabFormat: {
    "Info": {
      content: [
        ["infobox", "info"],["infobox", "info2"]
      ],
    },
    "Upgrades": {
      content: [
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
            return player.t.points.gte(1) ? "You have " + format(player.h.points2) + " h0nde super powers (+" + format(tmp.t.getSuperPowSpeed) + "/s), which multiply h0nde powers gain by " + format(tmp.h.superPowerEff) + " ((x+1)^" + format(tmp.h.superPowerEffExp) + ")" : ""
          }
        ],
        function(){
          return player.t.points.gte(1) ? "blank" : ""
        },
        "blank","clickables","buyables","blank","upgrades"
      ],
    },
  },
  superPowerEff(){
    let eff = player.h.points2.add(1).pow(tmp.h.superPowerEffExp)
    return eff
  },
  superPowerEffExp(){
    let exp = new Decimal(20)
    if (hasAchievement("a",62)) exp = exp.add(4)
    if (hasMilestone("t", 5)) exp = exp.add(tmp.t.milestones[5].effect)
    if (hasUpgrade("t",34)) exp = exp.add(upgradeEffect("t",34))
    return exp
  },
  doReset(resettingLayer) {
    let keep = ["autoUpgrade","autoBuyable11","autoBuyable12","autoBuyable13","autoBuyable21"];
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
    return mul
  },
  infoboxes: {
    info: {
      title: "Info",
      body() {
        return "At June 7, 2021, a ton of twitter.com/h0nde discord account joined many servers, they just attempt to raid the server, however they got banned later." + `<br>` +
        "1 month later, I created this game, simulate the h0nde discord account creation, and try to get even more h0nde discord account then previous."
      },
      unlocked(){return true},
    },
    info2: {
      title: "How to create h0nde discord account",
      body() {
        return "For every OoM of h0nde power, a new h0nde discord account will be created, however, for every " + format(tmp.h.getAccmult) + "x h0nde discord accounts, the account amount will square rooted." + `<br>` +
        "Note: It is possible to have decimal amount of accounts."
      },
      unlocked(){return player.h.buyables[11].gt(0)},
    },
  },
  automate(){
    if (hasMilestone("p",2) && player.h.autoBuyable11 && tmp.h.buyables[11].unlocked) tmp.h.buyables[11].buyMax()
    if (hasMilestone("p",3) && player.h.autoBuyable12 && tmp.h.buyables[12].unlocked) tmp.h.buyables[12].buyMax()
    if (hasMilestone("p",3) && player.h.autoBuyable13 && tmp.h.buyables[13].unlocked) tmp.h.buyables[13].buyMax()
    if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[21].unlocked) tmp.h.buyables[21].buyMax()
    if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[22].unlocked) tmp.h.buyables[22].buyMax()
    if (hasMilestone("p",4) && player.h.autoBuyable21 && tmp.h.buyables[23].unlocked) tmp.h.buyables[23].buyMax()
  },
  buyables: {
    11: {
      title: "Generator",
      display(){
        return "Produce " + format(tmp.h.buyables[11].effectBase) + " h0nde powers per second, then raise the production by " + format(tmp.h.buyables[11].productionExp, 3) + "." + `<br>` +
        "Currently: " + format(buyableEffect("h",11)) + "/s" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[11].cost, 2, true) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 11)) + (tmp.h.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[11].freeLevel)) + (player.p.breakLimit ? "" : " / " + formatWhole(tmp.h.buyables[11].purchaseLimit)) + `<br>` +
        format(tmp.h.buyables[11].multiBoostMultiplier) + "x production boost counts: " + formatWhole(tmp.h.buyables[11].totalLevel.div(tmp.h.buyables[11].multiBoostDensity).floor()) + 
        " (Next at: " + formatWhole(tmp.h.buyables[11].totalLevel) + "/" + formatWhole(tmp.h.buyables[11].totalLevel.div(tmp.h.buyables[11].multiBoostDensity).add(1e-10).ceil().mul(tmp.h.buyables[11].multiBoostDensity)) + ")" + `<br>` +
        "h0nde power production multi from this buyable: " + format(tmp.h.buyables[11].effectMul) + " (Exponent: " + format(tmp.h.buyables[11].effectExp) + ")"
      },
      costBase(){
        let base = new Decimal(5)
        if (hasUpgrade("h",12)) base = base.div(upgradeEffect("h",12))
        base = base.div(buyableEffect("h",13))
        return base 
      },
      costScaling(){
        let scaling = new Decimal(1.05)
        if (hasUpgrade("p",34)) scaling = scaling.sub(0.01)
        if (hasUpgrade("p",44)) scaling = scaling.sub(0.005)
        if (inChallenge("p",12)) scaling = scaling.pow(69)
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
        if (inChallenge("p",11)) e = e.mul(0.25)
        return e
      },
      effect(){
        let x = tmp.h.buyables[11].effectMul.mul(tmp.h.buyables[11].effectBase).pow(tmp.h.buyables[11].productionExp)
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
        "Currently: " + format(buyableEffect("h",12)) + "x" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[12].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 12)) + (tmp.h.buyables[12].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[12].freeLevel))
      },
      costBase(){
        let base = new Decimal(1e7)
        if (hasUpgrade("h",22)) base = base.div(buyableEffect("h",13))
        return base 
      },
      costScaling(){
        let scaling = new Decimal(2)
        if (hasAchievement("a",23)) scaling = scaling.mul(0.9)
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
        "Currently: /" + format(buyableEffect("h",13)) + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[13].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 13)) + (tmp.h.buyables[13].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[13].freeLevel))
      },
      costBase(){
        let base = new Decimal(1e15)
        if (hasAchievement("a",53)) base = base.div(upgradeEffect("h",12))
        return base 
      },
      costScaling(){
        let scaling = new Decimal(5)
        if (hasAchievement("a",23)) scaling = scaling.mul(0.9)
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
        "Currently: +" + format(buyableEffect("h",21)) + (buyableEffect("h",21).gte(tmp.h.buyables[21].effectSoftcapStart) ? " (softcapped)" : "") + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[21].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 21)) + (tmp.h.buyables[21].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[21].freeLevel))
      },
      costBase(){
        let base = new Decimal(5e33)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(1.2)
        if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
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
        return x
      },
      effect(){
        let x = tmp.h.buyables[21].totalLevel.mul(tmp.h.buyables[21].effectBase)
        if (x.gte(tmp.h.buyables[21].effectSoftcapStart)) x = x.div(tmp.h.buyables[21].effectSoftcapStart).pow(0.5).mul(tmp.h.buyables[21].effectSoftcapStart)
        return x
      },
      effectSoftcapStart(){
        let start = new Decimal(10)
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
        "Currently: " + format(buyableEffect("h",22)) + "x" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[22].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 22)) + (tmp.h.buyables[22].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[22].freeLevel))
      },
      costBase(){
        let base = new Decimal(1e140)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(1.1)
        if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
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
        return x
      },
      effectExp(){
        let exp = new Decimal(1)
        if (hasUpgrade("t",31)) exp = exp.add(0.1)
        return exp
      },
      effect(){
        let x = tmp.h.buyables[22].effectBase.pow(tmp.h.buyables[22].totalLevel.pow(tmp.h.buyables[22].effectExp))
        return x
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
      title: "Exponentator",
      display(){
        return "Increase h0nde power gain exponent by " + format(tmp.h.buyables[23].effectBase) + "." + `<br>` +
        "Currently: +" + format(buyableEffect("h",23),3) + (tmp.h.buyables[23].totalLevel.gt(tmp.h.buyables[23].effectLevelSoftcapStart) ? " (softcapped)" : "") + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[23].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 23)) + (tmp.h.buyables[23].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[23].freeLevel))
      },
      costBase(){
        let base = new Decimal("1e500")
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(1.6)
        if (hasUpgrade("t",25)) scaling = scaling.sub(0.02)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.h.buyables[23].costBase
        let r = tmp.h.buyables[23].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
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
        return start
      },
      effect(){
        let lvl = tmp.h.buyables[23].totalLevel
        if (lvl.gte(tmp.h.buyables[23].effectLevelSoftcapStart)) lvl = lvl.sub(tmp.h.buyables[23].effectLevelSoftcapStart).div(3).add(tmp.h.buyables[23].effectLevelSoftcapStart)
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
        if (hasChallenge("p", 11)) eff = new Decimal(10).pow(eff).max(eff)
        return eff
      },
      effectDisplay(){
        return "/" + format(upgradeEffect("h",12))
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
      description(){return "Raise Multiplier and Divider buyable effect to the 1.5th power" + (hasAchievement("a",31) ? "." : ", you need 85 Multiplier buyable level to buy this upgrade")},
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
        let eff = hasAchievement("a",31) ? tmp.h.buyables[21].totalLevel.mul(tmp.h.upgrades[25].effectBase) : new Decimal(0)
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
  },
})

addLayer("p", {
  name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
    unlocked: false,
	  points: new Decimal(0),
    total: new Decimal(0),
    breakLimit: false,
    unlockedChallenges: 0,
  }},
  color: "#31aeb0",
  requires: new Decimal(2500), // Can be a function that takes requirement increases into account
  resource: "prestige points", // Name of prestige currency
  baseResource: "non-free Generator buyable level", // Name of resource prestige is based on
  baseAmount() {return getBuyableAmount("h",11)}, // Get the current amount of baseResource
  type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  getExtraAmount(){
    let extra = new Decimal(0)
    if (hasMilestone("p",4)) extra = extra.add(tmp.h.buyables[11].freeLevel.div(5).mul(Math.min(getBoughtUpgradesRow("p", 2)+1, 5)))
    return extra
  },
  getResetGain() {
    let x = getBuyableAmount("h",11).add(tmp.p.getExtraAmount)
    let gain = new Decimal(10).pow(x.add(1e-10).pow(0.5).sub(50))
    if (player.p.breakLimit) gain = gain.root(clickableEffect("p",11))

    if (hasAchievement("a",33)) gain = gain.mul(achievementEffect("a", 33))
    if (hasAchievement("a",35)) gain = gain.mul(2)
    if (hasUpgrade("p",25)) gain = gain.mul(upgradeEffect("p",25)[0])
    gain = gain.mul(buyableEffect("p",11))
    if (hasAchievement("a",44)) gain = gain.mul(achievementEffect("a", 44))
    if (hasAchievement("a", 52)) gain = gain.mul(69)
    if (hasUpgrade("p",43)) gain = gain.mul(upgradeEffect("p",43))
    if (hasUpgrade("t",14)) gain = gain.mul(upgradeEffect("t",14))

    if (!player.p.breakLimit && gain.gte(1e20)) gain = new Decimal(10).pow(gain.log(10).div(20).pow(0.25).mul(20))
    return gain.floor()
  },
  passiveGeneration(){
    return 0
  },
  getNextAt(){
    return ""
  },
  prestigeButtonText(){
    return "Reset for +" + formatWhole(tmp.p.getResetGain) + " prestige points"
  },
  canReset(){
    return getBuyableAmount("h",11).gte(2500)
  },
  hotkeys: [
    {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  update(diff){
    player.p.points = player.p.points.round()
    player.p.unlockedChallenges = Math.max(player.p.unlockedChallenges, getUnlockedChallenges())
  },
  effect(){
    if (inChallenge("p",32)) return new Decimal(1)
    let eff = player.p.points.add(1)
    if (hasUpgrade("p",23)) eff = eff.pow(1.5)
    if (hasChallenge("p",32)) eff = eff.pow(1.6)

    if (eff.gte(Number.MAX_VALUE)) eff = new Decimal(10).pow(eff.log(10).div(new Decimal(Number.MAX_VALUE).log(10)).pow(0.75).mul(new Decimal(Number.MAX_VALUE).log(10)))
    return eff
  },
  effectDescription(){
    return " which multiply h0nde power gain by " + format(tmp.p.effect) + (tmp.p.effect.gte(Number.MAX_VALUE) ? " (softcapped)" : "")
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  branches: ["h"],
  layerShown(){return hasUpgrade("h",25) || player.p.unlocked},
  tabFormat: {
    "Milestones": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
            return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        ["display-text",function(){
          return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula. (Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
        ],
        "blank",
        "milestones"
      ],
    },
    "Upgrades": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
           return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        ["display-text", function(){
          return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula. (Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
        ],
        "blank","buyables","blank",
        ["display-text", function(){
          return "Note: When you buy an upgrade on first row, the cost of the other same row upgrades are increased."
        }],
        "upgrades"
      ],
    },
    "BREAK LIMIT": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
            return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        ["display-text", function(){
          return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula. (Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
        ],
        "blank",
        ["clickable",11],
      ],
      unlocked(){return hasMilestone("p",6)}
    },
    "Challenges": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
            return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        ["display-text", function(){
          return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula. (Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
        ],
        "blank",
        ["display-text", function(){
          return "Next Challenge unlock at " + format(challreq[player.p.unlockedChallenges+1]) + " h0nde powers."
        }],
        "challenges",
      ],
      unlocked(){return hasMilestone("p",7)}
    },
  },
  doReset(resettingLayer) {
    let keep = [];
    if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
  },
  milestones: {
    1: {
      requirementDescription: "1 bought prestige upgrade",
      effectDescription: "autobuy h0nde upgrades.",
      done() { return player.p.upgrades.length >= 1},
      toggles: [["h","autoUpgrade"]],
    },
    2: {
      requirementDescription: "2 bought prestige upgrades",
      effectDescription: "autobuy Generator buyable.",
      done() { return player.p.upgrades.length >= 2},
      toggles: [["h","autoBuyable11"]],
    },
    3: {
      requirementDescription: "3 bought prestige upgrades",
      effectDescription: "autobuy Multiplier (left) and Divider (right) buyables.",
      done() { return player.p.upgrades.length >= 3},
      toggles: [["h","autoBuyable12"],["h","autoBuyable13"]],
    },
    4: {
      requirementDescription: "4 bought prestige upgrades",
      effectDescription: "autobuy row 2 buyables, add 1 to Power buyable level.",
      done() { return player.p.upgrades.length >= 4},
      toggles: [["h","autoBuyable21"]],
    },
    5: {
      requirementDescription: "5 bought prestige upgrades",
      effectDescription(){return "buying a buyable costs nothing, add 20% of free Generator buyable level into prestige points gain formula, multiply the amount of second row prestige upgrades bought plus one. (max 100%)"},
      done() { return player.p.upgrades.length >= 5},
    },
    6: {
      requirementDescription: "10 bought prestige upgrades",
      effectDescription(){return "Unlock an ability for remove the limit of non-free Generator buyable level."},
      done() { return player.p.upgrades.length >= 10},
    },
    7: {
      requirementDescription: "15 bought prestige upgrades",
      effectDescription(){return "Unlock Challenges."},
      done() { return player.p.upgrades.length >= 15},
    },
    8: {
      requirementDescription: "20 bought prestige upgrades",
      effectDescription(){return "Unlock a new layer."},
      done() { return player.p.upgrades.length >= 20},
    },
  },
  clickables:{
    11: {
      title() {return (player.p.breakLimit ? "FIX" : "BREAK") + " LIMIT"},
      display(){
        return "Require:" + `<br>` + format(player.h.points) + "/" + format(1e107) + " h0nde power" + `<br>` + format(player.p.total) + "/" + format(5e9) + " total PP"
      },
      tooltip(){
        return "When you break the limit, you can buy Generator buyable as many as possible, but base PP gain is " + format(clickableEffect("p",11)) + "th rooted, and will did a forced prestige reset when you break it or fix it."
      },
      canClick(){return player.h.points.gte(1e107) && player.p.total.gte(5e9)},
      onClick(){
        doReset("p",true)
        player.p.breakLimit = Boolean(1-player.p.breakLimit)
      },
      unlocked(){return true},
      effect(){
        let root = new Decimal(5)
        if (hasAchievement("a",51)) root = root.sub(1)
        if (hasAchievement("a",54)) root = root.sub(0.2)
        if (hasAchievement("a",61)) root = root.sub(0.3)
        return root
      },
      style: {'height':'200px', 'width':'200px'},
   },
  },
  upgrades: {
    11: {
      title: "Constant boost",
      description(){return "You gain 500x more h0nde power."},
      cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
      effect(){
        let eff = new Decimal(500)
        return eff
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
    },
    12: {
      title: "h0nde boost",
      description(){return "You gain more h0nde power based on h0nde discord accounts."},
      cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
      effect(){
        let eff = new Decimal(10).pow(player.points.pow(0.5)).pow(0.5)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("p",12)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
    },
    13: {
      title: "Generator boost",
      description(){return "+0.7 Generator buyable level to h0nde production exponent."},
      cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
      effect(){
        let eff = new Decimal(0.7)
        return eff
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
    },
    14: {
      title: "Multiplier boost",
      description(){return "Multiplier buyable effect ^1.25."},
      cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
      effect(){
        let eff = new Decimal(1.25)
        return eff
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
    },
    15: {
      title: "Power boost",
      description(){return "You gain more h0nde power based on non-free Power buyable level."},
      cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
      effect(){
        let eff = new Decimal(2).pow(getBuyableAmount("h",21).pow(2)).pow(0.5)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("p",15)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
    },
    21: {
      title: "Divider boost",
      description(){return "Every Power buyable level increase Divider buyable base by 1."},
      cost(){return new Decimal(1000)},
      effect(){
        let eff = tmp.h.buyables[21].totalLevel
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 1) >= 5
      },
      canAfford(){
        return true
      },
    },
    22: {
      title: "Faster boost",
      description(){return "Generator buyable multiplier boost occur 1.25x faster."},
      cost(){return new Decimal(9000)},
      effect(){
        let eff = new Decimal(1.25)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 1) >= 5
      },
      canAfford(){
        return true
      },
    },
    23: {
      title: "Prestige boost",
      description(){return "Prestige Points effect ^1.5."},
      cost(){return new Decimal(81000)},
      effect(){
        let eff = new Decimal(1.5)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 1) >= 5
      },
      canAfford(){
        return true
      },
    },
    24: {
      title: "Stronger boost",
      description(){return "Increase Generator buyable multiplier boost by 0.1."},
      cost(){return new Decimal(2187000)},
      effect(){
        let eff = new Decimal(0.1)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 1) >= 5
      },
      canAfford(){
        return true
      },
    },
    25: {
      title: "Self Synergy",
      description(){return "Boost PP gain and h0nde power gain based on itself."},
      cost(){return new Decimal(177147000)},
      effect(){
        let eff = [player.p.points.add(10).log(10), player.h.points.add(10).log(10)]
        if (hasChallenge("p",41)) eff[0] = eff[0].pow(3)
        if (hasChallenge("p",41)) eff[1] = eff[1].pow(3)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("p",25)[0]) + "x PP gain, " + format(upgradeEffect("p",25)[1]) + "x power gain"
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 1) >= 5
      },
      canAfford(){
        return true
      },
    },
    31: {
      title: "Power^2",
      description(){return "Power buyable base is increased by 0.2."},
      cost(){return new Decimal(1e13)},
      effect(){
        let eff = new Decimal(0.2)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 2) >= 5
      },
      canAfford(){
        return true
      },
    },
    32: {
      title: "Prestige Generator Multiplier",
      description(){return "Increase Generator buyable multiplier boost based on PP."},
      cost(){return new Decimal(1e17)},
      effect(){
        let eff = player.p.points.max(1).log(10).div(100)
        if (eff.gte(0.2)) eff = eff.div(0.2).pow(0.2).mul(0.2)
        return eff
      },
      effectDisplay(){
        return "+" + format(upgradeEffect("p",32),3)
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 2) >= 5
      },
      canAfford(){
        return true
      },
    },
    33: {
      title: "Multiplier Superboost",
      description(){return "Square Multiplier buyable effect."},
      cost(){return new Decimal(1e19)},
      effect(){
        let eff = new Decimal(2)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 2) >= 5
      },
      canAfford(){
        return true
      },
    },
    34: {
      title: "Unscaled",
      description(){return "Reduce Generator buyable cost scaling by 0.01."},
      cost(){return new Decimal(1e23)},
      effect(){
        let eff = new Decimal(0.01)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 2) >= 5
      },
      canAfford(){
        return true
      },
    },
    35: {
      title: "Unsoftcapped",
      description(){return "The softcap of Generator buyable multiplier starts 40 later."},
      cost(){return new Decimal(1e29)},
      effect(){
        let eff = new Decimal(40)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 2) >= 5
      },
      canAfford(){
        return true
      },
    },
    41: {
      title: "More Extra",
      description(){return "Add 2 to the Power and Boosters buyables."},
      cost(){return new Decimal(1e43)},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 3) >= 5
      },
      canAfford(){
        return true
      },
    },
    42: {
      title: "Booster^2",
      description(){return "Multiply Booster buyable base by 10."},
      cost(){return new Decimal("e54.5")},
      effect(){
        let eff = new Decimal(10)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 3) >= 5
      },
      canAfford(){
        return true
      },
    },
    43: {
      title: "Prestiged h0nde",
      description(){return "You gain more PP based on h0nde discord accounts."},
      cost(){return new Decimal(1e61)},
      effect(){
        let eff = player.points.add(1)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("p",43)) + "x"
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 3) >= 5
      },
      canAfford(){
        return true
      },
    },
    44: {
      title: "Unscaled^2",
      description(){return "Reduce Generator buyable cost scaling by 0.005."},
      cost(){return new Decimal("e67.7")},
      effect(){
        let eff = new Decimal(0.005)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 3) >= 5
      },
      canAfford(){
        return true
      },
    },
    45: {
      title: "Unsoftcapped^2",
      description(){return "The softcap of Generator buyable multiplier starts 20 later."},
      cost(){return new Decimal("e85.5")},
      effect(){
        let eff = new Decimal(20)
        return eff
      },
      unlocked(){
        return getBoughtUpgradesRow("p", 3) >= 5
      },
      canAfford(){
        return true
      },
    },
  },
  buyables: {
    11: {
      title: "Prestige gain",
      display(){
        return "Multiply prestige points gain by " + format(tmp.p.buyables[11].effectBase) + "." + `<br>` +
        "Currently: " + format(buyableEffect("p",11)) + "x" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.p.buyables[11].cost) + " prestige points" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("p", 11)) + (tmp.p.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.p.buyables[11].freeLevel))
      },
      costBase(){
        let base = new Decimal(1e12)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(1.1)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.p.buyables[11].costBase
        let r = tmp.p.buyables[11].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
        return free
      },
      totalLevel(){
        return getBuyableAmount("p", 11).add(tmp.p.buyables[11].freeLevel)
      },
      effectBase(){
        let x = new Decimal(2)
        if (hasAchievement("a",43)) x = x.add(1)
        if (hasAchievement("a",55)) x = x.add(1)
        if (hasAchievement("a",63)) x = x.add(1)
        return x
      },
      effect(){
        let x = tmp.p.buyables[11].effectBase.pow(tmp.p.buyables[11].totalLevel)
        return x
      },
      canAfford(){
        return player.p.points.gte(tmp.p.buyables[11].cost)
      },
      buy(){
        let cost = tmp.p.buyables[11].cost
        if (player.p.points.lt(cost)) return
        addBuyables("p", 11, new Decimal(1))
        if (true) player.p.points = player.p.points.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.p.buyables[11].purchaseLimit.sub(getBuyableAmount("p", 11))
        let bulk
        let a = tmp.p.buyables[11].cost.log(10)
        let r = tmp.p.buyables[11].costScaling
        let x = player.p.points.max(1).log(10)
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.div(a).log(r).add(1).floor()
        bulk = bulk.min(maxBulk)
        let cost = a.mul(r.pow(bulk.sub(1))) // log
        addBuyables("p", 11, bulk)
        if (true) player.p.points = player.p.points.sub(new Decimal(10).pow(cost))
      },
      unlocked(){ return hasAchievement("a",41)},
    },
  },
  challenges: {
    11: {
        name: "Powerless",
        challengeDescription: "h0nde power gain is 4th rooted.",
        goalDescription(){return format(tmp.p.challenges[11].goal) + " h0nde power"},
        rewardDescription: "Multiply Booster buyable base by 10",
        rewardEffect(){
          let eff = new Decimal(10)
          return eff
        },
        goal: new Decimal(1e40),
        canComplete: function() {return player.h.points.gte(tmp.p.challenges[11].goal)},
        unlocked(){return player.p.unlockedChallenges >= 1}
    },
    12: {
      name: "Scaled",
      challengeDescription: "Generator buyable cost scaling ^69 and you always have no free Generator buyable.",
      goalDescription(){return format(tmp.p.challenges[12].goal) + " h0nde power"},
      rewardDescription: "add 1 to Generator buyable level for every 0.04 OoM of PP if you have non-free Generator buyable",
      rewardEffect(){
        let eff = player.p.points.max(1).log(10).mul(25).floor()
        return eff
      },
      rewardDisplay(){return "+" + formatWhole(challengeEffect("p",12))},
      goal: new Decimal(1e152),
      canComplete: function() {return player.h.points.gte(tmp.p.challenges[12].goal)},
      unlocked(){return player.p.unlockedChallenges >= 2}
    },
    21: {
      name: "Unbuyable",
      challengeDescription: "All buyables have no effect except Generators.",
      goalDescription(){return format(tmp.p.challenges[21].goal) + " h0nde power"},
      rewardDescription: "Power buyables adds Multiplier and Divider buyables exponent",
      rewardEffect(){
        let eff = buyableEffect("h",21).div(2)
        if (hasUpgrade("t",23)) eff = eff.mul(2)
        return eff
      },
      rewardDisplay(){return "+" + format(challengeEffect("p",21))},
      goal: new Decimal(1e235),
      canComplete: function() {return player.h.points.gte(tmp.p.challenges[21].goal)},
      unlocked(){return player.p.unlockedChallenges >= 3}
    },
    22: {
      name: "One Generator",
      challengeDescription: "Generator buyable level to h0nde production exponent and multiplier boost are always 0 and 1 respectively.",
      goalDescription(){return format(tmp.p.challenges[22].goal) + " h0nde power"},
      rewardDescription: "Increase Generator buyable multiplier boost by 0.2",
      rewardEffect(){
        let eff = new Decimal(0.2)
        return eff
      },
      goal: new Decimal(1e196),
      canComplete: function() {return player.h.points.gte(tmp.p.challenges[22].goal)},
      unlocked(){return player.p.unlockedChallenges >= 4}
    },
    31: {
      name: "Upgradeless",
      challengeDescription: "You can't buy h0nde upgrades.",
      goalDescription(){return format(tmp.p.challenges[31].goal) + " h0nde power"},
      rewardDescription: "Cheaper effect become 10^x",
      rewardEffect(){
        let eff = new Decimal(10)
        return eff
      },
      goal: new Decimal("1e356"),
      canComplete: function() {return player.h.points.gte(tmp.p.challenges[31].goal)},
      unlocked(){return player.p.unlockedChallenges >= 5}
    },
    32: {
      name: "Unprestigous",
      challengeDescription: "Prestige Points boost have no effect.",
      goalDescription(){return format(tmp.p.challenges[32].goal) + " h0nde power"},
      rewardDescription: "Prestige Points boost ^1.6",
      rewardEffect(){
        let eff = new Decimal(1)
        return eff
      },
      goal: new Decimal("1e464"),
      canComplete: function() {return player.h.points.gte(tmp.p.challenges[32].goal)},
      unlocked(){return player.p.unlockedChallenges >= 6}
    },
    41: {
      name: "All in one",
      challengeDescription: "All previous challenges at once.",
      goalDescription(){return formatWhole(tmp.p.challenges[41].goal) + " Generator buyable level"},
      rewardDescription: "Self Synergy effect are cubed",
      rewardEffect(){
        let eff = new Decimal(3)
        return eff
      },
      goal: new Decimal(5),
      countsAs: [11,12,21,22,31,32],
      canComplete: function() {return tmp.h.buyables[11].totalLevel.gte(tmp.p.challenges[41].goal)},
      unlocked(){return player.p.unlockedChallenges >= 7}
    },
  },
})

addLayer("t", {
  name: "twitter", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
    unlocked: false,
	  points: new Decimal(0),
    power: new Decimal(0),
    energy: new Decimal(1),
    comment: new Decimal(1e-2),
    like: new Decimal(1e-4),
    retweet: new Decimal(1e-6),
    following: new Decimal(1e-8),
    follower: new Decimal(1e-10),
    resetTime: 0,
  }},
  color: "#1DA1F2",
  requires: new Decimal(100), // Can be a function that takes requirement increases into account
  base(){
    let base = new Decimal(1.05)
    return base
  },
  exponent(){
    let exp = new Decimal(1.1)
    return exp
  },
  resource: "h0nde twitter accounts", // Name of prestige currency
  baseResource: "h0nde discord accounts", // Name of resource prestige is based on
  baseAmount() {return player.points}, // Get the current amount of baseResource
  type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  hotkeys: [
    {key: "t", description: "T: Reset for twitter accounts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  update(diff){
    if (tmp.t.clickables["energy"].unlocked) player.t.power = getPolyGrow(player.t.power, tmp.t.clickables["power"].exponent, tmp.t.clickables["energy"].speed, diff)
    if (tmp.t.clickables["comment"].unlocked) player.t.energy = player.t.energy.add(tmp.t.clickables["comment"].speed.mul(diff))
    if (tmp.t.clickables["like"].unlocked) player.t.comment = player.t.comment.add(tmp.t.clickables["like"].speed.mul(diff))
    if (tmp.t.clickables["retweet"].unlocked) player.t.like = player.t.like.add(tmp.t.clickables["retweet"].speed.mul(diff))
    if (tmp.t.clickables["following"].unlocked) player.t.retweet = player.t.retweet.add(tmp.t.clickables["following"].speed.mul(diff))
    if (tmp.t.clickables["follower"].unlocked) player.t.following = player.t.following.add(tmp.t.clickables["follower"].speed.mul(diff))
  },
  effect(){
    let eff = [new Decimal(2).pow(player.t.points).sub(1), player.t.points.div(10)]
    if (eff[1].gte(1)) eff = eff.pow(0.5)
    return eff
  },
  getSuperPowSpeed(){
    let speed = tmp.t.effect[0]
    if (hasUpgrade("t",11)) speed = speed.mul(upgradeEffect("t",11))
    if (hasUpgrade("t",15)) speed = speed.mul(upgradeEffect("t",15))
    if (hasMilestone("t",3)) speed = speed.mul(tmp.t.milestones[3].effect)
    if (hasUpgrade("t",21)) speed = speed.mul(upgradeEffect("t",21))
    return speed
  },
  getAllProducerSpeed(){
    let speed = new Decimal(1)
    if (hasAchievement("a",64)) speed = speed.mul(achievementEffect("a",64))
    speed = speed.mul(buyableEffect("t",13))
    if (hasAchievement("a",65)) speed = speed.mul(achievementEffect("a",65))
    return speed
  },
  effectDescription(){
    return " which produce " + format(tmp.t.effect[0]) + " h0nde super powers per second and increase sqrt multi by " + format(tmp.t.effect[1])
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  branches: ["h"],
  layerShown(){return hasMilestone("p",8) || player.t.unlocked},
  tabFormat: {
    "Milestones": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
            return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        "milestones"
      ],
    },
    "Twitter": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
          function(){
            return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
          }
        ],
        "blank",
        ["display-text",
          function(){
            return "You have " + format(player.t.power) + " twitter power" + `<sup>` + format(tmp.t.clickables["power"].exponent) + `</sup>` + " (+" + format(tmp.t.clickables["energy"].speed) + "/s before exp)"
          }
        ],
        ["display-text",
          function(){
            return "The twitter power production is based on your PP and h0nde twitter accounts, and exponent is based on h0nde powers." + `<br>` + "The twitter power and all producer are resets when you did a row 2 prestige."
          }
        ],
        "blank",
        ["display-text",
          function(){
            return "You have " + format(player.t.energy, 3, true) + " energy" + (tmp.t.clickables["comment"].unlocked ? " (" + format(tmp.t.clickables["comment"].speed, 3, true) + "/s)" : "")
          }
        ],
        ["display-text",
          function(){
            return (tmp.t.clickables["comment"].unlocked ? "You have " + format(player.t.comment, 3, true) + " comment" + (tmp.t.clickables["like"].unlocked ? " (" + format(tmp.t.clickables["like"].speed, 3, true) + "/s)" : "") : "")
          }
        ],
        ["display-text",
          function(){
            return (tmp.t.clickables["like"].unlocked ? "You have " + format(player.t.like, 3, true) + " like" + (tmp.t.clickables["retweet"].unlocked ? " (" + format(tmp.t.clickables["retweet"].speed, 3, true) + "/s)" : "") : "")
          }
        ],
        ["display-text",
          function(){
            return (tmp.t.clickables["retweet"].unlocked ? "You have " + format(player.t.retweet, 3, true) + " retweet" + (tmp.t.clickables["following"].unlocked ? " (" + format(tmp.t.clickables["following"].speed, 3, true) + "/s)" : "") : "")
          }
        ],
        ["display-text",
          function(){
            return (tmp.t.clickables["following"].unlocked ? "You have " + format(player.t.following, 3, true) + " following" + (tmp.t.clickables["follower"].unlocked ? " (" + format(tmp.t.clickables["follower"].speed, 3, true) + "/s)" : "") : "")
          }
        ],
        ["display-text",
          function(){
            return (tmp.t.clickables["follower"].unlocked ? "You have " + format(player.t.follower, 2, true) + " follower" : "")
          }
        ],
        "blank","buyables","blank","upgrades"
      ],
      unlocked(){return hasMilestone("t",1)},
    },
  },
  doReset(resettingLayer) {
    let keep = [];
    player.t.power = new Decimal(0)
    player.t.energy = new Decimal(1)
    player.t.comment = new Decimal(1e-2)
    player.t.like = new Decimal(1e-4)
    player.t.retweet = new Decimal(1e-6)
    player.t.following = new Decimal(1e-8)
    player.t.follower = new Decimal(1e-10)
    if (layers[resettingLayer].row > this.row) layerDataReset("t", keep)
  },
  milestones: {
    1: {
      requirementDescription: "1 h0nde twitter accounts & 1e99 prestige points",
      effectDescription: "Begin the production of Twitter Power",
      done(){return player.t.points.gte(1) && player.p.points.gte(1e99)},
    },
    2: {
      requirementDescription: "2 h0nde twitter accounts & 1e102 prestige points",
      effectDescription(){return "Unlock a twitter buyable, h0nde discord accounts & h0nde twitter accounts boost h0nde powers gain (" + format(tmp.t.milestones[2].effect) + "x)"},
      effect(){
        let eff = player.t.points.max(1).pow(player.points)
        if (hasUpgrade("t",35)) eff = eff.pow(2)
        return eff
      },
      done(){return player.t.points.gte(2) && player.p.points.gte(1e102)},
    },
    3: {
      requirementDescription: "3 h0nde twitter accounts & 1e114 prestige points",
      effectDescription(){return "Your comment produce energy, h0nde discord accounts boost h0nde super power production (" + format(tmp.t.milestones[3].effect) + "x)"},
      effect(){return player.points.add(1)},
      done(){return player.t.points.gte(3) && player.p.points.gte(1e114)},
    },
    4: {
      requirementDescription: "4 h0nde twitter accounts & 1e126 prestige points",
      effectDescription(){return "Unlock a twitter buyable, each h0nde twitter accounts increase twitter power exponent by 0.1 (+" + format(tmp.t.milestones[4].effect) + ")"},
      effect(){return player.t.points.div(10)},
      done(){return player.t.points.gte(4) && player.p.points.gte(1e126)},
    },
    5: {
      requirementDescription: "5 h0nde twitter accounts & 1e141 prestige points",
      effectDescription(){return "Your like produce comment, each h0nde twitter accounts increase h0nde super power boost exponent by 1 (+" + format(tmp.t.milestones[5].effect) + ")"},
      effect(){return player.t.points},
      done(){return player.t.points.gte(5) && player.p.points.gte(1e141)},
    },
    6: {
      requirementDescription: "6 h0nde twitter accounts & 1e156 prestige points",
      effectDescription(){return "Unlock a twitter buyable, each h0nde twitter accounts increase Power Gain base by 1 (+" + format(tmp.t.milestones[6].effect) + ")"},
      effect(){return player.t.points.div(1)},
      done(){return player.t.points.gte(6) && player.p.points.gte(1e156)},
    },
  },
  clickables: {
    power: {
      unlocked(){return true},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      exponent(){
        let exp = new Decimal(1)
        if (player.h.points.gte("1e1000")) exp = player.h.points.log(10).log(10).sub(2)
        if (hasUpgrade("t",13)) exp = exp.add(upgradeEffect("t",13))
        if (hasMilestone("t", 4)) exp = exp.add(tmp.t.milestones[4].effect)
        exp = exp.add(buyableEffect("t",12))
        if (hasUpgrade("t",24)) exp = exp.add(upgradeEffect("t",24))
        return exp
      },
    },
    energy: {
      unlocked(){return hasMilestone("t",1)},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        m = m.mul(player.p.points.mul(10).add(1).log(10).pow(0.5).sub(9).pow(player.t.points))
        m = m.mul(buyableEffect("t",11))
        if (hasUpgrade("t",12)) m = m.mul(upgradeEffect("t",12))
        if (hasAchievement("a",62)) m = m.mul(achievementEffect("a",62))
        if (hasUpgrade("t",31)) m = m.mul(upgradeEffect("t",31))
        if (hasUpgrade("t",32)) m = m.mul(upgradeEffect("t",32))
        return m
      },
      speed(){
        let speed = player.t.energy
        speed = speed.mul(tmp.t.clickables["energy"].multi)
        return speed
      },
    },
    comment: {
      unlocked(){return hasMilestone("t",3)},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        if (hasUpgrade("t",22)) m = m.mul(10)
        return m
      },
      speed(){
        let speed = player.t.comment
        speed = speed.mul(tmp.t.clickables["comment"].multi)
        return speed
      },
    },
    like: {
      unlocked(){return hasMilestone("t",5)},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        return m
      },
      speed(){
        let speed = player.t.like
        speed = speed.mul(tmp.t.clickables["like"].multi)
        return speed
      },
    },
    retweet: {
      unlocked(){return false},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        return m
      },
      speed(){
        let speed = player.t.retweet
        speed = speed.mul(tmp.t.clickables["retweet"].multi)
        return speed
      },
    },
    following: {
      unlocked(){return false},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        return m
      },
      speed(){
        let speed = player.t.following
        speed = speed.mul(tmp.t.clickables["following"].multi)
        return speed
      },
    },
    follower: {
      unlocked(){return false},
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      multi(){
        let m = new Decimal(1)
        m = m.mul(tmp.t.getAllProducerSpeed)
        return m
      },
      speed(){
        let speed = player.t.follower
        speed = speed.mul(tmp.t.clickables["follower"].multi)
        return speed
      },
    },
  },
  upgrades: {
    11: {
      title: "Prestige Power",
      description(){return "Your prestige points boosts h0nde super power gain"},
      cost(){return new Decimal(40)},
      effect(){
        let eff = player.p.points.add(10).log(10)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",11)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    12: {
      title: "Super Twitter",
      description(){return "Your h0nde super power boosts base twitter power gain"},
      cost(){return new Decimal(400)},
      effect(){
        let eff = player.h.points2.add(10).log(10)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",12)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    13: {
      title: "Prestige Exponent",
      description(){return "Increase twitter power exponent by 0.01 for every Prestige gain buyable level"},
      cost(){return new Decimal(2000)},
      effect(){
        let eff = tmp.p.buyables[11].totalLevel.mul(tmp.t.upgrades[13].effectBase)
        return eff
      },
      effectBase(){
        let base = new Decimal(0.01)
        return base
      },
      effectDisplay(){
        return "+" + format(upgradeEffect("t",13))
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    14: {
      title: "Twitter Prestige",
      description(){return "You gain more prestige points based on twitter power"},
      cost(){return new Decimal(20000)},
      effect(){
        let eff = new Decimal(10).pow(player.t.power.max(1).log(10).pow(0.5))
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",14)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    15: {
      title: "Twitter Super Power",
      description(){return "You gain more h0nde super power based on twitter power"},
      cost(){return new Decimal(300000)},
      effect(){
        let eff = player.t.power.add(10).log(10)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",15)) + "x"
      },
      unlocked(){
        return true
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    21: {
      title: "Energy Multiplier",
      description(){return "Energy boost h0nde super power gain"},
      cost(){return new Decimal(1e7)},
      effect(){
        let eff = player.t.energy
        eff = getInfSqrt(eff, new Decimal(10))
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",21)) + "x"
      },
      unlocked(){
        return hasMilestone("t",3)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    22: {
      title: "Comment Speed",
      description(){return "Comment produce 10x more Energy and 1.2x Generator buyable exp"},
      cost(){return new Decimal(1e8)},
      effect(){
        let eff = new Decimal(10)
        return eff
      },
      unlocked(){
        return hasMilestone("t",3)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    23: {
      title: "Hyper MultiDivider",
      description(){return "Square Multiplier and Divider buyable effect and double the Unbuyable reward"},
      cost(){return new Decimal(1e14)},
      effect(){
        let eff = new Decimal(2)
        return eff
      },
      unlocked(){
        return hasMilestone("t",3)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    24: {
      title: "Power Exponent",
      description(){return "Increase twitter power exp based on twitter power"},
      cost(){return new Decimal(1e15)},
      effect(){
        let eff = player.t.power.add(1).log(10).pow(0.5).div(10)
        return eff
      },
      effectDisplay(){
        return "+" + format(upgradeEffect("t",24))
      },
      unlocked(){
        return hasMilestone("t",3)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    25: {
      title: "Row 2 Unscaled",
      description(){return "Reduce all row 2 h0nde buyables cost scaling by 0.02, add 0.003 into Exponentator base"},
      cost(){return new Decimal(1e18)},
      effect(){
        let eff = new Decimal(0.1)
        return eff
      },
      unlocked(){
        return hasMilestone("t",3)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    31: {
      title: "Super Booster",
      description(){return "Add 0.1 to Boosters buyable level exponent, sum of row 2 h0nde buyable level boost base twitter power gain"},
      cost(){return new Decimal(1e22)},
      effect(){
        let eff = tmp.h.buyables[21].totalLevel.add(tmp.h.buyables[22].totalLevel).add(tmp.h.buyables[23].totalLevel).add(1)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",31)) + "x"
      },
      unlocked(){
        return hasMilestone("t",5)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    32: {
      title: "Self Synergy",
      description(){return "Multiply base twitter power gain based on itself"},
      cost(){return new Decimal(1e36)},
      effect(){
        let eff = player.t.power.add(10).log(10)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",32)) + "x"
      },
      unlocked(){
        return hasMilestone("t",5)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    33: {
      title: "Powered",
      description(){return "Multiply h0nde power gain based on twitter power, add 0.1 to Power buyable base"},
      cost(){return new Decimal(1e41)},
      effect(){
        let eff = player.t.power.add(1)
        return eff
      },
      effectDisplay(){
        return format(upgradeEffect("t",33)) + "x"
      },
      unlocked(){
        return hasMilestone("t",5)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    34: {
      title: "Comment Exponent",
      description(){return "Comment increase h0nde super boost exponent, add 0.1 to Power Exp base"},
      cost(){return new Decimal(1e75)},
      effect(){
        let eff = player.t.comment.pow(0.5).mul(10).log(10).add(1).mul(5)
        if (eff.gte(10)) eff = eff.log(10).add(9)
        return eff
      },
      effectDisplay(){
        return "+" + format(upgradeEffect("t",34))
      },
      unlocked(){
        return hasMilestone("t",5)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
    35: {
      title: "Account^2",
      description(){return "Square second twitter milestone effect"},
      cost(){return new Decimal(1e92)},
      effect(){
        let eff = new Decimal(2)
        return eff
      },
      unlocked(){
        return hasMilestone("t",5)
      },
      canAfford(){
        return true
      },
      currencyDisplayName: "twitter power",
      currencyInternalName: "power",
      currencyLayer: "t",
    },
  },
  buyables: {
    11: {
      title: "Power Gain",
      display(){
        return "Multiply base twitter power gain by " + format(tmp.t.buyables[11].effectBase) + "." + `<br>` +
        "Currently: " + format(buyableEffect("t",11)) + "x" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.t.buyables[11].cost) + " twitter power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("t", 11)) + (tmp.t.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[11].freeLevel))
      },
      costBase(){
        let base = new Decimal(10)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(2)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.t.buyables[11].costBase
        let r = tmp.t.buyables[11].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
        return free
      },
      totalLevel(){
        return getBuyableAmount("t", 11).add(tmp.t.buyables[11].freeLevel)
      },
      effectBase(){
        let x = new Decimal(2)
        if (hasMilestone("t", 6)) x = x.add(tmp.t.milestones[6].effect)
        return x
      },
      effect(){
        let x = tmp.t.buyables[11].effectBase.pow(tmp.t.buyables[11].totalLevel)
        return x
      },
      canAfford(){
        return player.t.power.gte(tmp.t.buyables[11].cost)
      },
      buy(){
        let cost = tmp.t.buyables[11].cost
        if (player.t.power.lt(cost)) return
        addBuyables("t", 11, new Decimal(1))
        if (true) player.t.power = player.t.power.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.t.buyables[11].purchaseLimit.sub(getBuyableAmount("t", 11))
        let bulk
        let a = tmp.t.buyables[11].cost.log(10)
        let r = tmp.t.buyables[11].costScaling
        let x = player.t.power.max(1).log(10)
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.div(a).log(r).add(1).floor()
        bulk = bulk.min(maxBulk)
        let cost = a.mul(r.pow(bulk.sub(1))) // log
        addBuyables("t", 11, bulk)
        if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
      },
      unlocked(){return hasMilestone("t",2)},
    },
    12: {
      title: "Power Exp",
      display(){
        return "Increase twitter power exponent by " + format(tmp.t.buyables[12].effectBase) + "." + `<br>` +
        "Currently: +" + format(buyableEffect("t",12)) + `<br>` + `<br>` + 
        "Cost: " + format(tmp.t.buyables[12].cost) + " twitter power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("t", 12)) + (tmp.t.buyables[12].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[12].freeLevel))
      },
      costBase(){
        let base = new Decimal(10)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(3)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.t.buyables[12].costBase
        let r = tmp.t.buyables[12].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
        return free
      },
      totalLevel(){
        return getBuyableAmount("t", 12).add(tmp.t.buyables[12].freeLevel)
      },
      effectBase(){
        let x = new Decimal(0.1)
        if (hasUpgrade("t",34)) x = x.add(0.1)
        return x
      },
      effect(){
        let x = tmp.t.buyables[12].effectBase.mul(tmp.t.buyables[12].totalLevel)
        return x
      },
      canAfford(){
        return player.t.power.gte(tmp.t.buyables[12].cost)
      },
      buy(){
        let cost = tmp.t.buyables[12].cost
        if (player.t.power.lt(cost)) return
        addBuyables("t", 12, new Decimal(1))
        if (true) player.t.power = player.t.power.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.t.buyables[12].purchaseLimit.sub(getBuyableAmount("t", 12))
        let bulk
        let a = tmp.t.buyables[12].cost.log(10)
        let r = tmp.t.buyables[12].costScaling
        let x = player.t.power.max(1).log(10)
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.div(a).log(r).add(1).floor()
        bulk = bulk.min(maxBulk)
        let cost = a.mul(r.pow(bulk.sub(1))) // log
        addBuyables("t", 12, bulk)
        if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
      },
      unlocked(){return hasMilestone("t",4)},
    },
    13: {
      title: "Producer Speed",
      display(){
        return "Multiply all producer speed by " + format(tmp.t.buyables[13].effectBase) + "." + `<br>` +
        "Currently: " + format(buyableEffect("t",13)) + "x" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.t.buyables[13].cost) + " twitter power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("t", 13)) + (tmp.t.buyables[13].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[13].freeLevel))
      },
      costBase(){
        let base = new Decimal(10)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(5)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.t.buyables[13].costBase
        let r = tmp.t.buyables[13].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
        return free
      },
      totalLevel(){
        return getBuyableAmount("t", 13).add(tmp.t.buyables[13].freeLevel)
      },
      effectBase(){
        let x = new Decimal(2)
        return x
      },
      effect(){
        let x = tmp.t.buyables[13].effectBase.pow(tmp.t.buyables[13].totalLevel)
        return x
      },
      canAfford(){
        return player.t.power.gte(tmp.t.buyables[13].cost)
      },
      buy(){
        let cost = tmp.t.buyables[13].cost
        if (player.t.power.lt(cost)) return
        addBuyables("t", 13, new Decimal(1))
        if (true) player.t.power = player.t.power.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.t.buyables[13].purchaseLimit.sub(getBuyableAmount("t", 13))
        let bulk
        let a = tmp.t.buyables[13].cost.log(10)
        let r = tmp.t.buyables[13].costScaling
        let x = player.t.power.max(1).log(10)
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.div(a).log(r).add(1).floor()
        bulk = bulk.min(maxBulk)
        let cost = a.mul(r.pow(bulk.sub(1))) // log
        addBuyables("t", 13, bulk)
        if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
      },
      unlocked(){return hasMilestone("t",6)},
    },
  },
})

function getBoughtUpgradesRow(layer, row){
  let x = 0
  for (let i = 1; i <= 9; i++){
    if (hasUpgrade(layer,row*10+i)) x++
  }
  return x
}

addLayer("a", {
  startData() { return {
      unlocked: true,
  }},
  color: "yellow",
  row: "side",
  position: 1,
  layerShown() {return true}, 
  tooltip() { // Optional, tooltip displays when the layer is locked
      return ("Achievements")
  },
  tabFormat: [
    "blank","blank","blank","blank",
    ["display-text", function(){
      return "Completed Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2)
    }],
    "blank",
    "achievements",
  ],
  achievements: {
    rows: 100,
    cols: 5,
    11: {
      name: "The First account",
      done(){return player.points.gte(1)},
      tooltip(){return "Get 1 h0nde discord account"},
    },
    12: {
      name: "An Alt account",
      done(){return player.points.gte(2)},
      tooltip(){return "Get 2 h0nde discord account. Reward: your h0nde discord accounts boost h0nde power gain. (" + format(achievementEffect("a", 12)) + "x)"},
      effect(){
        let eff = player.points.add(1)
        if (hasUpgrade("h",14)) eff = eff.pow(2)
        if (hasAchievement("a",42)) eff = eff.pow(achievementEffect("a",42))
        return eff
      },
    },
    13: {
      name: "Multi Generators",
      done(){return tmp.h.buyables[11].totalLevel.gte(100)},
      tooltip(){return "Get 100 Generator buyable level. Reward: unlock h0nde power upgrades."},
    },
    14: {
      name: "MILLION POWER",
      done(){return player.h.points.gte(1e6)},
      tooltip(){return "Reach " + format(1e6) + " h0nde power. Reward: unlock a buyable, completed achievements boost h0nde power gain. (" + format(achievementEffect("a", 14)) + "x)"},
      effect(){
        let eff = new Decimal(player.a.achievements.length).add(1)
        return eff
      },
    },
    15: {
      name: "(softcapped)",
      done(){return player.points.gte(10)},
      tooltip(){return "Get 10 h0nde discord account. Reward: Square Multiplier buyable effect."},
    },
    21: {
      name: "QUADRILLION POWER",
      done(){return player.h.points.gte(1e15)},
      tooltip(){return "Reach " + format(1e15) + " h0nde power. Reward: unlock a buyable, h0nde discord accounts increase Multiplier buyable base. (+" + format(achievementEffect("a", 21), 4) + ")"},
      effect(){
        let eff = player.points.div(100)
        return eff
      },
    },
    22: {
      name: "Upgraded",
      done(){return player.h.upgrades.length >= 6},
      tooltip(){return "Buy 6 h0nde upgrades. Reward: you can buy max Generator buyable, bought h0nde upgrades boost h0nde power gain. (" + format(achievementEffect("a", 22)) + "x)"},
      effect(){
        let eff = new Decimal(player.h.upgrades.length).add(1)
        return eff
      },
    },
    23: {
      name: "Nice",
      done(){return tmp.h.buyables[12].totalLevel.gte(69)},
      tooltip(){return "Get 69 Multiplier buyable level. Reward: reduce the cost scaling of Multiplier and Divider buyable cost scaling by 10%."},
    },
    24: {
      name: "Faster than a potato",
      done(){return tmp.h.getResetGain.gte(1e29)},
      tooltip(){return "Reach " + format(1e29) + " h0nde power per second. Reward: unlock a buyable, Divider buyable level boost h0nde power gain. (" + format(achievementEffect("a", 24)) + "x)"},
      effect(){
        let eff = tmp.h.buyables[13].totalLevel.add(1)
        return eff
      },
    },
    25: {
      name: "Super Generator",
      done(){return tmp.h.buyables[11].totalLevel.gte(2500)},
      tooltip(){return "Get 2,500 Generator buyable level. Reward: you can buy max Multiplier and Divider buyables, Generator buyable multiplier boost +0.1."},
    },
    31: {
      name: "The Prestige",
      done(){return player.p.unlocked},
      tooltip(){return "Do a prestige reset. Reward: Remove the buyables require on all h0nde upgrades, h0nde upgrade 10 have another effect."},
    },
    32: {
      name: "Super Power",
      done(){return tmp.h.buyables[21].totalLevel.gte(4)},
      tooltip(){return "Get 4 Power buyable level. Reward: Power buyable level increase Generator buyable multiplier boost. (+" + format(achievementEffect("a", 32)) + ")"},
      effect(){
        let x = tmp.h.buyables[21].totalLevel
        if (x.gte(100)) x = x.log(10).mul(50)
        let eff = x.div(100)
        return eff
      },
    },
    33: {
      name: "Anti-Upgrades",
      done(){return player.h.points.gte(1e24) && player.h.upgrades.length == 0},
      tooltip(){return "Reach " + format(1e24) + " h0nde powers without h0nde upgrades. Reward: Power buyable level boost PP gain. (" + format(achievementEffect("a", 33)) + "x)"},
      effect(){
        let eff = tmp.h.buyables[21].totalLevel.add(1)
        return eff
      },
    },
    34: {
      name: "Anti-Buyables",
      done(){return player.h.points.gte(1e48) && getBuyableAmount("h",12).eq(0) && getBuyableAmount("h",13).eq(0) && getBuyableAmount("h",21).eq(0)},
      tooltip(){return "Reach " + format(1e48) + " h0nde powers without non-free Multiplier, Divider and Power buyables. Reward: Add 1 to Generator buyable level, New Layer gives 2x more free levels."},
    },
    35: {
      name: "Anti-Generators",
      done(){return player.h.points.gte(1e47) && getBuyableAmount("h",11).eq(0)},
      tooltip(){return "Reach " + format(1e47) + " h0nde powers without non-free Generator buyables. Reward: Double Prestige Points gain, Square Divider buyable effect."},
    },
    41: {
      name: "Limit Break",
      done(){return player.p.breakLimit},
      tooltip(){return "Break the limit of Generator buyable level. Reward: unlock a h0nde buyable and a prestige buyable."},
    },
    42: {
      name: "Hyper Generator",
      done(){return tmp.h.buyables[11].totalLevel.gte(10000) && tmp.h.buyables[11].freeLevel.gte(1000)},
      tooltip(){return "Get 10,000 Generator buyable level with at least 1,000 free Generator buyable level. Reward: An Alt accounts reward is stronger based on total Generator buyable level. (^" + format(achievementEffect("a", 42),3) + ")"},
      effect(){
        let eff = tmp.h.buyables[11].totalLevel.add(10).log(10)
        return eff
      },
    },
    43: {
      name: "No more h0nde",
      done(){return player.h.points.gte(1e42) && getBuyableAmount("h",11).eq(0) && getBuyableAmount("h",12).eq(0) && getBuyableAmount("h",13).eq(0) && getBuyableAmount("h",21).eq(0) && getBuyableAmount("h",22).eq(0) && getBuyableAmount("h",23).eq(0)},
      tooltip(){return "Reach " + format(1e42) + " h0nde powers without any h0nde buyables or upgrades. Reward: Add 1 into Prestige gain buyable base."},
    },
    44: {
      name: "INFINITE POWER",
      done(){return player.h.points.gte(Number.MAX_VALUE)},
      tooltip(){return "Reach " + format(Number.MAX_VALUE) + " h0nde powers. Reward: You gain more PP based on h0nde powers. (" + format(achievementEffect("a", 44)) + "x)"},
      effect(){
        let eff = player.h.points.add(1).log(10).div(100).max(1)
        return eff
      },
    },
    45: {
      name: "Fix Limit is exist, why not?",
      done(){return tmp.p.getResetGain.gte(1e20) && !player.p.breakLimit},
      tooltip(){return "Reach " + format(1e20) + " PP gain on reset while limit is fixed. Reward: Divider buyable effect is ^1.7."},
    },
    51: {
      name: "The Challenger",
      done(){return hasChallenge("p", 11)},
      tooltip(){return "Complete Powerless Challenge. Reward: Reduce the root of the break limit nerf by 1."},
    },
    52: {
      name: "Nice^2",
      done(){return player.points.gte(69)},
      tooltip(){return "Reach 69 h0nde discord accounts, Reward: Unlock a buyable, you gain 69x more honde power and prestige points."},
    },
    53: {
      name: "No more row 2",
      done(){return player.h.points.gte("1e352") && getBuyableAmount("h",21).eq(0) && getBuyableAmount("h",22).eq(0) && getBuyableAmount("h",23).eq(0)},
      tooltip(){return "Reach " + format(new Decimal("1e352")) + " h0nde powers without any second row of h0nde buyables, Reward: Cheaper effect divide Divider buyable cost."},
    },
    54: {
      name: "Back to old age",
      done(){return hasChallenge("p", 41)},
      tooltip(){return "Complete All in one Challenge. Reward: Reduce the root of the break limit nerf by 0.2."},
    },
    55: {
      name: "Limit Fix",
      done(){return player.h.points.gte(1e103) && inChallenge("p", 11) && !player.p.breakLimit},
      tooltip(){return "Reach " + format(new Decimal("1e103")) + " h0nde powers in Powerless Challenge while limit is fixed, Reward: Add 1 into Prestige gain buyable base and 2 to Booster buyable level."},
    },
    61: {
      name: "Another Social Media?",
      done(){return player.t.unlocked},
      tooltip(){return "Do a twitter reset. Reward: Reduce the root of the break limit nerf by 0.3."},
    },
    62: {
      name: "2^4 in two in one",
      done(){return player.points.gte(16) && player.t.points.gte(2) && inChallenge("p", 41)},
      tooltip(){return "Reach 16 h0nde discord accounts in All in one Challenge with at least 2 h0nde twitter accounts. Reward: Add 4 to h0nde super power boost exponent, Total Generator buyable level boost base twitter power gain (" + format(achievementEffect("a", 62),3) + "x)"},
      effect(){
        let eff = tmp.h.buyables[11].totalLevel.add(10).log(10)
        return eff
      },
    },
    63: {
      name: "Fix Generator",
      done(){return tmp.h.buyables[11].freeLevel.gte(9600) && !player.p.breakLimit},
      tooltip(){return "Get 9,600 Free Generator buyable level while limit is fixed. Reward: Add 1 into Prestige gain buyable base, Multiplier Booster base by 10."},
    },
    64: {
      name: "twitter^3",
      done(){return tmp.t.clickables["power"].exponent.gte(3)},
      tooltip(){return "Reach 3 twitter power exponent. Reward: Multiply all producer production based on twitter power exponent (" + format(achievementEffect("a", 64)) + "x)"},
      effect(){
        let eff = tmp.t.clickables["power"].exponent.add(1)
        return eff
      },
    },
    65: {
      name: "MILLILLION POWER",
      done(){return player.h.points.gte("1e3003")},
      tooltip(){return "Reach " + format(new Decimal("1e3003")) + " h0nde powers. Reward: Multiply all producer production based on h0nde twitter accounts (" + format(achievementEffect("a", 65)) + "x)"},
      effect(){
        let eff = player.t.points.add(1)
        return eff
      },
    },
  },
})

addLayer("s", {
  startData() { return {
      unlocked: true,
  }},
  color: "white",
  row: "side",
  position: 0,
  layerShown() {return true}, 
  tooltip() { // Optional, tooltip displays when the layer is locked
      return ("Statistics")
  },
  tabFormat: [
    ["display-text", function(){
      return "Best h0nde discord accounts: " + (player.bestPoints.gte(1e15) ? format(player.bestPoints, 3) : commaFormat(player.bestPoints, 3))
    }],
    ["display-text", function(){
      return "Square root multi: " + format(tmp.h.getAccmult)
    }],
    "blank",
    ["display-text", function(){
      return "Generator buyable levels: " + formatWhole(tmp.h.buyables[11].totalLevel) + " (" + formatWhole(getBuyableAmount("h", 11)) + " + " + formatWhole(tmp.h.buyables[11].freeLevel) + ")"
    }],
    "blank",
    ["display-text", function(){
      return "h0nde power productions:"
    }],
    ["display-text", function(){
      return "Base production: " + format(tmp.h.buyables[11].effectMul) + "/s (" + formatWhole(tmp.h.buyables[11].totalLevel) + "^" + format(tmp.h.buyables[11].effectExp) + ")"
    }],
    ["display-text", function(){
      return "From Generator buyable bought multipliers: " + format(tmp.h.buyables[11].effectBoost) + "x"
    }],
    ["display-text", function(){
      return (tmp.h.buyables[12].unlocked ? "From Multiplier buyable: " + format(buyableEffect("h",12)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasAchievement("a", 12) ? "From Achievement An Alt account: " + format(achievementEffect("a", 12)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasAchievement("a", 14) ? "From Achievement MILLION POWER: " + format(achievementEffect("a", 14)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasAchievement("a", 22) ? "From Achievement Upgraded: " + format(achievementEffect("a", 22)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasAchievement("a", 24) ? "From Achievement Faster than a potato: " + format(achievementEffect("a", 24)) + "x" : "")
    }],

    ["display-text", function(){
      return (player.p.unlocked ? "From Prestige Points: " + format(tmp.p.effect) + "x" : "")
    }],
    ["display-text", function(){
      return (hasUpgrade("p", 11) ? "From Prestige Upgrade Constant boost: " + format(upgradeEffect("p", 11)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasUpgrade("p", 12) ? "From Prestige Upgrade h0nde boost: " + format(upgradeEffect("p", 12)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasUpgrade("p", 15) ? "From Prestige Upgrade Power boost: " + format(upgradeEffect("p", 15)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasUpgrade("p", 25) ? "From Prestige Upgrade Self Synergy second effect: " + format(upgradeEffect("p", 25)[1]) + "x" : "")
    }],
    ["display-text", function(){
      return (tmp.h.buyables[22].unlocked ? "From Booster buyable: " + format(buyableEffect("h",22)) + "x" : "")
    }],
    ["display-text", function(){
      return (hasAchievement("a", 24) ? "From Achievement Nice^2: " + format(69) + "x" : "")
    }],
    ["display-text", function(){
      return (player.t.unlocked ? "From h0nde super power: " + format(tmp.h.superPowerEff) + "x" : "")
    }],
    ["display-text", function(){
      return (hasMilestone("t", 2) ? "From Twitter milestone 2: " + format(tmp.t.milestones[2].effect) + "x" : "")
    }],
    ["display-text", function(){
      return (hasUpgrade("t", 33) ? "From Twitter Upgrade Powered: " + format(upgradeEffect("t", 33)) + "x" : "")
    }],
    ["display-text", function(){
      return "Production exponent: ^" + format(tmp.h.buyables[11].productionExp, 3)
    }],
    ["display-text", function(){
      return "Total production: " + format(tmp.h.getResetGain) + "/s"
    }],
    "blank",
    ["display-text", function(){
      if (player.points.gte(86400)){
        return "If you create " + format(new Decimal(player.points).div(86400)) + " h0nde discord accounts every second, you could spent 1 day to create the amount of accounts equal to your h0nde discord accounts."
      } else {
        return "If you create a h0nde discord account every " + formatTime(new Decimal(86400).div(player.points)) + ", you could spent 1 day to create the amount of accounts equal to your h0nde discord accounts."
      }
    }],
    ["blank", "3000px"],
    ["display-text", function(){
      return "The players that completed the Septendecillion (e54) h0nde power challenge at 10 July:" + `<br>` +
      "Elund (07:50 GMT+8)" + `<br>` +
      "EmJov (09:31 GMT+8)" + `<br>` +
      "Heydiehey123 (16:49 GMT+8)" + `<br>`
    }],"blank",
    ["display-text", function(){
      return "The players that get the most h0nde power at 14 July:" + `<br>` +
      "Heydiehey123 (1.58e385)" + `<br>` +
      "Elund (8.62e381)" + `<br>` +
      "Pennwick (3.55e381)" + `<br>`
    }],"blank",
    "blank","blank",
  ],
})

const challreq = [
  null,
  new Decimal("1e377"),
  new Decimal("1e413"),
  new Decimal("1e453"),
  new Decimal("1e556"),
  new Decimal("1e618"),
  new Decimal("1e666"),
  new Decimal("1e881"),
  new Decimal(Infinity)
]

function getUnlockedChallenges(){
  let x = player.h.points
  let output = 0
  for (let i = 1; i < challreq.length; i++){
    if (x.gte(challreq[i]) && challreq[i] !== undefined) output++
  }
  return output
}

function getPolyGrow(curr, exp, prod, time){
  curr = new Decimal(curr)
  exp = new Decimal(exp)
  prod = new Decimal(prod)
  return curr.pow(exp.recip()).add(prod.mul(time)).pow(exp)
}

function getInfSqrt(amt, sqrt){
  amt = new Decimal(amt)
  sqrt = new Decimal(sqrt)

  if (amt.lt(1)) return amt

  let times = amt.log(sqrt).plus(1).log(2).floor()
  let a = Decimal.pow(2, times)

  let mul = Decimal.pow(sqrt, times)
  let mul2 = amt.div(Decimal.pow(sqrt, a.sub(1))).root(a)

  return mul.times(mul2)
}