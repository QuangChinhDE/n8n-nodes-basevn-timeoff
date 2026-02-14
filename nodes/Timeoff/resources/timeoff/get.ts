import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { timeoffApiRequest } from '../../shared/transport';
import { processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Timeoff ID',
		name: 'timeoffId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeoff'],
				operation: ['get'],
			},
		},
		default: 0,
		description: 'ID of the timeoff request',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const timeoffId = this.getNodeParameter('timeoffId', index) as number;

	const body = {
		id: timeoffId,
	};

	const response = await timeoffApiRequest.call(this, 'POST', '/timeoff/get', body);
	const data = processResponse(response);

	return [{ json: Array.isArray(data) ? data[0] : data }];
}
