import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2-alpha';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput } from 'aws-cdk-lib';

export class WebSocketSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const connectionsTable = new Table(this, 'connections', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'connectionId',
        type: AttributeType.STRING,
      },
    });

    const defaultLambdaProps: NodejsFunctionProps = {
      environment: {
        CONNECTIONS_TABLE: connectionsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
    };

    const connectHandler = new NodejsFunction(this, 'connect-handler', {
      ...defaultLambdaProps,
    });
    connectionsTable.grantWriteData(connectHandler);

    const disconnectHandler = new NodejsFunction(this, 'disconnect-handler', {
      ...defaultLambdaProps,
    });
    connectionsTable.grantWriteData(disconnectHandler);

    const defaultHandler = new NodejsFunction(this, 'default-handler', {
      ...defaultLambdaProps,
    });
    connectionsTable.grantReadData(defaultHandler);

    const sendMessageHandler = new NodejsFunction(this, 'send-message-handler', {
      ...defaultLambdaProps,
    });
    connectionsTable.grantReadData(sendMessageHandler);

    const api = new WebSocketApi(this, 'web-socket-api', {
      description: 'Sample WebSocket Api',
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('connect', connectHandler),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration('disconnect', disconnectHandler),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration('default', defaultHandler),
      }
    });

    api.addRoute('sendmessage', {
      integration: new WebSocketLambdaIntegration('send-message', sendMessageHandler),
    });

    const stage = new WebSocketStage(this, 'prod', {
      webSocketApi: api,
      stageName: 'prod',
      autoDeploy: true,
    });

    api.grantManageConnections(sendMessageHandler);
    api.grantManageConnections(defaultHandler);

    new CfnOutput(this, 'WebSocketApi', {
      value: `${api.apiEndpoint}/${stage.stageName}`,
    });
  }
}
