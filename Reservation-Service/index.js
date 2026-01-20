const express = require('express');
const bodyParser = require('body-parser');
const reservationRoutes = require('./routes/reservation');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const eurekaClient = require('./config/eureka-client');

// ✅ Prometheus
const client = require('prom-client');

const app = express();
const PORT = 3000;

// =======================
// Middlewares
// =======================
app.use(bodyParser.json());

// ✅ CORS (Angular frontend)
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// =======================
// Prometheus Metrics
// =======================

// Default metrics (CPU, memory, event loop…)
client.collectDefaultMetrics({
    prefix: 'reservation_service_'
});

// Custom HTTP requests counter
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// Middleware to count requests
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestsTotal.inc({
            method: req.method,
            route: req.originalUrl,
            status: res.statusCode
        });
    });
    next();
});

// =======================
// Health check (K8s probes)
// =======================
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// =======================
// Prometheus endpoint
// =======================
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// =======================
// Swagger
// =======================
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Reservation Microservice',
            version: '1.0.0'
        },
        servers: [
            { url: 'http://reservation-service:3000/api' }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================
// Routes
// =======================
app.use('/api', reservationRoutes);

// =======================
// Start server + Eureka
// =======================
app.listen(PORT, () => {
    console.log(`🚀 Reservation microservice running on port ${PORT}`);

    eurekaClient.start(err => {
        if (err) {
            console.error('❌ Eureka registration failed:', err);
        } else {
            console.log('✅ Registered with Eureka');
        }
    });
});
