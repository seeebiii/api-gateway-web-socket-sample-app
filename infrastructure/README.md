# Infrastructure

Deploys the infrastructure for this WebSocket sample app.

- a DynamoDB table to store client connection id's
- a Lambda Function to store connections (`connect-handler`)
- a Lambda Function to remove connections (`disconnect-handler`)
- a Lambda Function to serve the default route (`default-handler`)
- a Lambda Function to send a message to other connections (`sendmessage-handler`)

## Useful commands

* `yarn build`   compile typescript to js
* `yarn watch`   watch for changes and compile
* `yarn test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
