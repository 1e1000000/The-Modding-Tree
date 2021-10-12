let modInfo = {
	name: "The h0nde Tree",
	id: "h0nde",
	author: "1e1000000",
	pointsName: "h0nde discord accounts",
	modFiles: ["layers.js", "tree.js", "h.js", "p.js", "t.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 48,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0822",
	name: "h0nde second social media II",
}

let changelog = `
Credit to pg132, for the design of first layer on Incrementreeverse.<br>
Credit to Vorona, for "Every Xx amount square rooted" calculation, then I make it for inverse calculation.<br><br>
    <h1>Changelog:</h1><br><br>
	<h3>v0.082</h3><br>
	- When you Shift-click, all buyables cost, all upgrades boost, h0nde super power boost and prestige points boost formula will show.<br>
	- All details on Generator buyable are moved to Statistic node.<br>
	- Added an option to only show Exponential Powerless.<br>
	- Added an option to show current twitter power instead of h0nde twitter accounts on twitter node tooltip.<br>
	- Added spaces between production breakouts.<br>
	- The progress bars are no longer use instant.<br>
	- Fixed Upgradeless reward apply when you completed Powerless.<br> 
	- Removed some useless things on Statistic node.<br>
	- Endgame remain same.<br>
	<br>
	<h3>v0.081</h3><br>
	- Added best ever h0nde power variable, it never getting reset.<br>
	- Changed the color of h0nde layer node and h0nde bar to #406da2.<br>
	- Changed the color of twitter power softcap warning to yellow.<br>
	- Moved the Info from h0nde layer to Statistics node, renamed it to Story and added more.<br>
	- Fixed the description of Achievement 13 reward and Prestige Challenge 8 description.<br>
	- Fixed twitter bar say next integer of discord accounts instead of twitter accounts, and it no longer always show.<br>
	- Endgame remain same.<br>
	<br>
	<h2>v0.08 - h0nde second social media II</h2><br>
	- Added 8 milestones, 5 achievements, 5 challenges, 5 buyables and 16 upgrades.<br>
	- Added 2 bars on Statistic tab.<br>
	- Number past 1e1,000 no longer lost the precision.<br>
	- All producer speed and product of producers now show.<br>
	- Achievements now split into pages, each page include 25 achievements.<br>
	- h0nde discord accounts now display with 1 more precision, and past ee6 will remain show resource name.<br>
	- Changed twitter reset button, and resource no longer display below reset button.<br>
	- Changed couple description.<br>
	- Softcapped Boosters buyable effect at 1e1,300x.<br>
	- Softcapped PP gain at 1e400 while the limit is broken.<br>
	- Softcapped Exponentiator buyable again at level 9.<br>
	- Softcapped Twitter Upgrade 33 at 1.80e308x and 1e4,000x.<br>
	- Exponential square rooted twitter power for every 10,000x OoM of them.<br>
	- Hardcapped h0nde power at 2.00e19,728/s.<br>
	- Fixed you can break the game by having at least 10 h0nde twitter accounts.<br>
	- Fixed Followers show with 1 fewer precision.<br>
	- Split the layer files into four.<br>
	- Renamed h0nde buyable 23.<br>
	- Endgame: 15 h0nde twitter accounts and 1e10,000 twitter power.<br>
	<br>
	<h2>v0.07 - h0nde second social media I</h2><br>
	- Added a new layer: Twitter.<br>
	- Added h0nde super power.<br>
	- Added row 2 reset time on all Prestige subtabs.<br>
	- Added 5 achievements.<br>
	- Softcapped Exponentiator buyable at level 3.<br>
	- Softcapped PP boost at 1.80e308x.<br>
	- Changed the number formatting between 1e-4 and 1e-2.<br>
	- Fixed did a row 3 reset only reset h0nde layer stuff.<br>
	- Renamed h0nde upgrade 23 again.<br>
	- Removed h0nde power and it's production on Info tab.<br>
	- Endgame: 7 h0nde twitter accounts and 1e176 prestige points.<br>
	<br>
	<h3>v0.061</h3><br>
	- Added 0.1 seconds cooldown for manual buy max Generator buyable.<br>
	- Buy Max Generator and Multiplier/Divider buyable button will be hidden after you unlock the autobuyer.<br>
	- If you have more than 100.5 honde discord accounts, you save will be reverted to 1e91 prestige points.<br>
	- Endgame remain same.<br>
	<br>
	<h2>v0.06 - h0nde Challenger</h2><br>
	- Added Challenges.<br>
	- Added 5 upgrades, 1 buyable and 5 achievements.<br>
	- Added more info on Generator buyable.<br>
	- Removed the effect display on prestige milestone 5.<br>
	- Renamed h0nde accounts to h0nde discord accounts.<br>
	- Softcapped PP gain at 1e20 while the limit is fixed.<br>
	- Fixed h0nde production past 1e1,000 h0nde power doesn't work property.<br>
	- Fixed on Statistic node, From Boosters buyable row are always show.<br>
	- Endgame: 100 h0nde discord accounts & 1e91 total PP.<br>
	<br>
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
	<h2>v0.05 - Break the Generator buyable limit</h2><br>
	- Added BREAK LIMIT, allow player to get more than 2,500 non-free Generator buyable level but reduce PP gain.<br>
	- Added 5 upgrades, 2 buyables and 5 achievements.<br>
	- Added a hotkey for prestige.<br>
	- Slightly changed 4th prestige milestone description.<br>
	- Changed the h0nde buyable 21 effect display and softcapped the effect at +10.<br>
	- Renamed h0nde upgrade 23 & achievement 25.<br>
	- Fixed you can buy buyables automatically without unlock it.<br>
	- Endgame: 1e377 h0nde powers & 1e33 total PP.<br>
	<br>
	<h2>v0.04 - The h0nde prestige era II</h2><br>
	- Added 5 upgrades and 2 achievements.<br>
	- Added a function that calculate how many upgrades in a row and a layer bought.<br>
	- Generator buyable cost can show small number.<br>
	- Renamed and buffed the Achievement 33.<br>
	- Endgame: 1e107 h0nde powers & 5e9 total PP.<br>
	<br>
	<h2>v0.03 - The h0nde prestige era I</h2><br>
	- Added a new layer (Prestige)<br>
	- Added 3 achievements.<br>
	- Added incomplete Statistics node<br>
	- Combined Buy max Multiplier and Divider buyable.<br>
	- Fixed game-breaking bug when buying max Power buyable with 0 h0nde power.<br>
	- Endgame: 27.5 h0nde discord accounts & 600 total PP.<br>
	<br>
	<h3>v0.022</h3><br>
	- Added placeholder for prestige layer.<br>
	- Endgame remain same.<br>
	<br>
	<h3>v0.021</h3><br>
	- Added just one upgrades.<br>
	- Fixed buyables can go pass limit when buying multiple.<br>
	- Endgame: 1e50 h0nde power & all h0nde upgrades.<br>
	<br>
	<h2>v0.02 - The begin of h0nde creation II</h2><br>
	- Added 2 buyables, 6 upgrades and 5 achievements.<br>
	- Added more info on Generator buyable.<br>
	- Softcap Generator buyable multiplier boost at 100 boosts.<br>
	- Make number between 1e12 and 1e15 shows scientific notation, and between e1e9 and e1e12 shows single-e scientific notation.<br>
	- Endgame: 22 h0nde discord accounts & max out Generator buyable.<br>
	<br>
    <h2>v0.01 - The begin of h0nde creation I</h2><br>
	- Initial Release.<br>
	- Endgame: 11 h0nde discord accounts.<br>
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
	bestPoints: new Decimal(0),
	bestEverh0ndePower: new Decimal(0),
	showAllStory: false
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
	if (oldVersion == 0.06 && player.bestPoints.gte(100.5)){
		alert("due to a game breaking bug, your save has been reverted to 1e91 prestige points with level 22 Prestige Gain buyable level, and you will did a forced prestige reset")
		setBuyableAmount("h",11,new Decimal(0))
		setBuyableAmount("h",12,new Decimal(0))
		setBuyableAmount("h",13,new Decimal(0))
		setBuyableAmount("h",21,new Decimal(0))
		setBuyableAmount("h",22,new Decimal(0))
		setBuyableAmount("h",23,new Decimal(0))
		player.bestPoints = new Decimal(0)
		player.h.upgrades = []
		player.h.points = new Decimal(0)
		player.p.points = new Decimal(1e91)
		player.p.total = new Decimal(1e91)
		setBuyableAmount("p",11,new Decimal(22))
	}
	if (player.t.power2 == undefined){
		player.t.power2 = player.t.power
	}
        if (oldVersion <= 0.0821 && player.a.achievements.includes("24")){
		let index = player.a.achievements.indexOf("24")
		if (index > -1) player.a.achievements.splice(index, 1)
	}
}
