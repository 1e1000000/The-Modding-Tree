let modInfo = {
	name: "The Rank Tree",
	id: "1e1000000_rank",
	author: "F1e308 (1e1000000)",
	pointsName: "points",
	modFiles: ["layers/rank.js", "layers/achievement.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Initial Release?",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1 (2024-1-1)</h3><br>
		- Added Rank, Tier, Tetr.<br>
		- Added Prestige, Honor, Glory.<br>
		- Added Ascension, Transcension, Recursion (not visible yet).<br>
		- Added Return, Reincarnation.<br>
		- Added Rank Reset.<br>
		- Endgame: 6e133 points, Rank Reset 7.<br>
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
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(clickableEffect('r',11))
	gain = gain.mul(clickableEffect('r',12))
	gain = gain.mul(clickableEffect('r',13))

	gain = gain.mul(clickableEffect('r',21))
	gain = gain.mul(clickableEffect('r',22))
	gain = gain.mul(clickableEffect('r',23))

	gain = gain.mul(clickableEffect('r',31))
	gain = gain.mul(clickableEffect('r',32))
	gain = gain.mul(clickableEffect('r',33))
	
	gain = gain.mul(clickableEffect('r',41))
	gain = gain.mul(clickableEffect('r',42))

	if (player.r.buyables[11].gte(1)) gain = gain.mul(buyableEffect('r',11)[1])
	if (player.r.buyables[11].gte(2)) gain = gain.mul(buyableEffect('r',11)[2])
	if (player.r.buyables[11].gte(4)) gain = gain.mul(buyableEffect('r',11)[3])

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return "Balanced Up to: " + format("6e133") + " points, Rank Reset 7"}
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}