let modInfo = {
	name: "The h0nde Tree",
	id: "h0nde",
	author: "1e1000000",
	pointsName: "h0nde accounts",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.022",
	name: "The begin of h0nde creation II",
}

let changelog = `
Credit to pg132, for the design of first layer on Incrementreeverse.<br>
Credit to  Vorona, for "Every Xx amount square rooted" calculation.<br><br>
    <h1>Changelog:</h1><br>
	<h3>v0.022</h3><br>
	- Added placeholder for prestige layer.<br>
	- Endgame remain same.<br>
	<h3>v0.021</h3><br>
	- Added just one upgrades.<br>
	- Fixed some buyables can go pass limit while buying multiple.<br>
	- Endgame: 1e50 h0nde power & all h0nde upgrades.<br>
	<h3>v0.02</h3><br>
	- Added 2 buyables, 6 upgrades and 5 achievements.<br>
	- Added more info on Generator buyable.<br>
	- Softcap Generator buyable multiplier boost at 100 boosts.<br>
	- Make number between 1e12 and 1e15 less chaotic, but e1e9 and e1e12 more chaotic.<br>
	- Endgame: 22 h0nde accounts & max out Generator buyable.<br>
    <h3>v0.01</h3><br>
	- Initial Release.<br>
	- Endgame: 11 h0nde accounts.<br>
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
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
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