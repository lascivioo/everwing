var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var isGameOver;
var isInvincible;

var timer;
var gameTxt;
var ship;
var power;
var banner;

var obsts = [];

var game = new Phaser.Game(config);
var timer = new Phaser.Time.TimerEvent();

function preload ()
{
    this.load.image('ship', 'assets/dragon.png');
    this.load.image('asteroid', 'assets/meteor.png');
    this.load.image('power', 'assets/egg.png');
    this.load.image('halo', 'assets/halo.png');
    this.load.image('immortal', 'assets/immortal.png');
    this.load.image('bg', 'assets/sky-night.png');
}

function create ()
{
    this.leftKey = this.input.keyboard.addKey('LEFT');
    this.rightKey = this.input.keyboard.addKey('RIGHT');
    this.upKey = this.input.keyboard.addKey('UP');
    this.downKey = this.input.keyboard.addKey('DOWN');
    this.spaceKey = this.input.keyboard.addKey('SPACE');

    this.add.image(config.width/2, config.height/2, 'bg');

    power = this.add.image(config.width / 2, config.height / 2, "power");
    power.x = config.width / 2;
    power.y = -15;
    power.isTrigger = false;

    ship = this.add.image(config.width / 2, config.height / 2, "ship");
    ship.x = config.width / 2;
    ship.y = config.height - 30;

    banner = this.add.image(config.width / 2, config.height / 2, "immortal");
    banner.x = config.width / 2;
    banner.y = config.height / 2;
    banner.setVisible(false);

    this.speed = 5

    for(i=0;i<5;i++){
        this.obst = this.add.image(config.width / 2, config.height / 2, "asteroid");
        var spawnX = Phaser.Math.Between(20, config.width - 20);
        this.obst.y = Phaser.Math.Between(-50, -25);
        this.obst.x = spawnX;
        this.obst.speed = Phaser.Math.Between(3, 6);
        obsts.push(this.obst);
    }

    gameTxt = this.add.text(300, 300, '', { fontSize: '32px', fill: '#fff' });

    isGameOver = false;
    isInvincible = false;
    spawnPower = false;
}

function update(time, delta)
{
    //console.log(time);
    if(isGameOver){
        return;
    }

    if(this.leftKey.isDown && ship.x <= 25) {
    } else if(this.leftKey.isDown) {
      ship.x -= 1 * this.speed;
    }

    if(this.rightKey.isDown && ship.x > config.width - 25) {
    } else if(this.rightKey.isDown) {
      ship.x += 1 * this.speed;
    }

    if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        obsts.forEach(function arr(itm, idx){
            itm.speed += 0.5;
        })
    }

    obsts.forEach(function arr(itm, idx){
        if(itm.y <= config.height + 25){
            itm.y += itm.speed;
        }
        else{
            itm.y = Phaser.Math.Between(-10, -2);
            itm.x = Phaser.Math.Between(20, config.width - 20);
        }
    })

    if(!isInvincible){
        obsts.forEach(function arr(itm, idx){
            if(ship.x <= itm.x + (itm.width-10)){
                if(ship.x + (ship.width-10) >= itm.x){
                    if(ship.y <= itm.y + (itm.width - 10)){
                        if(ship.y + (ship.width-10) >= itm.y){
                            ship.destroy(true);
                            isGameOver = true;
                            gameTxt.setText("Game Over");
                        }
                    }
                }
            }
        })
    }

    timer = time % 5015;
    if(timer >= 5000){
        if(!isInvincible){
            console.log('spawn');
            power.x = Phaser.Math.Between(20, config.width - 20)
            power.isTrigger = true;
            timer = 0;
        }
        else{
            banner.setVisible(false);
            isInvincible = false;
            timer = 0;
        }
    }

    if(ship.x <= power.x + (power.width-10)){
        if(ship.x + (ship.width-10) >= power.x){
            if(ship.y <= power.y + (power.width - 10)){
                if(ship.y + (ship.width-10) >= power.y){
                    console.log('power up');
                    timer = 0;
                    power.isTrigger = false;
                    isInvincible = true;
                    banner.setVisible(true);
                    power.y = -15;
                }
            }
        }
    }

    if(power.isTrigger){
        power.y += 5;
        if(power.y >= config.height + 25){
            power.y = -15;
            power.isTrigger = false;
        }
    }
};