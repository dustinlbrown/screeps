var spawner = {

    run: function (){

		var CREEP_ROLES = ['builder','carrier','harvester','upgraders']

		var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
	    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	    /*console.log('CREEP STATS: \n Builders: ' + builders.length + '\n Carriers: ' + carriers.length+ '\n Havesters: ' + harvesters.length);*/

	    var idealBuilders = 1;
	    var idealCarriers = 2;
	    var idealHarvesters = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;
	    var idealUpgraders = 1;



		if(!Game.spawns['Spawn1'].spawning){

			var creepBody = []
			var creepRole = '';

			if (carriers.length < idealCarriers) {
				creepBody = [];
				creepBody.push(CARRY);
				creepBody.push(CARRY);
				creepBody.push(MOVE);
				creepBody.push(MOVE);
			}else if (harvesters.length < idealHarvesters) {
				creepBody = [];
				creepBody.push(WORK);
				creepBody.push(WORK);
				creepBody.push(MOVE);
			}else if (builders.length < idealBuilders) {
				creepBody = [];
				creepBody.push(WORK);
				creepBody.push(WORK);				
				creepBody.push(CARRY);
				creepBody.push(MOVE);
			}else if (upgraders.length < idealUpgraders) {
				creepBody = [];
				creepBody.push(WORK);
				creepBody.push(WORK);				
				creepBody.push(CARRY);
				creepBody.push(MOVE);
			}
			
			
			Game.spawns['Spawn1'].spawnCreep(creepBody, creepRole + Game.time, 
				{memory: {role: creepRole}});
			console.log('Spawning new ' + creepRole + ': ' + newName);

		}else { 
	        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
	        Game.spawns['Spawn1'].room.visual.text(
	            'SPAWNING: ' + spawningCreep.memory.role,
	            Game.spawns['Spawn1'].pos.x + 1, 
	            Game.spawns['Spawn1'].pos.y, 
	            {align: 'left', opacity: 0.8});
	    }
	}

};

module.exports = spawner;