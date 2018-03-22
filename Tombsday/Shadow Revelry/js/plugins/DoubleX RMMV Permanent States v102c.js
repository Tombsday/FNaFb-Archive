/*============================================================================
 *    ## Plugin Info                                                          
 *----------------------------------------------------------------------------
 *    # Plugin Name                                                           
 *      DoubleX RMMV Permanent States                                         
 *----------------------------------------------------------------------------
 *    # Terms Of Use                                                          
 *      You shall keep this plugin's Plugin Info part's contents intact       
 *      You shalln't claim that this plugin's written by anyone other than    
 *      DoubleX or his aliases                                                
 *      None of the above applies to DoubleX or his aliases                   
 *----------------------------------------------------------------------------
 *    # Prerequisites                                                         
 *      Abilities:                                                            
 *      1. Little Javascript coding proficiency to fully utilize this plugin  
 *----------------------------------------------------------------------------
 *    # Links                                                                 
 *      This plugin:                                                          
 *      1. http://pastebin.com/avCcChi6                                       
 *----------------------------------------------------------------------------
 *    # Author                                                                
 *      DoubleX                                                               
 *----------------------------------------------------------------------------
 *    # Changelog                                                             
 *      v1.02c(GMT 0100 4-12-2015):                                           
 *      1. Fixed undefined all array function which should be empty instead   
 *      2. Increased this plugin's compactness, efficiency and robustness     
 *      v1.02b(GMT 0800 2-12-2015):                                           
 *      1. Fixed reading repetitive notetag values due to typo bug            
 *      2. Fixed permanent state type persist not working due to typo bug     
 *      3. Fixed null permanent state container due to wrong init timing bug  
 *      4. Fixed undefined $gameParty upon actor initializations bug          
 *      v1.02a(GMT 1400 1-12-2015):                                           
 *      1. <permanent state: type> has changed to                             
 *         <permanent state: scene, type>                                     
 *      2. Added new permanent state type recover restored upon recover all   
 *      3. The same state can now have more than 1 permanent state type       
 *      4. Removed param allStatesPermanent in the plugin manager             
 *      5. Fixed undefined permanent state containers upon loading savefiles  
 *      v1.01h(GMT 0600 29-11-2015):                                          
 *      1. Fixed clearing all states upon calling Recover All event command   
 *      2. Fixed notetags not reading at all due to treating "null" as falsey 
 *      v1.01g(GMT 0300 29-11-2015):                                          
 *      1. Fixed undefined error due to non persist nor revive poermanent type
 *      v1.01f(GMT 1200 27-11-2015):                                          
 *      1. Fixed undefined state_id in store_permanent_states due to typo bug 
 *      2. Increased this plugin's efficiency, readability and robustness     
 *      v1.01e(GMT 0900 25-11-2015):                                           
 *      1. Fixed wrong number of arguments when loading state notetags bug    
 *      2. The aliased functions can be accessed by other custom plugins now  
 *      3. Exposed the state plugin calls that can access the notetag values  
 *      v1.01d(GMT 1600 6-11-2015):                                           
 *      1. Simplified the notetag reading mechanisms                          
 *      2. Fixed undefined this under forEach bug                             
 *      v1.01c(GMT 1300 5-11-2015):                                           
 *      1. Fixed undefined this under DoubleX_RMMV.Permanent_States bug       
 *      v1.01b(GMT 0000 5-11-2015):                                           
 *      1. Fixed failing to load notetags due to nil $dataStates bug          
 *      v1.01a(GMT 1300 4-11-2015):                                           
 *      1. The notetag <permanent state> has changed to <permanent state: type>
 *      2. Fixed several logic and syntax errors                              
 *      3. Increased this plugin's maintainability                            
 *      v1.00a(GMT 0800 31-10-2015):                                          
 *      1. 1st version of this plugin finished                                
 *============================================================================*/
