var obj_player = {
    element:document.getElementById("player"),
    speed: 350,
    cooldown: 20,
    shot_speed: 500,
    x:0,
    y:0,
    updatePosition() {
        this.element.style.left = String(this.x) + "px";
        return
    }
    
}

const screen = document.getElementById("screen");
screen.style.width = "800px";
screen.style.height = "800px";
screen.style.margin = "auto";
screen.style.marginTop = "10px";

obj_player.x = parseInt(screen.style.width)/2
obj_player.updatePosition()

var keys = [];

var screen_original_margin = {
    int_x: parseInt(getComputedStyle(screen).marginLeft),
    int_y: parseInt(getComputedStyle(screen).marginTop),
    x: getComputedStyle(screen).marginLeft,
    y: getComputedStyle(screen).marginTop
}

function systemScreenShake(time = 60, force = 8) {
    var _random_x = Math.random() * force, _random_y = Math.random() * force;
    screen.style.marginLeft = screen_original_margin.int_x + _random_x + "px";
    screen.style.marginTop = screen_original_margin.int_y + _random_y + "px";
    time--;
    if(time <= 0) {
        screen.style.margin = screen_original_margin.x;
        screen.style.marginTop = screen_original_margin.y;
        return
    }
}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function playerMove() {
    var velx_ = obj_player.speed * delta_time;

    if(keys["a"] == true && obj_player.x > velx_) {
        obj_player.x -= velx_;
    }

    if(keys["d"] == true && obj_player.x < parseInt(screen.style.width)-48) {
        obj_player.x += velx_;
    }

    obj_player.updatePosition();
}


var cooldown_shot = 0, shot_exists = [];

function playerShoot() {
    if(keys[" "] == true && cooldown_shot <= 0) {
        var shot_ = document.createElement("div");
        var margin_top_ = (parseInt(screen.style.height) - 64);
        var margin_left_  = (parseInt(getComputedStyle(screen).marginLeft) + parseInt(obj_player.x) + 24 + 6);
        console.log(getComputedStyle(screen).marginLeft)
        shot_.className = "shot";
        shot_.style.left = margin_left_ + "px";
        shot_.style.top = margin_top_ + "px";

        var img_shot_ = document.createElement("img");
        img_shot_.setAttribute("src", "sprites/sprShot0.png");

        shot_.append(img_shot_);

        shot_exists[shot_exists.length] = shot_;
        screen.append(shot_);
        
        cooldown_shot = obj_player.cooldown;
        
    }
    cooldown_shot--;

    if(shot_exists.length > 0) {
        shot_exists = shot_exists.filter(shot => {
            var posy_ = parseInt(shot.style.top) - obj_player.shot_speed * delta_time;
            shot.style.top = `${posy_}px`;
            
            if(posy_ <= 0) {
                shot.remove();
                return false;
            }

            return true;
        });
    }
    
}


var cooldown_enemy = 0, enemy_exists = [];
function createEnemy0() {
    if(cooldown_enemy <= 0) {
        var enemy_ = document.createElement("div");
        enemy_.className = "enemy";
        enemy_.style.top = "10px";

        var img_ = document.createElement("img");
        img_.setAttribute("src", "sprites/sprEnemy0.png");

        enemy_.append(img_);
        screen.append(enemy_);

        enemy_exists[enemy_exists.length] = {
            element: enemy_,
            life:5,
            y: 10
        };

        cooldown_enemy = 300;
    }
    cooldown_enemy--;

    if(enemy_exists.length > 0) {
        enemy_exists = enemy_exists.filter(enemy => {
            enemy.y += 200 * delta_time;
            enemy.element.style.top = `${enemy.y}px`;

            if(enemy.y > parseInt(screen.style.height)) {
                enemy.element.remove();
                return false;
            }

            return true;

        })
    }
}

var last_time = 0, delta_time;
function loop(time) {
    delta_time = (time - last_time) / 1000;
    last_time = time;

    playerMove();    
    playerShoot();
    createEnemy0();
    systemScreenShake()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop);