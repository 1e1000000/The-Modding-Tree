let modInfo = {
	name: "The Rank Tree II",
	id: "rank2",
	author: "F1e308",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Null",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1 patch 2 (2024-7-2)</h3><br>
		- Reduce all automation milestones requirement by one.<br><br>
	<h3>v0.1 patch 1 (2024-6-29)</h3><br>
		- You can now actually reach the endgame screen.<br>
		- Null Points requirement display when locked is now updated based on your ranks.<br>
		- Null reset requirement is highlighted lime when you have Aperion Rank 1.<br>
		- Rank node tooltip is now cycle through current Rank/Prestige/Ascension/Aperion Rank (all if unlocked) every second.<br>
		- Split the Null milestones into "Bulking" and "Automation" section.<br><br>
	<h1>v0.1 - Null (2024-6-29)</h1><br>
		- Added Rank, Tier, Tetr.<br>
		- Added Prestige, Honor, Glory.<br>
		- Added Ascension, Transcension.<br>
		- Added Aperion Rank, Aperion Tier. (Aperion Tetr is also added, but it's currently impossible)<br>
		- Added Null reset, Null points, Null.<br>
		- Endgame: Null 12, 20 Achievements.<br><br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

	gain = gain.mul(clickableEffect('r',11))
	gain = gain.mul(clickableEffect('r',12))
	gain = gain.mul(clickableEffect('r',13))

	gain = gain.mul(clickableEffect('r',21))
	gain = gain.mul(clickableEffect('r',22))
	gain = gain.mul(clickableEffect('r',23))

	gain = gain.mul(clickableEffect('r',31))
	gain = gain.mul(clickableEffect('r',32))
	
	gain = gain.mul(clickableEffect('r',111))
	gain = gain.mul(clickableEffect('r',112))
	gain = gain.mul(clickableEffect('r',113))

	if (player.n.unlocked){
		gain = gain.mul(tmp.n.effect)
		gain = gain.mul(buyableEffect('n',11))
		if (getBuyableAmount('n','null').gte(7)) gain = gain.mul(buyableEffect('n','null')[5])
	}

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	updateCooldown: 1,
	displaying: 0,
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: Null 12, 20 Achievements"
]

// Determines when the game "ends"
function isEndgame() {
	return player.n.buyables['null'].gte(12) && player.ach.achievements.length >= 20
}



// Less important things beyond this point!

function getBGColor(){
	let c = "#000000"
	if (player.tab=='n') c = "#1f0000"
	if (player.tab=='ach') c = "#1f1f00"
	return c
}

// Style for the background, can be a function
function backgroundStyle(){
	return {'background-color':getBGColor()}
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}