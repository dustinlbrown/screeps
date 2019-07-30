var spawner = {

    run: function (){
		var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
	    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	    /*console.log('CREEP STATS: \n Builders: ' + builders.length + '\n Carriers: ' + carriers.length+ '\n Havesters: ' + harvesters.length);*/

	    var idealBuidlers = 2;
	    var idealCarriers = 1;
	    var idealHarvesters = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;

	    if (carriers.length < 2) {
	        var newName = 'Carrier' + Game.time;
	        console.log('Spawning new carrier: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, MOVE, MOVE], newName, 
	        	{memory: {role: 'carrier'}});
	    }

	    if (harvesters.length < 2) {
	        var newName = 'Harvester' + Game.time;
	        console.log('Spawning new harvester: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
	            {memory: {role: 'harvester'}});
	    }
	    
	    if (Game.spawns['Spawn1'].spawning) { 
	        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
	        Game.spawns['Spawn1'].room.visual.text(
	            'Spawning ' + spawningCreep.memory.role,
	            Game.spawns['Spawn1'].pos.x + 1, 
	            Game.spawns['Spawn1'].pos.y, 
	            {align: 'left', opacity: 0.8});
	    }
	}

};

module.exports = spawner;