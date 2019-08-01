
"use strict"

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


			var creepRole = '';


			if (carriers.length < idealCarriers) {
				creepRole = 'carrier';
			}else if (harvesters.length < idealHarvesters) {
				creepRole = 'harvester';
			}else if (builders.length < idealBuilders) {
				creepRole = 'builder';
			}else if (upgraders.length < idealUpgraders) {
				creepRole = 'upgrader';
			}
			
			if (creepRole !== ''){
				var spawnResult;
				var creepBody = getCreepBody(creepRole);
				spawnResult = Game.spawns['Spawn1'].spawnCreep(creepBody, creepRole + Game.time, 
					{memory: 
						{role: creepRole}});
				console.log('Spawning new ' + creepRole + ' with body ' + creepBody.toString());
				console.log(spawnResult);
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

function getCreepBody(role){
	console.log('Getting creep body for role: ' + role);

	var maxBodyParts = 50;
	var maxEnergy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
	var body = [];
	var opts = '';
	if (role == 'builder'){
		opts = {body: {WORK: 2, MOVE: 1, CARRY: 1},exact: false};
	}else if (role == 'carrier'){
		opts = {body: {MOVE: 1, CARRY: 1},exact: false};
	}else if (role == 'harvester'){
		opts = {body: {MOVE: 4, WORK: 3, MOVE: 3, WORK: 2},exact: true};
	}else if (role == 'upgrader'){
		opts = {body: {WORK: 2, MOVE: 1, CARRY: 1},exact: false};
	}

	if(opts.exact){
        //cycle through the body parts in options
        for(let bodyPart in opts.body) {

            //Need to break out of both for loops
            if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0) break;

            //cycle through the number of bodyparts for each body part
            for (var i = 0; i < opts.body[bodyPart]; i++) {

                //if the next body part costs too much or we've run into our 50 bodypart limit,     
                //break
                if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0){
                    maxEnergy = 0; break;
                }
                
                //push this body part into the body array
				body.push(bodyPart);
				console.log(bodyPart);
                
                //decrement the maximum energy allowed for the next iteration
                maxEnergy -= BODYPART_COST[bodyPart];
                
                //decrement the 50 body part limit
                maxBodyParts--;
            }
		}
		console.log('Returning '+ body.toString());
		return body;
    }
    
    //if this is a ratio instead of exact
    else{
        //ratioCost will tell us how much each iteration of the ratio will cost
        var ratioCost = 0;
        for(let bodyPart in opts.body){
            for(var i = 0; i < opts.body[bodyPart]; i++){
				console.log('BODYPART_COST[bodyPart] ' +BODYPART_COST[bodyPart]);
                ratioCost += BODYPART_COST[bodyPart];
            }
        }
        
        //With our ratio cost, we now figure out the maximum amount of the ratio we can make. We     
        //test three things, whether we run into the maximum energy for the room, the maximum 
        //bodyparts allowed, or the specified bodypart limit we put into the options
        var maxUnits = Math.min(
            Math.floor(maxEnergy / ratioCost),
            Math.floor((maxBodyParts || 50) / _.sum(opts.body)),
            Math.floor(maxBodyParts / _.sum(opts.body))
		);
		
        //Now we know how many of each bodypart we will make, we cycle through the order given to 
        //create the body
        for(let bodyPart in opts.body){
			console.log('maxUnits ' + maxUnits);
			console.log(maxEnergy);
			console.log(ratioCost);
			console.log(maxBodyParts);
            for(let i = 0; i < maxUnits * opts.body[bodyPart]; i++){
				body.push(bodyPart);
				console.log('Adding : ' +bodyPart + ' Array Length: ' + body.length);
			}
		}
		console.log('Returning '+ body.toString());
		return body;
	}	
};

module.exports = spawner;