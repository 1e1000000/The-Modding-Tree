addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: true,
		  points: new Decimal(0),
      total: new Decimal(0),
    }},
    color: "#F66",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canReset(){
      return player.points.gte(10)
    },
    getBaseResetGain(){
      if (inChallenge("e", 31)) return new Decimal(1)
      let base = new Decimal(10)
      let tetr = new Decimal(1.5)
      if (hasUpgrade("p", 21)) base = upgradeEffect("p", 21)[0]
      base = new Decimal(base)
      if (hasUpgrade("e", 13)) base = base.pow(upgradeEffect("e", 13))
      base = base.max(1.1)
      
      if (hasUpgrade("p", 21)) tetr = upgradeEffect("p", 21)[1]
      if (hasUpgrade("p", 34)) tetr = new Decimal(tetr).add(upgradeEffect("p", 34))
      if (hasUpgrade("i", 24)) tetr = new Decimal(tetr).add(upgradeEffect("i", 24))
      if (inChallenge("i", 42)) tetr = new Decimal(1.1)
      if (inChallenge("i", 61)) tetr = new Decimal(1)
      
      let gain = player.points.max(1).log(base).tetrate(tetr)
      return gain
    },
    getResetGain(){
      let gain = tmp.p.getBaseResetGain
      
      gain = gain.mul(layers.slog.effect())
      if (!inChallenge("i", 42)){
        if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
        if (hasUpgrade("sp", 11)) gain = gain.mul(upgradeEffect("sp", 11))
        if (hasChallenge("i", 21)) gain = gain.mul(challengeEffect("i", 21))
        if (hasUpgrade("p", 22)) gain = gain.pow(upgradeEffect("p", 22)[1])
      }
      
      if (gain.gte(tmp.p.getSCStart)) gain = new Decimal(10).pow(gain.log(10).mul(tmp.p.getSCStart.log(10)).pow(0.5))
      
      if (!inChallenge("i", 42)){
        if (hasUpgrade("p", 31)) gain = gain.mul(upgradeEffect("p", 31))
        if (hasUpgrade("hp", 11)) gain = gain.mul(upgradeEffect("hp", 11)[0])
        if (hasUpgrade("hp", 11)) gain = gain.pow(upgradeEffect("hp", 11)[1])
      }
      if (inChallenge("e", 42)) gain = gain.max(10).log(10).pow(10)
      if (inChallenge("e", 31)) gain = new Decimal(10).pow(gain.log(10).pow(0.75))
      if (inChallenge("i", 11)) gain = gain.pow(0.01)
      if (inChallenge("e", 11)) gain = gain.min(player.points)
      return gain.floor()
    },
    getSCStart(){
      let scstart = new Decimal(1e9)
      scstart = scstart.mul(layers.i.effect()[0])
      if (hasUpgrade("i", 11)) scstart = scstart.mul(upgradeEffect("i", 11))
      if (hasChallenge("i", 11)) scstart = scstart.mul(challengeEffect("i", 11)[0])
      if (hasUpgrade("hp", 24)) scstart = scstart.mul(upgradeEffect("hp", 24))
      scstart = scstart.mul(layers.slog.effectP(false))
      if (hasUpgrade("hp", 44)) scstart = scstart.mul(upgradeEffect("hp", 44))
      if (inChallenge("i", 32)) scstart = scstart.pow(0.02)
      if (inChallenge("e", 22)) scstart = scstart.pow(0.1)
      
      return scstart
    },
    getNextAt(canMax=false){
      return
    },
    prestigeButtonText(){
      return "Reset for " + formatWhole(getResetGain("p")) + " Prestige Points." + `<br>` + "(Base reset gain: " + format(tmp.p.getBaseResetGain) + ")"
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){ return (hasMilestone("sp", 2))?1:0},
    doReset(resettingLayer) {
			let keep = [];
      if (hasMilestone("sp", 1) && (resettingLayer== "sp" || resettingLayer=="i")) keep.push("upgrades")
      if (hasMilestone("hp", 1) && (resettingLayer== "hp" || resettingLayer== "e")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    tabFormat:[
      "main-display",
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
      ["display-text", function() {
        return "PP gain softcap start: " + format(tmp.p.getSCStart)
      }],
      "blank",
      "upgrades"
    ],
    upgrades: {
      rows: 4,
      cols: 4,
      11: {
        description: "Your Prestige Points boost Points gain",
        cost: new Decimal(1),
        effect(){
          let eff = player.p.points.add(1).pow(0.75)
          if (hasUpgrade("p", 12)) eff = eff.pow(upgradeEffect("p", 12))
          if (hasChallenge("i", 31)) eff = eff.pow(challengeEffect("i", 31))
          
          let scstart = new Decimal(1e100)
          if (hasChallenge("i", 22)) scstart = scstart.mul(challengeEffect("i", 22))
          if (hasUpgrade("p", 33)) scstart = scstart.mul(upgradeEffect("p", 33))
          if (inChallenge("i", 32)) scstart = scstart.pow(0.02)
          
          if (eff.gte(this.effSCStart())) eff = new Decimal(10).pow(eff.log(10).mul(this.effSCStart().log(10)).pow(0.5))
          return eff
        },
        effSCStart(){
          let scstart = new Decimal(1e100)
          if (hasChallenge("i", 22)) scstart = scstart.mul(challengeEffect("i", 22))
          if (hasUpgrade("p", 33)) scstart = scstart.mul(upgradeEffect("p", 33))
          if (hasUpgrade("hp", 42)) scstart = scstart.mul(upgradeEffect("hp", 42))
          if (inChallenge("i", 32)) scstart = scstart.pow(0.02)
          return scstart
        },        
        effectDisplay(){
          return format(upgradeEffect("p", 11)) + "x (softcap start: " + format(this.effSCStart()) + "x)"
        }
      },
      12: {
        description: "Upgrade to the left is stronger based on Bought Prestige Upgrades",
        cost: new Decimal(10).pow(1.5).ceil(),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = new Decimal(1).add(player.p.upgrades.length/2)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 12))
        }
      },
      13: {
        description: "Boost PP gain based on Bought Prestige Upgrades",
        cost: new Decimal(1000),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let exp = new Decimal(player.p.upgrades.length)
          if (hasUpgrade("p", 14)) exp = exp.pow(upgradeEffect("p", 14))
          let eff = new Decimal(2).pow(exp)
          if (hasChallenge("i", 31)) eff = eff.pow(challengeEffect("i", 31))
          if (eff.gte(1e300)) eff = new Decimal(10).pow(eff.log(10).mul(300).pow(0.5))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("p", 13)) + "x"
        }
      },
      14: {
        description: "Upgrade to the left exponent is powered based on Bought Prestige Upgrades",
        cost: new Decimal(1e6),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let div = 14
          if (hasUpgrade("p", 23)) div = 3.5
          let eff = new Decimal(1).add(player.p.upgrades.length/div)
          if (eff.gte(4)) eff = eff.log(2).add(2)
          if (eff.gte(4.2025)) eff = eff.log(2.05).add(2.2025)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 14))
        }
      },
      21: {
        description: "PP gain formula is better based on Bought Prestige Upgrades",
        cost: new Decimal(1e15),
        effect(){
          if (inChallenge("i", 22)) return [new Decimal(10), new Decimal(1.5)]
          let eff = [new Decimal(10).sub(player.p.upgrades.length).max(2), new Decimal(1.5).add(Math.min(player.p.upgrades.length, 12)/50).add((2 - 2 ** (Math.min(13-player.p.upgrades.length, 1)))/100).add(Math.max(player.p.upgrades.length-15, 0)/800).min(1.76)]
          return eff
        },
        effectDisplay(){
          return "log" + `<sub>` + "10" + `</sub>` + "(x) → log" + `<sub>` + formatWhole(upgradeEffect("p", 21)[0]) + `</sub>` + "(x), ^^1.50 → ^^" + format(upgradeEffect("p", 21)[1], 3)
        },
        unlocked(){
          return hasMilestone("sp", 0)
        }
      },
      22: {
        description: "Raise Points and PP gain based on Superlogarithm Points",
        cost: new Decimal(1e45).pow(0.5),
        effect(){
          if (inChallenge("i", 22)) return [new Decimal(1), new Decimal(1)]
          let eff = [player.slog.points.max(1).pow(0.5), player.slog.points.max(1).pow(0.25)]
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 22)[0], 3) + " Points gain, ^" + format(upgradeEffect("p", 22)[1], 3) + " Prestige Points gain"
        },
        unlocked(){
          return hasMilestone("sp", 0)
        }
      },
      23: {
        description: "Boost SP gain based on Bought Prestige/Super Prestige Upgrades, and Prestige Upgrade 14 is stronger",
        cost: new Decimal(1e77).pow(0.5),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let exp = new Decimal(player.sp.upgrades.length)
          let eff = new Decimal(player.p.upgrades.length).pow(exp)
          return eff.max(1)
        },
        effectDisplay(){
          return format(upgradeEffect("p", 23)) + "x"
        },
        unlocked(){
          return hasMilestone("sp", 0)
        }
      },
      24: {
        description: "Superlogarithm Points make Super Prestige Upgrade 11 stronger",
        cost: new Decimal(1e60),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = player.slog.points.max(1)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 24), 3)
        },
        unlocked(){
          return hasMilestone("sp", 0)
        }
      },
      31: {
        description: "Infinity Points boost PP gain (unaffected by softcap)",
        cost: new Decimal(1e260),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let exp = tmp.i.totalIP
          if (hasChallenge("e", 12)) exp = exp.pow(challengeEffect("e", 12)[0])
          let eff = new Decimal(1e10).pow(exp)
          if (eff.gte("1e10000")) eff = new Decimal(10).pow(eff.log(10).mul(10000).pow(0.5))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("p", 31)) + "x"
        },
        unlocked(){
          return hasMilestone("i", 1)
        }
      },
      32: {
        description: "Super Prestige Upgrade 12 is stronger based on Superlogarithm Points",
        cost: new Decimal(10).pow(484),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(0.5)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 32), 3)
        },
        unlocked(){
          return hasMilestone("i", 1)
        }
      },
      33: {
        description: "SP make Prestige Upgrade 11 softcap starts later",
        cost: new Decimal(10).pow(1891),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = player.sp.points.pow(0.57).max(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("p", 33)) + "x"
        },
        unlocked(){
          return hasMilestone("i", 1)
        }
      },
      34: {
        description: "Increase PP gain tetrate based on IP",
        cost: new Decimal(10).pow(3114),
        effect(){
          if (inChallenge("i", 22)) return new Decimal(0)
          let amount = tmp.i.totalIP
          if (amount.gte(20)) amount = amount.mul(20).pow(0.5)
          let eff = amount.div(1000)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("p", 34), 4)
        },
        unlocked(){
          return hasMilestone("i", 1)
        }
      },
      41: {
        description: "Points gain softcap starts later based on SP, You can buy this upgrade while you are in I Challenge 1",
        cost(){return inChallenge("i", 11) ? new Decimal(10).pow(469) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = player.sp.points.max(1).pow(1.1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("p", 41)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      42: {
        description: "slog points boost make I Challenge 7 reward softcap starts later, You can buy this upgrade while you are in I Challenge 8",
        cost(){return inChallenge("i", 42) ? new Decimal(10).pow(2601) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = layers.slog.effect().pow(0.1).max(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("p", 42)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      43: {
        description: "Infinity Upgrade 14 boost ^1.25, You can buy this upgrade while you are in I Challenge 6",
        cost(){return inChallenge("i", 32) ? new Decimal(10).pow(22008) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = new Decimal(1.25)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      44: {
        description: "slog points raise first 2 slog PP boost, You can buy this upgrade while you are in E Challenge 4",
        cost(){return inChallenge("e", 22) ? new Decimal(10).pow(4263) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 22)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(0.57)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("p", 44), 3)
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
    }
})

addLayer("sp", {
    name: "super prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      total: new Decimal(0),
    }},
    color: "#F33",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "super prestige points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["p"],
    canReset(){
      return player.p.points.gte(1e10) && !inChallenge("e", 11)
    },
    getBaseResetGain(){
      if (inChallenge("e", 31)) return new Decimal(1)
      if (inChallenge("e", 11)) return new Decimal(0)
      let base = new Decimal(10)
      let tetr = new Decimal(1.5)
      if (hasUpgrade("p", 21) && hasChallenge("i", 12) && !inChallenge("i", 31)) base = upgradeEffect("p", 21)[0]
      if (hasUpgrade("p", 21) && hasChallenge("i", 12) && !inChallenge("i", 31)) tetr = upgradeEffect("p", 21)[1]
      if (hasChallenge("i", 12)) tetr = new Decimal(tetr).add(challengeEffect("i", 12))
      if (hasUpgrade("hp", 31)) tetr = tetr.add(upgradeEffect("hp", 31))
      
      let gain = player.p.points.max(1).log(base).max(1).log(base).tetrate(tetr)
      return gain
    },
    getResetGain(){
      let gain = tmp.sp.getBaseResetGain
      
      gain = gain.mul(layers.slog.effect())
      if (hasUpgrade("sp", 12)) gain = gain.mul(upgradeEffect("sp", 12))
      if (hasUpgrade("p", 23)) gain = gain.mul(upgradeEffect("p", 23))
      gain = gain.mul(layers.i.effect()[1])
      
      if (gain.gte(tmp.sp.getSCStart)) gain = new Decimal(10).pow(gain.log(10).mul(tmp.sp.getSCStart.log(10)).pow(0.5))
      
      if (hasUpgrade("sp", 23)) gain = gain.pow(upgradeEffect("sp", 23))
      if (hasUpgrade("hp", 13)) gain = gain.mul(upgradeEffect("hp", 13))
      if (inChallenge("e", 31)) gain = new Decimal(10).pow(gain.log(10).pow(0.75))
      return gain.floor()
    },
    getSCStart(){
      let scstart = new Decimal(1e25)      
      if (hasChallenge("i", 11)) scstart = scstart.mul(challengeEffect("i", 11)[1])
      if (hasUpgrade("i", 21)) scstart = scstart.mul(upgradeEffect("i", 21))
      if (hasUpgrade("sp", 33)) scstart = scstart.pow(upgradeEffect("sp", 33))
      scstart = scstart.mul(layers.e.effect()[0])
      if (hasChallenge("i", 22) && hasChallenge("e", 11)) scstart = scstart.mul(challengeEffect("e", 11))
      if (hasUpgrade("i", 42)) scstart = scstart.mul(upgradeEffect("i", 42))
      scstart = scstart.mul(layers.slog.effectP(false))
      if (inChallenge("e", 22)) scstart = scstart.pow(0.1)
      return scstart
    },
    getNextAt(canMax=false){
      return
    },
    prestigeButtonText(){
      return "Reset for " + formatWhole(getResetGain("sp")) + " Super Prestige Points." + `<br>` + "(Base reset gain: " + format(tmp.sp.getBaseResetGain) + ")"
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for super prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.p.upgrades.length >= 4 || player.sp.unlocked},
    passiveGeneration(){ return hasMilestone("hp", 3)?1:0},
    doReset(resettingLayer) {
			let keep = [];
      if (hasMilestone("hp", 2) && (resettingLayer== "hp" || resettingLayer== "e")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep)
    },
    tabFormat:[
      "main-display",
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
      ["display-text", function() {
        return "SP gain softcap start: " + format(tmp.sp.getSCStart)
      }],
      "blank",
      "milestones",
      "blank",
      "upgrades"
    ],
    milestonePopups: true,
    milestones: {
        0: {
          requirementDescription: "500 Total Super Prestige Points",
          effectDescription: "Unlock a new row of Prestige Upgrades",
          done() { return player.sp.total.gte(500) || hasMilestone("hp", 0)},
          unlocked(){return true}
      },
        1: {
          requirementDescription: "50,000 Total Super Prestige Points",
          effectDescription: "Keep Prestige Upgrades on row 2 reset",
          done() { return player.sp.total.gte(50000) || hasMilestone("hp", 0)},
          unlocked(){return true}
      },
        2: {
          requirementDescription: "500,000,000 Total Super Prestige Points",
          effectDescription: "Gain 100% of Prestige Point gain every second",
          done() { return player.sp.total.gte(5e8) || hasMilestone("hp", 0)},
          unlocked(){return true}
      },
    },
    upgrades: {
      rows: 4,
      cols: 4,
      11: {
        description: "Your Super Prestige Points boost Points and Prestige Points gain",
        cost: new Decimal(160),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.sp.points.add(1).pow(2)
          if (hasUpgrade("p", 24)) eff = eff.pow(upgradeEffect("p", 24))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("sp", 11)) + "x"
        }
      },
      12: {
        description: "Your Prestige Points boost Super Prestige Points gain",
        cost: new Decimal(3200),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.p.points.add(1).log(10).add(1)
          if (hasUpgrade("sp", 14)) eff = eff.pow(upgradeEffect("sp", 14))
          if (hasUpgrade("p", 32)) eff = eff.pow(upgradeEffect("p", 32))
          if (hasUpgrade("i", 31)) eff = eff.pow(upgradeEffect("i", 31))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("sp", 12)) + "x"
        }
      },
      13: {
        description: "Multiply Superlogarithm Points boost exponent by 2",
        cost: new Decimal(6.4e5),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = new Decimal(2)
          return eff
        },
      },
      14: {
        description: "Super Prestige Upgrade 12 is stronger based on Bought Super Prestige Upgrades",
        cost: new Decimal(1.28e12),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = new Decimal(player.sp.upgrades.length).pow(0.5).max(1)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("sp", 14))
        }
      },
      21: {
        description: "Multiply Superlogarithm Points boost exponent by 1.5",
        cost: new Decimal(1e18),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = new Decimal(1.5)
          return eff
        },
        unlocked(){
          return hasMilestone("i", 0)
        }
      },
      22: {
        description: "Raise Superlogarithm Points boost based on Infinity Points",
        cost: new Decimal(1e32),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.5)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("sp", 22))
        },
        unlocked(){
          return hasMilestone("i", 0)
        }
      },
      23: {
        description: "Raise SP gain based on Superlogarithm Points (unaffected by softcap)",
        cost: new Decimal(1e48),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(0.155)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("sp", 23), 3)
        },
        unlocked(){
          return hasMilestone("i", 0)
        }
      },
      24: {
        description: "Raise Superlogarithm Points boost based on SP",
        cost: new Decimal(1e100),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let base = new Decimal(17).sub(tmp.i.totalIP.div(2)).max(10)
          let eff = player.sp.points.max(1).log(base).max(1).log(base).max(1)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("sp", 24), 3)
        },
        unlocked(){
          return hasMilestone("i", 0)
        }
      },
      31: {
        description: "Raise IP gain scaling to the power of 0.928",
        cost: new Decimal(1e186),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = new Decimal(0.928)
          return eff
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      32: {
        description: "Your Super Prestige Points boost Hyper Prestige Points gain",
        cost: new Decimal(1e221),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.sp.points.add(1).log(10).add(1)
          if (hasUpgrade("i", 33)) eff = eff.max(player.sp.points.add(1).pow(0.003))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("sp", 32)) + "x"
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      33: {
        description: "Superlogarithm Points make SP gain softcap starts later",
        cost: new Decimal(1e275),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(0.273)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("sp", 33), 3)
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      34: {
        description: "I Challenge 8 reward is stronger based on slog points",
        cost: new Decimal(10).pow(386),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(0.63)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("sp", 34), 3) + "x"
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      41: {
        description: "Reduce slog points base based on IP (max -0.4)",
        cost: new Decimal(10).pow(2171),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(0)
          let eff = tmp.i.totalIP.div(500)
          return eff.min(0.4)
        },
        effectDisplay(){
          return "-" + format(upgradeEffect("sp", 41), 3)
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      42: {
        description: "IP gain scaling exponent -0.0083, You can buy this upgrade while you are in E Challenge 2",
        cost(){return inChallenge("e", 12) ? new Decimal(10).pow(628) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 12)) return new Decimal(0)
          let eff = new Decimal(0.0083)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      43: {
        description: "Raise all IP boost exponent to the power of 1.11",
        cost: new Decimal(10).pow(3094),
        effect(){
          if (inChallenge("i", 12)) return new Decimal(1)
          let eff = new Decimal(1.11)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
      44: {
        description: "Reduce slog points base based on slog PP (max -0.4) and E Challenge 2 reward uses a better formula, You can buy this upgrade while you are in E Challenge 5",
        cost(){return inChallenge("e", 31) ? new Decimal(10).pow(153.5) : new Decimal(1/0)},
        effect(){
          if (inChallenge("i", 12)) return new Decimal(0)
          let eff = player.slog.prestigePoints.div(19.75)
          return eff.min(0.4)
        },
        effectDisplay(){
          return "-" + format(upgradeEffect("sp", 44), 3)
        },
        unlocked(){
          return hasMilestone("e", 2)
        }
      },
    }
})

addLayer("i", {
    name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      best: new Decimal(0),
      auto: false,
    }},
    color: "#CCCC00",
    requires(){
      if (inChallenge("e", 12)) return new Decimal(Infinity)
      let req = new Decimal(2).pow(1024)
      req = req.pow(1.35)
      if (!inChallenge("e", 41)){
        if (hasChallenge("i", 41)) req = req.div(challengeEffect("i", 41))
        if (hasUpgrade("hp", 21)) req = req.div(upgradeEffect("hp", 21))
      }
      return req
    }, // Can be a function that takes requirement increases into account
    base(){
      let base = new Decimal(2).pow(1024)
      base = base.pow(0.15)
      if (hasUpgrade("sp", 31)) base = base.pow(upgradeEffect("sp", 31))
      if (hasUpgrade("hp", 32)) base = base.pow(upgradeEffect("hp", 32))
      return base
    },
    exponent(){
      let exp = new Decimal(2)
      if (hasUpgrade("sp", 42)) exp = exp.sub(upgradeEffect("sp", 42))
      if (inChallenge("e", 22)) exp = exp.pow(2)
      return exp
    },
    resource: "infinity points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["p"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: Reset for infinity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.sp.upgrades.length >= 4 || player.i.unlocked},
    canBuyMax(){
      return hasMilestone("hp", 1)
    },
    autoPrestige(){
      return player.i.auto
    },
    resetsNothing(){
      return hasMilestone("hp", 4)
    },
    effect(){
      if (inChallenge("i", 31)) return [new Decimal(1), new Decimal(1)]
      let exp = new Decimal(tmp.i.effectiveIP[0])
      if (hasUpgrade("i", 13)) exp = exp.pow(upgradeEffect("i", 13))
      if (hasUpgrade("sp", 43)) exp = exp.pow(upgradeEffect("sp", 43))
      let eff = [new Decimal(1e5).pow(exp), new Decimal(10).pow(exp)]
      if (hasUpgrade("i", 12)) eff[0] = eff[0].pow(upgradeEffect("i", 12))
      if (hasUpgrade("i", 12)) eff[1] = eff[1].pow(upgradeEffect("i", 12))
      return eff
    },
    effectDescription(){
      return " which make PP gain softcap starts " + format(layers.i.effect()[0]) + "x later and multiply SP gain by " + format(layers.i.effect()[1])
    },
    freeIP(){
      let freeAmt = new Decimal(0)
      if (hasUpgrade("i", 43)) freeAmt = freeAmt.add(upgradeEffect("i", 43)[0])
      if (hasUpgrade("e", 14)) freeAmt = freeAmt.add(upgradeEffect("e", 14))
      if (player.e.activeChallenge) freeAmt = freeAmt.min(0)
      return freeAmt
    },
    totalIP(){
      return player.i.points.add(tmp.i.freeIP)
    },
    effectiveIP(){
      let IP = tmp.i.totalIP
      let a = new Decimal(90) // base
      let x = new Decimal(3) // mul
      if (IP.gte(a)) IP = IP.sub(a).div(2).add(a) // after a effect /2
      if (IP.gte(a.mul(x))) IP = IP.div(a.mul(x)).pow(0.5).mul(a.mul(x)) // after a*x effect ^0.5
      if (IP.gte(a.mul(x).mul(x))) IP = IP.div(a.mul(x).mul(x)).log(2).add(1).pow(2).mul(a.mul(x).mul(x)) // after a*x^2 effect log2
      return [IP,a]
    },
    doReset(resettingLayer) {
			let keep = ["auto"];
      if (hasMilestone("hp", 2) && (resettingLayer== "hp" || resettingLayer== "e")) keep.push("challenges")
      if (hasMilestone("hp", 2) && (resettingLayer== "hp" || resettingLayer== "e")) keep.push("milestones")
      if (hasMilestone("hp", 3) && (resettingLayer== "hp" || resettingLayer== "e")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("i", keep)
    },
    tabFormat: {
      "Milestones":{
        content:[
          "main-display",
          ["display-text", function(){
            return "Free IP amount: " + format(tmp.i.freeIP) + " (doesn't count towards I Upgrade cost), Total IP amount: " + format(tmp.i.totalIP)
          }],
          ["display-text", function(){
            return "IP effect softcap start: " + format(tmp.i.effectiveIP[1]) + ", effective IP: " + format(tmp.i.effectiveIP[0])
          }],
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "milestones",
        ]
      },
      "Upgrades": {
        content:[
          "main-display",
          ["display-text", function(){
            return "Free IP amount: " + format(tmp.i.freeIP) + " (doesn't count towards I Upgrade cost), Total IP amount: " + format(tmp.i.totalIP)
          }],
          ["display-text", function(){
            return "IP effect softcap start: " + format(tmp.i.effectiveIP[1]) + ", effective IP: " + format(tmp.i.effectiveIP[0])
          }],
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "upgrades",
        ]
      },
      "Challenges": {
        content:[
          "main-display",
          ["display-text", function(){
            return "Free IP amount: " + format(tmp.i.freeIP) + " (doesn't count towards I Upgrade cost), Total IP amount: " + format(tmp.i.totalIP)
          }],
          ["display-text", function(){
            return "IP effect softcap start: " + format(tmp.i.effectiveIP[1]) + ", effective IP: " + format(tmp.i.effectiveIP[0])
          }],
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "challenges",
        ],
        unlocked() {return hasMilestone("i",2)}
      },
    },
    milestonePopups: true,
    milestones: {
        0: {
          requirementDescription: "2 Infinity Points",
          effectDescription: "Unlock a new row of Super Prestige Upgrades",
          done() { return tmp.i.totalIP.gte(2) || hasMilestone("hp", 0)},
          unlocked(){return true}
        },
        1: {
          requirementDescription: "3 Infinity Points",
          effectDescription: "Unlock a new row of Prestige Upgrades",
          done() { return tmp.i.totalIP.gte(3) || hasMilestone("hp", 0)},
          unlocked(){return true}
        },
        2: {
          requirementDescription: "5 Infinity Points",
          effectDescription: "Unlock Challenge 1-8",
          done() { return tmp.i.totalIP.gte(5) || hasMilestone("hp", 0)},
          unlocked(){return true}
        },
        3: {
          requirementDescription: "33 Infinity Points",
          effectDescription: "Unlock Challenge 9-12",
          done() { return tmp.i.totalIP.gte(33) && player.e.points.gte(3)},
          unlocked(){return player.e.points.gte(3)}
        },
        101: {
          requirementDescription: "1.00e1,218 Points",
          effectDescription: "Unlock Challenge 1",
          done() { return (player.points.gte("1e1218") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2)}
        },
        102: {
          requirementDescription: "1.00e1,445 Points",
          effectDescription: "Unlock Challenge 2",
          done() { return (player.points.gte("1e1445") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 101)}
        },
        103: {
          requirementDescription: "1.00e1,622 Points",
          effectDescription: "Unlock Challenge 3",
          done() { return (player.points.gte("1e1622") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 102)}
        },
        104: {
          requirementDescription: "1.00e2,350 Points",
          effectDescription: "Unlock Challenge 4",
          done() { return (player.points.gte("1e2350") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 103)}
        },
        105: {
          requirementDescription: "1.00e3,545 Points",
          effectDescription: "Unlock Challenge 5",
          done() { return (player.points.gte("1e3545") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 104)}
        },
        106: {
          requirementDescription: "1.00e4,434 Points",
          effectDescription: "Unlock Challenge 6",
          done() { return (player.points.gte("1e4434") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 105)}
        },
        107: {
          requirementDescription: "1.00e6,413 Points",
          effectDescription: "Unlock Challenge 7",
          done() { return (player.points.gte("1e6413") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 106)}
        },
        108: {
          requirementDescription: "1.00e7,247 Points",
          effectDescription: "Unlock Challenge 8",
          done() { return (player.points.gte("1e7247") && hasMilestone("i", 2))},
          unlocked(){return hasMilestone("i", 2) && hasMilestone("i", 107)}
        },
        109: {
          requirementDescription: "1.00e34,924 Points",
          effectDescription: "Unlock Challenge 9",
          done() { return (player.points.gte("1e34924") && hasMilestone("i", 3))},
          unlocked(){return hasMilestone("i", 3) && hasMilestone("i", 108)}
        },
        110: {
          requirementDescription: "1.00e39,958 Points",
          effectDescription: "Unlock Challenge 10",
          done() { return (player.points.gte("1e39958") && hasMilestone("i", 3))},
          unlocked(){return hasMilestone("i", 3) && hasMilestone("i", 109)}
        },
        111: {
          requirementDescription: "1.00e43,505 Points",
          effectDescription: "Unlock Challenge 11",
          done() { return (player.points.gte("1e43505") && hasMilestone("i", 3))},
          unlocked(){return hasMilestone("i", 3) && hasMilestone("i", 110)}
        },
        112: {
          requirementDescription: "1.00e48,220 Points",
          effectDescription: "Unlock Challenge 12",
          done() { return (player.points.gte("1e48220") && hasMilestone("i", 3))},
          unlocked(){return hasMilestone("i", 3) && hasMilestone("i", 111)}
        },
    },
    upgrades: {
      rows: 4,
      cols: 4,
      11: {
        description: "SP make PP gain softcap starts later",
        cost: new Decimal(3),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.sp.points.add(1)
          if (hasChallenge("i", 32)) eff = eff.pow(challengeEffect("i", 32))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("i", 11)) + "x"
        },
      },
      12: {
        description: "Superlogarithm Points make all IP boost stronger",
        cost: new Decimal(4),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.slog.points.max(1)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("i", 12), 3)
        }
      },
      13: {
        description: "Raise all IP boost exponent to the power of 1.5",
        cost: new Decimal(7),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(1.5)
          return eff
        },
      },
      14: {
        description: "I Challenge 1 second reward is stronger based on IP",
        cost: new Decimal(11),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.5)
          if (hasUpgrade("p", 43)) eff = eff.pow(upgradeEffect("p", 43))
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("i", 14))
        }
      },
      21: {
        description: "SP gain softcap starts later based on HP",
        cost: new Decimal(20),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.hp.points.add(1).pow(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("i", 21)) + "x"
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      22: {
        description: "Increase HP gain base from IP based on slog points, and multiply HP gain based on IP",
        cost: new Decimal(22),
        effect(){
          if (inChallenge("i", 31)) return [new Decimal(0), new Decimal(1)]
          let eff = [player.slog.points.sub(2).max(0), tmp.i.totalIP.add(1)]
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("i", 22)[0], 3) + " base, " + format(upgradeEffect("i", 22)[1]) + "x gain" 
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      23: {
        description: "Boost HP gain based on PP, and HP gain uses a better formula",
        cost: new Decimal(24),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.p.points.add(1).log(10).pow(0.5)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("i", 23)) + "x"
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      24: {
        description: "Increase PP gain tetrate based on PP",
        cost: new Decimal(26),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = player.p.points.add(1).log(10).add(1).log(10).div(200)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("i", 24), 4)
        },
        unlocked(){
          return hasMilestone("hp", 5)
        }
      },
      31: {
        description: "Super Prestige Upgrade 12 is stronger based on IP",
        cost: new Decimal(33),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.9)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("i", 31))
        },
        unlocked(){
          return hasMilestone("e", 1)
        }
      },
      32: {
        description: "Raise HP gain from IP exponent to the power of 1.19",
        cost: new Decimal(36),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(1.19)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 1)
        }
      },
      33: {
        description: "IP make Points gain softcap starts later, and Super Prestige Upgrade 32 uses a better formula",
        cost: new Decimal(40),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(10).pow(tmp.i.totalIP.mul(20))
          if (hasChallenge("e", 31)) eff = eff.pow(challengeEffect("e", 31)[0])
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("i", 33)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 1)
        }
      },
      34: {
        description: "+1 base HP gain before tetrate, and HP gain formula is better based on EP (max -8)",
        cost: new Decimal(42),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = player.e.points.pow(0.75)
          return eff.min(8)
        },
        effectDisplay(){
          return "-" + format(upgradeEffect("i", 34))
        },
        unlocked(){
          return hasMilestone("e", 1)
        }
      },
      41: {
        description: "I Challenge 4 reward uses a better formula past 40",
        cost: new Decimal(53),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(1.5)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      42: {
        description: "Points make SP gain softcap starts later",
        cost: new Decimal(61),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(10).pow(player.points.max(10).log(10).pow(0.3135))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("i", 42)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      43: {
        description: "Give Free IP amount based on HP, and reduce EP cost scaling based on slog PP",
        cost: new Decimal(71),
        effect(){
          if (inChallenge("i", 31)) return [new Decimal(0), new Decimal(1)]
          let eff = [player.hp.points.max(10).log(10).log(10), player.slog.prestigePoints.max(1).pow(-0.2268)]
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("i", 43)[0]) + ", ^" + format(upgradeEffect("i", 43)[1], 3)
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      44: {
        description: "Increase last 2 slog PP boost exponent based on IP",
        cost: new Decimal(79),
        effect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = tmp.i.totalIP.div(500).max(0)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("i", 44), 3)
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
    },
    challenges: {
      rows: 8,
      cols: 2,
      11: {
        name: "Challenge 1",
        challengeDescription: "Prestige Points gain is raised to the power of 0.01. (after softcaps)",
        goal: new Decimal(2).pow(1024*1.35),
        rewardDescription: "Points make PP/SP gain softcap starts later.",
        rewardEffect(){
          if (inChallenge("i", 31)) return [new Decimal(1), new Decimal(1)]
          let eff = [player.points.max(1).pow(0.1), player.points.max(10).log(10)]
          if (hasUpgrade("i", 14)) eff[1] = eff[1].pow(upgradeEffect("i", 14))
          if (hasChallenge("e", 42)) eff[1] = eff[1].pow(challengeEffect("e", 42))
          
          if (eff[0].gte(tmp.i.challenges[11].rewardSCStart_PP)) eff[0] = new Decimal(10).pow(eff[0].log(10).mul(tmp.i.challenges[11].rewardSCStart_PP.log(10)).pow(0.5))
          return eff
        },
        rewardSCStart_PP(){
          let scstart = new Decimal(10).pow(9000)
          if (hasUpgrade("hp", 43)) scstart = scstart.mul(upgradeEffect("hp", 43))
          return scstart
        },
        rewardDisplay(){
          return format(challengeEffect("i", 11)[0]) + "x PP gain softcap start, " + format(challengeEffect("i", 11)[1]) + "x SP gain softcap start. (Reward 1 Softcap start: " + format(tmp.i.challenges[11].rewardSCStart_PP) + "x)"
        },
        unlocked(){
          return hasMilestone("i", 101)
        },
      },
      12: {
        name: "Challenge 2",
        challengeDescription: "All Super Prestige Upgrades do nothing.",
        goal: new Decimal(10).pow(902),
        rewardDescription: "Prestige Upgrade 5 affect Super Prestige Points gain, and Superlogarithm Points increase SP gain tetrate amount.",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = player.slog.points.sub(2).max(0).div(2)
          return eff
        },
        rewardDisplay(){
          return "+" + format(challengeEffect("i", 12), 3)
        },
        unlocked(){
          return hasMilestone("i", 102)
        }
      },
      21: {
        name: "Challenge 3",
        challengeDescription: "You always have no non-free Superlogarithm Points.",
        goal: new Decimal(10).pow(623),
        rewardDescription: "Multiply Points and PP gain based on Superlogarithm Points.",
        rewardEffect(){
          if (inChallenge("i", 21) || inChallenge("i", 31) || inChallenge("i", 51) || inChallenge("e", 21)) return new Decimal(1)
          let eff = new Decimal(10).pow(new Decimal(10).pow(player.slog.points.mul(tmp.i.challenges[21].rewardMul)))
          return eff
        },
        rewardMul(){
          let mul = new Decimal(1.005)
          if (hasChallenge("i", 42)) mul = mul.add(challengeEffect("i", 42))
          if (mul.gte(1.2)) mul = mul.mul(1.2).pow(0.5)
          return mul
        },
        rewardDisplay(){
          return format(challengeEffect("i", 21)) + "x (Multi: " + format(tmp.i.challenges[21].rewardMul, 3) + ", softcap at 1.200)"
        },
        unlocked(){
          return hasMilestone("i", 103)
        }
      },
      22: {
        name: "Challenge 4",
        challengeDescription: "All Prestige Upgrades except first one do nothing.",
        goal: new Decimal(10).pow(653),
        rewardDescription: "IP make Prestige Upgrade 1 softcap starts later.",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let IP = tmp.i.totalIP
          if (hasUpgrade("i", 41) && IP.gte(40)) IP = IP.div(40).pow(upgradeEffect("i", 41)).mul(40)
          let eff = new Decimal(1e6).pow(IP).mul(10)
          return eff
        },
        rewardDisplay(){
          return format(challengeEffect("i", 22)) + "x"
        },
        unlocked(){
          return hasMilestone("i", 104)
        }
      },
      31: {
        name: "Challenge 5",
        challengeDescription: "IP boost, Infinity Upgrades and Challenges reward do nothing.",
        goal: new Decimal(10).pow(1404),
        rewardDescription: "IP make Prestige Upgrade 11 and 13 stronger.",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = new Decimal(1).add(tmp.i.totalIP.div(22.5))
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("i", 31))
        },
        unlocked(){
          return hasMilestone("i", 105)
        }
      },
      32: {
        name: "Challenge 6",
        challengeDescription: "PP gain softcap and Prestige Upgrade 11 softcap start ^0.02.",
        goal: new Decimal(10).pow(1204),
        rewardDescription: "Superlogarithm Points make Infinity Upgrade 1 stronger",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.slog.points.max(1)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("i", 32), 3)
        },
        unlocked(){
          return hasMilestone("i", 106)
        }
      },
      41: {
        name: "Challenge 7",
        challengeDescription: "Prestige Upgrade 11 is the only things that boost Point generation.",
        goal: new Decimal(10).pow(2456),
        rewardDescription: "Divide Infinity requirement based on PP",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = player.p.points.pow(0.2815).max(1)
          
          if (eff.gte(tmp.i.challenges[41].rewardSCStart)) eff = new Decimal(10).pow(eff.log(10).mul(tmp.i.challenges[41].rewardSCStart.log(10)).pow(0.5))
          return eff
        },
        rewardSCStart(){
          let scstart = new Decimal(10).pow(1e4)
          if (hasUpgrade("p", 42)) scstart = scstart.mul(upgradeEffect("p", 42))
          if (hasUpgrade("hp", 43)) scstart = scstart.mul(upgradeEffect("hp", 43))
          return scstart
        },
        rewardDisplay(){
          return "/" + format(challengeEffect("i", 41)) + " (Softcap start: /" + format(tmp.i.challenges[41].rewardSCStart) + ")"
        },
        unlocked(){
          return hasMilestone("i", 107)
        }
      },
      42: {
        name: "Challenge 8",
        challengeDescription: "Superlogarithm Points is the only things that boost PP gain, PP gain tetrate is always 1.1",
        goal: new Decimal(10).pow(2505),
        rewardDescription: "I Challenge 3 reward is better based on IP",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = tmp.i.totalIP.div(112)
          if (hasUpgrade("sp", 34)) eff = eff.mul(upgradeEffect("sp", 34))
          return eff
        },
        rewardDisplay(){
          return "+" + format(challengeEffect("i", 42), 3)
        },
        unlocked(){
          return hasMilestone("i", 108)
        }
      },
      51: {
        name: "Challenge 9",
        challengeDescription: "Challenge 2 and 4 are applied at once, Challenge 3 reward do nothing.",
        goal: new Decimal(10).pow(50),
        rewardDescription: "Infinity Points make all EP boost stronger.",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.18)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("i", 51))
        },
        unlocked(){
          return hasMilestone("i", 109)
        },
        countsAs: [12,22]
      },
      52: {
        name: "Challenge 10",
        challengeDescription: "Points gain softcap start at 10 and exponent raised to the power of 0.75",
        goal: new Decimal(10).pow(47).mul(2),
        rewardDescription: "Points boosts Points gain while outside I Challenges.",
        rewardEffect(){
          if (player.i.activeChallenge) return new Decimal(1)
          let eff = player.points.max(1).pow(0.1)
          if (hasChallenge("e", 41)) eff = eff.pow(challengeEffect("e", 41))
          return eff
        },
        rewardDisplay(){
          return format(challengeEffect("i", 52)) + "x"
        },
        unlocked(){
          return hasMilestone("i", 110)
        },
        countsAs: []
      },
      61: {
        name: "Challenge 11",
        challengeDescription: "Challenge 3, 7 and 8 are applied at once, PP gain tetrate is always 1",
        goal: new Decimal(10).pow(55),
        rewardDescription: "Increase slog points boost exponent based on IP",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = tmp.i.totalIP.div(185)
          return eff
        },
        rewardDisplay(){
          return "+" + format(challengeEffect("i", 61), 3)
        },
        unlocked(){
          return hasMilestone("i", 111)
        },
        countsAs: [21,41,42]
      },
      62: {
        name: "Challenge 12",
        challengeDescription: "Challenge 2, 4 and 5 are applied at once, Hyper Prestige Upgrades do nothing",
        goal: new Decimal(10).pow(9),
        rewardDescription: "Reduce slog points base by 0.6",
        rewardEffect(){
          if (inChallenge("i", 31)) return new Decimal(0)
          let eff = new Decimal(0.6)
          return eff
        },
        unlocked(){
          return hasMilestone("i", 112)
        },
        countsAs: [12,22,31]
      },
    }
})

