addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
        bestBoughtUpgs: 0,
    }},
    color(){return player.fun.crimsonnodes ? "crimson" : "#31aeb0"},
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource(){return (player.fun.h0ndepoints ? "prestiged h0nde" : "prestige points")}, // Name of prestige currency
    baseResource(){return (player.fun.h0ndepoints ? "h0nde accounts" : "points")}, // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canReset(){
      return player.points.gte(5) && !(hasAchievement("a", 31) && hasAchievement("a", 24))
    },
    exponent(){
      let exp = new Decimal(0.25)
      if (hasUpgrade("p", 44)) exp = exp.add(upgradeEffect("p", 44))
      if (hasChallenge("q", 31)) exp = exp.add(challengeEffect("q", 31)[0])
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
        if (hasChallenge("q", 22)) mult = mult.mul(challengeEffect("q", 22)[0])
        if (hasUpgrade("sp", 12)) mult = mult.mul(upgradeEffect("sp", 12))
        if (hasUpgrade("sp", 13)) mult = mult.mul(upgradeEffect("sp", 13))
        if (hasUpgrade("sp", 14)) mult = mult.mul(upgradeEffect("sp", 14))

        if (inChallenge("q", 31)) mult = mult.mul(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge("q", 32)) exp = exp.mul(0.1)
        if (maxedChallenge("q", 22)) exp = exp.mul(challengeEffect("q", 22)[1])
        return exp
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
    passiveGeneration(){return (hasAchievement("a", 24) ? 0.01 : 0) * (hasAchievement("a", 31) ? 100 : 1)},
    doReset(resettingLayer) {
			let keep = ["bestBoughtUpgs"];
      if (hasAchievement("a", 31) && (resettingLayer=="i" || resettingLayer=="sp")) keep.push("upgrades")
      if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    update(diff){
        player.p.bestBoughtUpgs = Math.max(player.p.bestBoughtUpgs, player.p.upgrades.length)
    },
    tabFormat:[
      "main-display",
      "blank",
      function() {if (!(hasAchievement("a", 31) && hasAchievement("a", 24))) return "prestige-button"},
      "resource-display",
      "blank",
      ["bar", "progressBar"],
      "blank",
      "upgrades"
    ],
    upgrades: {
        11: {
          title: "(Normal-1) Jacorb",
          description: "The one who make The Prestige Tree. Begin the points generation",
          cost(){
            let cost = new Decimal(1)
            return cost
          },
        },
        12: {
          title: "(Normal-2) Acamaeda",
          description(){
            return "The one who make The Modding Tree. Multiply points gain by " + format(tmp.p.upgrades[12].effectBase) + " for every prestige upgrade bought"
          },
          cost(){
            let cost = new Decimal(2)
            return cost
          },
          effectBase(){
            let base = new Decimal(2)
            if (hasUpgrade("p", 31)) base = base.add(upgradeEffect("p", 31))
            if (hasUpgrade("p", 55)) base = base.add(upgradeEffect("p", 55))
            if (hasUpgrade("p", 72)) base = base.pow(upgradeEffect("p", 72))
            if (hasUpgrade("sp", 34)) base = base.pow(upgradeEffect("sp", 34))
            return base
          },
          effect(){
            let x = new Decimal(player.p.upgrades.length)
            if (maxedChallenge("q", 11)) x = x.pow(challengeEffect("q", 11)[1])
            let y = maxedChallenge("q", 11) ? new Decimal(0) : new Decimal(10)
            if (x.gte(y)) x = y.add(x.sub(y).mul(challengeEffect("q", 11)[0]))
            if (inChallenge("q", 11)) x = new Decimal(0)
            let eff = tmp.p.upgrades[12].effectBase.pow(x)
            if (eff.gte(tmp.p.upgrades[12].effectSCStart)) eff = new Decimal(10).pow(new Decimal(tmp.p.upgrades[12].effectSCStart.log(10)).mul(eff.log(10).div(tmp.p.upgrades[12].effectSCStart.log(10)).pow(0.5)))
            return eff
          },
          effectSCStart(){
            let sc = new Decimal(1e100)
            if (hasUpgrade("p", 54)) sc = sc.mul(upgradeEffect("p", 54))
            if (hasUpgrade("p", 73)) sc = sc.pow(upgradeEffect("p", 73))
            if (hasUpgrade("sp", 34)) sc = sc.pow(upgradeEffect("sp", 34))
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 12)) + "x" + (upgradeEffect("p", 12).gte(tmp.p.upgrades[12].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 11)},
          tooltip(){return "Effect softcap start: " + format(tmp.p.upgrades[12].effectSCStart) + "x"},
        },
        13: {
          title: "(Normal-3) thefinaluptake",
          description(){
            return "The first user to create TMT fork. and maker of The Burning Tree, multiply points gain by log2(points+2)"
          },
          cost(){
            let cost = new Decimal(10)
            return cost
          },
          effect(){
            let eff = player.points.add(2).log(2)
            if (hasUpgrade("p", 24)) eff = eff.pow(upgradeEffect("p", 24))
            if (hasUpgrade("p", 42)) eff = eff.pow(upgradeEffect("p", 42))
            if (hasUpgrade("p", 81)) eff = eff.pow(upgradeEffect("p", 81))
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 13)) + "x"},
          unlocked(){return hasUpgrade("p", 12)},
        },
        14: {
          title: "(Normal-4) Menohe",
          description(){
            return "Not an actual prestige tree. multiply points gain by sqrt(PP+1)"
          },
          cost(){
            let cost = new Decimal(50)
            return cost
          },
          effect(){
            let eff = player.p.points.add(1).pow(0.5)
            if (eff.gte(tmp.p.upgrades[14].effectSCStart)) eff = new Decimal(10).pow(tmp.p.upgrades[14].effectSCStart.log(10).mul(eff.log(10).div(tmp.p.upgrades[14].effectSCStart.log(10)).pow(0.5)))
            return eff
          },
          effectSCStart(){
            let sc = new Decimal("1e5000")
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 14)) + "x" + (upgradeEffect("p", 14).gte(tmp.p.upgrades[14].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 13)},
          tooltip(){return "Effect softcap start: " + format(tmp.p.upgrades[14].effectSCStart) + "x"},
        },
        15: {
          title: "(Normal-5) Katakana1",
          description(){
            return "The broken game... +" + format(tmp.p.upgrades[15].effectBase.mul(100)) + "% PP gain for every prestige upgrade bought (" + (hasUpgrade("p", 35) ? "stacks multiplicatively" : "stacks additively") + ", softcapped at 15)"
          },
          cost(){
            let cost = new Decimal(300)
            return cost
          },
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
          title: "(Normal-6) okamii17",
          description(){
            return "The maker of Prestige Tree stardust. multiply points gain by 17 and PP gain by 1.7"
          },
          cost(){
            let cost = new Decimal(900)
            return cost
          },
          effect(){
            let eff = [new Decimal(17), new Decimal(1.7)]
            return eff
          },
          unlocked(){return hasUpgrade("p", 15)},
        },
        22: {
          title: "(Normal-7) Letorin",
          description(){
            return "Another Broken Game. multiply PP gain by sqrt(log2(points+2))"
          },
          cost(){
            let cost = new Decimal(3000)
            return cost
          },
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
          title: "(Normal-8) thepaperpilot",
          description(){
            return "I see nothing special in githack. but they have game dev tree on tpp.rocks, unlock a new layer (permanently keep), multiply points gain by 10"
          },
          cost(){
            let cost = new Decimal(30000)
            return cost
          },
          effect(){
            let eff = new Decimal(10)
            return eff
          },
          unlocked(){return hasUpgrade("p", 22)},
        },
        24: {
          title: "(Normal-9) Dystopia-user181",
          description(){
            return "The maker of Factoree. ^1.81 " + `<b>Normal-3</b>` + " and " + `<b>Normal-5</b>` + " effect"
          },
          cost(){
            let cost = new Decimal(4e5)
            return cost
          },
          effect(){
            let eff = new Decimal(1.81)
            return eff
          },
          unlocked(){return hasUpgrade("p", 23)},
        },
        25: {
          title: "(Normal-10) E3XA",
          description(){
            return "The Unplayable Roblox Tree. cubes boosters boost and triple points gain"
          },
          cost(){
            let cost = new Decimal(3e6)
            return cost
          },
          effect(){
            let eff = new Decimal(3)
            return eff
          },
          unlocked(){return hasUpgrade("p", 24)},
        },
        31: {
          title: "(Normal-11) MocyaTheMole",
          description(){
            return "The Cursed Tree. +" + format(format(tmp.p.upgrades[31].effectBase)) + " " + `<b>Normal-2</b>` + " base for every boosters"
          },
          cost(){
            let cost = new Decimal(3e7)
            return cost
          },
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
          title: "(Normal-12) Some-random-guy7718",
          description(){
            return "Another Cursed Tree. multiply points gain by 771.8 and divide boosters cost by 3"
          },
          cost(){
            let cost = new Decimal(1e10)
            return cost
          },
          effect(){
            let eff = [new Decimal(771.8), new Decimal(3)]
            return eff
          },
          unlocked(){return hasUpgrade("p", 31)},
        },
        33: {
          title: "(Normal-13) jgdovin",
          description(){
            return "ANOTHER Cursed Tree. +" + format(format(tmp.p.upgrades[33].effectBase)) + " Booster boost base for every prestige upgrades bought"
          },
          cost(){
            let cost = new Decimal(6e11)
            return cost
          },
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
          title: "(Normal-14) Crimson4061",
          description(){
            return "He is Crimson406, despite an extra 1. multiply PP gain by 406 and reduce boosters base to 406"
          },
          cost(){
            let cost = new Decimal(5e12)
            return cost
          },
          effect(){
            let eff = new Decimal(406)
            return eff
          },
          unlocked(){return hasUpgrade("p", 33)},
        },
        35: {
          title: "(Normal-15) IEmory",
          description(){
            return "He is smiley, hopefully he returned discord and sent a message. unlock Quests (permanently keep), " + `<b>Normal-5</b>` + " now stacks multiplicatively"
          },
          cost(){
            let cost = new Decimal(5e16)
            return cost
          },
          effect(){
            let eff = new Decimal(1)
            return eff
          },
          unlocked(){return hasUpgrade("p", 34)},
        },
        41: {
          title: "(Normal-16) peachparlor",
          description(){
            return "Totally a weird tree with some basic features. Divide boosters cost by Prestige Points^0.1 (softcapped at 10,000)"
          },
          cost(){
            let cost = new Decimal(5e21)
            return cost
          },
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
          title: "(Normal-17) gapples2",
          description(){
            return "The Tree is so basic... with many mods. square " + `<b>Normal-3</b>` + " and " + `<b>Normal-7</b>` +" effect"
          },
          cost(){
            let cost = new Decimal(3e23)
            return cost
          },
          effect(){
            let eff = new Decimal(2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 41)},
        },
        43: {
          title: "(Normal-18) Pimvgd",
          description(){
            return "Growth: Quadratic. multiply points gain by (points+1)^0.05"
          },
          cost(){
            let cost = new Decimal(1e31)
            return cost
          },
          effect(){
            let eff = player.points.add(1).pow(0.05)
            if (eff.gte(tmp.p.upgrades[43].effectSCStart)) eff = new Decimal(10).pow(new Decimal(tmp.p.upgrades[43].effectSCStart.log(10)).mul(eff.log(10).div(tmp.p.upgrades[43].effectSCStart.log(10)).pow(0.5)))
            return eff
          },
          effectSCStart(){
            let sc = new Decimal("1e2000")
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 43)) + "x" + (upgradeEffect("p", 43).gte(tmp.p.upgrades[43].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 42)},
          tooltip(){return "Effect softcap start: " + format(tmp.p.upgrades[43].effectSCStart) + "x"},
        },
        44: {
          title: "(Normal-19) Grodvert",
          description(){
            return "Nothing Special. PP gain exponent is increased by 0.05"
          },
          cost(){
            let cost = new Decimal(4e34)
            return cost
          },
          effect(){
            let eff = new Decimal(0.05)
            return eff
          },
          unlocked(){return hasUpgrade("p", 43)},
        },
        45: {
          title: "(Normal-20) Cubedey",
          description(){
            return "Tree is going to be Prestige! increase boosters boost base based on prestige points"
          },
          cost(){
            let cost = new Decimal(5e47)
            return cost
          },
          effect(){
            let eff = player.p.points.add(1).log(10).div(100)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 45))},
          unlocked(){return hasUpgrade("p", 44)},
        },
        51: {
          title: "(Normal-21) Pikiquouik",
          description(){
            return "I have absoulately no idea what's going on. increase Achievement 13 reward achievement exponent by 0.25"
          },
          cost(){
            let cost = new Decimal(6e61)
            return cost
          },
          effect(){
            let eff = new Decimal(0.25)
            return eff
          },
          unlocked(){return hasUpgrade("p", 45)},
        },
        52: {
          title: "(Normal-22) pg132",
          description(){
            return "The maker of Incrementreeverse, Prestige Chain and The Tree of Life. " + format(132**2) + "x Points and PP gain"
          },
          cost(){
            let cost = new Decimal(2e77)
            return cost
          },
          effect(){
            let eff = new Decimal(132**2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 51)},
        },
        53: {
          title: "(Normal-23) MCKight",
          description(){
            return "Still Nothing Special. Total Quests completion boosts points gain"
          },
          cost(){
            let cost = new Decimal(5e132)
            return cost
          },
          effect(){
            let x = new Decimal(totalQuestsCompletion())
            if (hasUpgrade("p", 82)) x = x.pow(upgradeEffect("p", 82)[0])
            let eff = new Decimal(10).pow(x)
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 53)) + "x"},
          unlocked(){return hasUpgrade("p", 52)},
        },
        54: {
          title: "(Normal-24) multivberse",
          description(){
            return "He is actually tried to make a mod. " + `<b>Normal-2</b>` + " and Boosters boost softcap starts " + format(tmp.p.upgrades[54].effectBase) + "x later for every Infinity Points (softcapped at 10)"
          },
          cost(){
            let cost = new Decimal(3e144)
            return cost
          },
          effectBase(){
            let base = new Decimal(1e4)
            if (hasUpgrade("p", 71)) base = base.pow(upgradeEffect("p", 71))
            return base
          },
          effect(){
            let x = player.i.points
            if (x.gte(10)) x = x.div(10).pow(0.5).mul(10)
            if (x.gte(25)) x = x.log(5).mul(12.5)
            let eff = tmp.p.upgrades[54].effectBase.pow(x)
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 54)) + "x"},
          unlocked(){return hasUpgrade("p", 53)},
        },
        55: {
          title: "(Normal-25) randomtuba",
          description(){
            return "A random user that doesn't have something special. Increase " + `<b>Normal-2</b>` + " base based on Prestige Points"
          },
          cost(){
            let cost = new Decimal(5e160)
            return cost
          },
          effect(){
            let eff = player.p.points.add(1).log(10).div(10)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 55))},
          unlocked(){return hasUpgrade("p", 54)},
        },
        61: {
          title: "(Normal-26) jckwik",
          description(){
            return "population = criminals. increase Achievement 13 reward achievement exponent by 0.2"
          },
          cost(){
            let cost = new Decimal(1e199)
            return cost
          },
          effect(){
            let eff = new Decimal(0.2)
            return eff
          },
          unlocked(){return hasUpgrade("p", 55)},
        },
        62: {
          title: "(Normal-27) unsmith19",
          description(){
            return "corruptionsmith. You gain 19% more boosters"
          },
          cost(){
            let cost = new Decimal(4e226)
            return cost
          },
          effect(){
            let eff = new Decimal(1.19)
            return eff
          },
          unlocked(){return hasUpgrade("p", 61)},
        },
        63: {
          title: "(Normal-28) SkitsTheSkitty",
          description(){
            return "cadavers = life essence. Remove the softcap of " + `<b>Normal-11</b>` + " and make it 2.7x stronger"
          },
          cost(){
            let cost = new Decimal(6e283)
            return cost
          },
          effect(){
            let eff = new Decimal(2.7)
            return eff
          },
          unlocked(){return hasUpgrade("p", 62)},
        },
        64: {
          title: "(Normal-29) xidafo",
          description(){
            return "Minecraft Tree should allow player to go past " + format(new Decimal("ee3")) + " points. raise " + `<b>Normal-16</b>` + " effect after softcap based on points"
          },
          cost(){
            let cost = new Decimal("3e325")
            return cost
          },
          effect(){
            let eff = player.points.max(1).log(10).max(1).log(10).max(1).pow(3)
            return eff
          },
          effectDisplay(){return "^" + format(upgradeEffect("p", 64))},
          unlocked(){return hasUpgrade("p", 63)},
        },
        65: {
          title: "(Normal-30) ttops",
          description(){
            return "https:corrupted game. Raise " + `<b>Normal-7</b>` + " effect to the power of 15"
          },
          cost(){
            let cost = new Decimal("3e474")
            return cost
          },
          effect(){
            let eff = new Decimal(15)
            return eff
          },
          unlocked(){return hasUpgrade("p", 64)},
        },
        71: {
          title: "(Normal-31) MakerOfDopamine",
          description(){
            return "The crypto miner game. Raise " + `<b>Normal-24</b>` + " effect base based on Total Quests completion"
          },
          cost(){
            let cost = new Decimal("1e613")
            return cost
          },
          effect(){
            let eff = new Decimal(totalQuestsCompletion()).pow(0.155).max(1)
            return eff
          },
          effectDisplay(){return "^" + format(upgradeEffect("p", 71))},
          unlocked(){return hasUpgrade("p", 65)},
        },
        72: {
          title: "(Normal-32) erofu",
          description(){
            return "Normal Tree Mk1. Raise " + `<b>Normal-2</b>` + " base to the power of 1.5"
          },
          cost(){
            let cost = new Decimal("8e808")
            return cost
          },
          effect(){
            let eff = new Decimal(1.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 71)},
        },
        73: {
          title: "(Normal-33) jacobcoder",
          description(){
            return "Normal Tree Mk2. Raise " + `<b>Normal-2</b>` + " softcap start to the power of 1.5"
          },
          cost(){
            let cost = new Decimal("1e2000")
            return cost
          },
          effect(){
            let eff = new Decimal(1.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 72)},
        },
        74: {
          title: "(Normal-34) infaerina",
          description(){
            return "Normal Tree Mk3. Raise second " + `<b>TreeQuest 1</b>` + " reward to the power of 1.5 and 1.5x " + `<b>Super-1</b>` + " time amount from reset time"
          },
          cost(){
            let cost = new Decimal("3.33e3444")
            return cost
          },
          effect(){
            let eff = new Decimal(1.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 73)},
        },
        75: {
          title: "(Normal-35) denisolenison",
          description(){
            return "Level Up! 1.5x " + `<b>Super-1</b>` + " time amount from reset time and time amount exponent, add 1.5 seconds into boost"
          },
          cost(){
            let cost = new Decimal("1e3850")
            return cost
          },
          effect(){
            let eff = new Decimal(1.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 74)},
        },
        81: {
          title: "(Normal-36) Bwing89",
          description(){
            return "Normal Tree Mk4. ^8.9 " + `<b>Normal-3</b>` + " effect"
          },
          cost(){
            let cost = new Decimal("5.55e5566")
            return cost
          },
          effect(){
            let eff = new Decimal(8.9)
            return eff
          },
          unlocked(){return hasUpgrade("p", 75)},
        },
        82: {
          title: "(Normal-37) AbitofTetration",
          description(){
            return "The only completed mod that make by despacit2.0. " + `<b>Normal-23</b>` + " effect exponent ^" + format(2**0.5) + " and divide " + `<b>TreeQuest 4</b>` + " goal by 2,000"
          },
          cost(){
            let cost = new Decimal("1e8500")
            return cost
          },
          effect(){
            let eff = [new Decimal(2).pow(0.5), new Decimal(2000)]
            return eff
          },
          unlocked(){return hasUpgrade("p", 81)},
        },
        83: {
          title: "(Normal-38) OhManLolLol",
          description(){
            return "stupidity = braincells. increase Achievement 13 reward achievement exponent by " + format(tmp.p.upgrades[83].effectBase) + " for every Infinity Point (softcapped at 100)"
          },
          cost(){
            let cost = new Decimal("1.11e11333")
            return cost
          },
          effectBase(){
            let base = new Decimal(0.005)
            return base
          },
          effect(){
            let x = player.i.points
            if (x.gte(100)) x = x.log(10).mul(50)
            let eff = x.mul(tmp.p.upgrades[83].effectBase)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 83), 3)},
          unlocked(){return hasUpgrade("p", 82)},
        },
        84: {
          title: "(Normal-39) hyppoh",
          description(){
            return "Normal Tree Mk5. Multiply SP gain by Boosters+1 and divide " + `<b>TreeQuest 5</b>` + " goal by 100,000"
          },
          cost(){
            let cost = new Decimal("1e11750")
            return cost
          },
          effect(){
            let eff = [player.b.points.add(1), new Decimal(1e5)]
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 84)[0]) + "x"},
          unlocked(){return hasUpgrade("p", 83)},
        },
        85: {
          title: "(Normal-40) demonicRiddle",
          description(){
            return "At least they have contents... Booster amount softcap starts " + format(tmp.p.upgrades[85].effectBase) + " later for every IP"
          },
          cost(){
            let cost = new Decimal("1e16000")
            return cost
          },
          effectBase(){
            let base = new Decimal(1)
            return base
          },
          effect(){
            let eff = player.i.points.mul(tmp.p.upgrades[85].effectBase)
            return eff
          },
          effectDisplay(){return "+" + format(upgradeEffect("p", 85))},
          unlocked(){return hasUpgrade("p", 84)},
        },
        91: {
          title: "(Normal-41) jokre33",
          description(){
            return "At least they have contents... (2). increase Achievement 13 reward achievement exponent by 0.33"
          },
          cost(){
            let cost = new Decimal("1e45600")
            return cost
          },
          effect(){
            let eff = new Decimal(0.33)
            return eff
          },
          unlocked(){return hasUpgrade("p", 85)},
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
    resource(){return (player.fun.h0ndepoints ? "boosted h0nde" : "boosters")}, // Name of prestige currency
    baseResource(){return (player.fun.h0ndepoints ? "h0nde accounts" : "points")}, // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 32)) mult = mult.div(upgradeEffect("p", 32)[1])
        if (hasUpgrade("p", 41)) mult = mult.div(upgradeEffect("p", 41))
        if (hasUpgrade("sp", 32)) mult = mult.div(upgradeEffect("sp", 32)[1])
        if (inChallenge("q", 32)) mult = mult.mul(1/0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult(){
      mult = new Decimal(1)
      if (hasUpgrade("p", 62)) mult = mult.mul(upgradeEffect("p", 62))
      if (hasUpgrade("sp", 25)) mult = mult.mul(upgradeEffect("sp", 25)[0])
      if (hasAchievement("a", 33)) mult = mult.mul(achievementEffect("a", 33))
      if (hasChallenge("q", 32)) mult = mult.mul(challengeEffect("q", 32)[0])
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
      return player.b.auto
    },
    resetsNothing(){
      return hasAchievement("a",25)
    },
    effectBase(){
      let base = new Decimal(2)
      if (hasUpgrade("p", 33)) base = base.add(upgradeEffect("p", 33))
      if (hasUpgrade("p", 45)) base = base.add(upgradeEffect("p", 45))
      if (hasUpgrade("sp", 34)) base = base.mul(upgradeEffect("sp", 34))
      if (hasUpgrade("p", 25)) base = base.pow(upgradeEffect("p", 25))
      return base
    },
    boostersAmt(){ // before power and multi
      let b = player.b.points
      if (b.gte(tmp.b.boostersAmtSCStart)) b = b.div(tmp.b.boostersAmtSCStart).pow(0.5).mul(tmp.b.boostersAmtSCStart)
      return b
    },
    boostersAmtSCStart(){
      let SCStart = new Decimal(256)
      if (hasUpgrade("p", 85)) SCStart = SCStart.add(upgradeEffect("p", 85))
      return SCStart
    },
    effect(){
      let x = tmp.b.boostersAmt
      if (maxedChallenge("q", 12)) x = x.pow(challengeEffect("q", 12)[1])
      let y = maxedChallenge("q", 12) ? new Decimal(0) : new Decimal(10)
      if (x.gte(y)) x = y.add(x.sub(y).mul(challengeEffect("q", 12)[0]))
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
      return " which multiply points gain by " + format(tmp.b.effect) + (tmp.b.effect.gte(tmp.b.effectSCStart) ? " (softcapped)" : "") + `<br>` + 
      "(effect base: " + format(tmp.b.effectBase) + (player.b.points.gte(tmp.b.boostersAmtSCStart) ? ", boost amount is softcapped at " + formatWhole(tmp.b.boostersAmtSCStart) : "") + ")"
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
      function() {if (hasAchievement("a", 25)) return ["row", [["display-text", "Auto Boosters: "],"blank",["toggle", ["b", "auto"]]]]},
    ],
})

