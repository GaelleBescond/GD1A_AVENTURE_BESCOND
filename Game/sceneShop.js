class sceneShop extends Phaser.Scene {
    constructor() {
        super("sceneShop");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.spawn = data.spawn;
    }

    preload() { }

    create() {
        if (this.spawn == "map") {
            this.spawn_x = 30;
            this.spawn_y = 58;
        } else if (this.spawn == "intro") {
            this.spawn_x = 0;
            this.spawn_y = 0;
        }
        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("map");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Map", "Phaser_tuilesdejeu");

        // chargement du calque calque_terrain
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset);
        // chargement du calque calque_obstacles
        this.calque_obstacles = this.carteDuNiveau.createLayer("obstacles_murs", this.tileset);
        this.calque_obstacles.setCollisionByProperty({ estSolide: true });

        this.player = this.physics.add.sprite(this.spawn_x, this.spawn_y, 'perso');

        // chargement du calque calque_lumiere
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset);
        this.physics.add.collider(this.player, this.calque_obstacles);

        this.scoreText = this.add.text(16, 16, 'Chocolats: ' + this.chocolat, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 48, 'Caramels: ' + this.caramel, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 86, 'Berlingots: ' + this.berlingot, { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 64, 'Shop', { fontSize: '32px', fill: '#FFF' });




        this.porteMap = this.physics.add.group({
            key: 'door'
        });
        this.porte_map = this.carteDuNiveau.getObjectLayer("porte_boutique");
        this.porte_map.objects.forEach(porte_map => {
            const doorSpawn = this.porteMap.create(porte_map.x + 16, porte_map.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.player, this.porteMap, this.openDoor, null, this);


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
        this.spawn = "shop";
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })
    }
}
