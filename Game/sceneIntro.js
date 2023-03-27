class sceneIntro extends Phaser.Scene {
    constructor() {
        super("sceneIntro");
    }

    preload() {
        this.load.image('background', 'assets/sky.png');//Ecran d'accueil, splash art
        //assets
        this.load.image('door', 'assets/door.png');
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });// chargement tuiles de jeu
        //end assets

        
        this.load.image("Phaser_tuilesdejeu", "assets/Shop.png");
        this.load.image("Phaser_tuilesdejeu", "assets/Map.png");
        this.load.image("Phaser_tuilesdejeu", "assets/Lolli.png");
        this.load.image("Phaser_tuilesdejeu", "assets/Cara.png");
        this.load.image("Phaser_tuilesdejeu", "assets/Choco.png");

        this.load.tilemapTiledJSON("map", "assets/GlobalMap.json");
        this.load.tilemapTiledJSON("Shop", "assets/Shop.json");
        this.load.tilemapTiledJSON("Cara", "assets/Caramel.json");
        this.load.tilemapTiledJSON("Choco", "assets/Chocolate.json");
        this.load.tilemapTiledJSON("Lolli", "assets/Lollipop.json");
    }

    create() {
        this.spawn = "";
        this.resource_chocolat = 0;
        this.resource_caramel = 0;
        this.resource_berlingot = 0;
        this.player_hp = 4;

        //chargement du background        
        this.add.image(500, 500, "background");

        this.Text = this.add.text(16, 64, 'Press Down arrow to begin', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran en attendant le splash art

    }
    update() {

        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.down.isDown) {
            this.spawn = "intro";
            this.scene.start("sceneShop", {
                choc: this.resource_chocolat,
                cara: this.resource_caramel,
                berlin: this.resource_berlingot,
                hp: this.player_hp,
                spawn: this.spawn
            })
        }

    }
}
