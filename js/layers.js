addLayer("h", {
  name: "h0nde", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
    unlocked: true,
	  points: new Decimal(0),
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
    let p = new Decimal(1)
    return p
  },
  getNextAt(){
    return ""
  },
  canReset(){
    return false
  },
  update(diff){
    //player.h.points = player.h.points.plus(layers.h.getResetGain().times(diff))
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
        "blank","buyables","blank","upgrades"
      ],
    },
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
        return "Produce " + format(tmp.h.buyables[11].effectBase) + " h0nde powers per second" + `<br>` +
        "Currently: " + format(buyableEffect("h",11)) + "/s" + `<br>` + `<br>` + 
        "Cost: " + format(tmp.h.buyables[11].cost) + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 11)) + " / " + formatWhole(tmp.h.buyables[11].purchaseLimit)
      },
      costBase(){
        let base = new Decimal(5)
        if (hasUpgrade("h",12)) base = base.div(upgradeEffect("h",12))
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
      multiBoostDensity(){
        let d = new Decimal(50)
        if (hasUpgrade("h",13)) d = d.div(2)
        return d
      },
      multiBoostMultiplier(){
        let m = new Decimal(1)
        if (hasUpgrade("h",11)) m = m.add(1)
        if (hasUpgrade("h",13)) m = m.sub(0.4)
        return m
      },
      multiBoostAmountSCStart(){ // maybe used in future
        let s = new Decimal(Infinity)
        return s
      },
      effectBase(){
        let a = getBuyableAmount("h", 11) // current amount
        let d = tmp.h.buyables[11].multiBoostDensity // for every d level, boost production
        let s = tmp.h.buyables[11].multiBoostAmountSCStart // after s boosts, effect start to softcap
        let n = a.div(d).floor() // multi boost times
        if (n.gte(s)) n = n.div(s).pow(0.5).mul(s)
        let x = tmp.h.buyables[11].multiBoostMultiplier.pow(n) // base prod with multi boost
        x = x.mul(buyableEffect("h",12))
        if (hasAchievement("a", 12)) x = x.mul(achievementEffect("a", 12))
        if (hasAchievement("a", 14)) x = x.mul(achievementEffect("a", 14))
        return x
      },
      effect(){
        let x = getBuyableAmount("h", 11).mul(tmp.h.buyables[11].effectBase)
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
        "Cost: " + format(tmp.h.buyables[12].cost) + `<br>` +
        "Level " + formatWhole(getBuyableAmount("h", 12))
      },
      costBase(){
        let base = new Decimal(1e7)
        return base 
      },
      costScaling(){
        let scaling = new Decimal(2)
        return scaling
      },
      cost(x=player[this.layer].buyables[this.id]){
        let a = tmp.h.buyables[12].costBase
        let r = tmp.h.buyables[12].costScaling
        return a.mul(r.pow(x))
      },
      effectBase(){
        let x = new Decimal(0.5)
        return x
      },
      effectExp(){
        let e = new Decimal(1)
        if (hasAchievement("a",15)) e = e.mul(2)
        return e
      },
      effect(){
        let x = getBuyableAmount("h", 12).mul(tmp.h.buyables[12].effectBase).add(1)
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
        let bulk
        let a = tmp.h.buyables[12].cost
        let r = tmp.h.buyables[12].costScaling
        let x = player.h.points
        if (x.lt(a)) return
        if (a.eq(0)) bulk = new Decimal(1)
        else bulk = x.mul(r.sub(1)).div(a).add(1).log(r).floor()
        let cost = new Decimal(0)
        if (!a.eq(0)) cost = a.mul(r.pow(bulk).sub(1)).div(r.sub(1))
        addBuyables("h", 12, bulk)
        // some upgrade should make them not actually remove h0nde power, but the formula maybe recode
        player.h.points = player.h.points.sub(cost)
      },
      unlocked(){ return hasAchievement("a",14)},
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
        return getBuyableAmount("h", 11).gte(100)
      },
    },
    12: {
      title: "Divider",
      description: "Divide Generator buyable cost based on h0nde accounts, you need 175 Generator buyable level to buy this upgrade",
      cost: new Decimal(2e5),
      effect(){
        let eff = player.points.add(1)
        return eff
      },
      unlocked(){
        return hasAchievement("a",13)
      },
      canAfford(){
        return getBuyableAmount("h", 11).gte(175)
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
        return getBuyableAmount("h", 12).gte(3)
      },
    },
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
        return eff
      },
    },
    13: {
      name: "Multi Generators",
      done(){return getBuyableAmount("h",11).gte(100)},
      tooltip(){return "Reach Level 100 Generator buyable. Reward: unlock h0nde power upgrades."},
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
      name: "softcapped",
      done(){return player.points.gte(10)},
      tooltip(){return "Get 10 h0nde account. Reward: Square Multiplier buyable effect."},
    },
  },
})