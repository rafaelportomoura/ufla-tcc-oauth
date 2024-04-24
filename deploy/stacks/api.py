from stacks.template_path import path
from scripts.stacks import Stack, stack_name


def my_stack_name(stage: str, tenant: str) -> str:
    return stack_name(stage=stage, tenant=tenant, name="OAuth-Network")


def stack(
    stage: str,
    tenant: str,
    microservice: str,
    base_path: str,
    listener_arn: str,
    authorizer_result_ttl_in_seconds: int,
    log_level: str
) -> Stack:
    return Stack(
        template=path("stacks", "network.yaml"),
        stack_name=my_stack_name(stage, tenant),
        parameters={
            "Stage": stage,
            "Tenant": tenant,
            "Microservice": microservice,
            "ApiBasePath": base_path,
            "ListenerArn": listener_arn,
            "AuthorizerResultTtlInSeconds": authorizer_result_ttl_in_seconds,
            "LogLevel": log_level
        }
    )
