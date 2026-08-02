import sys

sys.path.insert(0, "d:/AIVOA-Customer-Complaint-System/backend")

# Importing app.main executes module-level code (FastAPI app construction)
from app.main import app  # noqa: E402

route_count = len(app.routes)
print("FastAPI app imported OK")
print("route objects:", route_count)
print("APP START CHECK PASSED")


