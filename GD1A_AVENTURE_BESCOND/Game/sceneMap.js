class sceneMap extends Phaser.Scene {
    constructor() {
        super("sceneMap");
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
        this.cameraZoom = 1;
        this.thoughts = "The Candy Resort";
        //player spawn depending on the previous scene
        if (this.spawn == "shop") {
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
        this.tileset = this.carteDuNiveau.addTilesetImage("Map", "Phaser_tuilesdejeu2"); //load tileset
        this.calque_terrain = this.carteDuNiveau.createLayer("ground", this.tileset); //load ground calc
        this.calque_obstacles = this.carteDuNiveau.createLayer("obstacles_batiments", this.tileset); //load obstacles calc
        this.calque_obstacles.setCollisionByProperty({ estSolide: true }); //enable collision for obstacles
        this.player = this.physics.add.sprite(this.spawn_x, this.spawn_y, 'perso'); //load player
        this.physics.add.collider(this.player, this.calque_obstacles); //allow collision between player and obstales
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset); //load light calc for ambience
        //load shop doors
        this.porteShop = this.physics.add.staticGroup();
        this.porte_boutique = this.carteDuNiveau.getObjectLayer("porte_boutique");
        this.porte_boutique.objects.forEach(porte_boutique => {
            this.doorSpawn = this.porteShop.create(porte_boutique.x + 16, porte_boutique.y + 16, "door");
        });
        this.physics.add.overlap(this.porteShop, this.player, this.toShop, null, this);
        //load choc doors
        this.porteChoc = this.physics.add.staticGroup();
        this.porte_chocolat = this.carteDuNiveau.getObjectLayer("porte_chocolat");
        this.porte_chocolat.objects.forEach(porte_chocolat => {
            this.doorSpawn = this.porteChoc.create(porte_chocolat.x + 16, porte_chocolat.y + 16, "door");
        });
        this.physics.add.overlap(this.porteChoc, this.player, this.toChoc, null, this);
        //load caramel doors
        this.porteCara = this.physics.add.staticGroup();
        this.porte_caramel = this.carteDuNiveau.getObjectLayer("porte_caramel");
        this.porte_caramel.objects.forEach(porte_caramel => {
            this.doorSpawn = this.porteCara.create(porte_caramel.x + 16, porte_caramel.y + 16, "door");
        });
        this.physics.add.overlap(this.porteCara, this.player, this.toCara, null, this);
        //load lollipop doors
        this.porteLolli = this.physics.add.staticGroup();
        this.porte_lollipop = this.carteDuNiveau.getObjectLayer("porte_lollipop");
        this.porte_lollipop.objects.forEach(porte_lollipop => {
            this.doorSpawn = this.porteLolli.create(porte_lollipop.x + 16, porte_lollipop.y + 16, "door");
        });
        this.physics.add.overlap(this.porteLolli, this.player, this.toLolli, null, this);
        //load blocked doors
        this.porteBlocked = this.physics.add.staticGroup();
        this.porte_blocked = this.carteDuNiveau.getObjectLayer("porte_bloquee");
        this.porte_blocked.objects.forEach(porte_blocked => {
            this.doorSpawn = this.porteBlocked.create(porte_blocked.x + 16, porte_blocked.y + 16, "door");
        });
        this.physics.add.overlap(this.porteBlocked, this.player, this.pathBlocked, null, this)


        this.npc1 = this.physics.add.sprite(4 * 32 + 16, 20 * 32 + 16, 'npc_worker');
        this.physics.add.overlap(this.player, this.npc1, this.quest1, null, this);

        this.npc2 = this.physics.add.sprite(14 * 32 + 16, 20 * 32 + 16, 'npc_worker');
        this.physics.add.overlap(this.player, this.npc2, this.quest2, null, this);

        this.npc3 = this.physics.add.sprite(22 * 32 + 16, 20 * 32 + 16, 'npc_worker');
        this.physics.add.overlap(this.player, this.npc3, this.quest3, null, this);

        //loading UI
        this.add.image(1024 / 2, 80 / 2, "ui").setScrollFactor(0);

        this.scoreCara = this.add.text(820, 12, "G : " + this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900, 16, "resource_caramel").setScrollFactor(0);
        this.scoreChoc = this.add.text(820, 38, "H : " + this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900, 40, "resource_chocolate").setScrollFactor(0);
        this.scoreLolli = this.add.text(820, 64, "    " + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900, 62, "resource_lollipop").setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreThoughts = this.add.text(200, 32, this.thoughts, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(-80 * 32, 0, 111 * 32 * 2, 207 * 32);
        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(this.cameraZoom);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.time.delayedCall(5000, this.clearThoughts, [], this)
    }
    update() {
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

        this.timer();
    }

    timer() {
        this.player_hp -= 1.5;
        this.scoreHp.setText(Math.floor(this.player_hp / 100));
        if (this.player_hp < 0) {
            this.scene.start("sceneFinal", {
                choc: this.resource_chocolat,
                cara: this.resource_caramel,
                berlin: this.resource_berlingot,
                hp: this.player_hp
            })
        }
    }
    pathBlocked() {
        this.thoughts = "This door is blocked";
        this.scoreThoughts.setText(this.thoughts);
        this.scoreThoughts.visible = true;
        this.time.delayedCall(1, this.clearThoughts, [], this)
    }

    clearThoughts() {
        this.scoreThoughts.visible = false;
    }

    toShop() {
        this.spawn = "map";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneShop", {
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

    toChoc() {
        this.spawn = "map";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneChocolate", {
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
    toCara() {
        this.spawn = "map";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneCaramel", {
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
    toLolli() {
        this.spawn = "map";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.scene.start("sceneLollipop", {
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
}