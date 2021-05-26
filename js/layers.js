addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
        bestBoughtUpgs: 0,
    }},
    color: "#31aeb0",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
      let exp = new Decimal(0.25)
      if (hasUpgrade("p", 44)) exp = exp.add(upgradeEffect("p", 44))
      return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 15)) mult = mult.mul(upgradeEffect("p", 15))
        if (hasUpgrade("p", 21)) mult = mult.mul(upgradeEffect("p", 21)[1])
        if (hasUpgrade("p", 22)) mult = mult.mul(upgradeEffect("p", 22))
        if (hasUpgrade("p", 34)) mult = mult.mul(upgradeEffect("p", 34))
        if (hasAchievement("a", 21)) mult = mult.mul(achievementEffect("a", 21))
        if (hasUpgrade("p", 52)) mult = mult.mul(upgradeEffect("p", 52))
        if (hasChallenge("q", 22)) mult = mult.mul(challengeEffect("q", 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    softcap() {
      let sc = new Decimal("ee6")
      return sc
    },
    softcapPower() {
      let pow = new Decimal(0.1)
      return pow
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){return (hasAchievement("a", 24) ? 0.01 : 0)},
    doReset(resettingLayer) {
			let keep = ["bestBoughtUpgs"];
      if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    update(diff){
        player.p.bestBoughtUpgs = Math.max(player.p.bestBoughtUpgs, player.p.upgrades.length)
    },
    tabFormat:[
      "main-display",
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
      ["bar", "progressBar"],
      "blank",
      "upgrades"
    ],
    upgrades: {
        11: {
          title: "(1) Jacorb",
          description: "The one who make The Prestige Tree. Begin the points generation",
          cost: new Decimal(1),
        },
        12: {
          title: "(2) Acamaeda",
          description(){
            return "The one who make The Modding Tree. Multiply points gain by " + format(tmp.p.upgrades[12].effectBase) + " for every prestige upgrade bought"
          },
          cost: new Decimal(2),
          effectBase(){
            let base = new Decimal(2)
            if (hasUpgrade("p", 31)) base = base.add(upgradeEffect("p", 31))
            if (hasUpgrade("p", 55)) base = base.add(upgradeEffect("p", 55))
            if (hasUpgrade("p", 72)) base = base.pow(upgradeEffect("p", 72))
            return base
          },
          effect(){
            let x = new Decimal(player.p.upgrades.length)
            if (maxedChallenge("q", 11)) x = x.pow(1.1)
            let y = maxedChallenge("q", 11) ? new Decimal(0) : new Decimal(10)
            if (x.gte(y)) x = y.add(x.sub(y).mul(challengeEffect("q", 11)))
            if (inChallenge("q", 11)) x = new Decimal(0)
            let eff = tmp.p.upgrades[12].effectBase.pow(x)
            if (eff.gte(tmp.p.upgrades[12].effectSCStart)) eff = new Decimal(10).pow(new Decimal(tmp.p.upgrades[12].effectSCStart.log(10)).mul(eff.log(10).div(tmp.p.upgrades[12].effectSCStart.log(10)).pow(0.5)))
            return eff
          },
          effectSCStart(){
            let sc = new Decimal(1e100)
            if (hasUpgrade("p", 54)) sc = sc.mul(upgradeEffect("p", 54))
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 12)) + "x" + (upgradeEffect("p", 12).gte(tmp.p.upgrades[12].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 11)},
        },
        13: {
          title: "(3) thefinaluptake",
          description(){
            return "The first user to create TMT fork. and maker of The Burning Tree, multiply points gain by log2(points+2)"
          },
          cost: new Decimal(10),
          effect(){
            let eff = player.points.add(2).log(2)
            if (hasUpgrade("p", 24)) eff = eff.pow(upgradeEffect("p", 24))
            if (hasUpgrade("p", 42)) eff = eff.pow(upgradeEffect("p", 42))
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 13)) + "x"},
          unlocked(){return hasUpgrade("p", 12)},
        },
        14: {
          title: "(4) Menohe",
          description(){
            return "The tree is totally cursed... multiply points gain by sqrt(PP+1)"
          },
          cost: new Decimal(50),
          effect(){
            let eff = player.p.points.add(1).pow(0.5)
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 14)) + "x"},
          unlocked(){return hasUpgrade("p", 13)},
        },
        15: {
          title: "(5) Katakana1",
          description(){
            return "The broken game... +" + format(tmp.p.upgrades[15].effectBase.mul(100)) + "% PP gain for every prestige upgrade bought (" + (hasUpgrade("p", 35) ? "stacks multiplicatively" : "stacks additively") + ", softcapped at 15)"
          },
          cost: new Decimal(300),
          effectBase(){
            let base = new Decimal(0.1)
            if (hasAchievement("a", 14)) base = base.add(achievementEffect("a", 14))
            return base
          },
          effect(){
            let x = new Decimal(player.p.upgrades.length)
            if (x.gte(15)) x = new Decimal(15).add(x.sub(15).div(3))
            let eff = hasUpgrade("p", 35) ? tmp.p.upgrades[15].effectBase.add(1).pow(x) : x.mul(tmp.p.upgrades[15].effectBase).add(1)
            if (hasUpgrade("p", 24)) eff = eff.pow(upgradeEffect("p", 24))
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 15)) + "x"},
          unlocked(){return hasUpgrade("p", 14)},
        },
        21: {
          title: "(6) okamii17",
          description(){
            return "The maker of Prestige Tree stardust. multiply points gain by 17 and PP gain by 1.7"
          },
          cost: new Decimal(900),
          effect(){
            let eff = [new Decimal(17), new Decimal(1.7)]
            return eff
          },
          unlocked(){return hasUpgrade("p", 15)},
        },
        22: {
          title: "(7) Letorin",
          description(){
            return "Another Broken Game. multiply PP gain by sqrt(log2(points+2))"
          },
          cost: new Decimal(3000),
          effect(){
            let eff = player.points.add(2).log(2).pow(0.5)
            if (hasUpgrade("p", 42)) eff = eff.pow(upgradeEffect("p", 42))
            if (hasUpgrade("p", 65)) eff = eff.pow(upgradeEffect("p", 65))
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 22)) + "x"},
          unlocked(){return hasUpgrade("p", 21)},
        },
        23: {
          title: "(8) thepaperpilot",
          description(){
            return "I see nothing special in githack. but they have game dev tree on tpp.rocks, unlock a new layer (permanently keep), multiply points gain by 10"
          },
          cost: new Decimal(30000),
          effect(){
            let eff = new Decimal(10)
            return eff
          },
          unlocked(){return hasUpgrade("p", 22)},
        },
        24: {
          title: "(9) Dystopia-user181",
          description(){
            return "The maker of Factoree. ^1.81 Upgrade 3 and 5 effect"
          },
          cost: new Decimal(4e5),
          effect(){
            let eff = new Decimal(1.81)
            return eff
          },
          unlocked(){return hasUpgrade("p", 23)},
        },
        25: {
          title: "(10) E3XA",
          description(){
            return "The Unplayable Roblox Tree. cubes boosters boost and triple points gain"
          },
          cost: new Decimal(3e6),
          effect(){
            let eff = new Decimal(3)
            return eff
          },
          unlocked(){return hasUpgrade("p", 24)},
        },
        31: {
          title: "(11) MocyaTheMole",
          description(){
            return "The Cursed Tree. +" + format(format(tmp.p.upgrades[31].effectBase)) + " Upgrade 2 base for every boosters"
          },
          cost: new Decimal(3e7),
          effectBase(){
            let base = new Decimal(0.75)
            if (hasUpgrade("p", 63)) base = base.mul(upgradeEffect("p", 63))
            return base
          },
          effect(){
            let eff = tmp.p.upgrades[31].effectBase.mul(player.b.points)
            if (eff.gte(15) && !hasUpgrade("p", 63)) eff = new Decimal(15).mul(eff.div(15).pow(0.25))
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 31)) + (upgradeEffect("p", 31).gte(15) && !hasUpgrade("p", 63) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 25)},
        },
        32: {
          title: "(12) Some-random-guy7718",
          description(){
            return "Another Cursed Tree. multiply points gain by 771.8 and divide boosters cost by 3"
          },
          cost: new Decimal(1e10),
          effect(){
            let eff = [new Decimal(771.8), new Decimal(3)]
            return eff
          },
          unlocked(){return hasUpgrade("p", 31)},
        },
        33: {
          title: "(13) jgdovin",
          description(){
            return "ANOTHER Cursed Tree. +" + format(format(tmp.p.upgrades[33].effectBase)) + " Booster boost base for every prestige upgrades bought"
          },
          cost: new Decimal(6e11),
          effectBase(){
            let base = new Decimal(0.05)
            return base
          },
          effect(){
            let eff = tmp.p.upgrades[33].effectBase.mul(player.p.upgrades.length)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 33))},
          unlocked(){return hasUpgrade("p", 32)},
        },
        34: {
          title: "(14) Crimson4061",
          description(){
            return "He is Crimson406, despite an extra 1. multiply PP gain by 406 and reduce boosters base to 406"
          },
          cost: new Decimal(5e12),
          effect(){
            let eff = new Decimal(406)
            return eff
          },
          unlocked(){return hasUpgrade("p", 33)},
        },
        35: {
          title: "(15) IEmory",
          description(){
            return "He is smiley, but he already leave discord for around " + formatWhole(Math.floor((Date.now() - 1616601600000) / 86400000)) + " days. unlock Quests (permanently keep), Upgrade 5 now stacks multiplicatively"
          },
          cost: new Decimal(5e16),
          effect(){
            let eff = new Decimal(1)
            return eff
          },
          unlocked(){return hasUpgrade("p", 34)},
        },
        41: {
          title: "(16) peachparlor",
          description(){
            return "Totally a weird tree with some basic features. Divide boosters cost by Prestige Points^0.1 (softcapped at 10,000)"
          },
          cost: new Decimal(5e21),
          effect(){
            let eff = player.p.points.max(1).pow(0.1)
            if (eff.gte(10000)) eff = eff.log(10).mul(2500)
            if (hasUpgrade("p", 64)) eff = eff.pow(upgradeEffect("p", 64))
            return eff
          },
          effectDisplay(){return "/" + format(upgradeEffect("p", 41))},
          unlocked(){return hasUpgrade("p", 35)},
        },
        42: {
          title: "(17) gapples2",
          description(){
            return "The Tree is so basic... with more mods. square Upgrade 3 and 7 effect"
          },
          cost: new Decimal(3e23),
          effect(){
            let eff = new Decimal(2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 41)},
        },
        43: {
          title: "(18) Pimvgd",
          description(){
            return "Growth: Quadratic. multiply points gain by (points+1)^0.05"
          },
          cost: new Decimal(1e31),
          effect(){
            let eff = player.points.add(1).pow(0.05)
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 43)) + "x"},
          unlocked(){return hasUpgrade("p", 42)},
        },
        44: {
          title: "(19) Grodvert",
          description(){
            return "Nothing Special. PP gain exponent is increased by 0.05"
          },
          cost: new Decimal(4e34),
          effect(){
            let eff = new Decimal(0.05)
            return eff
          },
          unlocked(){return hasUpgrade("p", 43)},
        },
        45: {
          title: "(20) Cubedey",
          description(){
            return "Tree is going to be Prestige! increase boosters boost base based on prestige points"
          },
          cost: new Decimal(5e47),
          effect(){
            let eff = player.p.points.add(1).log(10).div(100)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 45))},
          unlocked(){return hasUpgrade("p", 44)},
        },
        51: {
          title: "(21) Pikiquouik",
          description(){
            return "I have absoulately no idea what's going on. increase Achievement 13 reward achievement exponent by 0.25"
          },
          cost: new Decimal(6e61),
          effect(){
            let eff = new Decimal(0.25)
            return eff
          },
          unlocked(){return hasUpgrade("p", 45)},
        },
        52: {
          title: "(22) pg132",
          description(){
            return "The maker of Incrementreeverse, Prestige Chain and The Tree of Life. " + format(132**2) + "x Points and PP gain"
          },
          cost: new Decimal(2e77),
          effect(){
            let eff = new Decimal(132**2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 51)},
        },
        53: {
          title: "(23) MCKight",
          description(){
            return "Nothing Special. Total Quests completion boosts points gain"
          },
          cost: new Decimal(5e132),
          effect(){
            let eff = new Decimal(10).pow(totalQuestsCompletion())
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 53)) + "x"},
          unlocked(){return hasUpgrade("p", 52)},
        },
        54: {
          title: "(24) multivberse",
          description(){
            return "He is actually tried to make a mod. Upgrade 2 and Boosters boost softcap starts " + format(tmp.p.upgrades[54].effectBase) + "x later for every Infinity Points (softcapped at 10)"
          },
          cost: new Decimal(3e144),
          effectBase(){
            let base = new Decimal(1e4)
            if (hasUpgrade("p", 71)) base = base.pow(upgradeEffect("p", 71))
            return base
          },
          effect(){
            let x = player.i.points
            if (x.gte(10)) x = x.div(10).pow(0.5).mul(10)
            let eff = tmp.p.upgrades[54].effectBase.pow(x)
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 54)) + "x"},
          unlocked(){return hasUpgrade("p", 53)},
        },
        55: {
          title: "(25) randomtuba",
          description(){
            return "A random user that doesn't have something special. Increase Upgrade 2 base based on Prestige Points"
          },
          cost: new Decimal(5e160),
          effect(){
            let eff = player.p.points.add(1).log(10).div(10)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 55))},
          unlocked(){return hasUpgrade("p", 54)},
        },
        61: {
          title: "(26) jckwik",
          description(){
            return "population > criminals. increase Achievement 13 reward achievement exponent by 0.2"
          },
          cost: new Decimal(1e199),
          effect(){
            let eff = new Decimal(0.2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 55)},
        },
        62: {
          title: "(27) unsmith19",
          description(){
            return "corruptionsmith. You gain 19% more boosters"
          },
          cost: new Decimal(4e226),
          effect(){
            let eff = new Decimal(1.19)
            return eff
          },
          unlocked(){return hasUpgrade("p", 61)},
        },
        63: {
          title: "(28) SkitsTheSkitty",
          description(){
            return "cadavers = life essence. Remove the softcap of Upgrade 11 and make it 2.7x stronger"
          },
          cost: new Decimal(6e283),
          effect(){
            let eff = new Decimal(2.7)
            return eff
          },
          unlocked(){return hasUpgrade("p", 62)},
        },
        64: {
          title: "(29) xidafo",
          description(){
            return "Minecraft Tree should allow player to go past " + format(new Decimal("ee3")) + " points. raise Upgrade 16 effect after softcap based on points"
          },
          cost: new Decimal("3e325"),
          effect(){
            let eff = player.points.max(1).log(10).max(1).log(10).max(1).pow(3)
            return eff
          },
          effectDisplay(){return "^" + format(upgradeEffect("p", 64))},
          unlocked(){return hasUpgrade("p", 63)},
        },
        65: {
          title: "(30) ttops",
          description(){
            return "https:corrupted game. Raise Upgrade 7 effect to the power of 15"
          },
          cost: new Decimal("3e474"),
          effect(){
            let eff = new Decimal(15)
            return eff
          },
          unlocked(){return hasUpgrade("p", 64)},
        },
        71: {
          title: "(31) MakerOfDopamine",
          description(){
            return "The crypto miner game. Raise Upgrade 24 effect base based on Total Quests completion"
          },
          cost: new Decimal("1e613"),
          effect(){
            let eff = new Decimal(totalQuestsCompletion()).pow(0.155).max(1)
            return eff
          },
          effectDisplay(){return "^" + format(upgradeEffect("p", 71))},
          unlocked(){return hasUpgrade("p", 65)},
        },
        72: {
          title: "(32) erofu",
          description(){
            return "Normal Tree Mk1. Raise Upgrade 2 base to the power of 1.5"
          },
          cost: new Decimal("8e808"),
          effect(){
            let eff = new Decimal(1.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 71)},
        },
    },
    bars:{
        progressBar: {
          direction: RIGHT,
          width: 450,
          height: 50,
          display(){return "Bought Upgrades: "+player.p.upgrades.length+"/"+(Object.keys(tmp.p.upgrades).length-2) + " (Best: " + formatWhole(player.p.bestBoughtUpgs) + ")"},
          progress() {return player.p.upgrades.length / (Object.keys(tmp.p.upgrades).length-2)},
          unlocked() {return true},
          fillStyle() {return {"background-color": tmp.p.color}},
        },
    },
})

addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
        auto: false,
    }},
    color: "#6e64c4",
    requires(){
      let req = new Decimal(1e10)
      return req
    }, // Can be a function that takes requirement increases into account
    base(){
      let base = new Decimal(500)
      if (hasUpgrade("p", 34)) base = upgradeEffect("p", 34)
      return base
    },
    resource: "boosters", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 32)) mult = mult.div(upgradeEffect("p", 32)[1])
        if (hasUpgrade("p", 41)) mult = mult.div(upgradeEffect("p", 41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult(){
      mult = new Decimal(1)
      if (hasUpgrade("p", 62)) mult = mult.mul(upgradeEffect("p", 62))
      return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("p", 23) || player.b.unlocked},
    canBuyMax(){
      return hasAchievement("a",22)
    },
    autoPrestige(){
      return hasAchievement("a",25)
    },
    resetsNothing(){
      return hasAchievement("a",25)
    },
    effectBase(){
      let base = new Decimal(2)
      if (hasUpgrade("p", 33)) base = base.add(upgradeEffect("p", 33))
      if (hasUpgrade("p", 45)) base = base.add(upgradeEffect("p", 45))
      
      if (hasUpgrade("p", 25)) base = base.pow(upgradeEffect("p", 25))
      return base
    },
    effect(){
      let x = player.b.points
      if (maxedChallenge("q", 12)) x = x.pow(1.1)
      let y = maxedChallenge("q", 12) ? new Decimal(0) : new Decimal(10)
      if (x.gte(y)) x = y.add(x.sub(y).mul(challengeEffect("q", 12)))
      if (inChallenge("q", 12)) x = new Decimal(0)
      let eff = tmp.b.effectBase.pow(x)
      if (eff.gte(tmp.b.effectSCStart)) eff = new Decimal(10).pow(new Decimal(tmp.b.effectSCStart.log(10)).mul(eff.log(10).div(tmp.b.effectSCStart.log(10)).pow(0.5)))
      return eff
    },
    effectSCStart(){
      let sc = new Decimal(1e100)
      if (hasUpgrade("p", 54)) sc = sc.mul(upgradeEffect("p", 54))
      return sc
    },
    effectDescription(){
      return " which multiply points gain by " + format(tmp.b.effect) + (tmp.b.effect.gte(tmp.b.effectSCStart) ? " (softcapped)" : "")
    },
    doReset(resettingLayer) {
			let keep = ["auto"];
      if (layers[resettingLayer].row > this.row) layerDataReset("b", keep)
    },
    tabFormat:[
      "main-display",
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
    ],
})

