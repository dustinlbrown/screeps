var roleHarvester = require('role.miner');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.role
        if (role = "CreepMiner"){
       		roleMiner.run(creep);
        }
    }
}