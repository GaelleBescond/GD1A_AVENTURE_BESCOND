class sceneShop extends Phaser.Scene {
    constructor() {
        super("sceneShop");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.player_hp = data.hp;
        this.spawn = data.spawn;
    }

    preload() {
    }


    create() {
        this.spawn_x = 15 * 32;
        this.spawn_y = 58 * 32;
        if (this.spawn == "intro") {
            this.spawn_x = 14 * 32;
            this.spawn_y = 21 * 32;
        }

        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("Shop");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Shop", "Phaser_tuilesdejeu1");

        // chargement du calque calque_terrain
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset);
        // chargement du calque calque_obstacles
        this.calque_obstacles = this.carteDuNiveau.createLayer("obstacles", this.tileset);
        this.calque_obstacles.setCollisionByProperty({ estSolide: true });
        // loading player
        this.player = this.physics.add.sprite(this.spawn_x, this.spawn_y, 'perso');
        this.physics.add.collider(this.player, this.calque_obstacles);       
        // chargement du calque calque_lumiere
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset);
        //loading foreground
        this.calque_foreground = this.carteDuNiveau.createLayer("foreground", this.tileset);
        //loading diffuse light
        this.calque_diffuse = this.carteDuNiveau.createLayer("diffuse", this.tileset);

        //loading ugly UI
        this.scoreChoc = this.add.text(820, 16, 'Chocolats: ' + this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreCara = this.add.text(820, 32, 'Caramels: ' + this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreLolli = this.add.text(820, 48, 'Berlingots: ' + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, 'HP: ' + this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreMap = this.add.text(500, 32, 'Shop', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 30 * 32, 60 * 32);
        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);

        this.porteMap = this.physics.add.staticGroup();
        this.porte_map = this.carteDuNiveau.getObjectLayer("porte_boutique");
        this.porte_map.objects.forEach(porte_map => {
            const doorSpawn = this.porteMap.create(porte_map.x + 16, porte_map.y + 16, "door");
        });
        this.physics.add.overlap(this.player, this.porteMap, this.openDoor, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
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
    openDoor(player, door) {
        this.spawn = "shop";
        console.log("going to map");
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp,
            spawn: this.spawn
        })
    }
}
