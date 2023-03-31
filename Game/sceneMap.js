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
    }

    preload() { }


    create() {

        /* 
            this.controller = false;
            this.player_block = false;
            this.player_beHit = false;
            this.clignotement = 0;
            this.trigger_cleanSword = false;
            this.trigger_shoot = false;
            this.player_facing = "up";
            
            //Création Attaque
            this.attaque_sword = this.physics.add.staticGroup();
            this.proj_Bow = this.physics.add.group();
    
            //Création Mbob
            this.mob = this.physics.add.group();
            this.anims.create({
                key: 'left_mob',
                frames: [{ key: 'mob', frame: 3 }],
                frameRate: 20
            });
            this.anims.create({
                key: 'up_mob',
                frames: [{ key: 'mob', frame: 0 }],
                frameRate: 20
            });
            this.anims.create({
                key: 'down_mob',
                frames: [{ key: 'mob', frame: 2 }],
                frameRate: 20
            });
            this.anims.create({
                key: 'right_mob',
                frames: [{ key: 'mob', frame: 1 }],
                frameRate: 20
            });
    
            //Load Tiled
            this.cartePlain = this.add.tilemap("rockPlain");
            this.tileset = this.cartePlain.addTilesetImage(
                "Tileset_PlaceHolder",
                "Phaser_tuilesdejeu"
            );
    
            //Load Calque
            //Mur
            this.bordure = this.cartePlain.createLayer(
                "Bordure",
                this.tileset
            );
    
            this.river = this.cartePlain.createLayer(
                "River",
                this.tileset
            );
    
            //Placement Ennemi
            this.calque_mob = this.cartePlain.getObjectLayer('Ennemi');
            this.calque_mob.objects.forEach(calque_mob => {
                this.mob_create = this.physics.add.sprite(calque_mob.x + 16, calque_mob.y + 16, 'mob');
                this.mob_create.anims.play('down_mob');
                this.mob.add(this.mob_create)
            });
            this.mob.setVelocityY(100);
    
            //Placement Monnaie et Soin
            this.heal = this.physics.add.group();
            this.calque_TestHeal = this.cartePlain.getObjectLayer('TestSoin');
            this.calque_TestHeal.objects.forEach(calque_TestHeal => {
                const POHeal = this.heal.create(calque_TestHeal.x + 16, calque_TestHeal.y + 16, "Soin");
            });
    
            this.money = this.physics.add.group();
            this.calque_TestMoney = this.cartePlain.getObjectLayer('TestMoney');
            this.calque_TestMoney.objects.forEach(calque_TestMoney => {
                const POHeal = this.money.create(calque_TestMoney.x + 16, calque_TestMoney.y + 16, "Monnaie");
            });
    
            //Placement Environnement
            this.rock = this.physics.add.staticGroup();
            this.calque_Rock = this.cartePlain.getObjectLayer('Rock');
            this.calque_Rock.objects.forEach(calque_Rock => {
                const PORock = this.rock.create(calque_Rock.x + 16, calque_Rock.y + 16, "Rock");
            });
    
            this.rock_2 = this.physics.add.group();
            this.calque_Rock_2 = this.cartePlain.getObjectLayer('Rock_2');
            this.calque_Rock_2.objects.forEach(calque_Rock_2 => {
                const PORock = this.rock_2.create(calque_Rock_2.x + 16, calque_Rock_2.y + 16, "Rock_2").setImmovable(true);
            });
    
            //Bordure Mob
            this.calque_mob_switch_right = this.cartePlain.createLayer(
                "Ennemi_Switch_Right",
                this.tileset
            );
    
            this.calque_mob_switch_left = this.cartePlain.createLayer(
                "Ennemi_Switch_Left",
                this.tileset
            );
    
            this.calque_mob_switch_up = this.cartePlain.createLayer(
                "Ennemi_Switch_Up",
                this.tileset
            );
    
            this.calque_mob_switch_down = this.cartePlain.createLayer(
                "Ennemi_Switch_Down",
                this.tileset
            );
    
            this.calque_mob_switch_down.setVisible(false);
            this.calque_mob_switch_up.setVisible(false);
            this.calque_mob_switch_right.setVisible(false);
            this.calque_mob_switch_left.setVisible(false); 
            */








        this.cameraZoom = 0.5;
        this.thoughts = " ";
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
        this.porteShop = this.physics.add.group({ key: 'door' });
        this.porte_boutique = this.carteDuNiveau.getObjectLayer("porte_boutique");
        this.porte_boutique.objects.forEach(porte_boutique => {
            this.doorSpawn = this.porteShop.create(porte_boutique.x + 16, porte_boutique.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteShop, this.player, this.toShop, null, this);
        //load choc doors
        this.porteChoc = this.physics.add.group({ key: 'door' });
        this.porte_chocolat = this.carteDuNiveau.getObjectLayer("porte_chocolat");
        this.porte_chocolat.objects.forEach(porte_chocolat => {
            this.doorSpawn = this.porteChoc.create(porte_chocolat.x + 16, porte_chocolat.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteChoc, this.player, this.toChoc, null, this);
        //load caramel doors
        this.porteCara = this.physics.add.group({ key: 'door' });
        this.porte_caramel = this.carteDuNiveau.getObjectLayer("porte_caramel");
        this.porte_caramel.objects.forEach(porte_caramel => {
            this.doorSpawn = this.porteCara.create(porte_caramel.x + 16, porte_caramel.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteCara, this.player, this.toCara, null, this);
        //load lollipop doors
        this.porteLolli = this.physics.add.group({ key: 'door' });
        this.porte_lollipop = this.carteDuNiveau.getObjectLayer("porte_lollipop");
        this.porte_lollipop.objects.forEach(porte_lollipop => {
            this.doorSpawn = this.porteLolli.create(porte_lollipop.x + 16, porte_lollipop.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteLolli, this.player, this.toLolli, null, this);
        //load blocked doors
        this.porteBlocked = this.physics.add.group({ key: 'door' });
        this.porte_blocked = this.carteDuNiveau.getObjectLayer("porte_bloquee");
        this.porte_blocked.objects.forEach(porte_blocked => {
            this.doorSpawn = this.porteBlocked.create(porte_blocked.x + 16, porte_blocked.y + 16, "door").body.setAllowGravity(false);
        });
        this.physics.add.overlap(this.porteBlocked, this.player, this.pathBlocked, null, this)
        //loading ugly UI
        this.scoreChoc = this.add.text(820, 16, 'Chocolats: ' + this.resource_chocolat, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreCara = this.add.text(820, 32, 'Caramels: ' + this.resource_caramel, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreLolli = this.add.text(820, 48, 'Berlingots: ' + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, 'HP: ' + this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreMap = this.add.text(500, 32, 'World Map', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreThoughts = this.add.text(16, 64, this.thoughts, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(-80 * 32, 0, 111 * 32 * 2, 207 * 32);
        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(this.cameraZoom);
        this.cursors = this.input.keyboard.createCursorKeys();






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
        this.scene.start("sceneShop", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }

    toChoc() {
        this.spawn = "map";
        this.scene.start("sceneChocolate", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            hp: this.player_hp,
            spawn: this.spawn
        })

    }
    toCara() {
        this.spawn = "map";
        this.scene.start("sceneCaramel", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }
    toLolli() {
        this.spawn = "map";
        this.scene.start("sceneLollipop", {
            choc: this.resource_chocolat,
            cara: this.resource_caramel,
            berlin: this.resource_berlingot,
            spawn: this.spawn
        })

    }
}