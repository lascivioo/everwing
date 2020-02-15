var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ship;
var cursors;
var aster;
var gameTxt;
var isGameOver = false;

var obsts = []

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/ship.png');
    this.load.image('asteroid', 'assets/obstacle.png');
    
}

function create ()
{
    var phys = this.physics;

    gameTxt = this.add.text(300, 300, '', { fontSize: '32px', fill: '#fff' });

    ship = phys.add.sprite(50, 550, 'ship');    
    ship.setCollideWorldBounds(true);

    //aster = this.physics.add.sprite(50,10, 'asteroid');

    for(i=0;i<5;i++){
        aster = phys.add.sprite(Phaser.Math.Between(20, config.width - 25), 10, 'asteroid');
        obsts.push(aster);
    }

    cursors = this.input.keyboard.createCursorKeys();

    obsts.forEach(function(itm){
        itm.setVelocityY(Phaser.Math.Between(200, 300));
        phys.add.overlap(ship, itm, hitObs, null, this);
    })
}

function update(time, delta)
{
    obsts.forEach(function(itm){
        if(itm.y >= config.height + 20){
            itm.x = Phaser.Math.Between(20, config.width - 25);
            itm.y = 0;
            itm.setVelocityY(Phaser.Math.Between(200, 300));
        }
    })

    if(aster.y >= config.height + 20){
        aster.x = Phaser.Math.Between(20, config.width - 25);
        aster.y = 0;
    }

    if (cursors.left.isDown)
    {
        ship.setVelocityX(-350);
    }
    else if (cursors.right.isDown)
    {
        ship.setVelocityX(350);
    }
    else
    {
        ship.setVelocityX(0);
    }

    if(isGameOver){
        return;
    }
};

function hitObs(){
    gameTxt.setText("Game Over");
    ship.disableBody(true, true);
    isGameOver = true;
}