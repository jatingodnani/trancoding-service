const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const config = require("../config");

const dynamoClient = new DynamoDBClient({ region: config.awsRegion });

const createAssetItem = async (aid, uid) => {
  const command = new PutItemCommand({
    TableName: config.dynamoTableAsset,
    Item: {
      aid: { S: aid },
      uid: { S: uid },
      createdAt: { S: new Date().toISOString() },
      status: { S: "processing" },
    },
  });
  await dynamoClient.send(command);
  console.log(`DynamoDB item with aid=${aid} created successfully`);
};

module.exports = { createAssetItem };
