import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class TimeoffApi implements ICredentialType {
	name = 'timeoffApi';

	displayName = 'Timeoff API';

	icon: Icon = 'file:../icons/timeoff.svg';

	documentationUrl = 'https://timeoff.base.vn';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'company.base.vn',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://timeoff.{{$credentials.domain}}/extapi/v1',
			url: '/group/list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				access_token: '={{$credentials.accessToken}}',
				page: 0,
			},
		},
	};
}
