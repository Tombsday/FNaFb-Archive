//=============================================================================
// MOG_MenuCursor.js
//=============================================================================
/*:
 * @plugindesc (v1.1) Adiciona um cursor animado no menu.
 * @author Moghunter
 *
 * @param Slide Animation
 * @desc Ativar animação de movimento lateral.
 * @default true 
 *
 * @param Cursor X-axis
 * @desc Definição da posição X-axis para ajustes.
 * @default 0
 *
 * @param Cursor Y-axis
 * @desc Definição da posição Y-axis para ajustes.
 * @default 0
 *
 * @param Frames Animation
 * @desc Ativar animação por frames de imagem.
 * @default false
 *
 * @param Max Frames
 * @desc Quantidade de frames de animação.
 * @default 4
 *
 * @help  
 * =============================================================================
 * +++ MOG - Menu Cursor (v1.1) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Adiciona um cursor animado no menu.
 * Será necessário o arquivo Menu_Cursor.png gravado na pasta. (img/system/)
 *
 * =============================================================================
 * HISTÓTICO
 * =============================================================================
 * (v1.1) - Correção do glitch de não ocultar o cursor durante o fade da cena.
 *        - Melhoria da animação inicial do cursor.
 *
 */
 
//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_MenuCursor = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_MenuCursor');
    Moghunter.mcursor_float = String(Moghunter.parameters['Slide Animation'] || true);
	Moghunter.mcursor_x = Number(Moghunter.parameters['Cursor X-axis'] || 0);
	Moghunter.mcursor_y = Number(Moghunter.parameters['Cursor Y-axis'] || 0);
	Moghunter.mcursor_animated = String(Moghunter.parameters['Frame Animation'] || false);
	Moghunter.mcursor_maxframes = Number(Moghunter.parameters['Max Frames'] || 4);
	
//=============================================================================
// ** Game_Temp
//=============================================================================

//==============================
// * Initialize
//==============================
var _alias_mog_mcursor_temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	_alias_mog_mcursor_temp_initialize.call(this);
	this._mcursorData = [false,0,0,0];
};

//=============================================================================
// ** Scene_Base
//=============================================================================

//==============================
// * Initialize
//==============================
var _mog_mcursor_scnBase_initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
	_mog_mcursor_scnBase_initialize.call(this);
	if ($gameTemp) {$gameTemp._mcursorData = [false,0,0,0]};
	this._sprite_mcursor = null;
};

//==============================
// * Update
//==============================
var _mog_mcursor_scnBase_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    _mog_mcursor_scnBase_update.call(this);
	if (!this._sprite_mcursor && $gameTemp && $gameTemp._mcursorData[0]){this.create_menucursor()};
	if (this._sprite_mcursor) {this.update_mcursor();};
};

//==============================
// * Create Menu Cursor
//==============================
Scene_Base.prototype.create_menucursor = function() {
	this.removeChild(this._sprite_mcursor);
    this._sprite_mcursor = new Sprite(ImageManager.loadSystem("Menu_Cursor"));
	this._sprite_mcursor.opacity = 0;
	this._sprite_mcursor.anchor.x = 0.5;
	this._sprite_mcursor.anchor.y = 0.5;
	this._mcursor_data = [-1,-1,0,0,0,false,false,0,0,0,5];
	if (String(Moghunter.mcursor_float) === "true") {this._mcursor_data[5] = true};
	if (String(Moghunter.mcursor_animated) === "true"){this._mcursor_data[6] = true};
	this.addChild(this._sprite_mcursor);
};

