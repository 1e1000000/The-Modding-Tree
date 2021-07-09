addLayer("h", {
  name: "h0nde", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
    unlocked: true,
	  points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
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
  },
  row: 0, // Row the layer is in on the tree (0 is the first row)
  layerShown(){return true},
  tabFormat: {
    "Info": {
      content: [
        "main-display",
        ["display-text",
          function(){return "You are gaining " + format(layers.h.getResetGain()) + " h0nde powers per second"}
        ],
        ["infobox", "info"],["infobox", "info2"]
        ],
    },
    "Upgrades": {
      content: [
        "main-display",
        ["display-text",
          function(){return "You are gaining " + format(layers.h.getResetGain()) + " h0nde powers per second"}
        ],
        "blank","clickables","buyables","blank","upgrades"
      ],
    },
  },
  doReset(resettingLayer) {
    let keep = [];
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
    return mul
  },
  infoboxes: {
    info: {
      title: "Info",
      body() {
        return "At June 7, 2021, a ton of twitter.com/h0nde discord account joined many servers, they just attempt to raid the server, however they got banned later." + `<br>` +
        "1 month later, I created this game, simulate the h0nde account creation, and try to get even more h0nde account then previous."
      },
      unlocked(){return true},
    },
    info2: {
      title: "How to create h0nde account",
      body() {
        return "For every OoM of h0nde power, a new h0nde account will be created, however, for every " + format(tmp.h.getAccmult) + "x h0nde accounts, the account amount will square rooted." + `<br>` +
        "Note: It is possible to have decimal amount of accounts."
      },
      unlocked(){return player.h.buyables[11].gt(0)},
    },
  },
  buyables: {
    11: {
      title: "Generator",
      display(){
        return "Produce " + format(tmp.h.buyables[11].effectBase) + " h0nde powers per second." + `<br>` +
        "Currently: " + format(buyableEffect("h",11)) + "/s" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[11].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 11)) + (tmp.h.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[11].freeLevel)) + " / " + formatWhole(tmp.h.buyables[11].purchaseLimit) + `<br>` +
        format(tmp.h.buyables[11].multiBoostMultiplier) + "x production boost counts: " + formatWhole(tmp.h.buyables[11].totalLevel.div(tmp.h.buyables[11].multiBoostDensity).floor()) + 
        " (Next at: " + formatWhole(tmp.h.buyables[11].totalLevel) + "/" + formatWhole(tmp.h.buyables[11].totalLevel.div(tmp.h.buyables[11].multiBoostDensity).add(1e-10).ceil().mul(tmp.h.buyables[11].multiBoostDensity)) + ")" + `<br>` +
        "h0nde power production multi from this buyable: " + format(tmp.h.buyables[11].effectMul)
      },
      costBase(){
        let base = new Decimal(5)
        if (hasUpgrade("h",12)) base = base.div(upgradeEffect("h",12))
        base = base.div(buyableEffect("h",13))
        return base 
      },
      costScaling(){
        let scaling = new Decimal(1.05)
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
        return lim
      },
      freeLevel(){
        let free = new Decimal(0)
        if (hasUpgrade("h",15)) free = free.add(upgradeEffect("h",15))
        return free
      },
      totalLevel(){
        return getBuyableAmount("h", 11).add(tmp.h.buyables[11].freeLevel)
      },
      multiBoostDensity(){
        let d = new Decimal(50)
        if (hasUpgrade("h",13)) d = d.div(2)
        return d
      },
      multiBoostMultiplier(){
        let m = new Decimal(1)
        if (hasUpgrade("h",11)) m = m.add(1)
        if (hasUpgrade("h",13)) m = m.sub(0.4)
        if (hasAchievement("a",25)) m = m.add(0.1)
        return m
      },
      multiBoostAmountSCStart(){
        let s = new Decimal(100)
        return s
      },
      effectBase(){
        let a = tmp.h.buyables[11].totalLevel // current amount
        let d = tmp.h.buyables[11].multiBoostDensity // for every d level, boost production
        let s = tmp.h.buyables[11].multiBoostAmountSCStart // after s boosts, effect start to softcap
        let n = a.div(d).floor() // multi boost times
        if (n.gte(s)) n = n.div(s).pow(0.5).mul(s)
        let x = tmp.h.buyables[11].multiBoostMultiplier.pow(n) // base prod with multi boost
        
        x = x.mul(buyableEffect("h",12))
        if (hasAchievement("a", 12)) x = x.mul(achievementEffect("a", 12))
        if (hasAchievement("a", 14)) x = x.mul(achievementEffect("a", 14))
        if (hasAchievement("a", 22)) x = x.mul(achievementEffect("a", 22))
        if (hasAchievement("a", 24)) x = x.mul(achievementEffect("a", 24))
        return x
      },
      effectMul(){
        let x = tmp.h.buyables[11].totalLevel
        x = x.pow(buyableEffect("h",21))
        return x
      },
      effect(){
        let x = tmp.h.buyables[11].effectMul.mul(tmp.h.buyables[11].effectBase)
        return x
      },
      canAfford(){
        return player.h.points.gte(tmp.h.buyables[11].cost)
      },
      buy(){
        let cost = tmp.h.buyables[11].cost
        if (player.h.points.lt(cost)) return
        addBuyables("h", 11, new Decimal(1))
        // some upgrade should make them not actually remove h0nde power
        player.h.points = player.h.points.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.h.buyables[11].purchaseLimit.sub(getBuyableAmount("h", 11))
        let bulk
        let a = tmp.h.buyables[11].cost
        let r = tmp.h.buyables[11].costScaling
        let x = player.h.points
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
        bulk = bulk.min(maxBulk)
        let cost = new Decimal(0)
        if (!a.eq(0)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
        addBuyables("h", 11, bulk)
        // some upgrade should make them not actually remove h0nde power, but the formula maybe recode
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
        let e = new Decimal(1)
        if (hasAchievement("a",15)) e = e.mul(2)
        if (hasUpgrade("h",21)) e = e.mul(1.25)
        if (hasUpgrade("h",23)) e = e.mul(1.5)
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
        // some upgrade should make them not actually remove h0nde power
        player.h.points = player.h.points.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.h.buyables[12].purchaseLimit.sub(getBuyableAmount("h", 12))
        let bulk
        let a = tmp.h.buyables[12].cost
        let r = tmp.h.buyables[12].costScaling
        let x = player.h.points
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
        bulk = bulk.min(maxBulk)
        let cost = new Decimal(0)
        if (!a.eq(0)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
        addBuyables("h", 12, bulk)
        // some upgrade should make them not actually remove h0nde power, but the formula maybe recode
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
        return free
      },
      totalLevel(){
        return getBuyableAmount("h", 13).add(tmp.h.buyables[13].freeLevel)
      },
      effectBase(){
        let x = new Decimal(1)
        return x
      },
      effectExp(){
        let e = new Decimal(2)
        if (hasUpgrade("h",23)) e = e.mul(1.5)
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
        // some upgrade should make them not actually remove h0nde power
        player.h.points = player.h.points.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.h.buyables[13].purchaseLimit.sub(getBuyableAmount("h", 13))
        let bulk
        let a = tmp.h.buyables[13].cost
        let r = tmp.h.buyables[13].costScaling
        let x = player.h.points
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
        bulk = bulk.min(maxBulk)
        let cost = new Decimal(0)
        if (!a.eq(0)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
        addBuyables("h", 13, bulk)
        // some upgrade should make them not actually remove h0nde power, but the formula maybe recode
        player.h.points = player.h.points.sub(cost)
      },
      unlocked(){ return hasAchievement("a",21)},
    },
    21: {
      title: "Power",
      display(){
        return "Increase Generator buyable level to h0nde power production exponent by " + format(tmp.h.buyables[21].effectBase) + "." + `<br>` +
        "Currently: ^" + format(buyableEffect("h",21)) + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[21].cost) + " h0nde power" + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 21)) + (tmp.h.buyables[21].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.h.buyables[21].freeLevel))
      },
      costBase(){
        let base = new Decimal(5e33)
        return base 
      },
      costScaling(){ // exponent scaling
        let scaling = new Decimal(1.2)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.h.buyables[21].costBase
        let r = tmp.h.buyables[21].costScaling
        return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
      },
      freeLevel(){
        let free = new Decimal(0)
        return free
      },
      totalLevel(){
        return getBuyableAmount("h", 21).add(tmp.h.buyables[21].freeLevel)
      },
      effectBase(){
        let x = new Decimal(0.5)
        return x
      },
      effect(){
        let x = tmp.h.buyables[21].totalLevel.mul(tmp.h.buyables[21].effectBase).add(1)
        return x
      },
      canAfford(){
        return player.h.points.gte(tmp.h.buyables[21].cost)
      },
      buy(){
        let cost = tmp.h.buyables[21].cost
        if (player.h.points.lt(cost)) return
        addBuyables("h", 21, new Decimal(1))
        // some upgrade should make them not actually remove h0nde power
        player.h.points = player.h.points.minus(cost)
      },
      buyMax(){
        let maxBulk = tmp.h.buyables[21].purchaseLimit.sub(getBuyableAmount("h", 21))
        let bulk
        let a = tmp.h.buyables[21].cost.log(10)
        let r = tmp.h.buyables[21].costScaling
        let x = player.h.points.log(10)
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.div(a).log(r).add(1).floor()
        bulk = bulk.min(maxBulk)
        let cost = a.mul(r.pow(bulk.sub(1))) // log
        addBuyables("h", 21, bulk)
        // some upgrade should make them not actually remove h0nde power
        player.h.points = player.h.points.sub(new Decimal(10).pow(cost))
      },
      unlocked(){ return hasAchievement("a",24)},
    },
  },
  clickables: {
    11: {
      title() {return "Buy max Generator buyable"},
      canClick(){return true},
      onClick(){
        layers.h.buyables[11].buyMax()
      },
      onHold(){
        layers.h.buyables[11].buyMax()
      },
      unlocked(){return hasAchievement("a",22)
    },
   },
   12: {
    title() {return "Buy max Multiplier buyable"},
    canClick(){return true},
      onClick(){
        layers.h.buyables[12].buyMax()
      },
      onHold(){
        layers.h.buyables[12].buyMax()
      },
      unlocked(){return hasAchievement("a",25)
    },
  },
  13: {
    title() {return "Buy max Divider buyable"},
    canClick(){return true},
     onClick(){
       layers.h.buyables[13].buyMax()
      },
     onHold(){
       layers.h.buyables[13].buyMax()
      },
     unlocked(){return hasAchievement("a",25)},
    },
  },
  upgrades: {
    11: {
      title: "Doubler",
      description: "For every 50 Generator buyable levels, double h0nde power gain, you need 100 Generator buyable level to buy this upgrade)",
      cost: new Decimal(10000),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return tmp.h.buyables[11].totalLevel.gte(100)
      },
    },
    12: {
      title: "Cheaper",
      description: "Divide Generator buyable cost based on h0nde accounts, you need 175 Generator buyable level to buy this upgrade",
      cost: new Decimal(2e5),
      effect(){
        let eff = player.points.add(1)
        return eff
      },
      effectDisplay(){
        return "/" + format(upgradeEffect("h",12))
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return tmp.h.buyables[11].totalLevel.gte(175)
      },
    },
    13: {
      title: "Faster",
      description: "Generator buyable multiplier boost occur twice as fast, but the base multiplier is reduced by 0.4, you need 3 Multiplier buyable level to buy this upgrade",
      cost: new Decimal(5e7),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return tmp.h.buyables[12].totalLevel.gte(3)
      },
    },
    14: {
      title: "Stronger",
      description: "An Alt account achievement reward is squared, you need 16 Multiplier buyable level to buy this upgrade",
      cost: new Decimal(1e12),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return tmp.h.buyables[12].totalLevel.gte(16)
      },
    },
    15: {
      title: "Extra",
      description: "Each Multiplier buyable level give a free level on Generator buyable, you need 3 Divider buyable level to buy this upgrade",
      cost: new Decimal(5e16),
      effect(){
        let eff = tmp.h.buyables[12].totalLevel
        return eff
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return tmp.h.buyables[13].totalLevel.gte(3)
      },
    },
    21: {
      title: "Extra 2",
      description: "Each Divider buyable level give a free level on Multiplier buyable, and Multiplier buyable boost ^1.25, you need 900 Generator buyable level to buy this upgrade",
      cost: new Decimal(5e17),
      effect(){
        let eff = tmp.h.buyables[13].totalLevel
        return eff
      },
      unlocked(){
        return player.h.upgrades.length >= 5
      },
      canAfford(){
        return tmp.h.buyables[11].totalLevel.gte(900)
      },
    },
    22: {
      title: "Cheaper 2",
      description: "Divider buyable divide the cost of Multiplier buyable, you need 60 Multiplier buyable level to buy this upgrade",
      cost: new Decimal(5e21),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return player.h.upgrades.length >= 5
      },
      canAfford(){
        return tmp.h.buyables[12].totalLevel.gte(60)
      },
    },
    23: {
      title: "Booster",
      description: "Raise Multiplier and Divider buyable effect to the 1.5th power, you need 85 Multiplier buyable level to buy this upgrade",
      cost: new Decimal(1e23),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return player.h.upgrades.length >= 5
      },
      canAfford(){
        return tmp.h.buyables[12].totalLevel.gte(85)
      },
    },
    24: {
      title: "Doubler 2",
      description: "Double the base of Multiplier buyable, you need 35 Divider buyable level to buy this upgrade",
      cost: new Decimal(5e37),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return player.h.upgrades.length >= 5
      },
      canAfford(){
        return tmp.h.buyables[13].totalLevel.gte(35)
      },
    },
    25: {
      title: "New Layer",
      description: "Unlock a new Layer (WIP), you need 3 Power buyable level and 2,500 non-free Generator buyable level to buy this upgrade",
      cost: new Decimal(1e50),
      effect(){
        let eff = new Decimal(1)
        return eff
      },
      unlocked(){
        return player.h.upgrades.length >= 5
      },
      canAfford(){
        return tmp.h.buyables[21].totalLevel.gte(3) && getBuyableAmount("h",11).gte(2500)
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
  }},
  color: "#31aeb0",
  requires: new Decimal(2500), // Can be a function that takes requirement increases into account
  resource: "prestige points", // Name of prestige currency
  baseResource: "non-free Generator buyable level", // Name of resource prestige is based on
  baseAmount() {return getBuyableAmount("h",11)}, // Get the current amount of baseResource
  type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  getResetGain() {
    let gain = new Decimal(10).pow(getBuyableAmount("h",11).add(1e-10).pow(0.5).sub(50))
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
    return false //getBuyableAmount("h",11).gte(2500)
  },
  update(diff){

  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  branches: ["h"],
  layerShown(){return hasUpgrade("h",25) || player.p.unlocked},
  tabFormat: {
    "Main": {
      content: [
        "main-display","prestige-button","blank","resource-display",
        ],
    },
  },
  doReset(resettingLayer) {
    let keep = [];
    if (layers[resettingLayer].row > this.row) layerDataReset("h", keep)
  },
})

