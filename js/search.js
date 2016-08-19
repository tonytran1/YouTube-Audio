$( document ).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('.search-button').click(function(e) {
    e.preventDefault();
     // Prepare the request
     var request = gapi.client.youtube.search.list({
          part: "snippet",
          type: "video",
          q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
          maxResults: 48,
          order: "viewCount"
     });
     request.execute(function(response) {
       $("#content").html("<div class='col-lg-12'><h2 class='result-header page-header'>Results</h2></div>");
       var results = response.result;
       console.log(results.items[0]);
       if (results.items[0] !== undefined) {
         $.each(results.items, function(index, item) {
           $("#content").append("<div class='col-lg-3 col-md-4 col-xs-6 thumb'><p class='video-title center' data-toggle='tooltip' data-placement='top' title='" + item.snippet.title + "'>" + setTitleLength(item.snippet.title) + "</p><a href='#/' onclick='return onSelect(\""+item.id.videoId+"\");' class='thumbnail picture'><img class='img-responsive' src=" + item.snippet.thumbnails.high.url + " alt='' data-toggle='tooltip' data-placement='top' title='" + item.snippet.title + "'></a></div>");
         });
       } else {
         $("#content").append("<h3 class='center'>No Results!</h3>");
       }
     })
  });

  $("#player").on('click', function() {
    if ($("#audio-title").html() === "") {
      $("#audio-title").html("<i class='glyphicon glyphicon-volume-off' style='float:left'></i>Player");
      $("#audio-body").html("<b>Search and select a video to play.</b><br><br><button class='btn-primary btn-block' type='button' data-dismiss='modal'>Close</button>");
      $("#audio-modal").modal('show');
    } else {
      $("#audio-modal").modal('show');
    }
  })

});

function onSelect(videoId) {
  console.log(videoId);
  $.getJSON("https://www.youtubeinmp3.com/fetch/?format=JSON&bitrate=1&video=http://www.youtube.com/watch?v=" + videoId, function(response) {
    $("#audio-title").html("<i class='glyphicon glyphicon-music' style='float:left'></i>" + response.title);
    $("#audio-body").html("<audio controls><source src=" + response.link + " type='audio/mpeg' /><a href="+ response.link +">"+response.title+"</a>An html5-capable browser is required to play this audio. </audio><br><a href="+ response.link +" download>Download</a><br><br><button class='btn-primary btn-block' type='button' data-dismiss='modal'>Close</button>");
  })
  .fail(function() {
    $("#audio-title").html("<i class='glyphicon glyphicon-volume-off' style='float:left'></i>Sorry!");
    $("#audio-body").html("<b>Unfortunately, this video is not supported for stream.<br>Please try the link below to convert your video.</b><br><a href=https://www.youtubeinmp3.com/fetch/?format=JSON&bitrate=1&video=http://www.youtube.com/watch?v=" + videoId +" target='_blank'>Convert</a><br><br><button class='btn-primary btn-block' type='button' data-dismiss='modal'>Close</button>");
  });
  $("#audio-modal").modal('show');
}

function setTitleLength(title) {
  if (title.replace(/^(.{20}[^\s]*).*/, "$1") === title) {
    return title;
  } else {
    return title.replace(/^(.{20}[^\s]*).*/, "$1") + " ...";
  }
}

function init() {
  gapi.client.setApiKey("YouTube API Key");
  gapi.client.load("youtube", "v3", function() {
      // YouTube API ready
  });
}