//==============================
// * Update Menu Cursor
//==============================
Scene_Base.prototype.update_mcursor = function() {
	if (this.isBusy()) {this._sprite_mcursor.opacity -= 25;return};
    if (this._mcursor_data[0] == -1) {this.set_mcursor_initial();return}
	if ($gameTemp._mcursorData[1] > 0) {$gameTemp._mcursorData[1] -= 1,this._sprite_mcursor.opacity +=15;}
	else {this._sprite_mcursor.opacity = 0};
	if (this._mcursor_data[5]) {this.update_mcursor_float()};
	if (this._mcursor_data[6]) {this.update_mcursor_frames()};
	var nx = $gameTemp._mcursorData[2] + this._mcursor_data[0] + this._mcursor_data[2];
    this._sprite_mcursor.x = this.sprite_move_to(this._sprite_mcursor.x,nx,5);
	this._sprite_mcursor.y = this.sprite_move_to(this._sprite_mcursor.y,$gameTemp._mcursorData[3] + this._mcursor_data[1],5);
};

//==============================
// * Set Mcursor Initial
//==============================
Scene_Base.prototype.set_mcursor_initial = function() {
    if (!this._sprite_mcursor.bitmap.isReady()) {return};	
    this._mcursor_data[0] = Moghunter.mcursor_x;
	this._mcursor_data[1] = (this._sprite_mcursor.bitmap.height / 2) + Moghunter.mcursor_y;
	if (this._mcursor_data[6] ) {		
	    this._mcursor_data[7] = Math.floor(this._sprite_mcursor.bitmap.width / Moghunter.mcursor_maxframes)
		this._mcursor_data[8] = this._sprite_mcursor.bitmap.height;
	};
};
//==============================
// * Udate Mcursor Frames
//==============================
Scene_Base.prototype.update_mcursor_frames = function() {
	this._mcursor_data[10] += 1
	if (this._mcursor_data[10] < 7) {return};
	this._mcursor_data[10] = 0
	this._sprite_mcursor.setFrame(this._mcursor_data[7] * this._mcursor_data[9],0, this._mcursor_data[7],this._mcursor_data[8]);
	this._mcursor_data[9] += 1;
	if (this._mcursor_data[9] >= Moghunter.mcursor_maxframes) {this._mcursor_data[9] = 0};
};

//==============================
// * Update Mcursor Float
//==============================
Scene_Base.prototype.update_mcursor_float = function() {
	 this._mcursor_data[4] += 1;
	 if (this._mcursor_data[4] < 2) {return;};
     this._mcursor_data[4] = 0;
	 this._mcursor_data[3] += 1;
	 if (this._mcursor_data[3] < 15) {this._mcursor_data[2] += 1}
	 else if (this._mcursor_data[3] < 30) {this._mcursor_data[2] -= 1}
	 else {this._mcursor_data[2] = 0 ;this._mcursor_data[3] = 0};	  
};

//==============================
// * Sprite Move To
//==============================
Scene_Base.prototype.sprite_move_to = function(value,real_value,speed) {
	if (value == real_value) {return value};
	var dnspeed = 5 + (Math.abs(value - real_value) / speed);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return Math.floor(value);
};

//=============================================================================
// ** Window Selectable
//=============================================================================

//==============================
// * Update Arrows
//==============================
var _mog_mcursor_wSelect_updateArrows = Window_Selectable.prototype.updateArrows
Window_Selectable.prototype.updateArrows = function() {
    _mog_mcursor_wSelect_updateArrows.call(this);
	if (this.need_set_mcursor_data()) {this.set_mcursor_data();};
};

//==============================
// * Need Set MCursor Data
//==============================x
Window_Selectable.prototype.need_set_mcursor_data = function() {
	if (!this.active) {return false};
	if (!this.visible) {return false};
	if (this.index() < 0) {return false};
	if (this._opening) {return false};
	if (this._closing) {return false};
	if (SceneManager.isSceneChanging()) {return false};
	return true;	
};

//==============================
// * Set Mcursor Data
//==============================
Window_Selectable.prototype.set_mcursor_data = function() {
	var rect = this.itemRect(this.index());
	if(rect.x < 0 || rect.y < 0 || rect.x > (this.width - 48) || rect.y > (this.height - 48)) {return};
	$gameTemp._mcursorData[0] = true;
	$gameTemp._mcursorData[1] = 1;
	$gameTemp._mcursorData[2] = this.x + rect.x;
	$gameTemp._mcursorData[3] = this.y + rect.y + (rect.height / 2);
};