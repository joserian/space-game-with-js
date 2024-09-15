var obj_player = {
    element:document.getElementById("player"),
    speed: 400,
    life: 10,
    cooldown: 10,
    shot_speed: 500,
    x:0,
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

var obj_screen = {
    int_x: parseInt(getComputedStyle(screen).marginLeft),
    int_y: parseInt(getComputedStyle(screen).marginTop),
    x: "auto",
    y: getComputedStyle(screen).marginTop,
    width: screen.style.width,
    height: screen.style.height
}

const clue = document.getElementById("clue");

//setting initial player position
obj_player.x = parseInt(obj_screen.width)/2;
obj_player.updatePosition();

//#region score
const score = document.getElementById("score");

var my_score = 0;

function updateScore(_score) {
    my_score += _score;
    score.textContent = my_score;
}

updateScore(0);

//#endregion

//#region screen shake
var time = 0, force = 0;

function updateScreenShake(_time, _force) {
    if(_time > time) time = _time;
    if(_force > force) force = _force;
    
}
function systemScreenShake() {
    if(time > 0) {
        var _random_x = Math.random() * force, _random_y = Math.random() * force; 
        
        _random_x *= Math.floor(Math.random() * 2) == 1 ? -1 : 1;
        _random_y *= Math.floor(Math.random() * 2) == 1 ? -1 : 1;

        screen.style.marginLeft = obj_screen.int_x + _random_x + "px";
        screen.style.marginTop = obj_screen.int_y + _random_y + "px";
        
        time--;
        if(time <= 0) {
            screen.style.margin = obj_screen.x;
            screen.style.marginTop = obj_screen.y;
            time = 0;
            force = 0;
        }
    }
}
//#endregion

//#region key events trigger
var keys = [];

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});
//#endregion

//#region player functions

//#region player life
const player_life = document.getElementById("life");

var current_life = obj_player.life, game_over = false;
function updateLife(_life) {
    current_life -= _life;
    player_life.textContent = current_life;

    if(current_life <= 0) {
        obj_player.element.remove();
        createShotParticle(obj_screen.int_x + obj_player.x + "px", parseInt(obj_screen.height) - 64 + "px", "explosion")
        game_over = true;
    }
}

updateLife(0);
//#endregion

function playerMove() {
    var velx_ = obj_player.speed * delta_time;

    if(keys["a"] == true && obj_player.x > velx_) {
        obj_player.x -= velx_;
    }

    if(keys["d"] == true && obj_player.x < parseInt(obj_screen.width)-48) {
        obj_player.x += velx_;
    }

    obj_player.updatePosition();
}

var cooldown_shot = 0, shot_exists = [];

function playerShoot() {
    if(keys[" "] == true && cooldown_shot <= 0) {
        var shot_ = document.createElement("div");
        var margin_top_ = parseInt(obj_screen.height) - 64;
        var margin_left_  = obj_screen.int_x + parseInt(obj_player.x) + 22;
        shot_.className = "shot";
        shot_.style.left = margin_left_ + "px";
        shot_.style.top = margin_top_ + "px";

        var img_shot_ = document.createElement("img");
        img_shot_.setAttribute("src", "sprites/sprShot0.png");

        shot_.append(img_shot_);

        shot_exists[shot_exists.length] = shot_;
        screen.append(shot_);
        
        cooldown_shot = obj_player.cooldown;
        updateScreenShake(3, .1);
    }
    cooldown_shot--;

    if(shot_exists.length > 0) {
        shot_exists = shot_exists.filter(shot => {
            var posy_ = parseInt(shot.style.top) - obj_player.shot_speed * delta_time;
            shot.style.top = `${posy_}px`;
            

            if(enemy_exists.length > 0) {
                for(var i = 0; i<enemy_exists.length;i++) {
                    if(collision(shot, enemy_exists[i].element)) {
                        shot.remove();
                        updateScore(10);
                        enemy_exists[i].life--;
                        createShotParticle(shot.style.left, shot.style.top, "shot-impact");
                        return false;
                    }
                }
            }

            if(posy_ <= 0) {
                shot.remove();
                return false;
            }

            return true;
        });
    }
    
}

function updatePlayer() {
    playerMove();    
    playerShoot();

    if(game_over) {
        if(!document.getElementById("game-over")) {
            var _text = document.createElement("div");
            _text.className = "UI";
            _text.id = "game-over";
            _text.style.left = obj_screen.int_x + parseInt(obj_screen.width)/2 - 150 + "px";
            _text.style.top = obj_screen.int_y + parseInt(obj_screen.height)/2 + "px";
            _text.textContent = "press C to restart";
            
            screen.append(_text);
        }

        if(keys["c"]) {
            window.location.reload();
        }
    }
}
//#endregion

