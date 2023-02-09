
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(1000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 2)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeeee1")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e1000")) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(t, full = false) {
    t = new Decimal(t)
    if (t.mag == Number.POSITIVE_INFINITY) return "Infinite Time"
    if (isNaN(t.sign) || isNaN(t.layer) || isNaN(t.mag)) return "Infinite Time"
    let y2 = t.div(31536000)
    let y = t.div(31536000).floor()
    let d = t.sub(y.mul(31536000)).div(86400).floor()
    let h = t.sub(y.mul(31536000)).sub(d.mul(86400)).div(3600).floor()
    let m = t.sub(y.mul(31536000)).sub(d.mul(86400)).sub(h.mul(3600)).div(60).floor()
    let s = t.sub(y.mul(31536000)).sub(d.mul(86400)).sub(h.mul(3600)).sub(m.mul(60))
    if (y.gte(1)){
        if (y.gte(full?1e9:10)) return format(y2) + "y"
        else if (!full) return formatWhole(y) + "y " + formatWhole(d) + "d"
        else return formatWhole(y) + "y " + formatWhole(d) + "d " + formatWhole(h) + "h " + formatWhole(m) + "m " + formatWhole(s.floor()) + "s"
    } else if (d.gte(1)){
        if (d.gte(7) && !full) return formatWhole(d) + "d " + formatWhole(h) + "h"
        else return formatWhole(d) + "d " + formatWhole(h) + "h " + formatWhole(m) + "m " + formatWhole(s.floor()) + "s"
    } else if (h.gte(1)) return formatWhole(h) + "h " + formatWhole(m) + "m " + formatWhole(s.floor()) + "s"
    else if (m.gte(1)) return formatWhole(m) + "m " + format(s,1) + "s"
    else if (s.gte(10)) return format(s,2) + "s"
    else if (s.gte(1)) return format(s,3) + "s"
    else return formatWhole(s.mul(1000).floor()) + "ms"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
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