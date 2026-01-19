import os
from pyeureka.client import EurekaClient
import threading

# Environment variables (set in K8s deployment)
EUREKA_HOST = os.environ.get("EUREKA_HOST", "discovery-service")
EUREKA_PORT = os.environ.get("EUREKA_PORT", "8761")
EUREKA_APP_NAME = os.environ.get("EUREKA_APP_NAME", "CLIENT-SERVICE")
INSTANCE_HOSTNAME = os.environ.get("EUREKA_INSTANCE_HOSTNAME", "client-service")
INSTANCE_PORT = int(os.environ.get("EUREKA_INSTANCE_PORT", 8088))

# ----------------------------------------
# Eureka client config
# ----------------------------------------
eureka_client = EurekaClient(
    eureka_server=f"http://{EUREKA_HOST}:{EUREKA_PORT}/eureka",
    app_name=EUREKA_APP_NAME,
    instance_host=INSTANCE_HOSTNAME,
    instance_port=INSTANCE_PORT,
    health_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/health",
    home_page_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/",
    status_page_url=f"http://{INSTANCE_HOSTNAME}:{INSTANCE_PORT}/health",
    log_level="DEBUG"
)

# Start Eureka client in background thread
def start_eureka():
    eureka_client.start()

threading.Thread(target=start_eureka).start()
