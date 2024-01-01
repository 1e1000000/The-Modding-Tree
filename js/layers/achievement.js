addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip(){return "Achievements"},
    tabFormat:[
                ["display-text",function(){return "You have completed <h1 style='color:yellow'>" + formatWhole(player.ach.achievements.length) + "</h1> achievements"}],
                "blank",
                "achievements",
            ],
    achievements:{
        11:{
            name(){return "It's all begin!"},
            done(){return player.r.ranks[1][1].gte(1)},
            tooltip(){return "Rank Up. Reward: Unlock Tier."},
        },
        12:{
            name(){return "New Layer already?"},
            done(){return player.r.ranks[1][2].gte(1)},
            tooltip(){return "Tier Up."},
        },
        13:{
            name(){return "Double Tier"},
            done(){return player.r.ranks[1][2].gte(2)},
            tooltip(){return "Tier Up twice. Reward: Unlock Prestige."},
        },
        14:{
            name(){return "Tetrinded"},
            done(){return player.r.ranks[1][3].gte(1)},
            tooltip(){return "Tetr Up."},
        },
        15:{
            name(){return "TetraTier"},
            done(){return player.r.ranks[1][2].gte(4)},
            tooltip(){return "Reach Tier 4."},
        },
        21:{
            name(){return "Prestiged"},
            done(){return player.r.ranks[2][1].gte(1)},
            tooltip(){return "Prestige Up. Reward: Unlock Honor"},
        },
        22:{
            name(){return "2x2x1"},
            done(){return player.r.ranks[2][2].gte(1)},
            tooltip(){return "Honor Up."},
        },
        23:{
            name(){return "TriPrestige"},
            done(){return player.r.ranks[2][1].gte(3)},
            tooltip(){return "Reach Prestige 3. Reward: Unlock Tetr."},
        },
        24:{
            name(){return "2x2x2"},
            done(){return player.r.ranks[2][2].gte(2)},
            tooltip(){return "Honor Up twice. Reward: Unlock Ascension."},
        },
        25:{
            name(){return "Road to Glory"},
            done(){return player.r.ranks[2][3].gte(1)},
            tooltip(){return "Glory Up. Reward: You can bulk Rank Up."},
        },
        31:{
            name(){return "Ascended"},
            done(){return player.r.ranks[3][1].gte(1)},
            tooltip(){return "Ascension Up."},
        },
        32:{
            name(){return "Transcended"},
            done(){return player.r.ranks[3][2].gte(1)},
            tooltip(){return "Transcension Up."},
        },
        33:{
            name(){return "3x1x3"},
            done(){return player.r.ranks[3][1].gte(3)},
            tooltip(){return "Reach Ascension 3. Reward: Unlock Glory."},
        },
        34:{
            name(){return "3x2x2"},
            done(){return player.r.ranks[3][2].gte(2)},
            tooltip(){return "Transcension Up twice. Reward: You can bulk Prestige Up."},
        },
        35:{
            name(){return "PentaTier"},
            done(){return player.r.ranks[1][2].gte(5)},
            tooltip(){return "Reach Tier 5."},
        },
        41:{
            name(){return "Everything is gone!"},
            done(){return player.r.buyables[11].gte(1)},
            tooltip(){return "Rank Reset once. Reward: Unlock Return, you can bulk Tier Up."},
        },
        42:{
            name(){return "Everything is gone again!"},
            done(){return player.r.buyables[11].gte(2)},
            tooltip(){return "Rank Reset twice."},
        },
        43:{
            name(){return "Everything is gone again and again!"},
            done(){return player.r.buyables[11].gte(3)},
            tooltip(){return "Rank Reset 3 times."},
        },
        44:{
            name(){return "Everything is gone all over!"},
            done(){return player.r.buyables[11].gte(5)},
            tooltip(){return "Rank Reset 5 times. Reward: You can bulk Transcension Up."},
        },
        45:{
            name(){return "Everything is gone all over again!"},
            done(){return player.r.buyables[11].gte(7)},
            tooltip(){return "Rank Reset 7 times."},
        },
        51:{
            name(){return "Return to Glory"},
            done(){return player.r.ranks[4][1].gte(1)},
            tooltip(){return "Return Up. Reward: Unlock Reincarnation, you can bulk Ascension Up."},
        },
        52:{
            name(){return "HexaTier"},
            done(){return player.r.ranks[1][2].gte(6)},
            tooltip(){return "Reach Tier 6."},
        },
        53:{
            name(){return "2x2x(2x2)"},
            done(){return player.r.ranks[2][2].gte(4)},
            tooltip(){return "Reach Honor 4."},
        },
        54:{
            name(){return "256"},
            done(){return player.r.ranks[1][3].gte(2)},
            tooltip(){return "Tetr Up twice. Reward: You can bulk Tetr Up."},
        },
        55:{
            name(){return "Reincarnated"},
            done(){return player.r.ranks[4][2].gte(1)},
            tooltip(){return "Reincarnation Up. Reward: You can bulk Return Up."},
        },
    },
})