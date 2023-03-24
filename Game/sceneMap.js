class sceneMap extends Phaser.Scene {
    constructor() {
        super("sceneMap");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.spawn = data.spawn;
    }

    preload() {    }

    create() {
        //player spawn depending on the previous scene
        if (this.spawn == "shop") {
            console.log("shop")
            this.spawn_x = 460;
            this.spawn_y = 1960;
        } else if (this.spawn == "chocolate") {
            this.spawn_x = -2015;
            this.spawn_y = 350;
        } else if (this.spawn == "caramel") {
            this.spawn_x = 1810;
            this.spawn_y = 2210;
        } else if (this.spawn == "lollipop") {
            this.spawn_x = -540;
            this.spawn_y = 4870;
        }

        this.carteDuNiveau = this.add.tilemap("map"); //load tilemap
        this.tileset = this.carteDuNiveau.addTilesetImage("Map", "Phaser_tuilesdejeu"); //load tileset
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset); //load ground calc
        this.calque_obstacles = this.carteDuNiveau.createLayer("obstacles_batiments", this.tileset); //load obstacles calc
        //this.calque_obstacles.setCollisionByProperty({ estSolide: true }); //enable collision for obstacles
        this.player = this.physics.add.sprite(this.spawn_x, this.spawn_y, 'perso'); //load player
        this.physics.add.collider(this.player, this.calque_obstacles); //allow collision between player and obstales
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset); //load light calc for ambience
        //load shop doors
        this.porteShop = this.physics.add.group({ key: 'star' });
        this.porte_boutique = this.carteDuNiveau.getObjectLayer("porte_boutique");
        this.porte_boutique.objects.forEach(porte_boutique => {
            this.doorSpawn = this.porteShop.create(porte_boutique.x + 16, porte_boutique.y + 16, "star").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteShop, this.player, this.toShop, null, this);
        //load choc doors
        this.porteChoc = this.physics.add.group({ key: 'star' });
        this.porte_chocolat = this.carteDuNiveau.getObjectLayer("porte_chocolat");
        this.porte_chocolat.objects.forEach(porte_chocolat => {
            this.doorSpawn = this.porteChoc.create(porte_chocolat.x + 16, porte_chocolat.y + 16, "star").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteChoc, this.player, this.toChoc, null, this);
        //load caramel doors
        this.porteCara = this.physics.add.group({ key: 'star' });
        this.porte_caramel = this.carteDuNiveau.getObjectLayer("porte_caramel");
        this.porte_caramel.objects.forEach(porte_caramel => {
            this.doorSpawn = this.porteCara.create(porte_caramel.x + 16, porte_caramel.y + 16, "star").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteCara, this.player, this.toCara, null, this);
        //load lollipop doors
        this.porteLolli = this.physics.add.group({ key: 'star' });
        this.porte_lollipop = this.carteDuNiveau.getObjectLayer("porte_lollipop");
        this.porte_lollipop.objects.forEach(porte_lollipop => {
            this.doorSpawn = this.porteLolli.create(porte_lollipop.x + 16, porte_lollipop.y + 16, "star").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteLolli, this.player, this.toLolli, null, this);


        this.scoreText = this.add.text(16, 64, 'World Map', { fontSize: '32px', fill: '#FFF' });

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5);

    }
    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-660);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(660);
        }
        else { this.player.setVelocityX(0); }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-660);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(660);
        }
        else { this.player.setVelocityY(0); }
    }

    toShop(porteShop, player) {
        this.spawn = "map";
        this.scene.start("sceneShop", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }

    toChoc(porteChoc, player) {
        this.spawn = "map";
        this.scene.start("sceneChocolate", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }
    toCara(porteCara, player) {
        this.spawn = "map";
        this.scene.start("sceneCaramel", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }
    toLolli(porteLolli, player) {
        this.spawn = "map";
        this.scene.start("sceneLollipop", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }
}