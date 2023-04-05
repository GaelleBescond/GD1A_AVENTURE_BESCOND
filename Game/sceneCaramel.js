class sceneCaramel extends Phaser.Scene {
    constructor() {
        super("sceneCaramel");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.player_hp = data.hp;
        this.spawn = data.spawn;
        this.player_max_hp = data.max_hp;
        this.cameras.main.fadeIn(600, 255, 255, 255); // durée du degradé, puis valeur RVB
    }

    preload() { }

    create() {

        this.spawn_x = 16 * 32;
        this.spawn_y = 3 * 32;
        this.visionrangeCaramel = 400;
        this.directionX = 400;
        this.directionY = 400;
        this.i_frame = false;

        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("Cara");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Cara", "Phaser_tuilesdejeu4");

        // chargement du calque calque_terrain
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset);
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
        this.scoreLolli = this.add.text(820, 48, 'Lollipops: ' + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, 'HP: ' + this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreMap = this.add.text(1024 / 2 - 20, 32, 'Caramel factory', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);


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

        //spawn caramels
        this.monsterCaramel = this.physics.add.group();
        this.monster_caramel = this.carteDuNiveau.getObjectLayer("spawn_monsters");
        this.monster_caramel.objects.forEach(monster_caramel => {
            const lollipopSpawn = this.monsterCaramel.create(monster_caramel.x + 16, monster_caramel.y + 16, "monster_lollipop").body.setBounce(1);
            this.idleMood(lollipopSpawn);

        });

        //Prepare heart drops from lollipops
        this.heart = this.physics.add.group();
        this.physics.add.overlap(this.player, this.heart, this.obtainHP, null, this);

        this.physics.add.collider(this.monsterCaramel, this.calque_obstacles);
        this.physics.add.collider(this.monsterCaramel, this.calque_obstacles_monsters);


        //Damage player
        this.physics.add.overlap(this.player, this.monsterCaramel, this.damagePlayer, null, this);


        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();
        this.physics.add.overlap(this.attaque_sword, this.calque_terrain, this.clean_attaque, null, this);
        this.physics.add.overlap(this.monsterCaramel, this.attaque_sword, this.killLollipop, null, this);


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
        this.spawn = "caramel";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp,
            spawn: this.spawn,
            max_hp: this.player_max_hp
        })
    }

    damagePlayer() {
        if (this.i_frame == false) {
            this.player_hp -= 1;
            this.scoreHp.setText('Health: ' + this.player_hp);
            this.i_frame = true;
            this.player.setTint(0xff0000);
            this.time.delayedCall(1000, this.invicibilityFrame, [], this)
        }
    }

    invicibilityFrame() {
        this.player.clearTint();
        this.i_frame = false;
    }

    killLollipop(monsterLollipop) {
        console.log("truc")
        this.rng = Math.random();
        if (this.rng <= 0.2) {
            this.dropHP(monsterLollipop.x, monsterLollipop.y);
        }
        this.rng = Math.random();
        if (this.rng <= 0.2) {
            this.createLollipopResource(monsterLollipop.x - 10, monsterLollipop.y - 10);
        }
        //math random => entre 0 et 1
        //this.truc = Math.floor(Math.random()* (max-min)+min)
        monsterLollipop.destroy();
    }

    dropHP(x, y) {
        this.heart.create(x, y, 'hp')
    }
    obtainHP(player, hp) {
        this.player_hp += 1;
        hp.destroy();
        if (this.player_hp > this.player_max_hp) {
            this.player_hp = this.player_max_hp;
        }
        this.scoreHp.setText('Health: ' + this.player_hp);
    }

    createLollipopResource(x, y) {
        this.heart.create(x, y, 'resource_lollipop')
    }

    obtainLollipopRessource(player, resource) {
        this.resource_berlingot += 1;
        resource.destroy();
        this.scoreLolli.setText('Lollipops: ' + this.resource_berlingot);
    }


    idleMood(monsterLollipop) {
        this.negative = Math.random();
        this.max = 50;
        this.min = 100;
        if (this.negative < 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.directionX = Math.floor((Math.random() * (this.max - this.min) + this.min)) * this.negative;
        monsterLollipop.setVelocityX(this.directionX);

        this.negative = Math.random();
        if (this.negative < 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.directionY = Math.floor((Math.random() * (this.max - this.min) + this.min)) * this.negative;
        monsterLollipop.setVelocityY(this.directionY);

    }

    clean_attaque(attaque) {
        this.time.delayedCall(50, (attaque) => { attaque.destroy() }, [attaque], this);
    }


}
