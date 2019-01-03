const fetch = require('node-fetch');
require('dotenv').config();

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
        }
        catch (error) {
            console.log(error);
        }
    }
    
    /**
     * Creates a new device and provisions it in the datacenter.
     * @param {object} body - Request body for Create Device endpoint
     */
    async createDevice(body) {
        try {
            const response = await this.fetch(`/projects/${projectId}/devices`, {
                method: 'POST',
                body
            });
            if (response.ok) {
                return await response.json();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = PacketService;