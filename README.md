# 🤷‍ Assumptions
* The program is not user friendly, in the consumer sense, and is meant to be used by someone with technical skills.
* The operating system will be defined by `name` as it is the most human-readable identifier.

# 📃 Instructions

1. `git clone` the repository.
2. `npm install` in the project directory after cloning.
3. Add `PACKET_API_TOKEN` to an `.env` file located at the root of the project.
```
PACKET_API_TOKEN=Token
```
4. `npm run launch` to launch the machine.
5. `npm run teardown` to teardown the device.

# ⏰ Time to Completion
It took roughly 3 hours and 30 minutes after some confusion about a service outage (see below).

# ⚠ Troubleshooting
Due to a small bug with the way I originally implemented the deletion of devices, I was running into 503 response codes because there was not enough capacity at the facility.  Somehow I missed that the deletion was unsuccessful and missed the error code in the response body.  Due to the nature of the VSCode deugger and the npm package `node-fetch`, I wasn't getting to the step of parsing the response body before it entered the error handling I had in place.  The following is what I saw instead:

```
url:"https://api.packet.net/projects/ca73364c-6023-4935-9137-2132e73c20b4/devices"
status:503
statusText:"Service Unavailable"
```
I was convinced there was an outage and probably should've done more to investiage.  That being said, I would suggest that the documentation be updated to mention that error messages will be included in responses with undesirable status codes.  Using a tool like Postman it's pretty immediately obvious but it wasn't obvious through the VSCode debugger.  Also, I noticed that 403 was unmentioned, at least specifically, in the possible error codes table.  It's mentioned in the challenge doc and "Forbidden" comes back when trying to use the Interview project token for certain endpoints -- it may be worth adding to the table too! 😊