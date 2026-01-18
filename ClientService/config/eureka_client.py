import threading
import logging
from py_eureka_client import eureka_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_with_eureka():
    try:
        eureka_client.init(
            eureka_server="http://localhost:8761/eureka",
            app_name="CLIENT-SERVICE",
            instance_port=8088,
            instance_host="localhost",
            renewal_interval_in_secs=30,
            duration_in_secs=90
        )
        logger.info("✅ Registered with Eureka successfully")
    except Exception as e:
        logger.error(f"❌ Failed to register with Eureka: {e}")

def start_eureka():
    thread = threading.Thread(target=register_with_eureka, daemon=True)
    thread.start()