addLayer("a", {
  startData() { return {
      unlocked: true,
  }},
  color: "yellow",
  row: "side",
  position: 0,
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
      tooltip(){return "Get 1 h0nde account"},
    },
    12: {
      name: "An Alt account",
      done(){return player.points.gte(2)},
      tooltip(){return "Get 2 h0nde account. Reward: your h0nde accounts boost h0nde power gain. (" + format(achievementEffect("a", 12)) + "x)"},
      effect(){
        let eff = player.points.add(1)
        if (hasUpgrade("h",14)) eff = eff.pow(2)
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
      tooltip(){return "Get 10 h0nde account. Reward: Square Multiplier buyable effect."},
    },
    21: {
      name: "QUADRILLION POWER",
      done(){return player.h.points.gte(1e15)},
      tooltip(){return "Reach " + format(1e15) + " h0nde power. Reward: unlock a buyable, h0nde power increase Multiplier buyable base. (+" + format(achievementEffect("a", 21), 4) + ")"},
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
      name: "Yet another softcap",
      done(){return tmp.h.buyables[11].totalLevel.gte(2500)},
      tooltip(){return "Get 2,500 Generator buyable level. Reward: you can buy max Multiplier and Divider buyables, Generator buyable multiplier boost +0.1."},
    },
  },
})