'use strict';
const express = require('express');
const app = express();
const Orb = require('./orb');

// instantiate the Orb
const particlePhotonId = process.env.PARTICLE_PHOTON_ID;
const particleApiKey = process.env.PARTICLE_API_KEY;
const orb = new Orb(particlePhotonId, particleApiKey);

function resetColorGreen() {
    orb.setColor('green');
}

function flashRedForTenSecondsThenGreen() {
    orb.setColor('red');
    // schedule reset to green in 10 seconds
    setTimeout(resetColorGreen, 10000);
}

app.get("/", (req, res) => {
    // check secret
    // send particle photon command
    flashRedForTenSecondsThenGreen();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`pull-request-blink listening on port ${PORT}`);
});
