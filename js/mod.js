let modInfo = {
	name: "The h0nde Tree",
	id: "h0nde",
	author: "1e1000000",
	pointsName: "h0nde accounts",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 48,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.052",
	name: "Break the Generator buyable limit",
}

let changelog = `
Credit to pg132, for the design of first layer on Incrementreeverse.<br>
Credit to  Vorona, for "Every Xx amount square rooted" calculation.<br><br>
    <h1>Changelog:</h1><br>
	<h3>v0.052</h3><br>
	- Added more stuffs in Statistic node.<br>
	- Changed h0nde power production display to +X h0nde power/s if you have more than 1e1,000 h0nde powers.<br>
	- Extended the Offline time limit to 48 hours, and the offline progress finally exist!<br>
	- Endgame remain same.<br>
	<br>
	<h3>v0.051</h3><br>
	- Fixed you can get Achievement 45 with 1e20 h0nde power instead of 1e20 PP.<br>
	- Endgame remain same.<br>
	<br>
	<h3>v0.05 - Break the Generator buyable limit</h3><br>
	- Added BREAK LIMIT, allow player to get more than 2,500 non-free Generator buyable level but reduce PP gain.<br>
	- Added 5 upgrades, 2 buyables and 5 achievements.<br>
	- Added a hotkey for prestige.<br>
	- Slightly changed 4th prestige milestone description.<br>
	- Changed the h0nde buyable 21 effect display and softcapped the effect at +10.<br>
	- Renamed h0nde upgrade 23 & achievement 25.<br>
	- Fixed you can buy buyables automatically without unlock it.<br>
	- Endgame: 1e377 h0nde powers & 1e33 total PP.<br>
	<br>
	<h3>v0.04 - The h0nde prestige era II</h3><br>
	- Added 5 upgrades and 2 achievements.<br>
	- Added a function that calculate how many upgrades in a row and a layer bought.<br>
	- Generator buyable cost can show small number.<br>
	- Renamed and buffed the Achievement 33.<br>
	- Endgame: 1e107 h0nde powers & 5e9 total PP.<br>
	<br>
	<h3>v0.03 - The h0nde prestige era I</h3><br>
	- Added a new layer (Prestige)<br>
	- Added 3 achievements.<br>
	- Added incomplete Statistics node<br>
	- Combined Buy max Multiplier and Divider buyable.<br>
	- Fixed game-breaking bug when buying Power buyable with 0 h0nde power.<br>
	- Endgame: 27.5 h0nde accounts & 600 total PP.<br>
	<br>
	<h3>v0.022</h3><br>
	- Added placeholder for prestige layer.<br>
	- Endgame remain same.<br>
	<br>
	<h3>v0.021</h3><br>
	- Added just one upgrades.<br>
	- Fixed some buyables can go pass limit while buying multiple.<br>
	- Endgame: 1e50 h0nde power & all h0nde upgrades.<br>
	<br>
	<h3>v0.02 - The begin of h0nde creation II</h3><br>
	- Added 2 buyables, 6 upgrades and 5 achievements.<br>
	- Added more info on Generator buyable.<br>
	- Softcap Generator buyable multiplier boost at 100 boosts.<br>
	- Make number between 1e12 and 1e15 less chaotic, but e1e9 and e1e12 more chaotic.<br>
	- Endgame: 22 h0nde accounts & max out Generator buyable.<br>
	<br>
    <h3>v0.01 - The begin of h0nde creation I</h3><br>
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
	bestPoints: new Decimal(0)
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
	if (oldVersion == 0.05 && player.a.achievements.includes("45")){
		let index = player.a.achievements.indexOf("45")
		if (index > -1) player.a.achievements.splice(index, 1)
		alert("due to a game breaking bug, your achievements 45 has been removed, and you will did a forced prestige reset, but I will give you 1e20 h0nde powers for free if you didn't prestiged")
		setBuyableAmount("h",11,new Decimal(0))
		setBuyableAmount("h",12,new Decimal(0))
		setBuyableAmount("h",13,new Decimal(0))
		setBuyableAmount("h",21,new Decimal(0))
		setBuyableAmount("h",22,new Decimal(0))
		player.h.upgrades = []
		player.h.points = new Decimal(0)
		if (!player.p.unlocked) player.h.points = new Decimal(1e20)
	}
}
