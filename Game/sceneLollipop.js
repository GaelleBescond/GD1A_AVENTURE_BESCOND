class sceneLollipop extends Phaser.Scene {
    constructor() {
        super("sceneLollipop");
    }

    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.player_hp = data.hp;
        this.spawn = data.spawn;
    }

    preload() { }

    create() {
        this.spawn_x = -14 * 32;
        this.spawn_y = -36 * 32;
        this.visionrangeLollipop = 10;
        this.directionX = 400;
        this.directionY = 400;
        this.trigger_cleanSword = true;
        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("Lolli");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Lolli", "Phaser_tuilesdejeu3");

        // chargement du calque calque_terrain
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset);
        // chargement du calque calque_obstacles_monsters
        this.calque_obstacles_monsters = this.carteDuNiveau.createLayer("obstacles_monsters", this.tileset);
        this.calque_obstacles_monsters.setCollisionByProperty({ estSolide: true });
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
        this.scoreMap = this.add.text(500, 32, 'Lollipop factory', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

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

        //spawn lollipops
        this.monsterLollipop = this.physics.add.group();
        this.monster_lollipop = this.carteDuNiveau.getObjectLayer("spawn_monsters");
        this.monster_lollipop.objects.forEach(monster_lollipop => {
            const lollipopSpawn = this.monsterLollipop.create(monster_lollipop.x + 16, monster_lollipop.y + 16, "monster_lollipop").body.setBounce(1);
            this.idleMood(lollipopSpawn);

        });

        this.physics.add.collider(this.monsterLollipop, this.calque_obstacles);
        this.physics.add.collider(this.monsterLollipop, this.calque_obstacles_monsters);
        this.physics.add.overlap(this.player, this.monsterLollipop, this.damagePlayer, null, this);
        this.physics.add.overlap(this.player, this.monsterLollipop, this.killLollipop, null, this);


        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();
        //Création Collision Attaque
        this.physics.add.overlap(this.attaque_sword, this.bordure, this.clean_attaque, this.if_clean_sword, this);
        this.physics.add.collider(this.monsterLollipop, this.attaque_sword, this.killLollipop, null, this);
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
        if (this.cursors.space.isDown && this.unlock_Sword) {
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
            this.time.delayedCall(500, this.delock_attaque, [], this);
        }

        //comportement monstre, pas fonctionnel
        if (Math.abs(this.checkDistance(this.player.x, this.player.y, this.monsterLollipop.x, this.monsterLollipop.y)) <= this.visionRangeLollipop) {
            this.monsterLollipop.modeFuite();
        }
        // enemy.angle : Math.PI, enemy.fov : Math.PI / 4


    }
    openDoor() {
        this.spawn = "lollipop";
        this.scene.start("sceneMap", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp,
            spawn: this.spawn
        })
    }

    damagePlayer() {
        this.player_hp -= 1;
    }

    killLollipop(player, monsterLollipop) {
        this.rng = Math.random();
        if (this.rng <= 0.2) {
            this.dropHP(monsterLollipop.x, monsterLollipop.y);
        }
        this.rng = Math.random();
        if (this.rng <= 0.2) {
            this.createLollipopResource(monsterLollipop.x - 10, monsterLollipop.y - 10);
        }
        //dropLollipop
        //dropHP;
        //math random => entre 0 et 1
        //this.truc = Math.floor(Math.random()* (max-min)+min)
        monsterLollipop.destroy();

    }

    dropHP(x, y) {
        this.heart = this.physics.add.group(x, y, 'hp');
        this.physics.add.overlap(this.player, this.heart, this.obtainHP, null, this);
    }
    obtainHP(player,hp) {
        this.player_hp += 1;
        this.heart.destroy();
    }

    createLollipopResource(x, y) {

    }

    obtainLollipopRessource(monsterLollipop) {
        this.resource_berlingot += 1;
        monsterLollipop.destroy();
    }


    idleMood(monsterLollipop) {
        this.negative = Math.random();
        this.max = 50;
        this.min = 100;
        this.directionX = Math.floor((Math.random() * (this.max - this.min) + this.min)) * this.negative;
        if (this.negative < 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
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

    checkDistance(x1, y1, x2, y2) { // mesure la distance entre deux éléments
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    checkAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    //Clean Attaque
    clean_attaque(attaque) {
        attaque.disableBody(true, true);
    }
    //Delock pour l'attaque
    delock_attaque() {
        this.trigger_cleanSword = true;
    }
    modefuite() {
        if ((Math.abs(this.player.x - this.monsterLollipop.x)) < 8) { // si monsterLollipop est à peu près au même niveau alors il reste sur l'axe
            this.diagoX = 0
            this.monsterLollipop.setVelocityX(0)
        }

        else if (this.player.x < this.monsterLollipop.x) { // Position horizontale du joueur
            this.diagoX = 1;
            if (this.diagoX + this.diagoY == 1) {
                this.monsterLollipop.setVelocityX(-this.speedmonsterLollipop)
            }
            else {
                this.monsterLollipop.setVelocityX(-this.speedmonsterLollipop * 0.7071)
            }
        }
        else if (this.player.x > this.monsterLollipop.x) {
            this.diagoX = 1;
            if (this.diagoX + this.diagoY == 1) {
                this.monsterLollipop.setVelocityX(this.speedmonsterLollipop)
            }
            else {
                this.monsterLollipop.setVelocityX(this.speedmonsterLollipop * 0.7071)
            }
        }

        if (Math.abs((this.player.y - this.monsterLollipop.y)) < 8) {
            this.diagoY = 0;
            this.monsterLollipop.setVelocityY(0)
        }
        else if (this.player.y < this.monsterLollipop.y) { // Position verticale du joueur
            this.diagoY = 1;
            if (this.diagoX + this.diagoY == 1) {
                this.monsterLollipop.setVelocityY(-this.speedmonsterLollipop)
            }
            else {
                this.monsterLollipop.setVelocityY(-this.speedmonsterLollipop * 0.7071)
            }
        }
        else if (this.player.y > this.monsterLollipop.y) {
            this.diagoY = 1;
            if (this.diagoX + this.diagoY == 1) {
                this.monsterLollipop.setVelocityY(this.speedmonsterLollipop)
            }
            else {
                this.monsterLollipop.setVelocityY(this.speedmonsterLollipop * 0.7071)
            }
        }

    }
}