/*:
 * @plugindesc Lets you sets some states to be kept/restored in some set cases
 * @author DoubleX
 *
 * @help
 *============================================================================
 *    ## Notetag Info                                                         
 *----------------------------------------------------------------------------
 *    # State Notetags:                                                       
 *      1. <permanent state: scene, type>                                     
 *         - scene can be either battle or map, meaning the state can be      
 *           restored in battle or map respectively                           
 *         - type can be either persist, recover or revive, meaning the state 
 *           will be kept upon death or recover all, or added back upon revive
 *           respectively                                                     
 *         - The same state can have more than 1 permanent state scene/type   
 *============================================================================
 *    ## Plugin Call Info                                                     
 *----------------------------------------------------------------------------
 *    # State manipulations                                                   
 *      1. meta.permanentStates                                               
 *         - Returns the permanent state scenes and types in                  
 *           <permanent state: scene, type> in the form of                    
 *           { battle: types, map: types } with types being an Array storing  
 *           all unique String type or an empty Array if scene matches and    
 *           doesn't match the property name storing types respectively       
 *      2. meta.permanentStates = { battle: types, map: types }               
 *         - Sets the permanent state scene and types in                      
 *           <permanent state: type> as { battle: types, map: types } with    
 *           types being an Array storing all unique String type which will be
 *           used in the scene matching the property name storing types       
 *         - types can only include persist, recover and revive               
 *         - All meta.permanentStates changes can be saved if                 
 *           DoubleX RMMV Dynamic Data is used                                
 *============================================================================
 */

"use strict";
var DoubleX_RMMV = DoubleX_RMMV || {};
DoubleX_RMMV["Permanent States"] = "v1.02c";

/*============================================================================
 *    ## Plugin Implementations                                               
 *       You need not edit this part as it's about how this plugin works      
 *----------------------------------------------------------------------------
 *    # Plugin Support Info:                                                  
 *      1. Prerequisites                                                      
 *         - Some Javascript coding proficiency to fully comprehend this      
 *           plugin                                                           
 *      2. Function documentation                                             
 *         - The 1st part describes why this function's rewritten/extended for
 *           rewritten/extended functions or what the function does for new   
 *           functions                                                        
 *         - The 2nd part describes what the arguments of the function are    
 *         - The 3rd part informs which version rewritten, extended or created
 *           this function                                                    
 *         - The 4th part informs whether the function's rewritten or new     
 *         - The 5th part informs whether the function's a real or potential  
 *           hotspot                                                          
 *         - The 6th part describes how this function works for new functions 
 *           only, and describes the parts added, removed or rewritten for    
 *           rewritten or extended functions only                             
 *         Example:                                                           
 * /*----------------------------------------------------------------------
 *  *    Why rewrite/extended/What this function does                      
 *  *----------------------------------------------------------------------*/ 
/* // arguments: What these arguments are                                     
 * function_name = function(arguments) { // Version X+; Hotspot               
 *     // Added/Removed/Rewritten to do something/How this function works     
 *     function_name_code                                                     
 *     //                                                                     
 * } // function_name                                                         
 *----------------------------------------------------------------------------*/

DoubleX_RMMV.Permanent_States = {

    scene: function() { // v1.02a+
        // Returns map upon actor initializations as well
        return $gameParty && $gameParty.inBattle() ? "battle" : "map";
        //
    },

    // (v1.02a+)Stores all permanent state scenes
    scenes: ["battle", "map"],

    // (v1.02a+)Stores all permanent state types
    types: ["persist", "recover", "revive"]

}; // DoubleX_RMMV.Permanent_States

