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
        this.player_max_hp = data.max_hp;
        this.player_can_bait = data.bait;
        this.player_can_trap = data.trap;
        this.cameras.main.fadeIn(600, 255, 255, 255); // durée du degradé, puis valeur RVB
    }

    preload() { }

    create() {
        this.spawn_x = -14 * 32;
        this.spawn_y = -36 * 32;
        this.visionrangeLollipop = 400;
        this.i_frame = false;
        this.baitIsLayed = false;
        this.trapIsLayed = false;
        this.isTrapped = false;
        this.player_can_move = true;
        this.thoughts = "The Lollipop Factory";
        //hide code to only show vars
        if (true) {
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
            this.add.image(1024 / 2, 80 / 2, "ui").setScrollFactor(0);
            this.scoreChoc = this.add.text(820, 16, this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
            this.scoreCara = this.add.text(820, 32, this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
            this.scoreLolli = this.add.text(820, 48, this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
            this.scoreMap = this.add.text(1024 / 2 - 220, 32, this.thoughts, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

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
                if (this.isTrapped == true) {
                    this.modeTrapped(lollipopSpawn);
                }

            });
            //lollipop interaction
            this.physics.add.overlap(this.player, this.monsterLollipop, this.damagePlayer, null, this);
            this.physics.add.collider(this.monsterLollipop, this.calque_obstacles);
            this.physics.add.collider(this.monsterLollipop, this.calque_obstacles_monsters);

            //Création Attaque
            this.attaque_sword = this.physics.add.staticGroup();
            this.physics.add.overlap(this.attaque_sword, this.calque_terrain, this.clean_attaque, null, this);
            this.physics.add.overlap(this.monsterLollipop, this.attaque_sword, this.killLollipop, null, this);

            //Création bait
            if (this.player_can_bait == true) {
                this.scoreBait = this.add.text(820,32, 'C', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
                this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
                this.ground_bait = this.physics.add.staticGroup();
            }

            //Création trap
            if (this.player_can_trap == true) {
                this.scoreTrap = this.add.text(820, 16, 'G', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
                this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
                this.ground_trap = this.physics.add.staticGroup();
                this.physics.add.overlap(this.monsterLollipop, this.ground_trap, this.modeTrapped, null, this);
            }
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }
    update() {
        //check if player is stunned in order to act
        if (this.player_can_move) {
            //ajouter pose de pièges G
            if (this.keyG && (this.trapIsLayed == false)) {
                this.ground_bait.create(this.player.x, this.player.y, "trap");
                this.trapIsLayed = true;
                this.time.delayedCall(5000, this.delayTrap, [], this)
            }
            //ajouter pose d'appats C
            if (this.keyC && (this.baitIsLayed == false)) {
                this.ground_bait.create(this.player.x, this.player.y, "bait");
                this.baitIsLayed = true;
                this.time.delayedCall(5000, this.delayBait, [], this)
            }
            //movements
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-360);
                this.player_facing = "left";
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(360);
                this.player_facing = "right";
            }
            else { this.player.setVelocityX(0); }

            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-360);
                this.player_facing = "up";
            }
            else if (this.cursors.down.isDown) {
                this.player.setVelocityY(360);
                this.player_facing = "down";
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
        } else { this.player.setVelocityY(0); this.player.setVelocityX(0); }
        //si détection joueur (d<x), passer au mode fuite   
        this.checkDistance(this.player, this.monsterLollipop);
    }

    checkDistance(player, monsterLollipop) {
        monsterLollipop.children.each(function (monsterLollipop) {
            this.monsterMaxSpeed = 400;
            if (Phaser.Math.Distance.Between(player.x, player.y, monsterLollipop.x, monsterLollipop.y) < 100) {
                if (player.x >= monsterLollipop.x) {
                    monsterLollipop.setVelocityX(-this.monsterMaxSpeed);
                } else {
                    monsterLollipop.setVelocityX(this.monsterMaxSpeed);
                }
                if (player.y >= monsterLollipop.y) {
                    monsterLollipop.setVelocityY(-this.monsterMaxSpeed);
                } else {
                    monsterLollipop.setVelocityY(this.monsterMaxSpeed);
                }
            } else if (Phaser.Math.Distance.Between(player.x, player.y, monsterLollipop.x, monsterLollipop.y) < 200) {
                if (player.x >= monsterLollipop.x) {
                    monsterLollipop.setVelocityX(-this.monsterMaxSpeed / 2);
                } else {
                    monsterLollipop.setVelocityX(this.monsterMaxSpeed / 2);
                }
                if (player.y >= monsterLollipop.y) {
                    monsterLollipop.setVelocityY(-this.monsterMaxSpeed / 2);
                } else {
                    monsterLollipop.setVelocityY(this.monsterMaxSpeed / 2);
                }
            }
        }, this)
    }


    openDoor() {
        this.spawn = "lollipop";
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
    damagePlayer() {
        //stuns player
        if (this.i_frame == false) {
            this.player_can_move = false
            this.i_frame = true;
            this.player.setTint(0xff0000);
            this.time.delayedCall(1000, this.invicibilityFrame, [], this)
            this.rngPos = Math.random();
            this.rngNeg = Math.random();
            if (this.rngNeg < 0.5) {
                this.rngNeg = -1;
            } else {
                this.rngNeg = 1
            }
            this.player.setPosition(this.player.x + this.rngPos * 32 * this.rngNeg, this.player.y + this.rngPos * 32 * this.rngNeg)
        }
    }

    invicibilityFrame() {
        this.player.clearTint();
        this.i_frame = false;
        this.player_can_move = true;
    }

    killLollipop(monsterLollipop) {
        this.rng = Math.random();
        this.rng = Math.random();
        if (this.rng <= 0.2) { this.createLollipopResource(monsterLollipop.x - 10, monsterLollipop.y - 10); }
        monsterLollipop.destroy();
    }

    createLollipopResource(x, y) {
        this.resourceMap.create(x, y, 'resource_lollipop')
    }

    obtainLollipopRessource(player, resource) {
        this.resource_berlingot += 1;
        resource.destroy();
        this.scoreLolli.setText(this.resource_berlingot);
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

    //Les lollipops doivent fuir trop vite pour le joueur, 
    //il faut les attraper à l'aide de pièges, en les poussant dedans et/ou en y mettant des appats
    //Pas fonctionnel

    delayTrap() {
        this.trapIsLayed = false;
    }
    delayBait() {
        this.baitIsLayed = false;
    }

    modeBait() {
        //si un appat est dans la zone, le monstre avance vers l'appat, chec la distance comme pour le joueur
    }

    modeTrapped(monsterLollipop) {
        console.log("trapped");
        monsterLollipop.setVelocityX(0);
        monsterLollipop.setVelocityY(0);
        //si un monstre marche sur un piège, il est immobilisé, désactiver le déplacement de l'objet
    }

}