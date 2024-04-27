import { IKey } from 'aws-cdk-lib/aws-kms';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { AlarmDefinitionList } from './lib/alarms/alarm-baseline-config';

export interface CdkSecurityBaselineAlarmProps {
  /**
   * Definitions of alarm overrides. Enables customization of alarm attribues on a per-alarm basis. If extras are enabled, this can be used to override them as well.
   * @default undefined
   */
  alarmOverrides?: AlarmDefinitionList;

  /**
   * The CloudWatch log group where CloudTrail trails sends events, and from where we should look for them.
   */
  cloudTrailLogGroup: ILogGroup;

  /**
   * The CloudWatch metric namespace where all alarms are created in.
   * @default Default
   */
  cloudWatchMetricNamespace?: string;

  /**
   * There are few extra alarms compared to those in https://github.com/nozaq/terraform-aws-secure-baseline. This flag can be used to enable/disable them.
   * @default false
   */
  enableAlarmExtras?: boolean;

  /**
   * The SNS Topic where notifications are sent. Make sure the topic resource policy permits `cloudwatch.amazonaws.com` to send messages to it.
   * @default A new topic is created
   */
  snsNotificationTopic?: ITopic;
}

export interface CdkSecurityBaselineProps {
  /**
   * Alias of KMS key used to encrypt data at rest. Same key will be used
   * everywhere (SNS, S3 etc.). If a key is not provided, default AWS managed
   * encryption keys are used.
   */
  kmsKey?: IKey;

  alarmProps: CdkSecurityBaselineAlarmProps;
}
