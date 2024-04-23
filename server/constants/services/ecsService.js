const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const config = require("../config");
const { fromEnv } = require("@aws-sdk/credential-providers");
const ecsClient = new ECSClient({
  region: config.awsRegion,
  credentials: fromEnv(),
});

const startEcsTask = async (inputFileKey, uid, aid) => {
  const environment = [
    { name: "INPUT_BUCKET_NAME", value: config.inputBucketName },
    { name: "OUTPUT_BUCKET_NAME", value: config.outputBucketName },
    { name: "INPUT_FILE_KEY", value: inputFileKey },
    { name: "OUTPUT_DIRECTORY", value: config.outputBucketDirectory },
    { name: "USER_ID", value: uid },
    { name: "ASSET_ID", value: aid },
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

module.exports = { startEcsTask };
