import { Duration } from 'aws-cdk-lib';

export interface AlarmThreshold {
  readonly threshold?: number;
  readonly period?: Duration;
}

export interface AlarmDefinition extends AlarmThreshold {
  readonly description: string;
  readonly enabled?: boolean;
  readonly pattern: string;
}

export const AlarmDefaults = {
  enabled: true,
  threshold: 1,
  period: Duration.minutes(5),
};

export interface AlarmDefinitionList extends Record<string, AlarmDefinition> {}

export const AlarmBaselineNamespace = 'default';

export const AlarmDefinitionDefaults: AlarmDefinitionList = {
  UnauthorizedAPICalls: {
    description:
      'Monitoring unauthorized API calls will help reveal application errors and may reduce time to detect malicious activity.',
    pattern:
      '{(($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*")) && (($.sourceIPAddress!="delivery.logs.amazonaws.com") && ($.eventName!="HeadBucket"))}',
  },
  NoMFAConsoleSignin: {
    description:
      'Monitoring for single-factor console logins will increase visibility into accounts that are not protected by MFA.',
    pattern:
      '{($.eventName = "ConsoleLogin") && ($.additionalEventData.MFAUsed != "Yes") && ($.userIdentity.type = "IAMUser") && ($.responseElements.ConsoleLogin = "Success") }',
  },
  RootUsage: {
    description:
      'Monitoring for root account logins will provide visibility into the use of a fully privileged account and an opportunity to reduce the use of it.',
    pattern:
      '{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }',
  },
  IAMChanges: {
    description:
      'Monitoring changes to IAM policies will help ensure authentication and authorization controls remain intact.',
    pattern:
      '{($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}',
  },
  CloudTrailCfgChanges: {
    description:
      "Monitoring changes to CloudTrail's configuration will help ensure sustained visibility to activities performed in the AWS account.",
    pattern:
      '{($.eventName = CreateTrail) || ($.eventName = UpdateTrail) || ($.eventName = DeleteTrail) || ($.eventName = StartLogging) || ($.eventName = StopLogging)}',
  },
  ConsoleSigninFailures: {
    description:
      'Monitoring failed console logins may decrease lead time to detect an attempt to brute force a credential, which may provide an indicator, such as source IP, that can be used in other event correlation.',
    pattern: '{($.eventName = ConsoleLogin) && ($.errorMessage = "Failed authentication")}',
  },
  DisableOrDeleteCMK: {
    description:
      'Monitoring failed console logins may decrease lead time to detect an attempt to brute force a credential, which may provide an indicator, such as source IP, that can be used in other event correlation.',
    pattern:
      '{($.eventSource = kms.amazonaws.com) && (($.eventName = DisableKey) || ($.eventName = ScheduleKeyDeletion))}',
  },
  S3BucketPolicyChanges: {
    description:
      'Monitoring changes to S3 bucket policies may reduce time to detect and correct permissive policies on sensitive S3 buckets.',
    pattern:
      '{($.eventSource = s3.amazonaws.com) && (($.eventName = PutBucketAcl) || ($.eventName = PutBucketPolicy) || ($.eventName = PutBucketCors) || ($.eventName = PutBucketLifecycle) || ($.eventName = PutBucketReplication) || ($.eventName = DeleteBucketPolicy) || ($.eventName = DeleteBucketCors) || ($.eventName = DeleteBucketLifecycle) || ($.eventName = DeleteBucketReplication))}',
  },
  AWSConfigChanges: {
    description:
      'Monitoring changes to AWS Config configuration will help ensure sustained visibility of configuration items within the AWS account.',
    pattern:
      '{($.eventSource = config.amazonaws.com) && (($.eventName=StopConfigurationRecorder)||($.eventName=DeleteDeliveryChannel)||($.eventName=PutDeliveryChannel)||($.eventName=PutConfigurationRecorder))}',
  },
  SecurityGroupChanges: {
    description:
      'Monitoring changes to security group will help ensure that resources and services are not unintentionally exposed.',
    pattern:
      '{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup)}',
  },
  NACLChanges: {
    description:
      'Monitoring changes to NACLs will help ensure that AWS resources and services are not unintentionally exposed.',
    pattern:
      '{($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation)}',
  },
  NetworkGWChanges: {
    description:
      'Monitoring changes to network gateways will help ensure that all ingress/egress traffic traverses the VPC border via a controlled path.',
    pattern:
      '{($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway)}',
  },
  RouteTableChanges: {
    description:
      'Monitoring changes to route tables will help ensure that all VPC traffic flows through an expected path.',
    pattern:
      '{ ($.eventName = CreateRoute) || ($.eventName = CreateRouteTable) || ($.eventName = ReplaceRoute) || ($.eventName = ReplaceRouteTableAssociation) || ($.eventName = DeleteRouteTable) || ($.eventName = DeleteRoute) || ($.eventName = DisassociateRouteTable) }',
  },
  VPCChanges: {
    description: 'Monitoring changes to VPC will help ensure that all VPC traffic flows through an expected path.',
    pattern:
      '{($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink)}',
  },
  OrganizationsChanges: {
    description:
      'Monitoring AWS Organizations changes can help you prevent any unwanted, accidental or intentional modifications that may lead to unauthorized access or other security breaches.',
    pattern:
      '{($.eventSource = organizations.amazonaws.com) && (($.eventName = "AcceptHandshake") || ($.eventName = "AttachPolicy") || ($.eventName = "CreateAccount") || ($.eventName = "CreateOrganizationalUnit") || ($.eventName= "CreatePolicy") || ($.eventName = "DeclineHandshake") || ($.eventName = "DeleteOrganization") || ($.eventName = "DeleteOrganizationalUnit") || ($.eventName = "DeletePolicy") || ($.eventName = "DetachPolicy") || ($.eventName = "DisablePolicyType") || ($.eventName = "EnablePolicyType") || ($.eventName = "InviteAccountToOrganization") || ($.eventName = "LeaveOrganization") || ($.eventName = "MoveAccount") || ($.eventName = "RemoveAccountFromOrganization") || ($.eventName = "UpdatePolicy") || ($.eventName ="UpdateOrganizationalUnit"))}',
  },
};

export const AlarmDefinitionExtras: AlarmDefinitionList = {
  RequestCertificate: {
    description: 'Monitoring new certificate requests',
    pattern: '{ $.eventName = RequestCertificate }',
  },
  SendCommand: {
    // Use `aws ssm list-command-invocations` with "CommandId": "cmd-1234567890abcdef" to review the results
    description: 'Monitoring use of SSM SendCommand.',
    pattern: '{ $.eventName = SendCommand }',
  },
};
