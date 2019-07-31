"use strict"

Creep.prototype.setRole = function(role){
    this.memory.role = role;
}

Creep.prototype.getRole = function(){
    return this.memory.role;
};

Creep.prototype.harvestEnergy = function() {
	var energy = this.room.find(FIND_DROPPED_RESOURCES);
    var target = undefined;
    // collect

    if (energy !== undefined) {
        var targetEnergyIndex = false;

        if(energy.length > 1){
            energy.sort(function (a, b) {
                return b.energy - a.energy
            });
            for (var i = 0; i < 2; i++) {
                if (!energy[i]) {
                    continue
                }
                if (this.pos.inRangeTo(energy[i], 8)) {
                    targetEnergyIndex = i;
                    break;
                }
            }

        }

        if (targetEnergyIndex === true) {
            target = energy[targetEnergyIndex]
        }else{
            target = energy[0];
        }
        //var closestEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);
		
		this.moveTo(target);
        this.pickup(target);
    }
}

Creep.prototype.withdrawEnergy = function() {
    var structures = this.room.find(FIND_MY_STRUCTURES);
    var target; //undefined
    var hasStorage = false;
    var link = _.filter(structures,{structureType: STRUCTURE_LINK});
    if (link.length){
        for (var i in link){
            if (this.pos.isNearTo(link[i])){
                if(link[i].energy > 0){
                    target = link[i];
                }
                break;
            }
        }
    }

    if(typeof target === 'undefined'){
        //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
        var storage = this.room.storage;

        if (typeof storage !== 'undefined' ){
            hasStorage = true;
            if (storage.store.energy > 0) {
                target = storage;
            }
        }

    }

    //We don't have storage, or it's empty.
    if (typeof target === 'undefined' && !hasStorage) {
        var extensions = _.filter(structures, {structureType: STRUCTURE_EXTENSION});

        var filledExtensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });
        if (filledExtensions.length) {
            target = this.pos.findClosestByRange(filledExtensions);
        }
    }
    //if we still don't have a target and we don't have too many extensions, we'll borrow from the spawn
    if (typeof target === 'undefined' && _.filter(structures, {structureType: STRUCTURE_EXTENSION}).length < 1 && !hasStorage) {
        var spawns = _.filter(structures, {structureType: STRUCTURE_SPAWN});
        if (spawns.length){
            target = spawns[0];
        }

        //first spawn is fine as we'll never take from it by the time we have 2
    }

    if (typeof target !== 'undefined') { //todo figure out why we move to a target we don't have....
        this.moveTo(target);
        this.withdraw(target,RESOURCE_ENERGY);
        this.memory.withdrawalSource = target.structureType;
        if(this.carry.energy === this.carryCapacity){this.memory.action = ACTION.CONSTRUCTION;}
    }
};


Creep.prototype.depositEnergy = function() {
    var target = undefined;

    var structures = this.room.find(FIND_MY_STRUCTURES);

    //Check Spawn Energy
    var spawns = _.filter(structures,{structureType: STRUCTURE_SPAWN});
    spawns = _.filter(Game.spawns, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (spawns.length) {
        target = this.pos.findClosestByRange(spawns);
    }

    //Check Extension Energy
    if (typeof target === 'undefined'){
        var extensions = _.filter(structures,{structureType: STRUCTURE_EXTENSION});
        extensions = _.filter(extensions, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (extensions.length) {
            target = this.pos.findClosestByRange(extensions);
        }
    }


    if (typeof target === 'undefined'){
        //Check Link Energy
        var links = _.filter(structures,{structureType: STRUCTURE_LINK});

        links = _.filter(links, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (links.length) {
            target = this.pos.findClosestByPath(links);
        }
    }

    if (typeof target === 'undefined'){
        //Check Storage Energy
        if (this.memory.withdrawalSource !== STRUCTURE_STORAGE){

            //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
            var storage = this.room.storage;
            //console.log(storage);
            if (typeof storage !== 'undefined' && storage.store.energy < storage.storeCapacity) {
                target = storage;
            }
        }
    }

    //We hopefully have a target, now lets get it!
    if (typeof target !== 'undefined'){
        this.moveTo(target);
        this.transfer(target,RESOURCE_ENERGY);
        //this.memory.withdrawalSource = undefined;
    }
};