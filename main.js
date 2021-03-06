

// app instance variables

// main array of numbers
let field;


/*
  direction:
  0 - from top,
  1 - right,
  2 - bottom,
  3 - left
*/

function genNums(max, amount, min = 0) {
    let nums = [];
    let pow = 0;
    for(;;pow++)if(10 ** pow > max) break;
    pow = 10 ** pow;
    for(let cnt = 0; cnt < amount; cnt++) {
	let val = Math.trunc(Math.random() * pow % max);
	if(nums.indexOf(val) == -1)nums.push(val + min);
	else cnt--;
    }
    return nums;
}

function generateVals(direction) {
    let freeCells = [];
    switch(direction) {
    case 0:
	field.forEach(function(val, ind) {
	    if(val == 0) freeCells.push(ind);
	});
	if(freeCells.length == 0)return;
	let nums = genNums(freeCells.length, 1);
	field[freeCells[nums[0]]] = (Math.trunc(Math.random() * 10) > 8) ? 2 : 1;
	break;
    }
    
}

function checkPairs() {
    for(let cnt = 0; cnt < 16; cnt++) {
	let val = field[cnt];
	if((val == 0) ||
	   (((cnt + 1) % 4) ? (field[cnt + 1] == val) : false) ||
	   (( cnt % 4     ) ? (field[cnt - 1] == val) : false) ||
	   (field[cnt + 4] == val) ||
	   (field[cnt - 4] == val)) {
	    return true;    
	}
    }
    alert("game over");
    return false;
}


/*
  from, to : cell {
  var hor, ver;
  }
*/
function moveCell(from, to) {
    let ind = to.ver * 4 + to.hor;
    let filler = $(document.createElement("div"));
    filler.addClass("h-" + from.hor.toString() +
		    " v-" + from.ver.toString() +
		    " filler num-block");
    filler.append(document.createElement("span"));
    
    let cellFrom = $("#main div.h-" +
		     from.hor.toString() + ".v-" +
		     from.ver.toString()).not(".filler");
    
    /* 	     $("#main").append(cellFrom);*/
    
    
    /* 	     filler.insertBefore(cellFrom);*/
    /* 	     cellFrom.detach();*/
    
    $("#main").prepend(filler);
    
    cellFrom.toggleClass("h-" + from.hor.toString() +
 			 " v-" + from.ver.toString());
    cellFrom.toggleClass("h-" + to.hor.toString() +
 			 " v-" + to.ver.toString());
    
    let cleanUp = function() {
	cellFrom.find("span").text(2 ** field[ind]);
	let save = cellFrom.detach();
	$("#main div.h-" +
	  to.hor.toString() + ".v-" +
	  to.ver.toString()).remove();
	$("#main").append(save);
    }
    
    setTimeout(cleanUp, 200);

}

function render() {
    $("#main div").remove();
    field.forEach(function(el, ind) {
	let newEl = document.createElement("div");
	let span = document.createElement("span")
	$(newEl).addClass("num-block");
	$(newEl).addClass(function() {
	    return "v-" + Math.trunc(ind / 4).toString() + " h-" + Math.trunc(ind % 4).toString();
	});
	
	if(el == 0) {
	    $(newEl).addClass("filler");
	} else {
	    span.innerHTML = 2 ** el;
	}
	
	$(newEl).append(span);
	if((el < 12) && (el > 0))$(newEl).addClass("n-" + el.toString());
	else if(el > 11)$(newEl).addClass("n-n");
	if(el == 0)
	    $('#main').prepend(newEl);
	else
	    $('#main').append(newEl);
    })
}

