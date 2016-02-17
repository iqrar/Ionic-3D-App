angular.module('starter.controllers', [])
.controller('DetailCtrl', function($scope,$window) {
  $scope.App = function initialize() {
   var options = {
      'document' : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aGFpZGVyX2lxcmFyNjEvQmFsbG8uaWZj",
      'env':'AutodeskProduction',
      'getAccessToken': getToken,
      'refreshToken': getToken,
   };
   var viewerElement = document.getElementById('viewer');
   var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   Autodesk.Viewing.Initializer(
      options,
      function() {
         viewer.initialize();
         loadDocument(viewer, options.document);
      }
   );
};
function getToken() {
   return "ZYHy7tYPQPcOIXfMsaLYYnlEu4La";
}
function loadDocument(viewer, documentId) {
   // Find the first 3d geometry and load that.
   Autodesk.Viewing.Document.load(
      documentId,
      function(doc) {// onLoadCallback
         var geometryItems = [];
         geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
             'type' : 'geometry',
             'role' : '3d'
         }, true);
         if (geometryItems.length > 0) {
             viewer.load(doc.getViewablePath(geometryItems[0]));
         }
      },
      function(errorMsg) {// onErrorCallback
         alert("Load Error: " + errorMsg);
      }
   );
}
$scope.App();
})
.controller('HomeCtrl', function($scope) {
    $scope.image =  {
        'background-image': 'url(img/img-geo.png) repeat 50% 0 fixed'
    };
});


