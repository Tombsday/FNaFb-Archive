// ------------------------------------------------------
// Animated Parallax.js
// ------------------------------------------------------
/*:
* @plugindesc Creates an animated parallax instead of your normal one.
* @author: Soulpour777
*
* @help
RPG Maker MV Plugin: Animated Parallax
versão original por Moghunter / original version by Moghunter
Versão MV por Soulpour777 / MV version by Soulpour777

Creditos:
créditos para Moghunter para a versão original

* @param AnimationSwitch
* @desc Switch to activate the parallax being animated.
* @default 1
*
* @param AnimationMaxFrames
* @desc Maximum frame animations your parallax will animate.
* @default 4
*
* @param AnimationSpeed
* @desc Speed of your animations per frame when animated.
* @default 14
*
*/
(function(){
	var Imported = Imported || {};
	Imported.AnimatedParallax = true;
	var Soulpour777 = Soulpour777 || {};
	Soulpour777.AnimatedParallax = {};
	Soulpour777.AnimatedParallax.params = PluginManager.parameters('Animated Parallax'); 

	var nibelung_animated_parallax_system_initialize = Game_System.prototype.initialize;
	var nibelung_animated_parallax_spriteset_map_initialize = Spriteset_Map.prototype.initialize;
	var nibelung_animated_parallax_spriteset_map_updateParallax = Spriteset_Map.prototype.updateParallax;
	var animationSpeed = Number(Soulpour777.AnimatedParallax.params['AnimationSpeed'] || 14);
	var maxAnimationFrames = Number(Soulpour777.AnimatedParallax.params['AnimationMaxFrames'] || 4);
	var animationSwitch = Number(Soulpour777.AnimatedParallax.params['AnimationSwitch'] || 1);
	Game_System.prototype.parallaxAnimationSpeed;
	Game_System.prototype.initialize = function() {
		nibelung_animated_parallax_system_initialize.call(this);
		this.parallaxAnimationSpeed = animationSpeed;
	}
	Game_Map.prototype.parallax_name;
	var nibelung_animated_parallax_map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function() {
		nibelung_animated_parallax_map_initialize.call(this);
		this.parallax_name = undefined;
	}
	Spriteset_Map.prototype.initialize = function() {
	    nibelung_animated_parallax_spriteset_map_initialize.call(this);
	    this._parallaxSpeed = 0;
	    this._parallaxFrames = 0;
	    this._parallaxAnimated = false;
	};	
	Spriteset_Map.prototype.updateParallax = function() {
	    nibelung_animated_parallax_spriteset_map_updateParallax.call(this);
	    if ($gameSwitches.value(animationSwitch) === true)this.startParallaxAnimation();
	    if ($gameSwitches.value(animationSwitch) === true)this.updateParallaxAnimation();
	};

	Spriteset_Map.prototype.startParallaxAnimation = function() {
		if (this._parallaxName != $gameMap.parallaxName()) {
			this._parallaxSpeed = 0;
			this._parallaxFrames = 0;
			this._parallaxAnimated = false;
			var image = ImageManager.loadParallax($gameMap.parallaxName() + "1");
			if (image != null) {
				this._parallaxAnimated = true;
				image = null;
			}
		}
	}

	Spriteset_Map.prototype.updateParallaxAnimation = function() {
		if (this._parallaxAnimated) {
			return;
		}
		if (this._parallax.bitmap === null) {
			return;
		}
		this._parallaxSpeed += 1;
		if (this._parallaxSpeed > $gameSystem.parallaxAnimationSpeed) {
			this._parallaxSpeed = 0;
			this._parallaxFrames += 1;
			if (this._parallaxFrames >= maxAnimationFrames) {
				this._parallaxFrames = 0;
			} else {
				this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName + this._parallaxFrames.toString());
			}
			if(this._parallax.bitmap === null) {
				this._parallaxFrames = 0;
				this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
			}
			$gameMap.parallax_name = this.parallaxName;
		}
	}



})();