addLayer("i", {
  name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
      unlocked: false,
      points: new Decimal(0),
      auto: false,
  }},
  color: "yellow",
  requires(){
    let req = new Decimal(Number.MAX_VALUE)
    return req
  }, // Can be a function that takes requirement increases into account
  base(){
    let base = new Decimal(Number.MAX_VALUE)
    return base
  },
  resource: "infinity points", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() {return player.points}, // Get the current amount of baseResource
  type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 1, // Prestige currency exponent
  gainMult() { // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1)
      return mult
  },
  gainExp() { // Calculate the exponent on main currency from bonuses
      return new Decimal(1)
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
      {key: "i", description: "I: Reset for infinity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  branches: ["p","b"],
  layerShown(){return hasAchievement("a",22) || player.i.unlocked},
  canBuyMax(){
    return false
  },
  autoPrestige(){
    return player.i.auto
  },
  resetsNothing(){
    return false
  },
  effect(){
    let eff = (player.i.points.gte(100) ? player.i.points.log(10) : player.i.points.pow(0.5).div(10).add(1))
    return eff
  },
  effectDescription(){
    return " which raise points gain to the power of " + format(tmp.i.effect, 3) + " while not on Quests"
  },
  doReset(resettingLayer) {
    let keep = ["auto"];
    if (layers[resettingLayer].row > this.row) layerDataReset("i", keep)
  },
  tabFormat:[
    "main-display",
    "blank",
    "prestige-button",
    "resource-display",
    "blank",
  ],
})

