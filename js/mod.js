let modInfo = {
	name: "The User Tree",
	id: "user",
	author: "User_2.005e220",
	pointsName: "h0nde accounts",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players

	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.041",
	name: "Super Prestige",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
<h3>v1.022 (Update 1)</h3><br>
- Initial Release.<br>
- Balance up to 1.80e308 points, 22 Prestige Upgrades, 7 Achievements and Quest 1x5, 2x2 completion.<br>
<br>
<h3>v1.032 (Update 2)</h3><br>
- Added Infinity.<br>
- Balance up to 1.00e3,502 points, 32 Prestige Upgrades, 10 Achievements and Quest 1x10, 2x8, 3x5, 4x4 completion.<br>
<br>
<h3>v1.041 (Update 3)</h3><br>
<b>- Changed everything to h0nde related.</b><br>
- Added Super Prestige.<br>
- Balance up to 1.00e112,100 points, 41 Prestige Upgrades, 15 Super Prestige Upgrades, 13 Achievements and Quest 1-4x10, 5x5, 6x2 completion.<br>
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
	return hasUpgrade("p", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = getPointGainMul()
  gain = new Decimal(10).pow(gain.log(10).pow(getPointGainExpPow()))
  gain = gain.pow(getPointGainPow())
	return gain
}

function getPointGainMul(){
	let mul = new Decimal(1)
  if (hasUpgrade("p", 12)) mul = mul.mul(upgradeEffect("p", 12))
  if (hasUpgrade("p", 13)) mul = mul.mul(upgradeEffect("p", 13))
  if (hasUpgrade("p", 14)) mul = mul.mul(upgradeEffect("p", 14))
  if (hasUpgrade("p", 21)) mul = mul.mul(upgradeEffect("p", 21)[0])
  if (hasUpgrade("p", 23)) mul = mul.mul(upgradeEffect("p", 23))
  if (hasAchievement("a", 13)) mul = mul.mul(achievementEffect("a", 13))
  if (player.b.unlocked) mul = mul.mul(tmp.b.effect)
  if (hasUpgrade("p", 25)) mul = mul.mul(upgradeEffect("p", 25))
  if (hasUpgrade("p", 32)) mul = mul.mul(upgradeEffect("p", 32)[0])
  if (hasUpgrade("p", 43)) mul = mul.mul(upgradeEffect("p", 43))
  if (hasUpgrade("p", 52)) mul = mul.mul(upgradeEffect("p", 52))
  if (hasUpgrade("p", 53)) mul = mul.mul(upgradeEffect("p", 53))
  if (hasChallenge("q", 21)) mul = mul.mul(challengeEffect("q", 21)[0])
  if (hasUpgrade("sp", 11) && !player.q.activeChallenge) mul = mul.mul(upgradeEffect("sp", 11))
  if (hasUpgrade("sp", 23)) mul = mul.mul(upgradeEffect("sp", 23)[1])
  return mul
}

function getPointGainPow(){
  let pow = new Decimal(1)
  if (inChallenge("q", 11)) pow = pow.mul(0.5)
  if (inChallenge("q", 12)) pow = pow.mul(1/3)
  if (inChallenge("q", 31)) pow = pow.mul(0.1)
  if (player.i.unlocked && !player.q.activeChallenge) pow = pow.mul(tmp.i.effect)
  if (maxedChallenge("q", 21)) pow = pow.mul(challengeEffect("q", 21)[1])
  return pow
}

function getPointGainExpPow(){
  let expPow = new Decimal(1)
  if (inChallenge("q", 22)) expPow = expPow.mul(0.5)
  return expPow
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  "Endgame: 1.00e112,100 points"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal(10).pow(112100))
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
  if(isNaN(player.q.questUnlocked)) player.q.questUnlocked = 0
  if(oldVersion < 1.041) player.q.questUnlocked = Math.min(player.q.questUnlocked, 5) // fix wrong quests require
}