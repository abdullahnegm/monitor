const axios = require('axios').default;
const cron = require('node-cron');

async function createCronJob() {
    try {
        let urlOptions = {protocol, url, port, path} = this
        cron.schedule(this.interval, async () => {
            let start = Date.now()
            let response = await axios[ this.method ](generateCronJobURI(urlOptions))
            console.log("->>>>>>>>>", typeof (typeof this))
            let end = Date.now()
            let total_time = end - start
            if ( 300 > response.status && response.status >= 200 ) {
                this.uptime.push({
                    time: total_time,
                    status: response.status
                })
                this.total_uptime = this.total_uptime + total_time
                this.current_threshold = 0

            } else {
                this.downtime.push({
                    time: total_time,
                    status: response.status
                })
                this.total_downtime = this.total_downtime + total_time
                this.current_threshold = this.current_threshold + 1

            }
            let lol = await this.save()
            }, {
            scheduled: true,
            }
        );
        return true

    } catch (error) {
        console.log(error)
    }
}

const generateCronJobTimeFormat = (interval) => {
    return `*/${interval} * * * *`
}

const generateCronJobURI = (urlOptions) => {
    let generatedUrl = `${urlOptions.protocol.toLowerCase()}://${urlOptions.url}`;
    generatedUrl += (urlOptions.port) ? `:${urlOptions.port}/` : ''
    generatedUrl += (urlOptions.path) ? `${urlOptions.path}` : ''
    return generatedUrl
}


module.exports = {
    createCronJob,
    generateCronJobTimeFormat
}