addLayer("hp", {
    name: "hyper prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      total: new Decimal(0),
    }},
    color: "#F00",
    requires: new Decimal(11.4).pow(new Decimal(11.4).pow(2)), // Can be a function that takes requirement increases into account
    resource: "hyper prestige points", // Name of prestige currency
    baseResource: "super prestige points", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["sp"],
    canReset(){
      return player.sp.points.gte(new Decimal(11.4).pow(new Decimal(11.4).pow(2)))
    },
    getBaseResetGain(){
      let base = new Decimal(11.4)
      let tetr = new Decimal(2)
      if (hasUpgrade("i", 23) && !inChallenge("i", 31)) base = base.sub(1.4)
      if (hasUpgrade("i", 34) && !inChallenge("i", 31)) base = base.sub(upgradeEffect("i", 34))
      
      let gain = player.sp.points.max(1).log(base).max(1).log(base).sub(1)
      if (hasUpgrade("i", 34) && !inChallenge("i", 31)) gain = gain.add(1)
      return gain.tetrate(tetr)
    },
    getResetGainMulFromIP(){
      let IPbase = new Decimal(2)
      if (hasUpgrade("i", 22)) IPbase = IPbase.add(upgradeEffect("i", 22)[0])
      
      let IPamount = tmp.i.totalIP.sub(15).max(0)
      if (hasUpgrade("i", 32)) IPamount = IPamount.pow(upgradeEffect("i", 32))
      
      let mul = IPbase.pow(IPamount)
      return mul
    },
    getResetGain(){
      let gain = tmp.hp.getBaseResetGain.mul(tmp.hp.getResetGainMulFromIP)
      
      if (hasUpgrade("hp", 12)) gain = gain.mul(upgradeEffect("hp", 12))
      if (hasUpgrade("hp", 13) && !hasUpgrade("hp", 14)) gain = gain.mul(10)
      if (hasUpgrade("sp", 32)) gain = gain.mul(upgradeEffect("sp", 32))
      if (hasUpgrade("i", 22)) gain = gain.mul(upgradeEffect("i", 22)[1])
      if (hasUpgrade("i", 23)) gain = gain.mul(upgradeEffect("i", 23))
      gain = gain.mul(layers.e.effect()[1])
      
      if (gain.gte(tmp.hp.getSCStart)) gain = new Decimal(10).pow(gain.log(10).mul(tmp.hp.getSCStart.log(10)).pow(0.5))
      if (hasChallenge("e", 31)) gain = gain.pow(challengeEffect("e", 31)[1])
      return gain.floor()
    },
    getSCStart(){
      let scstart = new Decimal(1e49)
      if (hasUpgrade("hp", 41)) scstart = scstart.mul(upgradeEffect("hp", 41))
      scstart = scstart.mul(layers.slog.effectP(true))
      return scstart
    },
    getNextAt(canMax=false){
      return
    },
    prestigeButtonText(){
      return "Reset for " + formatWhole(getResetGain("hp")) + " Hyper Prestige Points." + `<br>` + "(Base reset gain: " + format(tmp.hp.getBaseResetGain) + ", multiplier from IP: " + format(tmp.hp.getResetGainMulFromIP) + ")"
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Reset for hyper prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return tmp.i.totalIP.gte(15) || player.hp.unlocked},
    passiveGeneration(){ return 0},
    doReset(resettingLayer) {
			let keep = [];
      if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep)
    },
    tabFormat:[
      "main-display",
      "blank",
      "prestige-button",
      "resource-display",
      "blank",
      ["display-text", function() {
        return "HP gain softcap start: " + format(tmp.hp.getSCStart)
      }],
      "blank",
      "milestones",
      "blank",
      "upgrades"
    ],
    milestonePopups: true,
    milestones: {
        0: {
          requirementDescription: "300 Total Hyper Prestige Points",
          effectDescription: "Keep Super Prestige/Infinity Milestones on row 3 reset.",
          done() { return player.hp.total.gte(300)},
          unlocked(){return true}
        },
        1: {
          requirementDescription: "3,000 Total Hyper Prestige Points",
          effectDescription: "Keep Prestige Upgrades on row 3 reset and you can buy max Infinity Points.",
          done() { return player.hp.total.gte(3000)},
          unlocked(){return true}
        },
        2: {
          requirementDescription: "95,000 Total Hyper Prestige Points",
          effectDescription: "Keep Super Prestige Upgrades and Challenge completions on row 3 reset.",
          done() { return player.hp.total.gte(95000)},
          unlocked(){return true}
        },
        3: {
          requirementDescription: "650,000 Total Hyper Prestige Points",
          effectDescription: "Keep Infinity Upgrades on row 3 reset and gain 100% of Super Prestige Point gain every second.",
          done() { return player.hp.total.gte(6.5e5)},
          unlocked(){return true}
        },
        4: {
          requirementDescription: "2,000,000 Total Hyper Prestige Points",
          effectDescription: "Unlock auto Infinity and they resets nothing.",
          done() { return player.hp.total.gte(2e6)},
          unlocked(){return true},
          toggles: [["i", "auto"]]
        },
        5: {
          requirementDescription: "50,000,000 Total Hyper Prestige Points",
          effectDescription: "Unlock a new row of Super Prestige/Infinity Upgrades",
          done() { return player.hp.total.gte(5e7)},
          unlocked(){return true}
        },
    },
    upgrades: {
      rows: 4,
      cols: 4,
      11: {
        description: "Multiply Points and PP gain by 100, then raise Points and PP gain to the power of 1.0415 (PP gain is unaffected by softcap)",
        cost: new Decimal(1),
        effect(){
          if (inChallenge("i", 62)) return [new Decimal(1), new Decimal(1)]
          let eff = [new Decimal(100), new Decimal(1.0415)]
          return eff
        },
      },
      12: {
        description: "Superlogarithm Points boost affect HP gain with reduced effect",
        cost: new Decimal(2),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = layers.slog.effect().max(1).log(10).add(1)
          if (hasUpgrade("hp", 14)) eff = eff.pow(upgradeEffect("hp", 14))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 12)) + "x"
        }
      },
      13: {
        description: "Boost SP gain based on HP (unaffected by softcap) and gain 10x HP if you didn't have Hyper Prestige Upgrade 14",
        cost: new Decimal(600),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.hp.points.add(1).pow(0.5)
          if (hasUpgrade("hp", 23)) eff = eff.pow(upgradeEffect("hp", 23))
          if (eff.gte(1e300)) eff = new Decimal(10).pow(eff.log(10).mul(300).pow(0.5))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 13)) + "x"
        }
      },
      14: {
        description: "Hyper Prestige Upgrade 12 is stronger based on IP",
        cost: new Decimal(6000),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.25)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("hp", 14))
        }
      },
      21: {
        description: "Divide Infinity requirement based on SP",
        cost: new Decimal(2.25e5),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.sp.points.pow(5).max(1)
          if (eff.gte("1e18000")) eff = new Decimal(10).pow(eff.log(10).mul(18000).pow(0.5))
          return eff
        },
        effectDisplay(){
          return "/" + format(upgradeEffect("hp", 21))
        }
      },
      22: {
        description: "Raise Superlogarithm Points boost based on Hyper Prestige Points",
        cost: new Decimal(2.5e6),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.hp.points.max(1).log(10).max(1).log(10).add(1)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("hp", 22), 3)
        }
      },
      23: {
        description: "Hyper Prestige Upgrade 13 is stronger based on IP",
        cost: new Decimal(3e11),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = tmp.i.totalIP.max(1).pow(0.425)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("hp", 23))
        }
      },
      24: {
        description: "HP make PP gain softcap starts later",
        cost: new Decimal(5e17),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.hp.points.add(1).pow(64)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 24)) + "x"
        }
      },
      31: {
        description: "Increase SP gain tetrate by 0.22",
        cost: new Decimal(8e23),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(0)
          let eff = new Decimal(0.22)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 0)
        }
      },
      32: {
        description: "Reduce IP gain scaling based on slog points",
        cost: new Decimal(2e41),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.slog.points.max(1).pow(-0.0638)
          return eff
        },
        effectDisplay(){
          return "^" + format(upgradeEffect("hp", 32), 3)
        },
        unlocked(){
          return hasMilestone("e", 0)
        }
      },
      33: {
        description: "Raise all EP boost exponent to the power of 1.2",
        cost: new Decimal(2.5e47),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = new Decimal(1.2)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 0)
        }
      },
      34: {
        description: "Give 0.025 free slog points",
        cost: new Decimal(1.5e53),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(0)
          let eff = new Decimal(0.025)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 0)
        }
      },
      41: {
        description: "HP gain softcap starts later based on Points",
        cost: new Decimal(1e67),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.points.max(10).log(10)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 41)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      42: {
        description: "HP make Prestige Upgrade 11 softcap starts later",
        cost: new Decimal(1e79),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.hp.points.pow(3.06).max(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 42)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      43: {
        description: "I Challenge 1 and 7 reward softcap starts later based on SP",
        cost: new Decimal(2e100),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = player.sp.points.pow(0.102).max(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 43)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
      44: {
        description: "slog PP boost effect 1 make Points and PP gain softcap starts later",
        cost: new Decimal(1e123),
        effect(){
          if (inChallenge("i", 62)) return new Decimal(1)
          let eff = new Decimal(10).pow(layers.slog.effectP(false).log(10).pow(1.5))
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("hp", 44)) +"x"
        },
        unlocked(){
          return hasMilestone("e", 3)
        }
      },
    }
})