addLayer("i", {
  name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
  resource(){return (player.fun.h0ndepoints ? "h0nde infinites" : "infinity points")}, // Name of prestige currency
  baseResource(){return (player.fun.h0ndepoints ? "h0nde accounts" : "points")}, // Name of resource prestige is based on
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
    return hasAchievement("a",32)
  },
  autoPrestige(){
    return false
  },
  resetsNothing(){
    return false
  },
  effect(){
    let eff = (player.i.points.gte(100) ? player.i.points.log(10) : player.i.points.pow(0.5).div(10).add(1))
    if (eff.gte(3)) eff = eff.div(3).pow(0.5).mul(3)
    if (eff.gte(4)) eff = eff.log(2).mul(2)
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

addLayer("sp", {
  name: "super prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() { return {
      unlocked: false,
      points: new Decimal(0),
      bestBoughtUpgs: 0,
  }},
  color(){return player.fun.crimsonnodes ? "crimson" : "#278b8c"},
  requires: new Decimal("1e1297"), // Can be a function that takes requirement increases into account
  resource(){return (player.fun.h0ndepoints ? "super prestiged h0nde" : "super prestige points")}, // Name of prestige currency
  baseResource(){return (player.fun.h0ndepoints ? "prestiged h0nde" : "prestige points")}, // Name of resource prestige is based on
  baseAmount() {return player.p.points}, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent(){
    let exp = new Decimal(0.001)
    return exp
  }, // Prestige currency exponent
  gainMult() { // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1)
      if (hasUpgrade("sp", 15)) mult = mult.mul(upgradeEffect("sp", 15))
      if (hasUpgrade("sp", 21)) mult = mult.mul(upgradeEffect("sp", 21)[0])
      if (hasUpgrade("sp", 22)) mult = mult.mul(upgradeEffect("sp", 22)[0])
      if (hasUpgrade("sp", 23)) mult = mult.mul(upgradeEffect("sp", 23)[0])
      if (hasUpgrade("p", 84)) mult = mult.mul(upgradeEffect("p", 84)[0])
      if (hasUpgrade("sp", 32)) mult = mult.mul(upgradeEffect("sp", 32)[0])
      if (hasUpgrade("sp", 35)) mult = mult.mul(upgradeEffect("sp", 35))
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
  row: 1, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
      {key: "s", description: "S: Reset for super prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  branches: ["p"],
  layerShown(){return player.i.points.gte(11) || player.sp.unlocked},
  passiveGeneration(){return 0},
  doReset(resettingLayer) {
    let keep = ["bestBoughtUpgs"];
    if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
  },
  update(diff){
    player.sp.bestBoughtUpgs = Math.max(player.sp.bestBoughtUpgs, player.sp.upgrades.length)
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
      title: "(Super-1) Jacorb",
      description(){
        return "Multiply points gain by " + format(tmp.sp.upgrades[11].effectBase) + " for every second^" + format(tmp.sp.upgrades[11].effectExp) + " of prestige, with a maximum of " + format(tmp.sp.upgrades[11].timeCap) + " seconds (only work while outside quests, Require 32 Prestige Upgrades)"
      },
      cost(){
        let cost = new Decimal(1)
        return cost
      },
      canAfford(){return player.p.upgrades.length >= 32},
      effectBase(){
        let base = new Decimal(10)
        if (hasUpgrade("sp", 24)) base = base.pow(upgradeEffect("sp", 24))
        return base
      },
      effectExp(){
        let exp = new Decimal(1)
        if (hasUpgrade("p", 75)) exp = exp.mul(upgradeEffect("p", 75))
        return exp
      },
      timeCap(){
        let cap = new Decimal(60)
        if (hasUpgrade("sp", 31)) cap = cap.mul(upgradeEffect("sp", 31)[1])
        return cap
      },
      currentTime(){
        let t = new Decimal(player.p.resetTime)
        let m = new Decimal(1)
        let e = new Decimal(0)
        if (hasUpgrade("p", 74)) m = m.mul(upgradeEffect("p", 74))
        if (hasAchievement("a", 32)) m = m.mul(achievementEffect("a", 32))
        if (hasUpgrade("p", 75)) m = m.mul(upgradeEffect("p", 75))
        if (hasUpgrade("sp", 21)) m = m.mul(upgradeEffect("sp", 21)[1])
        if (hasUpgrade("sp", 31)) m = m.mul(upgradeEffect("sp", 31)[0])
        if (hasUpgrade("sp", 34)) m = m.mul(upgradeEffect("sp", 34))

        if (hasUpgrade("p", 75)) e = e.add(upgradeEffect("p", 75))
        if (hasUpgrade("sp", 22)) e = e.add(upgradeEffect("sp", 22)[1])
        if (hasUpgrade("sp", 31)) e = e.mul(upgradeEffect("sp", 31)[2])
        t = t.mul(m).add(e)
        return t
      },
      effect(){
        let t = tmp.sp.upgrades[11].currentTime.min(tmp.sp.upgrades[11].timeCap)
        t = t.pow(tmp.sp.upgrades[11].effectExp)
        let eff = tmp.sp.upgrades[11].effectBase.pow(t)
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 11)) + "x (Time: " + format(tmp.sp.upgrades[11].currentTime) + "s)"},
    },
    12: {
      title: "(Super-2) Acamaeda",
      description(){
        return `<b>Normal-2</b>` + " affect PP gain with reduced effect (Require 12 infinity points)"
      },
      cost(){
        let cost = new Decimal(10)
        return cost
      },
      canAfford(){return player.i.points.gte(12)},
      effect(){
        let eff = upgradeEffect("p", 12).pow(0.2).max(1)
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 12)) + "x"},
      unlocked(){return hasUpgrade("sp", 11)},
    },
    13: {
      title: "(Super-3) thefinaluptake",
      description(){
        return "Multiply PP gain by log2(PP+2)^20 (Require 13 infinity points)"
      },
      cost(){
        let cost = new Decimal(50)
        return cost
      },
      canAfford(){return player.i.points.gte(13)},
      effect(){
        let eff = player.p.points.add(2).log(2).pow(20)
        if (hasUpgrade("sp", 25)) eff = eff.pow(upgradeEffect("sp", 25)[1])
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 13)) + "x"},
      unlocked(){return hasUpgrade("sp", 12)},
    },
    14: {
      title: "(Super-4) Menohe",
      description(){
        return "Multiply PP gain by (SP+1)^50 (Require 27 infinity points)"
      },
      cost(){
        let cost = new Decimal(1000)
        return cost
      },
      canAfford(){return player.i.points.gte(27)},
      effect(){
        let eff = player.sp.points.pow(50).max(1)
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 14)) + "x"},
      unlocked(){return hasUpgrade("sp", 13)},
    },
    15: {
      title: "(Super-5) Katakana1",
      description(){
        return "+" + format(tmp.sp.upgrades[15].effectBase.mul(100)) + "% SP gain for every Super Prestige Upgrade bought (stacks additively, Require 34 Prestige Upgrades)"
      },
      cost(){
        let cost = new Decimal(8000)
        return cost
      },
      canAfford(){return player.p.upgrades.length >= 34},
      effectBase(){
        let base = new Decimal(1)
        return base
      },
      effect(){
        let x = new Decimal(player.sp.upgrades.length)
        let eff = x.mul(tmp.sp.upgrades[15].effectBase).add(1)
        if (hasUpgrade("sp", 24)) eff = eff.pow(upgradeEffect("sp", 24))
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 15)) + "x"},
      unlocked(){return hasUpgrade("sp", 14)},
    },
    21: {
      title: "(Super-6) okamii17",
      description(){
        return "Multiply SP gain by 17 and multiply " + `<b>Super-1</b>` + " time amount from reset time by 1.7 (Require 31 infinity points)"
      },
      cost(){
        let cost = new Decimal(50000)
        return cost
      },
      canAfford(){return player.i.points.gte(31)},
      effect(){
        let eff = [new Decimal(17), new Decimal(1.7)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 15)},
    },
    22: {
      title: "(Super-7) Letorin",
      description(){
        return "Multiply SP gain by IP+1 and add " + `<b>Super-1</b>` + " time by sqrt(Boosters) (Require q5x1 completion)"
      },
      cost(){
        let cost = new Decimal(2e7)
        return cost
      },
      canAfford(){return challengeCompletions("q", 31) >= 1},
      effect(){
        let eff = [player.i.points.add(1), player.b.points.pow(0.5)]
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 22)[0]) + "x, +" + format(upgradeEffect("sp", 22)[1])},
      unlocked(){return hasUpgrade("sp", 21)},
    },
    23: {
      title: "(Super-8) thepaperpilot",
      description(){
        return "Multiply SP gain by 10 and " + `<b>Super-4</b>` + " affect points gain with reduced effect (Require 49 infinity points)"
      },
      cost(){
        let cost = new Decimal(5e9)
        return cost
      },
      canAfford(){return player.i.points.gte(49)},
      effect(){
        let eff = [new Decimal(10), upgradeEffect("sp", 14)]
        if (eff[1].gte(10)) eff[1] = new Decimal(10).pow(eff[1].log(10).pow(0.75))
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 23)[1]) + "x"},
      unlocked(){return hasUpgrade("sp", 22)},
    },
    24: {
      title: "(Super-9) Dystopia-user181",
      description(){
        return "^1.81 " + `<b>Super-1</b>` + " base and " + `<b>Super-5</b>` + " effect (Require 56 infinity points)"
      },
      cost(){
        let cost = new Decimal(4e11)
        return cost
      },
      canAfford(){return player.i.points.gte(56)},
      effect(){
        let eff = new Decimal(1.81)
        return eff
      },
      unlocked(){return hasUpgrade("sp", 23)},
    },
    25: {
      title: "(Super-10) E3XA",
      description(){
        return "You gain 3% more boosters, " + `<b>Super-3</b>` + " effect is cubed (Require q4x8 completion)"
      },
      cost(){
        let cost = new Decimal(1e17)
        return cost
      },
      canAfford(){return challengeCompletions("q", 22) >= 8},
      effect(){
        let eff = [new Decimal(1.03), new Decimal(3)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 24)},
    },
    31: {
      title: "(Super-11) MocyaTheMole",
      description(){
        return "3x " + `<b>Super-1</b>` + " time amount from reset time, 2x time cap and 1.5x extra time amount (Require q5x3 completion)"
      },
      cost(){
        let cost = new Decimal(2e21)
        return cost
      },
      canAfford(){return challengeCompletions("q", 31) >= 3},
      effect(){
        let eff = [new Decimal(3), new Decimal(2), new Decimal(1.5)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 25)},
    },
    32: {
      title: "(Super-12) Some-random-guy7718",
      description(){
        return "Multiply SP gain by " + format(7718) + " and divide Boosters cost by " + format(7718) + " for every Infinity Points (Require 129 infinity points)"
      },
      cost(){
        let cost = new Decimal(5e24)
        return cost
      },
      canAfford(){return player.i.points.gte(129)},
      effect(){
        let eff = [new Decimal(7718), new Decimal(7718).pow(player.i.points)]
        return eff
      },
      effectDisplay(){return "/" + format(upgradeEffect("sp", 32)[1])},
      unlocked(){return hasUpgrade("sp", 31)},
    },
    33: {
      title: "(Super-13) jgdovin",
      description(){
        return "^2 " + `<b>TreeQuest 3</b>` + " and " + `<b>TreeQuest 4</b>` + " first reward, and ^1.5 " + `<b>TreeQuest 1</b>` + " first reward  (Require q4x9 completion)"
      },
      cost(){
        let cost = new Decimal(3e30)
        return cost
      },
      canAfford(){return challengeCompletions("q", 22) >= 9},
      effect(){
        let eff = [new Decimal(2), new Decimal(1.5)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 32)},
    },
    34: {
      title: "(Super-14) Crimson4061",
      description(){
        return "^4.06 " + `<b>Normal-2</b>` + " effect base and softcap start, 4.06x Boosters boost base and " + `<b>Super-1</b>` + " time amount from reset time (Require q5x4 completion)"
      },
      cost(){
        let cost = new Decimal(3e37)
        return cost
      },
      canAfford(){return challengeCompletions("q", 31) >= 4},
      effect(){
        let eff = new Decimal(4.06)
        return eff
      },
      unlocked(){return hasUpgrade("sp", 33)},
    },
    35: {
      title: "(Super-15) IEmory",
      description(){
        return "Multiply SP gain by " + format(tmp.sp.upgrades[35].effectBase) + " for every Quests completion (Require q6x2 completion)"
      },
      cost(){
        let cost = new Decimal(1e62)
        return cost
      },
      canAfford(){return challengeCompletions("q", 32) >= 2},
      effectBase(){
        let base = new Decimal(2)
        return base
      },
      effect(){
        let eff = tmp.sp.upgrades[35].effectBase.pow(totalQuestsCompletion())
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 35)) + "x"},
      unlocked(){return hasUpgrade("sp", 34)},
    },
  },
  bars:{
    progressBar: {
      direction: RIGHT,
      width: 450,
      height: 50,
      display(){return "Bought Upgrades: "+player.sp.upgrades.length+"/"+(Object.keys(tmp.sp.upgrades).length-2) + " (Best: " + formatWhole(player.sp.bestBoughtUpgs) + ")"},
      progress() {return player.sp.upgrades.length / (Object.keys(tmp.sp.upgrades).length-2)},
      unlocked() {return true},
      fillStyle() {return {"background-color": tmp.sp.color}},
    },
  },
})

