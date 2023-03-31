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

        // chargement de la carte
        this.carteDuNiveau = this.add.tilemap("Lolli");
        // chargement du jeu de tuiles
        this.tileset = this.carteDuNiveau.addTilesetImage("Lolli", "Phaser_tuilesdejeu3");

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
        this.scoreLolli = this.add.text(820, 48, 'Berlingots: ' + this.resource_berlingot, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreHp = this.add.text(16, 16, 'HP: ' + this.player_hp, { fontSize: '16px', fill: '#FFF' }).setScrollFactor(0);
        this.scoreMap = this.add.text(500, 32, 'Lollipop factory', { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);



        //spawn doors
        this.porteMap = this.physics.add.group({
            key: 'door'
        });
        this.porte_map = this.carteDuNiveau.getObjectLayer("porte");
        this.porte_map.objects.forEach(porte_map => {
            const doorSpawn = this.porteMap.create(porte_map.x + 16, porte_map.y + 16, "door");
        });
        this.physics.add.overlap(this.player, this.porteMap, this.openDoor, null, this);


        //spawn lollipops
        this.monsterLollipop = this.physics.add.group({
            key: 'monster_lollipop'
        });
        this.monster_lollipop = this.carteDuNiveau.getObjectLayer("spawn_monsters");
        this.monster_lollipop.objects.forEach(monster_lollipop => {
            const lollipopSpawn = this.monsterLollipop.create(monster_lollipop.x + 16, monster_lollipop.y + 16, "door");
            this.idleMood(lollipopSpawn);
        });

        this.physics.add.collider(this.monsterLollipop, this.calque_obstacles);
        this.physics.add.overlap(this.player, this.monsterLollipop, this.damagePlayer, null, this);


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

       /* if (this.monsterLollipop.body.blocked.down || this.monsterLollipop.body.blocked.up) {
            this.monster_lollipop.targetVelocityY(-1);

        }
*/

        // COMPORTEMENT monsterLollipop  

        // pause (randomiser le temps de pause)

        // MODE AGGRO

        //Math.PI / 4 désigne l'angle du champ de vision, 45 degrés ici

        if (Math.abs(this.checkAngle(this.monsterLollipop.x, this.monsterLollipop.y, this.player.x, this.player.y) + this.anglemonsterLollipop) < (Math.PI / 4) && this.checkDistance(this.player.x, this.player.y, this.monsterLollipop.x, this.monsterLollipop.y) <= this.visionRange) {
            this.modeFuite = true;
        }


        if (this.modeFuite == true) {
            if ((Math.abs(this.player.x - this.monsterLollipop.x)) < 8) { // si monsterLollipop est à peu près au même niveau alors il reste sur l'axe
                this.diagoX = 0
                this.monsterLollipop.setVelocityX(0)
            }
            else if (this.player.x < this.monsterLollipop.x) { // Si joueur est à gauche du monsterLollipop
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
            else if (this.player.y < this.monsterLollipop.y) { // Si joueur est au dessus du monsterLollipop
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

    killLollipop() {
        this.obtainHP;
        this.obtainLollipopRessource
        //math random => entre 0 et 1
        //this.truc = Math.floor(Math.random()* (max-min)+min)
    }

    createLollipopResource() {


    }

    obtainLollipopRessource() {
        this.resource_berlingot += 1;
    }

    obtainHP() {
        this.player_hp += 1;
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

    invertY() {
        this.directionY = this.directionY * -1;
        this.setVelocityY(this.directionY);
    }
    mobPause() {
        this.temp = true
    }
    mobPause2() {
        this.mobX = true
    }

    checkDistance(x1, y1, x2, y2) { // mesure la distance entre deux éléments
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    checkAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
}