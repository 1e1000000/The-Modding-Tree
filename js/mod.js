let modInfo = {
	name: "Infinity Game Tree",
	id: "InfGame",
	author: "F1e308 (aka 1e1000000)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.004",
	name: "Prestige",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
	<h3>v0.004</h3> (2022/5/1)<br>
		- Added 4th infinites.<br>
		- Added Prestige.<br>
		- Advanced the node tooltip display.<br>
	<h3>v0.003</h3> (2022/4/23)<br>
		- Initial release.<br>
		- Content up to 3 infinites.<br>
		<br>
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

	let gain = buyableEffect("p",11)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Endgame: 1.80e308 points with 4 infinites"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(Decimal.pow(2,1024)) && player.i.points.gte(4)
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