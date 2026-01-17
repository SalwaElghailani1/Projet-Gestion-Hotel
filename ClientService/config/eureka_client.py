from pyeureka.client import EurekaClient
import threading

# ----------------------------------------
# Eureka client config
# ----------------------------------------
eureka_client = EurekaClient(
    eureka_server="http://localhost:8761/eureka",
    app_name="FLASK-RESERVATION",
    instance_host="localhost",
    instance_port=8088,
    health_url="http://localhost:8088/health",
    home_page_url="http://localhost:8088/",
    status_page_url="http://localhost:8088/health",
    log_level="DEBUG"
)

# start Eureka client in background thread
def start_eureka():
    eureka_client.start()

threading.Thread(target=start_eureka).start()
