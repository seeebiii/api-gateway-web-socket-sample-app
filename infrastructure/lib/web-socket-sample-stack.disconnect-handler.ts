import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

const dynamoDB = new DynamoDB({});
const client = DynamoDBDocumentClient.from(dynamoDB);

const tableName = process.env.CONNECTIONS_TABLE;

export const handler = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify(event));

  await client.send(new DeleteCommand({
    TableName: tableName,
    Key: {
      connectionId: event.requestContext.connectionId,
    }
  }));

  return {
    statusCode: 200
  };
};
