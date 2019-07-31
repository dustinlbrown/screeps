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
				creepRole = 'carrier'
				creepBody = getCreepBody(creepRole);
			}else if (harvesters.length < idealHarvesters) {
				creepRole = 'harvester'
				creepBody = getCreepBody(creepRole);
			}else if (builders.length < idealBuilders) {
				creepRole = 'builder'
				creepBody = getCreepBody(creepRole);
			}else if (upgraders.length < idealUpgraders) {
				creepRole = 'upgrader'
				creepBody = getCreepBody(creepRole);
			}
			
			if (creepBody.length > 0){
				Game.spawns['Spawn1'].spawnCreep(creepBody, creepRole + Game.time, 
					{memory: 
						{role: creepRole}});
				console.log('Spawning new ' + creepRole);
			}
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

var getCreepBody = function(role){
	let maxBodyParts = 50;
	let maxEnergy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
	let body = [];

	if (role == 'builder'){
		var bodyOptions = {"WORK": 2, "MOVE": 1, "CARRY": 1}
		var exact = false;
	}else if (role == 'carrier'){
		var bodyOptions = {"MOVE": 1, "CARRY": 1}
		var exact = false;
	}else if (role == 'harvester'){
		var bodyOptions = {"WORK": 2, "MOVE": 2, "WORK": 3, "MOVE": 5}
		var exact = true;
	}else if (role == 'upgrader'){
		var bodyOptions = {"WORK": 2, "MOVE": 1, "CARRY": 1}
		var exact = false;
	}

	if(exact){
	
		for (let bodyPart in bodyOptions){
			if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0 ) break;

			for (let i=0; i< bodyOptions[bodyPart];i++){
				if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0) {
					maxEnergy =0;
					break;
				}

				body.push(bodyPart);
				maxEnergy -= BODYPART_COST[bodyPart];
				maxBodyParts--;
			}
		}
	}else{
        //ratioCost will tell us how much each iteration of the ratio will cost
        let ratioCost = 0;
        for(let bodyPart in bodyOptions){
            for(let i = 0; i < bodyOptions[bodyPart]; i++){
                ratioCost += BODYPART_COST[bodyPart];
            }
        }
        
        //With our ratio cost, we now figure out the maximum amount of the ratio we can make. We     
        //test three things, whether we run into the maximum energy for the room, the maximum 
        //bodyparts allowed, or the specified bodypart limit we put into the options
        let maxUnits = Math.min(
            Math.floor(maxEnergy / ratioCost),
            Math.floor((maxBodyParts || 50) / _.sum(bodyOptions)),
            Math.floor(maxBodyParts / _.sum(bodyOptions))
        );
        //Now we know how many of each bodypart we will make, we cycle through the order given to 
        //create the body
        for(let bodyPart in bodyOptions){
            for(let i = 0; i < maxUnits * bodyOptions[bodyPart]; i++)
                body.push(bodyPart);
        }
	}
	return body;
}

module.exports = spawner;