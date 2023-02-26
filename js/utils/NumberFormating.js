function addCommas(s){
	if (s.length <= 3) return s
	let rem = s.length % 3
	if (rem == 0) rem = 3
	return s.slice(0, rem) + "," + addCommas(s.slice(rem))
}

function exponentialFormat(num, precision) {
	let e = num.log10().floor()
	if (options.notation == 'Engineering' || options.notation == 'Mixed Engineering') e = num.log10().div(3).floor().mul(3)
	let m = num.div(Decimal.pow(10, e))
	if (options.notation == 'Engineering' || options.notation == 'Mixed Engineering') {
		if (m.toStringWithDecimalPlaces(precision) == 1000) {
			m = new Decimal(1)
			e = e.add(3)
		}
		if (e.lt(0)) {
			m = m.mul(1e3)
			e = e.sub(3)
		}
	}
	else {
		if (m.toStringWithDecimalPlaces(precision) == 10) {
			m = new Decimal(1)
			e = e.add(1)
		}
		if (e.lt(0)) {
			m = m.mul(10)
			e = e.sub(1)
		}
	}
	let start = ""
	if (e.abs().lt(1e9)) {
		if (options.notation == 'Engineering' || options.notation == 'Mixed Engineering') {
			if (m.toStringWithDecimalPlaces(precision) == 1000) {
				m = new Decimal(1)
				e = e.add(3)
			}
		}
		else {
			if (m.toStringWithDecimalPlaces(precision) == 10) {
				m = new Decimal(1)
				e = e.add(1)
			}
		}
		start = m.toStringWithDecimalPlaces(precision)
	}
	
	let end = e.toStringWithDecimalPlaces(0)
	if (!player.secret.ohio) {
		if (!end.includes("e")) end = addCommas(end.replace(/-/g, ''))
		if (e.lt(0)) end = "-"+end
	}
	return start + "e" + end
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    if (!player.secret.ohio) portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
	return x || new Decimal(y)
}

function sumValues(x) {
	x = Object.values(x)
	if (!x[0]) return new Decimal(0)
	return x.reduce((a, b) => Decimal.add(a, b))
}

function t1format(x,mult=false,y) {
	let ills = ['','M','B','T','Qa','Qi','Sx','Sp','Oc','No']
	let t1ones = ["","U","D","T","Qa","Qi","Sx","Sp","Oc","No"]
	if (mult && y>0 && x<10) t1ones = ["","","D","T","Qa","Qi","Sx","Sp","Oc","No"]
	let t1tens = ["","Dc","Vg","Tg","Qag","Qig","Sxg","Spg","Ocg","Nog"]
	let t1hunds = ["","Ce","De","Te","Qae","Qie","Sxe","Spe","Oce","Noe"]
	let t1f = ills[x]
	if (mult && y>0) t1f = t1ones[x]
	if (x>=10) t1f = t1ones[x%10]+t1tens[Math.floor(x/10)%10]+t1hunds[Math.floor(x/100)]
	return t1f
}

