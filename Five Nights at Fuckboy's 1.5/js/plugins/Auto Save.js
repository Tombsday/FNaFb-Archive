/*:
* @plugindesc Allows creating, loading, and deleting save files with plugin commands.
* @author Sabi
*
* @help
* Plugin Commands:
*
*AutoSave <index> : Create a save game with index <index>
*LoadSave <index> : Loads a save game with index <index>
*DeleteSave <index> : Deletes a save game with index <index>
*/

(function() {
var Sabi_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args){
Sabi_Game_Interpreter_pluginCommand.call(this, command, args);

if(command === 'AutoSave'){
var f_index = Number(args[0]);
$gameSystem.onBeforeSave();
DataManager.saveGame(f_index);
}

if (command === 'LoadSave'){
var f_index = Number(args[0]);
if(DataManager.loadGame(f_index)){
if ($gameSystem.versionId() !== $dataSystem.versionId){
$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
$gamePlayer.requestMapReload();
}
$gameSystem.onAfterLoad();
SceneManager.goto(Scene_Map);
}
}

if(command === 'DeleteSave'){
var f_index = Number(args[0]);
StorageManager.remove(f_index);
}
};
}) ();