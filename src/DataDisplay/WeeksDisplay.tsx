import * as React from 'react';

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

interface IDataSet {
  name: string,
  unit: string,
  yAxis: number[], // values to show on the y axis
  dataValues: number[], // one data point per xAxis value in the plot
  conv: (v: number) => number // conversion from value to (linear y axis location)
}

interface IPlot {
  xAxis: string[],
  dataSets: IDataSet[]
}

const YAxis = (props: any): JSX.Element => <div/>;

const Plot = ({data}: {data: IPlot}): JSX.Element => {
  const yAxes = data.dataSets.map((v,i) => {
    const title = v.name + (v.unit.length > 0 ? `(${v.unit})` : "");
    return <YAxis key={`axis-${i}`} title={title}/>
  });

  return (<svg width="95%" height="250px">
    {yAxes}
  </svg>);
}

export const WeeksDisplay = (props: IWeeksDisplayProps): JSX.Element => {
  const plotData : IPlot = {
    dataSets: [
      {
        conv: (v) => Math.log10(v),
        dataValues: props.weekData.map(x => x.count),
        name: "count",
        unit: "",
        yAxis: [0, 10, 100, 1000],
      },
      {
        conv: (v) => v,
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean || 0),
        name: "average duration",
        unit: "s",
        yAxis: [0, 3, 6, 9],
      },
      {
        conv: (v) => Math.log10(v),
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean*x.count || 0),
        name: "total duration",
        unit: "s",
        yAxis: [0, 10, 100, 1000, 10000],
      },
    ],
    xAxis: props.weekData.map(x => x.week_of),
  }
  return (<Plot data={plotData} />)
}

export default WeeksDisplay;
