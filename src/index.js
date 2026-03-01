import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'dynamic-iframe',
	name: 'Dynamic iFrame',
	icon: 'iframe',
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	description: 'Display a secure iframe using a URL template resolved from the current item values.',
	component: InterfaceComponent,
	options: [
		{
			field: 'url_template',
			type: 'string',
			name: 'URL Template',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					iconLeft: 'link',
					placeholder: 'https://example.com/dashboard?client={{client_id}}',
				},
				note: 'Use placeholders like {{field_name}} or {{relation.id}} to inject current form values.',
			},
		},
		{
			field: 'behavior_divider',
			type: 'alias',
			name: 'Behavior',
			meta: {
				interface: 'presentation-divider',
				width: 'full',
				options: {
					icon: 'tune',
					title: 'Behavior',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'debounce',
			type: 'integer',
			name: 'Debounce (ms)',
			meta: {
				interface: 'input',
				width: 'half',
				note: 'Delay before reloading the iframe when form values change.',
				options: {
					placeholder: '250',
				},
			},
			schema: {
				default_value: 250,
			},
		},
		{
			field: 'loading',
			type: 'boolean',
			name: 'Show Loading Indicator',
			meta: {
				interface: 'boolean',
				width: 'half',
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'open_in_new_tab',
			type: 'boolean',
			name: 'Open In New Tab',
			meta: {
				interface: 'boolean',
				width: 'half',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'allow_fullscreen',
			type: 'boolean',
			name: 'Allow Fullscreen',
			meta: {
				interface: 'boolean',
				width: 'half',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'appearance_divider',
			type: 'alias',
			name: 'Appearance',
			meta: {
				interface: 'presentation-divider',
				width: 'full',
				options: {
					icon: 'palette',
					title: 'Appearance',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'height',
			type: 'string',
			name: 'Height',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '800px',
				},
			},
		},
		{
			field: 'border',
			type: 'string',
			name: 'Border',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '1px solid #ccc',
				},
			},
		},
		{
			field: 'border_radius',
			type: 'string',
			name: 'Border Radius',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '8px',
				},
			},
		},
	],
});
