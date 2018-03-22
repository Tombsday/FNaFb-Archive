//=============================================================================
// ET_mapKeys.js
// Version 1.1
// Free for commercial and non commerical use.
//=============================================================================

/*:
* @plugindesc Make use of the keyboard <ET_mapKey>
* @author Eivind Teig
*
* @param Remove Esc bind
* @desc Do you want to remove the ESC bind? Num0 and insert will still work - true = remove Esc, false = keep it as normal
* @default false
*

* @help
* Input.keyTriggered 
* Input.keyPressed
* Input.keyReleased
* 
* You can call the plugin with A-Z, 0-9 and F1-F12
* Also using Javascript KeyCodes up to 256 is also allowed
* 
* Here are some examples, call them from a script command
*
* if(Input.keyTriggered("Y")){
*     $gamePlayer.requestBalloon(1);
*     console.log("You pressed Y");
* }
*
* if(Input.keyTriggered(219)){
*     $gamePlayer.requestBalloon(10);
*     console.log("You pressed [");
* }
*/

var ET_mapKey = ET_mapKey || {};

(function($){

	var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<ET_mapKey>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find ET key parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = $.Param || {};

  $.Param.removeEscBind = $.Parameters["Remove Esc bind"] !== "false";

	(function(input){

		var keyMapper = {
			'0': 48,
			'1': 49,
			'2': 50,
			'3': 51,
			'4': 52,
			'5': 53,
			'6': 54,
			'7': 55,
			'8': 56,
			'9': 57,
			'A': 65,
			'B': 66,
			'C': 67,
			'D': 68,
			'E': 69,
			'F': 70,
			'G': 71,
			'H': 72,
			'I': 73,
			'J': 74,
			'K': 75,
			'L': 76,
			'M': 77,
			'N': 78,
			'O': 79,
			'P': 80,
			'Q': 81,
			'R': 82,
			'S': 83,
			'T': 84,
			'U': 85,
			'V': 86,
			'W': 87,
			'X': 88,
			'Y': 89,
			'Z': 90,
			'F1': 112,
			'F2': 113,
			'F3': 114,
			'F4': 115,
			'F5': 116,
			'F6': 117,
			'F7': 118,
			'F8': 119,
			'F9': 120,
			'F10': 121,
			'F11': 122,
			'F12': 123,
			
		};

		var keys = [];
		var lastKey = [];
		var keyState = [];
		var clear = Input.clear;
		Input.clear = function(){
			clear.call(this);
			keys = [];
			lastKey = [];
			keyState = [];
		};

		var update = Input.update;
		Input.update = function(){
			update.call(this);
				for (var i = 0; i <= 256; i++) {
				lastKey[i] = keys[i];
				keys[i] = keyState[i] ? keys[i]+1 : 0;
			}
		};

		var _onKeyDown = Input._onKeyDown;
		Input._onKeyDown = function(event) {
			keyState[event.keyCode] = true;
			_onKeyDown.apply(this, arguments);
		}; 

		var _onKeyUp = Input._onKeyUp;
			Input._onKeyUp = function(event) {
			keyState[event.keyCode] = false;
			_onKeyUp.apply(this, arguments);
		}; 

		function convertKeyCode(keyCode){
			if (typeof keyCode === 'number'){
				return keyCode;
			}
			return keyMapper[keyCode.toUpperCase()];
		}

		Input.keyTriggered = function(keyCode){
			keyCode = convertKeyCode(keyCode);
			return keys[keyCode] && !lastKey[keyCode];
		};

		Input.keyPressed = function(keyCode){
			keyCode = convertKeyCode(keyCode);
			return keys[keyCode];
		};

		Input.keyReleased = function(keyCode){
			keyCode = convertKeyCode(keyCode);
			return !keys[keyCode] && lastKey[keyCode];
		};

		
		

	})(Input);

	if ($.Param.removeEscBind){
			Input.keyMapper[27] = '';
		}

})(ET_mapKey); 
