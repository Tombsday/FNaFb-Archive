// WebAudio Cache (experimental!)
// by orlando (rpgmakerweb.com forums)
// Date: 01/03/2016  

//=============================================================================


/*:
 * @plugindesc A cache for WebAudio which keeps preloaded objects in memory while they are still recent or in use. Combined with TDDP Preload Manager, this should hopefully reduce BGM play lag to a minimum.
 * @author orlando (rpgmakerweb.com forums)
 * @License DON'T REMOVE THE AUTHOR CREDITS LINE EVER. Apart from that, feel free to use this, including for commercial projects. No further credit beyond the mention that is already in this source code file is required. No warranty/guarantees for proper operation, use at your own risk.
 */


(function() {

var debug = true;
function WebAudioCache() {
    throw "this is a static class";
}

WebAudioCache._cache = {};

// This should be called on map change to purge old stuff:
WebAudioCache.purgeOld = function() {
    if (debug) {
        console.log("[WebAudioCache] PURGE consideration on old data...");
    }
    var throwAwayKeys = new Array();
    for (var key in this._cache) {
        var cacheInfo = this._cache[key];
        if (cacheInfo.lastAccess + (1000000 * 60 * 5) <
                performance.now()) {
            // older than five minutes, throw away.
            throwAwayKeys.push_back(key);
        }
    }
    while (throwAwayKeys.length > 0) {
        if (debug) {
            console.log("[WebAudioCache] DELETE old audio from cache: " +
                this._cache[throwAwayKeys[0]].url);
        }
        this._cache[throwAwayKeys[0]] = undefined;
        throwAwayKeys.splice(0, 1);
    }
}

// When loading a new map, consider throwing stuff away:
DataManager._oldPreWebAudioCache_loadMapData = DataManager.loadMapData;
DataManager.loadMapData = function(mapId) {
    if (typeof(WebAudioCache._lastSeenMap) == "undefined") {
        WebAudioCache._lastSeenMap = -1;
    }
    if (mapId != WebAudioCache._lastSeenMap) {
        WebAudioCache.purgeOld();
        WebAudioCache._lastSeenMap = mapId;
    }
    return DataManager._oldPreWebAudioCache_loadMapData(mapId);
}

// This adds new entries to the cache:
WebAudioCache.add = function(url, webAudioObj) {
    var cacheInfo = new Object();
    cacheInfo.url = url;
    cacheInfo._buffer = webAudioObj._buffer;
    cacheInfo._totalTime = webAudioObj._totalTime;
    cacheInfo._sampleRate = webAudioObj._sampleRate;
    cacheInfo._loopStart = webAudioObj._loopStart;
    cacheInfo._loopLength = webAudioObj._loopLength;
    cacheInfo.lastAccess = performance.now();
    console.log("[WebAudioCache] ADD to cache: " +
        url);
    this._cache[url] = cacheInfo;
}

// Wrap WebAudio.prototype._load to make sure it loads from the cache:
WebAudio.prototype._oldPreWebAudioCache_load = WebAudio.prototype._load;
WebAudio.prototype._load = function(url) {
    if (url in WebAudioCache._cache) {
        if (debug) {
            console.log("[WebAudioCache] RETRIEVE from cache: " +
                url);
        }
        // Reconstruct the info of this audio object from the cache:
        var cacheInfo = WebAudioCache._cache[url];
        this._buffer = cacheInfo._buffer;
        this._totalTime = cacheInfo._totalTime;
        this._sampleRate = cacheInfo._sampleRate;
        this._loopStart = cacheInfo._loopStart;
        this._loopLength = cacheInfo._loopLength;
        this._url = url;
        this._webAudioCached = true;

        // Remember when this audio snippet was used last:
        WebAudioCache._cache[url].lastAccess = performance.now();

        // Call this but in a way that will trigger after the processing of
        // this logic frame is completed:
        var self = this;
        setTimeout(function() {self._onLoad.apply(self);}, 1);
        // (this is required so load listeners registered right after sound
        // creation will still be triggered)
    } else {
        if (debug) {
            console.log("[WebAudioCache] CACHE MISS on new audio: " + url);
        }
        return this._oldPreWebAudioCache_load(url);
    }
};

// Wrap WebAudio.prototype._onLoad to make sure it adds to the cache:
WebAudio.prototype._oldPreWebAudioCache_onLoad = WebAudio.prototype._onLoad;
WebAudio.prototype._onLoad = function(xhr) {
    if (typeof(this._webAudioCached) == "undefined") {
        WebAudioCache.add(this._url, this);
    }
    return this._oldPreWebAudioCache_onLoad(xhr);
};

})();