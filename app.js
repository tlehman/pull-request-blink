'use strict';
const express = require('express');
const app = express();
const Orb = require('./orb');
const crypto = require('crypto');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// instantiate the Orb
const particlePhotonId = process.env.PARTICLE_PHOTON_ID;
const particleApiKey = process.env.PARTICLE_API_KEY;
const orb = new Orb(particlePhotonId, particleApiKey);

const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

const resetColorGreen = () => {
    orb.setColor('green');
};

const setRedForTenSecondsThenGreen = () => {
    orb.setColor('red');
    // schedule reset to green in 10 seconds
    setTimeout(resetColorGreen, 10000);
};

const setBlueForFiveSecondsThenGreen = () => {
    orb.setColor('blue');
    // schedule reset to green in 5 seconds
    setTimeout(resetColorGreen, 5000);
};

// check that the webhook really is from Github
const verifyGithub = (req) => {
    let sig = req.headers['x-hub-signature'];
    if(!sig) {
        return false;
    }
    let payload = JSON.stringify(req.body);
    let oursig = crypto
        .createHmac('sha1', webhookSecret)
        .update(payload)
        .digest('hex');

    let sigExpected = Buffer.from(sig);
    let sigActual = Buffer.from(`sha1=${oursig}`);

    return crypto.timingSafeEqual(sigExpected, sigActual);
};

app.post("/blink", (req, res) => {
    console.log("POST /blink");
    if(verifyGithub(req)) {
        console.log("Github signature verified");
        if(req.body.action && req.body.action.match(/opened$/)) {
            console.log("setting color to red for 10 seconds");
            setRedForTenSecondsThenGreen();
        } else if(req.body.action == "closed") {
            console.log("setting color to blue for 5 seconds");
            setBlueForFiveSecondsThenGreen();
        }
        res.status = 200;
        res.send("");
    } else {
        console.log("Signature failed verification, not from github");
        res.status = 401;
        res.send("");
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`pull-request-blink listening on port ${PORT}`);
});
