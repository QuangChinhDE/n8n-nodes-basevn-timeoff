import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { timeoffApiRequest } from '../../shared/transport';
import { processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['list'],
			},
		},
		default: 0,
		description: 'Page number (default 20 items per page)',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const page = this.getNodeParameter('page', index, 0) as number;

	const body = {
		page,
	};

	const response = await timeoffApiRequest.call(this, 'POST', '/group/list', body);
	const data = processResponse(response);

	return Array.isArray(data) ? data.map((item) => ({ json: item })) : [{ json: data }];
}
