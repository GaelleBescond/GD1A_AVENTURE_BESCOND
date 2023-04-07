class sceneChocolate extends Phaser.Scene {
    constructor() {
        super("sceneChocolate");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.player_hp = data.hp;
        this.spawn = data.spawn;
        this.player_max_hp = data.max_hp;
        this.player_can_bait = data.bait;
        this.player_can_trap = data.trap;
        this.cameras.main.fadeIn(600, 255, 255, 255); // durée du degradé, puis valeur RVB
    }

    preload() { }

    create() {
        this.spawn_x = 2 * 32;
        this.spawn_y = -107 * 32;
        this.visionrangeChocolate = 400;
        this.i_frame = false;
        this.baitIsLayed = false;
        this.trapIsLayed = false;
        this.isTrapped = false;
        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("Choco");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Choco", "Phaser_tuilesdejeu5");

        // chargement du calque calque_terrain
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset);
        // chargement du calque calque_obstacles_monsters


        // chargement du calque calque_obstacles
        this.calque_obstacles = this.carteDuNiveau.createLayer("obstacles", this.tileset);
        this.calque_obstacles.setCollisionByProperty({ estSolide: true });
        //loading player
        this.player = this.physics.add.sprite(this.spawn_x, this.spawn_y, 'perso');
        // chargement du calque calque_lumiere
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset);
        this.physics.add.collider(this.player, this.calque_obstacles);

        //loading ugly UI
        this.scoreChoc = this.add.text(820, 16, 'Chocolats: ' + this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreCara = this.add.text(820, 32, 'Caramels: ' + this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreLolli = this.add.text(820, 48, 'Berlingots: ' + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, 'HP: ' + this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreMap = this.add.text(500, 32, 'Chocolate factory', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);

        //spawn doors
        this.porteMap = this.physics.add.staticGroup();
        this.porte_map = this.carteDuNiveau.getObjectLayer("porte");
        this.porte_map.objects.forEach(porte_map => {
            const doorSpawn = this.porteMap.create(porte_map.x + 16, porte_map.y + 16, "door");
        });
        this.physics.add.overlap(this.player, this.porteMap, this.openDoor, null, this);

        //spawn resources
        this.resourceMap = this.physics.add.staticGroup();
        this.resource_map = this.carteDuNiveau.getObjectLayer("ground_collectibles");
        this.resource_map.objects.forEach(resource_map => {
            const resourceSpawn = this.resourceMap.create(resource_map.x + 16, resource_map.y + 16, "resource_lollipop");
        });
        this.physics.add.overlap(this.player, this.resourceMap, this.obtainLollipopRessource, null, this);

        //spawn chocolate
        this.monsterChocolate = this.physics.add.group();
        this.monster_chocolate = this.carteDuNiveau.getObjectLayer("spawn_monsters");
        this.monster_chocolate.objects.forEach(monster_chocolate => {
            const chocolateSpawn = this.monsterChocolate.create(monster_chocolate.x + 16, monster_chocolate.y + 16, "monster_lollipop").body.setBounce(1);
            this.idleMood(chocolateSpawn);

        });

        this.physics.add.collider(this.monsterChocolate, this.calque_obstacles);
        this.physics.add.collider(this.monsterChocolate, this.calque_obstacles_monsters);

        this.cursors = this.input.keyboard.createCursorKeys();
        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();
        this.physics.add.overlap(this.attaque_sword, this.calque_terrain, this.clean_attaque, null, this);
        this.physics.add.overlap(this.monsterLollipop, this.attaque_sword, this.killLollipop, null, this);

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

        //Attaque
        if (this.cursors.space.isDown) {
            if (this.player_facing == "up") {
                this.attaque_sword.create(this.player.x, this.player.y - 32, "sword_up");
            }
            else if (this.player_facing == "down") {
                this.attaque_sword.create(this.player.x, this.player.y + 32, "sword_down");
            }
            else if (this.player_facing == "right") {
                this.attaque_sword.create(this.player.x + 32, this.player.y, "sword_right");
            }
            else if (this.player_facing == "left") {
                this.attaque_sword.create(this.player.x - 32, this.player.y, "sword_left");
            }
            this.player_block = true;
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
    }
    openDoor(player, door) {
        this.spawn = "chocolate";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp,
            spawn: this.spawn,
            max_hp: this.player_max_hp,
            trap: this.player_can_trap,
            bait: this.player_can_bait
        })
    }
}
