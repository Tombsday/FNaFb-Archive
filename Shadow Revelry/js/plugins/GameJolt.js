/*:
@plugindesc Use the GameJolt API in your RPG Maker MV game.
@author Florian van Strien
@param Game ID
@desc The Game ID of your game. Can be found on the dashboard page of your game, under Game API > API Settings.
@param Private Key
@desc The Private Key of your game. Can be found on the dashboard page of your game, under Game API > API Settings.
@param Login on start
@desc Whether you want to ask the player to log in to GameJolt before starting the game if (s)he isn't already logged in.
@default true
@param Use login dialog if available
@desc Whether you want to use a separate dialog window to handle logging in on the Windows and Mac target platforms.
@default true
@param Add button to main menu
@desc Whether you want to add a button to the main menu allowing the player to log in and out of GameJolt.
@default true
@param Show notifications
@desc Whether you want to show a notification when the player gets a trophy.
@default true
@param Trophy notification text
@desc The text that's shown when a player gets a trophy. This is not used if "Show notifications" is off.
@default You got a trophy!
@help *GameJolt API plugin for RPG Maker MV*
By Florian van Strien

This plugin can be used to add the GameJolt API to your RPG Maker MV game.
This means you can reward your players by giving them trophies, let them
battle for highscores, and more. The plugin should be pretty easy to use.

Start by filling in the Parameters in the plugin manager. You're probably
viewing this help text in there, so you should be able to do that by closing
this window. The most important parameters are the Game ID and Private Key.
They can be found on the dashboard page of your game. From the main Dashboard
page, go to the Game API tab. Then click on "API Settings" to the left. The
Game ID and Private Key should be shown there. Copy them to the plugin
parameters.

There are some optional options you can set here as well. If you have no
idea what you should choose, the default options should work fine.
- Login on start
If this is true (the default value), users will be asked to log in as soon
as they start the game if they aren't already logged in. You can set this
to false if you don't like this behaviour.
- Use login dialog if available
If this is true (the default value), a login dialog will be used on the
Windows and Mac target platforms instead of displaying the login screen
within the main window. This is never available on other target platforms
as browsers sometimes don't allow opening a new window, while mobile
devices don't have the same "window" concept as desktops.
- Add button to main menu
If this is true (default), a button will be added to the main menu to let
the user log in and out of GameJolt. Please note that this button may
be automatically hidden if the user is already logged in in some specific
situations for user experience reasons.
- Show notifications
If this is true (default), a simple notification will be shown whenever a
player gets a trophy or highscore. Disable this if you're already showing
a message yourself.
- Trophy notification text
This is the text that's shown as the header of the notification when a
player gets a trophy. The default text is "You got a trophy!".

After you've entered these parameters, sessions will work automatically!
This means you will be able to see how many logged-in people play your game
and for how long on the Dashboard page of your game. Also, a text will be
shown on user's profiles while they're playing your game.

You can now use the following commands:
GameJolt award trophy <id>
Awards the trophy with the given ID.
For example: GameJolt award trophy 43627

Please note: I will try to support this plugin by answering questions on the
GameJolt forums. However, I don't always have time, which means I might not
always be able to answer your question. Please read this help text carefully
and you'll see you are able to solve most problems yourself.
*/

//Function definitions
var GameJolt = {
	login: null,
	autoLogin: null,
	openSession: null,
	pingSession: null,
	syncTrophies: null,
	awardTrophy: null,
	init: null,
	showLoginDialog: null,
	loginRedirect: null
};

