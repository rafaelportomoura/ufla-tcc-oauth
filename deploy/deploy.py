from scripts.typescript import Typescript
from scripts.cloudformation import CloudFormation
from scripts.args import get_args

args = get_args(
    {
        "stage": {"type": "str", "required": False, "default": "prod"},
        "microservice": {"type": "str", "required": False, "default": "oauth"},
        "tenant": {"type": "str", "required": False, "default": "tcc"},
        "region": {"type": "str", "required": False, "default": "us-east-2"},
        "profile": {"type": "str", "required": False, "default": "default"},
        "log_level": {"type": "int", "required": False, "default": 3},
    }
)

microservice = args["microservice"]
stage = args["stage"]
tenant = args["tenant"]
region = args["region"]
profile = args["profile"]
log_level = args["log_level"]

