import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const dynamoDB = new DynamoDB({});
const client = DynamoDBDocumentClient.from(dynamoDB);

const tableName = process.env.CONNECTIONS_TABLE;

export const handler = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify(event));

  const connections = await client.send(new ScanCommand({
    TableName: tableName,
  }));

  const message = JSON.parse(event.body || '{}').message;

  const apiGatewayClient = new ApiGatewayManagementApiClient({
    apiVersion: '2018-11-29',
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  });

  const sendMessageRequests = (connections.Items || []).map(async (item) => {
    if (item.connectionId !== event.requestContext.connectionId) {
      return await apiGatewayClient.send(new PostToConnectionCommand({
        ConnectionId: item.connectionId,
        Data: message,
      }));
    }
    return Promise.resolve();
  });

  await Promise.all(sendMessageRequests);

  return {
    statusCode: 200
  };
};
