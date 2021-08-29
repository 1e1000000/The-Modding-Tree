// TWITTER LAYER

addLayer("t", {
    name: "twitter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
        points: new Decimal(0),
      power: new Decimal(0),
      power2: new Decimal(0),
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
      if (tmp.t.clickables["energy"].unlocked) player.t.power2 = getPolyGrow(player.t.power2, tmp.t.clickables["power"].exponent, tmp.t.clickables["energy"].speed, diff)
      player.t.power = Decimal.pow(10,getInfSqrt(player.t.power2.max(1).log(10),tmp.t.clickables.power.logSoftcapStart))
      if (tmp.t.clickables["comment"].unlocked) player.t.energy = player.t.energy.add(tmp.t.clickables["comment"].speed.mul(diff))
      if (tmp.t.clickables["like"].unlocked) player.t.comment = player.t.comment.add(tmp.t.clickables["like"].speed.mul(diff))
      if (tmp.t.clickables["retweet"].unlocked) player.t.like = player.t.like.add(tmp.t.clickables["retweet"].speed.mul(diff))
      if (tmp.t.clickables["following"].unlocked) player.t.retweet = player.t.retweet.add(tmp.t.clickables["following"].speed.mul(diff))
      if (tmp.t.clickables["follower"].unlocked) player.t.following = player.t.following.add(tmp.t.clickables["follower"].speed.mul(diff))
    },
    effect(){
      let eff = [new Decimal(2).pow(player.t.points).sub(1), player.t.points.div(10)]
      if (eff[1].gte(1)) eff[1] = eff[1].pow(0.5)
      return eff
    },
    getSuperPowSpeed(){
      let speed = tmp.t.effect[0]
      if (hasUpgrade("t",11)) speed = speed.mul(upgradeEffect("t",11))
      if (hasUpgrade("t",15)) speed = speed.mul(upgradeEffect("t",15))
      if (hasMilestone("t",3)) speed = speed.mul(tmp.t.milestones[3].effect)
      if (hasUpgrade("t",21)) speed = speed.mul(upgradeEffect("t",21))
      speed = speed.mul(buyableEffect("t",21))
      if (hasUpgrade("t",73)) speed = speed.mul(upgradeEffect("t",73))
      return speed
    },
    getAllProducerSpeed(){
      let speed = new Decimal(1)
      if (hasAchievement("a",64)) speed = speed.mul(achievementEffect("a",64))
      speed = speed.mul(buyableEffect("t",13))
      if (hasAchievement("a",65)) speed = speed.mul(achievementEffect("a",65))
      if (hasUpgrade("t",51)) speed = speed.mul(upgradeEffect("t",51))
      if (hasUpgrade("t",61)) speed = speed.mul(upgradeEffect("t",61))
      if (hasUpgrade("t",64)) speed = speed.mul(upgradeEffect("t",64))
      if (hasUpgrade("t",74)) speed = speed.mul(upgradeEffect("t",74))
      
      if (hasChallenge("p",61)) speed = speed.pow(challengeEffect("p",61))
      return speed
    },
    producersProduct(){
      let a = player.t.energy.max(1)
      let b = player.t.comment.max(1)
      let c = player.t.like.max(1)
      let d = player.t.retweet.max(1)
      let e = player.t.following.max(1)
      let f = player.t.follower.max(1)
      return Decimal.mul(a,Decimal.mul(b,Decimal.mul(c,Decimal.mul(d,Decimal.mul(e,f)))))
    },
    effectDescription(){
      return " which produce " + format(tmp.t.effect[0]) + " h0nde super powers per second and increase sqrt multi by " + format(tmp.t.effect[1])
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["h"],
    layerShown(){return hasMilestone("p",8) || player.t.unlocked},
    prestigeButtonText(){
      return "Reset for " + `<b>` + "+" + formatWhole(tmp.t.resetGain) + `</b>` + " h0nde twitter accounts" + `<br><br>` +
      (tmp.t.canBuyMax ? "Next: " : "Req: ") + format(player.points, 3) + " / " + format(tmp.t.nextAt, 3) + " h0nde discord accounts"
    },
    canBuyMax(){
      return false
    },
    resetsNothing(){
      return false
    },
    tabFormat: {
      "Milestones": {
        content: [
          "main-display",
          "prestige-button",
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
          ["display-text",
            function(){
              return "You spent " + formatTime(Math.min(player.t.resetTime, player.p.resetTime)) + " in row 2 resets"
            }
          ],
          "blank",
          ["display-text",
            function(){
              return "You have " + format(player.t.power) + " twitter power" + `<sup>` + format(tmp.t.clickables["power"].exponent, 3) + `</sup>` + " (+" + format(tmp.t.clickables["energy"].speed) + "/s before exp)"
            }
          ],
          ["display-text",
            function(){
              return (player.t.power.gte(new Decimal(10).pow(tmp.t.clickables.power.logSoftcapStart)) ? `<span style='color:red'>` + "Due to Excess power storage, for every " + format(tmp.t.clickables.power.logSoftcapStart) + "x OoM of twitter power, the twitter power will be exponential square rooted" + `</span>` : "")
            }
          ],
          "blank",
          ["display-text",
            function(){
              return "The twitter power production is based on your PP and h0nde twitter accounts, and exponent is based on h0nde powers." + `<br>` + "The twitter power and all producers are resets when you did a row 2 prestige."
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
              return (tmp.t.clickables["follower"].unlocked ? "You have " + format(player.t.follower, 3, true) + " follower" : "")
            }
          ],
          "blank",
          ["display-text",
            function(){
              return "All producers speed: " + format(tmp.t.getAllProducerSpeed) + "x"
            }
          ],
          ["display-text",
            function(){
              return "Products of All producers: " + format(tmp.t.producersProduct)
            }
          ],
          "blank","buyables",
          "blank",
          ["display-text", function(){
            return !hasMilestone("t",13) ? "" : "Note: The 7th row of Twitter Upgrades require at least 1 Generator Enhancer."
          }],
          "upgrades"
        ],
        unlocked(){return hasMilestone("t",1)},
      },
    },
    doReset(resettingLayer) {
      let keep = [];
      player.t.power2 = new Decimal(0)
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
        effectDescription(){return "Unlock a twitter buyable every 2nd milestones until 12th, h0nde discord accounts & h0nde twitter accounts boost h0nde powers gain (" + format(tmp.t.milestones[2].effect) + "x)"},
        effect(){
          let eff = player.t.points.max(1).pow(player.points)
          if (hasUpgrade("t",35)) eff = eff.pow(2)
          return eff
        },
        unlocked(){return hasMilestone("t",1)},
        done(){return player.t.points.gte(2) && player.p.points.gte(1e102)},
      },
      3: {
        requirementDescription: "3 h0nde twitter accounts & 1e114 prestige points",
        effectDescription(){return "Your comment produce energy, unlock a row of twitter upgrade every 2nd milestones until 13th, h0nde discord accounts boost h0nde super power production (" + format(tmp.t.milestones[3].effect) + "x)"},
        effect(){return player.points.add(1)},
        unlocked(){return hasMilestone("t",2)},
        done(){return player.t.points.gte(3) && player.p.points.gte(1e114)},
      },
      4: {
        requirementDescription: "4 h0nde twitter accounts & 1e126 prestige points",
        effectDescription(){return "Each h0nde twitter accounts increase twitter power exponent by 0.1 (+" + format(tmp.t.milestones[4].effect) + ")"},
        effect(){return player.t.points.div(10)},
        unlocked(){return hasMilestone("t",3)},
        done(){return player.t.points.gte(4) && player.p.points.gte(1e126)},
      },
      5: {
        requirementDescription: "5 h0nde twitter accounts & 1e141 prestige points",
        effectDescription(){return "Your like produce comment, each h0nde twitter accounts increase h0nde super power boost exponent by 1 (+" + format(tmp.t.milestones[5].effect) + ")"},
        effect(){return player.t.points},
        unlocked(){return hasMilestone("t",4)},
        done(){return player.t.points.gte(5) && player.p.points.gte(1e141)},
      },
      6: {
        requirementDescription: "6 h0nde twitter accounts & 1e156 prestige points",
        effectDescription(){return "Each h0nde twitter accounts increase Power Gain base by 1 (+" + format(tmp.t.milestones[6].effect) + ")"},
        effect(){return player.t.points},
        unlocked(){return hasMilestone("t",5)},
        done(){return player.t.points.gte(6) && player.p.points.gte(1e156)},
      },
      7: {
        requirementDescription: "7 h0nde twitter accounts & 1e176 prestige points",
        effectDescription(){return "Your retweet produce like, each h0nde twitter accounts add 2 into Prestige gain amount (+" + format(tmp.t.milestones[7].effect) + ")"},
        effect(){return player.t.points.mul(2)},
        unlocked(){return hasMilestone("t",6)},
        done(){return player.t.points.gte(7) && player.p.points.gte(1e176)},
      },
      8: {
        requirementDescription: "8 h0nde twitter accounts & 1e218 prestige points",
        effectDescription(){return "Unlock a Prestige Challenge every milestone until 12th, Increase Self Synergy second effect exponent by 1 for every h0nde power (+" + format(tmp.t.milestones[8].effect) + ")"},
        effect(){return player.t.points},
        unlocked(){return hasMilestone("t",7)},
        done(){return player.t.points.gte(8) && player.p.points.gte(1e218)},
      },
      9: {
        requirementDescription: "9 h0nde twitter accounts & 1e263 prestige points",
        effectDescription(){return "Your following produce retweet, h0nde discord accounts boost comment and like gain (" + format(tmp.t.milestones[9].effect) + "x)"},
        effect(){return player.points.add(1)},
        unlocked(){return hasMilestone("t",8)},
        done(){return player.t.points.gte(9) && player.p.points.gte(1e263)},
      },
      10: {
        requirementDescription: "10 h0nde twitter accounts & 1e321 prestige points",
        effectDescription(){return "Reduce break limit nerf by 0.002 for every h0nde twitter accounts^2 (-" + format(tmp.t.milestones[10].effect) + ", cap -1.80)"},
        effect(){return player.t.points.pow(2).div(500).min(1.8)},
        unlocked(){return hasMilestone("t",9)},
        done(){return player.t.points.gte(10) && player.p.points.gte("1e321")},
      },
      11: {
        requirementDescription: "11 h0nde twitter accounts & 1e370 prestige points",
        effectDescription(){return "Your follower produce following, each h0nde twitter accounts increase h0nde power gain exponent by 0.001 (+" + format(tmp.t.milestones[11].effect) + ")"},
        effect(){return player.t.points.div(1000)},
        unlocked(){return hasMilestone("t",10)},
        done(){return player.t.points.gte(11) && player.p.points.gte("1e370")},
      },
      12: {
        requirementDescription: "12 h0nde twitter accounts & 2.5e416 prestige points",
        effectDescription(){return "Each h0nde twitter accounts increase Generator bought multi boost by 0.01 (+" + format(tmp.t.milestones[12].effect) + ")"},
        effect(){return player.t.points.div(100)},
        unlocked(){return hasMilestone("t",11)},
        done(){return player.t.points.gte(12) && player.p.points.gte("2.5e416")},
      },
      13: {
        requirementDescription: "13 h0nde twitter accounts & 1e447 prestige points",
        effectDescription(){return "Unlock a h0nde buyable, reduce Generator buyable cost scaling by 0.002"},
        unlocked(){return hasMilestone("t",12)},
        done(){return player.t.points.gte(13) && player.p.points.gte("1e447")},
      },
      14: {
        requirementDescription: "14 h0nde twitter accounts & 1e487 prestige points",
        effectDescription(){return "Unlock a new row of h0nde upgrade and a Prestige buyable, Cheaper effect is raised by 11"},
        unlocked(){return hasMilestone("t",13)},
        done(){return player.t.points.gte(14) && player.p.points.gte("1e487")},
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
          if (inChallenge("p",42)) return new Decimal(0)
          let exp = new Decimal(1)
          if (player.h.points.gte("1e1000")) exp = player.h.points.log(10).log(10).sub(2)
          if (hasChallenge("p",52)) exp = exp.pow(2)
  
          if (hasUpgrade("t",13)) exp = exp.add(upgradeEffect("t",13))
          if (hasMilestone("t", 4)) exp = exp.add(tmp.t.milestones[4].effect)
          exp = exp.add(buyableEffect("t",12))
          if (hasUpgrade("t",24)) exp = exp.add(upgradeEffect("t",24))
          if (hasChallenge("p",42)) exp = exp.add(challengeEffect("p",42)[1])
          if (hasChallenge("p",51)) exp = exp.add(0.9)
          if (hasAchievement("a",74)) exp = exp.add(1)
          if (hasChallenge("p",62)) exp = exp.add(challengeEffect("p",62)[2])
          if (hasUpgrade("t",75)) exp = exp.add(3.5)
  
          if (hasUpgrade("t",43)) exp = exp.mul(1.1)
          if (hasAchievement("a",75)) exp = exp.mul(player.p.activeChallenge ? 1.03 : 1.15)
          return exp
        },
        logSoftcapStart(){ // 10^x
          let start = new Decimal(10000)
          return start
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
          if (hasUpgrade("t",45)) m = m.mul(upgradeEffect("t",45)[1])
          if (hasAchievement("a",73)) m = m.mul(308)
          if (hasUpgrade("t",71)) m = m.mul(upgradeEffect("t",71)[0])
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
          if (hasUpgrade("t",41)) m = m.mul(upgradeEffect("t",41)[1])
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
          if (hasUpgrade("t",41)) m = m.mul(upgradeEffect("t",41)[1])
          if (hasMilestone("t", 9)) m = m.mul(tmp.t.milestones[9].effect)
          return m
        },
        speed(){
          let speed = player.t.like
          speed = speed.mul(tmp.t.clickables["like"].multi)
          return speed
        },
      },
      retweet: {
        unlocked(){return hasMilestone("t", 7)},
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        multi(){
          let m = new Decimal(1)
          m = m.mul(tmp.t.getAllProducerSpeed)
          if (hasMilestone("t", 9)) m = m.mul(tmp.t.milestones[9].effect)
          return m
        },
        speed(){
          let speed = player.t.retweet
          speed = speed.mul(tmp.t.clickables["retweet"].multi)
          return speed
        },
      },
      following: {
        unlocked(){return hasMilestone("t", 9)},
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
        unlocked(){return hasMilestone("t", 11)},
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
          let eff = tmp.p.buyables[11].totalLevel.mul(0.01)
          return eff
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
        description(){return "Reduce all row 2 h0nde buyables cost scaling by 0.02, add 0.003 into Exponentiator base"},
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
        title: "Twitter Self Synergy",
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
          if (eff.gte(Number.MAX_VALUE)) eff = new Decimal(10).pow(eff.log(10).div(new Decimal(Number.MAX_VALUE).log(10)).pow(0.75).mul(new Decimal(Number.MAX_VALUE).log(10)))
          if (eff.gte(Decimal.pow(10,4000))) eff = eff.log(10).mul(2.5).pow(1000)
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
      41: {
        title: "Prestige Energy",
        description(){return "You gain more Prestige Points based on Energy, and boost energy & comment gain based on PP"},
        cost(){return new Decimal(1e145)},
        effect(){
          let eff = [getInfSqrt(player.t.energy.add(1),1e10), player.p.points.add(10).log(10)]
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",41)[0]) + "x PP gain, " + format(upgradeEffect("t",41)[1]) + "x Energy and Comment gain"
        },
        unlocked(){
          return hasMilestone("t",7)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      42: {
        title: "Prestige Booster",
        description(){return "Prestige Points multiply Boosters base"},
        cost(){return new Decimal(1e175)},
        effect(){
          let eff = player.p.points.add(10).log(10)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",42)) + "x"
        },
        unlocked(){
          return hasMilestone("t",7)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      43: {
        title: "Power Exp^2",
        description(){return "Increase twitter power exp by 10%"},
        cost(){return new Decimal(1e196)},
        effect(){
          let eff = new Decimal(1.1)
          return eff
        },
        unlocked(){
          return hasMilestone("t",7)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      44: {
        title: "ExPower",
        description(){return "Exponentiator buyable effect adds to Power buyable base"},
        cost(){return new Decimal(1e221)},
        effect(){
          let eff = buyableEffect("h",23).div(1)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("t",44), 3)
        },
        unlocked(){
          return hasMilestone("t",7)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      45: {
        title: "InfinK",
        description(){return "For every " + format(Number.MAX_VALUE) + "x h0nde power, double PP gain and +100% base twitter power gain"},
        cost(){return new Decimal(1e300)},
        effect(){
          let x = player.h.points.add(1).log(Number.MAX_VALUE).floor()
          let eff = [new Decimal(2).pow(x), new Decimal(1).add(x)]
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",45)[0]) + "x PP gain, " + format(upgradeEffect("t",45)[1]) + "x base twitter power gain"
        },
        unlocked(){
          return hasMilestone("t",7)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      51: {
        title: "Beyond Softcapped",
        description(){return "Power buyable softcap starts 10 later, h0nde super power boost all producer speed"},
        cost(){return new Decimal("1e450")},
        effect(){
          let eff = getInfSqrt(player.h.points2,2)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",51)) + "x"
        },
        unlocked(){
          return hasMilestone("t",9)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      52: {
        title: "Beyond Generator",
        description(){return "Add Generator buyable multi boost based on twitter power"},
        cost(){return new Decimal("1e558")},
        effect(){
          if (inChallenge("p",51)) return new Decimal(9.99e99).add(1).log(10).add(1).log(10).div(10)
          let eff = player.t.power.add(1).log(10).add(1).log(10).div(10)
          if (eff.gte(1)) eff = eff.log(10).add(1)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("t",52), 3)
        },
        unlocked(){
          return hasMilestone("t",9)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      53: {
        title: "Booster Prestiger",
        description(){return "Booster buyable effect affect PP gain with reduced effect"},
        cost(){return new Decimal("1e720")},
        effect(){
          let eff = buyableEffect("h",22).max(1).pow(0.01)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",53)) + "x"
        },
        unlocked(){
          return hasMilestone("t",9)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      54: {
        title: "Power^2",
        description(){return "Increase Power Exp buyable base based on Power buyable effect, h0nde power gain ^1.1 in Logged after log effect"},
        cost(){return new Decimal("1e785")},
        effect(){
          let eff = buyableEffect("h",21).max(0).div(200)
          return eff
        },
        effectDisplay(){
          return "+" + format(upgradeEffect("t",54), 3)
        },
        unlocked(){
          return hasMilestone("t",9)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      55: {
        title: "Constant superboost",
        description(){return "Raise Constant boost effect by 110"},
        cost(){return new Decimal("1e1065")},
        effect(){
          let eff = new Decimal(110)
          return eff
        },
        unlocked(){
          return hasMilestone("t",9)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      61: {
        title: "MultiTwitter",
        description(){return "Multiplier buyable effect affect all producers speed with reduced effect"},
        cost(){return new Decimal("1e1235")},
        effect(){
          let eff = getInfSqrt(buyableEffect("h",12).max(1).pow(0.01),1000)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",61)) + "x"
        },
        unlocked(){
          return hasMilestone("t",11)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      62: {
        title: "Prestige Unsoftcapped",
        description(){return "Prestige Points effect softcap starts " + format(Number.MAX_VALUE) + "x later, h0nde power gain ^1.265 while in All in one II after log effect"},
        cost(){return new Decimal("1e1500")},
        effect(){
          let eff = new Decimal(Number.MAX_VALUE)
          return eff
        },
        unlocked(){
          return hasMilestone("t",11)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      63: {
        title: "Fastest Boost",
        description(){return "The require of Generator buyable multiplier boost is reduced by 8"},
        cost(){return new Decimal("1e1840")},
        effect(){
          let eff = new Decimal(Number.MAX_VALUE)
          return eff
        },
        unlocked(){
          return hasMilestone("t",11)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      64: {
        title: "Condenser",
        description(){return "Multiply all Producer speed based on twitter power"},
        cost(){return new Decimal("1e2150")},
        effect(){
          let eff = player.t.power.max(10).log(10)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",64)) + "x"
        },
        unlocked(){
          return hasMilestone("t",11)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      65: {
        title: "+Expo -Softcap",
        description(){return "Exponentiator softcap divider is 0.6 weaker, give 1 Free Exponentiator buyable"},
        cost(){return new Decimal("1e2930")},
        effect(){
          let eff = new Decimal(1)
          return eff
        },
        unlocked(){
          return hasMilestone("t",11)
        },
        canAfford(){
          return true
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      71: {
        title: "Prestige Twitter Synergy",
        description(){return "Prestige Gain and Power Gain boost each other"},
        cost(){return new Decimal("1e3370")},
        effect(){
          let eff = [buyableEffect("p",11).max(1).pow(0.2),buyableEffect("t",11).max(1).pow(0.5)]
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",71)[0]) + "x base twitter power gain, " + format(upgradeEffect("t",71)[1]) + "x prestige points gain"
        },
        unlocked(){
          return hasMilestone("t",13)
        },
        canAfford(){
          return getBuyableAmount("h",31).gte(1)
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      72: {
        title: "Raising a power",
        description(){return "Raise h0nde power gain by 1.05 (1.01 while in P Challenges)"},
        cost(){return new Decimal("1e3660")},
        effect(){
          let eff = new Decimal(1).add(player.p.activeChallenge ? 0.01 : 0.05)
          return eff
        },
        unlocked(){
          return hasMilestone("t",13)
        },
        canAfford(){
          return getBuyableAmount("h",31).gte(1)
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      73: {
        title: "Buffed boost",
        description(){return "Quintuple second Super powerless reward, Products of All producers boost h0nde super power gain"},
        cost(){return new Decimal("1e4900")},
        effect(){
          let eff = tmp.t.producersProduct.max(1).pow(0.01)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",73)) + "x"
        },
        unlocked(){
          return hasMilestone("t",13)
        },
        canAfford(){
          return getBuyableAmount("h",31).gte(1)
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      74: {
        title: "Producers Superboost",
        description(){return "Multiply all producer speed based on the Products of All producers"},
        cost(){return new Decimal("1e6115")},
        effect(){
          let eff = tmp.t.producersProduct.max(10).log(10).pow(2)
          return eff
        },
        effectDisplay(){
          return format(upgradeEffect("t",74)) + "x"
        },
        unlocked(){
          return hasMilestone("t",13)
        },
        canAfford(){
          return getBuyableAmount("h",31).gte(1)
        },
        currencyDisplayName: "twitter power",
        currencyInternalName: "power",
        currencyLayer: "t",
      },
      75: {
        title: "Hardcap+",
        description(){return "Increase slog2 h0nde power production hardcap by 0.0125 and twitter power exponent by 3.5, You need 15 h0nde twitter accounts to buy this upgrade"},
        cost(){return new Decimal("1e8580")},
        effect(){
          let eff = new Decimal(0)
          return eff
        },
        unlocked(){
          return hasMilestone("t",13)
        },
        canAfford(){
          return getBuyableAmount("h",31).gte(1) && player.t.points.gte(15)
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
          return "Increase twitter power exponent by " + format(tmp.t.buyables[12].effectBase, 3) + "." + `<br>` +
          "Currently: +" + format(buyableEffect("t",12), 3) + `<br>` + `<br>` + 
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
          if (hasUpgrade("t",54)) x = x.add(upgradeEffect("t",54))
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
          if (hasAchievement("a",72)) x = x.add(3.08)
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
      21: {
        title: "Super Power Speed",
        display(){
          return "Multiply h0nde super power gain by " + format(tmp.t.buyables[21].effectBase) + " (based on h0nde power)." + `<br>` +
          "Currently: " + format(buyableEffect("t",21)) + "x" + `<br>` + `<br>` + 
          "Cost: " + format(tmp.t.buyables[21].cost) + " twitter power" + `<br>` +
          "Level " + formatWhole(getBuyableAmount("t", 21)) + (tmp.t.buyables[21].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[21].freeLevel))
        },
        costBase(){
          let base = new Decimal(10)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(7)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.t.buyables[21].costBase
          let r = tmp.t.buyables[21].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          return free
        },
        totalLevel(){
          return getBuyableAmount("t", 21).add(tmp.t.buyables[21].freeLevel)
        },
        effectBase(){
          let x = player.h.points.add(10).log(10).root(2)
          return x
        },
        effect(){
          let x = tmp.t.buyables[21].effectBase.pow(tmp.t.buyables[21].totalLevel)
          return x
        },
        canAfford(){
          return player.t.power.gte(tmp.t.buyables[21].cost)
        },
        buy(){
          let cost = tmp.t.buyables[21].cost
          if (player.t.power.lt(cost)) return
          addBuyables("t", 21, new Decimal(1))
          if (true) player.t.power = player.t.power.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.t.buyables[21].purchaseLimit.sub(getBuyableAmount("t", 21))
          let bulk
          let a = tmp.t.buyables[21].cost.log(10)
          let r = tmp.t.buyables[21].costScaling
          let x = player.t.power.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("t", 21, bulk)
          if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
        },
        unlocked(){return hasMilestone("t",8)},
      },
      22: {
        title: "Prestige base",
        display(){
          return "Increase Prestige gain base by " + format(tmp.t.buyables[22].effectBase) + "." + `<br>` +
          "Currently: +" + format(buyableEffect("t",22)) + `<br>` + `<br>` + 
          "Cost: " + format(tmp.t.buyables[22].cost) + " twitter power" + `<br>` +
          "Level " + formatWhole(getBuyableAmount("t", 22)) + (tmp.t.buyables[22].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[22].freeLevel))
        },
        costBase(){
          let base = new Decimal(10)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(11)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.t.buyables[22].costBase
          let r = tmp.t.buyables[22].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          return free
        },
        totalLevel(){
          return getBuyableAmount("t", 22).add(tmp.t.buyables[22].freeLevel)
        },
        effectBase(){
          let x = new Decimal(0.5)
          return x
        },
        effect(){
          let x = tmp.t.buyables[22].effectBase.mul(tmp.t.buyables[22].totalLevel)
          return x
        },
        canAfford(){
          return player.t.power.gte(tmp.t.buyables[22].cost)
        },
        buy(){
          let cost = tmp.t.buyables[22].cost
          if (player.t.power.lt(cost)) return
          addBuyables("t", 22, new Decimal(1))
          if (true) player.t.power = player.t.power.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.t.buyables[22].purchaseLimit.sub(getBuyableAmount("t", 22))
          let bulk
          let a = tmp.t.buyables[22].cost.log(10)
          let r = tmp.t.buyables[22].costScaling
          let x = player.t.power.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("t", 22, bulk)
          if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
        },
        unlocked(){return hasMilestone("t",10)},
      },
      23: {
        title: "Prestige boost",
        display(){
          return "Increase Prestige effect exponent by " + format(tmp.t.buyables[23].effectBase) + " (multiplicative with each other)." + `<br>` +
          "Currently: +" + format(buyableEffect("t",23)) + `<br>` + `<br>` + 
          "Cost: " + format(tmp.t.buyables[23].cost) + " twitter power" + `<br>` +
          "Level " + formatWhole(getBuyableAmount("t", 23)) + (tmp.t.buyables[23].freeLevel.eq(0) ? "" : " + " + formatWhole(tmp.t.buyables[23].freeLevel))
        },
        costBase(){
          let base = new Decimal(10)
          return base 
        },
        costScaling(){ // exponent scaling
          let scaling = new Decimal(13)
          return scaling
        },
        cost(x=player[this.layer].buyables[this.id]){
          let a = tmp.t.buyables[23].costBase
          let r = tmp.t.buyables[23].costScaling
          return new Decimal(10).pow(a.log(10).mul(r.pow(x)))
        },
        freeLevel(){
          let free = new Decimal(0)
          return free
        },
        totalLevel(){
          return getBuyableAmount("t", 23).add(tmp.t.buyables[23].freeLevel)
        },
        effectBase(){
          let x = new Decimal(0.14)
          return x
        },
        effect(){
          let x = tmp.t.buyables[23].effectBase.mul(tmp.t.buyables[23].totalLevel)
          return x
        },
        canAfford(){
          return player.t.power.gte(tmp.t.buyables[23].cost)
        },
        buy(){
          let cost = tmp.t.buyables[23].cost
          if (player.t.power.lt(cost)) return
          addBuyables("t", 23, new Decimal(1))
          if (true) player.t.power = player.t.power.minus(cost)
        },
        buyMax(){
          let maxBulk = tmp.t.buyables[23].purchaseLimit.sub(getBuyableAmount("t", 23))
          let bulk
          let a = tmp.t.buyables[23].cost.log(10)
          let r = tmp.t.buyables[23].costScaling
          let x = player.t.power.max(1).log(10)
          if (x.lt(a)) return
          if (a.eq(0)) bulk = new Decimal(1)
          else bulk = x.div(a).log(r).add(1).floor()
          bulk = bulk.min(maxBulk)
          let cost = a.mul(r.pow(bulk.sub(1))) // log
          addBuyables("t", 23, bulk)
          if (true) player.t.power = player.t.power.sub(new Decimal(10).pow(cost))
        },
        unlocked(){return hasMilestone("t",12)},
      },
    },
  })