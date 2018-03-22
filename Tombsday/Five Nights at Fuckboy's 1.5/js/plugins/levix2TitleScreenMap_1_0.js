/*:

@plugindesc Allow a map to take the place of a game's title screen!
Hopefully it will be easier to make unique title screens with this.
@author {Leviathan} {Leviathan}

@help
** * * * * * * * * * * * * * * * * * * * * *
**            Title Screen Map!            *
** * * * * * * * * * * * * * * * * * * * * *

1. Introduction [001I]
2. Example Project [002E]
3. Directions [003D]
4. Version History [004V]
5. License  [005L]

* ----------------------------
1. Introduction [001I]

This plugin is made for RPG Maker MV and it will take the player to a map
instead of the title screen when said title screen would otherwise be
shown. The goal of this plugin is to make it easier for developers to
create their own unique title screens using the map and event interface
they may be more familiar with than trying to write their own plugin
to create an equivalent title screen.

If you have any suggestions or bug reports please report them to the
script page for this plugin on rpgmaker.net :

http://rpgmaker.net/scripts/616/

* ----------------------------
2. Example Project [002E]

You can download an example project for this script here:
http://rpgmaker.net/media/content/users/947/locker/Title_Screen_Map.zip


* ----------------------------
3. Directions [003D]

Installation of the plugin is simple RMMV fare:

- Place in your RMMV's project's js/plugin folder named
  "levix2-TitleScreenMap.js" without quotes. The file name is important
  to correct functionality of the plugin!

- Next add the plugin to your project's plugins list from the Plugin
  Manager and turn it ON.

- Set the TitleMapID to be the ID of the map you want to be your title
  screen. If you aren't sure what the Map ID is you can right-click
  on your intended map in RMMV's map tree and select 'Edit'. The
  ID of the map will appear at the top of the Map Properties window
  that appears.

From there the developer is responsible for creating their title
screen using events and any other tools they may want to use. To
execute the New Game / Load Game / Settings / Quit operations that
would appear on the title screen the developer must use the
Plugin Command event command (third tab, bottom right).

A plugin command is a string made up of at least two parts:
An identifier for what plugin you're sending a command to and
the command itself separated by a space. The identifier for
this plugin is "TitleScreenMap" minus quotes. The accepted
commands and what they do are as follows:

Start a new game:
newgame
new
start

Open the load game menu:
continue
loadgame
load

Close the game:
quit
exit
terminate

Open the settings menu:
options
settings

Some examples of valid plugin commands are as follows:
TitleScreenMap start
TitleScreenMap loadgame
TitleScreenMap terminate


A demo project that demonstrates how to use this plugin is available
on the rpgmaker.net script page for this plugin.


* ----------------------------
4. Version History [004V]

** 1.0 - 2015/11/04
First release! Yay! :D


* ----------------------------
5. License [005L]

This plugin is distributed under the DWTFYWT Public License.
See full text below
(with a change so it's visible in RMMV's Plugin Help viewer):

        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam (at) hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.

You can read up about the DWTFYWTPL here: http://www.wtfpl.net/


* ----------------------------
YOU DID IT! You read the help!


@param TitleMapID
@desc The Map ID the title screen exists on. Can be eval'd.
@default 1
*/

// reimplement js1.0 functions! yay!
isNan = function(value) { return value !== value; }

// imported is a silly name
var Imported = Imported || {};
Imported.levix2_TitleScreenMap = "1.0";

// Extensions for scripts in general
var Levix2 = Levix2 || {};

// Execute this method when the title screen starts. Overwrite/decorate if you need to change this
Levix2.TitleScreenMap_startTitleScreen = function() {
  // Turn off the menu too so the player can't open it and fuck up the title screen
  $gameSystem.disableMenu();
  // Set the screen tone to black so an event can change it easily
  $gameScreen._tone = [-255, -255, -255, 0];
  // Make sure the party isn't dead which can trigger a game over on the title screen (which is silly!)
  $gameParty.members().forEach(function(actor) { actor.recoverAll(); });
}

// Execute this method when the player starts a new game. Overwrite/decorate if you need to change this
Levix2.TitleScreenMap_newGameCommand = function() {
  // Stop music and let the new game take over
  AudioManager.stopBgm();
  AudioManager.stopBgs();
  AudioManager.stopMe();
  AudioManager.stopSe();
}

// Get the map ID we're going to from the parameters
var parameters = PluginManager.parameters("levix2-TitleScreenMap");
var getTitleScreenMapID = function() {
  var titleScreenMapID = Number(parameters["TitleMapID"]);
  if(isNan(titleScreenMapID))
    titleScreenMapID = eval(parameters["TitleMapID"]);
  return titleScreenMapID;
}

// Execute plugin commands to execute title screen commands
var pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'titlescreenmap') {
      switch (args[0].toLowerCase()) {
        case "newgame":
        case "new":
        case "start":
          Levix2.TitleScreenMap_newGameCommand();
          DataManager.setupNewGame();
          SceneManager.goto(Scene_Map);
          break;
        case "continue":
        case "loadgame":
        case "load":
          SceneManager.push(Scene_Load);
          break;
        case "exit":
        case "quit":
        case "terminate":
          SceneManager.terminate();
          break;
        case "settings":
        case "options":
          SceneManager.push(Scene_Options);
          break;
      }
    }
};

// Decorate the goto method on the SceneManager. If it's a GOTO TITLE then we want to intercept that and replace it with going to the title map
var sceneManager_goto = SceneManager.goto;
SceneManager.goto = function(sceneClass) {
  // If we're going to the title instead go to a map scene that has our title
  if(sceneClass == Scene_Title) {
    // Prepare the title screen for its appearance!
    Levix2.TitleScreenMap_startTitleScreen();
    // Move the player to the title screen map at -1,-1 so the player can't see the party (alt I could make it invisible but :effort: )
    $gamePlayer.reserveTransfer(getTitleScreenMapID(), -1, -1);
    // Now set the next scene the player is going to a map instead of the Scene_Title which we're trying to kill here
    sceneClass = Scene_Map;
  }
  sceneManager_goto.call(this, sceneClass);
};
