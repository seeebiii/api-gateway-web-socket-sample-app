import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import {
  ApiGatewayManagementApiClient,
  GetConnectionCommand,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

export const handler = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log(JSON.stringify(event));

  const apiGatewayClient = new ApiGatewayManagementApiClient({
    apiVersion: '2018-11-29',
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  });

  const connectionInfo = await apiGatewayClient.send(new GetConnectionCommand({ ConnectionId: event.requestContext.connectionId }));

  await apiGatewayClient.send(new PostToConnectionCommand({
    ConnectionId: event.requestContext.connectionId,
    Data: Buffer.from(`Use the sendmessage route to send a message. 
    Your info: ${JSON.stringify(connectionInfo)}`),
  }));

  return {
    statusCode: 200
  };
};