function moveDown() {
    let done = false;
    for(let row = 0; row < 4; row++) {
	let free = 3;
	let merge = true;
	for(let cnt = 3; cnt >= 0; cnt--) {
	    if(field[row + cnt * 4] == 0) {
		continue;
	    } else {
		
		if((cnt != 3) && (free != 3)) {
		    if(!merge) {
			merge = true;
		    } else if(field[row + (free + 1) * 4] == field[row + cnt * 4]) {
			free++;
			field[row + cnt * 4]++;
			merge = false;
		    }
		}
		
		field[row + free * 4] = field[row + cnt * 4];
		
		if(cnt != free) {
		    moveCell({hor: row, ver: cnt},
			     {hor: row, ver: free});
		    done = true;
		}
		
		if(cnt != free)
		    field[row + cnt * 4] = 0;
		free--;
		
	    }
	} 
    }
    return done;
}

function moveUp() {
    let done = false;
    for(let row = 0; row < 4; row++) {
	let free = 0;
	let merge = true;
	for(let cnt = 0; cnt < 4; cnt++) {
	    if(field[row + cnt * 4] == 0) {
		continue;
	    } else {
		
		if(cnt && free) {
		    if(!merge) {
			merge = true;
		    } else if(field[row + (free - 1) * 4] == field[row + cnt * 4]) {
			free--;
			field[row + cnt * 4]++;
			merge = false;
		    }
		}
		
		field[row + free * 4] = field[row + cnt * 4];
		if(cnt != free) {
		    moveCell({hor: row, ver: cnt},
			     {hor: row, ver: free});
		    done = true;
		}
		if(cnt != free)
		    field[row + cnt * 4] = 0;
		free++;
	    }
	} 
    }
    return done;
}

function moveLeft() {
    let done = false;
    for(let row = 0; row < 4; row++) {
	let free = 0;
	let merge = true;
	for(let cnt = 0; cnt < 4; cnt++) {
	    if(field[row * 4 + cnt] == 0) {
		continue;
	    } else {
		
		if(cnt && free) {
		    if(!merge) {
			merge = true;
		    } else if(field[row * 4 + free - 1] == field[row * 4 + cnt]) {
			free--;
			field[row * 4 + cnt]++;
			merge = false;
		    }
		}
		
		field[row * 4 + free] = field[row * 4 + cnt];
		if(cnt != free) {
		    moveCell({hor: cnt, ver: row},
			     {hor: free, ver: row});
		    done = true;
		}
		if(cnt != free)
		    field[row * 4 + cnt] = 0;
		free++;
	    }
	} 
    }
    return done;
}

function moveRight() {
    let done = false;
    for(let row = 0; row < 4; row++) {
	let free = 3;
	/* triggered if tow cells
	   were merged
	   needed to prevent merge
	   with next cell of same value
	*/
	let merge = true;
	for(let cnt = 3; cnt >= 0; cnt--) {
	    if(field[row * 4 + cnt] == 0) {
		continue;
	    } else {
		
		if((cnt != 3) && (free != 3)) {
		    if(!merge) {
			merge = true;
		    } else if(field[row * 4 + free + 1] == field[row * 4 + cnt]) {
			free++;
			field[row * 4 + cnt]++;
			merge = false;
		    }
		}
		
		field[row * 4 + free] = field[row * 4 + cnt];

		if(cnt != free) {
		    moveCell({hor: cnt, ver: row},
			     {hor: free, ver: row});
		    done = true;
		}

		if(cnt != free)
		    field[row * 4 + cnt] = 0;
		free--;
		
	    }
	} 
    }
    return done;
}

$(document).ready(function() {
    // mock for color testing
    
    /* 	     field = Array(16).fill(0).map(function(val, ind) { return (ind > 11) ? 0 : ind;});*/
    
    // real one
    field = Array(16).fill(0);
    generateVals(0);
    
    render();
})

$(document).keydown(function(key) {
    
    // arrow key codes handler

    // 37 left
    // 38 up
    // 39 right
    // 40 down
    let status;
    switch(key.which) {
    case 37:
	status = moveLeft();
	break;
    case 38:
	status = moveUp();
	break;
    case 39:
	status = moveRight();
	break;
    case 40:
	status = moveDown();
	break;
    default:
	return;
    }
    if(status)
	generateVals(0);
    setTimeout(render, 200);
    setTimeout(checkPairs, 200);
});
