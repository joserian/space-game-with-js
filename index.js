const player = document.getElementById("player");

const screen = document.getElementById("screen");
screen.style.width = "800px";
screen.style.height = "800px"

player.style.left = `${parseInt(screen.style.width)/2}px`;
var posx = parseInt(player.style.left);

var keys = [];

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function playerMove() {
    var velx_ = 350 * delta_time;

    if(keys["a"] == true && posx > velx_) {
        posx -= velx_;
    }

    if(keys["d"] == true && posx < parseInt(screen.style.width)-32) {
        posx += velx_;
    }

    player.style.left = `${posx}px`;
}


var cooldown_shot = 0, shotElements = [], shotId = 0;

function playerShoot() {
    if(keys[" "] == true && cooldown_shot <= 0) {
        cooldown_shot = 20;
        var shot_ = document.createElement("div");
        shot_.className = "shot";
        shot_.style.left = player.style.left;
        shot_.style.top = (parseInt(screen.style.height) - 64).toString() + "px";
        shot_.id = shotId;
        shotId++;

        var img_shot_ = document.createElement("img");
        img_shot_.setAttribute("src", "sprites/sprShot0.png");

        shot_.append(img_shot_);

        shotElements[shotElements.length] = shot_;
        screen.append(shot_);

    }
    cooldown_shot -= 1;

    if(shotElements.length > 0) {
        
    }
    
}

var last_time = 0, delta_time;
function loop(time) {
    delta_time = (time - last_time) / 1000;
    last_time = time;

    playerMove();    
    playerShoot();

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop);