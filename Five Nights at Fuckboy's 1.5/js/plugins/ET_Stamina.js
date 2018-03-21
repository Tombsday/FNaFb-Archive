//=============================================================================
// ET_Stamina.js
//=============================================================================
//v0.1
/*:
 * @plugindesc Stamina - Dash
 * @author Eivind Teig
 *
 * @param Bar 1 X starting
 * @desc Select x position.
 * @default 0
 *
 * @param Bar 1 Y starting
 * @desc Select the y position.
 * @default 0
 *
 * @param Bar 1 Width
 * @desc Select the width.
 * @default 100
 *
 * @param Bar 1 Height
 * @desc Select the height.
 * @default 50
 *
 * @param Bar 1 color 1
 * @desc Select the color.
 * @default 30
 *
 * @param Bar 1 color 2
 * @desc Select the color.
 * @default 30
 *
 * @param Reduce rate
 * @desc Select the color.
 * @default 0.001
 *
 * @param Recover rate
 * @desc Select the color.
 * @default 0.0005
 *
 *
 * @help Use Default parameters, test and give feedback if they break anything
 *
*/
var ET = ET || {};
ET.Param = ET.Param || {};
"use strict";
ET.Parameters = PluginManager.parameters('ET_Stamina');
ET.Param.bar1x = Number(ET.Parameters['Bar 1 X starting']);
ET.Param.bar1y = Number(ET.Parameters['Bar 1 Y starting']);
ET.Param.bar1w = Number(ET.Parameters['Bar 1 Width']);
ET.Param.bar1h = Number(ET.Parameters['Bar 1 Height']);
ET.Param.b1c1 = Number(ET.Parameters['Bar 1 color 1']);
ET.Param.b1c2 = Number(ET.Parameters['Bar 1 color 2']);
ET.Param.rate = 1;
ET.Param.rateReduce = parseFloat(String(ET.Parameters['Reduce rate']));
ET.Param.rateRecover = parseFloat(String(ET.Parameters['Recover rate']));
ET.Param.rateRecoverDefault = ET.Param.rateRecover;
ET.inRecovery = false;

(function(){


function Map_Bar1() { this.initialize.apply(this, arguments); }
Map_Bar1.prototype = Object.create(Window_Base.prototype);
Map_Bar1.prototype.constructor = Map_Bar1;


Map_Bar1.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this.deactivate();
    this.update();
    
};

ET.recovery = function() {
      return this.inRecovery;  
    };

Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled() && !ET.recovery()) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
       this._dashing = false;
    }
};

Game_Player.prototype.isDashButtonPressed = function() {
    var shift = Input.isPressed('shift');
    if (ConfigManager.alwaysDash && !Et.recovery()) {
        return !shift;
    } else {
        return shift;
    }
};

Map_Bar1.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.contents.clear();
    this.drawBar1( ET.Param.bar1x-16, ET.Param.bar1y-16, ET.Param.bar1w);
};

Map_Bar1.prototype.drawBar1 = function( x, y, width) {
    this.opacity = 0;
    this.makeFontSmaller();

    if (Game_Player.prototype.isDashButtonPressed() && ET.Param.rate >= 0 &&!ET.recovery()){
        ET.Param.rate = ET.Param.rate - ET.Param.rateReduce;
        ET.Param.rate = Math.round(ET.Param.rate * 1000) / 1000;
        console.log(ET.Param.rate);
        if(ET.Param.rate == 0){
            $dataMap.disableDashing = true;
            ET.inRecovery = true;
            ET.Param.rateRecover = ET.Param.rateReduce;
        }
    }else{
        if (ET.Param.rate < 1){
            ET.Param.rate = ET.Param.rate + ET.Param.rateRecover;
            ET.Param.rate = Math.round(ET.Param.rate * 10000) / 10000;
            console.log(ET.Param.rate);
        }else if(ET.Param.rate == 1){
            if($dataMap.disableDashing){
                $dataMap.disableDashing = false;
                ET.inRecovery = false
                ET.Param.rateRecover = ET.Param.rateRecoverDefault;
            } 
        }
        
    }
    
    var color1 = this.textColor(ET.Param.b1c1);
    var color2 = this.textColor(ET.Param.b1c2);
    this.drawGauge1(0, 0+32, width, ET.Param.rate , color1, color2);
    this.drawText('Stamina', 0 , 0, width, 'left');
    
 };
 
 Window_Base.prototype.drawGauge1 = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = ET.Param.bar1h + this.lineHeight() - 8;
    this.contents.fillRect(x, y, width, ET.Param.bar1h, this.gaugeBackColor());
    this.contents.gradientFillRect(x, y, fillW, ET.Param.bar1h, color1, color2);
};

var alias_SceneMapOnMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    alias_SceneMapOnMapLoaded.apply(this, arguments);
};

Scene_Map.prototype.createBar1 = function() {
this.Bar1 = new Map_Bar1(ET.Param.bar1x, ET.Param.bar1y, ET.Param.bar1w+32, ET.Param.bar1h +32);
this.addChild(this.Bar1);
};

var alias_createDisplayObjects= Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
alias_createDisplayObjects.call(this);
this.createBar1();
};
})();





