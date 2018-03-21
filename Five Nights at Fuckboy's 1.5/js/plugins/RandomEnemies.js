//=============================================================================
// Random Enemies
// Version: 1.01
//=============================================================================

var Imported = Imported || {};
Imported.RexRandomEnemies = true;

var Rexal = Rexal || {};
Rexal.RE = Rexal.RE|| {};
/*:
 * @plugindesc Lets you set up dummy enemies to be
 * replaced by random ones.
 * @author Rexal
* @help

Notetags: 

Random Enemy: id,id,id,id,id,id,id,id,...

Place this inside the dummy enemy you want to use, and it'll magically switch to a different one.

Creates an array of the enemies whose id is specified. There is absolutely no limit to the amount of variants you can set.
If you use 0, the enemy will cease to exist. If all enemies cease to exist, it'll try again, so there should be no instance of
the battle instantly ending. Just don't set this to only 0. That will cause an infinite loop.

Using multiple of the same id will increase its chance of appearing.

Ex: Random Enemy: 1,2,3,4,1,1,1,1,2,2,3,3,0

 
 */
 
 //-----------------------------------------------------------------------------
//Game_Troop
//=============================================================================

Game_Troop.prototype.setup = function(troopId) {
	
	
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    this.troop().members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
			var el = [];
			el = Rexal.RE.processEnemyNoteTag($dataEnemies[member.enemyId]);
			
            var enemyId = member.enemyId;
			
		
            var x = member.x;
            var y = member.y;
var enemy;
			


			if(el)
			{
			var rand =  Math.randomInt(Math.floor(el.length));
			if(el[rand])enemy = new Game_Enemy(el[rand].id, x, y);
			
			}
			else
			{
			enemy = new Game_Enemy(enemyId, x, y);
			}
			
            if (member.hidden) {
                enemy.hide();
            }
            			if(enemy)this._enemies.push(enemy);
			
        }
    }, this);
    this.makeUniqueNames();
	
	if(this._enemies.length == 0)
	this.Game_Troop.prototype.setup(_troopId);
	
};

 //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================

Rexal.RE.processEnemyNoteTag = function(obj) {
var elist = [];
Rexal.RE._randomPos = false;

if(obj.note == null)return;
if(obj == null)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0]) {
		
		case 'Random Enemy' :
		
		var values = lines[1].split(',');
		for(var v = 0; v<values.length; v++)
		{
		elist.push($dataEnemies[parseInt(values[v])]);
		}
		return elist;
		
		break;

		
		}

			
		}
		

};