addLayer("a", {
        startData() { return {
            unlocked: true,
        }},
        color: "olive",
        row: "side",
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("Achievements")
        },
		    tabFormat: [
		      	"blank", "blank", "blank",
		      	["bar","progressBar"], 
			      "blank", "blank",
			      "achievements",
		    ],
        bars:{
            progressBar: {
            direction: RIGHT,
            width: 450,
            height: 50,
            display(){return "Completed Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2)},
            progress() {return player.a.achievements.length / (Object.keys(tmp.a.achievements).length-2)},
            unlocked() {return true},
            fillStyle() {return {"background-color": tmp.a.color}},
            },
        },
        achievements: {
            rows: 100,
            cols: 5,
            11: {
                name: "11",
                done() { return canGenPoints()},
                tooltip(){return "Begin the points generation."},
            },
            12: {
                name: "12",
                done() { return player.points.gte(1e5)},
                tooltip(){return "Reach 100,000 Points."},
            },
            13: {
                name: "13",
                done() {return player.b.points.gte(1)},
                tooltip(){return "Do a boosters reset. Reward: multiply points gain by log10(points+10) for every completed achievement^" + format(tmp.a.achievements[13].effectExp) + ", currently: " + format(achievementEffect("a", 13)) + "x"},
                effect(){
                  let exp2 = tmp.a.achievements[13].effectExp
                  let base = player.points.add(10).log(10)
                  let exp = new Decimal(player.a.achievements.length).pow(exp2)
                  return base.pow(exp)
                },
                effectExp(){
                  let exp = new Decimal(0.5)
                  if (hasAchievement("a", 15)) exp = exp.add(achievementEffect("a", 15))
                  if (hasUpgrade("p", 51)) exp = exp.add(upgradeEffect("p", 51))
                  if (hasUpgrade("p", 61)) exp = exp.add(upgradeEffect("p", 61))
                  return exp
                },
            },
            14: {
                name: "14",
                done() {return player.p.points.gte(1e9)},
                tooltip(){return "Reach " + format(1e9) + " Prestige Points. Reward: add Prestige Upgrade 5 base by log10(PP+10) (softcapped at 40), currently: +" + format(achievementEffect("a", 14).mul(100))},
                effect(){
                  let eff = player.p.points.add(10).log(10).div(100)
                  if (eff.gte(0.4)) eff = new Decimal(0.4).mul(eff.div(0.4).pow(0.25))
                  return eff
                },
            },
            15: {
                name: "15",
                done() {return hasChallenge("q", 11)},
                tooltip(){return "Complete TreeQuest 1. Reward: increase Achievement 13 reward achievement exponent by 0.25"},
                effect(){
                  let eff = new Decimal(0.25)
                  return eff
                },
            },
            21: {
                name: "21",
                done() {return player.b.points.gte(12)},
                tooltip(){return "Reach 12 Boosters. Reward: multiply PP gain by (Boosters+1)^3, currently: " + format(achievementEffect("a", 21)) + "x"},
                effect(){
                  let eff = player.b.points.add(1).pow(3)
                  return eff
                },
            },
            22: {
                name: "22",
                done() {return player.points.gte(Number.MAX_VALUE)},
                tooltip(){return "Reach " + format(Number.MAX_VALUE) + " points. Reward: Unlock a new layer, you can buy max Boosters"},
            },
            23: {
              name: "23",
              done() {return hasChallenge("q", 21)},
              tooltip(){return "Complete TreeQuest 3. Reward: reduce the goal scaling of TreeQuest 1 and TreeQuest 2 to 1.4"},
            },
            24: {
              name: "24",
              done() {return player.p.points.gte(Number.MAX_VALUE)},
              tooltip(){return "Reach " + format(Number.MAX_VALUE) + " prestige points. Reward: you gain 1% of Prestige Point gain every second"},
            },
            25: {
              name: "25",
              done() {return player.b.points.gte(111)},
              tooltip(){return "Reach 111 Boosters. Reward: autobuy Boosters and they resets nothing"},
            },
        },
})

