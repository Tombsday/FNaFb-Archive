//=============================================================================
// MOG_TitleParticles.js
//=============================================================================

/*:
 * @plugindesc (v1.1) Adiciona partículas na tela de título
 * alem da opção de ativar o circulo mágico.
 * @author Moghunter
 *
 * @param ParticleNumber
 * @desc Quantidade de partículas na tela.
 * (Default - 25)
 * @default 25
 *
 * @param X axis Speed
 * @desc Velocidade da partícula na horizontal.
 * @default 1
 *
 * @param Y axis Speed
 * @desc Velocidade da partícula na vertical.
 * @default -2
 *
 * @param A Speed
 * @desc Velocidade do ângulo das partículas.
 * (Default - 0.02)
 * @default 0.02
 *
 * @param Blend Mode
 * @desc Tipo de Blend. (0 a 2)
 * @default 1
 *
 * @param OX
 * @desc Definição da origem X das partículas. (0.5 - Centralizado / 1.0 - Normal)
 * @default 1.0
 * 
 * @param OY
 * @desc Definição da origem Y das partículas. (0.5 - Centralizado / 1.0 - Normal)
 * @default 1.0
 * 
 * @param Magic Circle Visible
 * @desc Ativar o sprite do circulo mágico.  (true / false)
 * É necessário ter o arquivo Magic_Circle.png
 * @default false
 * 
 * @param Magic Circle OX
 * @desc Definição da posição X-axis do circulo mágico.
 * @default 0
 * 
 * @param Magic Circle OY
 * @desc Definição da posição Y-axis do circulo mágico.
 * @default 0
 * 
 * @param Magic Circle A Speed
 * @desc Definição da velocidade de rotação do circulo mágico.
 * (Default - 0.01)
 * @default 0.01
 * 
 * @param Magic Circle Blend Type
 * @desc Tipo de Blend. (0 a 2)
 * @default 1
 * 
 * @help  
 * =============================================================================
 * +++ MOG - Title Particles (v1.1) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Adiciona partículas animadas na tela de título
 * alem da opção de ativar o circulo mágico.
 * É necessário ter o arquivo Particles.png na pasta.
 *
 * img/titles2/
 *
 * =============================================================================
 * ** Histórico **
 * =============================================================================
 * v1.1 - Melhoria na codificação.
 * 
 * 
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_Title_Particles = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_TitleParticles');
    Moghunter.title_particle_number  = Number(Moghunter.parameters['ParticleNumber'] || 25);
    Moghunter.title_particle_sx = Number(Moghunter.parameters['X axis Speed'] || 1);
    Moghunter.title_particle_sy = Number(Moghunter.parameters['Y axis Speed'] || 1);
    Moghunter.title_particle_a = Number(Moghunter.parameters['A Speed'] || 0.02);
	Moghunter.title_particle_blend_mode  = Number(Moghunter.parameters['Blend Mode'] || 1);
	Moghunter.title_particle_anchor_x = Number(Moghunter.parameters['OX'] || 1.0);
	Moghunter.title_particle_anchor_y = Number(Moghunter.parameters['OY'] || 1.0);
	Moghunter.title_particle_circle = (Moghunter.parameters['Magic Circle Visible'] || true);
	Moghunter.title_particle_circle_x = Number(Moghunter.parameters['Magic Circle OX'] || 0);
	Moghunter.title_particle_circle_y = Number(Moghunter.parameters['Magic Circle OY'] || 0);
	Moghunter.title_particle_circle_a = Number(Moghunter.parameters['Magic Circle A Speed'] || 0.01);
	Moghunter.title_particle_circle_blend = Number(Moghunter.parameters['Magic Circle Blend Type'] || 1);
	
//=============================================================================
// ** Scene Title
//=============================================================================	
		
//==============================
// * Create
//==============================
var _alias_mog_title_particles_createBackground = Scene_Title.prototype.createBackground;
Scene_Title.prototype.createBackground = function() {	
    _alias_mog_title_particles_createBackground.call(this);
	this.create_particles();
	this.create_magic_circle();
  };
  
//==============================
// * Update
//==============================
var _alias_mog_title_particles_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _alias_mog_title_particles_update.call(this);
	this.update_particles();
	this.update_magic_circle();
};  
  
//==============================
// * Create Particles
//==============================
Scene_Title.prototype.create_particles = function() {
	var _sprite_particles_img = ImageManager.loadTitle2("Particles");
	this._sprite_particles = [];
	this._sprite_particles_data = [];	
    for (i = 0; i < Moghunter.title_particle_number; i++){
	  this._sprite_particles.push(new Sprite(_sprite_particles_img));
	  this.addChild(this._sprite_particles[i]);
	  this._sprite_particles_data[i] = []
	  this.reset_particles(i);
	  this._sprite_particles[i].x = Math.floor((Math.random() * Graphics.boxWidth));
	  this._sprite_particles[i].y = Math.floor((Math.random() * Graphics.boxHeight));
	  this._sprite_particles[i].opacity = 0;
	  this._sprite_particles[i].anchor.x = Moghunter.title_particle_anchor_x;
	  this._sprite_particles[i].anchor.y = Moghunter.title_particle_anchor_y;
	  this._sprite_particles[i].blendMode = Moghunter.title_particle_blend_mode;
    };
};
	
//==============================
// * Reset Particles
//==============================	
Scene_Title.prototype.reset_particles = function(i) {
	this._sprite_particles_data[i][0] = Math.floor((Math.random() * 2) * Moghunter.title_particle_sx)
	this._sprite_particles_data[i][1] = Math.floor((Math.random() * 2) * Moghunter.title_particle_sy)
	this._sprite_particles_data[i][2] = ((Math.random() * Moghunter.title_particle_a));
	this._sprite_particles[i].opacity = 0;
	this._sprite_particles[i].x = Math.floor((Math.random() * Graphics.boxWidth));
	var pz = ((Math.random() * 0.5) * 1);
	this._sprite_particles[i].scale = new PIXI.Point(0.5 + Number(pz), 0.5 + Number(pz));
	if (Moghunter.title_particle_sy < 0) { 
	    this._sprite_particles[i].y = Graphics.boxHeight + this._sprite_particles[i].height * 2;
	}
	else if (Moghunter.title_particle_sy > 0)
	{
		this._sprite_particles[i].y = -this._sprite_particles[i].height * 2;
	}
	else {
	    this._sprite_particles[i].y = Math.floor((Math.random() * Graphics.boxHeight));
    }
	if (this._sprite_particles_data[i][0] == 0 && this._sprite_particles_data[i][1] == 0) {
        this._sprite_particles[i].x = -this._sprite_particles[i].width * 5;
		this._sprite_particles_data[i][0] = 9999;
		this._sprite_particles_data[i][1] = 9999;
	};
}

//==============================
// * Reset Particles C
//==============================	
Scene_Title.prototype.reset_particles_c = function(i) {
	//if (this._sprite_particles_data[i] == null) {return false};
	if (this._sprite_particles[i].x < -this._sprite_particles[i].width * 2 || this._sprite_particles[i].x > Graphics.boxWidth + this._sprite_particles[i].width * 2) {return true};
	if (this._sprite_particles[i].y < -this._sprite_particles[i].height * 2 || this._sprite_particles[i].y > Graphics.boxHeight + this._sprite_particles[i].height * 2 ) {return true};
	return false;
}

//==============================
// * Update Particles
//==============================
Scene_Title.prototype.update_particles = function() {	
   for (var i = 0; i < this._sprite_particles.length; i++) {
        this._sprite_particles[i].x += this._sprite_particles_data[i][0];
		this._sprite_particles[i].y += this._sprite_particles_data[i][1];
		this._sprite_particles[i].opacity += 2;
		this._sprite_particles[i].rotation += this._sprite_particles_data[i][2];
    	if (this.reset_particles_c(i)) { this.reset_particles(i);};
	};
};

//==============================
// * Create Magic Circle
//==============================
Scene_Title.prototype.create_magic_circle = function() {
	if (Moghunter.title_particle_circle != "true") {return};
	this._sprite_mgc = new Sprite(ImageManager.loadTitle2("Magic_Circle"));
	this._sprite_mgc.x = Moghunter.title_particle_circle_x;
	this._sprite_mgc.y = Moghunter.title_particle_circle_y;
	this._sprite_mgc.anchor.x = 0.5;
	this._sprite_mgc.anchor.y = 0.5;
	this._sprite_mgc.opacity = 0;
	this._sprite_mgc.blendMode = Moghunter.title_particle_circle_blend;
	this.addChild(this._sprite_mgc);
}

//==============================
// * Update Magic Circle
//==============================
Scene_Title.prototype.update_magic_circle = function() {
	if (Moghunter.title_particle_circle != "true") {return};
	this._sprite_mgc.rotation += Moghunter.title_particle_circle_a;
	this._sprite_mgc.opacity += 3;
}