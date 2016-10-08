function video_init(video_id, cardboard_id) {
  //peer = new Peer( cardboard_id, {host: 'withoutroots.com', port: 9000, secure: true, debug: 0});
  //peer = new Peer(cardboard_id,{key: '8k7a8o900w1att9'});
  peer = new Peer({ key: '180ef0ae-99ea-400c-8be9-996cf34eff23', debug: 3});

  peer.on('open', function(id) {
    console.log("id="+id);
    $('div.webrtc-id').html("<a href='cardboard.html?id="+id+"' target=_blank>click</a>");
  });
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;
  video = document.getElementById( video_id );
  video.autoplay = true;
  var option = {
    video: { mandatory:{ minWidth: 1280 } }
  }

  var localsteam = null;
  peer.on('call', function(call) {
    console.log("on call"); 
    call.answer(localsteam);
  });


  if(cardboard_id=='001') {
    navigator.getUserMedia(option,
      function(stream) {
        localsteam =  stream;
        video.src = window.URL.createObjectURL(stream);
      },
      function(err) {
        console.log('Failed to set local stream or complete call' ,err);
      }
    );
    theta_view();
  }else{
    navigator.getUserMedia(option,
      function(stream) {
        console.log("call="+cardboard_id);
        var call = peer.call('001', stream);
        call.on('stream', function(stream) {
          console.log("on stream");
          video.src = window.URL.createObjectURL(stream);
          cardboard_view();
        });
      },
      function(err) {
        console.log('Failed to set local stream or complete call' ,err);
      }
    );
  }
}
