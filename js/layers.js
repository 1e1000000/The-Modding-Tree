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
          cost: new Decimal(1),
        },
        12: {
          title: "(Normal-2) Acamaeda",
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
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 12)) + "x" + (upgradeEffect("p", 12).gte(tmp.p.upgrades[12].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 11)},
        },
        13: {
          title: "(Normal-3) thefinaluptake",
          description(){
            return "The first user to create TMT fork. and maker of The Burning Tree, multiply points gain by log2(points+2)"
          },
          cost: new Decimal(10),
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
          cost: new Decimal(50),
          effect(){
            let eff = player.p.points.add(1).pow(0.5)
            if (eff.gte(tmp.p.upgrades[14].effectSCStart)) eff = new Decimal(10).pow(new Decimal(tmp.p.upgrades[14].effectSCStart.log(10)).mul(eff.log(10).div(tmp.p.upgrades[14].effectSCStart.log(10)).pow(0.5)))
            return eff
          },
          effectSCStart(){
            let sc = new Decimal("1e5000")
            return sc
          },
          effectDisplay(){return format(upgradeEffect("p", 14)) + "x" + (upgradeEffect("p", 14).gte(tmp.p.upgrades[14].effectSCStart) ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 13)},
        },
        15: {
          title: "(Normal-5) Katakana1",
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
          title: "(Normal-6) okamii17",
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
          title: "(Normal-7) Letorin",
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
          title: "(Normal-8) thepaperpilot",
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
          title: "(Normal-9) Dystopia-user181",
          description(){
            return "The maker of Factoree. ^1.81 " + `<b>Normal-3</b>` + " and " + `<b>Normal-5</b>` + " effect"
          },
          cost: new Decimal(4e5),
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
          cost: new Decimal(3e6),
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
          title: "(Normal-12) Some-random-guy7718",
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
          title: "(Normal-13) jgdovin",
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
          title: "(Normal-14) Crimson4061",
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
          title: "(Normal-15) IEmory",
          description(){
            let d = Math.floor((Date.now() - 1616601600000) / 86400000)
            let x = formatWhole(d) + " days"
            if (d % 7 == 0) x = formatWhole(d/7) + " weeks"
            if (d % 30 == 0) x = formatWhole(d/30) + " months"
            if (d % 365 == 0) x = formatWhole(d/365) + " years"
            return "He is smiley, but he already leave discord for around " + x + ". unlock Quests (permanently keep), " + `<b>Normal-5</b>` + " now stacks multiplicatively"
          },
          cost: new Decimal(5e16),
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
          title: "(Normal-17) gapples2",
          description(){
            return "The Tree is so basic... with many mods. square " + `<b>Normal-3</b>` + " and " + `<b>Normal-7</b>` +" effect"
          },
          cost: new Decimal(3e23),
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
          cost: new Decimal(1e31),
          effect(){
            let eff = player.points.add(1).pow(0.05)
            if (eff.gte("1e2000")) eff = new Decimal(10).pow(new Decimal(2000).mul(eff.log(10).div(2000).pow(0.5)))
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 43)) + "x" + (upgradeEffect("p", 43).gte("1e2000") ? " (softcapped)" : "")},
          unlocked(){return hasUpgrade("p", 42)},
        },
        44: {
          title: "(Normal-19) Grodvert",
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
          title: "(Normal-20) Cubedey",
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
          title: "(Normal-21) Pikiquouik",
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
          title: "(Normal-22) pg132",
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
          title: "(Normal-23) MCKight",
          description(){
            return "Nothing Special. Total Quests completion boosts points gain"
          },
          cost: new Decimal(5e132),
          effect(){
            let x = new Decimal(totalQuestsCompletion())
            if (hasUpgrade("p", 82)) x = x.pow(upgradeEffect("p", 82))
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
          cost: new Decimal(3e144),
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
          cost: new Decimal(5e160),
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
          cost: new Decimal(1e199),
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
          cost: new Decimal(4e226),
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
          cost: new Decimal(6e283),
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
          cost: new Decimal("3e325"),
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
          cost: new Decimal("3e474"),
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
          cost: new Decimal("1e613"),
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
          cost: new Decimal("8e808"),
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
          cost: new Decimal("1e2009"),
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
          cost: new Decimal("1e3447"),
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
          cost: new Decimal("1e3866"),
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
          cost: new Decimal("1e5575"),
          effect(){
            let eff = new Decimal(8.9)
            return eff
          },
          unlocked(){return hasUpgrade("p", 75)},
        },
        82: {
          title: "(Normal-37) AbitofTetration",
          description(){
            return "The only completed mod that make by despacit2.0. " + `<b>Normal-23</b>` + " effect exponent ^" + format(2**0.5)
          },
          cost: new Decimal("1e8500"),
          effect(){
            let eff = new Decimal(2).pow(0.5)
            return eff
          },
          unlocked(){return hasUpgrade("p", 81)},
        },
        83: {
          title: "(Normal-38) OhManLolLol",
          description(){
            return "stupidity = braincells. increase Achievement 13 reward achievement exponent by " + format(tmp.p.upgrades[83].effectBase) + " for every Infinity Point (softcapped at 100)"
          },
          cost: new Decimal("1e11350"),
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
          cost: new Decimal("1e11775"),
          effect(){
            let eff = [player.b.points.add(1), new Decimal(1e5)]
            return eff
          },
          effectDisplay(){return format(upgradeEffect("p", 84)[0]) + "x"},
          unlocked(){return hasUpgrade("p", 83)},
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
      if (hasUpgrade("sp", 25)) mult = mult.mul(upgradeEffect("sp", 25)[0])
      if (hasAchievement("a", 33)) mult = mult.mul(achievementEffect("a", 33))
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
      let SCStart = new Decimal(256)
      if (x.gte(SCStart)) x = x.div(SCStart).pow(0.5).mul(SCStart)
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
      return " which multiply points gain by " + format(tmp.b.effect) + (tmp.b.effect.gte(tmp.b.effectSCStart) ? " (softcapped)" : "") + " (effect base: " + format(tmp.b.effectBase) + ")"
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
  color: "#278b8c",
  requires: new Decimal("1e1297"), // Can be a function that takes requirement increases into account
  resource: "super prestige points", // Name of prestige currency
  baseResource: "prestige points", // Name of resource prestige is based on
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
        return "Multiply points gain by " + format(tmp.sp.upgrades[11].effectBase) + " for every second^" + format(tmp.sp.upgrades[11].effectExp) + " of prestige, with a maximum of " + format(tmp.sp.upgrades[11].timeCap) + " seconds (only work while outside quests)"
      },
      cost: new Decimal(1),
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
        return `<b>Normal-2</b>` + " affect PP gain with reduced effect"
      },
      cost: new Decimal(10),
      effect(){
        let eff = upgradeEffect("p", 12).pow(0.2).max(1)
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 12)) + "x"},
      unlocked(){return hasUpgrade("sp", 11) && player.i.points.gte(12)},
    },
    13: {
      title: "(Super-3) thefinaluptake",
      description(){
        return "Multiply PP gain by log2(PP+2)^20"
      },
      cost: new Decimal(50),
      effect(){
        let eff = player.p.points.add(2).log(2).pow(20)
        if (hasUpgrade("sp", 25)) eff = eff.pow(upgradeEffect("sp", 25)[1])
        return eff
      },
      effectDisplay(){return format(upgradeEffect("sp", 13)) + "x"},
      unlocked(){return hasUpgrade("sp", 12) && player.i.points.gte(13)},
    },
    14: {
      title: "(Super-4) Menohe",
      description(){
        return "Multiply PP gain by (SP+1)^50"
      },
      cost: new Decimal(1000),
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
        return "+" + format(tmp.sp.upgrades[15].effectBase.mul(100)) + "% SP gain for every Super Prestige Upgrade bought (stacks additively)"
      },
      cost: new Decimal(8000),
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
        return "Multiply SP gain by 17 and multiply " + `<b>Super-1</b>` + " time amount from reset time by 1.7"
      },
      cost: new Decimal(50000),
      effect(){
        let eff = [new Decimal(17), new Decimal(1.7)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 15)},
    },
    22: {
      title: "(Super-7) Letorin",
      description(){
        return "Multiply SP gain by IP+1 and add " + `<b>Super-1</b>` + " time by sqrt(Boosters)"
      },
      cost: new Decimal(3e7),
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
        return "Multiply SP gain by 10 and " + `<b>Super-4</b>` + " affect points gain, but with reduced effect"
      },
      cost: new Decimal(5e9),
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
        return "^1.81 " + `<b>Super-1</b>` + " base and " + `<b>Super-5</b>` + " effect"
      },
      cost: new Decimal(5e11),
      effect(){
        let eff = new Decimal(1.81)
        return eff
      },
      unlocked(){return hasUpgrade("sp", 23)},
    },
    25: {
      title: "(Super-10) E3XA",
      description(){
        return "You gain 3% more boosters, " + `<b>Super-3</b>` + " effect is cubed"
      },
      cost: new Decimal(1e17),
      effect(){
        let eff = [new Decimal(1.03), new Decimal(3)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 24)},
    },
    31: {
      title: "(Super-11) MocyaTheMole",
      description(){
        return "3x " + `<b>Super-1</b>` + " time amount from reset time, 2x time cap and 1.5x extra time amount"
      },
      cost: new Decimal(2e21),
      effect(){
        let eff = [new Decimal(3), new Decimal(2), new Decimal(1.5)]
        return eff
      },
      unlocked(){return hasUpgrade("sp", 25)},
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
            return (player.a.achievements.length + " Achievements")
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
                  if (hasUpgrade("p", 83)) exp = exp.add(upgradeEffect("p", 83))
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
              tooltip(){return "Reach 111 Boosters. Reward: Autobuy Boosters and they resets nothing"},
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
  let array = [11,12,21,22,31]
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
  let e = Math.max(Math.floor(-0.5+(0.25+2*d)**0.5), 0)
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
        return (formatWhole(totalQuestsCompletion()) + "/" + formatWhole(player.q.questUnlocked*10) + " Quests")
    },
		tabFormat: [
        ["display-text",
         function() { return "Note: All Quests completions is never getting reset"}],
        ["display-text",
         function() { return "Unlocked Quests: " + formatWhole(player.q.questUnlocked) + " (Next at " + formatWhole(getNextQuestReq()) + " Bought Prestige Upgrades, Currently " + format(player.p.upgrades.length) + ")"}],
        ["display-text",
         function() { return "Total Quests completion: " + formatWhole(totalQuestsCompletion())}],
		  	"blank",
			  "challenges",
		],
    update(diff){
        if (hasUpgrade("p", 35)) player.q.unlocked = true
        player.q.questUnlocked = Math.max(getUnlockedQuests(), player.q.questUnlocked)
    },
    challenges: {
      11: {
        name: "TreeQuest 1",
        challengeDescription(){return "Do a forced row 1 reset, " + `<b>Normal-2</b>` + " have no effect, points gain is square rooted." + `<br>` + 
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
        rewardDescription(){return `<b>Normal-2</b>` + " amount " + (maxedChallenge("q", 11) ? "": "past 10 ") + "is " + format(challengeEffect("q", 11)[0]) + "x higher" + (maxedChallenge("q", 11) ? " and the amount before multiplier is raised to the power of " + format(challengeEffect("q", 11)[1]) + ".": ".")},
        rewardEffect(){
          let eff = [new Decimal(challengeCompletions("q", 11)).min(9).add(1), new Decimal(1.1)]
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
        goalDescription(){return format(tmp.q.challenges[12].goal) + " points"},
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
        goalDescription(){return format(tmp.q.challenges[21].goal) + " points"},
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
          if (challengeCompletions("q", 22) >= 5) scaling = scaling.mul(1.065)
          if (challengeCompletions("q", 22) >= 8) scaling = scaling.pow(1.25)
          let goal = new Decimal(10).pow(new Decimal(37.5).mul(new Decimal(scaling).pow(challengeCompletions("q", 22))))
          if (challengeCompletions("q", 22) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Multiply PP gain by " + format(challengeEffect("q", 22)[0]) + (maxedChallenge("q", 22) ? " and raise points gain to the power of " + challengeEffect("q", 22)[1] : ".")},
        rewardEffect(){
          let eff = [new Decimal(10).pow(new Decimal(challengeCompletions("q", 22)).pow(inChallenge("q", 22)?1:2).mul(10)), new Decimal(1.05)]
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
        goalDescription(){return format(tmp.q.challenges[31].goal) + " points"},
        goal(){
          let scaling = new Decimal(1.25).add(new Decimal(challengeCompletions("q", 31)).div(25))
          let goal = new Decimal(10).pow(new Decimal(183).mul(new Decimal(scaling).pow(challengeCompletions("q", 31))))
          if (hasUpgrade("p", 84)) goal = goal.div(upgradeEffect("p", 84)[1])
          if (challengeCompletions("q", 31) >= 10) goal = new Decimal(Infinity)
          return goal
        },
        rewardDescription(){return "Increase PP gain exponent by " + format(challengeEffect("q", 31)[0]) + (maxedChallenge("q", 31) ? " and multiply points and PP gain by " + challengeEffect("q", 31)[1] : ".")},
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
      return ("Statistics")
  },
  tabFormat: [
    "blank",
    ["display-text",
    function() {
      return `<b>Points:</b>` + `<br>` + 
      format(player.points) + " (" + format(getPointGen()) + "/sec)" + `<br>` + 
      "Gain formula:" + `<br>` + 
      "(10^(log10(" + format(getPointGainMul()) + ")^" + format(getPointGainExpPow(), 3) + "))^" + format(getPointGainPow(), 3)},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.p.unlocked ? `<b>Prestige Points:</b>` + `<br>` + 
      formatWhole(player.p.points) + " (" + (tmp.p.passiveGeneration == 0 ? "+" + format(tmp.p.resetGain) + ")" : format(tmp.p.resetGain.mul(tmp.p.passiveGeneration)) + "/sec)") + `<br>` + 
      "Gain formula:" + `<br>` + 
      "((points/" + format(tmp.p.requires) + ")^" + format(tmp.p.exponent) + "*" + format(tmp.p.gainMult) + ")^" + format(tmp.p.gainExp, 3) + `<br>` + 
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
      format(tmp.b.requires) + "*" + format(tmp.b.base) + "^((boosters/" + format(tmp.b.directMult, 3) + ")^" + format(tmp.b.exponent, 3) + ")/" + format(tmp.b.gainMult.recip()) : "")},
    ],
    "blank",
    ["display-text",
    function() {
      return (player.sp.unlocked ? `<b>Super Prestige Points:</b>` + `<br>` + 
      formatWhole(player.sp.points) + " (" + (tmp.sp.passiveGeneration == 0 ? "+" + format(tmp.sp.resetGain) + ")" : format(tmp.sp.resetGain.mul(tmp.sp.passiveGeneration)) + "/sec)") + `<br>` + 
      "Gain formula:" + `<br>` + 
      "((prestige points/" + format(tmp.sp.requires) + ")^" + format(tmp.sp.exponent) + "*" + format(tmp.sp.gainMult) + ")^" + format(tmp.sp.gainExp, 3) + `<br>` + 
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
      format(tmp.i.requires) + "*" + format(tmp.i.base) + "^((boosters/" + format(tmp.i.directMult, 3) + ")^" + format(tmp.i.exponent, 3) + ")/" + format(tmp.i.gainMult.recip()) : "")},
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
      (player.q.questUnlocked >= 5 ? "TreeQuest 5: " + formatWhole(player.q.challenges[31]) + "/10" + (maxedChallenge("q", 31) ? " (Maxed)" : " (Next: " + format(tmp.q.challenges[31].goal) + ")") : "") : "")},
    ],"blank","blank","blank",
  ]
})