addLayer("a", {
        startData() { return {
            unlocked: true,
        }},
        color: "yellow",
        row: "side",
        position: 1,
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return (player.a.achievements.length + (player.fun.h0ndepoints ? " h0nde's Achievementers" : " Achievements"))
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
            fillStyle() {return {"background-color": "olive"}},
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
                tooltip(){return "Do a boosters reset. Reward: multiply points gain by log10(points+10) for every completed achievement^" + format(tmp.a.achievements[13].effectExp, 3) + ", currently: " + format(achievementEffect("a", 13)) + "x"},
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
                  if (hasUpgrade("p", 83)) exp = exp.add(upgradeEffect("p", 83))
                  if (hasUpgrade("p", 91)) exp = exp.add(upgradeEffect("p", 91))
                  return exp
                },
            },
            14: {
                name: "14",
                done() {return player.p.points.gte(1e9)},
                tooltip(){return "Reach " + format(1e9) + " Prestige Points. Reward: add Prestige Upgrade 5 base by log10(PP+1) (softcapped at 40), currently: +" + format(achievementEffect("a", 14).mul(100))},
                effect(){
                  let eff = player.p.points.add(1).log(10).div(100)
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
              tooltip(){return "Complete TreeQuest 3. Reward: Reduce the goal scaling of TreeQuest 1 and TreeQuest 2 to 1.4"},
            },
            24: {
              name: "24",
              done() {return player.p.points.gte(Number.MAX_VALUE)},
              tooltip(){return "Reach " + format(Number.MAX_VALUE) + " prestige points. Reward: You gain 1% of Prestige Point gain every second"},
            },
            25: {
              name: "25",
              done() {return player.b.points.gte(111)},
              tooltip(){return "Reach 111 Boosters. Reward: You can autobuy boosters, boosters resets nothing"},
            },
            31: {
              name: "31",
              done() {return player.sp.unlocked},
              tooltip(){return "Perform a Super Prestige reset. Reward: Keep Prestige Upgrades on I/SP resets, passive PP generate 100x faster, but disable prestige if you have Achievement 24"},
            },
            32: {
              name: "32",
              done() {return player.points.gte("9.9999e9999")},
              tooltip(){return "Reach 9.9999e9,999 points. Reward: You can buy max Infinity Points, points multiply " + `<b>Super-1</b>` + " time amount from reset time, currently: " + format(achievementEffect("a", 32)) + "x"},
              effect(){
                let eff = player.points.add(1).log(10).add(1).log(10).div(2).max(1)
                return eff
              },
            },
            33: {
              name: "33",
              done() {return player.i.points.gte(111)},
              tooltip(){return "Reach 111 Infinity Points. Reward: You gain 1% more boosters for every Infinity Points^0.5, currently: +" + format(achievementEffect("a", 33).sub(1).mul(100)) + "%"},
              effect(){
                let eff = new Decimal(1).add(player.i.points.pow(0.5).div(100))
                return eff
              },
            },
        },
})

