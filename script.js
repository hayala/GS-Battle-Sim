var get = function(id) {
    return document.getElementById(id);
}

var divider = "\n------------------------------------------------------";
console.log("Golden Sun Battle Sim" + divider);
console.log("Enter - Game.commands() - to view all usable functions" + divider);

console.log("Adventurers: Isaac and Mia");

var that;
var gameCommandsArray = ["adventurer.adventurerData()", "adventurer.addToInventory()", "adventurer.viewInventory()",
"adventurer.addSpell(spell)", "adventurer.viewSpells()", "adventurer.setWeapon(woodenMeleeWeapon || woodenRangeWeapon)",
    "adventurer.lotOfPots() -- Adds 50 HP Potions", "adventurer.playerOneHealthItem.use()",
    "adventurer.playerTwoHealthItem.use()", "adventurer.battle()", "adventurer.attack()", "adventurer.give(target, item)"
];

var Game = {
    gameItems: ["HP Pot", "MP Pot", "Brass Guard", "Wooden Sword", "Wooden Staff"],
    rareItems: ["Ivan's Whistle", "Garet's Call"],
    commands: function() {
        var i = 0;
        while (i < gameCommandsArray.length) {
            console.log(gameCommandsArray[i] + divider);
            i++
        }
    },
    enemy: undefined,
    enemyList: ["Skeleton Warrior", "Vale Rat"],
    gameEnemies: {
        skeleton: {
            name: "Skeleton Warrior",
            health: 40,
            attack: "Skeletal Slash",
            damage: 9,
            itemList: ["Wooden Sword", "HP Pot", "Brass Guard", "Nothing"]
        },
        rat: {
            name: "Vale Rat",
            health: 20,
            attack: "Scratch",
            damage: 7,
            itemList: ["MP Pot", "Wooden Staff", "Nothing"]
        },
    },
    enemyHealth: undefined,
    inBattle: false,
    playerTurn: true,
    maxWeight: 50
};


var Adventurer = function(name, health, mana) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.maxOverheal = this.maxHealth * 2;
    this.mana = mana;
    this.inventory = [];
    this.spells = [];
    this.weapon;
    this.level = 1;
    this.attackPower = 1;
    this.spellInUse = false;
    this.currentSpell = "";
    /*var experience = 5;
    var neededExperience = experience * 2;

    this.addExperience = function(experienceGiven){
        experience += experienceGiven;
        console.log(experience);
        console.log(neededExperience);

        if(experience >= neededExperience){
            this.level += 1;
            var previousLevel = this.level - 1;
            console.log(this.name + " has " + "LEVELED UP!" + "(" + previousLevel + "->" + this.level + ")");
            neededExperience = experience * 2;
        }
    }*/

}

var woodenMeleeWeapon = {
    damage: 8,
    name: "Wooden Sword",
    uses: 40,
    info: "Your weathered but trusty wooden sword",
    weight: 5
};

var woodenRangeWeapon = {
    damage: 4,
    rangedDamage: 13,
    mana: 5,
    name: "Wooden Staff",
    uses: 40,
    info: "A wooden staff with a rock-hard tip",
    weight: 8
};

Adventurer.prototype.addToInventory = function(item) {
    for (i = 0; i < Game.gameItems.length; i++) {
        if (item == Game.gameItems[i] || item == Game.rareItems[i]) {
            this.inventory.push(item);
        }
    }
}

Adventurer.prototype.addSpell = function(spell) {
    this.spells.push(spell);
}

Adventurer.prototype.setWeapon = function(weapon) {
    if (weapon == woodenMeleeWeapon) {
        this.weapon = woodenMeleeWeapon;
        this.inventory.push(weapon.name);
    } else if (weapon == woodenRangeWeapon) {
        this.weapon = woodenRangeWeapon;
        this.inventory.push(weapon.name);
    }
}

