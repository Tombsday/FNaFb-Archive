/*:
* @plugindesc v1.0 A visual battle hud with slanted bars. Destiny Engine - Battle Hud Feena.
* @author Soulpour777 - soulxregalia.wordpress.com
* 
* @help

Battle HUD Feena
Author: Soulpour777

Note: This is a part of the old Destiny Engine, thus being still named Destiny Engine.

Battle HUD Feena Features:

 - Visual Battle HUD
 - Faces are shown for each character
 - Slanted Huds
 - 3 State Icons shown


* @param -- MAIN --
*
* @param Battle HUD Space
* @desc The space between the each character's hud is placed.
* @default 210
*
* @param Battle Start Message
* @desc Display a battle start message? (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default false
*
* @param Face Y Padding
* @desc The padding for the faces to appear. Vertical Padding.
* @default 454
*
* @param HUD X Padding
* @desc The padding for the faces to appear. Horizontal Padding.
* @default 45
*
* @param HUD Y Padding
* @desc The padding for the faces to appear. Vertical Padding.
* @default 454
*
* @param HP Gauge X
* @desc X axis of the hp gauge.
* @default -70
*
* @param HP Gauge Y
* @desc Y axis of the hp gauge.
* @default 25
*
* @param HP Gauge Length
* @desc The length of the gauge of the hp gauge.
* @default 90
*
* @param HP Number X
* @desc X axis of the hp number.
* @default 20
*
* @param HP Number Y
* @desc Y axis of the hp number.
* @default 25
*
* @param HP Number Length
* @desc The length of the gauge of the hp number.
* @default 150
*
* @param MP Gauge X
* @desc X axis of the hp gauge.
* @default -70
*
* @param MP Gauge Y
* @desc Y axis of the mp gauge.
* @default 40
*
* @param MP Gauge Length
* @desc The length of the gauge of the mp gauge.
* @default 90
*
* @param MP Number X
* @desc X axis of the mp number.
* @default 20
*
* @param MP Number Y
* @desc Y axis of the mp number.
* @default 50
*
* @param MP Number Length
* @desc The length of the gauge of the mp number.
* @default 150
*
* @param TP Number X
* @desc X axis of the tp number.
* @default 40
*
* @param TP Number Y
* @desc Y axis of the tp number.
* @default 83
*
* @param TP Number Length
* @desc The length of the gauge of the tp number.
* @default 150
*
* @param State Icon X
* @desc X axis of the state icons.
* @default 80
*
* @param State Icon Y
* @desc Y axis of the state icons.
* @default 19
*
* @param -- EXTRA --
*
* @param Party Command Columns 
* @desc Max columns for the party command. (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default 2
*
* @param Party Command Width
* @desc Width of the party command window. (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default 816
*
* @param Party Command Height
* @desc Height of the party command window. (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default 75
*
* @param Party Command X
* @desc X axis of the party command window. (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default 0
*
* @param Party Command Y
* @desc Y axis of the party command window. (Disregard if you use any Battle Command plugin by Soulpour or other scripters).
* @default 0
*
*/
(function(){
	var SOUL_MV = SOUL_MV = {};
	SOUL_MV.DestinyEngine = SOUL_MV.DestinyEngine || {};
	SOUL_MV.DestinyEngine.BattleHUD = SOUL_MV.DestinyEngine.BattleHUD || {};
	SOUL_MV.DestinyEngine.BattleHUD.Feena = SOUL_MV.DestinyEngine.BattleHUD.Feena || {};
	SOUL_MV.Utils = SOUL_MV.Utils || {};

	SOUL_MV.DestinyEngine.BattleHUD.Feena.facePadding = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Face Y Padding'] || 454);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hudXPadding = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HUD X Padding'] || 45);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hudYPadding = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HUD Y Padding'] || 454);

	SOUL_MV.DestinyEngine.BattleHUD.Feena.battleHudSpacing = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Battle HUD Space'] || 210);
	
	SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandCols = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Party Command Columns'] || 2);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandWidth = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Party Command Width'] || 816);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandHeight = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Party Command Height'] || 75);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Party Command X'] || 0);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['Party Command Y'] || 0);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.showBattleMessage = PluginManager.parameters('SOUL_MV Battle HUD Feena')['Battle Start Message'] === "true" ? true : false;

	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Gauge X'] || -70);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Gauge Y'] || 25);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeLength = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Gauge Length'] || 90);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Gauge X'] || -70);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Gauge Y'] || 40);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeLength = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Gauge Length'] || 90);

	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Number X'] || 20);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Number Y'] || 25);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberLength = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['HP Number Length'] || 150);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Number X'] || 20);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Number Y'] || 50);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberLength = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Number Length'] || 150);

	SOUL_MV.DestinyEngine.BattleHUD.Feena.tpNumberX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['TP Number X'] || 40);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.tpNumberY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['TP Number Y'] || 83);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.tpGaugeLength = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['MP Number Length'] || 150);

	SOUL_MV.DestinyEngine.BattleHUD.Feena.stateX = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['State Icon X'] || 80);
	SOUL_MV.DestinyEngine.BattleHUD.Feena.stateY = Number(PluginManager.parameters('SOUL_MV Battle HUD Feena')['State Icon Y'] || 19);

	BattleManager.displayStartMessages = function() {
		if (SOUL_MV.DestinyEngine.BattleHUD.Feena.showBattleMessage) {
		    $gameTroop.enemyNames().forEach(function(name) {
		    	$gameMessage._positionType = 0;
		        $gameMessage.add(TextManager.emerge.format(name));
		    });
		    if (this._preemptive) {
		    	$gameMessage._positionType = 0;
		        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
		    } else if (this._surprise) {
		    	$gameMessage._positionType = 0;
		        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
		    }	
		}

	};

    Window_PartyCommand.prototype.maxCols = function() {
    	return SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandCols;
    }

    Window_PartyCommand.prototype.windowWidth = function() {
    	return SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandWidth;
    }

    Window_PartyCommand.prototype.windowHeight = function() {
    	return SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandHeight;
    }

	Scene_Battle.prototype.selectEnemySelection = function() {
	    this._enemyWindow.refresh();
	    this._enemyWindow.select(0);
	    this._enemyWindow.activate();
	};

	Scene_Battle.prototype.selectActorSelection = function() {
	    this._actorWindow.refresh();
	    this._actorWindow.activate();
	};	

	Scene_Battle.prototype.startActorCommandSelection = function() {
	    this._statusWindow.select(BattleManager.actor().index());
	    this._partyCommandWindow.close();
	    this._actorCommandWindow.setup(BattleManager.actor());
	    this._actorCommandWindow.x = Graphics.boxWidth - this._actorCommandWindow.width;
	    this._actorCommandWindow.y = this._actorCommandWindow.height;
	};	

	Scene_Battle.prototype.createPartyCommandWindow = function() {
	    this._partyCommandWindow = new Window_PartyCommand();
	    this._partyCommandWindow.x = SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandX;
	    this._partyCommandWindow.y = SOUL_MV.DestinyEngine.BattleHUD.Feena.partyCommandY;
	    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
	    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
	    this._partyCommandWindow.deselect();
	    this.addWindow(this._partyCommandWindow);
	};      

    function Window_SlantedHud() {
        this.initialize.apply(this, arguments);
    }

    Window_SlantedHud.prototype = Object.create(Window_Base.prototype);
    Window_SlantedHud.prototype.constructor = Window_SlantedHud;

    Window_SlantedHud.prototype.initialize = function(width,height) {
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.opacity = 0.0; // hide the background.
        this._actor = null;
    };

    Window_SlantedHud.prototype.setActor = function(actor) {
      this._actor = actor;
    };

    Window_SlantedHud.prototype.update = function() {
        this.contents.clear();

        this.drawGauge(SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeX, SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeY, SOUL_MV.DestinyEngine.BattleHUD.Feena.hpGaugeLength, this._actor.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
        this.drawGauge(SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeX, SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeY, SOUL_MV.DestinyEngine.BattleHUD.Feena.mpGaugeLength, this._actor.mpRate(), this.mpGaugeColor1(), this.mpGaugeColor2());

        this.drawText(this._actor.hp,SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberX,SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberY,SOUL_MV.DestinyEngine.BattleHUD.Feena.hpNumberLength,'left');
        this.drawText(this._actor.mp,SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberX,SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberY,SOUL_MV.DestinyEngine.BattleHUD.Feena.mpNumberLength,'left');
        // this.drawText(this._actor.tp,60,55,150,'left');	
        this.drawText(this._actor.tp,SOUL_MV.DestinyEngine.BattleHUD.Feena.tpNumberX,SOUL_MV.DestinyEngine.BattleHUD.Feena.tpNumberY,SOUL_MV.DestinyEngine.BattleHUD.Feena.tpNumberLength,'left');	
        this.drawActorIcons(this._actor, SOUL_MV.DestinyEngine.BattleHUD.Feena.stateX, SOUL_MV.DestinyEngine.BattleHUD.Feena.stateY);
    };

	Window_SlantedHud.prototype.drawActorIcons = function(actor, x, y, width) {
	    width = width || 144;
	    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
	    for (var i = 0; i < icons.length; i++) {
	        this.drawIcon(icons[i], x, y + Window_Base._iconWidth * i);
	    }
	};

	ImageManager.loadSoulpourBattleHudFeena = function(filename, hue) {
	    return this.loadBitmap('img/Soul_BattleHUD/Feena/', filename, hue, true);
	};  

	function Feena_Face() {
	    this.initialize.apply(this, arguments);
	}

	Feena_Face.prototype = Object.create(Sprite_Base.prototype);
	Feena_Face.prototype.constructor = Feena_Face;

	Feena_Face.prototype.initialize = function(actor) {
		this._actor = $gameParty.members()[actor];
	    Sprite_Base.prototype.initialize.call(this);

	};

	Feena_Face.prototype.update = function() {
	    Sprite_Base.prototype.update.call(this);
	    this.bitmap = ImageManager.loadSoulpourBattleHudFeena(String(this._actor._name));
	};	

	Window_Base.prototype.drawActorHudFace = function(faceName, x, y) {
	    this._sprite = new Sprite();
	    this._sprite.bitmap = ImageManager.loadSoulpourBattleHudFeena(faceName);
	    this._sprite.x = x;
	    this._sprite.y = y;
	    this.addChild(this._sprite);
	};

   
    Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
        this.contents.context.save();
        this.contents.context.rotate(-45);
        var fillW = Math.floor(width * rate);
        var gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 15, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 15, color1, color2);
        this.contents.context.restore();
    };

    //================================================================================
    // UTILS
    //================================================================================

    if (!SOUL_MV.Utils.sformat) {
        SOUL_MV.Utils.sformat = function () {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = arguments[0];

            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }

            return theString;
        };
    }    

	Scene_Battle.prototype.createAllWindows = function() {
	    this.createLogWindow();
	    this.createStatusWindow();
	    this.createPartyCommandWindow();
	    this.createActorCommandWindow();
	    this.createHelpWindow();
	    this.createSkillWindow();
	    this.createItemWindow();
	    this.createActorWindow();
	    this.createEnemyWindow();
	    this.createMessageWindow();
	    this.createScrollTextWindow();
	    this.createSlantedHud();
	};

	Scene_Battle.prototype.createStatusWindow = function() {
	    this._statusWindow = new Window_BattleStatus();
	    this._statusWindow.visible = false;
	    this.addWindow(this._statusWindow);
	};
    Scene_Battle.prototype.createSlantedHud = function() {
        this._slantedActorWindows = [];
        this._slantedActorFaces = [];
        // To keep this simple and short, create a window for each actor

        for (var i = 0; i < $gameParty.members().length; i++) {

            var window = new Feena_Face(i);
            window.x = i * SOUL_MV.DestinyEngine.BattleHUD.Feena.battleHudSpacing;
            window.y = SOUL_MV.DestinyEngine.BattleHUD.Feena.facePadding;
            this._slantedActorFaces.push(window);
            this.addChild(window);
        }   
        for (var i = 0; i < $gameParty.members().length; i++) {

            var window = new Window_SlantedHud(Graphics.width * 0.5, 150);
            var xloc = i * SOUL_MV.DestinyEngine.BattleHUD.Feena.battleHudSpacing;
            window.x = xloc + SOUL_MV.DestinyEngine.BattleHUD.Feena.hudXPadding;
            window.y = SOUL_MV.DestinyEngine.BattleHUD.Feena.hudYPadding;
            window.setActor($gameParty.members()[i]);
            this._slantedActorWindows.push(window);
            this.addChild(window);
        }             
    };   
})();