// Declare an initial set of variables to be used 
let noteTitle = $(".note-title");
let noteText = $(".note-textarea");
let saveButton = $(".save-note");
let newButton = $(".new-note");
let noteList = $(".list-container .list-group");

let activeNote = {};

// Create a function to grab the notes
let getNotes = () => {
    return $.ajax({
        url: "api/notes",
        method: "GET"
    });
};

// Create a function to save the notes
let saveNote = () => {
    return $.ajax({
        url: "api/notes",
        data: note,
        method: "POST"
    });
};

// A function for deleting a note
let deleteNote = (id) => {
    return $.ajax({
        url: "api/notes" + id,
        method: "DELETE"
    });
};

// Display the current active note, otherwise the result should be empty
let showActiveNote = () => {
    saveButton.hide();

    if (activeNote.id) {
        noteTitle.attr("readonly", true).val(activeNote.title);
        noteText.attr("readonly", true).val(activeNote.text);
    }
    else {
        noteTitle.attr("readonly", false).val("");
        noteText.attr("readonly", false).val("");
    }
};

// Get the data based on the inputs
let handleData = () => {
    let newNote = {
        title: noteTitle.val(),
        text: noteText.val()
    };

    saveNote(newNote).then((data) => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Removing note data
let handleDelete = (event) => {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();

    let note = $(this)
        .parent(".list-group-item")
        .data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Display the active note
let handleView = () => {
    activeNote = $(this).data();
    renderActiveNote();
};

// Set the active note to empty so the user can update it
let handleNewView = () => {
    activeNote = {};
    renderActiveNote();
};

// Hide the save button until both the title and text are no longer empty
let renderSave = () => {
    if (!noteTitle.val().trim() || noteText.val().trim()) {
        saveButton.hide();
    }
    else {
        saveButton.show();
    }
};

// Show the list of note titles
let renderTitles = (notes) => {
    noteList.empty();

    let noteListItems = [];

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let li = $("<li class='list-group-item'>").data(note);
        let span = $("<span>").text(note.title);
        let delBtn = $(
          "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );

        li.append(span, delBtn);
        noteListItems.push(li);
    }

    noteList.append(noteListItems);
};

// Get the notes from the database and show them on the sidebar
let getAndRenderNotes = () => {
    return getNotes().then((data) => {
        renderNoteList(data);
    });
};

saveNoteBtn.on("click", handleNoteSave);
noteList.on("click", ".list-group-item", handleNoteView);
newNoteBtn.on("click", handleNewNoteView);
noteList.on("click", ".delete-note", handleNoteDelete);
noteTitle.on("keyup", handleRenderSaveBtn);
noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();