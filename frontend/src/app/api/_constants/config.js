module.exports = {
  awsRegion: process.env.XAWS_REGION,
  ecsClusterName: process.env.XAWS_ECS_CLUSTER_NAME,
  ecsTaskDefinitionName: process.env.XAWS_ECS_TASK_DEFINITION_NAME,
  ecsTaskContainerName: process.env.XAWS_ECS_TASK_CONTAINER_NAME,
  inputBucketName: process.env.XAWS_INPUT_BUCKET_NAME,
  outputBucketName: process.env.XAWS_OUTPUT_BUCKET_NAME,
  outputBucketDirectory: process.env.XAWS_OUTPUT_BUCKET_DIRECTORY,
  dynamoTableAsset: process.env.DYNAMO_TABLE_ASSET,
  triggerEndpointUrl: process.env.TRIGGER_ENDPOINT_URL,
  ecsTaskSubnets: [
    process.env.XAWS_ECS_TASK_SUBNET_1,
    process.env.XAWS_ECS_TASK_SUBNET_2,
    process.env.XAWS_ECS_TASK_SUBNET_3,
  ],
  redisUri: process.env.REDIS_URI,
};
