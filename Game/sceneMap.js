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
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });
        // chargement tuiles de jeu
        this.load.image("Phaser_tuilesdejeu", "assets/Map.png");
        // chargement de la carte
        this.load.tilemapTiledJSON("map", "assets/GlobalMap.json");
    }

    create() {
        this.gameover = false;

        // chargement de la carte
        const carteDuNiveau = this.add.tilemap("map");
        // chargement du jeu de tuiles
        const tileset = carteDuNiveau.addTilesetImage("Map", "Phaser_tuilesdejeu");
        //chargement des calques
        // chargement du calque calque_terrain
        const calque_terrain = carteDuNiveau.createLayer("ground", tileset);
        // chargement du calque calque_obstacles
        const calque_obstacles = carteDuNiveau.createLayer("obstacles_batiments", tileset);
        calque_obstacles.setCollisionByProperty({ estSolide: true });
        // chargement du calque calque_lumiere
        const calque_lumieres = carteDuNiveau.createLayer("lights", tileset);
        this.player = this.physics.add.sprite(100, 450, 'perso');
        //chargement du calque porte_boutique
        this.porte = this.physics.add.group({
            key: 'star'
        });

        this.porte_boutique = carteDuNiveau.getObjectLayer("porte_boutique");

        this.porte_boutique.objects.forEach(porte_boutique => {
            const doorSpawn = this.porte.create(porte_boutique.x + 16, porte_boutique.y + 16, "star").body.setAllowGravity(false);
        });

        this.physics.add.overlap(this.porte, this.player, this.toShop, null, this);

 
        this.physics.add.collider(this.player, calque_obstacles);

        this.scoreText = this.add.text(16, 64, 'World Map', { fontSize: '32px', fill: '#FFF' });

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5);

    }
    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-360);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(360);
        }
        else { this.player.setVelocityX(0); }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-360);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(360);
        }
        else { this.player.setVelocityY(0); }
    }

    toShop(porte, player) {
        console.log("test");
        this.scene.start("sceneShop", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot
        })

    }
}