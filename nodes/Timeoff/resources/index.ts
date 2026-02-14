import type { INodeProperties } from 'n8n-workflow';

export * as group from './group';
export * as timeoff from './timeoff';

const resourceDescription: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Group',
			value: 'group',
		},
		{
			name: 'Timeoff',
			value: 'timeoff',
		},
	],
	default: 'timeoff',
};

export const description: INodeProperties[] = [resourceDescription];
