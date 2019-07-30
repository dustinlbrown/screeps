var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	var sources = creep.room.find(FIND_SOURCES);

    	//this section checks if the harvester has been assigned to a source.  It relies on a 1:1 ratio of sources to miners.
    	if (typeof creep.memory.assignedSource === 'undefined' ) {
    		console.log(creep.name + ' does not have an assigned source.');
			for(var source in sources) {
				console.log(source);
				if (_.filter(Game.creeps,(creep) => creep.memory.assignedSource == source).length == '0' ){
					console.log('Assigning ' + creep.name + ' to source ' + source)
        			creep.memory.assignedSource = source;
        			break;
        		}	
	        }
        }

        if(creep.harvest(sources[creep.memory.assignedSource]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.assignedSource], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleHarvester;