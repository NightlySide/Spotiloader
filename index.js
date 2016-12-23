var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : '7b65ec927e7a40b68fecc8dfe699021b',
  clientSecret : '373cda6c322b4335929979511fad7f33'
});

// Getting authorisation for api access
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    // Now we can use the program
    $('#searchbtn').prop("disabled", false);
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });

function addzeros(n, nbchiffres) {
    var sn = String(n);
    if (sn.length < nbchiffres) {
        var manque = nbchiffres - sn.length;
        return "0".repeat(manque)+sn;
    }
    return sn;
}

function getPlaylist(user, playlist_id) {
    spotifyApi.getPlaylist(user, playlist_id)
        .then(function(data){
            console.log(data.body);
            data.body.tracks.items.forEach(function(item) {
                var title = item.track.name;
                var artist = item.track.artists[0].name; // Think to add more artists in the view
                var album = item.track.album.name;
                var ms = item.track.duration_ms;
                var min = (ms/1000/60) << 0;
                var sec = parseInt((ms/1000) % 60);
                var duration = min+":"+addzeros(sec, 2);
                var image_url = item.track.album.images[0].url;
                addEntry("#tracklist", title, artist, album, duration, image_url);
            });
        }, function(err){
            console.log('Something went wrong!', err);
        });
}

function addEntry(list, title, artist, album, duration, image_url) {
    $(list).append(' \
    <li href="#" class="list-group-item list-group-item-action"> \
        <img src="'+image_url+'" class="img-rounded trackimg" alt="'+title+' (cover)"> \
        <button type="button" class="btn btn-success downbutton">Download</button> \
        <h5 class="list-group-item-heading">'+artist+' - '+title+'</h5> \
        <p class="list-group-item-text">'+album+' - '+duration+'</p> \
    </li> \
    ');
}

$("#searchbtn").click(function(){
    var playlist_url = $("#pl_url_input").val();
    var user = playlist_url.split(":")[2];
    var playlist_id = playlist_url.split(":")[4];
    $("#tracklist").empty();
    getPlaylist(user, playlist_id);
});
