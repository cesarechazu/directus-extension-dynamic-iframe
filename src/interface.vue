<template>
	<div ref="wrapperElement" class="iframe-wrapper">
		<div v-if="showLoadingIndicator" class="iframe-loading" aria-hidden="true">
			<div class="iframe-loading-bar"></div>
		</div>
		<div v-if="showActionButtons" class="iframe-actions">
			<a
				v-if="showOpenInNewTab"
				class="iframe-action"
				:href="frameUrl"
				target="_blank"
				rel="noopener noreferrer"
				title="Open in new tab"
				aria-label="Open in new tab"
			>
				↗
			</a>
			<button
				v-if="showFullscreenButton"
				type="button"
				class="iframe-action"
				title="Enter fullscreen"
				aria-label="Enter fullscreen"
				@click="enterFullscreen"
			>
				⛶
			</button>
		</div>
		<iframe
			v-if="frameUrl"
			:src="frameUrl"
			:height="resolvedHeight"
			:style="{ border: resolvedBorder, borderRadius: resolvedBorderRadius }"
			:allowfullscreen="allowFullscreenAttr"
			:allow="allowPermissions"
			loading="lazy"
			referrerpolicy="no-referrer"
			@load="handleIframeLoad"
		></iframe>
		<div v-else-if="!safeUrl" class="iframe-placeholder">
			Provide a valid `https` URL template. You can use placeholders like
			<code v-pre>{{ field_name }}</code>.
		</div>
	</div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
	value: String,
	url_template: String,
	height: String,
	border: String,
	border_radius: String,
	debounce: {
		type: [String, Number],
		default: 250,
	},
	loading: {
		type: Boolean,
		default: true,
	},
	open_in_new_tab: {
		type: Boolean,
		default: false,
	},
	allow_fullscreen: {
		type: Boolean,
		default: false,
	},
	primaryKey: {
		type: [String, Number],
		default: null,
	},
});

const injectedValues = inject('values', null);
const wrapperElement = ref(null);
const frameUrl = ref('');
const isFrameLoading = ref(false);
let debounceTimer = null;

function isRecordObject(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

const recordValues = computed(() =>
	isRecordObject(injectedValues?.value) ? injectedValues.value : {}
);

function getValueByPath(source, path) {
	return String(path)
		.split('.')
		.reduce((value, segment) => {
			if (value === null || value === undefined) return undefined;
			return value[segment];
		}, source);
}

function stringifyTemplateValue(value) {
	if (value === null || value === undefined) return '';

	if (typeof value === 'object') {
		if ('id' in value && (typeof value.id === 'string' || typeof value.id === 'number')) {
			return String(value.id);
		}

		return '';
	}

	return String(value);
}

const resolvedTemplate = computed(() => {
	const template = props.url_template?.trim();

	if (!template) return '';

	const values = {
		...recordValues.value,
		id: props.primaryKey ?? recordValues.value?.id ?? null,
	};

	return template.replace(/{{\s*([^}]+)\s*}}/g, (_, path) => {
		const value = getValueByPath(values, path.trim());
		return stringifyTemplateValue(value);
	});
});

const safeUrl = computed(() => {
	if (!resolvedTemplate.value) return '';

	try {
		const parsed = new URL(resolvedTemplate.value, window.location.origin);

		if (parsed.protocol !== 'https:') return '';

		return parsed.toString();
	} catch {
		return '';
	}
});

const resolvedDebounce = computed(() => {
	const value = Number(props.debounce);

	if (!Number.isFinite(value) || value < 0) return 250;

	return value;
});

const resolvedHeight = computed(() => props.height?.trim() || '800px');
const resolvedBorder = computed(
	() => props.border?.trim() || '1px solid var(--theme--border-color-subdued, #ccc)'
);
const resolvedBorderRadius = computed(
	() => props.border_radius?.trim() || 'var(--theme--border-radius, 8px)'
);
const showLoadingIndicator = computed(() => props.loading === true && isFrameLoading.value === true);
const showOpenInNewTab = computed(() => props.open_in_new_tab === true && Boolean(frameUrl.value));
const showFullscreenButton = computed(() => props.allow_fullscreen === true && Boolean(frameUrl.value));
const showActionButtons = computed(
	() => showOpenInNewTab.value === true || showFullscreenButton.value === true
);
const allowFullscreenAttr = computed(() => (props.allow_fullscreen === true ? true : null));
const allowPermissions = computed(() => (props.allow_fullscreen === true ? 'fullscreen' : null));

watch(
	safeUrl,
	(newUrl) => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		if (!newUrl) {
			frameUrl.value = '';
			isFrameLoading.value = false;
			return;
		}

		isFrameLoading.value = props.loading === true;

		if (resolvedDebounce.value === 0) {
			frameUrl.value = newUrl;
			return;
		}

		debounceTimer = setTimeout(() => {
			frameUrl.value = newUrl;
			debounceTimer = null;
		}, resolvedDebounce.value);
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	if (debounceTimer) clearTimeout(debounceTimer);
});

function handleIframeLoad() {
	isFrameLoading.value = false;
}

async function enterFullscreen() {
	const element = wrapperElement.value;

	if (!element) return;

	if (typeof element.requestFullscreen === 'function') {
		await element.requestFullscreen();
		return;
	}

	if (typeof element.webkitRequestFullscreen === 'function') {
		element.webkitRequestFullscreen();
	}
}
</script>

<style scoped>
.iframe-wrapper {
	position: relative;
	width: 100%;
}

iframe {
	border: none;
	display: block;
	overflow: auto;
	width: 100%;
	background: var(--theme--background-page, #fff);
}

.iframe-loading {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2;
	height: 3px;
	overflow: hidden;
	border-top-left-radius: var(--theme--border-radius, 8px);
	border-top-right-radius: var(--theme--border-radius, 8px);
	background: color-mix(in srgb, var(--theme--primary, #6644ff) 16%, transparent);
}

.iframe-loading-bar {
	width: 35%;
	height: 100%;
	background: var(--theme--primary, #6644ff);
	animation: iframe-loading-slide 1s ease-in-out infinite;
}

.iframe-actions {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 3;
	display: inline-flex;
	gap: 8px;
}

.iframe-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 999px;
	background: color-mix(in srgb, var(--theme--background-page, #fff) 88%, transparent);
	color: var(--theme--foreground, #172940);
	text-decoration: none;
	font-size: 16px;
	line-height: 1;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.iframe-action:hover {
	background: var(--theme--background-page, #fff);
}

button.iframe-action {
	border: none;
	cursor: pointer;
	padding: 0;
}

.iframe-placeholder {
	width: 100%;
	padding: 16px;
	border: 1px dashed var(--theme--border-color-subdued, #ccc);
	border-radius: var(--theme--border-radius, 8px);
	color: var(--theme--foreground-subdued, #6b7c93);
	font-size: 14px;
	line-height: 1.5;
}

.iframe-placeholder code {
	padding: 2px 6px;
	border-radius: 4px;
	background: var(--theme--background-subdued, rgba(0, 0, 0, 0.05));
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

@keyframes iframe-loading-slide {
	0% {
		transform: translateX(-120%);
	}

	50% {
		transform: translateX(120%);
	}

	100% {
		transform: translateX(320%);
	}
}
</style>
