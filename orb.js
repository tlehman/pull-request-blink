// Controls our DA orb
'use strict';
var request = require('request-promise');

module.exports = Orb;

function Orb(deviceId, accessToken) {
    this._deviceId = deviceId;
    this._accessToken = accessToken;
}

Orb.prototype.setAlarm = function (color1, color2) {
    console.log(`Triggering alarm ${color1}/${color2}`);
    let url = `https://api.particle.io/v1/devices/${this._deviceId}/alarm`;
    return request.post({
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${this._accessToken}&arg=${color1},${color2}`
    });
};

Orb.prototype.alarmOff = function () {
    console.log("Stopping alarm");
    let url = `https://api.particle.io/v1/devices/${this._deviceId}/alarm`;
    return request.post({
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${this._accessToken}&arg=off`
    });
};

Orb.prototype.setColor = function (color) {
    console.log(`Setting solid color to ${color}`);
    let url = `https://api.particle.io/v1/devices/${this._deviceId}/color`;
    return request.post({
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${this._accessToken}&arg=${color}`
    });
};