//#region effects
var effects_exists = [];
function createShotParticle(_x, _y, _type) {
    var _eff = document.createElement("div");
    _eff.className = "eff";
    _eff.style.left = _x;
    _eff.style.top = _y;


    var _img = document.createElement("img"), _timeToDestroy = 100;
    if(_type == "shot-impact") {
        _img.setAttribute("src", "sprites/sprImpactShot0.gif");
    }else if(_type == "explosion") {
        _img.setAttribute("src", "sprites/explosion0.gif");
        _timeToDestroy = 800;
    }

    _eff.append(_img);

    screen.append(_eff);
    effects_exists[effects_exists.length] = _eff;

    var interval = setInterval((__eff = _eff, _index=effects_exists.length) => {
        __eff.remove();
        effects_exists = effects_exists.splice(_index, 1);
        clearInterval(interval);
    }, _timeToDestroy);

}
//#endregion

//#region enemies
var cooldown_enemy = 0, enemy_exists = [], shot_enemies_exists = [];

function createEnemy0() {
    if(cooldown_enemy <= 0) {
        var enemy_ = document.createElement("div");
        enemy_.className = "enemy";
        enemy_.style.top = "10px";
        var _x = Math.random() * (800-48);
        enemy_.style.left = obj_screen.int_x + _x + "px";

        var img_ = document.createElement("img");
        img_.setAttribute("src", "sprites/sprEnemy0.png");

        enemy_.append(img_);
        screen.append(enemy_);

        enemy_exists[enemy_exists.length] = {
            element: enemy_,
            life:5,
            x: _x,
            y: 10,
            cooldown: Math.random() * 50
        };

        cooldown_enemy = 180;
    }
    cooldown_enemy--;
}

function updateEnemy0() {
    createEnemy0();

    if(enemy_exists.length > 0) {
        enemy_exists = enemy_exists.filter(enemy => {
            //moving
            enemy.element.style.left = enemy.x + obj_screen.int_x + "px"; //updating position x if window resize

            enemy.y += 125 * delta_time;
            enemy.element.style.top = `${enemy.y}px`;
            //shooting
            enemy.cooldown--;
            if(enemy.cooldown <= 0) {
                var _shot = document.createElement("div");
                _shot.className = "shot";
                _shot.style.left = parseInt(enemy.element.style.left) + 20 + "px";
                _shot.style.top = parseInt(enemy.element.style.top) + 40 + "px";

                var _img = document.createElement("img");
                _img.setAttribute("src", "sprites/sprShot0.png");

                _shot.append(_img);

                shot_enemies_exists[shot_enemies_exists.length] = _shot;
                screen.append(_shot);

                enemy.cooldown = Math.random() * 80 + 130;
            }

            //destroy 
            //by 0 life
            if(enemy.life <= 0) {
                enemy.element.remove();
                createShotParticle(enemy.element.style.left, enemy.element.style.top, "explosion");
                updateScore(100);
                updateScreenShake(4, 5);
                return false;
            }

            //collision with player
            if(collision(enemy.element, obj_player.element)) {
                enemy.element.remove();
                createShotParticle(enemy.element.style.left, enemy.element.style.top, "explosion");
                updateLife(1);
                updateScreenShake(4, 5);
                return false;
            }

            if(enemy.y > parseInt(screen.style.height) + 48) {
                enemy.element.remove();
                return false;
            }

            return true;

        })
    }
    
    if(shot_enemies_exists.length > 0) {
        shot_enemies_exists = shot_enemies_exists.filter(shot => {
            var posy = parseInt(shot.style.top) + obj_player.shot_speed / 1.5 * delta_time;
            shot.style.top = `${posy}px`;

            if(posy >= parseInt(screen.style.height) + 48) {
                shot.remove();
                return false;
            }
            if(collision(shot, obj_player.element)) {
                shot.remove();
                updateLife(1);
                createShotParticle(shot.style.left, shot.style.top, "shot-impact")
                return false;
            }

            return true
        });
    }
}

//#endregion

//#region collision
function collision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(
      rect1.top > rect2.bottom ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right ||
      rect1.right < rect2.left
    );
}
//#endregion

//#region main loop
var last_time = 0, delta_time;
function loop(time) {
    delta_time = (time - last_time) / 1000;
    last_time = time;

    updatePlayer();
    updateEnemy0();
    systemScreenShake();

    obj_screen.int_x = parseInt(getComputedStyle(screen).marginLeft);
    obj_screen.int_y = parseInt(getComputedStyle(screen).marginTop);
    score.style.left = obj_screen.int_x + 30 + "px";
    player_life.style.left = obj_screen.int_x + 30 + "px";
    clue.style.left = obj_screen.int_x + 100 + "px";

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
//#endregion