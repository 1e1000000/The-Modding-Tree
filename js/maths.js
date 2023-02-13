function powExp(n, exp){ // dilate
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powExp2(n, exp){ // Trilate
	if (n.lt(1e10)) return n
	return Decimal.pow(10,Decimal.pow(10,n.log10().log10().pow(exp)))
}

function powExp3(n, exp){ // Tetralate
	if (n.lt(Decimal.pow(10,1e10))) return n
	return Decimal.pow(10,Decimal.pow(10,Decimal.pow(10,n.log10().log10().log10().pow(exp))))
}

function mulSlog(n, mul){
	if (n.lt(10)) return n
	return tet10(slog(n).mul(mul))
}

function powSlog(n, exp){ // Vaccinate
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function powSlogExp(n, exp){ //Vaccidilate
	if (n.lt(10)) return n
	return tet10(powExp(slog(n),exp))
}

function slog(n){ // slog10(x), .slog is bugged >=eee9e15
	n = new Decimal(n)
	return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function slogadd(n,add){
	n = new Decimal(n)
	return Decimal.tetrate(10,slog(n).add(add))
}

function tet10(n){
	n = new Decimal(n)
	return Decimal.tetrate(10,n)
}



function getAMUpgETA(curr, prod, goal, exp=new Decimal(1)){
    curr = new Decimal(curr)
    prod = new Decimal(prod)
    goal = new Decimal(goal)
    let currRT = curr.root(exp)
    let goalRT = goal.root(exp)
    let t = goalRT.sub(currRT).div(prod)
    return t.max(0)
}

function getRateChangewithExp(curr,prod,exp,time=1){
    curr = new Decimal(curr)
    prod = new Decimal(prod)
	exp = new Decimal(exp)
	let next = curr.root(exp).add(prod.mul(time)).pow(exp)
	if (next.div(curr).gte(10)) return {multi: true, value: next.div(curr)}
	else return {multi: false, value: next.sub(curr)}
}