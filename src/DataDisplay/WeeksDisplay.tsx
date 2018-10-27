import * as React from 'react';

import { BarPlot, IBarPlot } from './BarPlot';

import './WeeksDisplay.css';

export interface IWeekStats {
  week_of: string,
  count: number,
  duration: {
    mean: number,
    stddev: number
  }
}

interface IWeeksDisplayProps {
  weekData: IWeekStats[]
}

export const WeeksDisplay = (props: IWeeksDisplayProps): JSX.Element => {
  const plotData : IBarPlot = {
    dataSets: [
      {
        conv: (v) => Math.log10(v) * 35,
        dataValues: props.weekData.map(x => x.count),
        name: "count",
        unit: "",
        yAxis: [0, 10, 100, 1000],
      },
      {
        conv: (v) => v * 13,
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean || 0),
        name: "average duration",
        unit: "s",
        yAxis: [0, 3, 6, 9],
      },
      {
        conv: (v) => Math.log10(v)*30,
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean*x.count || 0),
        name: "total duration",
        unit: "s",
        yAxis: [0, 10, 100, 1000, 10000],
      },
    ],
    xAxis: props.weekData.map(x => x.week_of),
  }
  return (<BarPlot title="Status per week" data={plotData} />)
}

export default WeeksDisplay;
