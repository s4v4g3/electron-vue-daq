<template>
    <v-container fluid>
        <DAQDisplay  ref="daqDisplay" />
    </v-container>
</template>

<script>
import { getData } from "../ipc/renderer";
import DAQDisplay from "../components/DAQDisplay";
export default {
    name: "Home",
    components: { DAQDisplay },
    data: () => ({
    }),
    created() {
        this.requestData();
    },
    destroyed() {
    },
    methods: {
        requestData() {
            
            getData().then((response) => {
                this.onGetDataReply(response);
                setTimeout(this.requestData(), 5);
            });
            
            
        },
        onGetDataReply(response) {
            return this.$refs.daqDisplay.updateData(response);
        },
    },
    computed: {
    }
};
</script>
