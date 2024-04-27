import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';

const prefix = 'instancetype-alarm';
const client = new EC2Client();

const describeInstances = async () => {
    let nextToken: string | undefined;

    try {
        do {
            const response = await client.send(new DescribeInstancesCommand({ NextToken: nextToken }));

            nextToken = response.NextToken;
        } while (nextToken);
    } catch (error: unknown) {}
};

const listRunningInstanceTypes = async () => {
    try {
        const response = await client.send(new DescribeInstancesCommand());
    } catch (error: unknown) {}
};
