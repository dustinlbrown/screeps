var ACTIONS = {
    HARVEST: 1,
    DEPOSIT: 2
};

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

		console.log
	    if (creep.carry.energy === creep.carryCapacity || creep.memory.action === ACTIONS.DEPOSIT) {
	        creep.memory.action = ACTIONS.DEPOSIT;
	        creep.depositEnergy();
	    }

	    if (creep.carry.energy < 50 || creep.memory.action === ACTIONS.HARVEST) {
        	creep.memory.action = ACTIONS.HARVEST;
        	creep.harvestEnergy();
        }


	}
};

module.exports = roleCarrier;