class sceneIntro extends Phaser.Scene {
    constructor() {
        super("sceneIntro");
    }

    preload() {
        this.load.image('background', 'assets/sky.png');//Ecran d'accueil, splash art
        //assets
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('door', 'assets/star.png');
        //end assets
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });// chargement tuiles de jeu
        this.load.image("Phaser_tuilesdejeu", "assets/Map.png");// chargement de la carte
        this.load.tilemapTiledJSON("map", "assets/GlobalMap.json");
        this.load.tilemapTiledJSON("map", "assets/Shop.json");
        //this.load.tilemapTiledJSON("map", "assets/Caramel.json");
        //this.load.tilemapTiledJSON("map", "assets/Chocolat.json");
        //this.load.tilemapTiledJSON("map", "assets/Lollipop.json");
    }

    create() {
        this.spawn = "intro";
        this.resource_chocolat = 0;
        this.resource_caramel = 0;
        this.resource_berlingot = 0;

        //chargement du background        
        this.add.image(500, 500, "background");

        this.Text = this.add.text(16, 64, 'Press Up arrow to begin', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran en attendant le splash art

    }
    update() {

        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.up.isDown) {
            this.scene.start("sceneShop", {
                choc: this.resource_chocolat,
                cara: this.resource_caramel,
                berlin: this.resource_berlingot,
                spawn: this.spawn
            })
        }

    }
}