function GameJoltBase() //And boom, everything is out of the global namespace.
{
	//Values
	var base_uri = "http://gamejolt.com/api/game/v1/";
	var parameters = PluginManager.parameters("GameJolt");
	var shouldAskLogin = parameters["Login on start"] == "true";
	var gameID = parameters["Game ID"];
	var privateKey = parameters["Private Key"];
	var useLoginDialog = parameters["Use login dialog if available"] == "true";
	var useMainMenuButton = parameters["Add button to main menu"] == "true";
	var canLogOutOnGameJolt = false;//parameters["Can log out on gamejolt.com"] == "true";
	var useNotifications = parameters["Show notifications"] == "true";
	var trophyNotificationText = parameters["Trophy notification text"];
	var never_redirect = false;
	var current_login_window = null;
	var notificationLayer = null, notificationLayerReferenceCount = 0;

	//Vars
	var loggedIn = false, loggingIn = false, username = "", usertoken = "";
	var shouldHaveOpenSession = false;

	//Handle plugin commands
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'gamejolt')
		{
			if (args.length >= 0 && args[0].toLowerCase() == "award")
			{
				if (args.length >= 1 && args[1].toLowerCase() == "trophy")
				{
					if (args.length >= 2)
					{
						GameJolt.awardTrophy(args[2]);
					}
				}
			}
		}
	};

	//Main menu button
	if (useMainMenuButton)
	{
		function getMainMenuButtonText()
		{
			if (loggingIn)
				return "Logging in to GameJolt...";
			else if (loggedIn)
				return "Log out of GameJolt";
			else
				return "Log in to GameJolt";
		}

		function updateMainMenuButtonText()
		{
			if (current_main_menu_window != null)
			{
				if (typeof current_main_menu_window._commandWindow != "undefined")
				{
					var list = current_main_menu_window._commandWindow._list;
					for (var i = 0; i < list.length; i++)
					{
						if (list[i].symbol == "gamejolt")
						{
							list[i].name = getMainMenuButtonText();
							current_main_menu_window._commandWindow.refresh();
						}
					}
				}
			}
		}

		//GameJolt main menu button handler
		var commandGameJolt = function()
		{
			if (! loggedIn)
			{
				if (current_login_window != null)
				{
					current_login_window.focus();
				}
				else
				{
					never_redirect = false;
					GameJolt.startLoginFlow();
				}
			}
			else if (! loggingIn)
			{
				//Log off
				GameJolt.logout();
			}
			current_main_menu_window._commandWindow.activate();
		}

		var current_main_menu_window = null;

		//Add GameJolt button to main menu
		var _Window_TitleCommand_prototype_initialize = Window_TitleCommand.prototype.initialize;
		Window_TitleCommand.prototype.initialize = function()
		{
			_Window_TitleCommand_prototype_initialize.call(this);
			this.setHandler('gamejolt', commandGameJolt); //Add handler
		}

		var _Window_TitleCommand_prototype_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
		Window_TitleCommand.prototype.makeCommandList = function()
		{
			_Window_TitleCommand_prototype_makeCommandList.call(this);
			if (useMainMenuButton)
				this.addCommand(getMainMenuButtonText(), 'gamejolt'); //Add button
		}

		var Scene_Title_prototype_createCommandWindow = Scene_Title.prototype.createCommandWindow;
		Scene_Title.prototype.createCommandWindow = function()
		{
			current_main_menu_window = this; //Get 'this' for later use
			Scene_Title_prototype_createCommandWindow.call(this);
		}
	}

	//Init
	GameJolt.init = function()
	{
		if (! GameJolt.autoLogin()) //Try to login
		{
			if (shouldAskLogin)
			{
				GameJolt.startLoginFlow();
			}
		}
	}

	//Start the login flow. This will show a login window.
	GameJolt.startLoginFlow = function()
	{
		if (Utils.isNwjs() && useLoginDialog)
			GameJolt.showLoginDialog(true); //Show the login window
		else
			GameJolt.loginRedirect(); //Redirect to another web page to log in
	}

	GameJolt.showLoginDialog = function(forceLogin) //forceLogin is whether you want to show some login screen, even if showing a window isn't possible.
	{
		if (Utils.isNwjs())
		{
			var gui = require('nw.gui');
			var win = gui.Window.open("/js/plugins/GameJoltLogin.html?p=" + (window.btoa("is_window=true&gameid=" + gameID + "&private_key=" + privateKey).replace(/=/g, "~")), {position: 'center', width: 480, height: 390, toolbar: false, fullscreen: false, resizable: false, frame: true, focus: true, title: "Log in to GameJolt"});
			current_login_window = win;
			win.on('close',
				function() 
				{
					if (win.window.resultUserName != "")
					{
						GameJolt.login(win.window.resultUserName, win.window.resultUserToken); //We have the login data!
					}
					current_login_window = null;
					this.close(true); //Really close the window now
				});
			//When closing the main window, also close child windows
			gui.Window.get().on('close',
				function()
				{
					if (current_login_window != null)
					{
						win.close();
					}
					this.close(true);
				});
		}
		else if (forceLogin)
			GameJolt.loginRedirect();
	}

	GameJolt.loginRedirect = function()
	{
		if (never_redirect) return;

		try
		{
			window.location.href = "js/plugins/GameJoltLogin.html?p=" + (window.btoa("redirect_to=" + encodeURIComponent(window.location.pathname) + "&gameid=" + gameID + "&private_key=" + privateKey).replace(/=/g, "~"));
		}
		catch (error)
		{
			console.log("We couldn't redirect the user to the login screen. Error: " + error);
		}
	}

	//Login to GameJolt with the given username and token
	GameJolt.login = function(uname, utoken)
	{
		if (useMainMenuButton) updateMainMenuButtonText();
		loggingIn = true;
		doGJRequest("users/auth", "&username=" + uname + "&user_token=" + utoken,
			function(response)
			{
				username = uname;
				usertoken = utoken;
				loggedIn = true;
				loggingIn = false;

				function handleSession()
				{
					if (! loggedIn) return;

					//Function to handle opening a new session.
					function openNewSession()
					{
						GameJolt.openSession(
							function()
							{
								shouldHaveOpenSession = true;
								setTimeout(handleSession, 30000);
							},
							function()
							{
								shouldHaveOpenSession = false;
								setTimeout(handleSession, 60000); //Everything failed. Set a larger timeout to avoid flooding.
							});
					}

					if (shouldHaveOpenSession)
					{
						GameJolt.pingSession(
							function()
							{
								setTimeout(handleSession, 30000);
							},
							function()
							{
								openNewSession();
							});
					}
					else
						openNewSession();
				};

				//Open a session and sync the trophies.
				handleSession();
				GameJolt.syncTrophies();

				//Update the text on the main menu
				if (useMainMenuButton) updateMainMenuButtonText();

				//Save login data
				localStorage.setItem("StoredPlayerUserName", username);
				localStorage.setItem("StoredPlayerToken", usertoken);
			},
			function(error)
			{
				console.log("We couldn't log the player in automatically. Error: " + error);
				loggingIn = false;
				if (useMainMenuButton) updateMainMenuButtonText();
			});
	}

	//Log off
	GameJolt.logout = function()
	{
		loggedIn = false;
		loggingIn = false;
		username = "";
		usertoken = "";
		//Clear local storage data
		localStorage.setItem("StoredPlayerUserName", "");
		localStorage.setItem("StoredPlayerToken", "");
		if (useMainMenuButton) updateMainMenuButtonText();
	}

	//Open a new session
	GameJolt.openSession = function(callback, callback_error)
	{
		doGJRequest("sessions/open", getUserData(),
			function(response)
			{
				callback();
			},
			function(error)
			{
				console.log("We couldn't open a session. Error: " + error);
				callback_error();
			});
	}

	//Ping the current session
	GameJolt.pingSession = function(callback, callback_error)
	{
		doGJRequest("sessions/ping", getUserData(),
			function(response)
			{
				callback();
			},
			function(error)
			{
				console.log("We couldn't ping the session. Error: " + error);
				callback_error();
			});
	}

	//Award a trophy
	GameJolt.awardTrophy = function(id)
	{
		//Add the trophy
		var localTrophies = getLocalTrophies();
		if (localTrophies.indexOf(id) <= -1)
		{
			localTrophies.push(id);
			setLocalTrophies(localTrophies);

			//Sync the trophies to the backend
			GameJolt.syncTrophies();
		}
	}

	//Sync the trophy data
	GameJolt.syncTrophies = function()
	{
		if (! loggedIn) return;

		doGJRequest("trophies", getUserData(),
			function(response)
			{
				var localTrophies = getLocalTrophies();

				var serverTrophies = response["trophies"];

				for (var i = 0; i < serverTrophies.length; i++)
				{
					var trophy = serverTrophies[i];
					var trophyID = trophy["id"];

					//If we've achieved the trophy locally but not on the server.
					if (trophy["achieved"] == "false" && localTrophies.indexOf(trophyID) > -1)
					{
						addTrophy(trophyID);

						//Show a trophy message if allowed
						if (useNotifications)
							showNotification(trophyNotificationText, trophy["title"], trophy["image_url"]);
					}
				}
			},
			function(error)
			{
				console.log("We couldn't sync trophies. Error: " + error);
			});
	}

	//Try to login automatically
	GameJolt.autoLogin = function()
	{
		try
		{
			if (typeof window.location.search == 'string')
			{
				docURLParameters = window.location.search.replace("?", "");
				if (docURLParameters != "")
				{
					docURLParameterList = docURLParameters.split("&");
					//Check for "encoded" params
					//This uses base64, which means it isn't secure at all, but at least these parameters
					//aren't directly visisble in the URI. Using actual encryption makes no sense, as people
					//can just view the source anyway.
					for (var i = 0; i < docURLParameterList.length; i++)
					{
						var parameterValue = docURLParameterList[i].split("=");
						if (parameterValue[0] == "p")
						{
							docURLParameterList = window.atob(parameterValue[1].replace(/~/g, "=")).split("&");
						}
					}

					for (var i = 0; i < docURLParameterList.length; ++i)
					{
						var parameterValue = docURLParameterList[i].split("=");
						if (parameterValue[0] == "gjapi_username")
							username = parameterValue[1];
						else if (parameterValue[0] == "gjapi_token")
							usertoken = parameterValue[1];
						else if (parameterValue[0] == "never_redirect")
							never_redirect = (parameterValue[1] == "true");
					}

					if (username != "" && usertoken != "")
					{
						GameJolt.login(username, usertoken);
						if (never_redirect == false && ! canLogOutOnGameJolt)
							useMainMenuButton = false;
						return true; //Yes, we at least had some sort of info about the player.
					}
				}
			}
		}
		catch (error)
		{
			console.log("Something went wrong: " + error);
		}

		//Check if we have any stored played info
		var storedUName = localStorage.getItem("StoredPlayerUserName");
		if (storedUName != null && storedUName != "")
		{
			var storedUToken = localStorage.getItem("StoredPlayerToken");
			if (storedUToken != null)
			{
				GameJolt.login(storedUName, storedUToken);
				return true;
			}
		}

		return false; //No, we didn't have any info about the player.
	}

	function getUserData() //Gets user data to use in requests.
	{
		return "&username=" + username + "&user_token=" + usertoken;
	}

	//Get the local trophies from the local storage
	function getLocalTrophies()
	{
		//Get the local trophies of the user
		var localTrophies = localStorage.getItem("GJTrophies" + username);
		if (localTrophies == null)
			localTrophies = "";
		//Get the unclaimed local trophies
		var localTrophiesUnclaimed = localStorage.getItem("GJTrophies");
		if (localTrophiesUnclaimed != null)
		{
			//Add the unclaimed trophies to the trophies
			localTrophies += "|" + localTrophiesUnclaimed;
			//Claim them if we're logged in
			if (loggedIn)
			{
				setLocalTrophies(localTrophies);
				localStorage.removeItem("GJTrophies");
			}
		}
		return localTrophies.split("|");
	}

	//Save the local trophies to the local storage
	function setLocalTrophies(trophyList)
	{
		try
		{
			if (loggedIn)
				localStorage.setItem("GJTrophies" + username, trophyList.join("|")); //Save trophies with username
			else
				localStorage.setItem("GJTrophies", trophyList.join("|")); //Save trophies as unclaimed
		}
		catch (error)
		{
			console.log("We couldn't set the trophy data! Error: " + error);
		}
	}

	function addTrophy(id)
	{
		if (! loggedIn) return;

		doGJRequest("trophies/add-achieved", getUserData() + "&trophy_id=" + id,
			function(response)
			{
				//Trophy added!
			},
			function(error)
			{
				console.log("We couldn't add the trophy! Error: " + error);
			});
	}

	//Utility functions:
	function doGJRequest(request_uri, parameter_string, callback, callback_error)
	{
		var full_uri = base_uri + request_uri + "?game_id=" + gameID + parameter_string + "&format=json";
		full_uri += "&signature=" + sha1(full_uri + privateKey);
		httpGet(full_uri,
			//Callback when the request succeeded
			function(response)
			{
				//Try to parse the JSON
				try
				{
					var result = JSON.parse(response);
				}
				catch (err)
				{
					callback_error("Invalid response JSON!");
					return;
				}
				var gj_response = result["response"];

				var success = gj_response["success"];

				if (success == "true")
					callback(gj_response);
				else
				{
					if (gj_response["message"] != null)
						callback_error(gj_response["message"]);
					else
						callback_error("An unknown error occurred!");
				}
			},
			//Callback when it failed
			function()
			{
				callback_error("HTTP error!");
			});
	}

	//Do a HTTP request.
	function httpGet(uri, callback, callback_error)
	{
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function()
	    { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	            callback(xmlHttp.responseText);
	        else if (xmlHttp.readyState == 4 & callback_error != null)
	        	callback_error();
	    }
	    xmlHttp.open("GET", uri, true);
	    xmlHttp.send(null);
	}

	//Notifications for trophies!
	function createNotificationLayer()
	{
		notificationLayerReferenceCount++;
		if (notificationLayer == null)
		{
			notificationLayer = document.createElement("div");
			notificationLayer.id = "GJnotificationLayer";
			notificationLayer.width = Graphics._width;
    		notificationLayer.height = Graphics._height;
			notificationLayer.style.zIndex = 100;
			notificationLayer.style.overflow = "hidden";
			Graphics._centerElement(notificationLayer);
			document.body.appendChild(notificationLayer);
		}
	}

	function destroyNotificationLayer()
	{
		notificationLayerReferenceCount--;
		if (notificationLayer != null && notificationLayerReferenceCount <= 0)
		{
			notificationLayer.parentElement.removeChild(notificationLayer);
		}
	}

	function showNotification(title, message, image_url)
	{
		createNotificationLayer();

		//Create notification base
		var notification = document.createElement("div");
		notification.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
		notification.style.margin = "10px";
		notification.style.width = "";
		notification.style.display = "inline-block";
		notification.style.clear = "both";
		notification.style.float = "left";
		notification.style.transition = "opacity 0.5s linear";
		notification.style.opacity = "0";
		notification.style.boxSizing = "margin-box";
		notificationLayer.appendChild(notification);

		//The image
		var notificationImg = document.createElement("img");
		notificationImg.src = image_url;
		notificationImg.style.padding = "10px 5px 10px 6px";
		notificationImg.alt = "Trophy image";
		notificationImg.style.width = "calc(2.5em + 15px)";
		notificationImg.style.height = "calc(2.5em + 15px)";
		notificationImg.style.display = "block";
		notificationImg.style.verticalAlign = "bottom";
		notificationImg.style.float = "left";
		notification.appendChild(notificationImg);

		//The div for texts
		var notificationTextDiv = document.createElement("div");
		notificationTextDiv.style.display = "inline-block";
		notification.appendChild(notificationTextDiv);

		//The header
		var notificationTitle = document.createElement("p");
		notificationTitle.innerHTML = title;
		notificationTitle.style.padding = "10px 10px 3px 5px";
		notificationTitle.style.margin = "0px";
		notificationTitle.style.fontSize = "1em";
		notificationTitle.style.fontFamily = "Arial, sans-serif";
		notificationTitle.style.color = "white";
		notificationTitle.style.display = "inline-block";
		notificationTitle.style.float = "left";
		notificationTextDiv.appendChild(notificationTitle);

		//The text
		var notificationMessage = document.createElement("p");
		notificationMessage.innerHTML = message;
		notificationMessage.style.padding = "3px 10px 6px 5px";
		notificationMessage.style.margin = "0px";
		notificationMessage.style.fontSize = "1.5em";
		notificationMessage.style.fontFamily = "Arial, sans-serif";
		notificationMessage.style.color = "white";
		notificationMessage.style.display = "inline-block";
		notificationMessage.style.clear = "both";
		notificationMessage.style.float = "left";
		notificationTextDiv.appendChild(notificationMessage);

		//Show after a short while (otherwise the animation wouldn't work)
		window.setTimeout(
			function()
			{
				notification.style.opacity = "1";
				//And hide the trophy after a while
				window.setTimeout(
					function()
					{
						notification.style.opacity = "0";
						window.setTimeout(
							function()
							{
								notificationLayer.removeChild(notification);
								destroyNotificationLayer();
							}, 500);
					}, 8000);
			}, 30);
		
		//destroyNotificationLayer();
	}

	//SHA1 from php.js (https://github.com/kvz/phpjs):

	/*
	Copyright:
	Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io) 
	and Contributors (http://phpjs.org/authors)

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/
	function sha1(r){var e,o,a,t,c,h,n,f,s,u=function(r,e){var o=r<<e|r>>>32-e;return o},C=function(r){var e,o,a="";for(e=7;e>=0;e--)o=r>>>4*e&15,a+=o.toString(16);return a},d=new Array(80),A=1732584193,p=4023233417,i=2562383102,g=271733878,v=3285377520;r=unescape(encodeURIComponent(r));var b=r.length,k=[];for(o=0;b-3>o;o+=4)a=r.charCodeAt(o)<<24|r.charCodeAt(o+1)<<16|r.charCodeAt(o+2)<<8|r.charCodeAt(o+3),k.push(a);switch(b%4){case 0:o=2147483648;break;case 1:o=r.charCodeAt(b-1)<<24|8388608;break;case 2:o=r.charCodeAt(b-2)<<24|r.charCodeAt(b-1)<<16|32768;break;case 3:o=r.charCodeAt(b-3)<<24|r.charCodeAt(b-2)<<16|r.charCodeAt(b-1)<<8|128}for(k.push(o);k.length%16!=14;)k.push(0);for(k.push(b>>>29),k.push(b<<3&4294967295),e=0;e<k.length;e+=16){for(o=0;16>o;o++)d[o]=k[e+o];for(o=16;79>=o;o++)d[o]=u(d[o-3]^d[o-8]^d[o-14]^d[o-16],1);for(t=A,c=p,h=i,n=g,f=v,o=0;19>=o;o++)s=u(t,5)+(c&h|~c&n)+f+d[o]+1518500249&4294967295,f=n,n=h,h=u(c,30),c=t,t=s;for(o=20;39>=o;o++)s=u(t,5)+(c^h^n)+f+d[o]+1859775393&4294967295,f=n,n=h,h=u(c,30),c=t,t=s;for(o=40;59>=o;o++)s=u(t,5)+(c&h|c&n|h&n)+f+d[o]+2400959708&4294967295,f=n,n=h,h=u(c,30),c=t,t=s;for(o=60;79>=o;o++)s=u(t,5)+(c^h^n)+f+d[o]+3395469782&4294967295,f=n,n=h,h=u(c,30),c=t,t=s;A=A+t&4294967295,p=p+c&4294967295,i=i+h&4294967295,g=g+n&4294967295,v=v+f&4294967295}return s=C(A)+C(p)+C(i)+C(g)+C(v),s.toLowerCase()}
}

GameJoltBase(); //Call base function.
GameJolt.init(); //Call init function