var HealthItem = function(adventurer) {
    this.healthItemName = "";
    this.healAmount = 0;

    this.use = function() {
        that = adventurer;
        console.log(that.name);
        for (var x = 0; x < that.inventory.length; x++) {
            if (that.inventory[x] == "HP Pot") {
                this.healthItemName = "HP Pot";
                this.healAmount = 30;
                that.health += this.healAmount;
                console.log(that.name + " Has Used " + this.healthItemName + " to heal for " + this.healAmount + "HP" + divider);
                if (that.health > that.maxHealth && that.health < that.maxOverheal) {
                    var overheal = that.health - that.maxHealth;
                    console.log("Overhealed by " + overheal + "!");
                } else if (that.health > that.maxOverheal) {
                    console.log(that.name + " cannot " + "be " + "overhealed " + "anymore!");
                    that.health = that.maxOverheal;
                }
                that.inventory.splice(x, 1);
                return;
            }
        }
        console.log("No Health Items in Inventory" + divider);
    }
}

Adventurer.prototype.adventurerData = function() {
    console.log(this.name);
    console.log("Health: " + this.health);
    console.log("Mana: " + this.mana + divider);
}

Adventurer.prototype.viewSpells = function() {
    for (var i = 0; i < this.spells.length; i++) {
        console.log(this.spells[i] + divider);
    }
}

Adventurer.prototype.useSpell = function(spell) {
    if (this.spellInUse == true) {
        console.log(this.name + " is already charging " + this.currentSpell);
    } else {
        for (var i = 0; i < this.spells.length; i++) {
            if (this.spells[i] == spell) {
                if (Game.enemy == undefined) {
                    this.spellInUse = false;
                    console.log("What are you aiming that " + spell + " at?" + divider);
                    return;
                } else {
                    this.currentSpell = spell;
                    this.spellInUse = true;
                    console.log(this.name + " is charging " + this.currentSpell + "...");
                    playerTurn = false;
                    return;
                }
            }
        }
        console.log("You don't know how to do that..." + divider);
    }
}

Adventurer.prototype.viewInventory = function() {
    for (var x = 0; x < this.inventory.length; x++) {
        console.log(this.inventory[x] + divider);
    }
    if (this.inventory.length == 0) {
        console.log(this.name + "'s" + " bag is empty");
    }
}

Adventurer.prototype.lotOfPots = function() {
    for (var i = 0; i < 50; i++) {
        this.addToInventory("HP Pot");
    }
}

Adventurer.prototype.battle = function() {
    if (Game.enemy != undefined) {
        console.log("You're already in a battle!");
    } else {
        Game.inBattle = true;
        Game.enemy = Game.enemyList[Math.floor(Math.random() * Game.enemyList.length)];
        if (Game.enemy == "Skeleton Warrior") {
            Game.enemy = Game.gameEnemies.skeleton;
        } else {
            Game.enemy = Game.gameEnemies.rat;
        }
        Game.enemyHealth = Game.enemy.health;
        console.log(this.name + "'s" + " party has encountered " + Game.enemy.name + "(HP:" + Game.enemy.health + ")");
    }
}

