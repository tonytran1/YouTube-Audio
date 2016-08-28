$( document ).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $(document).keypress(function(e) {
    if (e.which == 13) {
      obtainView();
    }
  });

  $('.search-button').click(function(e) {
    e.preventDefault();
    obtainView();
  });

  $(".player").on('click', function() {
    if ($("#audio-title").html() === "") {
      $("#audio-title").html("<i class='glyphicon glyphicon-volume-off' style='float:left'></i>Player");
      $("#audio-body").html("<b>Search and select a video to play.</b><br><br>");
      $("#audio-modal").modal('show');
    } else {
      $("#audio-modal").modal('show');
    }
  });

});

function onSelect(videoId) {
  $.getJSON("https://www.youtubeinmp3.com/fetch/?format=JSON&bitrate=1&video=http://www.youtube.com/watch?v=" + videoId, function(response) {
    $("#audio-title").html("<i class='glyphicon glyphicon-music' style='float:left'></i>" + response.title);
    $("#audio-body").html("<img src='assets/loading.gif'  width='50' height='50'>");
    var audio = new Audio();
    audio.setAttribute('src', response.link);
    audio.setAttribute('class', 'center');
    audio.controls = true;
    audio.preload = 'metadata';
    audio.oncanplay = function() {
      $("#audio-body").html(audio);
      $("#audio-body").append("<br><a href="+ response.link +" download>Download</a><br>");
    };
    audio.onerror = function() {
      onSelect(videoId);
    }
  })
  .fail(function() {
    $("#audio-title").html("<i class='glyphicon glyphicon-volume-off' style='float:left'></i>Sorry!");
    $("#audio-body").html("<b>Unfortunately, this video is not supported for stream.<br>Please try the link below to convert your video.</b><br><a href=https://www.youtubeinmp3.com/fetch/?format=JSON&bitrate=1&video=http://www.youtube.com/watch?v=" + videoId +" target='_blank'>Convert</a><br><br>");
  })
  .always(function () {
    $("#audio-modal").modal('show');
  });
}

function setTitleLength(title) {
  if (title.replace(/^(.{20}[^\s]*).*/, "$1") === title) {
    return title;
  } else {
    return title.replace(/^(.{20}[^\s]*).*/, "$1") + " ...";
  }
}

function obtainView() {
  // Prepare the request
  var request = gapi.client.youtube.search.list({
       part: "snippet",
       type: "video",
       q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
       maxResults: 50,
       order: "viewCount"
  });
  request.execute(function(response) {
    $("#content").html("<div class='col-lg-12'><h2 class='result-header page-header'>Results</h2></div>");
    var results = response.result;
    if (results.items[0] !== undefined) {
      $.each(results.items, function(index, item) {
        $("#content").append("<div class='col-lg-3 col-md-4 col-xs-6 thumb'><p class='video-title center' data-toggle='tooltip' data-placement='top' title='" + item.snippet.title + "'>" + setTitleLength(item.snippet.title) + "</p><a href='#/' onclick='return onSelect(\"" + item.id.videoId + "\");' class='thumbnail picture'><img class='img-responsive' src=" + item.snippet.thumbnails.high.url + " alt='' data-toggle='tooltip' data-placement='top' title='" + item.snippet.title + "'></a></div>");
      });
    } else {
      $("#content").append("<h3 class='center'>No Results!</h3>");
    }
  })
}

function init() {
  gapi.client.setApiKey("YouTube API Key");
  gapi.client.load("youtube", "v3", function() {
      // YouTube API ready
  });
}
