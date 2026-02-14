import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class TimeoffTrigger implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Timeoff Trigger',
		name: 'timeoffTrigger',
		icon: 'file:../../icons/timeoff.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when BaseVN Timeoff webhook events occur',
		defaults: {
			name: 'BaseVN Timeoff Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["path"]}}',
			},
		],
		properties: [
			{
				displayName: 'Webhook Path',
				name: 'path',
				type: 'string',
				default: 'webhook',
				required: true,
				placeholder: 'webhook',
				description: 'The path for the webhook URL. Leave as default or customize it.',
			},
			{
				displayName: 'Response Selector',
				name: 'responseSelector',
				type: 'options',
				options: [
					{
						name: 'Full Payload',
						value: '',
						description: 'Return complete webhook payload',
					},
					{
						name: 'Body Only',
						value: 'body',
						description: 'Return only the body data',
					},
					{
						name: 'Leave Request Info',
						value: 'leaveInfo',
						description: 'Return simplified leave request information',
					},
				],
				default: 'body',
				description: 'Select which data to return from webhook',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const responseSelector = this.getNodeParameter('responseSelector', '') as string;

		// Process response based on selector
		let returnData: IDataObject = bodyData;

		if (responseSelector === 'leaveInfo') {
			// Return simplified leave request information
			returnData = {
				id: bodyData.id,
				user_id: bodyData.user_id,
				username: bodyData.username,
				leave_type: bodyData.leave_type,
				leave_type_name: bodyData.leave_type_name,
				from_date: bodyData.from_date,
				to_date: bodyData.to_date,
				duration: bodyData.duration,
				reason: bodyData.reason,
				status: bodyData.status,
				approver_id: bodyData.approver_id,
				approver_name: bodyData.approver_name,
				approved_at: bodyData.approved_at,
				created_at: bodyData.created_at,
				updated_at: bodyData.updated_at,
				link: bodyData.link,
			};
		} else if (responseSelector === '') {
			// Return full payload including headers
			const headerData = this.getHeaderData();
			returnData = {
				headers: headerData,
				body: bodyData,
			};
		}
		// else: Return body only (default) - returnData is already bodyData

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
