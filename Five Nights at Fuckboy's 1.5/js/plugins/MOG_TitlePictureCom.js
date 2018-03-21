//=============================================================================
// MOG_TitlePictureCom.js
//=============================================================================

/*:
 * @plugindesc (v1.2) Adiciona comandos em imagens no lugar da janela.
 * @author Moghunter
 *
 * @param Title Sprite
 * @desc Ativar o nome do título em sprite.
 * É necessário ter o arquivo Title.png na pasta img/titles2/
 * @default true
 * 
 * @param Title Sprite X-Axis
 * @desc Definição X-axis do texto do título.
 * @default 0
 *
 * @param Title Sprite Y-Axis
 * @desc Definição Y-axis do texto do título.
 * @default 0 
 *
 * @param Command Pos 1
 * @desc Definição da posição do comando 1.
 * E.g -     32,32
 * @default 0,0 
 *
 * @param Command Pos 2
 * @desc Definição da posição do comando 2.
 * E.g -     32,32
 * @default 0,32
 *
 * @param Command Pos 3
 * @desc Definição da posição do comando 3.
 * E.g -     32,32
 * @default 0,64
 *
 * @param Command Pos 4
 * @desc Definição da posição do comando 4.
 * E.g -     32,32
 * @default 0,96 
 *
 * @param Command Pos 5
 * @desc Definição da posição do comando 5.
 * E.g -     32,32
 * @default 0,128  
 *
 * @param Command Pos 6
 * @desc Definição da posição do comando 6.
 * E.g -     32,32
 * @default 0,160
 *
 * @param Command Pos 7
 * @desc Definição da posição do comando 7.
 * E.g -     32,32
 * @default 0,192
 *
 * @param Command Pos 8
 * @desc Definição da posição do comando 8.
 * E.g -     32,32
 * @default 0,224
 *
 * @param Command Pos 9
 * @desc Definição da posição do comando 9.
 * E.g -     32,32
 * @default 0,256
 *
 * @param Command Pos 10
 * @desc Definição da posição do comando 10.
 * E.g -     32,32
 * @default 0,288  
 *
 * @help  
 * =============================================================================
 * +++ MOG - Title Picture Commands (v1.2) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Adiciona comandos em imagens no lugar da janela.
 * É necessário ter os arquivos:
 *
 * Command_0.png, Command_1.png, Command_2.png , Command_3.png ... 
 *
 * Grave as imagens na pasta:
 *
 * img/titles2/
 *
 * =============================================================================
 * ** Histórico **
 * =============================================================================
 * v1.2 - Possibilidade de definir a posição de multiplos comandos.
 *      - Correção do lag ao trocar de comandos.
 * v1.1 - Corrigido o glich de poder clicar no comando durante o fade.
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_Picture_Command = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_TitlePictureCom');
	Moghunter.title_sprite = (Moghunter.parameters['Title Sprite'] || false);
	Moghunter.title_x = Number(Moghunter.parameters['Title Sprite X-Axis'] || 0);
	Moghunter.title_y = Number(Moghunter.parameters['Title Sprite Y-Axis'] || 0);
	Moghunter.title_com_pos = [];
	for (var i = 0; i < 10; i++) {
		Moghunter.title_com_pos[i] = (Moghunter.parameters['Command Pos ' + String(i + 1)] || null);
	};	
	
//=============================================================================
// ** Window_TitleCommand
//=============================================================================	

//==============================
// * updatePlacement
//==============================
var _alias_mog_title_picture_commands_updatePlacement = Scene_Title.prototype.updatePlacement;
Window_TitleCommand.prototype.updatePlacement = function() {
   this.x = -Graphics.boxWidth;
   this.y = -Graphics.boxheight;
   this.visible = false;
};

//=============================================================================
// ** Scene Title
//=============================================================================	

//==============================
// * Create
//==============================
var _alias_mog_title_picture_commands_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    _alias_mog_title_picture_commands_create.call(this);
    this.create_picture_commands();
	this._comSave = this._commandWindow.isContinueEnabled();
};

//==============================
// * set tcp
//==============================
Scene_Title.prototype.set_tcp = function(value) {
	if (!value) {return null};
	var s = value.split(',');
	if (!s[0] || !s[1]) {return null};
	return  [Number(s[0]),Number(s[1])];
};

//==============================
// * Update
//==============================
var _alias_mog_title_picture_commands_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _alias_mog_title_picture_commands_update.call(this);
	this.update_picture_commands();
};

//==============================
// * Create Picture Commands
//==============================
Scene_Title.prototype.create_picture_commands = function() {
	this._com_position = [];
	for (var i = 0; i < 10; i++) {
	    this._com_position[i] = this.set_tcp(Moghunter.title_com_pos[i]);
    };	
	var _com_index_old = -2;
	this._csel = false;
	this._com_pictures = [];
	this._com_sprites = [];	
	this._com_pictures_data = [];
	for (i = 0; i < this._commandWindow._list.length; i++){
    	this._com_pictures.push(ImageManager.loadTitle2("Command_" + i));
		this._com_sprites.push(new Sprite(this._com_pictures[i]));		
	    this.addChild(this._com_sprites[i]);	
	};
};

//==============================
// * Refresh Picture Command
//==============================
Scene_Title.prototype.refresh_picture_command = function() {
	this._com_index_old = this._commandWindow._index;
	for (i = 0; i < this._com_sprites.length; i++){
		if (this._commandWindow._index != i) {
        var ch = this._com_pictures[i].height / 2;
		}
		else {
		var ch = 0;
      	}
		this.cpsx = [this._com_position[i][0],this._com_position[i][1]];
		if (this._commandWindow._list[i].symbol === 'continue' && !this._comSave) {this._com_sprites[i].opacity = 160};
		this._com_sprites[i].setFrame(0, ch, this._com_pictures[i].width, this._com_pictures[i].height / 2);
		this._com_sprites[i].x = ((Graphics.boxWidth / 2) - (this._com_pictures[i].width / 2)) + this.cpsx[0];
		this._com_sprites[i].y = ((Graphics.boxHeight / 2) + (this._com_pictures[i].height / 2)) + this.cpsx[1];
		this._com_pictures_data[i] = [this._com_sprites[i].x,this._com_pictures[i].width ,this._com_sprites[i].y,this._com_pictures[i].height / 2 ];
	}; 
};
  
//==============================
// * Update Picture Commands
//==============================
Scene_Title.prototype.update_picture_commands = function() {
	if (this._com_index_old != this._commandWindow._index) { this.refresh_picture_command()};
	if (TouchInput.isTriggered()) {
		for (i = 0; i < this._com_sprites.length; i++){
			if (this.on_picture_com(i) && !this._csel ) {				
				this._commandWindow._index = i;	 this._commandWindow.processOk();
	            if (this._commandWindow.isCommandEnabled(i)) {this._csel = true};
		   };		
		};
	};
};

//==============================
// * On Picture Com
//==============================
Scene_Title.prototype.on_picture_com = function(index) {
	 if (TouchInput.x < this._com_pictures_data[index][0]) { return false};
	 if (TouchInput.x > this._com_pictures_data[index][0] + this._com_pictures_data[index][1]) { return false};
	 if (TouchInput.y < this._com_pictures_data[index][2]) { return false};
	 if (TouchInput.y > this._com_pictures_data[index][2] + this._com_pictures_data[index][3]) { return false};
	 return true;	 
};

if (Moghunter.title_sprite == "true") {
//==============================
// * Create Foreground
//==============================
Scene_Title.prototype.createForeground = function() {
    this._gameTitleSprite = new Sprite(ImageManager.loadTitle2("Title"));
    this.addChild(this._gameTitleSprite);
	this._gameTitleSprite.x = Moghunter.title_x;
	this._gameTitleSprite.y = Moghunter.title_y;
};
};