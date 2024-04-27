import { Stack } from 'aws-cdk-lib';
import { Alarm, ComparisonOperator, Stats, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { MetricFilter } from 'aws-cdk-lib/aws-logs';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import {
  AlarmBaselineNamespace,
  AlarmDefaults,
  AlarmDefinitionDefaults,
  AlarmDefinitionExtras,
  AlarmDefinitionList,
} from './alarm-baseline-config';
import { AlarmBaselineProps } from './alarm-baseline-props';

export class AlarmBaseline extends Construct {
  public readonly alarms: AlarmDefinitionList;
  public readonly props: AlarmBaselineProps;
  public readonly topic: ITopic;

  constructor(scope: Construct, id: string, props: AlarmBaselineProps) {
    super(scope, id);

    this.props = props;

    this.alarms = {
      ...AlarmDefinitionDefaults,
      ...(props.enableExtras ? AlarmDefinitionExtras : {}),
      ...(props.alarmDefinitions != null ? props.alarmDefinitions : {}),
    };

    this.topic = props.notificationTopic ? props.notificationTopic : this.createSnsTopic('Topic', props.kmsKey);

    this.createAlarms(this.topic, this.alarms, props);
  }

  private createSnsTopic(id: string, kmsKey?: IKey): ITopic {
    const topic = new Topic(this, id, {
      displayName: 'cdk-alarm-baseline-notification-topic',
      enforceSSL: true,
      masterKey: kmsKey,
    });

    topic.addToResourcePolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        conditions: {
          ArnLike: {
            'aws:SourceArn': `arn:${Stack.of(this).partition}:cloudwatch:${Stack.of(this).region}:${Stack.of(this).account}:alarm:*`,
          },
        },
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudwatch.amazonaws.com')],
        resources: [topic.topicArn],
      })
    );

    return topic;
  }

  private createAlarms(topic: ITopic, alarms: AlarmDefinitionList, props: AlarmBaselineProps): void {
    const action = new SnsAction(topic);

    Object.entries(alarms).forEach(([alarmName, alarmDefinition]) => {
      if (alarmDefinition.enabled != null ? alarmDefinition.enabled : AlarmDefaults.enabled) {
        const filter = new MetricFilter(this, `${alarmName}Filter`, {
          filterName: alarmName,
          filterPattern: { logPatternString: alarmDefinition.pattern },
          logGroup: props.cloudtrailLogGroup,
          metricName: alarmName,
          metricNamespace: props.namespace || AlarmBaselineNamespace,
          metricValue: '1',
        });

        const alarm = new Alarm(this, `${alarmName}Alarm`, {
          alarmName: alarmName,
          alarmDescription: alarmDefinition.description,
          comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          evaluationPeriods: 1,
          metric: filter.metric({
            period: alarmDefinition.period || AlarmDefaults.period,
            statistic: Stats.SUM,
          }),
          treatMissingData: TreatMissingData.NOT_BREACHING,
          threshold: alarmDefinition.threshold || AlarmDefaults.threshold,
        });

        alarm.addAlarmAction(action);
      }
    });
  }
}
