var cardboard_view = function () {
  var scene = new THREE.Scene();
  var width  = 900;
  var height = 600;
  var fov    = 60;
  var aspect = width / height;
  var near   = 1;
  var far    = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 0.1 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  var element = renderer.domElement;
  document.body.appendChild( element );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0, 0.7, 0.7 );
  scene.add( directionalLight );

  var video = document.getElementById( 'theta-video' );
  var texture = new THREE.VideoTexture( video );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  var geometry = new THREE.SphereGeometry(100, 32, 32, 0);
  geometry.scale(-1, 1, 1);

  var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
  for ( i = 0; i < faceVertexUvs.length; i++ ) {
    var uvs = faceVertexUvs[ i ];
    var face = geometry.faces[ i ];
    for ( var j = 0; j < 3; j ++ ) {
      var x = face.vertexNormals[ j ].x;
      var y = face.vertexNormals[ j ].y;
      var z = face.vertexNormals[ j ].z;

      if (i < faceVertexUvs.length / 2) {
        var correction = (x == 0 && z == 0) ? 1 : (Math.acos(y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
        // uvs[ j ].x = x * (423 / 1920) * correction + (480 / 1920);
        // uvs[ j ].y = z * (423 / 1080) * correction + (600 / 1080);
        uvs[ j ].x = x * (428 / 1920) * correction + (480 / 1920);
        uvs[ j ].y = z * (428 / 1080) * correction + (600 / 1080);

      } else {
        var correction = ( x == 0 && z == 0) ? 1 : (Math.acos(-y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
        // uvs[ j ].x = -1 * x * (423 / 1920) * correction + (1440 / 1920);
        // uvs[ j ].y = z * (423 / 1080) * correction + (600 / 1080);
        uvs[ j ].x = -1 * x * (428 / 1920) * correction + (1440 / 1920);
        uvs[ j ].y = z * (428 / 1080) * correction + (600 / 1080);
      }
    }
  }

  geometry.rotateZ(-Math.PI / 2);
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  var controls = new THREE.OrbitControls(camera, element);
  // controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  controls.enableZoom = false;
  controls.enablePan = false;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);

  ( function renderLoop () {
    requestAnimationFrame( renderLoop );
    renderer.render( scene, camera );
  } )();

};