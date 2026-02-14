import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { timeoffApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Users',
		name: 'users',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['timeoff'],
				operation: ['list'],
			},
		},
		default: '',
		description: 'Filter by creator username (comma-separated)',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['timeoff'],
				operation: ['list'],
			},
		},
		default: 0,
		description: 'Page index (start from 0)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeoff'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'End Date From',
				name: 'end_date_from',
				type: 'string',
				default: '',
				placeholder: '01/01/2024',
				description: 'End date from (DD/MM/YYYY)',
			},
			{
				displayName: 'End Date To',
				name: 'end_date_to',
				type: 'string',
				default: '',
				placeholder: '31/12/2024',
				description: 'End date to (DD/MM/YYYY)',
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search by name',
			},
			{
				displayName: 'Start Date From',
				name: 'start_date_from',
				type: 'string',
				default: '',
				placeholder: '01/01/2024',
				description: 'Start date from (DD/MM/YYYY)',
			},
			{
				displayName: 'Start Date To',
				name: 'start_date_to',
				type: 'string',
				default: '',
				placeholder: '31/12/2024',
				description: 'Start date to (DD/MM/YYYY)',
			},
			{
				displayName: 'Status',
				name: 's',
				type: 'options',
				default: 'approved',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Confirmed', value: 'confirmed' },
					{ name: 'Overdue', value: 'overdue' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Rejected', value: 'rejected' },
					{ name: 'Unconfirmed', value: 'unconfirmed' },
					{ name: 'Warning', value: 'warning' },
				],
				description: 'Filter by status',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const users = this.getNodeParameter('users', index, '') as string;
	const page = this.getNodeParameter('page', index, 0) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = cleanBody({
		users,
		page,
		...additionalFields,
	});

	const response = await timeoffApiRequest.call(this, 'POST', '/timeoff/list', body);
	const data = processResponse(response);

	return Array.isArray(data) ? data.map((item) => ({ json: item })) : [{ json: data }];
}
