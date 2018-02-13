$.getJSON("/articles", function(data){

	for(var i = 0; i < data.length; i++){
		var articlePanel = $("<div>");
		articlePanel.addClass("card-panel black white-text");
		var heading = $("<h5>").text(data[i].title);
		heading.attr("data-id" ,data[i]._id);
		// var extra = $("<div>");
		// extra.attr("id", "comments");
		// heading.prepend(extra);
		// var button = $("<div>");
		// button.addClass("right-align");
		// var buttonAnchor = $("<a>").addClass("btn-floating btn-large waves-effect waves-light teal");
		// buttonAnchor.attr("data-id", data[i]._id);
		// var icon = $("<i>").addClass("material-icons").text("mode_edit");
		// buttonAnchor.append(icon);
		// button.append(buttonAnchor);
		articlePanel.append(heading);
		var summary = $("<p>").text(data[i].summary);
		articlePanel.append(summary);
		var link = $("<p>");
		var linkTag = $("<a>").attr("href", data[i].link);
		linkTag.text(data[i].link);
		link.append(linkTag);
		articlePanel.append(link);
		// articlePanel.append(button);
		$("#articles").append(articlePanel);
		

	}
});


$(document).on("click","h5", function(){

	$("#comments").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
		.then(function(result){
			console.log(result);

			$("#comments").append("<h6>" + result.title + "</h6>");
			$("#comments").append("<input id='titleinput' name='title' placeholder='Title:'>");
			$("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
			$("#comments").append("<button data-id='" + result._id + "' id='savecomment'>Save Comment</button>");

			if (result.comment) {

				$("#titleinput").val(result.comment.title);
				$("#bodyinput").val(result.comment.body);
			}
		});
});

$(document).on("click", "#savecomment", function(){
	
	var thisId = $(this).attr("data-id");

	$.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

























