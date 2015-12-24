var el_canvas_game;
var el_canvas_editor;
var left_click_down = false;
var right_click_down = false;

var edcx;
var gmcx;

var player = {'x': 6.5, 'y': 5.5, 'ang': 120};

var map = null;
var mapsize = 20;

var mouse = {'x': 0, 'y': 0};

function whatTile() {
    if((mouse.x <= 20) || (mouse.x >= 420) || (mouse.y <= 20) || (mouse.y >= 420)) {
        return {'x':-1,'y':-1};
    } else {
        return {
            'x': Math.floor((mouse.x - 20) / mapsize),
            'y': Math.floor((mouse.y - 20) / mapsize)
        };
    }
}

function editorRightClick(event) {
    event.preventDefault();
}

function editorMouseChanged(event) {
    if((event.buttons & 1) && !left_click_down) {
        var wt = whatTile();
        map[wt.x][wt.y] = !map[wt.x][wt.y]
    }

    left_click_down = (event.buttons & 1);
    right_click_down = (event.buttons & 2);
    
    editorMouseMove(event);
}

function editorMouseMove(event) {
    mouse.x = event.pageX - el_canvas_editor.offsetLeft;
    mouse.y = event.pageY - el_canvas_editor.offsetTop;
    
    if(right_click_down) {
        var wt = whatTile();
        if(wt.x != -1 && wt.y != -1) {
            player.x = wt.x + 0.5;
            player.y = wt.y + 0.5;
        }
    }
    editorRefresh();
}

function editorRefresh() {
    edcx.clearRect(0,0,640,480);
    
    // draw the tiles
    edcx.strokeStyle = '#888888';
    edcx.fillStyle = '#bb0000';
    edcx.lineWidth = '1';
    for(var i = 0; i < mapsize; i++) {
        for(var j = 0; j < mapsize; j++) {
            edcx.beginPath();
            edcx.moveTo(20.5 + (i*20),20.5 + (j*20));
            edcx.lineTo(20.5 + ((i+1)*20),20.5 + (j*20));
            edcx.lineTo(20.5 + ((i+1)*20),20.5 + ((j+1)*20));
            edcx.lineTo(20.5 + (i*20),20.5 + ((j+1)*20));
            edcx.lineTo(20.5 + (i*20),20.5 + (j*20));
            edcx.closePath();
            if(map[i][j]) {
                edcx.fill();
            } else {
                edcx.stroke();
            }
        }
    }

    // draw the player
    edcx.strokeStyle = '#0000bb';
    edcx.beginPath();
    var player_dx = 20.5 + (20 * player.x);
    var player_dy = 20.5 + (20 * player.y);
    
    edcx.arc(player_dx,player_dy,5,0,2*Math.PI);
    edcx.stroke();
    
    edcx.beginPath();
    edcx.moveTo(player_dx,player_dy);
    edcx.lineTo((Math.cos(player.ang * Math.PI / 180.0) * 20) + player_dx,(-Math.sin(player.ang * Math.PI / 180.0) * 20) + player_dy);
    edcx.closePath();
    edcx.stroke();
    
    // draw the text that tells what tile you're hovering over
    edcx.fillStyle = '#000000';
    var wt = whatTile();
    edcx.fillText(wt.x+','+wt.y,500,50);
}

function gameRefresh() {
}

function setup() {
    map = new Array(mapsize);
    for(var i = 0; i < mapsize; i++) {
        map[i] = new Array(mapsize).fill(0);
    }
    map[3][2] = 1;
    map[4][2] = 1;
    map[5][1] = 1;
    
    el_canvas_editor = document.getElementById('map_editor');
    edcx = el_canvas_editor.getContext('2d');
    el_canvas_editor.addEventListener('contextmenu', editorRightClick, false);
    el_canvas_editor.addEventListener('mousedown', editorMouseChanged, false);
    el_canvas_editor.addEventListener('mousemove', editorMouseMove, false);
    el_canvas_editor.addEventListener('mouseup', editorMouseChanged, false);
    
    el_canvas_game = document.getElementById('game');
    gmcx = el_canvas_game.getContext('2d');
    
    editorRefresh();
    gameRefresh();
}

window.onload = function() {
    console.log('hello');
    setup();
}
