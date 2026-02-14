import type { IExecuteFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';

export async function timeoffApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('timeoffApi');
	const domain = credentials.domain as string;
	const accessToken = credentials.accessToken as string;

	const url = `https://timeoff.${domain}/extapi/v1${endpoint}`;

	const requestBody = {
		access_token: accessToken,
		...body,
	};

	const options = {
		method,
		url,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: requestBody,
	};

	return await this.helpers.httpRequest(options);
}
