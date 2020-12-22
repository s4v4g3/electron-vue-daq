<template>
    <v-container fluid>
        <v-card>
            <highcharts :options="chartOptions"></highcharts>
        </v-card>
    </v-container>
</template>

<script>
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
    },
    methods: {
        updateData(response) {
            this.chartOptions.series = [{ data: response }];
            //this.chartOptions = { ...this.chartOptions };
        },
    },
};
</script>
