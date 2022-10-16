#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebSocketSampleStack } from '../lib/web-socket-sample-stack';

const app = new cdk.App();
new WebSocketSampleStack(app, 'websocket-sample');
