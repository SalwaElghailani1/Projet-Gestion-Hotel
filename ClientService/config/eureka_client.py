import os
from py_eureka_client import eureka_client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables set in Deployment YAML
EUREKA_HOST = os.environ.get("EUREKA_HOST", "discovery-service")
EUREKA_PORT = os.environ.get("EUREKA_PORT", "8761")
EUREKA_APP_NAME = os.environ.get("EUREKA_APP_NAME", "CLIENT-SERVICE")
INSTANCE_HOSTNAME = os.environ.get("EUREKA_INSTANCE_HOSTNAME", "client-service")
INSTANCE_PORT = int(os.environ.get("EUREKA_INSTANCE_PORT", 8088))

# Initialize Eureka client
try:
    eureka_client.init(
        eureka_server=f"http://{EUREKA_HOST}:{EUREKA_PORT}/eureka",
        app_name=EUREKA_APP_NAME,
        instance_port=INSTANCE_PORT,
        instance_host=INSTANCE_HOSTNAME,
        health_check_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/health",
        home_page_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/",
        status_page_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/health",
        renewal_interval_in_secs=30,
        duration_in_secs=90
    )
    logger.info("✅ Registered with Eureka successfully")
except Exception as e:
    logger.error(f"❌ Failed to register with Eureka: {e}")
