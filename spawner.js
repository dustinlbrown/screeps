var spawner = {

    run: function (){
		var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
	    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	    /*console.log('CREEP STATS: \n Builders: ' + builders.length + '\n Carriers: ' + carriers.length+ '\n Havesters: ' + harvesters.length);*/

	    var idealBuilders = 1;
	    var idealCarriers = 2;
	    var idealHarvesters = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;
	    var idealUpgraders = 1;

	    if (carriers.length < idealCarriers) {
	        var newName = 'Carrier' + Game.time;
	        console.log('Spawning new carrier: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, MOVE, MOVE], newName, 
	        	{memory: {role: 'carrier'}});
	    }

	    if (harvesters.length < idealHarvesters) {
	        var newName = 'Harvester' + Game.time;
	        console.log('Spawning new harvester: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE], newName, 
	            {memory: {role: 'harvester'}});
	    }
	    
	    if (builders.length < idealBuilders) {
	        var newName = 'Builder' + Game.time;
	        console.log('Spawning new builder: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
	            {memory: {role: 'builder'}});
	    }
	    
	    if (upgraders.length < idealUpgraders) {
	        var newName = 'Upgrader' + Game.time;
	        console.log('Spawning new upgrader: ' + newName);
	        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
	            {memory: {role: 'upgrader'}});
	    }
	    
	    if (Game.spawns['Spawn1'].spawning) { 
	        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
	        Game.spawns['Spawn1'].room.visual.text(
	            'SPAWNING:' + spawningCreep.memory.role,
	            Game.spawns['Spawn1'].pos.x + 1, 
	            Game.spawns['Spawn1'].pos.y, 
	            {align: 'left', opacity: 0.8});
	    }
	}

};

module.exports = spawner;