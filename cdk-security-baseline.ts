import { Construct } from 'constructs';
import { CdkSecurityBaselineProps } from './cdk-security-baseline-props';
import { AlarmBaseline } from './lib/alarms/alarm-baseline';

export class CdkSecurityBaseline extends Construct {
  public readonly alarmBaseline: AlarmBaseline;

  constructor(scope: Construct, id: string, props: CdkSecurityBaselineProps) {
    super(scope, id);

    this.alarmBaseline = new AlarmBaseline(this, 'AlarmBaseline', {
      alarmDefinitions: props.alarmProps?.alarmOverrides,
      cloudtrailLogGroup: props.alarmProps.cloudTrailLogGroup,
      namespace: props.alarmProps?.cloudWatchMetricNamespace,
      enableExtras: props.alarmProps?.enableAlarmExtras,
      notificationTopic: props.alarmProps?.snsNotificationTopic,
    });
  }
}
