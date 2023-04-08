class sceneIntro extends Phaser.Scene {
    constructor() {
        super("sceneIntro");
    }

    preload() {
        this.load.image('background', 'assets/background.png');//Ecran d'accueil, splash art
        this.load.image('splash', 'assets/splash.png');//Ecran d'accueil, splash art
        this.load.image('ui', 'assets/UI.png');//Interface
        //assets
        this.load.image('door', 'assets/door.png');
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('sword_up', 'assets/attaque_joueur_y.png');
        this.load.image('sword_down', 'assets/attaque_joueur_y.png');
        this.load.image('sword_left', 'assets/attaque_joueur_x.png');
        this.load.image('sword_right', 'assets/attaque_joueur_x.png');
        //this.load.image('hp', 'assets/HP.png'); //passer au sprite
        this.load.image('bait', 'assets/bait.png');
        this.load.image('trap', 'assets/trap.png');
        this.load.image('monster_caramel', 'assets/monster_caramel.png');
        this.load.image('monster_chocolate', 'assets/monster_chocolate.png');
        this.load.image('monster_lollipop', 'assets/monster_lollipop.png');
        this.load.image('resource_caramel', 'assets/resource_caramel.png');
        this.load.image('resource_chocolate', 'assets/resource_chocolate.png');
        this.load.image('resource_lollipop', 'assets/resource_lollipop.png');
        this.load.image('npc', 'assets/npc.png');
        //end assets

        this.load.image("Phaser_tuilesdejeu1", "assets/Shop.png");
        this.load.image("Phaser_tuilesdejeu2", "assets/Map.png");
        this.load.image("Phaser_tuilesdejeu3", "assets/Lolli.png");
        this.load.image("Phaser_tuilesdejeu4", "assets/Cara.png");
        this.load.image("Phaser_tuilesdejeu5", "assets/Choco.png");

        this.load.tilemapTiledJSON("map", "assets/GlobalMap.json");
        this.load.tilemapTiledJSON("Shop", "assets/Shop.json");
        this.load.tilemapTiledJSON("Cara", "assets/Caramel.json");
        this.load.tilemapTiledJSON("Choco", "assets/Chocolate.json");
        this.load.tilemapTiledJSON("Lolli", "assets/Lollipop.json");
    }

    create() {
        this.spawn = "";
        this.resource_chocolat = 10;
        this.resource_caramel = 10;
        this.resource_berlingot = 10;
        this.player_hp = 4;
        this.player_max_hp = 4;
        this.player_can_trap = false;
        this.player_can_bait = false;
        //chargement du background        
        this.add.image(1024 / 2, 720 / 2, "background");
        this.add.image(550, 400, "splash");

    }
    update() {

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.fadeOut(1400, 255, 255, 255);
        if (this.cursors.space.isDown) {
            this.spawn = "intro";
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

    }
}
