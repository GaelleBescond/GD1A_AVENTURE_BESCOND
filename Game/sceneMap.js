class sceneMap extends Phaser.Scene {
    constructor() {
        super("sceneMap");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;

    }

    preload() {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.score = 0;
        this.gameover = false;

        this.player = this.physics.add.sprite(100, 450, 'perso');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.scoreText = this.add.text(16, 16, 'experience: ' + this.experience, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 64, 'World Map', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran, pour le score
        this.stars = this.physics.add.group({
            key: 'star',
            setXY: { x: 120, y: 120, stepX: 70 }
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
        this.scene.start("sceneShop", {
            xp: this.experience,
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot
        })

    }
}