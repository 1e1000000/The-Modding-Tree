addLayer("p", {
    name: "prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#31aeb0",
    requires(){ 
      let base = new Decimal(1)
      base = base.div(layers.l.effect()[0])
      return base
    },
    resource: "prestige points",
    baseResource: "meters",
    baseAmount() {return player.points},
    type: "normal",
    effectDescription(){
      return ""
    },
    exponent(){
      let base = new Decimal(0.5)
      return base
    },
    gainMult() {
      mult = new Decimal(1)
      if (hasUpgrade("p", 21)) mult = mult.mul(upgradeEffect("p",21))
      if (hasUpgrade("p", 22)) mult = mult.mul(upgradeEffect("p",22))
      if (hasUpgrade("p", 23)) mult = mult.mul(upgradeEffect("p",23))
      mult = mult.mul(layers.b.effect()[0])
      if (hasUpgrade("g", 12)) mult = mult.mul(upgradeEffect("g",12))
      return mult
    },
    gainExp() {
      let exp = new Decimal(1)
      if (lightPowerActive(2)) exp = exp.mul(tmp.l.lightPowBoost[2])
      return exp
    },
    softcap(){let base = new Decimal(10)
            if (hasUpgrade("p", 31)) base = base.mul(upgradeEffect("p",31))
            if (hasMilestone("l", 2)) base = base.mul(player.b.points.add(1).pow(2))
            if (hasUpgrade("l", 21)) base = base.pow(upgradeEffect("l",21))
            return base
           },
    softcapPower(){return new Decimal(0.5)},
    row: 0,
    hotkeys: [
      {key: "p", description: "Press P to Prestige", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){ return (hasMilestone("g", 1))?1:0},
		doReset(resettingLayer) {
			let keep = [];
			if (hasMilestone("b", 3) && (resettingLayer== "b" || resettingLayer== "g")) keep.push("upgrades")
      if (hasMilestone("l", 7) && (resettingLayer== "l" || resettingLayer== "u" || resettingLayer== "sb")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    tabFormat:[
      "main-display",
      ["display-text", function(){
        return (!player.b.unlocked ? "Reach 1,024 Prestige Points to unlock Boosters" : "")}],
      "prestige-button",
      ["display-text", function(){
        return "Your prestige points gain past " + format(tmp.p.softcap) + " are raised to the power of " + format(tmp.p.softcapPower)}],
      "blank",
      "resource-display",
      "blank",
      "upgrades"
    ],
    upgrades: {
      rows: 3,
      cols: 4,
      11: {
        description: "Boost Meter speed based on Prestige Points",
        cost: new Decimal(2),
        effect(){
          let base = player.p.points.add(1).pow(0.5)
          if (base.gte(100) && !hasMilestone("b", 1)) base = base.log(10).mul(50)
          if (hasUpgrade("l", 22)) base = base.pow(upgradeEffect("l",22)[1])
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",11)) + "x"
        },
        unlocked(){
          return player.p.total.gte(1) || hasMilestone("b", 3) || hasMilestone("l", 7)
        }
      },
      12: {
        description: "Boost Meter speed based on Meters",
        cost: new Decimal(8),
        effect(){
          let base = player.points.add(1).log(10).add(1)
          if (hasUpgrade("p", 14)) base = base.pow(upgradeEffect("p",14))
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",12)) + "x"
        },
        unlocked(){
          return hasUpgrade("p", 11)
        }
      },
      13: {
        description: "Boost Meter speed based on Bought Prestige Upgrades",
        cost: new Decimal(128),
        effect(){
          let base = new Decimal(1.2).pow(player.p.upgrades.length)
          if (hasMilestone("l", 8)) base = base.pow(2)
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",13)) + "x"
        },
        unlocked(){
          return hasUpgrade("p", 22)
        }
      },
      14: {
        description: "Raise Prestige Upgrade 2 effect to the power of 4",
        cost: new Decimal(2).pow(48),
        effect(){
          let base = new Decimal(4)
          return base
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
      21: {
        description: "Boost Prestige Points gain based on Prestige Points",
        cost: new Decimal(16),
        effect(){
          let base = player.p.points.add(1).pow(0.2)
          if (base.gte(10) && !hasMilestone("b", 1)) base = base.log(10).mul(10)
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",21)) + "x"
        },
        unlocked(){
          return hasUpgrade("p", 12)
        }
      },
      22: {
        description: "Boost Prestige Points gain based on Meters",
        cost: new Decimal(32),
        effect(){
          let base = player.points.add(1).log(10).add(1)
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",22)) + "x"
        },
        unlocked(){
          return hasUpgrade("p", 12)
        }
      },
      23: {
        description: "Boost Prestige Points gain based on Bought Prestige Upgrades",
        cost: new Decimal(512),
        effect(){
          let base = new Decimal(1).add(player.p.upgrades.length/5)
          if (hasMilestone("l", 8)) base = base.pow(2)
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",23)) + "x"
        },
        unlocked(){
          return hasUpgrade("p", 22)
        }
      },
      24: {
        description: "Boost Light gain based on Prestige Points",
        cost: new Decimal(2).pow(60),
        effect(){
          let base = player.p.points.add(10).log(10)
          return base
        },
        effectDisplay(){
          return format(upgradeEffect("p",24)) + "x"
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
      31: {
        description: "Prestige Points gain softcap starts 10x later",
        cost: new Decimal(16384),
        effect(){
          return new Decimal(10)
        },
        unlocked(){
          return hasUpgrade("b", 11)
        }
      },
      32: {
        description: "Booster Boosts second effect is raised to the power of 4",
        cost: new Decimal(65536),
        effect(){
          return new Decimal(4)
        },
        unlocked(){
          return hasUpgrade("b", 11)
        }
      },
      33: {
        description: "Meter speed is 10x faster (Unaffected by first stage softcap)",
        cost: new Decimal(131072),
        effect(){
          return new Decimal(10)
        },
        unlocked(){
          return hasUpgrade("b", 11)
        }
      },
      34: {
        description: "Upgrade to the left are no longer affect by second stage softcap, and Booster Boosts second effect ^1.5",
        cost: new Decimal(2).pow(78),
        effect(){
          let base = new Decimal(1.5)
          return base
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
    },
})

addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
        auto: false,
    }},
    color: "#6e64c4",
    requires() {
      let base = new Decimal(1024)
      if (hasUpgrade("g", 11)) base = base.div(upgradeEffect("g",11))
      if (hasMilestone("l", 4)) base = base.div(16)
      if (hasMilestone("l", 7)) base = base.div(layers.l.effect()[0])
      if (hasUpgrade("l", 13)) base = base.div(upgradeEffect("l",13))
      if (lightPowerActive(4)) base = base.div(tmp.l.lightPowBoost[4])
      return base
    }, // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "meters", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    branches: ["p"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
      let base = [new Decimal(1).add(player.b.points), new Decimal(1).add(player.b.points)] // 0: Prestige Points gain, 1: Meter Speed
      if (hasUpgrade("l", 12)) base[0] = base[0].pow(upgradeEffect("l",12))
      
      if (hasUpgrade("p", 32)) base[1] = base[1].pow(upgradeEffect("p",32))
      if (hasUpgrade("p", 34)) base[1] = base[1].pow(upgradeEffect("p",34))
      if (hasUpgrade("l", 12)) base[1] = base[1].pow(upgradeEffect("l",12))
      return base
    },
    effectDescription(){
      return "which multiply Prestige Points gain by " + format(layers.b.effect()[0]) + (hasMilestone("b", 0) ? " and Meter speed by " + format(layers.b.effect()[1]) : "")
    },
    base() {
      let base = new Decimal(4)
      return base
    },
    exponent(){ 
      let base = new Decimal(1.5)
      if (hasMilestone("l", 5)) base = base.mul(0.9)
      return base
    }, // Prestige currency exponent
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {key: "b", description: "Press B to perform a booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.p.points.gte(1024) || player.b.unlocked ? true : "ghost"},
    canBuyMax(){return hasMilestone("l", 4)},
    autoPrestige(){return player.b.auto && hasMilestone("l", 6)},
    resetsNothing(){return hasMilestone("l", 9)},
		doReset(resettingLayer) {
			let keep = ["auto"];
      if (hasMilestone("l", 3) && (resettingLayer== "l" || resettingLayer== "u" || resettingLayer== "sb")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("b", keep)
    },
    tabFormat:[
      "main-display",
      ["display-text", function(){
        return (!player.g.unlocked ? "Reach 4 Boosters to unlock Generators" : "")}],
      "prestige-button",
      "resource-display",
      "blank",
      "milestones",
      "blank",
      "upgrades"
    ],
    milestonePopups: false,
    milestones: {
      0: {
          requirementDescription: "2 Boosters",
          effectDescription: "Boosters boost Meter Speed",
          done() { return player.b.points.gte(2) || hasMilestone("l", 1)},
          unlocked(){return player.b.unlocked}
      },
      1: {
          requirementDescription: "4 Boosters",
          effectDescription: "Remove the softcap of Prestige Upgrade 1 and 4",
          done() { return player.b.points.gte(4) || hasMilestone("l", 1)},
          unlocked(){return player.b.unlocked}
      },
      2: {
          requirementDescription: "6 Boosters",
          effectDescription: "Generator Power boosts multiplier ^1.5",
          done() { return player.b.points.gte(6) || hasMilestone("l", 1)},
          unlocked(){return player.b.unlocked}
      },
      3: {
          requirementDescription: "7 Boosters",
          effectDescription: "Keep Prestige Upgrades on all row 2 resets",
          done() { return (player.b.points.gte(7) && player.l.unlocked) || hasMilestone("l", 5)},
          unlocked(){return player.l.unlocked}
      },
    },
    upgrades: {
      rows: 1,
      cols: 3,
      11: {
        description: "Unlock 3 new Prestige Upgrades, and 5x Meter Speed",
        cost: new Decimal(3),
        unlocked(){
          return player.b.best.gte(2) || hasMilestone("l", 3)
        }
      },
      12: {
        description: "Generators are cheaper based on Boosters",
        cost: new Decimal(5),
        effect(){
          return player.b.points.add(1)
        },
        effectDisplay(){
          return "/" + format(upgradeEffect("b",12))
        },
        unlocked(){
          return hasUpgrade("b", 11)
        }
      },
      13: {
        description: "Gain more light based on Boosters",
        cost: new Decimal(12),
        effect(){
          return new Decimal(1).add(player.b.points.div(8))
        },
        effectDisplay(){
          return format(upgradeEffect("b",13)) + "x"
        },
        unlocked(){
          return hasMilestone("l", 10) && hasUpgrade("b", 12)
        }
      },
    }
})

addLayer("g", {
    name: "generator", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      power: new Decimal(0),
      auto: false,
    }},
    color: "#a3d9a5",
    requires() {
      let base = new Decimal(4194304)
      if (hasUpgrade("b", 12)) base = base.div(upgradeEffect("b",12))
      if (hasMilestone("l", 1)) base = base.div(16)
      if (hasMilestone("l", 7)) base = base.div(layers.l.effect()[0])
      if (hasUpgrade("l", 13)) base = base.div(upgradeEffect("l",13))
      if (lightPowerActive(4)) base = base.div(tmp.l.lightPowBoost[4])
      return base
    }, // Can be a function that takes requirement increases into account
    resource: "generator", // Name of prestige currency
    baseResource: "meters", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    branches: ["p"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
      let base = [player.g.points, player.g.power.mul(0.01).add(1)] // 0: Generator Power speed, 1: Generator Power boost
      if (hasMilestone("l", 6)) base[0] = base[0].pow(2)
      if (hasMilestone("g", 0)) base[0] = base[0].mul(player.points.add(10).log(10).pow(0.5))
      if (hasUpgrade("l", 11)) base[0] = base[0].mul(upgradeEffect("l",11))
      if (hasUpgrade("l", 22)) base[0] = base[0].pow(upgradeEffect("l",22)[0])
      
      if (hasMilestone("b", 2)) base[1] = base[1].pow(1.5)
      if (base[1].gte(2000)) base[1] = base[1].mul(8e9).pow(0.25)
      return base
    },
    effectDescription(){
      return "which generating " + format(layers.g.effect()[0]) + " generator power per second"
    },
    base() {
      let base = new Decimal(8)
      return base
    },
    exponent(){ 
      let base = new Decimal(1.5)
      if (hasMilestone("l", 5)) base = base.mul(0.9)
      return base
    }, // Prestige currency exponent
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {key: "g", description: "Press G to perform a generator reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.b.best.gte(4) || player.g.unlocked ? true : "ghost"},
    canBuyMax(){return hasMilestone("l", 4)},
    autoPrestige(){return player.g.auto && hasMilestone("l", 6)},
    resetsNothing(){return hasMilestone("l", 9)},
		doReset(resettingLayer) {
			let keep = ["auto"];
      if (hasMilestone("l", 3) && (resettingLayer== "l" || resettingLayer== "u" || resettingLayer== "sb")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("g", keep)
    },
    tabFormat:[
      "main-display",
      ["display-text", function(){
        return "You have " + format(player.g.power) + " Generator Power, multiply Meter Speed by " + format(layers.g.effect()[1]) + " (unaffected by softcap)" }],
      "blank",
      ["display-text", function(){
        return (!player.l.unlocked ? "Reach 6 Boosters and 3 Generators to unlock Light" : "")}],
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
      "milestones",
      "blank",
      "upgrades"
    ],
    update(diff){
      player.g.power = player.g.power.add(layers.g.effect()[0].mul(diff))
    },
    milestonePopups: false,
    milestones: {
      0: {
          requirementDescription: "2 Generators",
          effectDescription: "Meters boost Generator Power speed",
          done() { return player.g.points.gte(2) || hasMilestone("l", 2)},
          unlocked(){return player.g.unlocked}
      },
      1: {
          requirementDescription: "4 Generators",
          effectDescription: "Gain 100% of Prestige Point gain every second",
          done() { return (player.g.points.gte(4) && player.l.unlocked) || hasMilestone("l", 5)},
          unlocked(){return player.l.unlocked}
      },
    },
    upgrades: {
      rows: 1,
      cols: 3,
      11: {
        description: "Boosters are cheaper based on Generators",
        cost: new Decimal(3),
        effect(){
          return player.g.points.add(1).pow(2)
        },
        effectDisplay(){
          return "/" + format(upgradeEffect("g",11))
        },
        unlocked(){
          return player.g.best.gte(2) || hasMilestone("l", 3)
        }
      },
      12: {
        description: "Generator Powers boost Prestige Points gain",
        cost: new Decimal(7),
        effect(){
          return player.g.power.add(1).pow(0.5)
        },
        effectDisplay(){
          return format(upgradeEffect("g",12)) + "x"
        },
        unlocked(){
          return hasMilestone("l", 10) && hasUpgrade("g", 11)
        }
      },
      13: {
        description: "Gain more light based on Generators",
        cost: new Decimal(10),
        effect(){
          return player.g.points.add(1).pow(0.5)
        },
        effectDisplay(){
          return format(upgradeEffect("g",13)) + "x"
        },
        unlocked(){
          return hasMilestone("l", 10) && hasUpgrade("g", 12)
        }
      },
    }
})

addLayer("l", {
    name: "light", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      power: new Decimal(0),
    }},
    color: "#ffffff",
    requires() {
      return new Decimal(299792458)
    }, // Can be a function that takes requirement increases into account
    resource: "light", // Name of prestige currency
    baseResource: "meter/s", // Name of resource prestige is based on
    baseAmount() {return getPointGen()}, // Get the current amount of baseResource
    branches: ["b", "g"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
      let base = [(player.l.points.lte(9) ? player.l.points.add(1) : new Decimal(1.1).pow(player.l.points.sub(9)).mul(10).min(1000)), (player.l.total.lte(9) ? player.l.total.add(1) : player.l.total.add(1).mul(10).pow(0.5))] // 0: Prestige Require, 1: Meter Speed
      if (lightPowerActive(3)) base[0] = base[0].pow(tmp.l.lightPowBoost[3])
      if (lightPowerActive(3)) base[1] = base[1].pow(tmp.l.lightPowBoost[3])
      if (base[1].gte(1e12)) base[1] = new Decimal(1e12).mul(base[1].div(1e12).pow(1/3))
      return base
    },
    effectDescription(){
      return "Divide Prestige Require by " + format(layers.l.effect()[0]) + " (cap at /" + format(new Decimal(1000)) + `)` + (hasMilestone("l", 3) ? " and multiply Meter Speed by " + format(layers.l.effect()[1]) + " (unaffected by first stage softcap)" : "")
    },
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1)
      if (hasUpgrade("b", 13)) mult = mult.mul(upgradeEffect("b",13))
      if (hasUpgrade("g", 13)) mult = mult.mul(upgradeEffect("g",13))
      if (lightPowerActive(1)) mult = mult.mul(tmp.l.lightPowBoost[1])
      if (hasUpgrade("p", 24)) mult = mult.mul(upgradeEffect("p",24))
      return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    softcap(){let base = new Decimal(2e7)
            return base
           },
    softcapPower(){return new Decimal(0.5)},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {key: "l", description: "Press L to light reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.b.best.gte(6) && player.g.best.gte(3)) || player.l.unlocked},
		doReset(resettingLayer) {
			let keep = [];
      if (layers[resettingLayer].row > this.row) layerDataReset("l", keep)
    },
    tabFormat:{
      "Light Prestige": {
        content:[
        "main-display",
        ["display-text", function(){
        return "You have make a total of " + formatWhole(player.l.total) + " light"}],
        ["display-text", function(){
        return (!player.u.unlocked ? "Reach " + format(ly.pow(0.5).ceil()) + " Total Light to unlock Universes" : "")}],
        "blank",
        "prestige-button",
        ["display-text", function(){
        return "Your light gain past " + format(tmp.l.softcap) + " are raised to the power of " + format(tmp.l.softcapPower)}],
        "blank",
        "resource-display",
        "blank",
        ["milestones", 11],
        "blank",
        "upgrades"
      ]},
      "Light Power": {
        unlocked() { return hasMilestone("l", 11) },
        content:[
        "main-display",
        ["display-text", function(){
        return "Your meters is " + format(player.points.div(ly)) + " light years (+" + format(getPointGen().div(ly)) + " ly/s), giving you " + formatWhole(player.l.power) + " light powers"
        }],
        ["display-text", function(){
        return "(next at " + format(tmp.l.calcNextLightPow) + " light years or " + format(tmp.l.calcNextLightPow.mul(ly)) + " meters)"
        }],
        "blank",
        ["display-text", function(){
        return "Boosts: (All follow boost are based on Light Powers)"
        }],
        ["display-text", function(){
        return player.l.power.gte(1) ? "Meters increase " + format(tmp.l.lightPowBoost[0]) + "x faster (weaker at 4 Light Powers and softcap at 8 Light Powers)" : "Reach 1 Light Power to unlock"
        }],
        ["display-text", function(){
        return player.l.power.gte(3) ? "Gain " + format(tmp.l.lightPowBoost[1]) + "x more Light (weaker at 20 Light Powers)" : "Reach 3 Light Powers to unlock"
        }],
        ["display-text", function(){
        return player.l.power.gte(6) ? "Prestige Points gain is raised to the power of " + format(tmp.l.lightPowBoost[2], 3) + " (softcap at 25 Light Powers)": "Reach 6 Light Powers to unlock"
        }],
        ["display-text", function(){
        return player.l.power.gte(10) ? "All Light Boost is raised to the power of " + format(tmp.l.lightPowBoost[3], 3) + " (Unaffected by caps)": "Reach 10 Light Powers to unlock"
        }],
        ["display-text", function(){
        return player.l.power.gte(28) ? "Divide Boosters/Generators require by " + format(tmp.l.lightPowBoost[4]) + " (start at 25 Light Powers, softcap at 37 Light Powers)": "Reach 28 Light Powers to unlock"
        }],
        ]}
    },
    lightPowBoost(){
      let base = [
        new Decimal(100).pow((player.l.power.gte(4) ? (player.l.power.gte(8) ? new Decimal(3).mul(player.l.power.pow(1/3)) : new Decimal(2).add(player.l.power.div(2))) : player.l.power)), 
        new Decimal(1).add((player.l.power.gte(20) ? player.l.power.div(2).add(10) : player.l.power).div(10)),
        new Decimal(1).add(player.l.power.pow(0.5).div(20)),
        player.l.power.add(1).log(10).add(1),
        new Decimal(10).pow((player.l.power.gte(37) ? player.l.power.sub(25).pow(0.5).mul(new Decimal(12).pow(0.5)) : player.l.power.sub(25)).max(0))
      ]
      if (base[2].gte(1.25)) base[2] = base[2].mul(100).pow(1/3).div(4)
      if (hasUpgrade("l", 23)) base[0] = base[0].pow(upgradeEffect("l",23)[0])
      if (hasUpgrade("l", 23)) base[1] = base[1].pow(upgradeEffect("l",23)[1])
      return base
    },
    lightPowBaseReq(){
      let base = ly
      return base
    },
    lightPowScaling(){
      let base = new Decimal(2)
      return base
    },
    calcLightPow(){
      let base = player.points.div(tmp.l.lightPowBaseReq).max(1).log(tmp.l.lightPowScaling).add(1).floor().max(0)
      if (base.gte(41)) base = new Decimal(41).add(base.sub(41).div(2))
      return base.floor()
    },
    calcNextLightPow(){ // in light year
      let base = player.l.power
      if (player.l.power.gte(40)) base = new Decimal(40).add(base.sub(40).mul(2))
      return tmp.l.lightPowScaling.pow(base).mul(tmp.l.lightPowBaseReq).div(ly)
    },
    update(diff){
      if (hasMilestone("l", 11)) player.l.power = tmp.l.calcLightPow.max(player.l.power)
    },
    milestonePopups: false,
    milestones: {
      0: {
          requirementDescription: "1 Total Light",
          effectDescription: "Always can produce meters and unlock more Boosters/Generators milestone",
          done() { return player.l.total.gte(1) },
          unlocked(){return true}
      },
      1: {
          requirementDescription: "2 Total Light",
          effectDescription: "Divide Generators Require by 16 and Keep first 3 Booster milestones on all row 3 resets",
          done() { return player.l.total.gte(2) },
          unlocked(){return hasMilestone("l", 0)}
      },
      2: {
          requirementDescription: "3 Total Light",
          effectDescription: "Prestige Points gain softcap starts later based on Boosters and Keep first Generator milestone on all row 3 resets",
          done() { return player.l.total.gte(3) },
          unlocked(){return hasMilestone("l", 0)}
      },
      3: {
          requirementDescription: "4 Total Light",
          effectDescription: "Total light multiply Meter Speed and Keep Booster/Generator Upgrades on all row 3 resets",
          done() { return player.l.total.gte(4) },
          unlocked(){return hasMilestone("l", 0)}
      },
      4: {
          requirementDescription: "5 Total Light",
          effectDescription: "Divide Boosters Require by 16 and You can buy Max Boosters/Generators",
          done() { return player.l.total.gte(5) },
          unlocked(){return hasMilestone("l", 0)}
      },
      5: {
          requirementDescription: "6 Total Light",
          effectDescription: "Reduce Booster/Generator Require exponent by 10% and Keep all Boosters/Generators milestones on all row 3 resets",
          done() { return player.l.total.gte(6) },
          unlocked(){return hasMilestone("l", 0)},
      },
      6: {
          requirementDescription: "7 Total Light",
          effectDescription: "Base Generator Power speed ^2 and Unlock Auto-Boosters/Generators",
          done() { return player.l.total.gte(7) },
          unlocked(){return hasMilestone("l", 0)},
          toggles: [["b", "auto"],["g", "auto"]],
      },
      7: {
          requirementDescription: "8 Total Light",
          effectDescription: "Light boost first effect affect Boosters/Generator cost and Keep Prestige Upgrades on all row 3 resets",
          done() { return player.l.total.gte(8) },
          unlocked(){return hasMilestone("l", 0)},
      },
      8: {
          requirementDescription: "9 Total Light",
          effectDescription: "Square Prestige Upgrade 3 and 6 effect",
          done() { return player.l.total.gte(9) },
          unlocked(){return hasMilestone("l", 0)},
      },
      9: {
          requirementDescription: "10 Total Light",
          effectDescription(){ return "You can go past Light Speed (" + format(299792458) + " m/s) and Boosters/Generators resets nothing"},
          done() { return player.l.total.gte(10) },
          unlocked(){return hasMilestone("l", 0)},
      },
      10: {
          requirementDescription: "20 Total Light",
          effectDescription: "Unlock Light Upgrades and more Boosters/Generators Upgrade",
          done() { return player.l.total.gte(20) },
          unlocked(){return hasMilestone("l", 9)},
      },
      11: {
          requirementDescription(){return formatWhole(ly.log(10).mul(100).ceil()) + " Total Light & " + format(ly) + " meters"},
          effectDescription: "Unlock Light Power and more Prestige/Light Upgrade",
          done() { return player.l.total.gte(ly.log(10).mul(100).ceil()) && player.points.gte(ly)},
          unlocked(){return hasMilestone("l", 9)},
      },
    },
    upgrades: {
      rows: 2,
      cols: 3,
      11: {
        description: "Boosters boost Generator Power speed",
        cost: new Decimal(20),
        effect(){
          return player.b.points.add(1)
        },
        effectDisplay(){
          return format(upgradeEffect("l",11)) + "x"
        },
        unlocked(){
          return hasMilestone("l", 10)
        }
      },
      12: {
        description: "Generators raise all Boosters effect",
        cost: new Decimal(100),
        effect(){
          return player.g.points.add(1).log(10).add(1)
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("l",12))
        },
        unlocked(){
          return hasMilestone("l", 10)
        }
      },
      13: {
        description: "Prestige Points divide Boosters & Generators require",
        cost: new Decimal(400),
        effect(){
          return player.p.points.add(1).pow(0.3)
        },
        effectDisplay(){
          return "/" + format(upgradeEffect("l",13))
        },
        unlocked(){
          return hasMilestone("l", 10)
        }
      },
      21: {
        description: "Prestige Points gain softcap starts ^1.5",
        cost() {return ly.log(10).pow(3).mul(0.75).ceil()},
        effect(){
          return new Decimal(1.5)
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
      22: {
        description: "Generators Power speed ^1.6 and Prestige Upgrade 1 effect ^1.2",
        cost() {return ly.log(10).pow(5).ceil()},
        effect(){
          return [new Decimal(1.6), new Decimal(1.2)]
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
      23: {
        description: "Raise first 2 Light Power boost to the power of 2 ",
        cost() {return ly.log(10).pow(6).mul(1.5).ceil()},
        effect(){
          return [new Decimal(2), new Decimal(2)]
        },
        unlocked(){
          return hasMilestone("l", 11)
        }
      },
    },
})

function forceLightResetAndResetLightPowers(x){
  doReset("l", true)
  player.l.power = new Decimal(x)
}

function lightPowerActive(x){
  let req = [new Decimal(1), new Decimal(3), new Decimal(6), new Decimal(10), new Decimal(28)]
  if (req[x] == undefined || isNaN(player.l.power)) return false
  return player.l.power.gte(req[x])
}

addLayer("u", {
    name: "universe", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
        auto: false,
    }},
    color: "#430082",
    requires() {
      let base = uni
      base = base.mul(1/0)
      return base
    }, // Can be a function that takes requirement increases into account
    resource: "universes", // Name of prestige currency
    baseResource: "meters", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    branches: ["g"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
      let base = [new Decimal(1)]
      return base
    },
    effectDescription(){
      return ""
    },
    base() {
      let base = uni.pow(1/4)
      return base
    },
    exponent(){ 
      let base = new Decimal(1.5).max(new Decimal(1).add(player.u.points.div(100)))
      return base
    }, // Prestige currency exponent
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {key: "u", description: "Press U to perform a universe reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.l.total.gte(ly.pow(0.5).ceil()) || player.u.unlocked ? true : "ghost"},
    canBuyMax(){return false},
    autoPrestige(){return false},
    resetsNothing(){return false},
		doReset(resettingLayer) {
			let keep = ["auto"];
      if (layers[resettingLayer].row > this.row) layerDataReset("u", keep)
    },
    tabFormat:[
      "main-display",
      ["display-text", function(){
        return (false ? "Reach ? to unlock ?" : "")}],
      "prestige-button",
    ],
    milestonePopups: false,
})

addLayer("sb", {
    name: "super-booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
        auto: false,
    }},
    color: "#6e64c4",
    requires() {
      let base = new Decimal(1/0)
      return base
    }, // Can be a function that takes requirement increases into account
    resource: "super boosters", // Name of prestige currency
    baseResource: "boosters", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    branches: ["b"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effect(){
      let base = [new Decimal(1)]
      return base
    },
    effectDescription(){
      return ""
    },
    base: 1e100,
    exponent(){ 
      let base = 1.5
      return base
    }, // Prestige currency exponent
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
      {key: "B", description: "Press Shift+B to perform a super booster reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.u.total.gte(1/0) || player.sb.unlocked ? true : "ghost"},
    canBuyMax(){return false},
    autoPrestige(){return false},
    resetsNothing(){return false},
		doReset(resettingLayer) {
			let keep = ["auto"];
      if (layers[resettingLayer].row > this.row) layerDataReset("sb", keep)
    },
    tabFormat:[
      "main-display",
      ["display-text", function(){
        return (false ? "Reach ? to unlock ?" : "")}],
      "prestige-button",
    ],
    milestonePopups: false,
})



// side layer

addLayer("unit", {
	startData() { return {unlocked: true}},
	color: "#ffffff",
	symbol: "ST",
	row: "side",
	layerShown() { return true },
	tooltip: "Statistics",
  tabFormat: [
    ["display-text", function(){
      return `<h2>Main</h2>`}],
    ["display-text", function(){
      return "Your meters are equal to:"}],
    ["display-text", function(){
      return "sound travel " + format(player.points.div(343)) + " seconds (+" + format(getPointGen().div(343)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(42195)) + "x marathon distance (+" + format(getPointGen().div(42195)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(12742000)) + "x earth diameter (+" + format(getPointGen().div(12742000)) + "/s)"}],
    ["display-text", function(){
      return "light travel " + format(player.points.div(299792458)) + " seconds (+" + format(getPointGen().div(299792458)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(1392700000)) + "x sun diameter (+" + format(getPointGen().div(1392700000)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(149597870700)) + " astronomical units (+" + format(getPointGen().div(149597870700)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(ly)) + " light years (+" + format(getPointGen().div(ly)) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(new Decimal(149597870700).mul(648000).div(Math.PI))) + " parsec (+" + format(getPointGen().div(new Decimal(149597870700).mul(648000).div(Math.PI))) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(ly.mul(100000))) + "x galaxy diameter (+" + format(getPointGen().div(ly.mul(100000))) + "/s)"}],
    ["display-text", function(){
      return "" + format(player.points.div(uni)) + "x universe diameter (+" + format(getPointGen().div(uni)) + "/s)"}],
    ["display-text", function(){
      return "universe diameter ^" + format(player.points.max(1).log(uni), 3) + ""}],
    "blank","blank",
    ["display-text", function(){
      return `<h2>Production softcaps</h2>`}],
    ["display-text", function(){
      return getPointGen().gte(343) ? "Stage 1: Starts at " + formatWhole(new Decimal(343)) + " m/s, cube rooted" : ""}],
    ["display-text", function(){
      return getPointGen().gte(299792458) && hasMilestone("l", 9) ? "Stage 2: Starts at " + formatWhole(new Decimal(299792458)) + " m/s, exponent square rooted" : ""}],
    ["display-text", function(){
      return getPointGen().gte(1e100) ? "Stage 3: Starts at " + formatWhole(new Decimal(1e100)) + " m/s, logarithmic but raised to the " + format(new Decimal(50)) + "th power" : ""}],
  ],
})