let modInfo = {
	name: "The Anti-Incrematter Tree",
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
	num: "230224",
	name: "Infinity Challenge Update (Phase 1)",
}

let changelog = `
    <h1>Changelog:</h1><br>
	<h3 style='color: #ffff00'>2023-02-24 build (Update 2.3a)</h3><br>
	- Added a post-break Infinity Upgrade.<br>
	- Added a antimatter Buyable.<br>
	- Added 2 achievements.<br>
	- Added 7 Infinity Challenges, all not implemented yet but functional.<br>
	- Challenge 1 is now harder again.<br>
	- Moved Infinity Challenges tab into Challenges tab.<br>
	- Softcapped 3rd antimatter buyable effect at 1.80e308x.<br>
	- Overflowed IP gain at 1e50.<br>
	- Renamed first challenge to 'Single Producer'.<br>
	- Fixed exploit when reloading while in Challenges.<br>
	- Fixed buying max doesn't bought 8th antimatter buyable.<br>
	- Endgame: 1e53 IP, IC1x11.<br><br>

	<h3 style='color: #ffff00'>2023-02-22 build (Priate: Infinity Challenge update Beta 3)</h3><br>
	- Added a post-break Infinity Upgrade.<br>
	- Softcapped Infinity Power effect at 1.80e308x.<br>
	- Scaled Infinity Challenge 1 goal every 10 completions.<br>
	- Nerfed 'Condenser Exp' after Level 4.<br>
	- Resoftcapped 6th and 7th antimatter buyable, value listed on 2023-2-17 build.<br>
	- inf22 no longer have effect while in IC1.<br>
	- Balanced up to: 1e38 IP, IC1x10.<br><br>

	<h3 style='color: #ffff00'>2023-02-20 build (Priate: Infinity Challenge update Beta 2.2)</h3><br>
	- Rebalanced post-Break Infinity stage, in other to make player purchase Infinity Power buyables and complete Infinity Challenges.<br><br>

	<h3 style='color: #ffff00'>2023-02-19 build (Priate: Infinity Challenge update Beta 2.1)</h3><br>
	- Rebalnced pre-Break Infinity stage with lower Infinity Upgrades cost, Milestone require, and Chalenges debuff.<br><br>

	<h3 style='color: #ffff00'>2023-02-18 build (Priate: Infinity Challenge update Beta 2)</h3><br>
	- Changes about softcap/scale in 2023-2-17 has been reverted due to game inflation.<br>
	- Softcapped inf31 at 2500 levels.<br>
	- Balanced up to: 2e28 IP, IC1x8.<br><br>

	<h3 style='color: #ffff00'>2023-02-17 build (Priate: Infinity Challenge update Beta 1)</h3><br>
	- Implemented Infinity Challenge 1<br>
	- Added 2 post-break Infinity Upgrade.<br>
	- Softcapped 6th and 7th antimatter buyable at +2 and level 12 respectively.<br>
	- Scaled IP multiplier at Level 40.<br>
	- Balanced up to: 1e48 IP, IC1x12.<br><br>

	<h3 style='color: #ffff00'>2023-02-16 build (Update 2.2b)</h3><br>
	- Added a button for quick Infinity reset. (better for mobile device)<br>
	- Added Really Antimatter Dimension (not quite accurate).<br>
	- Updated the wording of Break Infinity tooltip.<br><br>

	<h3 style='color: #ffff00'>2023-02-15 build (Update 2.2a)</h3><br>
	- Added another Infinity Power buyable.<br>
	- Added another Antimatter Buyable.<br>
	- Added another 3 achievements.<br>
	- Added another 3 post-break Infinity Upgrades.<br>
	- Hidden the literally impossible infinity challenge (for now).<br>
	- Endgame: 1e10 IP with 8 post-break Upgrades bought.<br><br>

	<h3 style='color: #ffff00'>2023-02-14 build (Priate: Infinity Power update Beta 1)</h3><br>
	- Added Infinity Power.<br>
	- Added an Antimatter Buyable.<br>
	- Added 2 achievements.<br>
	- Added 5 post-break Infinity Upgrades.<br>
	- Added an Infinity Challenge that is literally impossible now.<br>
	- Added IP/min display if your resource/pending resource is high enough.<br>
	- Balanced up to: 2e6 IP with 5 post-break Upgrades bought.<br><br>

	<h3 style='color: #ffff00'>2023-02-13 build 2 (Update 2.1b)</h3><br>
	- Fixed Infinity stage resource on statistics node shows too early.<br><br>

	<h3 style='color: #ffff00'>2023-02-13 build (Update 2.1a)</h3><br>
	- Added Break Infinity.<br>
	- Added an achievement.<br>
	- Added Statistics node.<br>
	- Added Infinity reset Option.<br>
	- Added IP multiplier buyable.<br>
	- Added notification for past endgame.<br>
	- Number past 1.80e308 will display as Infinite if Infinity isn't broken.<br>
	- Changed m hotkey display to after first Infinity.<br>
	- Changed the color of Achievements and Autobuyer node.<br>
	- Multiplication of AM change rate happen much earlier (1e10 -> 10).<br>
	- Extended Time formatting by a bit.<br>
	- Endgame: 1e4 total IP.<br><br>

	<h3 style='color: #ffff00'>2023-02-12 build (Update 2a)</h3><br>
	- Balanced remaining challenges debuff.<br>
	- You need previous Infinity upgrade in that column to bought the next Infinity upgrade.<br>
	- Make antimatter production after exp show.<br>
	- Added Autobuyer for Infinity reset.<br>
	- Endgame: 1000 Total Infinity Points with all Infinity Upgrades bought and all Challenges completed.<br><br>
	
	<h3 style='color: #ffff00'>2023-02-11 build (Priate: Infinity update Beta 2)</h3><br>
	- Balanced 5 out of 8 challenges debuff.<br>
	- Added Buy Max Button.<br>
	- Added another 3 Achievements.<br>
	- Softcapped all antimatter buyables past 1.80e308 AM, except 'Producer'. (58,52,38,10,3)<br>
	- Softcapped antimatter exponent at 9.<br>
	- Balanced up to: 5/8 Challenges.<br><br>

	<h3 style='color: #ffff00'>2023-02-10 build (Priate: Infinity update Beta 1)</h3><br>
	- Added Infinity, include upgrade and challenges.<br>
	- Added Buy Max Hotkey, require Infinity once.<br>
	- Added Autobuyers.<br>
	- Balanced up to: 8/12 Infinity Upgrades.<br><br>

	<h3 style='color: #ff0000'>2023-02-09 build (Update 1b)</h3><br>
	- Added 3 achievements (only 1 is possible yet).<br>
	- Added best antimatter.<br>
	- Added full display option for Time.<br>
	- Added a secret.<br>

	<h3 style='color: #ff0000'>2023-02-08 build (Update 1a)</h3><br>
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
	matter: new Decimal(1),
	bestAM: new Decimal(1),
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return "Endgame: " + 
		formatWhole(player.inf.best) + "/1.00e53 best Infinity Points<br>" + 
		formatWhole(challengeCompletions('inf',51)) + "/11 IC1 completion<br>" + 
		(player.inf.best.gte(1e53) && challengeCompletions('inf',51)>=11?"<text style='color: #007fff'>You are past endgame,<br>and the game might break here.</text>":"")
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