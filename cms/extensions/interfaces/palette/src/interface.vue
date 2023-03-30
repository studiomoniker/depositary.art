<template>
	<div class="overview">
		<div v-for="item in Object.keys(value)" :key="item" class="color">
			<div
				class="swatch"
				:style="{
					background: `rgb(${value[item][0]}, ${value[item][1]}, ${value[item][2]})`,
				}"
			/>
			{{ item }}
		</div>
	</div>
</template>

<style scoped>
.overview {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}
.swatch {
	display: inline-block;
	width: 20px;
	height: 20px;
	border-radius: 5px;
	margin-right: 5px;
}

.color {
	display: flex;
	align-items: center;
	margin-bottom: 5px;
}
</style>

<script>
export default {
	props: {
		value: {
			type: String,
			default: null,
		},
	},
	computed: {},
	emits: ['input'],
	setup(props) {
		console.log(Object.keys(props.value))
	},
}
</script>
