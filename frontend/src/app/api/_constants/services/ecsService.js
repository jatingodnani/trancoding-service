import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import config from "../config";
import { fromEnv } from "@aws-sdk/credential-providers";
const ecsClient = new ECSClient({
  region: config.awsRegion,
  credentials: fromEnv(),
});

export const startEcsTask = async (uid, aid, mime) => {
  const environment = [
    { name: "INPUT_BUCKET_NAME", value: config.inputBucketName },
    { name: "OUTPUT_BUCKET_NAME", value: config.outputBucketName },
    { name: "REDIS_URI", value: config.redisUri },
    { name: "OUTPUT_DIRECTORY", value: config.outputBucketDirectory },
    { name: "USER_ID", value: uid },
    { name: "ASSET_ID", value: aid },
    { name: "FILE_MIME_TYPE", value: mime },
    { name: "TRIGGER_ENDPOINT_URL", value: config.triggerEndpointUrl },
    { name: "ASSET_TABLE_NAME", value: config.dynamoTableAsset },
  ];
  const params = {
    cluster: config.ecsClusterName,
    taskDefinition: config.ecsTaskDefinitionName,
    overrides: {
      containerOverrides: [
        {
          name: config.ecsTaskContainerName,
          environment,
        },
      ],
    },
    count: 1,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: config.ecsTaskSubnets,
        assignPublicIp: "ENABLED",
      },
    },
  };

  const command = new RunTaskCommand(params);
  const data = await ecsClient.send(command);
  console.log(environment);
  console.log("ECS task started successfully:");
  return data;
};
