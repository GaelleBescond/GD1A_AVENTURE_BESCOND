class sceneUn extends Phaser.Scene {
    constructor() {
        super("sceneUn");
    }

    init(data) {
        this.experience = data.xp;
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
        this.gameover = false;
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'perso');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.scoreText = this.add.text(16, 16, 'experience: '+ this.experience, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 64, 'Scene Un', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran, pour le score
        this.stars = this.physics.add.group({
            key: 'star',
            setXY: { x: 420, y: 360, stepX: 70 }
        });
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }
    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-260);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(260);
        }
        else { this.player.setVelocityX(0); }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-260);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(260);
        }
        else { this.player.setVelocityY(0); }
    }
    collectStar(player, star) {
        this.experience = this.experience + 1
        this.scene.start("sceneDeux",{xp: this.experience})
    }
}
