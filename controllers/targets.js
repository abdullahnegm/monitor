const Target = require('../models/targets')
const sendMail = require('./mailer.js')
var json2html = require('json2html')
const getTargets = async (req, res) => {
    try {
        const populated_targets = await req.user.populate('targets')
        return res.status(200).send({status: 200, data: {targets: populated_targets.targets}})

    } catch (error) {
        return res.send({error})
    }
}

const createTargets = async (req, res) => {
    try {
        req.body['user'] = req.user.id
        const target = await Target.create(req.body);

        req.user.targets.push(target);
        await req.user.save();
        return res.status(200).send({status: 200, data: {target}})

    } catch (error) {
        console.log(error)
        return res.send({error})
    }
}

const getReport = async(req, res) => {
    try {
        let target = await Target.find({name: req.params.targetName},"total_uptime total_downtime uptime downtime").exec()
        if(target.length){
            let reqFreqs    = [target[0].uptime.length, target[0].downtime.length],
            totalReqs       = reqFreqs[0]+reqFreqs[1],
            aveResponse     = (target[0]?.total_uptime + target[0]?.total_downtime)/totalReqs,
            reqPer          = (reqFreqs[0]/(totalReqs))*100,
            reportData      = {
                totalRequets: totalReqs,
                total_uptime: target[0]?.total_uptime,
                total_downtime: target[0]?.total_downtime,
                requestPercentage:`${reqPer.toFixed(2)}%`,
                averageResponseTime:aveResponse,
                numberOfUptimeRequests:reqFreqs[0],
                numberOfDowntimeRequests:reqFreqs[1],
                uptimeRequests:target[0]?.uptime,
                downtimeRequests:target[0]?.downtime
            }
            sendMail({ to: `${req.user.email}`,  subject:"monitor report", text:"monitor report", 
            html: `
            <h1>result of monitoring</h1>
            <br>
            ${json2html.render(reportData)}
            `
            })
            res.status(200).send(reportData)
        }
        return res.status(404).send("this target not found!...")
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
}

module.exports = {getTargets, createTargets,getReport}
