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
        this.player_max_hp = data.max_hp;
        this.player_can_bait = data.bait;
        this.player_can_trap = data.trap;
        this.quest1done = data.q1;
        this.quest2done = data.q2;
        this.quest3done = data.q3;
        this.cameras.main.fadeIn(600, 255, 255, 255); // durée du degradé, puis valeur RVB
    }

    preload() {
    }

    create() {
        this.spawn_x = 15 * 32;
        this.spawn_y = 58 * 32;
        if (this.spawn == "intro") {
            this.spawn_x = 2 * 32;
            this.spawn_y = 22 * 32;
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
        //load npcs
        this.npc = this.physics.add.staticGroup();
        this.npc_spawn = this.carteDuNiveau.getObjectLayer("npc");
        this.npc_spawn.objects.forEach(npc_spawn => {
            const npcspawn = this.npc.create(npc_spawn.x + 16, npc_spawn.y + 16, "npc");
        });
        this.physics.add.overlap(this.player, this.calque_obstacles);
        //load npc dialogs

        this.npc1 = this.physics.add.sprite(4 * 32 + 16, 20 * 32 + 16, 'door');
        this.physics.add.overlap(this.player, this.npc1, this.quest1, null, this);

        this.npc2 = this.physics.add.sprite(14 * 32 + 16, 20 * 32 + 16, 'door');
        this.physics.add.overlap(this.player, this.npc2, this.quest2, null, this);

        this.npc3 = this.physics.add.sprite(22 * 32 + 16, 20 * 32 + 16, 'door');
        this.physics.add.overlap(this.player, this.npc3, this.quest3, null, this);

        // chargement du calque calque_lumiere
        this.calque_lumieres = this.carteDuNiveau.createLayer("lights", this.tileset);
        //loading foreground
        this.calque_foreground = this.carteDuNiveau.createLayer("foreground", this.tileset);
        //loading diffuse light
        this.calque_diffuse = this.carteDuNiveau.createLayer("diffuse", this.tileset);

        //loading UI
        this.add.image(1024 / 2, 80 / 2, "ui").setScrollFactor(0);

        this.scoreCara = this.add.text(820, 12, "G : "+this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900,16, "resource_caramel").setScrollFactor(0);
        this.scoreChoc = this.add.text(820, 38, "H : "+this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900,40, "resource_chocolate").setScrollFactor(0);
        this.scoreLolli = this.add.text(820, 64,"    "+ this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.add.image(900,62, "resource_lollipop").setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.toughts = this.add.text(200, 32, "Shop", { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

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
        this.time.delayedCall(5000, this.clearThoughts, [], this)
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

        if (this.quest1done && this.quest2done && this.quest3done) {
            this.victory();
        }
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

    openDoor(player, door) {
        this.spawn = "shop";
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.time.delayedCall(1400, this.scene.start("sceneMap", {
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
        }), [], this)

    }

    quest1() {
        if (this.quest1done == false) {
            if (this.resource_caramel >= 5) {
                this.resource_caramel -= 5
                this.scoreCara.setText(this.resource_caramel)
                this.quest1done = true;
                this.toughts.setText("Here is a trap to catch some chocolates");
                this.player_can_trap = true;
            } else {
                this.toughts.setText("I would like 5 caramel please");
            }
        } else {
            this.time.delayedCall(1, this.toughts.setText("Thanks for the caramel!"), [], this);

        }
        this.time.delayedCall(1000, this.clearThoughts, [], this)
    }

    quest2() {
        if (this.quest2done == false) {
            if (this.resource_chocolat >= 5) {
                this.resource_chocolat -= 5
                this.scoreChoc.setText(this.resource_chocolat)
                this.quest2done = true;
                this.toughts.setText("Here is a bait to lure some lollipops");
                this.player_can_bait = true;
            } else {
                this.toughts.setText("I would like 5 chocolate please");
            }
        } else {
            this.time.delayedCall(1, this.toughts.setText("Thanks for the chocolate!"), [], this)
        }
        this.time.delayedCall(1000, this.clearThoughts, [], this)
    }

    quest3() {
        if (this.quest3done == false) {
            if (this.resource_berlingot >= 5) {
                this.resource_berlingot -= 5;
                this.scoreLolli.setText(this.resource_berlingot)
                this.quest3done = true;
                this.player_can_trap = true;
            } else
                this.toughts.setText("I would like 5 lollipops please");
        } else {
            
        this.time.delayedCall(1, this.toughts.setText("Thank you!"), [], this);
        }
        this.time.delayedCall(1000, this.clearThoughts, [], this)

    }

    clearThoughts() {
        this.toughts.setText("");

    }

    victory() {
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        this.time.delayedCall(1400, this.scene.start("sceneFinal", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp
        }), [], this)
    }
}