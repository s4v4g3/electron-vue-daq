<template>
    <v-container fluid>
        <v-card>
            <highcharts :options="chartOptions"></highcharts>
        </v-card>
    </v-container>
</template>

<script>
import { getData } from "../ipc/renderer";
export default {
    name: "DAQDisplay",
    data: () => ({
        chartOptions: {},
    }),
    created() {
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
            getData().then((response) => {
                this.chartOptions.series = [{ name: "AI Ch0", data: response }];
                setTimeout(this.requestData(), 5);
            });
        },
    },
};
</script>
