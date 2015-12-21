var el_canvas_game;
var el_canvas_editor;
var left_click_down = false;
var right_click_down = false;

function editorRightClick(event) {
    event.preventDefault();
}

function editorMouseChanged(event) {
    left_click_down = (event.buttons & 1);
    right_click_down = (event.buttons & 2);
}

function editorMouseMove(event) {
    if(right_click_down) {
        console.log(event.pageX - el_canvas_editor.offsetLeft,event.pageY - el_canvas_editor.offsetTop);
    }
}

function setup() {
    el_canvas_editor = document.getElementById('map_editor');
    el_canvas_editor.addEventListener('contextmenu', editorRightClick, false);
    el_canvas_editor.addEventListener('mousedown', editorMouseChanged, false);
    el_canvas_editor.addEventListener('mousemove', editorMouseMove, false);
    el_canvas_editor.addEventListener('mouseup', editorMouseChanged, false);
}

window.onload = function() {
    console.log('hello');
    setup();
}
