var el_canvas_game;
var el_canvas_editor;
var left_click_down = false;
var right_click_down = false;

var edcx;

var player = {'x': 50, 'y': 50, 'ang': 0}

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
        player.x = event.pageX - el_canvas_editor.offsetLeft;
        player.y = event.pageY - el_canvas_editor.offsetTop;
    }
    editorRefresh();
}

function editorRefresh() {
    edcx.clearRect(0,0,640,480);
    
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

    edcx.strokeStyle = '#0000bb';
    edcx.beginPath();
    edcx.arc(player.x,player.y,5,0,2*Math.PI);
    edcx.stroke();
    
    edcx.fillStyle = '#000000';
    var wt = whatTile();
    edcx.fillText(wt.x+','+wt.y,500,50);
}

function setup() {
    map = new Array(mapsize);
    for(var i = 0; i < mapsize; i++) {
        map[i] = new Array(mapsize).fill(0);
    }
    map[3][3] = 1;
    
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