addLayer("e", {
    name: "eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      best: new Decimal(0),
      auto: false,
    }},
    color: "#6600CC",
    requires(){
      let req = new Decimal(2).pow(1024)
      req = req.pow(1.35)
      if (hasChallenge("e", 12)) req = req.div(challengeEffect("e", 12)[1])
      return req
    }, // Can be a function that takes requirement increases into account
    base(){
      let base = new Decimal(2).pow(1024)
      base = base.pow(0.15)
      if (hasUpgrade("i", 43)) base = base.pow(upgradeEffect("i", 43)[1])
      return base
    },
    exponent(){
      let exp = new Decimal(2)
      return exp
    },
    resource: "eternity points", // Name of prestige currency
    baseResource: "super prestige points", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["i"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for eternity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.hp.upgrades.length >= 8 || player.e.unlocked},
    canBuyMax(){
      return false
    },
    autoPrestige(){
      return player.e.auto
    },
    resetsNothing(){
      return false
    },
    effect(){
      let exp = player.e.points
      if (hasUpgrade("hp", 33)) exp = exp.pow(upgradeEffect("hp", 33))
      let eff = [new Decimal(1e11).pow(exp), new Decimal(10).pow(exp)]
      if (hasChallenge("i", 51)) eff[0] = eff[0].pow(challengeEffect("i", 51))
      if (hasChallenge("i", 51)) eff[1] = eff[1].pow(challengeEffect("i", 51))
      return eff
    },
    effectDescription(){
      return " which make SP gain softcap starts " + format(layers.e.effect()[0]) + "x later and multiply HP gain by " + format(layers.e.effect()[1])
    },
    doReset(resettingLayer) {
			let keep = ["auto"];
      if (layers[resettingLayer].row > this.row) layerDataReset("i", keep)
    },
    tabFormat: {
      "Milestones":{
        content:[
          "main-display",
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "milestones",
        ]
      },
      "Upgrades": {
        content:[
          "main-display",
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "upgrades",
        ]
      },
      "Challenges": {
        content:[
          "main-display",
          "blank",
          "prestige-button",
          "resource-display",
          "blank",
          "milestones",
          "blank",
          ["display-text", function(){
            return "If you are in a Eternity tier Challenges, you will have a maximum of 0 free slog points, no slog prestige points and maximum of 0 free Infinity Points."
          }],
          "blank",
          "challenges",
        ],
        unlocked() {return hasMilestone("e",2)}
      },
    },
    milestonePopups: true,
    milestones: {
        0: {
          requirementDescription: "2 Eternity Points",
          effectDescription: "Unlock a new row of Hyper Prestige Upgrades",
          done() { return player.e.points.gte(2)},
          unlocked(){return true}
        },
        1: {
          requirementDescription: "3 Eternity Points",
          effectDescription: "Unlock a new row of Infinity Upgrades and more Infinity Milestones",
          done() { return player.e.points.gte(3)},
          unlocked(){return true}
        },
        2: {
          requirementDescription: "6 Eternity Points",
          effectDescription: "Unlock Challenges and a new row of Prestige/Super Prestige Upgrades",
          done() { return player.e.points.gte(6)},
          unlocked(){return true}
        },
        3: {
          requirementDescription: "8 Eternity Points",
          effectDescription: "Unlock a new row of Hyper Prestige/Infinity Upgrades",
          done() { return player.e.points.gte(8)},
          unlocked(){return true}
        },
        4: {
          requirementDescription: "10 Eternity Points",
          effectDescription: "Unlock Superlogarithm Prestige Points and square E Challenge 2 second reward",
          done() { return player.e.points.gte(10)},
          unlocked(){return true}
        },
        101: {
          requirementDescription: "1.00e53,077 Points",
          effectDescription: "Unlock Challenge 1",
          done() { return player.points.gte("1e53077") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2)}
        },
        102: {
          requirementDescription: "1.00e54,842 Points",
          effectDescription: "Unlock Challenge 2",
          done() { return player.points.gte("1e54842") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 101)}
        },
        103: {
          requirementDescription: "1.00e65,124 Points",
          effectDescription: "Unlock Challenge 3",
          done() { return player.points.gte("1e65124") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 102)}
        },
        104: {
          requirementDescription: "1.00e76,982 Points",
          effectDescription: "Unlock Challenge 4",
          done() { return player.points.gte("1e76982") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 103)}
        },
        105: {
          requirementDescription: "1.00e96,463 Points",
          effectDescription: "Unlock Challenge 5",
          done() { return player.points.gte("1e96463") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 104)}
        },
        106: {
          requirementDescription: "1.00e120,162 Points",
          effectDescription: "Unlock Challenge 6",
          done() { return player.points.gte("1e120162") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 105)}
        },
        107: {
          requirementDescription: "1.00e165,642 Points",
          effectDescription: "Unlock Challenge 7",
          done() { return player.points.gte("1e165642") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 106)}
        },
        108: {
          requirementDescription: "1.00e189,909 Points",
          effectDescription: "Unlock Challenge 8",
          done() { return player.points.gte("1e189909") && hasMilestone("e", 2)},
          unlocked(){return hasMilestone("e", 2) && hasMilestone("e", 107)}
        },
    },
    upgrades: {
      rows: 3,
      cols: 4,
      11: {
        description: "slog points effect make Points gain softcap starts later",
        cost: new Decimal(3),
        effect(){
          let eff = layers.slog.effect().pow(0.5).max(1)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("e", 11)) + "x"
        }
      },
      12: {
        description: "Multiply Superlogarithm Points boost exponent by 1.1115",
        cost: new Decimal(4),
        effect(){
          let eff = new Decimal(1.1115)
          return eff
        },
      },
      13: {
        description: "PP gain formula is better based on EP",
        cost: new Decimal(9),
        effect(){
          let eff = new Decimal(0.99).pow(player.e.points)
          return eff
        },
        effectDisplay(){
          return "log" + `<sub>` + format(upgradeEffect("p", 21)[0], 0) + `</sub>`+ "(x) → log" + `<sub>` + format(upgradeEffect("p", 21)[0].pow(upgradeEffect("e", 13)), 3) + `</sub>` + "(x) (cap at log" + `<sub>` + "1.1" + `</sub>` + "(x))"
        }
      },
      14: {
        description: "Give Free IP amount based on slog points, and E Challenge 3 reward is better",
        cost: new Decimal(13),
        effect(){
          let eff = player.slog.points.max(0)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("e", 14))
        }
      },
    },
    challenges: {
      rows: 8,
      cols: 2,
      11: {
        name: "Challenge 1",
        challengeDescription: "You can't gain any SP, PP gain is hardcapped at your points.",
        goal: new Decimal(10).pow(14183),
        rewardDescription: "I Challenge 4 reward affect SP gain softcap start at reduced effect.",
        rewardEffect(){
          let eff = challengeEffect("i", 22).pow(0.2)
          return eff
        },
        rewardDisplay(){
          return format(challengeEffect("e", 11)) + "x"
        },
        unlocked(){
          return hasMilestone("e", 101)
        },
      },
      12: {
        name: "Challenge 2",
        challengeDescription: "You can't gain any IP.",
        goal: new Decimal(10).pow(15245),
        rewardDescription: "Prestige Upgrade 31 boost from IP ^1.705, and Divide EP requirement based on slog points.",
        rewardEffect(){
          let eff = [new Decimal(1.705), new Decimal(10).pow(player.slog.points.mul(6.5)).max(1)]
          if (hasUpgrade("sp", 44)) eff[1] = eff[1].max(new Decimal(10).pow(player.slog.points.max(1).pow(5.21)))
          if (hasMilestone("e", 4)) eff[1] = eff[1].pow(2)
          return eff
        },
        rewardDisplay(){
          return "/" + format(challengeEffect("e", 12)[1])
        },
        unlocked(){
          return hasMilestone("e", 102)
        },
      },
      21: {
        name: "Challenge 3",
        challengeDescription: "You always have -5 free slog points, which may make slog points nerf Points, PP and SP gain, slog points boost power is always 10.",
        goal: new Decimal(10).pow(5400),
        rewardDescription(){return "Gain " + format(challengeEffect("e", 21).mul(100), 3) + "% more slog points from non-free slog points." + (hasUpgrade("e", 14) ? " (based on slog PP)" : "")} ,
        rewardEffect(){
          let eff = new Decimal(0.0125)
          if (hasUpgrade("e", 14) && player.slog.prestigePoints.gte(1.25)) eff = player.slog.prestigePoints.div(100)
          return eff
        },
        unlocked(){
          return hasMilestone("e", 103)
        },
      },
      22: {
        name: "Challenge 4",
        challengeDescription: "Points, PP and SP gain softcap start ^0.1, IP gain scaling exponent is squared.",
        goal: new Decimal(10).pow(4736),
        rewardDescription: "Points gain softcap starts later based on slog points.",
        rewardEffect(){
          let eff = player.slog.points.max(1).pow(0.087)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("e", 22), 3)
        },
        unlocked(){
          return hasMilestone("e", 104)
        },
      },
      31: {
        name: "Challenge 5",
        challengeDescription: "Base PP and SP gain are always 1 and gain exponent ^0.75, slog points base is tetrated 1.5.",
        goal: new Decimal(10).pow(3237),
        rewardDescription: "Infinity Upgrade 33 is stronger based on EP, and gain more HP based on your points if you have more than 1.00e100,000 points (unaffected by softcap)",
        rewardEffect(){
          let eff = [player.e.points.pow(0.365), (player.points.gte("ee5") ? player.points.max(10).log(10).log(10).div(100).add(1) : new Decimal(1))]
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("e", 31)[0]) + " to Infinity Upgrade 33, ^" + format(challengeEffect("e", 31)[1], 3) + " to HP gain"
        },
        unlocked(){
          return hasMilestone("e", 105)
        },
      },
      32: {
        name: "Challenge 6",
        challengeDescription: "E Challenge 1, 2 are applied at once, Points gain is square rooted.",
        goal: new Decimal(10).pow(2358),
        rewardDescription: "Raise points gain and it's softcap start based on slog prestige points.",
        rewardEffect(){
          let eff = player.slog.prestigePoints.max(1).pow(0.1232)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("e", 32), 3)
        },
        unlocked(){
          return hasMilestone("e", 106)
        },
        countsAs: [11,12]
      },
      41: {
        name: "Challenge 7",
        challengeDescription: "Points gain past softcap become logarithmic and the softcap start ^0.03, all IP cost divider have no effect.",
        goal: new Decimal(10).pow(1508.5),
        rewardDescription: "I Challenge 10 reward is stronger based on slog PP.",
        rewardEffect(){
          let eff = player.slog.prestigePoints.max(1).pow(2.021)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("e", 41), 3)
        },
        unlocked(){
          return hasMilestone("e", 107)
        },
      },
      42: {
        name: "Challenge 8",
        challengeDescription: "Points gain are hardcapped at SP+1, PP gain become log10(x)^10.",
        goal: new Decimal(10).pow(1170),
        rewardDescription: "I Challenge 1 second reward is stronger based on slog PP.",
        rewardEffect(){
          let eff = player.slog.prestigePoints.max(1).pow(2.37)
          return eff
        },
        rewardDisplay(){
          return "^" + format(challengeEffect("e", 42), 3)
        },
        unlocked(){
          return hasMilestone("e", 108)
        },
      },
    }
})

