let modInfo = {
	name: "The Unnamed Tree",
	id: "infinite-ee6",
	author: "1e1000000",
	pointsName: "antimatter",
	modFiles: ["maths.js", "layers.js", "am.js", "inf.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1/0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "230212",
	name: "Infinity Update",
}

let changelog = `
    <h1>Changelog:</h1><br>
	<h3>2023-02-12 build (Update 2a)</h3><br>
	- Balanced remaining challenges debuff.<br>
	- You need previous Infinity upgrade in that column to bought the next Infinity upgrade.<br>
	- Make antimatter production after exp show.<br>
	- Added Autobuyer for Infinity reset.<br>
	- Endgame: 1000 Total Infinity Points with all Infinity Upgrades bought and all Challenges completed.<br><br>
	<h3>2023-02-11 build (Priate: Infinity update Beta 2)</h3><br>
	- Balanced 5 out of 8 challenges debuff.<br>
	- Added Buy Max Button.<br>
	- Added another 3 Achievements.<br>
	- Softcapped all antimatter buyables past 1.80e308 AM, except 'Producer'. (58,52,38,10,3)<br>
	- Softcapped antimatter exponent at 9.<br>
	- Balanced up to: 5/8 Challenges.<br><br>
	<h3>2023-02-10 build (Priate: Infinity update Beta 1)</h3><br>
	- Added Infinity, include upgrade and challenges.<br>
	- Added Buy Max Hotkey, require Infinity once.<br>
	- Added Autobuyers.<br>
	- Balanced up to: 8/12 Infinity Upgrades.<br><br>
	<h3>2023-02-09 build (Update 1b)</h3><br>
	- Added 3 achievements (only 1 is possible yet).<br>
	- Added best antimatter.<br>
	- Added full display option for Time.<br>
	- Added a secret.<br>
	- Endgame unchanged.<br><br>
	<h3>2023-02-08 build (Update 1a)</h3><br>
	- Initial Release.<br>
	- Endgame: 1.80e308 antimatter.<br><br>
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
	bestAM: new Decimal(1),
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return "Endgame: " + 
		formatWhole(player.inf.total) + "/1,000 total Infinity Points<br>" + 
		formatWhole(player.inf.upgrades.length) + "/12 Infinity Upgrades<br>" + 
		formatWhole(tmp.inf.totalComp) + "/8 Challenges completion"
	}
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