class sceneIntro extends Phaser.Scene {
    constructor() {
        super("sceneIntro");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.score = 0;
        this.experience = 0;
        this.player_block = true;
        this.gameover = false;
        this.platforms = this.physics.add.staticGroup();

        this.player = this.physics.add.sprite(100, 450, 'perso');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.scoreText = this.add.text(16, 64, 'Scene Intro', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran, pour le score
        this.stars = this.physics.add.group({
            key: 'star',
            setXY: { x: 420, y: 360, stepX: 70 }
        });
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }
    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.player_block == true) {
            //Mouvement
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-300);
                this.player.setVelocityX(0);
                //this.player.anims.play('up');
                //this.player_facing = "up";
            }
            else if (this.cursors.down.isDown) {
                this.player.setVelocityY(300);
                this.player.setVelocityX(0);
                //this.player.anims.play('down');
                //this.player_facing = "down";
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(300);
                this.player.setVelocityY(0);
                //this.player.anims.play('right');
                //this.player_facing = "right";
            }
            else if (this.cursors.left.isDown) {
                this.player.setVelocityX(-300);
                this.player.setVelocityY(0);
                //this.player.anims.play('left');
                //this.player_facing = "left";
            }
            else {
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
            }
            //Attaque
            if (this.cursors.space.isDown) {
                if (this.player_facing == "up") {
                    this.attaque_sword.create(this.player.x, this.player.y - 32, "sword_y");
                }
                else if (this.player_facing == "down") {
                    this.attaque_sword.create(this.player.x, this.player.y + 32, "sword_y");
                }
                else if (this.player_facing == "right") {
                    this.attaque_sword.create(this.player.x + 32, this.player.y, "sword_x");
                }
                else if (this.player_facing == "left") {
                    this.attaque_sword.create(this.player.x - 32, this.player.y, "sword_x");
                }
                this.player_block = false;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.time.delayedCall(500, this.delock_attaque, [], this);
            }
        }
    }
    delock_attaque() {
        this.player_block = true;
    }


    collectStar(player, star) {
        this.experience = this.experience + 1
        this.scene.start("sceneUn", { xp: this.experience })
    }
}

//ajouter attaque

