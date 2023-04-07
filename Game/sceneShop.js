class sceneShop extends Phaser.Scene {
    constructor() {
        super("sceneShop");        
        this.quest1done = false;
        this.quest2done = false;
        this.quest3done = false;
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

    preload() {
    }

    create() {
        this.resource_berlingot = 10
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
        //load npcs
        this.npc = this.physics.add.staticGroup();
        this.npc_spawn = this.carteDuNiveau.getObjectLayer("npc");
        this.npc_spawn.objects.forEach(npc_spawn => {
            const npcspawn = this.npc.create(npc_spawn.x + 16, npc_spawn.y + 16, "door");
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

        //loading ugly UI, l'écriture sera remplacée par des images
        this.scoreChoc = this.add.text(820, 16, 'Chocolats: ' + this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreCara = this.add.text(820, 32, 'Caramels: ' + this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.dialog = this.add.text(1024 / 2, 720 / 2 + 200, " ", { fontSize: '16px', fill: '#FFF', align: 'center' }).setScrollFactor(0);

        this.add.image(780, 48, "resource_lollipop");
        this.scoreLolli = this.add.text(820, 48, this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
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

    quest1() {
        if (this.quest1done == false) {
            if (this.resource_caramel >= 5) {
                this.resource_caramel -= 5
                this.scoreCara.setText(this.resource_caramel)
                this.quest1done = true;
                this.dialog.setText("Here is a trap to catch some chocolates");
                this.player_can_trap = true;
            } else {
                this.dialog.setText("I would like 5 caramel please");
            }
        }
        this.time.delayedCall(1, this.clearThoughts, [], this)
    }

    quest2() {
        if (this.quest2done == false) {
            if (this.resource_chocolat >= 5) {
                this.resource_chocolat -= 5
                this.scoreChoc.setText(this.resource_chocolat)
                this.quest2done = true;
                this.dialog.setText("Here is a bait to lure some lollipops");
                this.player_can_bait = true;
            } else {
                this.dialog.setText("I would like 5 chocolate please");
            }
        }
        this.time.delayedCall(1, this.clearThoughts, [], this)
    }

    quest3() {
        if (this.quest3done == false) {
            if (this.resource_berlingot >= 5) {
                this.resource_berlingot -= 5;
                this.scoreLolli.setText(this.resource_berlingot)
                this.quest3done = true;
                this.player_can_trap = true;
            } else
                this.dialog.setText("I would like 5 lollipops please");
        } else {
            this.dialog.setText("Thank you! This is the end of the game, you can freely roam without fear of client satisfaction now!");
        }
        this.time.delayedCall(1, this.clearThoughts, [], this)

    }

    clearThoughts() {
        this.dialog.setText("");

    }

}