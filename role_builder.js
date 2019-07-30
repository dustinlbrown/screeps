var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            withdrawEnergy(creep);
        }
    }
};

withdrawEnergy = function(creep) {
    var structures = creep.room.find(FIND_MY_STRUCTURES);
    var target; //undefined
    var hasStorage = false;
    var link = _.filter(structures,{structureType: STRUCTURE_LINK});
    if (link.length){
        for (var i in link){
            if (creep.pos.isNearTo(link[i])){
                if(link[i].energy > 0){
                    target = link[i];
                }
                break;
            }
        }
    }

    if(typeof target === 'undefined'){
        //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
        var storage = creep.room.storage;

        if (typeof storage !== 'undefined' ){
            hasStorage = true;
            if (storage.store.energy > 0) {
                target = storage;
            }
        }

    }

    //We don't have storage, or it's empty.
    if (typeof target === 'undefined' && !hasStorage) {
        var extensions = _.filter(structures, {structureType: STRUCTURE_EXTENSION});

        var filledExtensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });
        if (filledExtensions.length) {
            target = creep.pos.findClosestByRange(filledExtensions);
        }
    }
    //if we still don't have a target and we don't have too many extensions, we'll borrow from the spawn
    if (typeof target === 'undefined' && _.filter(structures, {structureType: STRUCTURE_EXTENSION}).length < 1 && !hasStorage) {
        var spawns = _.filter(structures, {structureType: STRUCTURE_SPAWN});
        if (spawns.length){
            target = spawns[0];
        }

        //first spawn is fine as we'll never take from it by the time we have 2
    }

    if (typeof target !== 'undefined') { //todo figure out why we move to a target we don't have....
        creep.moveTo(target);
        creep.withdraw(target,RESOURCE_ENERGY);
        creep.memory.withdrawalSource = target.structureType;
        if(creep.carry.energy === creep.carryCapacity){creep.memory.action = ACTION.CONSTRUCTION;}
    }
};

module.exports = roleBuilder;