function t2format(x,mult=false,y) {
	let t2ills = ["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"]
	let t2ones = ["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"]
	if (mult && y>0 && x<10) t2ones = ["","","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"]
	let t2tens = ["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"]
	let t2hunds = ["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	let t2f = t2ills[x]
	if (mult && y>0) t2f = t2ones[x]
	let t2t = t2tens[Math.floor(x/10)%10]
	if (x%100==10) t2t='Vec'
	if (x>=10) t2f = t2ones[x%10]+t2t+t2hunds[Math.floor(x/100)]
	return t2f
}

function t3format(x,mult=false,y,z) {
	let t3ills = ["","Kl","Mg","Gi","Ter","Pt","Ex","Zt","Yt","Xe"]
	let t3ones = ["","eN","oD","tR","tE","pT","eX","zE","yO","xN"]
	let t3tns = ["Dk","Hn","Dok","TrD","TeD","PeD","ExD","ZeD","YoD","NeD"]
	let t3to = ["k","k","c","c","c","k","k","c","k","c"]
	if (mult && y>0 && x<10) t3ones = ["","","D","Tr","T","P","Ex","Z","Y","N"]
	let t3tens = ["","","I","Tr","Te","P","E","Z","Y","N"]
	let t3hunds = ["","Ho","Do","Tro","To","Po","Ex","Zo","Yo","No"]
	let t3f = t3ills[x]
	if ((mult && y>0) || z>=1e3) t3f = t3ones[x]
	let t3t = t3tens[Math.floor(x/10)%10]
	let t3h = t3hunds[Math.floor(x/100)]
	if (x%100==0) t3h+='T'
	if (x%100<20&&x%100>9) t3t = t3tns[x%10]
	if (x%100>19) t3t += t3to[x%10]+t3ones[x%10]
	if (x>=10) t3f = t3h+t3t
	return t3f
}

function t4format(x,m) {
	let t4ills = ["","aL","eJ","iJ","AsT","uN","rM","oV","oL","eT","O","aX","uP","rS","lT"]
	let t4m = ["","K","M","G","","L","F","J","S","B","Gl","G","S","V","M"]
	let t4f = t4ills[x]
	if (m<2) t4f = t4m[x]+t4f
	return t4f
}

function standard(decimal, precision){
	decimal = new Decimal(decimal)
	if (decimal.sign < 0) return "-"+standard(decimal.neg(), precision)
	if (decimal.layer > 4 || (decimal.mag > Math.log10(3e45) && decimal.layer == 4)) {
		var slog = decimal.slog()
		if (slog.gte(player.secret.ohio?1e15:1e9)) return "F" + formatWhole(slog.floor())
		if (slog.gte(100)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
		else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(4) + "F" + commaFormat(slog.floor(), 0)
	}
	let illion = decimal.log10().div(3).floor().sub(1)
	let m = decimal.div(Decimal.pow(1e3,illion.add(1)))
	if (m.toStringWithDecimalPlaces(precision) == 1000) {
		m = new Decimal(1)
		illion = illion.add(1)
	}
	if (decimal.log10().lt(player.secret.ohio?1e15:1e9)) m = m.toStringWithDecimalPlaces(precision)+' '
	else m = ''
	let t2illion = illion.max(1).log10().div(3).floor()
	let t3illion = t2illion.max(1).log10().div(3).floor()
	let t4illion = t3illion.max(1).log10().div(3).floor()
	let t1 = illion.div(Decimal.pow(1e3,t2illion.sub(2))).floor().toNumber()
	if (illion.lt(1e3)) t1 = illion.toNumber()
	let t2 = t2illion.div(Decimal.pow(1e3,t3illion.sub(2))).floor().toNumber()
	if (t2illion.lt(1e3)) t2 = t2illion.toNumber()
	let t3 = t3illion.div(Decimal.pow(1e3,t4illion.sub(2))).floor().toNumber()
	if (t3illion.lt(1e3)) t3 = t3illion.toNumber()
	let t4 = t4illion.toNumber()
	let st = t1format(t1)
	if (illion.gte(1e3)) st = t1format(Math.floor(t1/1e6),true,t2)+t2format(t2)+((Math.floor(t1/1e3)%1e3>0)?('-'+t1format(Math.floor(t1/1e3)%1e3,true,t2-1)+t2format(t2-1)):'')
	if (illion.gte(1e6)) st += ((t1%1e3>0)?('-'+t1format(t1%1e3,true,t2-2)+t2format(t2-2)):'')
	if (t2illion.gte(1e3)) st = t2format(Math.floor(t2/1e6),true,t3)+t3format(t3)+((Math.floor(t2/1e3)%1e3>0)?("a'-"+t2format(Math.floor(t2/1e3)%1e3,true,t3-1)+t3format(t3-1)):'')
	if (t2illion.gte(1e6)) st += ((t2%1e3>0)?("a'-"+t2format(t2%1e3,true,t3-2)+t3format(t3-2)):'')
	if (t3illion.gte(1e3)) st = t3format(Math.floor(t3/1e6),true,t4)+t4format(t4,Math.floor(t3/1e6))+((Math.floor(t3/1e3)%1e3>0)?("`-"+t3format(Math.floor(t3/1e3)%1e3,true,t4-1,t3)+t4format(t4-1,Math.floor(t3/1e3)%1e3)):'')
	if (t3illion.gte(1e6)) st += ((t3%1e3>0)?("`-"+t3format(t3%1e3,true,t4-2,t3)+t4format(t4-2,t3%1e3)):'')
	if (decimal.mag >= (player.secret.ohio?1e15:1e9) || (decimal.layer>0 && decimal.mag>=0))return m+st
	if (decimal.mag >= 1e3) return commaFormat(decimal, 0)
	if (decimal.mag >= 0.001) return regularFormat(decimal, precision)
	if (decimal.sign!=0) return '1/'+standard(decimal.recip(),precision)
	return regularFormat(decimal, precision)
}

function hyperEformat(decimal, precision) {
	decimal = new Decimal(decimal)
	let s = slog(decimal)
	let mag = s.sub(s.floor()).pow10().pow10()
	let m = commaFormat(mag,precision)
	if (mag.gte(1e6)) m = commaFormat(mag,0)
	let e = commaFormat(s.floor().sub(1),0)
	if (s.gte(player.secret.ohio?1e15:1e9)) e = formatWhole(s.floor())
	if (decimal.layer >= (player.secret.ohio?1e15:1e10)) return hyperEformat(s,precision)+'#2'
	if (!player.secret.ohio) if (decimal.layer >= 1e9) return 'E1#'+e
	if ((decimal.layer > 0 && decimal.mag>0) || decimal.mag >= (player.secret.ohio?1e15:1e10)) return 'E'+m+'#'+e
	if (decimal.mag >= 1e3) return commaFormat(decimal, 0)
	if (decimal.mag >= 0.001) return regularFormat(decimal, precision)
	if (decimal.mag >= 1/9e15) return '1/'+standard(decimal.recip(),precision)
	if (decimal.sign!=0) return '1/'+hyperEformat(decimal.recip(),precision)
	return regularFormat(decimal,precision)
}

function letter(decimal, precision, str) { //AD NG+++
	decimal = new Decimal(decimal)
	let len = new Decimal(str.length);
	let ret = ''
	let power = decimal.log10().div(3).floor()
	let m = decimal.div(Decimal.pow(1e3,power))
	if (m.toStringWithDecimalPlaces(precision) == 1000) {
		m = new Decimal(1)
		power = power.add(1)
	}
	let skipped = Decimal.floor(Decimal.log10(power.mul(len.sub(1)).add(1)).div(Decimal.log10(len))).sub(7)
	if (skipped.lt(4)) skipped = new Decimal(0)
	else power = Decimal.floor((power.sub((Decimal.pow(len, skipped).sub(1))).div(len.sub(1)).mul(len)).div(Decimal.pow(len, skipped)))
	while (power.gt(0)) {
		ret = str[(power.sub(1)).toNumber() % len.toNumber()] + ret
		power = Decimal.ceil(power.div(len)).sub(1)
	}
	if (isNaN(skipped.sign)||isNaN(skipped.layer)||isNaN(skipped.mag)) skipped = new Decimal(0)
	skipped = skipped.add(7)
	let lett = Decimal.mul((player.secret.ohio?1e15:1e9),Decimal.log10(len))
	let s = slog(skipped).sub(slog(lett)).div(2).floor().add(1)
	let sl = tet10(slog(skipped).sub(slog(skipped).sub(slog(lett)).div(2).floor().mul(2))).mul(Decimal.log(10,len))
	if (decimal.layer >= (player.secret.ohio?1e15:1e9)) return '{'+formatWhole(s)+'}'
	if (decimal.gte(tet10(slog(lett).add(8)))) return format(sl)+'{'+formatWhole(s)+'}'
	if (skipped.gte(player.secret.ohio?1e15:1e9)) return "["+letter(skipped, precision, str)+"]"
	if (skipped.gt(7)) ret += "[" + commaFormat(skipped, 0) + "]"
	if (decimal.gte(player.secret.ohio?"ee15":"ee9")) return ret
	if (decimal.gte(player.secret.ohio?1e15:1e9)) return m.toStringWithDecimalPlaces(precision)+' '+ret
	if (decimal.mag >= 1e3) return commaFormat(decimal, 0)
	if (decimal.mag >= 0.001) return regularFormat(decimal, precision)
	if (decimal.sign!=0) return '1/'+letter(decimal.recip(),precision,str)
	return regularFormat(decimal,precision)
}

function format(decimal, precision=3) {
	decimal = new Decimal(decimal)
	if (decimal.sign < 0) return "-"+format(decimal.neg(), precision)
	if (decimal.mag<0) {
		if (decimal.layer > 3 || (decimal.mag < -1e10 && decimal.layer == 3)) return "1/" + format(decimal.recip(), precision)
		else exponentialFormat(decimal, precision)
	}
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
	if (options.notation == 'Standard') {
		return standard(decimal, precision)
	}
	else if (options.notation == 'Hyper-E') {
		return hyperEformat(decimal, precision)
	}
	else if (options.notation == 'Letters') {
		return letter(decimal, precision, 'abcdefghijklmnopqrstuvwxyz')
	}
	else if (options.notation == 'Cancer') {
		return letter(decimal, precision, ['😠', '🎂', '🎄', '💀', '🍆', '🐱', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡'])
	}
	else return formatSciEng(decimal, precision)
}

function formatSciEng(decimal, precision) {
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		for (i in player){
			if (player[i] == undefined) continue
			if (player[i].points != undefined) {
				if (isNaN(player[i].points.mag)) console.log(i + "'s points are NaN")
			}
		}
		
		return "NaN"
	}
	if (options.notation == 'Mixed Scientific' || options.notation == 'Mixed Engineering'){
		if (decimal.layer < 1 || (Math.abs(decimal.mag) < (player.secret.ohio?3003:63) && decimal.layer == 1)) return standard(decimal,precision)
	}
	if (decimal.sign < 0) return "-"+format(decimal.neg(), precision)
	if (decimal.mag<0) {
		if (decimal.layer > 3 || (decimal.mag < -1e10 && decimal.layer == 3)) return "1/" + format(decimal.recip(), precision)
		else exponentialFormat(decimal, precision)
	}
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
	if (decimal.layer > 3 || (decimal.mag > 1e10 && decimal.layer == 3)) {
		var slog = decimal.slog()
		if (slog.gte(player.secret.ohio?1e15:1e9)) return "F" + formatWhole(slog.floor())
		if (slog.gte(100)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
		else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
	} else if (decimal.layer > 2 || (Math.abs(decimal.mag) >= (player.secret.ohio?1e15:1e9) && decimal.layer == 2)) {
		return "e" + format(decimal.log10(), precision)
	} else if (decimal.layer > 1 || (Math.abs(decimal.mag) >= (player.secret.ohio?1e15:1e9) && decimal.layer == 1)) {
		return "e" + format(decimal.log10(), 3)
	} else if (decimal.layer > 0 || decimal.mag >= (player.secret.ohio?1e15:1e9)) {
		return exponentialFormat(decimal, precision)
	} else if (decimal.mag >= 1000) {
		return commaFormat(decimal, 0)
	} else if (decimal.mag>=0.001) {
		return regularFormat(decimal, precision)
	} else if (decimal.sign!=0) {
		return exponentialFormat(decimal, precision)
	} else return regularFormat(decimal, precision)
}


function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(player.secret.ohio?1e15:1e9)) return format(decimal, 3)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 3)
    return format(decimal, 0)
}

function formatTime(s) {
	s = new Decimal(s)
	if (s.mag == Number.POSITIVE_INFINITY) return "Infinite Time"
	if (player.secret.ohio) return format(s) + " s"
    let m = new Decimal(0)
    let h = new Decimal(0)
    let d = new Decimal(0)
    let y = new Decimal(0)
	if (s.lte(1)) return formatWhole(s.mul(1000)) + "ms"
    else if (s.lte(10)) return format(s,3) + "s"
    else if (s.lte(60)) return format(s,2) + "s"
    else if (s.lte(3600)){
        m = s.div(60).floor()
        s = s.sub(m.mul(60))
        return formatWhole(m) + "m " + format(s,1) + "s"
    }
    else if (s.lte(86400)){
        h = s.div(3600).floor()
        s = s.sub(h.mul(3600))
        m = s.div(60).floor()
        s = s.sub(m.mul(60))
        return formatWhole(h) + "h " + formatWhole(m) + "m " + format(s,0) + "s"
    }
    else if (s.lte(31536000)){
        d = s.div(86400).floor()
        s = s.sub(d.mul(86400))
        h = s.div(3600).floor()
        s = s.sub(h.mul(3600))
        m = s.div(60).floor()
        s = s.sub(m.mul(60))
        return formatWhole(d) + "d " + formatWhole(h) + "h " + formatWhole(m) + "m " + format(s,0) + "s"
    }
    else if (s.lte(31536000000)){
        y = s.div(3.1536e7).floor()
        s = s.sub(y.mul(3.1536e7))
        d = s.div(86400).floor()
        s = s.sub(d.mul(86400))
        h = s.div(3600).floor()
        s = s.sub(h.mul(3600))
        m = s.div(60).floor()
        s = s.sub(m.mul(60))
        return formatWhole(y) + "y " + formatWhole(d) + "d " + formatWhole(h) + "h " + formatWhole(m) + "m " + format(s,0) + "s"
    }
    else return formatTimeLong(s)
}

function verseTime(years) {
	s = slog(new Decimal(years)).sub(Decimal.log10(9))
	let verse1 = [2,3,4,5]
	let verse2 = ["multi","meta","xeno","hyper"]
	let id = 0;
		if (s.gte(verse1[verse1.length - 1])) id = verse1.length - 1;
		else {
			while (s.gte(verse1[id])) id++;
			if (id > 0) id--;
		}
	let mag = slogadd(years,-verse1[id]+1).div(1e9)
	return [mag,verse2[id]]
}

function formatTimeLong(s) {
	s = new Decimal(s)
	if (s.mag == Number.POSITIVE_INFINITY) return "Infinite Time"
	if (player.secret.ohio) return format(s) + " seconds"
	let years = s.div(31556952)
	let mlt = verseTime(years)
	let arv1 = [1,1e15,1e30,1e45,1e60,1e75,1e90,1e105]
	let arv2 = ["","mega","giga","tera","peta","exa","zetta","yotta"]
	let id = 0;
		if (mlt[0].gte(arv1[arv1.length - 1])) id = arv1.length - 1;
		else {
			while (mlt[0].gte(arv1[id])) id++;
			if (id > 0) id--;
		}
	let verse = arv2[id]+(arv2[id]!=""?"-":"")+mlt[1]
	if (mlt[1]=="multi") {
		verse = arv2[id]
		if (arv2[id]=="") verse = "multi"
	}
	if (years.gte("6pt9")) return format(slog(years).pow10().div(9e6)) + " omniverse ages"
	if (years.gte("eee56") && years.lt("eee69")) return format(years.log10().log10().div(1e56)) + " new big bangs"
	if (years.gte("ee120") && years.lt("eee9")) return format(years.log10().div(1e120)) + " big rips"
	if (years.gte("ee9")) return format(mlt[0].div(arv1[id])) + " " + verse +"verse ages"
	if (years.gte(1e100)) return format(years.div(1e100)) + " black hole eras"
	if (years.gte(1e40)) return format(years.div(1e40)) + " degenerate eras"
	if (years.gte(1e9)) return format(years.div(1e9)) + " aeons"
	if (years.gte(1e3)) return format(years.div(1e3)) + " millenia"
	if (years.gte(1)) return format(years) + " years"
	if (s.gte(86400)) return format(s.div(86400)) + " days"
	if (s.gte(3600)) return format(s.div(3600)) + " hours"
	if (s.gte(60)) return format(s.div(60)) + " minutes"
	if (s.gte(1)) return format(s) + " seconds"
	if (s.gte(0.001)) return format(s.mul(1e3)) + " milliseconds"
	if (s.gte(1e-6)) return format(s.mul(1e6)) + " microseconds"
	if (s.gte(1e-9)) return format(s.mul(1e9)) + " nanoseconds"
	if (s.gte(1e-12)) return format(s.mul(1e12)) + " picoseconds"
	if (s.gte(1e-15)) return format(s.mul(1e15)) + " femtoseconds"
	if (s.gte(1e-18)) return format(s.mul(1e18)) + " attoseconds"
	if (s.gte(1e-21)) return format(s.mul(1e21)) + " zeptoseconds"
	if (s.gte(1e-24)) return format(s.mul(1e24)) + " yoctoseconds"
	return format(s.mul(1.855e43)) + " Planck Times"
}

function formatSize(s) {
	s = new Decimal(s)
	if (s.mag == Number.POSITIVE_INFINITY) return "Infinite Length"
	if (player.secret.ohio) return format(s) + " meters"
	let scale1 = [1.616255e-35,1e-24,1e-21,1e-18,1e-15,1e-12,1e-9,1e-6,0.001,0.01,1,1e3,1e6,1e9,1.495978707e11,9.46e15,8.8e26]
	let scale2 = [" Planck Lengths"," yoctometers"," zeptometers"," attometers"," femtometers"
	," picometers"," nanometers"," micrometers"," millimeters"," centimeters"," meters"," kilometers"
	," megameters", " gigameters", " astronomical units", " light-years", " observable universes"]
	let id = 0;
		if (s.gte(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (s.gte(scale1[id])) id++;
			if (id > 0) id--;
		}
	return format(s.div(scale1[id])) + scale2[id]
}

function distShort(s) {
	s = new Decimal(s)
	if (s.mag == Number.POSITIVE_INFINITY) return "Inf uni"
	if (player.secret.ohio) return format(s) + " m"
	let scale1 = [1.616255e-35,1e-24,1e-21,1e-18,1e-15,1e-12,1e-9,1e-6,0.001,0.01,1,1e3,1e6,1e9,1.495978707e11,9.46e15,8.8e26]
	let scale2 = [" PL"," ym"," zm"," am"," fm"
	," pm"," nm"," um"," mm"," cm"," m"," km"
	," Mm", " Gm", " AU", " ly", " uni"]
	let id = 0;
		if (s.gte(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (s.gte(scale1[id])) id++;
			if (id > 0) id--;
		}
	return format(s.div(scale1[id])) + scale2[id]
}

function heightComp(s) {
	s = new Decimal(s)
	let scale1 = [1.71,10,93,828,8848,408e3,385e6,1.71*78e8,1.495978707e11,45e11,14e13
		,42e15,2.62062e20,2.4001873e22,2.36518e24]
	let scale2 = [ " you"," a house"," the Statue of Liberty"," Burj Khalifa", " Mount Everest", " the distance to ISS", " the distance to the Moon", " the total human height", " the distance to the Sun", " the distance to Neptune", " the farthest distance from Sedna", " the distance to Proxima Centauri"
	," the distance to the center of the Milky Way"," the distance to Andromeda"," the distance to the Great Attractor"]
	let id = 0;
		if (s.gte(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (s.gte(scale1[id])) id++;
			if (id > 0) id--;
		}
	return format(s.div(scale1[id])) + " times taller than" + scale2[id]
}

function toPlaces(x, precision, maxAccepted) {
	x = new Decimal(x)
	let result = x.toStringWithDecimalPlaces(precision)
	if (new Decimal(result).gte(maxAccepted)) {
		result = new Decimal(maxAccepted-Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
	}
	return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}