function totalQuestsCompletion(){
  let array = [11,12,21,22,31,32]
  let comp = 0
  for (let i = 0; i < array.length; i++){
    comp += player.q.challenges[array[i]]
  }
  return comp
}

function getNextQuestReq(x){
  if (x == undefined) x = player.q.questUnlocked+1
  let a = 10
  let b = 5
  let c = 8
  let d = x%c
  let e = Math.floor(x/c)
  return a + b*d*(e+1) + e*(e+1)/2*b*c
}

function getUnlockedQuests(x){
  if (x == undefined) x = player.p.upgrades.length
  let a = 10
  let b = 5
  let c = 8
  let d = (x-a)/(b*c)
  let e = Math.floor(Math.max((0.25+2*d), 0)**0.5-0.5)
  let f = Math.max(Math.floor((x-a-b*c*e*(e+1)/2)/(b*(e+1)))+c*e, 0)
  return f
}

addLayer("q", {
    startData() { return {
        unlocked: false,
        questUnlocked: 0,
    }},
    color: "magenta",
    row: "side",
    position: 2,
    layerShown() {return hasUpgrade("p", 35) || player.q.unlocked}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return (formatWhole(totalQuestsCompletion()) + "/" + formatWhole(player.q.questUnlocked*10) + (player.fun.h0ndepoints ? " h0nde's" : "") + " Quests completion")
    },
		tabFormat: [
        ["display-text",
         function() { return "Note: All Quests completions is never getting reset"}],
        ["display-text",
         function() { return "Unlocked Quests: " + formatWhole(player.q.questUnlocked) + " (Next at " + formatWhole(getNextQuestReq()) + " Bought Prestige Upgrades, Currently " + formatWhole(player.p.upgrades.length) + ")"}],
        ["display-text",
         function() { return "Total Quests completion: " + formatWhole(totalQuestsCompletion())}],
		  	"blank",
			  "challenges",
		],
    update(diff){
        if (hasUpgrade("p", 35)) player.q.unlocked = true
        if (isNaN(player.q.questUnlocked)) player.q.questUnlocked = 0
        player.q.questUnlocked = Math.max(getUnlockedQuests(), player.q.questUnlocked)
    },
    challenges: {
      11: {
        name: "TreeQuest 1",
        challengeDescription(){return "Do a forced row 1 reset, " + `<b>Normal-2</b>` + " have no effect, points gain is square rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 11) + "/" + tmp.q.challenges[11].completionLimit},
        unlocked(){return player.q.questUnlocked >= 1 && player.q.unlocked},
        goalDescription(){return (player.q.activeChallenge == 11 ? format(player.points) + "/" : "") + format(tmp.q.challenges[11].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          if (hasAchievement("a", 23)) scaling = new Decimal(1.4)
          let goal = new Decimal(10).pow(new Decimal(15).mul(new Decimal(scaling).pow(challengeCompletions("q", 11))))
          if (challengeCompletions("q", 11) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return `<b>Normal-2</b>` + " amount " + (maxedChallenge("q", 11) ? "": "past 10 ") + "is " + format(challengeEffect("q", 11)[0]) + "x higher" + (maxedChallenge("q", 11) ? " and the amount before multiplier is raised to the power of " + format(challengeEffect("q", 11)[1]) + ".": ".")},
        rewardEffect(){
          let eff = [new Decimal(challengeCompletions("q", 11)).min(9).add(1), new Decimal(1.1)]
          if (hasUpgrade("sp", 33)) eff[0] = eff[0].pow(upgradeEffect("sp", 33)[1])
          if (hasUpgrade("p", 74)) eff[1] = eff[1].pow(upgradeEffect("p", 74))
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
        goalDescription(){return (player.q.activeChallenge == 12 ? format(player.points) + "/" : "") + format(tmp.q.challenges[12].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          if (hasAchievement("a", 23)) scaling = new Decimal(1.4)
          let goal = new Decimal(10).pow(new Decimal(36).mul(new Decimal(scaling).pow(challengeCompletions("q", 12))))
          if (challengeCompletions("q", 12) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Boosters amount " + (maxedChallenge("q", 12) ? "": "past 10 ") + "is " + format(challengeEffect("q", 12)[0]) + "x higher" + (maxedChallenge("q", 12) ? " and the amount before multiplier is raised to the power of " + format(challengeEffect("q", 12)[1]) + ".": ".")},
        rewardEffect(){
          let eff = [new Decimal(challengeCompletions("q", 12)).min(9).add(1), new Decimal(1.1)]
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
        challengeDescription(){return "Do a forced row 1 reset, " + `<b>TreeQuest 1</b>` + " and " + `<b>TreeQuest 2</b>` + " are applied at once." + `<br>` + 
          "Completion: " + challengeCompletions("q", 21) + "/" + tmp.q.challenges[21].completionLimit},
        unlocked(){return player.q.questUnlocked >= 3 && player.q.unlocked},
        goalDescription(){return (player.q.activeChallenge == 21 ? format(player.points) + "/" : "") + format(tmp.q.challenges[21].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.5)
          let goal = new Decimal(10).pow(new Decimal(21.5).mul(new Decimal(scaling).pow(challengeCompletions("q", 21))))
          if (challengeCompletions("q", 21) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        countsAs:[11,12],
        rewardDescription(){return "Multiply points gain by " + format(challengeEffect("q", 21)[0]) + (maxedChallenge("q", 21) ? " and raise points gain to the power of " + challengeEffect("q", 21)[1] : ".")},
        rewardEffect(){
          let eff = [new Decimal(10).pow(new Decimal(challengeCompletions("q", 21)).pow(inChallenge("q", 21)?1:2).mul(10)), new Decimal(1.05)]
          if (hasUpgrade("sp", 33)) eff[0] = eff[0].pow(upgradeEffect("sp", 33)[0])
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
        goalDescription(){return (player.q.activeChallenge == 22 ? format(player.points) + "/" : "") + format(tmp.q.challenges[22].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.1)
          if (challengeCompletions("q", 22) >= 5) scaling = scaling.mul(1.065)
          if (challengeCompletions("q", 22) >= 8) scaling = scaling.mul(0.9945)
          let goal = new Decimal(10).pow(new Decimal(37.5).mul(new Decimal(scaling).pow(challengeCompletions("q", 22))))
          if (challengeCompletions("q", 22) >= 9) goal = goal.pow(1.269)
          if (hasUpgrade("p", 82)) goal = goal.div(upgradeEffect("p", 82)[1])
          if (challengeCompletions("q", 22) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Multiply PP gain by " + format(challengeEffect("q", 22)[0]) + (maxedChallenge("q", 22) ? " and raise prestige points gain to the power of " + challengeEffect("q", 22)[1] : ".")},
        rewardEffect(){
          let eff = [new Decimal(10).pow(new Decimal(challengeCompletions("q", 22)).pow(inChallenge("q", 22)?1:2).mul(10)), new Decimal(1.05)]
          if (hasUpgrade("sp", 33)) eff[0] = eff[0].pow(upgradeEffect("sp", 33)[0])
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[22].goal)},
        onEnter(){doReset("p", true)},
        onExit(){doReset("p", true)},
        onComplete(){doReset("p", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 22)},
      },
      31: {
        name: "TreeQuest 5",
        challengeDescription(){return "Do a forced row 2 reset, you can't gain PP, points gain is 10th rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 31) + "/" + tmp.q.challenges[31].completionLimit},
        unlocked(){return player.q.questUnlocked >= 5 && player.q.unlocked},
        goalDescription(){return (player.q.activeChallenge == 31 ? format(player.points) + "/" : "") + format(tmp.q.challenges[31].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.25).add(new Decimal(challengeCompletions("q", 31)).div(25))
          let goal = new Decimal(10).pow(new Decimal(183).mul(new Decimal(scaling).pow(challengeCompletions("q", 31))))
          if (challengeCompletions("q", 31) >= 3) goal = goal.pow(1.323)
          if (challengeCompletions("q", 31) >= 4) goal = goal.pow(1.657)
          if (hasUpgrade("p", 84)) goal = goal.div(upgradeEffect("p", 84)[1])
          if (challengeCompletions("q", 31) >= 5) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Increase PP gain exponent by " + format(challengeEffect("q", 31)[0]) + (maxedChallenge("q", 31) ? " and ??? " + challengeEffect("q", 31)[1] : ".")},
        rewardEffect(){
          let eff = [new Decimal(challengeCompletions("q", 31)).div(100), new Decimal(1)]
          return eff
        },
        canComplete: function() {return player.points.gte(tmp.q.challenges[31].goal)},
        onEnter(){doReset("sp", true)},
        onExit(){doReset("sp", true)},
        onComplete(){doReset("sp", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 31)},
      },
      32: {
        name: "TreeQuest 6",
        challengeDescription(){return "Do a forced row 2 reset and reset Prestige Upgrades, you can't gain boosters, PP gain is 10th rooted." + `<br>` + 
          "Completion: " + challengeCompletions("q", 32) + "/" + tmp.q.challenges[32].completionLimit},
        unlocked(){return player.q.questUnlocked >= 6 && player.q.unlocked},
        goalDescription(){return (player.q.activeChallenge == 32 ? format(player.p.points) + "/" : "") + format(tmp.q.challenges[32].goal) + " prestige points"},
        goal(){
          let scaling = new Decimal(1.4)
          let goal = new Decimal(10).pow(new Decimal(505).mul(new Decimal(scaling).pow(challengeCompletions("q", 32))))
          if (challengeCompletions("q", 32) >= 1) goal = goal.pow(1.357)
          if (challengeCompletions("q", 32) >= 2) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "You gain " + format(challengeEffect("q", 32)[0]) + "x more boosters" + (maxedChallenge("q", 32) ? " and ??? " + challengeEffect("q", 32)[1] : ".")},
        rewardEffect(){
          let eff = [new Decimal(1).add(new Decimal(challengeCompletions("q", 32)).div(2.5)), new Decimal(1)]
          return eff
        },
        canComplete: function() {return player.p.points.gte(tmp.q.challenges[32].goal)},
        onEnter(){doReset("sp", true); player.p.upgrades = []},
        onExit(){doReset("sp", true)},
        onComplete(){doReset("sp", true)},
        completionLimit: 10,
        marked(){return maxedChallenge("q", 32)},
      },
    },
})

addLayer("s", {
  startData() { return {
      unlocked: true,
  }},
  color: "cyan",
  row: "side",
  position: 0,
  layerShown() {return true}, 
  tooltip() { // Optional, tooltip displays when the layer is locked
      return ((player.fun.h0ndepoints ? "h0nde's " : "") + "Statistics")
  },
  tabFormat: [
    "blank",
    ["display-text",
    function() {
      return `<b>Points:</b>` + `<br>` + 
      format(player.points) + " (" + format(getPointGen()) + "/sec, " +  format(player.points.max(1).log(10).max(1).log(10).div(new Decimal(112100).log(10)).mul(100), 3) + "% completion)"},
    ],
    ["bar", "progressBar"],
    ["display-text",
    function() {
      return "Gain formula:" + `<br>` + 
      "10" + `<sup>` + "log10(" + format(getPointGainMul()) + `<sup>` + format(getPointGainPow(), 3) + `</sup>` + ")" + `<sup>` + format(getPointGainExpPow(), 3) + `</sup>` + `</sup>`},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.p.unlocked ? `<b>Prestige Points:</b>` + `<br>` + 
      formatWhole(player.p.points) + " (" + (tmp.p.passiveGeneration == 0 ? "+" + format(tmp.p.resetGain) + ")" : format(tmp.p.resetGain.mul(tmp.p.passiveGeneration)) + "/sec)") + `<br>` + 
      "Gain formula:" + `<br>` + 
      "((points/" + format(tmp.p.requires) + ")" + `<sup>` + format(tmp.p.exponent) + `</sup>` + "*" + format(tmp.p.gainMult) + ")" + `<sup>` + format(tmp.p.gainExp, 3) + `</sup>` + `<br>` + 
      "Softcap start:" + `<br>` + 
      format(tmp.p.softcap) + ", gain ^" + format(tmp.p.softcapPower, 3) + `<br>` + 
      "Bought Upgrades:"  + `<br>` + 
      player.p.upgrades.length+"/"+(Object.keys(tmp.p.upgrades).length-2) + " (" + format(player.p.upgrades.length/(Object.keys(tmp.p.upgrades).length-2)*100, 0) + "% bought, best: " + player.p.bestBoughtUpgs + ")" : "")},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.b.unlocked ? `<b>Boosters:</b>` + `<br>` + 
      formatWhole(player.b.points) + " (Next: " + format(tmp.b.nextAt) + " points)" + `<br>` + 
      "Cost formula:" + `<br>` + 
      format(tmp.b.requires) + "*" + format(tmp.b.base) + `<sup>` + "(boosters/" + format(tmp.b.directMult, 3) + ")" + `<sup>` + format(tmp.b.exponent, 3) + `</sup>` + `</sup>` + "/" + format(tmp.b.gainMult.recip()) : "")},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.sp.unlocked ? `<b>Super Prestige Points:</b>` + `<br>` + 
      formatWhole(player.sp.points) + " (" + (tmp.sp.passiveGeneration == 0 ? "+" + format(tmp.sp.resetGain) + ")" : format(tmp.sp.resetGain.mul(tmp.sp.passiveGeneration)) + "/sec)") + `<br>` + 
      "Gain formula:" + `<br>` + 
      "((prestige points/" + format(tmp.sp.requires) + ")" + `<sup>` + format(tmp.sp.exponent) + `</sup>` + "*" + format(tmp.sp.gainMult) + ")" + `<sup>` + format(tmp.sp.gainExp, 3) + `</sup>` + `<br>` + 
      "Softcap start:" + `<br>` + 
      format(tmp.sp.softcap) + ", gain ^" + format(tmp.sp.softcapPower, 3) + `<br>` + 
      "Bought Upgrades:"  + `<br>` + 
      player.sp.upgrades.length+"/"+(Object.keys(tmp.sp.upgrades).length-2) + " (" + format(player.sp.upgrades.length/(Object.keys(tmp.sp.upgrades).length-2)*100, 0) + "% bought, best: " + player.sp.bestBoughtUpgs + ")" : "")},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.i.unlocked ? `<b>Infinity Points:</b>` + `<br>` + 
      formatWhole(player.i.points) + " (Next: " + format(tmp.i.nextAt) + " points)" + `<br>` + 
      "Cost formula:" + `<br>` + 
      format(tmp.i.requires) + "*" + format(tmp.i.base) + `<sup>` + "(infinity points/" + format(tmp.i.directMult, 3) + ")" + `<sup>` + format(tmp.i.exponent, 3) + `</sup>` + `</sup>` + "/" + format(tmp.i.gainMult.recip()) : "")},
    ],
    "blank",
    ["display-text",
    function() {
      return (`<b>Achievements:</b>` + `<br>` + 
      player.a.achievements.length + "/" + (Object.keys(tmp.a.achievements).length-2) + " (" + format(player.a.achievements.length/(Object.keys(tmp.a.achievements).length-2)*100, 0) + "% completed)")},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.q.unlocked ? `<b>Quests:</b>` + `<br>` + 
      "Total completions: " + formatWhole(totalQuestsCompletion()) + "/" + formatWhole(player.q.questUnlocked*10) + `<br>` + 
      (player.q.questUnlocked >= 1 ? "TreeQuest 1: " + formatWhole(player.q.challenges[11]) + "/10" + (maxedChallenge("q", 11) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[11].goal) + ")") : "") + `<br>` + 
      (player.q.questUnlocked >= 2 ? "TreeQuest 2: " + formatWhole(player.q.challenges[12]) + "/10" + (maxedChallenge("q", 12) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[12].goal) + ")") : "") + `<br>` + 
      (player.q.questUnlocked >= 3 ? "TreeQuest 3: " + formatWhole(player.q.challenges[21]) + "/10" + (maxedChallenge("q", 21) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[21].goal) + ")") : "") + `<br>` + 
      (player.q.questUnlocked >= 4 ? "TreeQuest 4: " + formatWhole(player.q.challenges[22]) + "/10" + (maxedChallenge("q", 22) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[22].goal) + ")") : "") + `<br>` + 
      (player.q.questUnlocked >= 5 ? "TreeQuest 5: " + formatWhole(player.q.challenges[31]) + "/10" + (maxedChallenge("q", 31) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[31].goal) + ")") : "") + `<br>` + 
      (player.q.questUnlocked >= 6 ? "TreeQuest 6: " + formatWhole(player.q.challenges[32]) + "/10" + (maxedChallenge("q", 32) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[32].goal) + ")") : "") : "")},
    ],"blank","blank","blank",
  ],
  bars:{
    progressBar: {
      direction: RIGHT,
      width: 450,
      height: 1,
      display(){return ""},
      progress() {return player.points.max(1).log(10).max(1).log(10).div(new Decimal(112100).log(10))},
      unlocked() {return true},
      fillStyle() {return {"background-color": "teal"}},
      borderStyle() {return {"border-color": "teal"}},
    },
  },
})

