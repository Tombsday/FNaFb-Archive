//=============================================================================
// μ'ki's Advanced Parallax v1.00
// MK_AdvParallax.js
//=============================================================================

var Imported = Imported || {};
var Maki = Maki || {};

//=============================================================================
/*:
 * @plugindesc v1.00 Advanced Parallax
 * @author μ'ki
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This plugin allows you to have more control on map parallaxes by defining
 * them in the map notetag. It also allows you to define multiple layered
 * parallaxes (either behind or in front of the tiles and characters), a bit
 * like in RPG Maker XP games, which have panoramas and fogs. Additionally,
 * you can make animated parallaxes (having more than one frame).
 *
 * Contact me for support/bug report:
 * listra92[at]gmail[dot]com
 * 
 * ============================================================================
 * Map Notetag
 * ============================================================================
 * 
 * <parallax>
 *   property: value
 *   ...
 * </parallax>
 * Defines a parallax with properties as follows (optionally present, have
 * their default value):
 *  - name: parallax image name (in \img\parallaxes folder)
 *  - loopx: whether to loop the parallax horizontally and let it scroll
 *  - loopy: whether to loop the parallax vertically and let it scroll
 *  - sx: the parallax horizontal scroll speed (a script to eval)
 *  - sy: the parallax vertical scroll speed (a script to eval)
 *  - x: the parallax initial x-position
 *  - y: the parallax initial y-position
 *  - alpha: the parallax opacity (0~255, a script to eval)
 *  - depth: the parallax image depth (1: behind the map tiles,
 *                                     2: just behind the map weather, a 'fog',
 *                                     3: in front of the map weather, a 'fog')
 *  - frames: number of the image animation frames
 *  - framesp: the image animation speed (frames per sec., a script to eval)
 * Note that you can define multiple tags for multiple parallaxes.
 * 
 * Example:
 * <parallax>
 * name: StarlitSky
 * loopx: true
 * loopy: true
 * sx: 4
 * sy: $gameVariables.value(1)
 * depth: 1
 * frames: 4
 * framesp: 2
 * </parallax>
 *
 * ============================================================================
 * Animated Parallaxes
 * ============================================================================
 *
 * You can make parallaxes animated with more than one frame. For such that,
 * put several files in \img\parallaxes folder, for example StarlitSky_1.png,
 * StarlitSky_2.png, ... for each frame of the parallax StarlitSky defined in
 * the map note. For non-animated ones, just put the file as usual, i.e.
 * StarlitSky.png.
 *
 * ============================================================================
 * Functions
 * ============================================================================
 *
 * $gameMap.changeParallax(name, loopX, loopY, sx, sy[, idx, opacity, framesp]);
 *
 * Changes parallax properties with designated index idx (by order of the tag
 * definition in the map note). Here sx, sy, opacity, framesp can be either
 * number or eval string.
 *
 * ============================================================================
 * Known Issues
 * ============================================================================
 *
 *  - Somewhat huge memory usage, especially in dealing with animated parallaxes.
 *
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Maki.Parameters = PluginManager.parameters('MK_AdvParallax');
Maki.Params = Maki.Params || {};
Maki.Aliases = Maki.Aliases || {};

//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

Maki.Aliases.GameMapInitialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    Maki.Aliases.GameMapInitialize.call(this);
    this._sparallaxName = [];
    this._sparallaxZero = [];
    this._sparallaxLoopX = [];
    this._sparallaxLoopY = [];
    this._sparallaxSx = [];
    this._sparallaxSy = [];
    this._sparallaxSxf = [];
    this._sparallaxSyf = [];
    this._sparallaxX = [];
    this._sparallaxY = [];
    this._sparallaxOpacity = [];
    this._sparallaxOpacityf = [];
    this._sparallaxDepth = [];
    this._sparallaxFrame = [];
    this._sparallaxFrames = [];
    this._sparallaxFrameSp = [];
    this._sparallaxFrameSpf = [];
    this._sparallaxFrameDel = [];
    this._sparallaxNeedRef = [];
};

Game_Map.prototype.parallaxName = function(idx) {
    idx = idx || 0;
    return this._sparallaxName[idx];
};

Maki.Aliases.GameMapSetupParallax = Game_Map.prototype.setupParallax;
Game_Map.prototype.setupParallax = function() {
    Maki.Aliases.GameMapSetupParallax.call(this);
    delete this._sparallaxName;
    delete this._sparallaxZero;
    delete this._sparallaxLoopX;
    delete this._sparallaxLoopY;
    delete this._sparallaxSx;
    delete this._sparallaxSy;
    delete this._sparallaxSxf;
    delete this._sparallaxSyf;
    delete this._sparallaxX;
    delete this._sparallaxY;
    delete this._sparallaxOpacity;
    delete this._sparallaxOpacityf;
    delete this._sparallaxDepth;
    delete this._sparallaxFrame;
    delete this._sparallaxFrames;
    delete this._sparallaxFrameSp;
    delete this._sparallaxFrameSpf;
    delete this._sparallaxFrameDel;
    delete this._sparallaxNeedRef;
    this._sparallaxName = [];
    this._sparallaxZero = [];
    this._sparallaxLoopX = [];
    this._sparallaxLoopY = [];
    this._sparallaxSx = [];
    this._sparallaxSy = [];
    this._sparallaxSxf = [];
    this._sparallaxSyf = [];
    this._sparallaxX = [];
    this._sparallaxY = [];
    this._sparallaxOpacity = [];
    this._sparallaxOpacityf = [];
    this._sparallaxDepth = [];
    this._sparallaxFrame = [];
    this._sparallaxFrames = [];
    this._sparallaxFrameSp = [];
    this._sparallaxFrameSpf = [];
    this._sparallaxFrameDel = [];
    this._sparallaxNeedRef = [];
    this.parseData();
};

Game_Map.prototype.parseData = function() {
    var note1 = /<(?:parallax)>/i;
    var note2 = /<\/(?:parallax)>/i;
    var notedata = $dataMap.note.split(/[\r\n]+/);
    var parallaxPatternFlag = false;
    $dataMap.parallaxPattern = [];
    var l = notedata.length;
    for (var i = 0; i < l; i++){
        if (notedata[i].match(note1)) {
            parallaxPatternFlag = true;
        } else if (notedata[i].match(note2)) {
            parallaxPatternFlag = false;
            this._sparallaxName.push('');
            this._sparallaxZero.push(ImageManager.isZeroParallax(
                this._sparallaxName[this._sparallaxName.length-1]));
            this._sparallaxLoopX.push(false);
            this._sparallaxLoopY.push(false);
            this._sparallaxSx.push(0);
            this._sparallaxSy.push(0);
            this._sparallaxSxf.push('0');
            this._sparallaxSyf.push('0');
            this._sparallaxX.push(0);
            this._sparallaxY.push(0);
            this._sparallaxOpacity.push(255);
            this._sparallaxOpacityf.push('255');
            this._sparallaxDepth.push(1);
            this._sparallaxFrame.push(0);
            this._sparallaxFrames.push(1);
            this._sparallaxFrameSp.push(1);
            this._sparallaxFrameSpf.push('1');
            this._sparallaxFrameDel.push(-1);
            this._sparallaxNeedRef.push(true);
            var ll = $dataMap.parallaxPattern.length;
            for (var j = 0; j < ll; j++) {
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:name):[ ](.*)/i)) {
                    this._sparallaxName[this._sparallaxName.length-1] = String(RegExp.$1);
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:loopx):[ ](.*)/i)) {
            this._sparallaxLoopX[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:loopy):[ ](.*)/i)) {
            this._sparallaxLoopY[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:sx):[ ](.*)/i)) {
            this._sparallaxSxf[this._sparallaxName.length-1] = String(RegExp.$1);
            this._sparallaxSx[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:sy):[ ](.*)/i)) {
            this._sparallaxSyf[this._sparallaxName.length-1] = String(RegExp.$1);
            this._sparallaxSy[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:x):[ ](.*)/i)) {
            this._sparallaxX[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:y):[ ](.*)/i)) {
            this._sparallaxY[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:alpha):[ ](.*)/i)) {
            this._sparallaxOpacityf[this._sparallaxName.length-1] = String(RegExp.$1);
            this._sparallaxOpacity[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:depth):[ ](.*)/i)) {
            this._sparallaxDepth[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:frames):[ ](.*)/i)) {
            this._sparallaxFrames[this._sparallaxName.length-1] = eval(String(RegExp.$1));
                } else
                if ($dataMap.parallaxPattern[j].match(/[ ]*(?:framesp):[ ](.*)/i)) {
            this._sparallaxFrameSpf[this._sparallaxName.length-1] = String(RegExp.$1);
            this._sparallaxFrameSp[this._sparallaxName.length-1] = eval(String(RegExp.$1));
            this._sparallaxFrameDel[this._sparallaxName.length-1] =
                Math.floor(60/this._sparallaxFrameSp[this._sparallaxName.length-1]);
                }
            }
            $dataMap.parallaxPattern = [];
        } else if (parallaxPatternFlag) {
            $dataMap.parallaxPattern.push(notedata[i]);
        }
    }
};

Maki.Aliases.GameMapSetDisplayPos = Game_Map.prototype.setDisplayPos;
Game_Map.prototype.setDisplayPos = function(x, y) {
    Maki.Aliases.GameMapSetDisplayPos.call(this, x, y);
    if (this.isLoopHorizontal()) {
        for(var i = 0; i < this._sparallaxName.length; i++){
            this._sparallaxX[i] = x;
        };
    } else {
        for(var i = 0; i < this._sparallaxName.length; i++){
            this._sparallaxX[i] = this._displayX;
        };
    }
    if (this.isLoopVertical()) {
        for(var i = 0; i < this._sparallaxName.length; i++){
            this._sparallaxY[i] = y;
        };
    } else {
        for(var i = 0; i < this._sparallaxName.length; i++){
            this._sparallaxY[i] = this._displayY;
        };
    }
};

Maki.Aliases.GameMapScrollDown = Game_Map.prototype.scrollDown;
Game_Map.prototype.scrollDown = function(distance) {
    Maki.Aliases.GameMapScrollDown.call(this, distance);
    if (this.isLoopVertical()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            if (this._sparallaxLoopY[i]) this._sparallaxY[i] += distance;
        };
    } else if (this.height() >= this.screenTileY()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            this._sparallaxY[i] += 0;
        };
    }
};

Maki.Aliases.GameMapScrollLeft = Game_Map.prototype.scrollLeft;
Game_Map.prototype.scrollLeft = function(distance) {
    Maki.Aliases.GameMapScrollLeft.call(this, distance);
    if (this.isLoopHorizontal()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            if (this._sparallaxLoopX[i]) this._sparallaxX[i] -= distance;
        };
    } else if (this.width() >= this.screenTileX()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            this._sparallaxX[i] += 0;
        };
    }
};

Maki.Aliases.GameMapScrollRight = Game_Map.prototype.scrollRight;
Game_Map.prototype.scrollRight = function(distance) {
    Maki.Aliases.GameMapScrollRight.call(this, distance);
    if (this.isLoopHorizontal()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            if (this._sparallaxLoopX[i]) this._sparallaxX[i] += distance;
        };
    } else if (this.width() >= this.screenTileX()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            this._sparallaxX[i] += 0;
        };
    }
};

Maki.Aliases.GameMapScrollUp = Game_Map.prototype.scrollUp;
Game_Map.prototype.scrollUp = function(distance) {
    Maki.Aliases.GameMapScrollUp.call(this, distance);
    if (this.isLoopVertical()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            if (this._sparallaxLoopY[i]) this._sparallaxY[i] -= distance;
        };
    } else if (this.height() >= this.screenTileY()) {
        var l = this._sparallaxName.length;
        for (var i = 0; i < l; i++){
            this._sparallaxY[i] += 0;
        };
    }
};

Maki.Aliases.GameMapUpdateParallax = Game_Map.prototype.updateParallax;
Game_Map.prototype.updateParallax = function() {
    Maki.Aliases.GameMapUpdateParallax.call(this);
    var l = this._sparallaxName.length;
    for (var i = 0; i < l; i++){
        if (this._sparallaxLoopX[i]){
            this._sparallaxSx[i] = eval(this._sparallaxSxf[i]);
            this._sparallaxX[i] += this._sparallaxSx[i] / this.tileWidth() / 2;
        }
        if (this._sparallaxLoopY[i]){
            this._sparallaxSy[i] = eval(this._sparallaxSyf[i]);
            this._sparallaxY[i] += this._sparallaxSy[i] / this.tileHeight() / 2;
        }
        this._sparallaxOpacity[i] = eval(this._sparallaxOpacityf[i]);
        if (1 < this._sparallaxFrames[i]){
            this._sparallaxFrameSp[i] = eval(this._sparallaxFrameSpf[i]);
            this._sparallaxFrameDel[i] -= 1;
            if (this._sparallaxFrameDel[i] === 0) {
                this._sparallaxFrameDel[i] = Math.floor(60/this._sparallaxFrameSp[i]);
                this._sparallaxFrame[i] = (this._sparallaxFrame[i]+1) % 
                    this._sparallaxFrames[i];
                this._sparallaxNeedRef[i] = true;
            }
        }
    };
};

Game_Map.prototype.parallaxOx = function(idx) {
    idx = idx || 0;
    if (this._sparallaxZero[idx]) {
        return this._sparallaxX[idx] * this.tileWidth();
    } else if (this._sparallaxLoopX[idx]) {
        return this._sparallaxX[idx] * this.tileWidth() / 2;
    } else {
        return 0;
    }
};

Game_Map.prototype.parallaxOy = function(idx) {
    idx = idx || 0;
    if (this._sparallaxZero[idx]) {
        return this._sparallaxY[idx] * this.tileHeight();
    } else if (this._sparallaxLoopY[idx]) {
        return this._sparallaxY[idx] * this.tileHeight() / 2;
    } else {
        return 0;
    }
};

Maki.Aliases.GameMapChangeParallax = Game_Map.prototype.changeParallax;
Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy,
    idx, opacity, framesp) {
    Maki.Aliases.GameMapChangeParallax.call(this, name, loopX, loopY, sx, sy);
    idx = idx || 0;
    opacity = opacity || 255;
    framesp = framesp || 1;
    this._sparallaxName[idx] = name;
    this._sparallaxZero[idx] = ImageManager.isZeroParallax(this._sparallaxName[idx]);
    if (this._sparallaxLoopX[idx] && !loopX) {
        this._sparallaxX[idx] = 0;
    }
    if (this._sparallaxLoopY[idx] && !loopY) {
        this._sparallaxY[idx] = 0;
    }
    this._sparallaxLoopX[idx] = loopX;
    this._sparallaxLoopY[idx] = loopY;
    this._sparallaxSxf[idx] = String(sx);
    this._sparallaxSyf[idx] = String(sy);
    this._sparallaxSx[idx] = eval(this._sparallaxSxf[idx]);
    this._sparallaxSy[idx] = eval(this._sparallaxSyf[idx]);
    this._sparallaxOpacityf[i] = String(opacity);
    this._sparallaxOpacity[i] = eval(this._sparallaxOpacityf[idx]);
};

Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this._sparallaxName = [];
    this._sparallaxIdx = [];
    this._sparallaxx = [];
    this._parallax = new TilingSprite();
    this.createParallax(1);
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    this.createParallax(2);
    this.createWeather();
    this.createParallax(3);
};

Spriteset_Map.prototype.createParallax = function(depth) {
    depth = depth || 1;
    var l = $gameMap._sparallaxName.length;
    for(var i = 0; i < l; i++){
        if ($gameMap._sparallaxDepth[i] === depth) {
            this._sparallaxName.push('');
            this._sparallaxIdx.push(i);
            this._sparallaxx.push([]);
            var f = this._sparallaxx.length-1;
            for(var j = 0; j < $gameMap._sparallaxFrames[i]; j++){
                this._sparallaxx[f].push(new TilingSprite());
                this._sparallaxx[f][j].move(
                    0, 0, Graphics.width, Graphics.height);
                this._baseSprite.addChild(this._sparallaxx[f][j]);
            };
        }
    };
};

Spriteset_Map.prototype.updateParallax = function() {
    var l = this._sparallaxName.length;
    for(var i = 0; i < l; i++){
    if (this._sparallaxName[i] !== $gameMap.parallaxName(this._sparallaxIdx[i])) {
        this._sparallaxName[i] = $gameMap.parallaxName(this._sparallaxIdx[i]);
        if (1 < $gameMap._sparallaxFrames[i]){
            for(var j = 0; j < $gameMap._sparallaxFrames[i]; j++){
                this._sparallaxx[i][j].bitmap = ImageManager.loadParallax(
                    $gameMap._sparallaxName[this._sparallaxIdx[i]]+'_'+j);
            };
        }
        if ($gameMap._sparallaxFrames[i] === 1)
        this._sparallaxx[i][0].bitmap = ImageManager.loadParallax(
            $gameMap._sparallaxName[this._sparallaxIdx[i]]);
    }
    var f = $gameMap._sparallaxFrame[i];
    if (this._sparallaxx[i][f].bitmap) {
        if (1 < $gameMap._sparallaxFrames[i] &&
            $gameMap._sparallaxNeedRef[this._sparallaxIdx[i]]){
            for(var j = 0; j < $gameMap._sparallaxFrames[i]; j++){
                this._sparallaxx[i][j].visible = (f === j);
            };
            $gameMap._sparallaxNeedRef[this._sparallaxIdx[i]] = false;
        }
        this._sparallaxx[i][f].origin.x = $gameMap.parallaxOx(this._sparallaxIdx[i]);
        this._sparallaxx[i][f].origin.y = $gameMap.parallaxOy(this._sparallaxIdx[i]);
        this._sparallaxx[i][f].opacity =
            $gameMap._sparallaxOpacity[this._sparallaxIdx[i]];
    }
    };
};