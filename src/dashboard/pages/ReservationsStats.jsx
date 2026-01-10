import React, { useState, useEffect } from 'react';
import {
    ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
    LineSeries, ColumnSeries, DateTime, Legend, Tooltip, Category, DataLabel
} from '@syncfusion/ej2-react-charts';

import { BsCurrencyDollar, BsCalendarCheck } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import { Header } from '../components';
import apiAdmin from '../../api/apiAdmin';

const ReservationsStats = () => {
    const { currentMode } = useStateContext();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await apiAdmin.fetchReservationStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics", error);
            }
        };
        fetchData();
    }, []);

    if (!stats) return <div className="p-10 text-center">Loading...</div>;

    // Process Revenue Over Time Data for Chart
    const revenueData = Object.entries(stats.revenueOverTime || {})
        .map(([date, amount]) => ({ x: new Date(date), y: amount }))
        .sort((a, b) => a.x - b.x);

    // Process Reservations Per Event Data for Chart
    const eventData = Object.entries(stats.reservationsPerEvent || {})
        .map(([title, count]) => ({ x: title, y: count }));

    return (
        <div className="bg-gray-50/50 dark:bg-main-dark-bg min-h-screen p-6 md:p-10 text-gray-900 dark:text-white">
            <Header category="Analytics" title="Reservations & Revenue" />

            {/* CARDS */}
            <div className="flex flex-wrap justify-center gap-10 mt-10 mb-10">

                {/* Total Revenue */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-64 p-4 pt-9 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                        className="text-2xl rounded-full p-4 hover:drop-shadow-xl"
                    >
                        <BsCurrencyDollar />
                    </button>
                    <p className="mt-3">
                        <span className="text-lg font-semibold">{stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </p>
                    <p className="text-sm text-gray-400  mt-1">Total Revenue</p>
                </div>

                {/* Total Reservations */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-64 p-4 pt-9 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }}
                        className="text-2xl rounded-full p-4 hover:drop-shadow-xl"
                    >
                        <BsCalendarCheck />
                    </button>
                    <p className="mt-3">
                        <span className="text-lg font-semibold">{stats.totalReservations}</span>
                    </p>
                    <p className="text-sm text-gray-400  mt-1">Total Reservations</p>
                </div>
            </div>

            {/* CHARTS ROW */}
            <div className="flex flex-col md:flex-row gap-10 justify-center">

                {/* REVENUE CHART */}
                <div className="w-full md:w-1/2 p-4 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-md">
                    <p className="text-xl font-semibold mb-4 text-center dark:text-gray-200">Revenue Over Time</p>
                    <ChartComponent
                        id="revenue-chart"
                        height="350px"
                        primaryXAxis={{ valueType: 'DateTime', labelFormat: 'yMd', skeleton: 'yMd', edgeLabelPlacement: 'Shift' }}
                        primaryYAxis={{ labelFormat: '{value}€', title: 'Revenue' }}
                        tooltip={{ enable: true }}
                        background={currentMode === 'Dark' ? '#33373E' : '#fff'}
                    >
                        <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective
                                dataSource={revenueData}
                                xName="x"
                                yName="y"
                                name="Revenue"
                                type="Line"
                                width={3}
                                marker={{ visible: true, width: 10, height: 10 }}
                            />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>

                {/* RESERVATIONS PER EVENT */}
                <div className="w-full md:w-1/2 p-4 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-md">
                    <p className="text-xl font-semibold mb-4 text-center dark:text-gray-200">Reservations per Event</p>
                    <ChartComponent
                        id="event-chart"
                        height="350px"
                        primaryXAxis={{ valueType: 'Category', title: 'Event' }}
                        primaryYAxis={{ title: 'Reservations' }}
                        tooltip={{ enable: true }}
                        background={currentMode === 'Dark' ? '#33373E' : '#fff'}
                    >
                        <Inject services={[ColumnSeries, Category, Tooltip, DataLabel]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective
                                dataSource={eventData}
                                xName="x"
                                yName="y"
                                name="Reservations"
                                type="Column"
                                marker={{ dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }}
                            />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>

            </div>
        </div>
    );
};

export default ReservationsStats;
