var spawner = require('spawner');
var roleBuilder = require('role_builder');
var roleCarrier = require('role_carrier');
var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    spawner.run();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		if ( creep.memory.role == "builder"){
			roleBuilder.run(creep);
		}
		if ( creep.memory.role == "carrier"){
			roleCarrier.run(creep);
		}
		if ( creep.memory.role == "harvester"){
			roleHarvester.run(creep);
		}
		if ( creep.memory.role == "upgrader"){
			roleUpgrader.run(creep);
		}
    }
}