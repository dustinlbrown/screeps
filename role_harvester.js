var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	if (typeof creep.memory.AssignedSource === 'undefined' ) {
    		console.log(creep.name + ' does not have an assigned source.');
			
			for(var source in creep.room.find(FIND_SOURCES)) {
				console.log(source);
				if (_.filter(Game.creeps,(creep) => creep.memory.AssignedSource == source) == 0 ){
					console.log('Assigning Creep to source ' + source)
        			creep.memory.AssignedSource = source;
        			break;
        		}	
	        }
        }

		if(creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(sources[creep.memory.AssignedSource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.AssignedSource], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;