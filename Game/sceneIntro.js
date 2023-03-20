class sceneIntro extends Phaser.Scene {
    constructor() {
        super("sceneIntro");
    }

    preload() {
        //Ecran d'accueil, splash art
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.resource_chocolat = 0;
        this.resource_caramel = 0;
        this.resource_berlingot = 0;
        this.Text = this.add.text(16, 64, 'Press Up arrow to begin', { fontSize: '32px', fill: '#FFF' });
        //affiche un texte à l’écran en attendant le splash art

    }
    update() {

        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.up.isDown) {
            this.scene.start("sceneShop", {
                choc: this.resource_chocolat,
                cara: this.resource_caramel,
                berlin: this.resource_berlingot
            })
        }

    }
}
