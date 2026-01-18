import threading
import logging
from py_eureka_client import eureka_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_eureka():
    try:
        eureka_client.init(
            eureka_server="http://localhost:8761/eureka",
            app_name="PAIEMENT-SERVICE",
            instance_port=8090,
            instance_host="localhost",
            renewal_interval_in_secs=30,
            duration_in_secs=90
        )
        logger.info("✅ PAIEMENT-SERVICE registered in Eureka")
    except Exception as e:
        logger.error(f"❌ Eureka registration failed: {e}")

eureka_thread = threading.Thread(target=start_eureka, daemon=True)
eureka_thread.start()
