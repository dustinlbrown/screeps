var ACTIONS = {
    HARVEST: 1,
    DEPOSIT: 2
};

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

		console.log
	    if (creep.carry.energy === creep.carryCapacity || creep.memory.action === ACTIONS.DEPOSIT) {
	        console.log('depositing energy');
	        creep.memory.action = ACTIONS.DEPOSIT;
	        depositEnergy(creep);
	    }

	    if (creep.carry.energy < 50 || creep.memory.action === ACTIONS.HARVEST) {
	    	console.log('harvesting energy');
        	creep.memory.action = ACTIONS.HARVEST;
        	harvestEnergy(creep);
        }


	}
};

harvestEnergy = function(creep) {
	var energy = creep.room.find(FIND_DROPPED_RESOURCES);
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
                if (creep.pos.inRangeTo(energy[i], 8)) {
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
		
		creep.moveTo(target);
        creep.pickup(target);
    }
}

depositEnergy = function(creep) {
    var target = undefined;

    var structures = creep.room.find(FIND_MY_STRUCTURES);

    //Check Spawn Energy
    var spawns = _.filter(structures,{structureType: STRUCTURE_SPAWN});
    spawns = _.filter(Game.spawns, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (spawns.length) {
        target = creep.pos.findClosestByRange(spawns);
    }

    //Check Extension Energy
    if (typeof target === 'undefined'){
        var extensions = _.filter(structures,{structureType: STRUCTURE_EXTENSION});
        extensions = _.filter(extensions, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (extensions.length) {
            target = creep.pos.findClosestByRange(extensions);
        }
    }


    if (typeof target === 'undefined'){
        //Check Link Energy
        var links = _.filter(structures,{structureType: STRUCTURE_LINK});

        links = _.filter(links, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (links.length) {
            target = creep.pos.findClosestByPath(links);
        }
    }

    if (typeof target === 'undefined'){
        //Check Storage Energy
        if (creep.memory.withdrawalSource !== STRUCTURE_STORAGE){

            //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
            var storage = creep.room.storage;
            //console.log(storage);
            if (typeof storage !== 'undefined' && storage.store.energy < storage.storeCapacity) {
                target = storage;
            }
        }
    }

    //We hopefully have a target, now lets get it!
    if (typeof target !== 'undefined'){
        creep.moveMeTo(target);
        creep.transferEnergy(target);
        //creep.memory.withdrawalSource = undefined;
    }
};

module.exports = roleCarrier;