import { IKey } from 'aws-cdk-lib/aws-kms';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { AlarmDefinitionList } from './alarm-baseline-config';

export interface AlarmBaselineProps {
  /**
   * Custom or overriding alarm definitions. If you with to override an existing definition, use the same name as is
   * in `AlarmDefinitionDefaults` in `alarm-baseline-config.ts`.
   */
  readonly alarmDefinitions?: AlarmDefinitionList;

  /**
   * The log group where CloudTrail events are logged
   */
  readonly cloudtrailLogGroup: ILogGroup;

  /**
   * Should we enable alarm extras?
   */
  readonly enableExtras?: boolean;

  /**
   * KMS Key to encrypt data at rest
   */
  readonly kmsKey?: IKey;

  /**
   * Optional namespace where CloudWatch metrics are created in
   */
  readonly namespace?: string;

  /**
   * Optional topic to which the alarms are sent to. If no topic is provided, a new topic will be created.
   */
  readonly notificationTopic?: ITopic;
}
