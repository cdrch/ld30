var BalanceGame = {

    gameInfo: { levels: ['map6', 'map6'], startX: [64, 256], startY: [64, 64], currentLevel: 0 },
    playerInfo: { health: 100, wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
        maxHealth: 100, maxWood: 0, maxFire: 0, maxEarth: 0, maxMetal: 0, maxWater: 0,
        woodSpells: [false, false, false, false, false], 
        fireSpells: [false, false, false, false, false], 
        earthSpells: [false, false, false, false, false], 
        metalSpells: [false, false, false, false, false], 
        waterSpells: [false, false, false, false, false],
        currentWoodSpell: 0,
        currentFireSpell: 0,
        currentEarthSpell: 0,
        currentMetalSpell: 0,
        currentWaterSpell: 0
    }
};

BalanceGame.Boot = function (game) {
};

BalanceGame.Boot.prototype = {

    init: function () {

    },

    create: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
