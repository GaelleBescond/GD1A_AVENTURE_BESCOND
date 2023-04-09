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
        this.quest1done = data.q1;
        this.quest2done = data.q2;
        this.quest3done = data.q3;
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
        this.player_can_move = true;
        this.thoughts = "The Chocolate Unit";
        //hide code to only show vars
        if (true) {
            // chargement de la carte
            this.carteDuNiveau = this.add.tilemap("Choco");
            // chargement du jeu de tuiles
            this.tileset = this.carteDuNiveau.addTilesetImage("Choco", "Phaser_tuilesdejeu5");
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
            this.scoreHp = this.add.text(16, 16, this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
            this.scoreMap = this.add.text(500, 32, this.thoughts, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);


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
                const resourceSpawn = this.resourceMap.create(resource_map.x + 16, resource_map.y + 16, "resource_chocolate");
            });
            this.physics.add.overlap(this.player, this.resourceMap, this.obtainRessource, null, this);

            //spawn chocolate
            this.monsterChocolate = this.physics.add.group();
            this.monster_chocolate = this.carteDuNiveau.getObjectLayer("spawn_monsters");
            this.monster_chocolate.objects.forEach(monster_chocolate => {
                const chocolateSpawn = this.monsterChocolate.create(monster_chocolate.x + 16, monster_chocolate.y + 16, "monster_chocolate").body.setBounce(1);
                this.idleMood(chocolateSpawn);

            });

            //caramel interaction
            this.physics.add.overlap(this.player, this.monsterChocolate, this.damagePlayer, null, this);
            this.physics.add.collider(this.monsterChocolate, this.calque_obstacles);
            this.physics.add.collider(this.monsterChocolate, this.calque_obstacles_monsters);

            //Création Attaque
            this.attaque_sword = this.physics.add.staticGroup();
            this.physics.add.overlap(this.attaque_sword, this.calque_terrain, this.clean_attaque, null, this);
            this.physics.add.overlap(this.monsterChocolate, this.attaque_sword, this.kill, null, this);

            //Création bait
                this.scoreBait = this.add.text(820, 32, 'H', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
                this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
                this.ground_bait = this.physics.add.staticGroup();

            //Création trap
                this.scoreTrap = this.add.text(820, 16, 'G', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
                this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
                this.ground_trap = this.physics.add.staticGroup();
                this.physics.add.overlap(this.monsterChocolate, this.ground_trap, this.modeTrapped, null, this);

            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }
    update() {
        //check if player is stunned in order to act
        if (this.player_can_move) {
              //ajouter pose de pièges G
              if (this.keyG.isDown && (this.trapIsLayed == false) && (this.player_can_trap == true)&& (this.resource_caramel >= 1)) {
                this.resource_caramel -= 1;
                this.ground_bait.create(this.player.x, this.player.y, "trap");
                this.trapIsLayed = true;
                this.time.delayedCall(5000, this.delayTrap, [], this)
            }
            //ajouter pose d'appats H
            if (this.keyH && (this.baitIsLayed == false) && (this.player_can_bait == true)&& (this.resource_chocolat >= 1)) {
                this.resource_chocolat -= 1;
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
        this.checkDistance(this.player, this.monsterChocolate);

        this.timer();
    }

    timer() {
        this.player_hp -= 1.5;
        this.scoreHp.setText(Math.floor(this.player_hp/100));
        if (this.player_hp < 0) {
            this.scene.start("sceneFinal", {
                choc: this.resource_chocolat,
                cara: this.resource_caramel,
                berlin: this.resource_berlingot,
                hp: this.player_hp
            })
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
            bait: this.player_can_bait,
            q1: this.quest1done,
            q2: this.quest2done,
            q3: this.quest3done
        })
    }

    checkDistance(player, monster) {
        monster.children.each(function (monster) {
            this.monsterMaxSpeed = 400;
            if (Phaser.Math.Distance.Between(player.x, player.y, monster.x, monster.y) < 100) {
                if (player.x >= monster.x) {
                    monster.setVelocityX(-this.monsterMaxSpeed / 4);
                } else {
                    monster.setVelocityX(this.monsterMaxSpeed / 4);
                }
                if (player.y >= monster.y) {
                    monster.setVelocityY(-this.monsterMaxSpeed / 4);
                } else {
                    monster.setVelocityY(this.monsterMaxSpeed / 4);
                }
            } else if (Phaser.Math.Distance.Between(player.x, player.y, monster.x, monster.y) < 200) {
                if (player.x >= monster.x) {
                    monster.setVelocityX(-this.monsterMaxSpeed);
                } else {
                    monster.setVelocityX(this.monsterMaxSpeed);
                }
                if (player.y >= monster.y) {
                    monster.setVelocityY(-this.monsterMaxSpeed);
                } else {
                    monster.setVelocityY(this.monsterMaxSpeed);
                }
            }
        }, this)
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

    killMonster(monster) {
        this.rng = Math.random();
        this.rng = Math.random();
        if (this.rng <= 0.2) { this.createLollipopResource(monster.x - 10, monster.y - 10); }
        monster.destroy();
    }

    createLollipopResource(x, y) {
        this.resourceMap.create(x, y, 'resource_chocolate')
    }

    obtainRessource(player, resource) {
        this.resource_chocolate += 1;
        resource.destroy();
        this.scoreChoc.setText(this.resource_chocolate);
    }

    idleMood(monster) {
        this.negative = Math.random();
        this.max = 50;
        this.min = 100;
        if (this.negative < 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.directionX = Math.floor((Math.random() * (this.max - this.min) + this.min)) * this.negative;
        monster.setVelocityX(this.directionX);

        this.negative = Math.random();
        if (this.negative < 0.5) {
            this.negative = 1;
        } else {
            this.negative = -1;
        }
        this.directionY = Math.floor((Math.random() * (this.max - this.min) + this.min)) * this.negative;
        monster.setVelocityY(this.directionY);
    }

    clean_attaque(attaque) {
        this.time.delayedCall(50, (attaque) => { attaque.destroy() }, [attaque], this);
    }

    //Les caramels foncent sur le joueur dès qu'ils le voient
    //il faut les abattre avant qu'il n'atteignent le joueur à l'aide du filet ou de pièges

    delayTrap() {
        this.trapIsLayed = false;
    }
    delayBait() {
        this.baitIsLayed = false;
    }

    modeBait() {
        //si un appat est dans la zone, le monstre avance vers l'appat, chec la distance comme pour le joueur
    }

    modeTrapped(monster) {
        console.log("trapped");
        monster.setVelocityX(0);
        monster.setVelocityY(0);
        //si un monstre marche sur un piège, il est immobilisé, désactiver le déplacement de l'objet
    }

}
