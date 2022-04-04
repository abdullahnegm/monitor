const {createCronJob, generateCronJobTimeFormat} = require('../services/cron_job')
const mongoose = require('mongoose');
const { Schema } = mongoose;

const responseSchema = new Schema({
    time: {type: Number, required: true},
    status: {type: String},

});

const targetSchema = new Schema({
    name: {type: String, unique: true, required: true},
    url:  {
        type: String, 
        required: true,
        match: [/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/]
    },
    protocol: {type: String, enum : ['http','https', 'tcp'], required: true},
    path: {type: String},
    port: {type: Number, min: 2, max: 5},
    method: {type: String, enum : ['get', 'post'], default: 'get'},
    webhook: {type: String},
    timeout: {type: Number, default: 5},
    interval: {type: String, default: "*/10 * * * *"},
    threshold: {type: Number, default: 1},
    current_threshold: {type: Number, default: 0},
    authentication: [{username: String, password: String}],
    httpHeaders: [{key: String, value: String}],
    tags: [{type: String}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    is_active: {type: Boolean, default: 0},
    uptime: [responseSchema],
    downtime: [responseSchema],
    total_uptime: {type: Number, default: 0},
    total_downtime: {type: Number, default: 0}
});

targetSchema.pre('save', function(next) {
    var target = this;
    target.interval = generateCronJobTimeFormat(target.interval) 
    next()
});

targetSchema.post('save', async function(target, next) {
    console.log("$$$$$$$$$$$$$$$$$$$")
    if (this.is_active == 0) {
        console.log("$$$$$$$$$$$$$$$$$$$", this.is_active)
        this.is_active = 1
        await createCronJob.bind(this)()
    }
    next()
});

const Target = mongoose.model('Target', targetSchema);

module.exports = Target