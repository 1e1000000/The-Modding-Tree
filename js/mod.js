let modInfo = {
	name: "Tetration Tree",
	id: "tetration",
	author: "nobody",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "",
}

let changelog = ""

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
  if (hasUpgrade("p", 11)) gain = gain.mul(upgradeEffect("p", 11))
  if (!inChallenge("i", 41)){
    gain = gain.mul(layers.slog.effect())
    if (hasUpgrade("sp", 11)) gain = gain.mul(upgradeEffect("sp", 11))
    if (hasUpgrade("p", 22)) gain = gain.pow(upgradeEffect("p", 22)[0])
    if (hasChallenge("i", 21)) gain = gain.mul(challengeEffect("i", 21))
    if (hasUpgrade("hp", 11)) gain = gain.mul(upgradeEffect("hp", 11)[0])
    if (hasUpgrade("hp", 11)) gain = gain.pow(upgradeEffect("hp", 11)[1])
    if (hasChallenge("i", 52)) gain = gain.mul(challengeEffect("i", 52))
    if (hasChallenge("e", 32)) gain = gain.pow(challengeEffect("e", 32))
  }
    
  if (!inChallenge("e", 41) && gain.gte(getPointGainSCStart())) gain = new Decimal(10).pow(gain.log(10).mul(getPointGainSCStart().log(10)).pow(0.5))
  if (inChallenge("e", 41) && gain.gte(getPointGainSCStart())) gain = gain.log(10).pow(new Decimal(getPointGainSCStart().log(10)).div(new Decimal(getPointGainSCStart().log(10)).log(10).max(1)))
  if (!inChallenge("i", 41)){
    
  }
  if (inChallenge("i", 52) && gain.gte(10)) gain = new Decimal(10).pow(gain.log(10).pow(0.75))
  if (inChallenge("e", 32)) gain = gain.pow(0.5)
  if (inChallenge("e", 42)) gain = gain.min(player.sp.points.add(1))
  
	return gain
}

function getPointGainSCStart(){
  let scstart = new Decimal(10).pow(3e4)
  if (hasUpgrade("e", 11)) scstart = scstart.mul(upgradeEffect("e", 11))
  if (hasUpgrade("i", 33)) scstart = scstart.mul(upgradeEffect("i", 33))
  if (hasUpgrade("p", 41)) scstart = scstart.mul(upgradeEffect("p", 41))
  if (hasChallenge("e", 22)) scstart = scstart.pow(challengeEffect("e", 22))
  scstart = scstart.mul(layers.slog.effectP(false))
  if (hasChallenge("e", 32)) scstart = scstart.pow(challengeEffect("e", 32))
  if (inChallenge("e", 22)) scstart = scstart.pow(0.1)
  if (inChallenge("e", 41)) scstart = scstart.pow(0.03)
  if (inChallenge("i", 52)) scstart = new Decimal(10)
  return scstart
} 

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  "Endgame: 84 Infinity Points"
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(31536000) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}