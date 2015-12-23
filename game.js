var el_canvas_game;
var el_canvas_editor;
var left_click_down = false;
var right_click_down = false;

var edcx;

var player = {'x': 50, 'y': 50, 'ang': 0}

function editorRightClick(event) {
    event.preventDefault();
}

function editorMouseChanged(event) {
    left_click_down = (event.buttons & 1);
    right_click_down = (event.buttons & 2);
    
    editorMouseMove(event);
}

function editorMouseMove(event) {
    if(right_click_down) {
        //console.log(event.pageX - el_canvas_editor.offsetLeft,event.pageY - el_canvas_editor.offsetTop);
        player.x = event.pageX - el_canvas_editor.offsetLeft;
        player.y = event.pageY - el_canvas_editor.offsetTop;
    }
    editorRefresh();
}

function editorRefresh() {
    edcx.fillStyle = 'ffffff';
    edcx.clearRect(0,0,640,480);
    
    edcx.strokeStyle = '0000bb';
    edcx.beginPath();
    edcx.arc(player.x,player.y,5,0,2*Math.PI);
    edcx.stroke();
}

function setup() {
    el_canvas_editor = document.getElementById('map_editor');
    edcx = el_canvas_editor.getContext('2d');
    el_canvas_editor.addEventListener('contextmenu', editorRightClick, false);
    el_canvas_editor.addEventListener('mousedown', editorMouseChanged, false);
    el_canvas_editor.addEventListener('mousemove', editorMouseMove, false);
    el_canvas_editor.addEventListener('mouseup', editorMouseChanged, false);
    
    editorRefresh();
}

window.onload = function() {
    console.log('hello');
    setup();
}
