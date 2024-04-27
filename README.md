# cdk-security-baseline

A CDK Construct for setting up foundational security features on your AWS account. The construct is based on [Terraform
AWS Secure Baseline](https://github.com/nozaq/terraform-aws-secure-baseline/). The focus is _for the time being_ in
implementation of alarms on certain dangerous events. The alarm baseline follows the Terraform baseline with optional
_extras_ which can be enabled with `enableAlarmExtras`.

## This is a work in progress.

NPM deployment will come at some point.

# Usage

Basic usage is described below. There are multiple customizable properties in `CdkSecurityBaselineProps`.

```ts
import { App, Stack } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { CdkSecurityBaseline } from 'cdk-security-baseline';
import { Construct } from 'constructs';

class CdkSecurityBaselineStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const logGroup = new LogGroup(this, 'LogGroup');
    new CdkSecurityBaseline(this, 'CdkSecurityBaseline', {
      alarmProps: {
        cloudTrailLogGroup: logGroup,
        enableAlarmExtras: true,
      },
    });
  }
}

const app = new App();
new CdkSecurityBaselineStack(app, 'CdkSecurityBaselineStack');
app.synth();
```