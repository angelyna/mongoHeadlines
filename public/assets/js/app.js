
// Grab the articles as a json
$.getJSON("/api/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  

// Clicking 'Save Article' will set the Article saved = true
$(document).on("click", ".article-save", function() {
    var id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/api/articles/save/" + id
    }).then(function() {
        location.reload();
    });
});

$(document).on("click", ".article-unsave", function() {
    var id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/api/articles/unsave/" + id
    }).then(function() {
        location.reload();
    });
});

$(document).on("click", ".add-note-btn", function() {
    // Empty notes section of the modal.
    $("#notes").empty();
    $("#note-form").empty();
    // Get the id from the notes button
    var thisId = $(this).attr("data-id");

    // Ajax call to get the notes data
    $.ajax({
        method: "GET",
        url: "/api/articles/" + thisId
    }).then(function(data) {
        // Log and then add the note information to the modal.
        console.log(data);
        console.log(data.note);
        if (data.note) {
            $("#notes").append("<h4 id='note-title'>" + data.note.title + ":</h4> " + data.note.body);
            $("#notes").append("<button class='btn btn-danger' data-id=" + data.note._id + " id='delete-note'>Delete Note</button>");
        }
        $("#note-form").append("<div><input id='note-titleinput' name='title' placeholder='Title'></div>");
        $("#note-form").append("<textarea id='note-bodyinput' name='body' placeholder='Body'></textarea>");
        $("#note-form").append("<button class='btn btn-success' data-id='" + data._id + "' id='add-note'>Save Note</button>");
        $('#notes-modal').modal('show');
    });
});

$(document).on("click", "#add-note", function() {
    // Get the id from the button
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/api/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#note-titleinput").val(),
            // Value taken from note textarea
            body: $("#note-bodyinput").val()
        }
    }).then(function(data) {
        console.log(data);
        $('#notes-modal').modal('hide');
        $("#note-form").empty();
    });
});

$(document).on("click", "#delete-note", function() {
    // Get the id from the button
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/api/articles/" + thisId
    }).then(function() {
        $('#notes-modal').modal('hide');
        $("#note-form").empty();
    });
});
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
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
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  