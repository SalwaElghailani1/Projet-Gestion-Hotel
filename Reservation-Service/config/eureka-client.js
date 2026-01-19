const { Eureka } = require('eureka-js-client');

const client = new Eureka({
    instance: {
        app: process.env.EUREKA_APP_NAME,
        hostName: process.env.EUREKA_INSTANCE_HOSTNAME,
        ipAddr: process.env.EUREKA_INSTANCE_HOSTNAME,
        port: { '$': Number(process.env.EUREKA_INSTANCE_PORT), '@enabled': true },
        vipAddress: 'reservation-service',
        healthCheckUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME}:${process.env.EUREKA_INSTANCE_PORT}/health`,
        statusPageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME}:${process.env.EUREKA_INSTANCE_PORT}/health`,
        homePageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME}:${process.env.EUREKA_INSTANCE_PORT}/`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        }
    },
    eureka: {
        host: process.env.EUREKA_HOST,
        port: Number(process.env.EUREKA_PORT),
        servicePath: process.env.EUREKA_SERVICE_PATH,
        registerWithEureka: true,
        fetchRegistry: true
    }
});

client.start();
module.exports = client;
