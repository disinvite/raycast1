var el_canvas_game;
var el_canvas_editor;
var left_click_down = false;
var right_click_down = false;

var edcx;
var gmcx;

var player = {'x': 4.5, 'y': 5.5, 'ang': 0};
var direction = {'x': 1, 'y': 0};
var plane = {'x': 0, 'y': 1};

var map = null;
var mapsize = 10;

var mouse = {'x': 0, 'y': 0};

function whatTile() {
    if((mouse.x <= 20) || (mouse.x >= 420) || (mouse.y <= 20) || (mouse.y >= 420)) {
        return {'x':-1,'y':-1};
    } else {
        return {
            'x': Math.floor((mouse.x - 20) / 40),
            'y': Math.floor((mouse.y - 20) / 40)
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
    gameRefresh();
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
            edcx.moveTo(20.5 + (i*40),20.5 + (j*40));
            edcx.lineTo(20.5 + ((i+1)*40),20.5 + (j*40));
            edcx.lineTo(20.5 + ((i+1)*40),20.5 + ((j+1)*40));
            edcx.lineTo(20.5 + (i*40),20.5 + ((j+1)*40));
            edcx.lineTo(20.5 + (i*40),20.5 + (j*40));
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
    var player_dx = 20.5 + (40 * player.x);
    var player_dy = 20.5 + (40 * player.y);
    
    edcx.arc(player_dx,player_dy,5,0,2*Math.PI);
    edcx.stroke();
    
    /*
    edcx.beginPath();
    edcx.moveTo(player_dx,player_dy);
    edcx.lineTo((Math.cos(player.ang * Math.PI / 180.0) * 20) + player_dx,(-Math.sin(player.ang * Math.PI / 180.0) * 20) + player_dy);
    edcx.closePath();
    edcx.stroke();
    */
    
    // draw the text that tells what tile you're hovering over
    edcx.fillStyle = '#000000';
    var wt = whatTile();
    edcx.fillText(wt.x+','+wt.y,500,50);
}

function check_wall(x,y) {
    //console.log('checking '+x+','+y);
    return map[x][y] == 1;
}

function debug_line(start,end) {
    edcx.strokeStyle = '#00bb00';
    edcx.beginPath();
    edcx.moveTo(20.5 + (40 * start.x), 20.5 + (40 * start.y));
    edcx.lineTo(20.5 + (40 * end.x), 20.5 + (40 * end.y));
    edcx.closePath();
    edcx.stroke();
}

function ray(x) {
    var cameraX = (2 * x / 640) - 1;
    var ray_dir = {
        x: direction.x + (plane.x * cameraX),
        y: direction.y + (plane.y * cameraX)
    };
    
    // start at player x,y
    var ray_pos = {
        x: player.x,
        y: player.y
    };
    
    var slope = ray_dir.y / ray_dir.x;
    // distance from one x,y coordinate to the next tracing the ray's slope
    // prevent divide-by-zero here
    //var dist_to_x = ray_dir.x == 0 ? 0 : Math.sqrt(1 + (slope * slope));
    //var dist_to_y = ray_dir.y == 0 ? 0 : Math.sqrt(1 + (1 / (slope * slope)));
    
    var which_way = {
        x: ray_dir.x < 0 ? 0: 1,
        y: ray_dir.y < 0 ? 0: 1
    };
    
    // 5 steps as a test
    /*
    for(var _t = 0; _t < 5; _t++) {
    }
    */
    
    var _nextx = Math.floor(ray_pos.x) + which_way.x;
    var _nexty = Math.floor(ray_pos.y) + which_way.y;
    
    var _nextx_x = _nextx - ray_pos.x;
    var _nextx_y = slope * _nextx_x;
    
    var _nexty_y = _nexty - ray_pos.y;
    var _nexty_x = _nexty_y / slope;
    
    console.log('ray '+x+':');
    console.log('  slope: ' + slope);
    console.log('  whichway: ' + which_way.x,which_way.y);
    console.log('  whereat ' + ray_pos.x + ',' + ray_pos.y);
    console.log('  yo ' + _nextx + ',' + _nexty);
    console.log('  next x? ' + _nextx_x + ',' + _nextx_y);
    console.log('  next y? ' + _nexty_x + ',' + _nexty_y);
    
    //ray_pos.x += ray_dir.x;
    //ray_pos.y += ray_dir.y;
    
    ray_pos.x += _nexty_x;
    ray_pos.y += _nexty_y;
    
    debug_line(player,ray_pos);
}

function gameRefresh() {
    //for(var i = 0; i < 640; i++) {
    
    for(var i = 0; i < 640; i+= 80) {
        var d = ray(i);
    }
    
    // start with dead-center ray to test
    //var d = ray(160);
}

function setup() {
    map = new Array(mapsize);
    for(var i = 0; i < mapsize; i++) {
        map[i] = new Array(mapsize).fill(0);
    }
    map[7][2] = 1;
    map[7][3] = 1;
    map[8][4] = 1;
    map[8][5] = 1;
    map[7][6] = 1;
    map[7][7] = 1;
    
    map[2][4] = 1;
    
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