addLayer("slog", {
    name: "superlogarithm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new Decimal(0),
      prestigePoints: new Decimal(0),
    }},
    color: "#FFFFFF",
    resource: "superlogarithm", // Name of prestige currency
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.sp.unlocked},
    tooltip(){return format(player.slog.points, 6) + " slog points"},
    tabFormat: [
      ["display-text", function(){
        return "You have " + format(tmp.slog.getNonFreeSlogPoints, 6) + (tmp.slog.getFreeSlogPoints.eq(0) ? "" : (tmp.slog.getFreeSlogPoints.gt(0) ? " + " : " - ") + format(tmp.slog.getFreeSlogPoints.abs(), 6)) + " superlogarithm points. " + `<br>` + "(based on points with a base of " + format(tmp.slog.getBase, 3) + ")"
        + `<br>` + "Which " + (player.slog.points.gte(0) ? "multiply" : "divide")  + " Points, PP and SP gain by " + format(layers.slog.effect().pow(player.slog.points.gte(0) ? 1 : -1)) + "." + `<br>` + "(Formula: 10" + `<sup>` + format(tmp.slog.effectPow.abs(), 3) + "×" + format(player.slog.points.abs(), 3) + `<sup>` + format(tmp.slog.effectExp, 3) + `</sup></sup>` + ")"
      }],
      "blank",
      ["display-text", function(){
        return hasMilestone("e", 4) ? "You have " + format(tmp.slog.getNonFreeSlogPrestigePoints, 6) + " superlogarithm prestige points. " + `<br>` + "(based on prestige points with a base of " + format(tmp.slog.getBase.tetrate(tmp.slog.getSlogPPTetrate), 3) + " (" + format(tmp.slog.getBase, 3) + "^^" + format(tmp.slog.getSlogPPTetrate, 3) + "))"
        + `<br>` + "Which make Points, PP and SP gain softcap start " + format(layers.slog.effectP(false)) + "x later." + `<br>` + "(Formula: " + "10" + `<sup>` + format(tmp.slog.effectPowP, 3) + "×10" + `<sup>` + format(tmp.slog.effectExpP1, 3) + "×" + format(player.slog.prestigePoints, 3) + `<sup>` + format(tmp.slog.effectExpP2, 3) + `</sup></sup></sup>` + ")" + `<br>`
        + "HP gain softcap start " + format(layers.slog.effectP(true)) + "x later." + `<br>` + "(Formula: " + "10" + `<sup>` + format(tmp.slog.effectPowP_HP, 3) + "×" + format(player.slog.prestigePoints, 3) + `<sup>` + format(tmp.slog.effectExpP_HP, 3) + `</sup></sup>` + ")" + `<br>`
        + "and raise slog points boost to the power of " + format(player.slog.prestigePoints.max(tmp.slog.effectPPtoPowMin).pow(tmp.slog.effectPPtoPPow), 3) + "." + `<br>` + "(Formula: " + format(player.slog.prestigePoints.max(tmp.slog.effectPPtoPowMin), 3) + `<sup>` + format(tmp.slog.effectPPtoPPow, 3) + `</sup>` + ")" : ""
      }],
      "blank",
      ["display-text", function(){
        return "Points gain softcap start: " + format(getPointGainSCStart())
      }]
    ],
    update(diff){
      if (player.sp.unlocked) player.slog.unlocked = true
      let slog = tmp.slog.getNonFreeSlogPoints.add(tmp.slog.getFreeSlogPoints)
      let slogP = tmp.slog.getNonFreeSlogPrestigePoints
      if (!player.slog.unlocked) player.slog.points = new Decimal(0)
      else player.slog.points = slog
      if (!hasMilestone("e", 4)) player.slog.prestigePoints = new Decimal(0)
      else player.slog.prestigePoints = slogP
    },
    getNonFreeSlogPoints(){
      let usedPoints = player.points
      usedPoints = usedPoints.max(1)
      let baseAmt = usedPoints.slog(tmp.slog.getBase)
      if (inChallenge("i", 21)) baseAmt = new Decimal(0)
      return baseAmt
    },
    getNonFreeSlogPrestigePoints(){
      let usedPoints = player.p.points
      usedPoints = usedPoints.max(1)
      let baseAmt = usedPoints.slog(tmp.slog.getBase.tetrate(tmp.slog.getSlogPPTetrate))
      if (player.e.activeChallenge) baseAmt = new Decimal(0)
      return baseAmt
    },
    getFreeSlogPoints(){
      let freeAmt = new Decimal(0)
      if (hasUpgrade("hp", 34)) freeAmt = freeAmt.add(upgradeEffect("hp", 34))
      if (hasChallenge("e", 21)) freeAmt = freeAmt.add(tmp.slog.getNonFreeSlogPoints.mul(challengeEffect("e", 21)))
      if (inChallenge("e", 21)) freeAmt = new Decimal(-5)
      
      if (player.e.activeChallenge) freeAmt = freeAmt.min(0)
      return freeAmt
    },
    getBase(){
      let base = new Decimal(10)
      if (hasChallenge("i", 62)) base = base.sub(challengeEffect("i", 62))
      if (hasUpgrade("sp", 41)) base = base.sub(upgradeEffect("sp", 41))
      if (hasUpgrade("sp", 44)) base = base.sub(upgradeEffect("sp", 44))
      if (inChallenge("e", 31)) base = base.tetrate(1.5)
      return base
    },
    getSlogPPTetrate(){
      let tetr = new Decimal(2)
      return tetr
    },
    effectPow(){
      let pow = new Decimal(1)
      if (hasUpgrade("sp", 22)) pow = pow.mul(upgradeEffect("sp", 22))
      if (hasUpgrade("sp", 24)) pow = pow.mul(upgradeEffect("sp", 24))
      if (hasUpgrade("hp", 22)) pow = pow.mul(upgradeEffect("hp", 22))
      pow = pow.mul(player.slog.prestigePoints.max(tmp.slog.effectPPtoPowMin).pow(tmp.slog.effectPPtoPPow))
      if (inChallenge("e", 21)) pow = new Decimal(10)
      if (!player.slog.points.eq(0)) pow = pow.mul(player.slog.points.sign)
      return pow
    },
    effectExp(){
      let exp = new Decimal(1)
      if (hasUpgrade("sp", 13)) exp = exp.mul(upgradeEffect("sp", 13))
      if (hasUpgrade("sp", 21)) exp = exp.mul(upgradeEffect("sp", 21))
      if (hasUpgrade("e", 12)) exp = exp.mul(upgradeEffect("e", 12))
      if (hasChallenge("i", 61)) exp = exp.add(challengeEffect("i", 61))
      return exp
    },
    effect(){
      if (!player.slog.unlocked) return new Decimal(1)
      let slog = player.slog.points.abs()
      let pow = tmp.slog.effectPow
      let exp = tmp.slog.effectExp
      let eff = new Decimal(10).pow(pow.mul(slog.pow(exp)))
      return eff
    },
    effectPowP(){
      let pow = new Decimal(1)
      if (hasUpgrade("p", 44)) pow = pow.mul(upgradeEffect("p", 44))
      return pow
    },
    effectExpP1(){
      let exp1 = new Decimal(1.25)
      return exp1
    },
    effectExpP2(){
      let exp2 = new Decimal(1)
      return exp2
    },
    effectPowP_HP(){
      let pow = new Decimal(4)
      if (hasUpgrade("p", 44)) pow = pow.mul(upgradeEffect("p", 44))
      return pow
    },
    effectExpP_HP(){
      let exp = new Decimal(1)
      if (hasUpgrade("i", 44)) exp = exp.add(upgradeEffect("i", 44))
      return exp
    },
    effectPPtoPPow(){
      let pow = new Decimal(1)
      if (hasUpgrade("i", 44)) pow = pow.add(upgradeEffect("i", 44))
      return pow
    },
    effectPPtoPowMin(){
      let min = new Decimal(1)
      return min
    },
    effectP(boostHP){
      if (!hasMilestone("e", 4)) return new Decimal(1)
      let slog = player.slog.prestigePoints
      let pow = tmp.slog.effectPowP
      let exp1 = (boostHP ? tmp.slog.effectPowP_HP : tmp.slog.effectExpP1)
      let exp2 = (boostHP ? tmp.slog.effectExpP_HP : tmp.slog.effectExpP2)
      let eff = new Decimal(10).pow(exp1.mul(slog.pow(exp2)))
      if (!boostHP) eff = new Decimal(10).pow(eff).pow(pow)
      return eff
    },
})
