import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import config from "../config";

const dynamoClient = new DynamoDBClient({ region: config.awsRegion });

export const createAssetItem = async (aid, uid) => {
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

export const getAssets = async (uid) => {
  const command = new ScanCommand({
    TableName: config.dynamoTableAsset,
    FilterExpression: "uid = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: uid },
    },
  });

  try {
    const result = await dynamoClient.send(command);
    return result.Items; // Returns all items in the table
  } catch (error) {
    console.error("Error fetching all assets:", error);
    return []; // Return an empty array in case of error
  }
};
