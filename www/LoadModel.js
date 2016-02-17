





// LoadModel.js
//
// This file handles changing Models and Views (3D/2D).  All the models come from my bucket and are authorized by 
// a AuthToken Service running in the cloud.  If you want to extend this, you'll have to clone the AuthTokenServer 
// project and setup your own version with the appropriate ConsumerKey and SecretKey from your app.
//
// Jim Awe
// Autodesk, Inc.

    // some global vars  (TBD: consider consolidating into an object)
var _viewer = null;     // the viewer
var _savedGlobalCamera = null;
var _loadedDocument = null;
var _views2D = null;
var _views3D = null;
var _savedViewerStates = [];



    // setup for STAGING
/*var _viewerEnv = "AutodeskStaging";
var _myAuthToken = new MyAuthToken("STG");

var _lmvModelOptions = [
    { label : "Urban House (Revit)",        urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3N0Zy9VcmJhbiUyMEhvdXNlJTIwLSUyMG5ldy5ydnQ="},
    { label : "rme-basic-sample (Revit)",   urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9ybWVfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0"},
    { label : "ViewTest1 (Revit)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9WaWV3VGVzdDEucnZ0"},
    { label : "Factory (Navisworks)",       urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9Db21wbGV0ZWQlMjBQbGFudCUyMExheW91dCUyMGNvbnN0cnVjdGlvbi5ud2Q="},
    { label : "Lego Guy (Fusion)",          urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9sZWdvX2d1eTIwMTQwMTMxMDkxOTU4LmYzZA=="},
    { label : "Utility Knife (Fusion)",     urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6am1hYnVja2V0My9VdGlsaXR5X0tuaWZlMjAxNDAxMjkxNDAwNDEuZjNk"},
    { label : "2D Floorplan (DWG)",         urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3N0Zy8yRCUyMEZsb29ycGxhbi5kd2c="}
];*/

    // setup for PRODUCTION
var _viewerEnv = "AutodeskProduction";
var _myAuthToken = new MyAuthToken("PROD");

var _lmvModelOptions = [
    {urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bG12ZGJnX3Byb2QvVXJiYW4lMjBIb3VzZSUyMC0lMjAyMDE1LTIucnZ0"}
   
];

// initialize the viewer into the HTML placeholder
function initializeViewer() {
    
    if (_viewer !== null) {
        //_viewer.uninitialize();
        _viewer.finish();
        _viewer = null;
        _savedGlobalCamera = null;
        _savedViewerStates = [];
    }

    var viewerElement = document.getElementById("viewer");  // placeholder in HTML to stick the viewer
    
    _viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   
    var retCode = _viewer.initialize();
    if (retCode !== 0) {
        alert("ERROR: Couldn't initialize viewer!");
        console.log("ERROR Code: " + retCode);      // TBD: do real error handling here
    }
    
}


    // load a specific document into the intialized viewer
function loadDocument(urnStr) {
    
    _loadedDocument = null; // reset to null if reloading

    if (!urnStr || (0 === urnStr.length)) {
        alert("You must specify a URN!");
        return;
    }
    var fullUrnStr = "urn:" + urnStr;
    
    Autodesk.Viewing.Document.load(fullUrnStr, function(document) {
        _loadedDocument = document; // keep this in a global var so we can reference it in other spots

            // get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UX)
        _views3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'3d'}, true);
        _views2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'2d'}, true);
        
        // populate UX with views we just retrieved
        initializeViewer();
        
            // load up first 3D view by default
        if (_views3D.length > 0) {
            loadView(_views3D[0]);   
        }
        else if (_views2D.length > 0) {
            loadView(_views2D[0]);  
        }
        else {
            assert("ERROR: Can't find any Views in the current model!");
        }
        
    }, function(errorCode, errorMsg) {
        alert('Load Error: ' + errorMsg);
    });
}


    // wrap this in a simple function so we can pass it into the Initializer options object
function getAccessToken() {
    return _myAuthToken.value();
}

    // called when HTML page is finished loading, trigger loading of default model into viewer
function loadInitialModel() {
                    // populate the list of available models for the user
    
    var options = {};
    options.env = _viewerEnv;                // AutodeskProduction, AutodeskStaging, or AutodeskDevelopment (set in global var in this project)
    options.getAccessToken = getAccessToken;
    options.refreshToken   = getAccessToken;
    
    Autodesk.Viewing.Initializer(options, function() {
        loadDocument(_lmvModelOptions[0].urn);   // load first entry by default
    });
}
