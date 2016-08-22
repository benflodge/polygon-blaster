/*Higher Order Func & Prototypes*/

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function forEach(array, action){
    for ( var i = 0; i < array.length; i++ )
        action(array[i]);
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* Events & Keys*/

var hotkeys = {

    specialKeys: {
        8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
        20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
        37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
        104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
        120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta", 70: "f", 87: "w", 83: "s", 68: "d", 65: "a", 76: "l"
    },
    shiftNums: {
        "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
        "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", ".": ">",  "/": "?",  "\\": "|"
    }
};

var addEvent = (function( window, document ) {
    if ( document.addEventListener ) {
        return function( elem, type, cb ) {
            if ( (elem && !elem.length) || elem === window ) {
                elem.addEventListener(type, cb, false );
            }
            else if ( elem && elem.length ) {
                var len = elem.length;
                for ( var i = 0; i < len; i++ ) {
                    addEvent( elem[i], type, cb );
                }
            }
        };
    }
    else if ( document.attachEvent ) {
        return function ( elem, type, cb ) {
            if ( (elem && !elem.length) || elem === window ) {
                elem.attachEvent( 'on' + type, function() { return cb.call(elem, window.event) } );
            }
            else if ( elem.length ) {
                var len = elem.length;
                for ( var i = 0; i < len; i++ ) {
                    addEvent( elem[i], type, cb );
                }
            }
        };
    }
})( this, document );

var keyDown = {};
function keyName(event) {

    return hotkeys.specialKeys[event] ||
    String.fromCharCode(event).toLowerCase();
}
function eventAction(event) {
    event = event || window.event;
    var charCode = event.charCode || event.keyCode;
    event.preventDefault();
    if (charCode)
    return keyDown[keyName(charCode)] = true;
}
function eventEnd(event) {
    event = event || window.event;
    var charCode = event.charCode || event.keyCode;
    if (charCode)
    return keyDown[keyName(charCode)] = false;
}
addEvent(document.body, "keydown", eventAction );
addEvent(document.body, "keyup", eventEnd );