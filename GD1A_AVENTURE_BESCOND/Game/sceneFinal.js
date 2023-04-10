class sceneFinal extends Phaser.Scene {
    constructor() {
        super("sceneFinal");
    }
    init(data) {
        this.resource_chocolat = data.choc;
        this.resource_caramel = data.cara;
        this.resource_berlingot = data.berlin;
        this.player_hp = data.hp;
    }
    preload() {
    }

    create() {
        if (this.player_hp > 0) {
            this.gg = "Well done! You served all the customers at time!";
            this.scoreHp = this.add.text(128, 64, 'Your final score: ' + (Math.floor(this.player_hp/100) + this.resource_berlingot * 15 + this.resource_chocolat * 5 + this.resource_caramel), { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);
        } else {
            this.gg = "You failed your job! You are fired.";
        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.toughts = this.add.text(128, 128, this.gg, { fontSize: '24px', fill: '#FFF' }).setScrollFactor(0);
        this.restart = this.add.text(128, 256, "Press Space to start again", { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);


    }
    update() {
        if (this.cursors.space.isDown) {
            this.scene.start("sceneIntro", {})
        }

    }
}
