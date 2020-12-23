<template>
    <v-container fluid>
        <v-card class="ma-4">
            <highcharts :options="chartOptions"></highcharts>
        </v-card>
        <v-card class="ma-4">
            <v-expansion-panels multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Settings</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-card>
                            <v-subheader>Sample Rate</v-subheader>
                            <v-card-text>
                                <v-row>
                                    <v-col class="pr-4">
                                        <v-slider
                                            v-model="rate"
                                            class="align-center"
                                            :max="1000000"
                                            :min="1000"
                                            hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                    v-model="rate"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    style="width: 80px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-subheader>Number of Samples</v-subheader>
                            <v-card-text>
                                <v-row>
                                    <v-col class="pr-4">
                                        <v-slider
                                            v-model="samples"
                                            class="align-center"
                                            :max="100000"
                                            :min="1000"
                                            hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                    v-model="samples"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    style="width: 80px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-subheader>Min/Max Range</v-subheader>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="1" class="pr-4">
                                        <v-text-field
                                            v-model="min"
                                            class="mt-0 pt-0"
                                            hide-details
                                            single-line
                                            type="number"
                                            style="width: 80px"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="1" class="pr-4">
                                        <v-text-field
                                            v-model="max"
                                            class="mt-0 pt-0"
                                            hide-details
                                            single-line
                                            type="number"
                                            style="width: 80px"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="1" class="pr-4">
                                        <v-checkbox
                                            v-model="autoscale"
                                            label="Autoscale Chart"
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card>
        <v-row>
            <v-col>
                <v-btn
                    block
                    :color="acquisitionEnabled ? 'green' : 'red'"
                    @click="clicked"
                >
                    {{ buttonText }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { getData } from "../ipc/renderer";
export default {
    name: "DAQDisplay",
    data: () => ({
        chartOptions: {},
        acquisitionEnabled: false,
        rate: 10000,
        samples: 2000,
        min: -10,
        max: 10,
        autoscale: true,
    }),
    async created() {
        this.chartOptions = {
            chart: {
                animation: false,
            },
            title: {
                text: "Data from NI Data Acquisition Device",
            },

            subtitle: {
                text: "NI USB-6259",
            },

            yAxis: {
                title: {
                    text: "Voltage (V)",
                },
            },

            boost: {
                enabled: true,
                useGPUTranslations: true,
                usePreAllocated: true,
            },

            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false,
                    },
                    pointStart: 0,
                },
            },

            series: [{ name: "AI Ch0", data: [] }],

            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            legend: {
                                layout: "horizontal",
                                align: "center",
                                verticalAlign: "bottom",
                            },
                        },
                    },
                ],
            },
        };
        this.requestData();
    },
    methods: {
        requestData() {
            getData({
                channel: "Dev1/ai0",
                rate: this.rate,
                samples: this.samples,
                min: parseFloat(this.min.toString()),
                max: parseFloat(this.max.toString()),
            }).then((response) => {
                // update chart
                this.chartOptions.series = [{ name: "AI Ch0", data: response }];
                if (this.autoscale) {
                    this.chartOptions.yAxis.min = null;
                    this.chartOptions.yAxis.max = null;
                } else {
                    this.chartOptions.yAxis.min = this.min;
                    this.chartOptions.yAxis.max = this.max;
                }

                this.scheduleDataRequest();
            });
        },
        scheduleDataRequest() {
            if (this.acquisitionEnabled) {
                this.$nextTick(() => {
                    this.requestData();
                });
            }
        },
        clicked() {
            this.acquisitionEnabled = !this.acquisitionEnabled;
            window.console.log(
                `Acquisition Enabled = ${this.acquisitionEnabled === true}`
            );
            this.scheduleDataRequest();
        },
    },
    computed: {
        buttonText() {
            return this.acquisitionEnabled
                ? "Pause Acquisition"
                : "Resume Acquisition";
        },
    },
};
</script>
