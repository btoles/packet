const fs = require('fs');
require('dotenv').config();

const PacketService = require('./services/packet.service');

const packetService = new PacketService();
const {
    PACKET_PROJECT_ID: projectId,
    MACHINE_OS: operatingSystem
} = process.env;
const createdDevices = JSON.parse(fs.readFileSync('./src/devices.json'));

(async () => {
    // Check if the OS requested can be provisioned.
    const availableOS = (await packetService.getOperatingSystems()).operating_systems;
    // Assuming the consumer would request an OS by name.
    const selectedOS = availableOS.find(os => os.name === operatingSystem);
    
    if (!selectedOS) {
        console.log('Could not find the requested operating system, please try another');
        process.exit(1);
    }    
    if (!selectedOS.provisionable_on.length) {
        console.log('Unable to provision devices for this Operating System at the moment.');
        process.exit(1);
    }

    let planFound = false;
    let selectedPlan = null;

    // We have an OS that can be provisioned, let's just choose the first available selection.
    while (!planFound && selectedOS.provisionable_on.length) {
        const requestedDevice = selectedOS.provisionable_on.pop();
        
        // Determine if we have a plan for the requested device.
        const plans = (await packetService.getPlans(projectId)).plans;
        selectedPlan = plans.find(plan => plan.name === requestedDevice);

        if (selectedPlan) {
            planFound = true;
        }
    }

    if (!planFound) {
        console.log('Unable to find a plan that matched your request.');
        process.exit(1);
    }

    // We have found an OS with a valid plan for our project, now we need to find a facility to deploy to.
    const facilities = (await packetService.getFacilities(projectId)).facilities;
    const selectedFacility = facilities.find(facility => facility.features && facility.features.includes(selectedPlan.line));
    
    if (!selectedFacility) {
        console.log('Unable to find an available facility that supports your plan.');
        process.exit(1);
    }

    // Check for capacity at the desired location.
    // NOTE: I don't have access with the interview token to do so.

    const createdDevice = (await packetService.createDevice(projectId, {
        facility: selectedFacility.id,
        plan: selectedPlan.id, 
        operating_system: selectedOS.id
    }));

    if (!createdDevice) {     
        console.log('Something went wrong when trying to create your device! 😿');
        process.exit(1);
    }

    createdDevices.devices.push(createdDevice);

    // Keep track of the machines we've created.
    fs.writeFileSync('./devices.json', JSON.stringify(createdDevices, null, 4));
    process.exit(0);
})();