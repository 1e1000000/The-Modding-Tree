let modInfo = {
	name: "The Light Speed of Tree",
	id: "LSoT",
	author: "User_2.005e220 (Discord)/1e1000000 (Github)",
	pointsName: " meters",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.21",
	name: "a single universe",
}

let changelog = `<h1>Changelog:</h1><br>
  <h3>v0.1 - a single light of a year</h3><br><br>
		- Added Prestige.<br>
		- Added Boosters.<br>
    - Added Generators.<br>
    - Added Light.<br>
    - Balance Up to 9.46e15 Meters and 1,598 Total Light<br><br>
  <h3>v0.11</h3><br><br>
    - Added Require to shows next layer, hidden when you perform the reset for first time.<br>
    - Added missing description on first light milestone.<br>
		- Fixed typo on second Booster Milestone.<br>
    - Fixed you could get last Boosters/Generators Milestone before milestone visible.<br>
    - Fixed Auto Boosters/Generators not being updated upon toggle until reload.<br><br>
  <h3>v0.111</h3><br><br>
    - Hot Fix: Fixed Auto Booster/Generators being reset on Light reset<br><br>
  <h3>v0.2 - a single universe</h3><br><br>
    - Added Light Powers.<br>
    - Added 2 PLACEHOLDER Prestiges (both cost Infinity and static prestige).<br>
    - Softcapped Light gain at 20,000,000.<br>
    - Softcap of Resources gain now visible.<br>
    - Slightly changed tab layout.<br>
    - Implemented Last Light Milestone.<br>
    - When Prestiges isn't unlocked, the Prestige note will be using a space.<br>
    - Fixed Auto Boosters/Generators could working if you didn't have Light Milestone 7.<br>
    - Balance Up to 8.80e26 Meters and 97,265,248 Total Light<br><br>
  <h3>v0.21</h3><br><br>
    - Added Statistic Tab.<br>
    - Doubled Post-40 Light Powre scaling, this is mean if you have more than 40 light power, your light power will be reset to 40.<br>
    - Softcapped Second Light boost at 1e12x.<br>
    - Softcapped Meter production at 1e100/s.<br>
    - Slightly reworded 6th Light Milestone description.<br>
    - Slightly reduced 4th Light Upgrade cost.<br>
    - Fixed Light Power tab always show.<br>
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
	return player.p.best.neq(0) || hasMilestone("l", 0)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0.1)
  if (hasUpgrade("p", 11)) gain = gain.mul(upgradeEffect("p", 11))
  if (hasUpgrade("p", 12)) gain = gain.mul(upgradeEffect("p", 12))
  if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
  if (hasMilestone("b", 0)) gain = gain.mul(layers.b.effect()[1])
  if (hasUpgrade("b", 11)) gain = gain.mul(5)
  if (lightPowerActive(0)) gain = gain.mul(tmp.l.lightPowBoost[0])
  if (gain.gte(343)) gain = gain.pow(1/3).mul(49)
  if (hasUpgrade("p", 33) && !hasUpgrade("p", 34)) gain = gain.mul(upgradeEffect("p", 33))
  if (hasMilestone("l", 3)) gain = gain.mul(layers.l.effect()[1])
  
  if (gain.gte(299792458)) gain = new Decimal(10).pow(gain.log10().mul(new Decimal(299792458).log(10)).pow(0.5))
  gain = gain.mul(layers.g.effect()[1])
  if (hasUpgrade("p", 33) && hasUpgrade("p", 34)) gain = gain.mul(upgradeEffect("p", 33))
  
  if (gain.gte(1e100)) gain = gain.log(10).pow(50)
  
  if (gain.gte(299792458) && !hasMilestone("l", 9)) gain = new Decimal(299792458)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  "Current Endgame: 8.80e26 meters and 97,265,248 Total Light"
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){ // current not working
  if (oldVersion <= 0.2) {
    if (player.l.power.gt(40)) {
      alert("Due to rebalance that make light power scaling faster from 40, it will reset your light powers to 40")
      player.l.power = new Decimal(40)
    }
  }
}