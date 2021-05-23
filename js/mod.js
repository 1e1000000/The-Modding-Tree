let modInfo = {
	name: "The User Tree",
	id: "user",
	author: "User_2.005e220",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.022",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.022</h3><br>
		- Initial Release.<br>
    - Balance up to 1.80e308 points, 22 Prestige Upgrades and 7 Achievements.<br>
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
	return hasUpgrade("p", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
  if (hasUpgrade("p", 12)) gain = gain.mul(upgradeEffect("p", 12))
  if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
  if (hasUpgrade("p", 14)) gain = gain.mul(upgradeEffect("p", 14))
  if (hasUpgrade("p", 21)) gain = gain.mul(upgradeEffect("p", 21)[0])
  if (hasUpgrade("p", 23)) gain = gain.mul(upgradeEffect("p", 23))
  if (hasAchievement("a", 13)) gain = gain.mul(achievementEffect("a", 13))
  if (player.b.unlocked) gain = gain.mul(tmp.b.effect)
  if (hasUpgrade("p", 25)) gain = gain.mul(upgradeEffect("p", 25))
  if (hasUpgrade("p", 32)) gain = gain.mul(upgradeEffect("p", 32)[0])
  if (hasUpgrade("p", 43)) gain = gain.mul(upgradeEffect("p", 43))
  if (hasUpgrade("p", 52)) gain = gain.mul(upgradeEffect("p", 52))
  if (inChallenge("q", 11)) gain = gain.pow(0.5)
  if (inChallenge("q", 12)) gain = gain.pow(1/3)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  "Endgame: 1.80e308 points"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(Number.MAX_VALUE)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}