Adventurer.prototype.attack = function() {
    var damage;
    if (Game.enemyHealth > 0) {
        while (Game.playerTurn) {
            /*Spell progress
            if(this.spellInUse == true){
                for(var x = 0; x < spellList.length; x++){
                    if(this.currentSpell == spellList[x].name && spellList[x].hostile == true){
                        damage = spellList[x].effect;
                        console.log("testing: " + damage);
                    }
                }
            }
            else{*/
            damage = this.weapon.damage + (this.attackPower * 0.5);
            //}
            Game.enemyHealth -= damage;
            console.log(this.name + " hit " + Game.enemy.name + " for " + damage + "!");
            if (Game.enemyHealth < 0) {
                Game.enemyHealth = 0;
                console.log(Game.enemy.name + " HP: " + Game.enemyHealth + divider);
            } else {
                console.log(Game.enemy.name + " HP: " + Game.enemyHealth + divider);
            }
            Game.playerTurn = false;
        }
        if (Game.enemyHealth <= 0) {
            Game.enemyHealth = 0;
            var loot;
            console.log(this.name + "'s" + " party has defeated " + Game.enemy.name + "!" + divider);
            for (var i = 0; i < 1; i++) {
                if(Math.floor(Math.random() * 15) == 5){ loot = Game.rareItems[Math.floor(Math.random() * Game.rareItems.length)]; }
                else{ loot = Game.enemy.itemList[Math.floor(Math.random() * Game.enemy.itemList.length)]; }
                if (loot == "Nothing") {
                    console.log(Game.enemy.name + " did not drop anything");
                    Game.enemy = undefined;
                    return;
                } else {
                    this.addToInventory(loot)
                };
                console.log(this.name + " looted " + loot + " from " + Game.enemy.name);
            }
            Game.enemy = undefined;
        }
        if (!Game.playerTurn && Game.enemyHealth > 0) {
            var critCheck = Math.floor(Math.random() * 10);
            if (critCheck == 9) {
                this.health -= Game.enemy.damage * 1.5;
                var critDamage = Game.enemy.damage * 1.5;
                console.log(">> CRITICAL HIT BONUS <<");
                console.log("**" + Game.enemy.name + " hits " + this.name + " for " + critDamage + "!**");
                console.log(this.name + " HP: " + this.health + divider);
            } else {
                this.health -= Game.enemy.damage;
                console.log("**" + Game.enemy.name + " hits " + this.name + " for " + Game.enemy.damage + "!**");
                console.log(this.name + " HP: " + this.health + divider);
            }

        }
    }
    Game.playerTurn = true;
}

var isaac = new Adventurer("Isaac", 100, 50);
var mia = new Adventurer("Mia", 80, 90);

var adventurers = [isaac, mia];

Adventurer.prototype.give = function(target, item, amount) {
    var itemAmount;
    var count = 0;
    if (arguments.length == 3) {
        for (var y = 0; y < this.inventory.length; y++) {
            if (this.inventory[y] == item) {
                count++;
            }
        }
        if (count == 0) {
            console.log(this.name + " does not have that many " + item + "(s)");
            return;
        } else {
            itemAmount = amount;
        }
    } else if (arguments.length == 2) {
        for (var b = 0; b < this.inventory.length; b++) {
            if (this.inventory[b] == item) {
                count = 1;
                break;
            }
        }
        if (count == 0) {
            console.log(this.name + " does not have that many " + item + "(s)");
            return;
        } else {
            itemAmount = count;
        }
    }
    for (var k = 0; k < adventurers.length; k++) {
        if (target == adventurers[k].name) {
            if (target == this.name) {
                console.log("You can't give something to yourself..." + divider);
                return;
            } else {
                for (var l = 0; l < this.inventory.length; l++) {
                    if (item == this.inventory[l]) {
                        for (var x = 0; x < itemAmount; x++) {
                            adventurers[k].inventory.push(item);
                        }
                        this.inventory.splice(l, x);
                        console.log(this.name + " gave " + itemAmount + " " + item + "(s)" + " to " + adventurers[k].name + divider);
                        return;
                    } else if (l == this.inventory.length) {
                        console.log(this.name + " does not have that item" + divider);
                        return;
                    }
                }
            }
        }
    }
}

Adventurer.prototype.drop = function(item){
    for(var i = 0; i <= this.inventory.length; i++){
        if(this.inventory[i] == item){
            this.inventory.splice(i, 1);
            console.log(this.name + " has dropped " + item + divider);
            return;
        }
        if(i == this.inventory.length){
            console.log(this.name + " does not have that item" + divider);
            return;
        }
    }
}

isaac.setWeapon(woodenMeleeWeapon);
mia.setWeapon(woodenRangeWeapon);

Adventurer.prototype.playerOneHealthItem = new HealthItem(isaac);
Adventurer.prototype.playerTwoHealthItem = new HealthItem(mia);

isaac.addSpell("Earthquake");
isaac.addSpell("Push");

mia.addSpell("Soothing Waters");
mia.addSpell("Sleet");