addLayer("fun", {
  symbol: "FUN", // This appears on the layer's node. Default is the id with the first letter capitalized
  startData() { return {
    unlocked: true,
    points: new Decimal(1),
    points2: new Decimal(1),
    points3: new Decimal(0),
    input1: "",
    input2: "",
    h0ndepoints: false,
    crimsonnodes: false,
    producting_14: false,
    producting_15: false,
    producting_16: false,
  }},
  color: "white",
  row: "side",
  position: 999,
  layerShown() {return true}, 
  tooltip() { // Optional, tooltip displays when the layer is locked
      return ""
  },
  update(diff){
    modInfo.pointsName = (player.fun.h0ndepoints ? "h0nde accounts" : "points")
    let speed14 = player.fun.points.add(10).log(10).pow(player.b.points).mul(player.fun.points2).mul(new Decimal(10).pow(player.fun.points3.pow(3)))
    let exp15 = player.i.points.mul(player.fun.points2.log(10).add(10).log(10)).mul(player.fun.points3.add(1).pow(0.5))
    let speed16 = player.sp.total.add(1).max(1).log(10).mul(player.fun.points3.add(1))
    if (player.fun.producting_14){
      player.fun.points = player.fun.points.add(speed14.mul(diff))
    }
    if (player.fun.producting_15){
      player.fun.points2 = player.fun.points2.pow(exp15.pow(-1)).add(diff).pow(exp15)
    }
    if (player.fun.producting_16){
      player.fun.points3 = new Decimal(2).pow(player.fun.points3).add(speed16.mul(diff)).log(2)
    }
  },
  tabFormat: [
    "blank",
    ["row", [["clickable", 11],["blank","8px","8px"],["clickable", 12],["blank","8px","8px"],["clickable", 13]]],
    ["blank","8px","8px"],
    ["row", [["clickable", 14],["blank","8px","8px"],["clickable", 15],["blank","8px","8px"],["clickable", 16]]],
    ["blank","8px","8px"],
    ["row", [["clickable", 17],["blank","8px","8px"],["clickable", 18],["blank","8px","8px"],["clickable", 19]]],
    "blank",
    ["display-text",
      function() {
        return getText()
      },
    ],
  ],
  clickables: {
    11: {
      title(){
        return "Enter the new code."
      },
      display(){
        return (player.fun.input1.length > 0 ? "Currently: " + player.fun.input1 : "")
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        let x = prompt("Enter the code here, leave empty for stay as current one.", player.fun.input1)
        x = x.toLowerCase()
        if (x == null) x = ""
        if (x !== "") player.fun.input1 = x
        if (player.fun.input1 == "h0nde"){
          player.fun.h0ndepoints = 1-player.fun.h0ndepoints
        }
        if (player.fun.input1 == "crimson406" && player.p.bestBoughtUpgs >= 14){
          player.fun.crimsonnodes = 1-player.fun.crimsonnodes
        }
      },
      style: {"height": "150px", "width": "150px", "background-color": "red"},
    },
    12: {
      title(){
        return "Reset the current code."
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        player.fun.input1 = ""
        player.fun.input2 = ""
        
      },
      style: {"height": "150px", "width": "150px", "background-color": "orange"},
    },
    13: {
      title(){
        return "Remove all interface changes."
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        player.fun.h0ndepoints = 0
        player.fun.crimsonnodes = 0
        
      },
      style: {"height": "150px", "width": "150px", "background-color": "yellow"},
    },
    14: {
      title(){
        return (player.fun.producting_14 ? "Stop produce your points." : "Start produce your points.")
      },
      display(){
        let speed = player.fun.points.add(10).log(10).pow(player.b.points).mul(player.fun.points2).mul(new Decimal(10).pow(player.fun.points3.pow(3)))
        return (player.fun.producting_14 ? format(player.fun.points) + `<br>` + "(+" + format(speed) + "/s)" : "Require boosters unlocked")
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        if (!player.b.unlocked) return
        player.fun.producting_14 = 1-player.fun.producting_14
        if (player.fun.producting_14){

        } else {
          player.fun.points = new Decimal(1)
        }
      },
      style: {"height": "150px", "width": "150px", "background-color": "lime"},
    },
    15: {
      title(){
        return (player.fun.producting_15 ? "Stop produce your prestige points." : "Start produce your prestige points.")
      },
      display(){
        let exp = player.i.points.mul(player.fun.points2.log(10).add(10).log(10)).mul(player.fun.points3.add(1).pow(0.5))
        return (player.fun.producting_15 ? format(player.fun.points2) + `<br>` + " (Exponent: " + format(exp) + ")" : "Require infinity unlocked")
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        if (!player.i.unlocked) return
        player.fun.producting_15 = 1-player.fun.producting_15
        if (player.fun.producting_15){
          
        } else {
          player.fun.points2 = new Decimal(1)
        }
      },
      style: {"height": "150px", "width": "150px", "background-color": "cyan"},
    },
    16: {
      title(){
        return (player.fun.producting_16 ? "Stop produce your boosters." : "Start produce your boosters.")
      },
      display(){
        let speed = player.sp.total.add(1).max(1).log(10).mul(player.fun.points3.add(1))
        return (player.fun.producting_16 ? format(player.fun.points3, 3) + `<br>` + "(+" + format(speed) + "/s before log)" : "Require super prestige unlocked")
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){
        if (!player.sp.unlocked) return
        player.fun.producting_16 = 1-player.fun.producting_16
        if (player.fun.producting_16){
          
        } else {
          player.fun.points3 = new Decimal(0)
        }
      },
      style: {"height": "150px", "width": "150px", "background-color": "blue"},
    },
    17: {
      title(){
        return "Classified"
      },
      display(){
        return ""
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){

      },
      style: {"height": "150px", "width": "150px", "background-color": "#a020f0"},
    },
    18: {
      title(){
        return "Readcted"
      },
      display(){
        return ""
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){

      },
      style: {"height": "150px", "width": "150px", "background-color": "magenta"},
    },
    19: {
      title(){
        return "Coming Soon"
      },
      display(){
        return ""
      },
      unlocked() {return true},
      canClick() {return true},
      onClick(){

      },
      style: {"height": "150px", "width": "150px", "background-color": "white"},
    },
  },
})