addLayer("q", {
    startData() { return {
        unlocked: false,
        questUnlocked: 0,
    }},
    color: "white",
    row: "side",
    layerShown() {return hasUpgrade("p", 35) || player.q.unlocked}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Quests")
    },
		tabFormat: [
        ["display-text",
         function() { return "Note: All Quests completions is never getting reset"}],
        ["display-text",
         function() { return "Unlocked Quests: " + formatWhole(player.q.questUnlocked) + " (Next at " + formatWhole(player.q.questUnlocked*5+15) + " Bought Prestige Upgrades)"}],
		  	"blank",
			  "challenges",
		],
    update(diff){
        if (hasUpgrade("p", 35)) player.q.unlocked = true
        player.q.questUnlocked = Math.floor(Math.max(player.q.questUnlocked, (player.p.upgrades.length-10)/5))
    },
    challenges: {
      11: {
        name: "TreeQuest 1",
        challengeDescription(){return "Do a forced row 1 reset, Acamaeda have no effect, points gain is square rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 11) + "/" + tmp.q.challenges[11].completionLimit},
        unlocked(){return player.q.questUnlocked >= 1 && player.q.unlocked},
        goalDescription(){return format(tmp.q.challenges[11].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          if (hasAchievement("a", 23)) scaling = new Decimal(1.4)
          let goal = new Decimal(10).pow(new Decimal(15).mul(new Decimal(scaling).pow(challengeCompletions("q", 11))))
          if (challengeCompletions("q", 11) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Acamaeda upgrade amount " + (maxedChallenge("q", 11) ? "": "past 10 ") + "is " + format(challengeEffect("q", 11)) + "x higher" + (maxedChallenge("q", 11) ? " and the amount before multiplier is raised to the power of 1.1": ".")},
        rewardEffect(){
          let eff = new Decimal(challengeCompletions("q", 11)).min(9).add(1)
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[11].goal)},
        onEnter(){doReset("p", true)},
        onExit(){doReset("p", true)},
        onComplete(){doReset("p", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 11)},
      },
      12: {
        name: "TreeQuest 2",
        challengeDescription(){return "Do a forced row 1 reset, Boosters have no effect, points gain is cube rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 12) + "/" + tmp.q.challenges[12].completionLimit},
        unlocked(){return player.q.questUnlocked >= 2 && player.q.unlocked},
        goalDescription(){return format(tmp.q.challenges[12].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          if (hasAchievement("a", 23)) scaling = new Decimal(1.4)
          let goal = new Decimal(10).pow(new Decimal(36).mul(new Decimal(scaling).pow(challengeCompletions("q", 12))))
          if (challengeCompletions("q", 12) >= 8) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Boosters amount " + (maxedChallenge("q", 12) ? "": "past 10 ") + "is " + format(challengeEffect("q", 12)) + "x higher" + (maxedChallenge("q", 12) ? " and the amount before multiplier is raised to the power of 1.1": ".")},
        rewardEffect(){
          let eff = new Decimal(challengeCompletions("q", 12)).min(9).add(1)
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[12].goal)},
        onEnter(){doReset("p", true)},
        onExit(){doReset("p", true)},
        onComplete(){doReset("p", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 12)},
      },
      21: {
        name: "TreeQuest 3",
        challengeDescription(){return "Do a forced row 1 reset, TreeQuest 1 and TreeQuest 2 are applied at once." + `<br>` + 
          "Completion: " + challengeCompletions("q", 21) + "/" + tmp.q.challenges[21].completionLimit},
        unlocked(){return player.q.questUnlocked >= 3 && player.q.unlocked},
        goalDescription(){return format(tmp.q.challenges[21].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          let goal = new Decimal(10).pow(new Decimal(21.5).mul(new Decimal(scaling).pow(challengeCompletions("q", 21))))
          if (challengeCompletions("q", 21) >= 5) goal = new Decimal(Infinity)
          return goal
        },
        countsAs:[11,12],
        rewardDescription(){return "Multiply points gain by " + format(challengeEffect("q", 21))},
        rewardEffect(){
          let eff = new Decimal(10).pow(new Decimal(challengeCompletions("q", 21)).pow(inChallenge("q", 21)?1:2).mul(10))
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[21].goal)},
        onEnter(){doReset("p", true)},
        onExit(){doReset("p", true)},
        onComplete(){doReset("p", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 21)},
      },
      22: {
        name: "TreeQuest 4",
        challengeDescription(){return "Do a forced row 1 reset, points gain exponent is square rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 22) + "/" + tmp.q.challenges[22].completionLimit},
        unlocked(){return player.q.questUnlocked >= 4 && player.q.unlocked},
        goalDescription(){return format(tmp.q.challenges[22].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.1)
          let goal = new Decimal(10).pow(new Decimal(37.5).mul(new Decimal(scaling).pow(challengeCompletions("q", 22))))
          if (challengeCompletions("q", 22) >= 4) goal = goal.pow(scaling.pow(challengeCompletions("q", 22) - 4).pow(2))
          if (challengeCompletions("q", 22) >= 4) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Multiply PP gain by " + format(challengeEffect("q", 22))},
        rewardEffect(){
          let eff = new Decimal(10).pow(new Decimal(challengeCompletions("q", 22)).pow(inChallenge("q", 22)?1:2).mul(10))
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[22].goal)},
        onEnter(){doReset("p", true)},
        onExit(){doReset("p", true)},
        onComplete(){doReset("p", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 22)},
      },
    },
})

function totalQuestsCompletion(){
  let array = [11,12,21,22]
  let comp = 0
  for (let i = 0; i < array.length; i++){
    comp += player.q.challenges[array[i]]
  }
  return comp
}