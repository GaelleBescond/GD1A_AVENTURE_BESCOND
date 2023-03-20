class sceneLollipop extends Phaser.Scene {
    constructor() {
        super("sceneLollipop");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
    }

    preload() {

        this.load.image('door', 'assets/star.png');
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });

        // chargement tuiles de jeu
        this.load.image("Phaser_tuilesdejeu", "assets/Map.png");
        // chargement de la carte
        this.load.tilemapTiledJSON("carte", "assets/TestCode1.json");
    }

    create() {

        // chargement de la carte
        const carteDuNiveau = this.add.tilemap("carte");
        // chargement du jeu de tuiles
        const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu", "Phaser_tuilesdejeu");

        this.gameover = false;
        this.location = 3;

        this.player = this.physics.add.sprite(100, 450, 'perso');
        this.player.setCollideWorldBounds(true);
        this.scoreText = this.add.text(16, 16, 'Chocolats: ' + this.chocolat, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 48, 'Caramels: ' + this.caramel, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 86, 'Berlingots: ' + this.berlingot, { fontSize: '32px', fill: '#FFF' });


        this.scoreText = this.add.text(16, 64, 'Scene Un', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran, pour le score
        this.door = this.physics.add.group({
            key: 'door',
            setXY: { x: 420, y: 360, stepX: 70 }
        });
        this.physics.add.overlap(this.player, this.door, this.openDoor, null, this);
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
    openDoor(player, door) {
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot
        })
    }
}
