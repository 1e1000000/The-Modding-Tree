// SIDE LAYERS

addLayer("a", {
  startData() { return {
      unlocked: true,
      page: 1,
  }},
  color: "yellow",
  row: "side",
  position: 1,
  layerShown() {return true}, 
  tooltip() { // Optional, tooltip displays when the layer is locked
      return ("Achievements")
  },
  tabFormat: [
    "blank",
    ["row",[["clickable",11],["clickable",12]]],
    "blank",
    ["display-text", function(){
      return "Page: " + player.a.page
    }],
    "blank",
    ["display-text", function(){
      return "Completed Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2)
    }],
    "blank",
    ["achievements",
      [function(){return player.a.page*5-4},function(){return player.a.page*5-3},function(){return player.a.page*5-2},function(){return player.a.page*5-1},function(){return player.a.page*5-0}]
    ]
  ],
  clickables:{
    11: {
      title() {return ""},
      display(){return "←"},
      canClick(){return player.a.page > 1},
      onClick(){
        player.a.page--
      },
      unlocked(){return true},
      style: {'font-size':'32px'},
    },
    12: {
      title() {return ""},
      display(){return "→"},
      canClick(){return player.a.page < Math.ceil((Object.keys(tmp.a.achievements).length-2)/25)},
      onClick(){
        player.a.page++
      },
      unlocked(){return true},
      style: {'font-size':'32px'},
    },
  },
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
        if (hasChallenge("p", 51)) eff = eff.pow(9)
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
    71: {
      name: "Lowest cost ever",
      done(){return tmp.h.buyables[11].cost.lte(new Decimal(2).pow(-1024)) && player.h.buyables[11].gte(2500) && !player.p.breakLimit},
      tooltip(){return "Make Generator buyable cost below " + format(new Decimal(2).pow(-1024), 2, true) + " h0nde powers with at least 2,500 of them while limit is fixed. Reward: Reduce Generator buyable cost scaling by 0.003"},
    },
    72: {
      name: "Infinite Twitter",
      done(){return player.t.power.gte(Number.MAX_VALUE)},
      tooltip(){return "Reach " + format(Number.MAX_VALUE) + " twitter powers. Reward: Add 3.08 to Producers Speed base."},
    },
    73: {
      name: "Infinite Prestige",
      done(){return player.p.points.gte(Number.MAX_VALUE)},
      tooltip(){return "Reach " + format(Number.MAX_VALUE) + " prestige points. Reward: PP gain ^1.0308 and 308x base twitter power gain."},
    },
    74: {
      name: "10^10^4 POWER",
      done(){return player.h.points.gte("1e10000")},
      tooltip(){return "Reach " + format(new Decimal("1e10000")) + " h0nde powers. Reward: Add 1 to twitter power exponent, h0nde power make h0nde super power effect softcap starts later (" + format(achievementEffect("a", 74)) + "x)"},
      effect(){
        let eff = new Decimal(10).pow(player.h.points.max(1).log(10).pow(0.5))
        return eff
      },
    },
    75: {
      name: "Impossible Expectations",
      done(){return getBuyableAmount("h",21).gte(1) && inChallenge("p",51)},
      tooltip(){return "Buy a Power buyable in Superscaled Challenge. Reward: Add 15% to twitter power exponent (3% while in P challenges)"},
      effect(){
        let eff = new Decimal(1.1)
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
      return "Best h0nde discord accounts: " + format(player.bestPoints, 3)
    }],
    ["display-text", function(){
      return "Square root multi: " + format(tmp.h.getAccmult, 3)
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
    "blank",
    ["display-text", function(){
      return "Production cap: " + format(tmp.h.buyables[11].effectCap) + " (2^^" + format(tmp.h.buyables[11].effectCap.slog(2),4) + ")/s"
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
    "blank",
    ["bar","h0ndeBar"],["bar","twitterBar"],
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
  bars: {
    h0ndeBar: {
        direction: RIGHT,
        width: 450,
        height: 90,
        progress(){return player.points.sub(player.points.floor())},
        display(){
          return convCardToOrd(player.points.ceil()) + " h0nde discord account at" + `<br>` + 
          format(Decimal.pow(10, getInvInfSqrt(player.points.ceil(), tmp.h.getAccmult))) + " h0nde power" + `<br>` +
          "(" + format(player.points.sub(player.points.floor()).mul(100)) + "% completed, " + format(getInvInfSqrt(player.points.ceil(), tmp.h.getAccmult).sub(player.h.points.max(1).log(10)).max(0)) + " OoM left)"
        },
        instant: true,
        fillStyle(){return {"background-color":"#ff0000"}},
    },
    twitterBar: {
      direction: RIGHT,
      width: 450,
      height: 90,
      progress(){
        return player.points.div(tmp.t.nextAt)
      },
      display(){
        return convCardToOrd(player.t.points.add(1)) + " h0nde discord account at" + `<br>` + 
        format(tmp.t.nextAt, 3) + " h0nde discord accounts" + `<br>` +
        "(Estimate h0nde power require: " + format(Decimal.pow(10, getInvInfSqrt(tmp.t.nextAt, tmp.h.getAccmult))) + ")" + `<br>(` + format(tmp.t.nextAt.sub(player.points).max(0), 3) + " left)"
      },
      instant: true,
      fillStyle(){return {"background-color":"#1DA1F2"}},
    },
  },
})

// NON LAYER-EXCLUSIVE FUNCTIONS

function getBoughtUpgradesRow(layer, row){
  let x = 0
  for (let i = 1; i <= 9; i++){
    if (hasUpgrade(layer,row*10+i)) x++
  }
  return x
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

function getInvInfSqrt(amt, sqrt){
  amt = new Decimal(amt)
  sqrt = new Decimal(sqrt)

  if (amt.lt(1)) return amt

  let times = amt.log(sqrt).floor()
  let a = Decimal.pow(2, times)

  return Decimal.pow(sqrt,a.sub(1)).mul(Decimal.pow(amt.div(sqrt.pow(times)),a))
}

function convCardToOrd(num){
  num = new Decimal(num).floor()
  let x = num.div(10).sub(num.div(10).floor()).mul(10).floor()
  let y = num.div(100).sub(num.div(100).floor()).mul(10).floor()
  let ord = "th"
  if (y.neq(1) && num.lt(1e12)){
    if (x.eq(1)) ord = "st"
    if (x.eq(2)) ord = "nd"
    if (x.eq(3)) ord = "rd"
  }
  return formatWhole(num) + ord
}