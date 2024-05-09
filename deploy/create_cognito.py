from scripts.cloudformation import CloudFormation
from scripts.args import get_args
from stacks import cognito
from scripts.exception import DeployException

args = get_args(
    {
        "stage": {"type": "str", "required": False, "default": "prod"},
        "microservice": {"type": "str", "required": False, "default": "oauth"},
        "tenant": {"type": "str", "required": False, "default": "tcc"},
        "region": {"type": "str", "required": False, "default": "us-east-2"},
        "profile": {"type": "str", "required": False, "default": "default"},
        "log_level": {"type": "int", "required": False, "default": 3}
    }
)

microservice = args["microservice"]
stage = args["stage"]
tenant = args["tenant"]
region = args["region"]
profile = args["profile"]
log_level = args["log_level"]
account_id = args["account_id"]

cloudformation = CloudFormation(profile=profile, region=region, log_level=log_level)

################################################
# 🚀 COGNITO
################################################
COGNITO_STACK = cognito.stack(stage=stage, tenant=tenant)
cloudformation.deploy_stack(stack=COGNITO_STACK)

if not cloudformation.stack_is_succesfully_deployed(stack_name=COGNITO_STACK["stack_name"]):
    raise DeployException(stack=COGNITO_STACK)