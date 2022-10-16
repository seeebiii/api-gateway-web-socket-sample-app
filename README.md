# Api Gateway WebSocket Sample App

This repository provides a basic example of a WebSocket app using Api Gateway.
It is based on this tutorial from the AWS Docs:
https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html

## How to use

1. Install CDK
2. Deploy infrastructure: `cd infrastructure && cdk deploy` -> note `WebSocketApi` output
3. Open [`index.html`](index.html) in two browser tabs
4. Enter WebSocket Api Url and connect in both tabs
5. Send a message and see it appear in the other browser tab
