module.exports = {
  awsRegion: process.env.AWS_REGION,
  ecsClusterName: process.env.AWS_ECS_CLUSTER_NAME,
  ecsTaskDefinitionName: process.env.AWS_ECS_TASK_DEFINITION_NAME,
  ecsTaskContainerName: process.env.AWS_ECS_TASK_CONTAINER_NAME,
  inputBucketName: process.env.AWS_INPUT_BUCKET_NAME,
  outputBucketName: process.env.AWS_OUTPUT_BUCKET_NAME,
  outputBucketDirectory: process.env.AWS_OUTPUT_BUCKET_DIRECTORY,
  dynamoTableAsset: process.env.DYNAMO_TABLE_ASSET,
  triggerEndpointUrl: process.env.TRIGGER_ENDPOINT_URL,
  ecsTaskSubnets: [
    process.env.AWS_ECS_TASK_SUBNET_1,
    process.env.AWS_ECS_TASK_SUBNET_2,
    process.env.AWS_ECS_TASK_SUBNET_3,
  ],
  redisUri: process.env.REDIS_URI,
};
