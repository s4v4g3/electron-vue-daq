<template>
    <v-container fluid>
        <DAQDisplay  ref="daqDisplay" />
    </v-container>
</template>

<script>

import DAQDisplay from "../components/DAQDisplay";
export default {
    name: "Home",
    components: { DAQDisplay },
    data: () => ({
    }),
    created() {
    },
    destroyed() {
    },
    methods: {
       
    },
    computed: {
    }
};
</script>
