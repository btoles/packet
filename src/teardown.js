const fs = require('fs');
require('dotenv').config();

const PacketService = require('./services/packet.service');

const packetService = new PacketService();
const createdDevices = JSON.parse(fs.readFileSync('./src/devices.json'));

(async () => {
    const numberOfDevices = createdDevices.devices.length;
    if (numberOfDevices > 0) {
        for (device of createdDevices.devices) {
            const status = await packetService.deleteDevice(device.id);
            if (status === false) {
                console.log('Unable to delete devices.');
                process.exit(1);
            }
        };
        console.log(`Successfully deleted ${numberOfDevices} devices!`);

        // Reset our device list.
        fs.writeFileSync('./src/devices.json', JSON.stringify({ devices: [] }, null, 4));

        process.exit(0);
    }
    else {
        console.log('No devices to delete.');
        process.exit(1);
    }
})();