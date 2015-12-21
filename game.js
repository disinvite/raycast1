var el_canvas_game;
var el_canvas_editor;

function editorRightClick(event) {
    event.preventDefault();
    console.log(event.pageX - el_canvas_editor.offsetLeft,event.pageY - el_canvas_editor.offsetTop);
}

function setup() {
    el_canvas_editor = document.getElementById('map_editor');
    el_canvas_editor.addEventListener('contextmenu', editorRightClick, false);
}

window.onload = function() {
    console.log('hello');
    setup();
}
