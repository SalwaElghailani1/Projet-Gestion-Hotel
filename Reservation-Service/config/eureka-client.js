const { Eureka } = require('eureka-js-client');

const eurekaClient = new Eureka({
    instance: {
        app: 'RESERVATION-SERVICE',
        instanceId: 'reservation-service:3000',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        preferIpAddress: false,
        port: { '$': 3000, '@enabled': true },
        vipAddress: 'reservation-service',
        homePageUrl: 'http://localhost:3000/',
        statusPageUrl: 'http://localhost:3000/health',
        healthCheckUrl: 'http://localhost:3000/health',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
        leaseInfo: { renewalIntervalInSecs: 30, durationInSecs: 90 }
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
        registerWithEureka: true,
        fetchRegistry: false
    }
});

module.exports = eurekaClient;