(function(PS) {

    PS.DataManager = {};

    PS.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        // Rewritten
        if (!PS.DataManager.isDatabaseLoaded.apply(this, arguments)) {
            return false;
        }
        PS.DataManager.loadAllPermanentStateNotes();
        return true;
        //
    }; // DataManager.isDatabaseLoaded

    PS.DataManager.loadAllPermanentStateNotes = function() {
        $dataStates.forEach(function(data) {
            if (data) { PS.DataManager.loadPermanentStateNotes(data); }
        });
    }; // loadAllPermanentStateNotes

    // data: The data to have its notetags read
    PS.DataManager.loadPermanentStateNotes = function(data) {
        var ps, scene, type, lines = data.note.split(/[\r\n]+/);
        var regex = /< *permanent +state *: *(\w+) *, *(\w+) *>/i;
        var scenes = PS.scenes, types = PS.types;
        data.meta.permanentStates = {};
        ps = data.meta.permanentStates;
        scenes.forEach(function(s) { ps[s] = []; });
        // Reads all valid unique combinations until all of them are read
        for (var index = 0, length = lines.length; index < length; index++) {
            if (!lines[index].match(regex)) { continue; }
            scene = RegExp.$1;
            if (scenes.indexOf(scene) < 0) { continue; }
            type = RegExp.$2;
            if (types.indexOf(type) < 0 || ps[scene].indexOf(type) >= 0) {
                continue;
            }
            ps[scene].push(type);
            if (scenes.every(function(s) {
                return ps[s].length >= types.length;
            })) { return; }
        }
        //
    }; // loadPermanentStateNotes

    PS.Game_BattlerBase = {};

    /*------------------------------------------------------------------------
     *    New private instance variables                                      
     *------------------------------------------------------------------------*/
    /* _permanentStates: The id of all permanent states of all scene/type
     * _permanentStateTurns: The turns of all permanent states of all scene/type
     */

    PS.Game_BattlerBase.initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() { // v1.01h+
        PS.Game_BattlerBase.initPermanentStates.call(this); // Added
        PS.Game_BattlerBase.initMembers.apply(this, arguments);
    }; // Game_BattlerBase.prototype.initMembers

    PS.Game_BattlerBase.clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        PS.Game_BattlerBase.storePermanentStates.call(this); // Added
        PS.Game_BattlerBase.clearStates.apply(this, arguments);
    }; // Game_BattlerBase.prototype.clearStates

    PS.Game_BattlerBase.die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() { // v1.01a+
        PS.Game_BattlerBase.die.apply(this, arguments);
        // Added
        PS.Game_BattlerBase.restorePermanentStates.call(this, "persist");
        //
    }; // Game_BattlerBase.prototype.die

    PS.Game_BattlerBase.revive = Game_BattlerBase.prototype.revive;
    Game_BattlerBase.prototype.revive = function() {
        PS.Game_BattlerBase.revive.apply(this, arguments);
        // Added
        PS.Game_BattlerBase.restorePermanentStates.call(this, "revive");
        //
    }; // Game_BattlerBase.prototype.revive

    PS.Game_BattlerBase.recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() { // v1.02a+
        PS.Game_BattlerBase.recoverAll.apply(this, arguments);
        // Added
        PS.Game_BattlerBase.restorePermanentStates.call(this, "recover");
        //
    }; // Game_BattlerBase.prototype.recoverAll

    PS.Game_BattlerBase.initPermanentStates = function() { // v1.01h+
        var types = PS.types;
        this._permanentStates = {};
        this._permanentStateTurns = {};
        PS.scenes.forEach(function(scene) {
            this._permanentStates[scene] = {};
            this._permanentStateTurns[scene] = {};
            types.forEach(function(type) {
                this._permanentStates[scene][type] = [];
                this._permanentStateTurns[scene][type] = {};
            }, this);
        }, this);
    }; // initPermanentStates

    PS.Game_BattlerBase.storePermanentStates = function() {
        var sc;
        if (!this._states || !this._stateTurns) { return; }
        sc = PS.scene();
        this.states().forEach(function(s) {
            s.meta.permanentStates[sc].forEach(function(t) {
                this._permanentStates[sc][t].push(s.id);
                this._permanentStateTurns[sc][t][s.id] = this._stateTurns[s.id];
            }, this);
        }, this);
    }; // storePermanentStates

    // type: The permanent state type
    PS.Game_BattlerBase.restorePermanentStates = function(type) {
        var sc;
        if (!this._states || !this._stateTurns) { return; }
        sc = PS.scene();
        this._states = this._states.concat(this._permanentStates[sc][type]);
        this._permanentStates[sc][type].length = 0;
        Object.keys(this._permanentStateTurns[sc][type]).forEach(function(id) {
            id = +id;
            this._stateTurns[id] = this._permanentStateTurns[sc][type][id];
        }, this);
        this._permanentStateTurns[sc][type] = {};
    }; // restorePermanentStates

})(DoubleX_RMMV.Permanent_States);

/*============================================================================*/