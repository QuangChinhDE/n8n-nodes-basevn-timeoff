import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { timeoffApiRequest } from '../../shared/transport';
import { processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['get'],
			},
		},
		default: 0,
		description: 'ID of the group',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as number;

	const body = {
		id: groupId,
	};

	const response = await timeoffApiRequest.call(this, 'POST', '/group/get', body);
	const data = processResponse(response);

	return [{ json: Array.isArray(data) ? data[0] : data }];
}
