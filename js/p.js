// PRESTIGE LAYER

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
      bestC12: new Decimal(0),
      onlyShowC12: false,
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
    getBreakLimitRoot(){
      let root = new Decimal(5)
      if (hasAchievement("a",51)) root = root.sub(1)
      if (hasAchievement("a",54)) root = root.sub(0.2)
      if (hasAchievement("a",61)) root = root.sub(0.3)
      if (hasMilestone("t", 10)) root = root.sub(tmp.t.milestones[10].effect)
      return root
    },
    getBaseResetGain(){
      let x = getBuyableAmount("h",11).add(tmp.p.getExtraAmount)
      let gain = new Decimal(10).pow(x.add(1e-10).pow(0.5).sub(50))
      if (player.p.breakLimit) gain = gain.root(tmp.p.getBreakLimitRoot)
      return gain
    },
    getResetGain(){
      let gain = tmp.p.getBaseResetGain
  
      if (hasAchievement("a",33)) gain = gain.mul(achievementEffect("a", 33))
      if (hasAchievement("a",35)) gain = gain.mul(2)
      if (hasUpgrade("p",25)) gain = gain.mul(upgradeEffect("p",25)[0])
      gain = gain.mul(buyableEffect("p",11))
      if (hasAchievement("a",44)) gain = gain.mul(achievementEffect("a", 44))
      if (hasAchievement("a",52)) gain = gain.mul(69)
      if (hasUpgrade("p",43)) gain = gain.mul(upgradeEffect("p",43))
      if (hasUpgrade("t",14)) gain = gain.mul(upgradeEffect("t",14))
      if (hasUpgrade("t",41)) gain = gain.mul(upgradeEffect("t",41)[0])
      if (hasUpgrade("t",45)) gain = gain.mul(upgradeEffect("t",45)[0])
      if (hasUpgrade("t",53)) gain = gain.mul(upgradeEffect("t",53))
      if (hasUpgrade("t",71)) gain = gain.mul(upgradeEffect("t",71)[1])
  
      if (hasAchievement("a",73)) gain = gain.pow(1.0308)
  
      if (gain.gte(tmp.p.getSoftcapStart)) gain = new Decimal(10).pow(gain.log(10).div(tmp.p.getSoftcapStart.log(10)).pow(tmp.p.getSoftcapStrength).mul(tmp.p.getSoftcapStart.log(10)))
      return gain.floor()
    },
    getSoftcapStart(){
      let start = new Decimal(10).pow(400)
      if (hasChallenge("p",62)) start = start.mul(challengeEffect("p",62)[0])
      if (!player.p.breakLimit){
        start = start.pow(0.05)
      }
      return start
    },
    getSoftcapStrength(){
      let strength = new Decimal(0.5)
      if (!player.p.breakLimit){
        strength = strength.pow(2)
      }
      return strength
    },
    passiveGeneration(){
      return 0
    },
    getNextAt(){
      return ""
    },
    prestigeButtonText(){
      return (!shiftDown ? "Reset for " + `<b>` + "+" + formatWhole(tmp.p.getResetGain) + `</b>` + " prestige points" + `<br>` + "(Shift click for more info)" :
      "Base Reset gain: " + (player.p.breakLimit ? `<b>` + format(tmp.p.getBaseResetGain.pow(tmp.p.getBreakLimitRoot)) + `</b>` + " → " : "") + `<b>` + format(tmp.p.getBaseResetGain) + `</b>`)
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
    effectSCStart(){
      let start = new Decimal(Number.MAX_VALUE)
      if (hasUpgrade("t",62)) start = start.mul(Number.MAX_VALUE)
      return start
    },
    effectExp(){
      if (inChallenge("p",32)) return new Decimal(0)
      let exp = new Decimal(1)
      if (hasUpgrade("p",23)) exp = exp.mul(1.5)
      if (hasChallenge("p",32)) exp = exp.mul(1.6)
      exp = exp.mul(buyableEffect("t",23).add(1))
      return exp
    },
    effect(){
      let eff = player.p.points.add(1)
      eff = eff.pow(tmp.p.effectExp)
  
      if (eff.gte(tmp.p.effectSCStart)) eff = new Decimal(10).pow(eff.log(10).div(new Decimal(tmp.p.effectSCStart).log(10)).pow(0.75).mul(new Decimal(tmp.p.effectSCStart).log(10)))
      return eff
    },
    effectDescription(){
      return " which multiply h0nde power gain by " + (shiftDown ? "(x+1)" + `<sup>` + format(tmp.p.effectExp, 3) + `</sup>` + ", softcap at " + format(tmp.p.effectSCStart) + "x" : format(tmp.p.effect) + " (Shift click for more info)")
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
            return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula." + `<br>` + "(Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
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
            return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula." + `<br>` + "(Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
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
            return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula." + `<br>` + "(Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
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
            return "" + format(tmp.p.getExtraAmount) + " free Generator buyable level has been added into PP gain formula." + `<br>` + "(Total: " + format(getBuyableAmount("h",11).add(tmp.p.getExtraAmount)) + ")"}
          ],
          "blank",
          ["display-text", function(){
            return player.t.milestones.length >= 12 ? "You unlocked all Challenges" : "Next Challenge unlock at " + (player.p.unlockedChallenges>=7 ? "Twitter Milestone " + formatWhole(Math.max(player.t.milestones.length+1,8)) : format(challreq[player.p.unlockedChallenges+1]) + " h0nde powers.")
          }],
          ["clickable",21],
          function(){
            return player.p.onlyShowC12 ? ["challenge",62] : "challenges"
          },
          
          "blank",
          ["display-text", function(){
            return (hasMilestone("t", 12) ? "For every Exponential Powerless completion:" + `<br>` + "PP gain softcap starts " + format(tmp.p.challenges[62].rewardBase1) + "x later (based on h0nde discord accounts)" + `<br>` + "Increase Booster buyable base exponent by " + format(tmp.p.challenges[62].rewardBase2,3) + " (based on twitter power)" + `<br>` + "Increase twitter power exponent by " + format(tmp.p.challenges[62].rewardBase3,3) + " (Based on prestige points)" : "")
          }],
          "blank",
          ["display-text", function(){
            return (hasMilestone("t", 12) ? "Your Exponential Powerless completion are:" + `<br>Make PP gain softcap starts ` + format(challengeEffect("p",62)[0]) + "x later" + `<br>Raise Boosters buyable base by ` + format(challengeEffect("p",62)[1].add(1), 3) + `<br>Increase twitter power exponent by ` + format(challengeEffect("p",62)[2], 3) : "")
          }],
          "blank",
          "blank",
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
        effectDescription(){return "buying a h0nde buyable costs nothing, add 20% of free Generator buyable level into prestige points gain formula, multiply the amount of second row prestige upgrades bought plus one. (max 100%)"},
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
          return (!shiftDown ? "Require:" + `<br>` + format(player.h.points) + "/" + format(1e107) + " h0nde power" + `<br>` + format(player.p.total) + "/" + format(5e9) + " total PP" + `<br>` + "(Shift click for more info)" :
          "Base PP gain is ^" + format(tmp.p.getBreakLimitRoot.pow(-1), 3) + " when limit is broken" + `<br>` + "softcap start at " + format(tmp.p.getSoftcapStart) + " PP, with a softcap of exponent ^" + format(tmp.p.getSoftcapStrength))
        },
        tooltip(){
          return "When you break the limit, you can buy Generator buyable as many as possible and PP gain softcap starts much later and much weaker, but base PP gain is reduced, and will did a forced prestige reset when you break it or fix it."
        },
        canClick(){return player.h.points.gte(1e107) && player.p.total.gte(5e9)},
        onClick(){
          doReset("p",true)
          player.p.breakLimit = Boolean(1-player.p.breakLimit)
        },
        unlocked(){return true},
        style: {'height':'200px', 'width':'200px'},
      },
      21: {
        title() {return "Show All Challenges: "},
        display(){
          return !player.p.onlyShowC12
        },
        canClick(){return true},
        onClick(){
          player.p.onlyShowC12 = Boolean(1-player.p.onlyShowC12)
        },
        unlocked(){return tmp.p.challenges[62].unlocked},
        style: {'height':'150px', 'width':'150px'},
      },
    },
    upgrades: {
      11: {
        title: "Constant boost",
        description(){return "You gain " + format(upgradeEffect("p",11)) + "x more h0nde power."},
        cost(){return new Decimal(3).mul(new Decimal(2).pow(getBoughtUpgradesRow("p", 1)))},
        effect(){
          let eff = new Decimal(500)
          if (hasUpgrade("t",55)) eff = eff.pow(110)
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
          if (hasChallenge("p", 51)) eff = eff.pow(9)
          return eff
        },
        effectDisplay(){
          return shiftDown ? (hasChallenge("p", 51) ? "(1e9^0.5)^" : "(10^0.5)^") + "x^0.5" : format(upgradeEffect("p",12)) + "x"
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
          return shiftDown ? "(2^0.5)^x^2" : format(upgradeEffect("p",15)) + "x"
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
        effectExp(){
          let exp = [new Decimal(1),new Decimal(1)]
          if (hasChallenge("p",41)) exp[0] = exp[0].add(2)
          if (hasChallenge("p",41)) exp[1] = exp[1].add(2)
          if (hasMilestone("t", 8)) exp[1] = exp[1].add(tmp.t.milestones[8].effect)
          return exp
        },
        effect(){
          let exp = tmp.p.upgrades[25].effectExp
          let eff = [player.p.points.add(10).log(10).pow(exp[0]), player.h.points.add(10).log(10).pow(exp[1])]
          return eff
        },
        effectDisplay(){
          return (shiftDown ? "log10(x+10)^" + format(tmp.p.upgrades[25].effectExp[0]) : format(upgradeEffect("p",25)[0])) + "x PP gain, " + (shiftDown ? "log10(x+10)^" + format(tmp.p.upgrades[25].effectExp[1]) : format(upgradeEffect("p",25)[1])) + "x power gain"
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
          return shiftDown ? "log10(x)/100, softcap at 0.2" : "+" + format(upgradeEffect("p",32),3)
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
          return shiftDown ? "x+1" : format(upgradeEffect("p",43)) + "x"
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
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.p.buyables[11].costBase, 2, true) + "^" + format(tmp.p.buyables[11].costScaling, 3) + "^x" : "Cost: " + format(tmp.p.buyables[11].cost) + " prestige points") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("p", 11)) + (tmp.p.buyables[11].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.p.buyables[11].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
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
          if (hasMilestone("t", 7)) free = free.add(tmp.t.milestones[7].effect)
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
          x = x.add(buyableEffect("t",22))
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
      12: {
        title: "Super Power Boost",
        display(){
          return "Increase h0nde super power boost exp by " + format(tmp.p.buyables[12].effectBase) + " and multiply super power boost softcap start by " + format(tmp.p.buyables[12].effectBase2) +"." + `<br>` +
          "Currently: +" + format(buyableEffect("p",12)[0]) + ", " + format(buyableEffect("p",12)[1]) + "x" + `<br>` + `<br>` + 
          (shiftDown ? "Cost Formula:" + `<br>` + format(tmp.p.buyables[12].costBase, 2, true) + "^" + format(tmp.p.buyables[12].costScaling, 3) + "^x" : "Cost: " + format(tmp.p.buyables[12].cost) + " prestige points") + `<br>` +
          "Level " + formatWhole(getBuyableAmount("p", 12)) + (tmp.p.buyables[12].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.p.buyables[12].freeLevel)) + (!shiftDown ? `<br>` + "(Shift click for more info)" : "")
        },
        costBase(){
          let base = new Decimal("1e500")
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(1.2)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.p.buyables[12].costBase
          let r = tmp.p.buyables[12].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          return free
        },
        totalLevel(){
          return getBuyableAmount("p", 12).add(tmp.p.buyables[12].freeLevel)
        },
        effectBase(){
          let x = new Decimal(20)
          return x
        },
        effectBase2(){
          let x = new Decimal(1e200)
          return x
        },
        effect(){
          let x = [tmp.p.buyables[12].effectBase.mul(tmp.p.buyables[12].totalLevel),tmp.p.buyables[12].effectBase2.pow(tmp.p.buyables[12].totalLevel)]
          return x
        },
        canAfford(){
          return player.p.points.gte(tmp.p.buyables[12].cost)
        },
        buy(){
          let cost = tmp.p.buyables[12].cost
          if (player.p.points.lt(cost)) return
          addBuyables("p", 12, new Decimal(1))
          if (true) player.p.points = player.p.points.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.p.buyables[12].purchaseLimit.sub(getBuyableAmount("p", 12))
          let bulk
          let a = tmp.p.buyables[12].cost.log(10)
          let r = tmp.p.buyables[12].costScaling
          let x = player.p.points.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("p", 12, bulk)
          if (true) player.p.points = player.p.points.sub(new Decimal(10).pow(cost))
        },
        unlocked(){ return hasMilestone("t",14)},
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
          if (inChallenge("p",51)) return new Decimal(0)
          let eff = player.p.points.max(1).log(10).mul(25).floor()
          return eff.min(10000)
        },
        rewardDisplay(){return "+" + formatWhole(challengeEffect("p",12)) + (challengeEffect("p",12).gte(10000) ? " (hardcapped)" : "")},
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
        rewardDescription: "Self Synergy effect exponent are increased by 2",
        rewardEffect(){
          let eff = new Decimal(3)
          return eff
        },
        goal: new Decimal(5),
        countsAs: [11,12,21,22,31,32],
        canComplete: function() {return tmp.h.buyables[11].totalLevel.gte(tmp.p.challenges[41].goal)},
        unlocked(){return player.p.unlockedChallenges >= 7}
      },
      42: {
        name: "Super Powerless",
        challengeDescription: "h0nde super power and twitter power exponent are always 0, Powerless is applied.",
        goalDescription(){return format(tmp.p.challenges[42].goal) + " h0nde power"},
        rewardDescription: "h0nde super power exponent and twitter power exponent boosts each other",
        rewardEffect(){
          let eff = [tmp.t.clickables["power"].exponent, tmp.h.superPowerEffExp.pow(0.5).div(10)]
          if (eff[0].gte(10)) eff[0] = eff[0].div(10).pow(0.5).mul(10)
          if (eff[1].gte(1)) eff[1] = eff[1].pow(0.5)
          if (hasUpgrade("t",73)) eff[1] = eff[1].mul(5)
          return eff
        },
        rewardDisplay(){return "+" + format(challengeEffect("p",42)[0]) + " h0nde super power exponent, +" + format(challengeEffect("p",42)[1],3) + " twitter power exponent"},
        goal: new Decimal("1e320"),
        countsAs: [11],
        canComplete: function() {return player.h.points.gte(tmp.p.challenges[42].goal)},
        unlocked(){return hasMilestone("t", 8)}
      },
      51: {
        name: "Superscaled",
        challengeDescription(){return "<span style='font-size:10px'>Super Powerless is applied (not include Powerless), All h0nde buyable cost and cost scaling is raised by 99, cost divider and Scaled reward have no effect, but Generator buyable multi boost is raised by 9 and Twitter Upgrade 52 is applied at 9.99e99 twitter power.</span>"},
        goalDescription(){return format(tmp.p.challenges[51].goal) + " h0nde power"},
        rewardDescription: "An Alt accounts reward and h0nde boost effect is raised by 9, add 0.9 to twitter power exponent",
        rewardEffect(){
          let eff = new Decimal(1)
          return eff
        },
        goal: new Decimal("1e1065"),
        countsAs: [42],
        canComplete: function() {return player.h.points.gte(tmp.p.challenges[51].goal)},
        unlocked(){return hasMilestone("t", 9)}
      },
      52: {
        name: "Logged",
        challengeDescription(){return "h0nde power gain past 1.00e100 is log10(x)^50. (eg: " + format(player.h.points) + " → " + format(player.h.points.gte(1e100) ? player.h.points.log(10).pow(50) : player.h.points) + ")"},
        goalDescription(){return format(tmp.p.challenges[52].goal) + " h0nde power"},
        rewardDescription: "Base twitter power exponent is squared",
        rewardEffect(){
          let eff = new Decimal(2)
          return eff
        },
        goal: new Decimal(1e193),
        canComplete: function() {return player.h.points.gte(tmp.p.challenges[52].goal)},
        unlocked(){return hasMilestone("t", 10)}
      },
      61: {
        name: "All in one II",
        challengeDescription: "Powerless, Scaled, Super Powerless, Superscaled and Logged at once.",
        goalDescription(){return formatWhole(tmp.p.challenges[61].goal) + " Generator buyable level"},
        rewardDescription: "Exponentiator softcap starts 1 level later, h0nde power gain exp affect all producer speed",
        rewardEffect(){
          let eff = tmp.h.buyables[11].productionExp.max(1)
          return eff
        },
        rewardDisplay(){return "^" + format(challengeEffect("p",61), 3)},
        countsAs: [11,12,42,51,52],
        goal: new Decimal(3),
        canComplete: function() {return tmp.h.buyables[11].totalLevel.gte(tmp.p.challenges[61].goal)},
        unlocked(){return hasMilestone("t", 11)}
      },
      62: {
        name: "Exponential Powerless",
        challengeDescription(){return "h0nde power gain exponent is square rooted. (eg: " + format(player.h.points) + " → " + format(new Decimal(10).pow(player.h.points.max(1).log(10).pow(0.5))) + ")"},
        goalDescription(){return formatWhole(new Decimal(10).pow(tmp.p.challenges[62].goal.max(1).log(10).mul(tmp.p.challenges[62].goalScaling.pow(tmp.p.challenges[62].completions)))) + " h0nde power (best: " + format(player.p.bestC12) + ", " + format(tmp.p.challenges[62].completions, 0) + " completions)"},
        rewardDescription(){return "See below, because they are too many"},
        rewardBase1(){
          let base = player.points.add(1)
          return base
        },
        rewardBase2(){
          let base = player.t.power.max(1).log(10).max(1).log(10).div(10)
          return base
        },
        rewardBase3(){
          let base = player.p.points.max(1).log(10).div(1000)
          if (base.gte(1)) base = base.log(10).add(1)
          return base
        },
        rewardEffect(){
          let x = tmp.p.challenges[62].completions
          let eff = [tmp.p.challenges[62].rewardBase1.pow(x),
          tmp.p.challenges[62].rewardBase2.mul(x),
          tmp.p.challenges[62].rewardBase3.mul(x)]
          return eff
        },
        goal(){
          let goal = new Decimal(6.66e66)
          return goal
        },
        goalScaling(){
          let scaling = new Decimal(1.24)
          return scaling
        },
        canComplete: function() {return player.h.points.gte(tmp.p.challenges[62].goal)},
        completions(){
          let best = player.p.bestC12
          let goal = tmp.p.challenges[62].goal
          let scaling = tmp.p.challenges[62].goalScaling
          if (best.lt(goal)) return new Decimal(0)
          let x = best.log(goal).log(scaling).add(1)
          if (true) x = x.floor()
          return x
        },
        onExit(){
          player.p.bestC12 = player.p.bestC12.max(player.h.points)
        },
        unlocked(){return hasMilestone("t", 12)},
        style: {'height':'300px'},
      },
    },
  })
  
const challreq = [ // h0nde power, only first 7
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
  for (let i = 1; i <= 7; i++){
    if (x.gte(challreq[i]) && challreq[i] !== undefined) {
      output++
    }
  }
  return output
}