addLayer("r", {
    name: "rank", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        ranks: [
            [
                null,
                [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // rank
                [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // prestige
                [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // ascension
            ],
            [
                null,
                [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // aperion rank
            ],
        ],
        alwaysReset: false,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff){
        //player.devSpeed = (options.pause?1e-300:1)
    },
    automate(){
        if (tmp.r.clickables[11].unlocked && tmp.r.clickables['a11'].unlocked && player.auto.ranks[0][1][1]) tmp.r.clickables[11].onClick(true)
        if (tmp.r.clickables[12].unlocked && tmp.r.clickables['a12'].unlocked && player.auto.ranks[0][1][2]) tmp.r.clickables[12].onClick(true)
        if (tmp.r.clickables[13].unlocked && tmp.r.clickables['a13'].unlocked && player.auto.ranks[0][1][3]) tmp.r.clickables[13].onClick(true)

        if (tmp.r.clickables[21].unlocked && tmp.r.clickables['a21'].unlocked && player.auto.ranks[0][2][1]) tmp.r.clickables[21].onClick(true)
        if (tmp.r.clickables[22].unlocked && tmp.r.clickables['a22'].unlocked && player.auto.ranks[0][2][2]) tmp.r.clickables[22].onClick(true)
        if (tmp.r.clickables[23].unlocked && tmp.r.clickables['a23'].unlocked && player.auto.ranks[0][2][3]) tmp.r.clickables[23].onClick(true)

        if (tmp.r.clickables[31].unlocked && tmp.r.clickables['a31'].unlocked && player.auto.ranks[0][3][1]) tmp.r.clickables[31].onClick(true)
        if (tmp.r.clickables[32].unlocked && tmp.r.clickables['a32'].unlocked && player.auto.ranks[0][3][2]) tmp.r.clickables[32].onClick(true)

        if (tmp.r.clickables[111].unlocked && tmp.r.clickables['a111'].unlocked && player.auto.ranks[1][1][1]) tmp.r.clickables[111].onClick(true)
        if (tmp.r.clickables[112].unlocked && tmp.r.clickables['a112'].unlocked && player.auto.ranks[1][1][2]) tmp.r.clickables[112].onClick(true)
        if (tmp.r.clickables[113].unlocked && tmp.r.clickables['a113'].unlocked && player.auto.ranks[1][1][3]) tmp.r.clickables[113].onClick(true)
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
      
        let keep = [];

        layerDataReset(this.layer, keep);
    },
    layerShown(){return true},
    tooltip(){return "Ranks"},
    tabFormat:{
        "Maximize":{
            content:[
                ["display-text",function(){return "You have <h1 style='color:red'>" + format(player.points) + "</h1> points."}],
                ["row",[
                    ["column",[["clickable",11],["clickable",'a11']]],
                    ["column",[["clickable",12],["clickable",'a12']]],
                    ["column",[["clickable",13],["clickable",'a13']]],
                ]],
                ["display-text",function(){return "Rank worth: <b style='color:red'>" + format(getRankWorth(player.r.ranks[0][1][1]),4) + "</b>. (based on Rank)"}],
                
                ["display-text",function(){return hasAchievement('ach',14)?("<br>Your Prestige Base is <h1 style='color:orange'>" + format(tmp.r.getPrestigeBase) + "</h1>. (based on product of Rank Tiers)"):""}],
                ["row",[
                    ["column",[["clickable",21],["clickable",'a21']]],
                    ["column",[["clickable",22],["clickable",'a22']]],
                    ["column",[["clickable",23],["clickable",'a23']]],
                ]],
                ["display-text",function(){return hasAchievement('ach',14)?("Prestige worth: <b style='color:orange'>" + format(getRankWorth(player.r.ranks[0][2][1]),4) + "</b>. (based on Prestige)"):""}],
                
                ["display-text",function(){return hasAchievement('ach',32)?("<br>Your Ascension Base is <h1 style='color:yellow'>" + format(tmp.r.getAscensionBase) + "</h1>. (based on product of Prestige Tiers)"):""}],
                ["row",[
                    ["column",[["clickable",31],["clickable",'a31']]],
                    ["column",[["clickable",32],["clickable",'a32']]],
                ]],
                ["display-text",function(){return hasAchievement('ach',32)?("Ascension worth: <b style='color:yellow'>" + format(getRankWorth(player.r.ranks[0][3][1]),4) + "</b>. (based on Ascension)"):""}],
                
                "blank","blank",
                ["clickable",'alwaysReset'],
            ],
            style(){return {"background-color": "#000000"}},
            unlocked(){return true},
        },
        "Aperion":{
            content:[
                ["display-text",function(){return "Your Aperion Rank Base is <h1 style='color:red'>" + format(tmp.r.getAperionRankBase,4) + "</h1>. (based on product of Maximize Layer's worth)"}],
                ["row",[
                    ["column",[["clickable",111],["clickable",'a111']]],
                    ["column",[["clickable",112],["clickable",'a112']]],
                    ["column",[["clickable",113],["clickable",'a113']]],
                ]],
                //["display-text",function(){return "Rank worth: <b style='color:red'>" + format(getRankWorth(player.r.ranks[0][1][1]),4) + "</b>. (based on Rank)"}],
                
                "blank","blank",
                ["clickable",'alwaysReset'],
            ],
            buttonStyle(){return {"border-color": "#ff0000","color": "#ff0000"}},
            style(){return {"background-color": "#1f0000"}},
            unlocked(){return hasAchievement('ach',24)},
        },
    },
    getPrestigeBase(){
        let x = new Decimal(1)
        for (let i=1;i<=player.r.ranks[0][1].length-1;i++){
            x = x.mul(player.r.ranks[0][1][i].add(1))
        }
        return x
    },
    getAscensionBase(){
        let x = new Decimal(1)
        for (let i=1;i<=player.r.ranks[0][2].length-1;i++){
            x = x.mul(player.r.ranks[0][2][i].add(1))
        }
        return x
    },
    getAperionRankBase(){
        let x = new Decimal(1)
        let amt = new Decimal(0)
        for (let i=1;i<=player.r.ranks[0].length-1;i++){
            amt = player.r.ranks[0][i][1].max(0)

            x = x.mul(getRankWorth(amt))
        }
        return x
    },
    rankEffectExpBase(){
        let b = [new Decimal(2),new Decimal(1)] // ^b[0]^(x-1) based on layer, ^(x)^b[1] based on tier
        if (getBuyableAmount('n','null').gte(1)) b[0] = b[0].max(buyableEffect('n','null')[1])

        if (getBuyableAmount('n','null').gte(3)) b[1] = b[1].max(buyableEffect('n','null')[3])

        return b
    },
    aperionRankEffectExpBase(){
        let b = [new Decimal(2),new Decimal(1)] // ^b[0]^(x-1) based on layer, ^(x)^b[1] based on tier

        if (getBuyableAmount('n','null').gte(6)) b[1] = b[1].max(buyableEffect('n','null')[4])

        return b
    },
    aperionRankEffectBase(){
        let b = new Decimal(2)
        if (getBuyableAmount('n','null').gte(2)) b = b.max(buyableEffect('n','null')[2])

        return b
    },
    clickables:{
        //ranks
        11:{
            title(){return "Rank <h2>" + formatWhole(player.r.ranks[0][1][1]) + "</h2>"},
            display(){
                return "Require <b>" + format(this.req()) + "</b> points<br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.points.gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',1)){
                        player.r.ranks[0][1][1] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][1][1] = player.r.ranks[0][1][1].add(1)
                    }
                    if (!hasMilestone('n',101) || player.r.alwaysReset){
                        resetRanks(1,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][1][1].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.points.add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][1][1])
            },
            effectExp(){
                let x = new Decimal(1).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][1][1].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return true},
            style(){
                let color = (this.canClick()?"#ff7f7f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        12:{
            title(){return "Tier <h2>" + formatWhole(player.r.ranks[0][1][2]) + "</h2>"},
            display(){
                return "Require Rank <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[0][1][1].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',3)){
                        player.r.ranks[0][1][2] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][1][2] = player.r.ranks[0][1][2].add(1)
                    }
                    if (!hasMilestone('n',102) || player.r.alwaysReset){
                        resetRanks(2,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][1][2].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[0][1][1].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][1][2])
            },
            effectExp(){
                let x = new Decimal(2).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][1][2].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',11)},
            style(){
                let color = (this.canClick()?"#ff3f3f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        13:{
            title(){return "Tetr <h2>" + formatWhole(player.r.ranks[0][1][3]) + "</h2>"},
            display(){
                return "Require Tier <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[0][1][2].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (false){
                        player.r.ranks[0][1][3] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][1][3] = player.r.ranks[0][1][3].add(1)
                    }
                    if (!hasMilestone('n',104) || player.r.alwaysReset){
                        resetRanks(3,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][1][3].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[0][1][2].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][1][3])
            },
            effectExp(){
                let x = new Decimal(3).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][1][3].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',13)},
            style(){
                let color = (this.canClick()?"#ff0000":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        
        21:{
            title(){return "Prestige <h2>" + formatWhole(player.r.ranks[0][2][1]) + "</h2>"},
            display(){
                return "Require <b>" + format(this.req()) + "</b> Prestige Base<br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return tmp.r.getPrestigeBase.gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',2)){
                        player.r.ranks[0][2][1] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][2][1] = player.r.ranks[0][2][1].add(1)
                    }
                    if (!hasMilestone('n',103) || player.r.alwaysReset){
                        resetRanks(1,2)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(72) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                if (getBuyableAmount('n','null').gte(8)) start = start.div(buyableEffect('n','null')[6])

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][2][1].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = tmp.r.getPrestigeBase.add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][2][1])
            },
            effectExp(){
                let x = new Decimal(1).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(1)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][2][1].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',14)},
            style(){
                let color = (this.canClick()?"#ffbf7f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        22:{
            title(){return "Honor <h2>" + formatWhole(player.r.ranks[0][2][2]) + "</h2>"},
            display(){
                return "Require Prestige <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[0][2][1].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',4)){
                        player.r.ranks[0][2][2] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][2][2] = player.r.ranks[0][2][2].add(1)
                    }
                    if (!hasMilestone('n',105) || player.r.alwaysReset){
                        resetRanks(2,2)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][2][2].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[0][2][1].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][2][2])
            },
            effectExp(){
                let x = new Decimal(2).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(1)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][2][2].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',21)},
            style(){
                let color = (this.canClick()?"#ff9f3f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        23:{
            title(){return "Glory <h2>" + formatWhole(player.r.ranks[0][2][3]) + "</h2>"},
            display(){
                return "Require Honor <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[0][2][2].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (false){
                        player.r.ranks[0][2][3] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][2][3] = player.r.ranks[0][2][3].add(1)
                    }
                    if (!hasMilestone('n',107) || player.r.alwaysReset){
                        resetRanks(3,2)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][2][3].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[0][2][2].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][2][3])
            },
            effectExp(){
                let x = new Decimal(3).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(1)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][2][3].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',23)},
            style(){
                let color = (this.canClick()?"#ff7f00":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        
        31:{
            title(){return "Ascension <h2>" + formatWhole(player.r.ranks[0][3][1]) + "</h2>"},
            display(){
                return "Require <b>" + format(this.req()) + " Ascension Base</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return tmp.r.getAscensionBase.gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',6)){
                        player.r.ranks[0][3][1] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][3][1] = player.r.ranks[0][3][1].add(1)
                    }
                    if (!hasMilestone('n',106) || player.r.alwaysReset){
                        resetRanks(1,3)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(72) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][3][1].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = tmp.r.getAscensionBase.add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][3][1])
            },
            effectExp(){
                let x = new Decimal(1).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(2)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][3][1].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',32)},
            style(){
                let color = (this.canClick()?"#ffff7f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        32:{
            title(){return "Transcension <h2>" + formatWhole(player.r.ranks[0][3][2]) + "</h2>"},
            display(){
                return "Require Ascension <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[0][3][1].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (false){
                        player.r.ranks[0][3][2] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[0][3][2] = player.r.ranks[0][3][2].add(1)
                    }
                    if (!hasMilestone('n',109) || player.r.alwaysReset){
                        resetRanks(2,3)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[0][3][2].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[0][3][1].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[0][3][2])
            },
            effectExp(){
                let x = new Decimal(2).pow(tmp.r.rankEffectExpBase[1])
                let y = tmp.r.rankEffectExpBase[0].pow(2)
                return x.mul(y)
            },
            effect(){
                let eff = player.r.ranks[0][3][2].add(1)
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',33)},
            style(){
                let color = (this.canClick()?"#ffff3f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },


        111:{
            title(){return "Aperion Rank <h2>" + formatWhole(player.r.ranks[1][1][1]) + "</h2>"},
            display(){
                return "Require <b>" + format(this.req()) + "</b> Aperion Rank Base<br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return tmp.r.getAperionRankBase.gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',5)){
                        player.r.ranks[1][1][1] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[1][1][1] = player.r.ranks[1][1][1].add(1)
                    }
                    if (!hasMilestone('n',108) || player.r.alwaysReset){
                        resetRanks(1,1,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(16) // cost for the first stuff
                let scale = new Decimal(1.5) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][1][1].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = tmp.r.getAperionRankBase.add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[1][1][1])
            },
            effectExp(){
                let x = new Decimal(1).pow(tmp.r.aperionRankEffectExpBase[1])
                let y = tmp.r.aperionRankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let b = tmp.r.aperionRankEffectBase
                let eff = Decimal.pow(b,player.r.ranks[1][1][1])
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',24)},
            style(){
                let color = (this.canClick()?"#ff7f7f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        112:{
            title(){return "Aperion Tier <h2>" + formatWhole(player.r.ranks[1][1][2]) + "</h2>"},
            display(){
                return "Require Aperion Rank <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[1][1][1].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (hasMilestone('n',6)){
                        player.r.ranks[1][1][2] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[1][1][2] = player.r.ranks[1][1][2].add(1)
                    }
                    if (!hasMilestone('n',109) || player.r.alwaysReset){
                        resetRanks(2,1,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(2) // cost for the first stuff
                let scale = new Decimal(2) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][1][2].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[1][1][1].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[1][1][2])
            },
            effectExp(){
                let x = new Decimal(2).pow(tmp.r.aperionRankEffectExpBase[1])
                let y = tmp.r.aperionRankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let b = tmp.r.aperionRankEffectBase
                let eff = Decimal.pow(b,player.r.ranks[1][1][2])
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',25)},
            style(){
                let color = (this.canClick()?"#ff3f3f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },
        113:{
            title(){return "Aperion Tetr <h2>" + formatWhole(player.r.ranks[1][1][3]) + "</h2>"},
            display(){
                return "Require Aperion Tier <b>" + formatWhole(this.req()) + "</b><br>"+
                "Effect: Points gain x<b>" + format(this.effect()) + "</b>"
            },
            canClick(){
                return player.r.ranks[1][1][2].gte(this.req()) && this.unlocked()
            },
            onClick(auto=false){
                if (this.canClick){
                    if (false){
                        player.r.ranks[1][1][3] = auto?this.bulk:this.bulk()
                    } else {
                        player.r.ranks[1][1][3] = player.r.ranks[1][1][3].add(1)
                    }
                    if (true || player.r.alwaysReset){
                        resetRanks(3,1,1)
                        player.points = new Decimal(0)
                    }
                    updateTemp()
                }
            },
            onHold(){this.onClick()},
            scale(){
                let start = new Decimal(3) // cost for the first stuff
                let scale = new Decimal(3) // cost multiplier per stuff
                let multi = new Decimal(1) // amount multiplier, essentally root the scale

                return {start: start, scale: scale, multi: multi}
            },
            req(){
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return start.mul(scale.pow(player.r.ranks[1][1][3].div(multi))).sub(1e-10)
            },
            bulk(){
                let res = player.r.ranks[1][1][2].add(1e-10)
                let start = this.scale().start
                let scale = this.scale().scale
                let multi = this.scale().multi

                return res.div(start).log(scale).mul(multi).add(1).floor().max(player.r.ranks[1][1][3])
            },
            effectExp(){
                let x = new Decimal(3).pow(tmp.r.aperionRankEffectExpBase[1])
                let y = tmp.r.aperionRankEffectExpBase[0].pow(0)
                return x.mul(y)
            },
            effect(){
                let b = tmp.r.aperionRankEffectBase
                let eff = Decimal.pow(b,player.r.ranks[1][1][3])
                return eff.pow(this.effectExp())
            },
            unlocked(){return hasAchievement('ach',44)},
            style(){
                let color = (this.canClick()?"#ff3f3f":"#bf8f8f")
                return {'width':'180px','height':'180px','background-color':color}
            },
        },

        // automations
        a11:{
            title(){return "Auto: " + (player.auto.ranks[0][1][1]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][1][1] = Boolean(1-player.auto.ranks[0][1][1])
            },
            canClick(){return hasMilestone('n',101)},
            unlocked(){return hasMilestone('n',101)},
            style(){
                let color = "#ff7f7f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a12:{
            title(){return "Auto: " + (player.auto.ranks[0][1][2]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][1][2] = Boolean(1-player.auto.ranks[0][1][2])
            },
            canClick(){return hasMilestone('n',102)},
            unlocked(){return hasMilestone('n',102)},
            style(){
                let color = "#ff3f3f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a13:{
            title(){return "Auto: " + (player.auto.ranks[0][1][3]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][1][3] = Boolean(1-player.auto.ranks[0][1][3])
            },
            canClick(){return hasMilestone('n',104)},
            unlocked(){return hasMilestone('n',104)},
            style(){
                let color = "#ff0000"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },

        a21:{
            title(){return "Auto: " + (player.auto.ranks[0][2][1]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][2][1] = Boolean(1-player.auto.ranks[0][2][1])
            },
            canClick(){return hasMilestone('n',103)},
            unlocked(){return hasMilestone('n',103)},
            style(){
                let color = "#ffbf7f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a22:{
            title(){return "Auto: " + (player.auto.ranks[0][2][2]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][2][2] = Boolean(1-player.auto.ranks[0][2][2])
            },
            canClick(){return hasMilestone('n',105)},
            unlocked(){return hasMilestone('n',105)},
            style(){
                let color = "#ff9f3f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a23:{
            title(){return "Auto: " + (player.auto.ranks[0][2][3]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][2][3] = Boolean(1-player.auto.ranks[0][2][3])
            },
            canClick(){return hasMilestone('n',107)},
            unlocked(){return hasMilestone('n',107)},
            style(){
                let color = "#ff7f00"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },

        a31:{
            title(){return "Auto: " + (player.auto.ranks[0][3][1]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][3][1] = Boolean(1-player.auto.ranks[0][3][1])
            },
            canClick(){return hasMilestone('n',106)},
            unlocked(){return hasMilestone('n',106)},
            style(){
                let color = "#ffff7f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a32:{
            title(){return "Auto: " + (player.auto.ranks[0][3][2]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[0][3][2] = Boolean(1-player.auto.ranks[0][3][2])
            },
            canClick(){return hasMilestone('n',109)},
            unlocked(){return hasMilestone('n',109)},
            style(){
                let color = "#ffff3f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },


        a111:{
            title(){return "Auto: " + (player.auto.ranks[1][1][1]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[1][1][1] = Boolean(1-player.auto.ranks[1][1][1])
            },
            canClick(){return hasMilestone('n',108)},
            unlocked(){return hasMilestone('n',108)},
            style(){
                let color = "#ff7f7f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a112:{
            title(){return "Auto: " + (player.auto.ranks[1][1][2]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[1][1][2] = Boolean(1-player.auto.ranks[1][1][2])
            },
            canClick(){return hasMilestone('n',109)},
            unlocked(){return hasMilestone('n',109)},
            style(){
                let color = "#ff3f3f"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },
        a113:{
            title(){return "Auto: " + (player.auto.ranks[1][1][3]?"ON":"OFF")},
            onClick(){
                player.auto.ranks[1][1][3] = Boolean(1-player.auto.ranks[1][1][3])
            },
            canClick(){return false},
            unlocked(){return false},
            style(){
                let color = "#ff0000"
                return {'width':'180px','height':'30px','min-height':'30px','background-color':color}
            },
        },

        // misc
        'alwaysReset':{
            title(){return "Always reset Points/Ranks on Rank+ Up: " + (player.r.alwaysReset?"Enabled":"Disabled")},
            onClick(){
                player.r.alwaysReset = Boolean(1-player.r.alwaysReset)
            },
            canClick(){return hasMilestone('n',101)},
            unlocked(){return hasMilestone('n',101)},
            style(){
                let color = "#ffffff"
                return {'width':'540px','height':'60px','min-height':'30px','background-color':color}
            },
        }
    },
})

addLayer("n", {
    name: "null", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FF0000",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "null points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = player.r.ranks[0][1][1].div(50)
        if (getBuyableAmount('n','null').gte(11)) mult = mult.mul(buyableEffect('n','null')[7])
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    canReset(){return getResetGain('n').gte(1) && player.r.ranks[1][1][1].gte(1)},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for null points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff){

    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
      
        let keep = [];

        layerDataReset(this.layer, keep);
    },
    effect(){
        let eff = player.n.points.max(0).add(1)
        if (eff.gte(1e15)) eff = eff.max(1).log10().div(15).pow(0.5).mul(15).pow10()
        return eff
    },
    effectDescription(){
        return "Which multiply points gain by " + format(this.effect())
    },
    layerShown(){return hasAchievement('ach',25)},
    branches:['r'],
    tabFormat:{
        "Main":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text",function(){return "Null Points gain is based on your points and current Rank.<br>Aperion Rank 1 is required to reset."}],
                "buyables",
                "blank","blank",
            ],
            style(){return {"background-color": "#000000"}},
            unlocked(){return true},
        },
        "Null":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text",function(){return "Null Points gain is based on your points and current Rank.<br>Aperion Rank 1 is required to reset."}],
                ["buyable",'null'],
                "blank",
                ["display-text",function(){return "Current Effects:<br>" + tmp.n.buyables['null'].effectText}],
                "blank","blank",
            ],
            style(){return {"background-color": "#000000"}},
            unlocked(){return true},
        },
        "Milestones":{
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text",function(){return "Null Points gain is based on your points and current Rank.<br>Aperion Rank 1 is required to reset."}],
                "milestones",
                "blank","blank",
            ],
            style(){return {"background-color": "#000000"}},
            unlocked(){return true},
        },
    },
    milestones:{
        1: {
            requirementDescription(){return formatWhole(1) + " Total Null Points"},
            effectDescription: "You can bulk Rank Up.",
            done() { return player.n.total.gte(1) },
        },
        2: {
            requirementDescription(){return formatWhole(3) + " Total Null Points"},
            effectDescription: "You can bulk Prestige Up.",
            done() { return player.n.total.gte(3) },
        },
        3: {
            requirementDescription(){return formatWhole(9) + " Total Null Points"},
            effectDescription: "You can bulk Tier Up.",
            done() { return player.n.total.gte(9) },
        },
        4: {
            requirementDescription(){return formatWhole(27) + " Total Null Points"},
            effectDescription: "You can bulk Honor Up.",
            done() { return player.n.total.gte(27) },
        },
        5: {
            requirementDescription(){return formatWhole(729) + " Total Null Points"},
            effectDescription: "You can bulk Aperion Rank Up.",
            done() { return player.n.total.gte(729) },
        },
        6: {
            requirementDescription(){return formatWhole(3**27) + " Total Null Points"},
            effectDescription: "You can bulk Ascension and Aperion Tier Up.",
            done() { return player.n.total.gte(3**27) },
        },
        101: {
            requirementDescription: "Null 4",
            effectDescription: "Automate Rank Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(4) },
        },
        102: {
            requirementDescription: "Null 5",
            effectDescription: "Automate Tier Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(5) },
        },
        103: {
            requirementDescription: "Null 6",
            effectDescription: "Automate Prestige Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(6) },
        },
        104: {
            requirementDescription: "Null 7",
            effectDescription: "Automate Tetr Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(7) },
        },
        105: {
            requirementDescription: "Null 8",
            effectDescription: "Automate Honor Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(8) },
        },
        106: {
            requirementDescription: "Null 9",
            effectDescription: "Automate Ascension Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(9) },
        },
        107: {
            requirementDescription: "Null 10",
            effectDescription: "Automate Glory Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(10) },
        },
        108: {
            requirementDescription: "Null 11",
            effectDescription: "Automate Aperion Rank Up, it no longer reset anything.",
            done() { return player.n.buyables['null'].gte(11) },
        },
        109: {
            requirementDescription: "Null 12",
            effectDescription: "Automate Transcension Up and Aperion Tier Up, they no longer reset anything.",
            done() { return player.n.buyables['null'].gte(12) },
        },
    },
    buyables:{
        null: {
            title(){return "Null " + formatWhole(player.n.buyables['null'])},
            display() { return "Unlock or Buff Various Boost.<br><br>Cost: " + formatWhole(this.cost()) + " Null Points" },
            canAfford() { return player.n.points.gte(this.cost()) },
            cost(x) { return new Decimal(10).pow(getInvInfSqrt(x.add(1),10))},
            buy() {
                if (this.canAfford()){
                    if (false) return this.buyMax()
                    player.n.points = player.n.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            buyMax(){
                let bulk = getInfSqrt(player.n.points.max(0).log10(),10).floor().max(0)
                if (this.canAfford()){
                    player.n.points = player.n.points.sub(new Decimal(10).pow(getInvInfSqrt(bulk,10)))
                    setBuyableAmount(this.layer, this.id, bulk)
                }
            },
            effectText(){
                let text = ""
                if (getBuyableAmount('n','null').gte(1)) text += "1. Increase Maximize's Layer effect base from 2 to " + format(buyableEffect('n','null')[1]) + "<br>"
                if (getBuyableAmount('n','null').gte(2)) text += "2. Increase Aperion's effect base from 2 to " + format(buyableEffect('n','null')[2]) + " (based on Aperion Rank base)<br>"
                if (getBuyableAmount('n','null').gte(3)) text += "3. Increase Maximize's Tier effect exp from 1 to " + format(buyableEffect('n','null')[3]) + "<br>"
                if (getBuyableAmount('n','null').gte(6)) text += "6. Increase Aperion's Tier effect exp from 1 to " + format(buyableEffect('n','null')[4]) + "<br>"
                if (getBuyableAmount('n','null').gte(7)) text += "7. Multiply points gain by " + format(buyableEffect('n','null')[5]) + " (Based on Null and Prestige Base)<br>"
                if (getBuyableAmount('n','null').gte(8)) text += "8. Divide Prestige requirement by " + format(buyableEffect('n','null')[6],3) + " (Based on Null, cap at 4.5)<br>"
                if (getBuyableAmount('n','null').gte(11)) text += "11. Multiply null points gain by " + format(buyableEffect('n','null')[7]) + " (Based on Null and Ascension Base)<br>"
                if (text == "") text = "Nothing"
                return text
            },
            effect(){
                let eff = [
                    null,
                    new Decimal(3),
                    tmp.r.getAperionRankBase.max(1).pow(0.5),
                    new Decimal(1.5),
                    new Decimal(2),
                    tmp.r.getPrestigeBase.max(10).log10().pow(getBuyableAmount('n','null')),
                    new Decimal(1.225).pow(getBuyableAmount('n','null').div(8)),
                    tmp.r.getAscensionBase.max(100).div(10).log10().pow(getBuyableAmount('n','null')),
                ]
                if (getBuyableAmount('n','null').gte(4)) eff[3] = new Decimal(2)
                if (getBuyableAmount('n','null').gte(5)) eff[1] = new Decimal(4)
                if (getBuyableAmount('n','null').gte(6)) eff[2] = eff[2].pow(2)

                eff[2] = eff[2].max(2)
                eff[6] = eff[6].min(4.5)

                return eff
            },
            style(){
                let color = (this.canAfford()?"#ffffff":"#bf8f8f")
                return {'width':'200px','height':'200px','background-color':color}
            },
        },
        11: {
            title(){return "Self Boost [" + formatWhole(player.n.buyables[11]) + "]"},
            display() { 
                return "Multiply points gain based on itself.<br>" + 
                "Currently: " + format(this.effect()) + "x<br><br>" + 
                "Cost: " + formatWhole(this.cost()) + " Null Points"
            },
            canAfford() { return player.n.points.gte(this.cost()) },
            cost(x) { return new Decimal(2).pow(x.pow(2))},
            buy() {
                if (this.canAfford()){
                    if (false) return this.buyMax()
                    player.n.points = player.n.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            buyMax(){
                let bulk = player.n.points.max(0).log(2).sqrt().add(1).floor().max(0)
                if (this.canAfford()){
                    player.n.points = player.n.points.sub(new Decimal(2).pow(bulk.sub(1).pow(2)))
                    setBuyableAmount(this.layer, this.id, bulk)
                }
            },
            effect(){
                let eff = player.points.max(0).add(10).log10().pow(player.n.buyables[11])
                return eff
            },
            style(){
                let color = (this.canAfford()?"#ff0000":"#bf8f8f")
                return {'width':'200px','height':'200px','background-color':color}
            },
        },
    },
})

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

addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "gold",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip(){return player.ach.achievements.length + " achievements"},
    tabFormat:[
        ["display-text",function(){return "You have completed <h1 style='color:gold'>" + formatWhole(player.ach.achievements.length) + "</h1>" + "/" + (Object.keys(tmp.ach.achievements).length - 2) + " achievements"}],
        "blank","achievements",
    ],
    achievements:{
        11:{
            name(){return "It's all begin!"},
            done(){return player.r.ranks[0][1][1].gte(1)},
            tooltip(){return "Rank Up. Reward: Unlock Tier."},
        },
        12:{
            name(){return "New Layer already?"},
            done(){return player.r.ranks[0][1][2].gte(1)},
            tooltip(){return "Tier Up."},
        },
        13:{
            name(){return "Double Tier"},
            done(){return player.r.ranks[0][1][2].gte(2)},
            tooltip(){return "Tier Up twice. Reward: Unlock Tetr."},
        },
        14:{
            name(){return "Tetrinded"},
            done(){return player.r.ranks[0][1][3].gte(1)},
            tooltip(){return "Tetr Up. Reward: Unlock Prestige."},
        },
        15:{
            name(){return "TetraTier"},
            done(){return player.r.ranks[0][1][2].gte(4)},
            tooltip(){return "Reach Tier 4."},
        },
        21:{
            name(){return "Prestiged"},
            done(){return player.r.ranks[0][2][1].gte(1)},
            tooltip(){return "Prestige Up. Reward: Unlock Honor."},
        },
        22:{
            name(){return "2x2x1"},
            done(){return player.r.ranks[0][2][2].gte(1)},
            tooltip(){return "Honor Up."},
        },
        23:{
            name(){return "2x2x2"},
            done(){return player.r.ranks[0][2][2].gte(2)},
            tooltip(){return "Honor Up twice. Reward: Unlock Glory."},
        },
        24:{
            name(){return "HexaPrestige"},
            done(){return player.r.ranks[0][2][1].gte(6)},
            tooltip(){return "Reach Prestige 6. Reward: Unlock Aperion Rank."},
        },
        25:{
            name(){return "3-Dimensional Prestige???"},
            done(){return player.r.ranks[1][1][1].gte(1)},
            tooltip(){return "Aperion Rank Up. Reward: Unlock Aperion Tier, and Null Layer."},
        },
        31:{
            name(){return ""},
            done(){return player.n.buyables['null'].gte(1)},
            tooltip(){return "Reach Null 1."},
        },
        32:{
            name(){return "Road to Glory"},
            done(){return player.r.ranks[0][2][3].gte(1)},
            tooltip(){return "Glory Up. Reward: Unlock Ascension."},
        },
        33:{
            name(){return "Ascended"},
            done(){return player.r.ranks[0][3][1].gte(1)},
            tooltip(){return "Ascension Up. Reward: Unlock Transcension."},
        },
        34:{
            name(){return "Aperion went too far"},
            done(){return player.r.ranks[1][1][2].gte(1)},
            tooltip(){return "Aperion Tier Up."},
        },
        35:{
            name(){return "AAA PPP EEE RRR III OOO NNN ... RRR AAA NNN KKK"},
            done(){return player.r.ranks[1][1][1].gte(3)},
            tooltip(){return "Reach Aperion Rank 3."},
        },
        41:{
            name(){return "' 'x12"},
            done(){return player.n.buyables['null'].gte(12)},
            tooltip(){return "Reach Null 12. Reward: Unlock ???"},
        },
        42:{
            name(){return "Age of Automation"},
            done(){return player.auto.ranks[0][1][1]},
            tooltip(){return "Automate Rank."},
        },
        43:{
            name(){return "Transcended"},
            done(){return player.r.ranks[0][3][2].gte(1)},
            tooltip(){return "Transcension Up."},
        },
        44:{
            name(){return "Double Tier, but Aperioned"},
            done(){return player.r.ranks[1][1][2].gte(2)},
            tooltip(){return "Aperion Tier Up twice. Reward: Unlock Aperion Tetr."},
        },
        45:{
            name(){return "Minimized"},
            done(){
                let noRanks = true
                for (let i=1;i<=player.r.ranks[0].length-1;i++){
                    for (let j=1;j<=player.r.ranks[0][i].length-1;j++){
                        if (player.r.ranks[0][i][j].gte(1)) noRanks = false
                    }
                }
                return player.points.gte(1e29) && noRanks
            },
            tooltip(){return "Reach 1e29 points without any Maximize Ranks (Aperion Ranks are allowed). Reward: Maximize Layer's Worth uses a better formula."},
        },
    },
})

addLayer("auto", {
    name: "automation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        ranks: [
            [
                null,
                [null,false,false,false,false], // rank
                [null,false,false,false,false], // prestige
                [null,false,false,false,false], // ascension
            ],
            [
                null,
                [null,false,false,false,false], // aperion rank
            ],
        ],
    }},
    color: "black",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false},
})

function resetRanks(tier=1, layer=1, omega=0){
    for (let i=omega;i>=0;i--){
        if (i==omega){
            for (let j=layer;j>=1;j--){
                if (j==layer){
                    for (let k=tier-1;k>=1;k--){
                        player.r.ranks[i][j][k] = new Decimal(0)
                    }
                } else {
                    for (let k=player.r.ranks[i][j].length-1;k>=1;k--){
                        player.r.ranks[i][j][k] = new Decimal(0)
                    }
                }
            }
        } else {
            for (let j=player.r.ranks[i].length-1;j>=1;j--){
                for (let k=player.r.ranks[i][j].length-1;k>=1;k--){
                    player.r.ranks[i][j][k] = new Decimal(0)
                }
            }
        }

    }
}

function getRankWorth(amt){
    amt = new Decimal(amt).max(0)
    if (!hasAchievement('ach',45)){
        if (amt.gte(0)) mult = new Decimal(1)
        if (amt.gte(1)) mult = new Decimal(2)
        if (amt.gte(2)) mult = new Decimal(3).add(amt.log(2).log(3))
        if (amt.gte(8)) mult = new Decimal(4).add(amt.log(2).log(3).log(4))
        if (amt.gte(Decimal.pow(2,3**4))) mult = new Decimal(5).add(amt.log(2).log(3).log(4).log(5))
        if (amt.gte(Decimal.pow(2,Decimal.pow(3,4**5)))) mult = new Decimal(6).add(amt.log(2).log(3).log(4).log(5).log(6))
        if (amt.gte(Decimal.pow(2,Decimal.pow(3,Decimal.pow(4,5**6))))) mult = new Decimal(7).add(amt.log(2).log(3).log(4).log(5).log(6).log(7))
        if (amt.gte(Decimal.pow(2,Decimal.pow(3,Decimal.pow(4,Decimal.pow(5,6**7)))))) mult = new Decimal(8).add(amt.log(2).log(3).log(4).log(5).log(6).log(7).log(8))
        if (amt.gte(Decimal.pow(2,Decimal.pow(3,Decimal.pow(4,Decimal.pow(5,Decimal.pow(6,7**8))))))) mult = new Decimal(9).add(amt.log(2).log(3).log(4).log(5).log(6).log(7).log(8).log(9))
        if (amt.gte(Decimal.pow(2,Decimal.pow(3,Decimal.pow(4,Decimal.pow(5,Decimal.pow(6,Decimal.pow(7,8**9)))))))) mult = new Decimal(10)
    } else {
        if (amt.gte(0)) mult = new Decimal(1)
        if (amt.gte(1)) mult = new Decimal(2)
        if (amt.gte(2)) mult = new Decimal(2).add(amt.slog(2))
    }

    return mult
}