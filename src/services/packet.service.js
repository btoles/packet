const fetch = require('node-fetch');
require('dotenv').config();

/** Handle any non-200 status code response */
const handleBadResponse = response => {
    if (/5\d\d/.test(response.status)) {
        console.log('Unable to communicate to the Packet service(s) at the moment, try again later.');
        process.exit(1);
    }
    if (response.status === 401) {
        console.log('The API key was either not provided or invalid.');
        process.exit(1);
    }
    if (response.status === 404) {
        console.log('The requested resource doesn\'t exist.');
        process.exit(1);
    }
    if (response.status === 422) {
        console.log('The request was malformed, please check that you have all required parameters in your request.');
        process.exit(1);
    }
}

/** Class to interact with the Packet API */
class PacketService {
    /** 
     * Makes an HTTPS request to the Packet API
     * @param {string} path - Path to API endpoint
     * @param {object} options - Fetch options, NOTE: `headers` option will be overwritten
     */
    async fetch(path, options) {
        const OPTIONS = { 
            ...options,
            headers: {
                'X-Auth-Token': process.env.PACKET_API_TOKEN,
                'Content-Type': 'application/json'
            }
        }
        return await fetch(`${process.env.API_BASE_URL}${path}`, OPTIONS);
    }

    /**
     * Get the available plans for a project.
     * @param {string} projectId 
     */
    async getPlans(projectId) {
        try {
            const response = await this.fetch(`/projects/${projectId}/plans`, { method: 'GET' });
            if (response.ok) {
                return await response.json();
            }
            else {
                handleBadResponse(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets a list of available operating systems.  
     */
    async getOperatingSystems() {
        try {
            const response = await this.fetch('/operating-systems', { method: 'GET' });
            if (response.ok) {
                return await response.json();
            }
            else {
                handleBadResponse(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Returns a listing of available datacenters for the given project.
     * @param {string} projectId - Unique identifier of the project
     */
    async getFacilities(projectId) {
        try {
            const response = await this.fetch(`/projects/${projectId}/facilities`, { method: 'GET' });
            if (response.ok) {
                return await response.json();
            }
            else {
                handleBadResponse(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    
    /**
     * Creates a new device and provisions it in the datacenter.
     * @param {object} body - Request body for Create Device endpoint
     */
    async createDevice(projectId, body) {
        try {
            const response = await this.fetch(`/projects/${projectId}/devices`, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            if (response.ok) {
                return await response.json();
            }
            else {
                handleBadResponse(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Deletes a device and deprovisions from Packet's datacenter
     * @param {string} deviceId - Unique identifier of the device to be deleted
     * @returns {boolean} - true if deleted sucessfully, false otherwise.
     */
    async deleteDevice(deviceId) {
        try {
            const response = await this.fetch(`/devices/${deviceId}`, { method: 'DELETE' });
            if (response.ok) {
                return true;
            }
        }
        catch (error) {
            return false;
        }
    }
}

module.exports = PacketService;