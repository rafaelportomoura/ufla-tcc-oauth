key=$(aws --profile tcc --region us-east-2 cloudformation list-exports --query "Exports[?Name=='prod-tcc-encrypt-key-id'].Value" --output text)

aws --profile tcc --region us-east-2 kms encrypt --key-id $key --plaintext 'MTIzNDU2Nzg5QWJjZCE=' --encryption-algorithm "RSAES_OAEP_SHA_256" --output text --query CiphertextBlob > PASSWORD.txt