function getText(){
  let output = ""
  let x = player.fun.input1.toLowerCase()
  if (x == "pointsexppow"){
    output = format(new Decimal(10).pow(player.points.log(10).pow(player.fun.points.slog(10).add(1))))
  }
  if (x == "pointssuperlog2"){
    output = format(player.points.slog(2), 15)
  }
  if (x == "pointstohypere"){
    let superlog = player.points.slog(10)
    let mod1 = superlog.sub(superlog.floor())
    if (superlog.gte(1e6)){
      output = "E" + format(superlog.log(10), 4) + "#1#2"
    } else if (superlog.gte(2)){
      output = "E" + format(new Decimal(10).pow(mod1), 4) + "#" + formatWhole(superlog.floor())
    } else if (superlog.gte(1)){
      output = "E" + format(player.points.log(10), 4)
    } else {
      output = format(player.points, 4)
    }
  }
  if (x == "pointstostandard"){
    let num = player.points
    let exponent = num.log10().div(3).floor();
    let mantissa = num.div(new Decimal(1000).pow(exponent))
    if (mantissa.gte(1000 - 10 ** -2 / 2)){
      mantissa = mantissa.div(1000)
      exponent = exponent.add(1)
    }
    let maxT1 = num.log10().sub(3).div(3).floor()
    let maxT2 = maxT1.log10().div(3).floor().toNumber()
    if (maxT1.lt(1e15)) maxT1 = maxT1.toNumber()
    else maxT1 = maxT1.div(new Decimal(1000).pow(maxT2 - 4)).floor().toNumber()
    let tril = Math.floor(maxT1/1e12)
    let bill = Math.floor(maxT1/1e9) % 1000
    let mill = Math.floor(maxT1/1e6) % 1000
    let kill = Math.floor(maxT1/1e3) % 1000
    let ones = maxT1 % 1000
    if (num.lt(1000 - 10 ** -2 / 2)){
      output = mantissa.toFixed(2)
    } else if (num.lt(new Decimal(1e33))) {
      output = mantissa.toFixed(2) + " " + standardPreE33[maxT1]
    } else if (num.lt(new Decimal(10).pow(3e15).mul(1000))) {
      output = mantissa.toFixed(2) + " " + standard(tril, 4, 1) + standard(bill, 3, 1) + standard(mill, 2, 1) + standard(kill, 1, 1) + standard(ones, 0, 0)
    } else if (num.lt(new Decimal(10).pow("3e3000").mul(1000))) {
      output = standard(tril, maxT2, (ones + kill + mill + bill !== 0 ? 1 : 0)) + standard(bill, maxT2 - 1, (ones + kill + mill !== 0 ? 1 : 0)) + standard(mill, maxT2 - 2, (ones + kill !== 0 ? 1 : 0)) + standard(kill, maxT2 - 3, (ones !== 0 ? 1 : 0)) + standard(ones, maxT2 - 4, 0) + "s"
    } else output = format(num)
  }
  if (x == "inf" || x == "infinity"){
    output = format(new Decimal(2).pow(1024))
  }
  if (x == "embi"){
    output = "DNA Ordinal"
  }
  if (x == "dnaordinal"){
    output = "Embi"
  }
  if (x == "rickroll"){
    output = `<a href="https://youtu.be/dQw4w9WgXcQ">https://youtu.be/dQw4w9WgXcQ</a>`
  }
  if (x == "boosterstetrate2" && player.b.unlocked){
    output = format(player.b.points.tetrate(2))
  }
  if (x == "infinitypointstetrate2" && player.i.unlocked){
    output = format(player.i.points.tetrate(2)) + " (which is equal to Infinity^" + format(player.i.points.tetrate(2).log(Number.MAX_VALUE), 6) + ")"
  }
  if (x == "acamaeda" && player.p.bestBoughtUpgs >= 2){
    output = "TMT Version: " + TMT_VERSION.tmtNum
  }
  if (x == "h0nde" && player.p.bestBoughtUpgs >= 8){
    output = "The resource name has changed to " + (player.fun.h0ndepoints ? "h0nde" : "points") + ", enter the same code will change back to " + (player.fun.h0ndepoints ? "points" : "h0nde")
  }
  if (x == "crimson406" && player.p.bestBoughtUpgs >= 14){
    output = "The prestige notes has changed to " + (player.fun.crimsonnodes ? "crimson" : "default") + ", enter the same code will change back to " + (player.fun.crimsonnodes ? "default" : "crimson")
  }
  if (x == "iemory" && player.p.bestBoughtUpgs >= 15){
    output = (player.fun.h0ndepoints ? "this hasn't been updated, I'm not sure why it says it has" : "smiley" + `<sup>` + formatWhole(new Decimal(totalQuestsCompletion()).pow(player.fun.points.slog(10).add(2))) + `</sup>`)
  }
  if (x == "pg132" && player.p.bestBoughtUpgs >= 22){
    output = (player.fun.crimsonnodes ? "pg132^132^" + format(player.fun.points.slog(10).add(1), 4) + " (or pg" + formatWhole(new Decimal(132).pow(new Decimal(132).pow(player.fun.points.slog(10).add(1)))) + ")" : "Ghotsify")
  }
  if (x == "roldo"){
    output = "Hidden Marble"
  }
  return output
}

