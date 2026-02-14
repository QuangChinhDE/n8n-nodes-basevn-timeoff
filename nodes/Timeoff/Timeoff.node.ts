import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as resources from './resources';

export class Timeoff implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Timeoff',
		name: 'timeoff',
		icon: 'file:../../icons/timeoff.svg',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN Timeoff API',
		defaults: {
			name: 'BaseVN - App Timeoff',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'timeoffApi',
				required: true,
			},
		],
		properties: [
			...resources.description,
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timeoff'],
					},
				},
				options: [
					{
						name: 'Get Timeoff',
						value: 'get',
						description: 'Get detailed information of a timeoff request',
						action: 'Get a timeoff',
					},
					{
						name: 'List Timeoffs',
						value: 'list',
						description: 'Get paginated list of timeoff records',
						action: 'List timeoffs',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get Group',
						value: 'get',
						description: 'Get detailed information of a group',
						action: 'Get a group',
					},
					{
						name: 'List Groups',
						value: 'list',
						description: 'Get all groups in the system',
						action: 'List groups',
					},
				],
				default: 'list',
			},
			...resources.timeoff.description,
			...resources.group.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'timeoff') {
					if (operation === 'list') {
						responseData = await resources.timeoff.list.execute.call(this, i);
					} else if (operation === 'get') {
						responseData = await resources.timeoff.get.execute.call(this, i);
					}
				} else if (resource === 'group') {
					if (operation === 'list') {
						responseData = await resources.group.list.execute.call(this, i);
					} else if (operation === 'get') {
						responseData = await resources.group.get.execute.call(this, i);
					}
				}

				if (responseData) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				}
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
