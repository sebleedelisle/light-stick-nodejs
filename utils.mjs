let instance = null; 


/// CONSOLE COLOURS : 
const consoleColours = { 
    Reset : "\x1b[0m",
    Bright : "\x1b[1m",
    Dim : "\x1b[2m",
    Underscore : "\x1b[4m",
    Blink : "\x1b[5m",
    Reverse : "\x1b[7m",
    Hidden : "\x1b[8m",

    FgBlack : "\x1b[30m",
    FgRed : "\x1b[31m",
    FgGreen : "\x1b[32m",
    FgYellow : "\x1b[33m",
    FgBlue : "\x1b[34m",
    FgMagenta : "\x1b[35m",
    FgCyan : "\x1b[36m",
    FgWhite : "\x1b[37m",

    BgBlack : "\x1b[40m",
    BgRed : "\x1b[41m",
    BgGreen : "\x1b[42m",
    BgYellow : "\x1b[43m",
    BgBlue : "\x1b[44m",
    BgMagenta : "\x1b[45m",
    BgCyan : "\x1b[46m",
    BgWhite : "\x1b[47m"
}


class _Utils { 

    constructor() {
        if(!instance) instance = this; 
        this._name = ""; 
        this.colours = consoleColours; 
        this.colour = consoleColours.Reset; 

        this.delimiter = "|||"; 

        return instance; 
    }

    set name(name) { 
        this._name = name; 
    }
    logNotice(...args) { 
  //      console.log("["+this._name+" NOTICE]: "+new Date().toLocaleString('en-GB'), ...args); 
        //console.log(consoleColours.FgGreen+"["+this._name+" NOTICE] "+consoleColours.Dim+": "+new Date().toLocaleTimeString('en-GB')+consoleColours.Reset, ...args); 
        console.log(consoleColours.Dim+new Date().toLocaleTimeString('en-GB')+consoleColours.Reset+consoleColours.FgGreen+" [NOTICE]"+this.colour+"["+this._name+"] "+consoleColours.Reset, ...args); 
  
    }
    logError(...args) { 
        console.log(consoleColours.Dim+new Date().toLocaleTimeString('en-GB')+consoleColours.Reset+consoleColours.FgRed+" [ERROR] "+this.colour+"["+this._name+"] "+consoleColours.Reset, ...args); 
    }


    getIpAddressFromRequest(req) { 
        return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        (req.connection.socket && req.connection.socket.remoteAddress);
    }
    getIpAddressFromWebSocket(websocket) { 
        return websocket.handshake.headers['x-forwarded-for'] || websocket.handshake.address;
    }
    getCors() { 
        return "*"; 
    }

    getHSLColour(h,s,l) { 
        return { h:h, s:s, l:l};
    }

    map(value, min1, max1, min2, max2, clampResult) { 
        var returnvalue = ((value-min1) / (max1 - min1) * (max2-min2)) + min2; 
        if(clampResult) return this.clamp(returnvalue, min2, max2); 
        else return returnvalue; 
    };
    
    clamp(value, min, max) { 
        if(max<min) { 
            var temp = min; 
            min = max; 
            max = temp; 
            
        }
        return Math.max(min, Math.min(value, max)); 
    };
    easeInOutCubic (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	};
    
}

const Utils = new _Utils(); 
export default Utils; 