const standardPreE33 = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"]
const standardUnits = ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"]
const standardTens = ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"]
const standardHundreds = ["", "Ct", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]
const standardMilestonePreEE33 = ["", "MI", "MC", "NA", "PC", "FM", "AT", "ZP", "YC", "XN", "VE"]
const standardMilestoneUnits = ["", "M", "D", "T", "TE", "P", "H", "HE", "O", "E", "VE"]
const standardMilestoneTens = ["", "E", "IS", "TN", "TEN", "PN", "HN", "HEN", "ON", "EN"]
const standardMilestoneHundreds = ["", "HT", "DT", "TT", "TET", "PT", "HT", "HET", "OT", "ET"]

function standard(t1, t2, more){
  t1 = t1 % 1000
  t2 = t2 % 1000
  if (t1 == 0) return ""
  let output1 = ""
  let output2 = ""
  if (t1 !== 1 || (t1 == 1 && t2 == 0)){
    let ones1 = t1 % 10
    let tens1 = Math.floor(t1 / 10) % 10
    let hundreds1 = Math.floor(t1 / 100)
    output1 = standardUnits[ones1] + standardTens[tens1] + standardHundreds[hundreds1]
  }
  if (t2 < 10.5) output2 = standardMilestonePreEE33[t2]
  else{
    let mod100 = t2 % 100
    let ones2 = t2 % 10
    let tens2 = Math.floor(t2 / 10) % 10
    let hundreds2 = Math.floor(t2 / 100)
    if (mod100 < 10.5) output2 = standardMilestoneUnits[mod100] + standardMilestoneHundreds[hundreds2]
    else output2 = standardMilestoneUnits[ones2] + standardMilestoneTens[tens2] + standardMilestoneHundreds[hundreds2]
  }
  return output1 + output2 + (more && t2 !== 0 ? "-" : "")
}