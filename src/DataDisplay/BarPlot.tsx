import * as React from 'react';

import './BarPlot.css';

interface IDataSet {
  name: string,
  unit: string,
  yAxis: number[], // values to show on the y axis
  dataValues: number[], // one data point per xAxis value in the plot
  conv: (v: number) => number // conversion from value to (linear y axis location)
}

export interface IBarPlot {
  xAxis: string[],
  dataSets: IDataSet[]
}

const YAxis = ({className, dataSet, dx}: {className: string, dataSet: IDataSet, dx: number}): JSX.Element => {
  const title = dataSet.name + (dataSet.unit.length > 0 ? ` (${dataSet.unit})` : "");
  const pipYs = dataSet.yAxis.map(v => -dataSet.conv(v));
  const maxY = pipYs[pipYs.length-1];
  const pips = pipYs.map((y,i) => (<g key={y}>
    <line className="yBar" x1={dx} y1={y} x2={dx+5} y2={y} />
    <text className="piplabel" x={dx} dx={2} y={y} dy={-2}>{dataSet.yAxis[i]}</text>
    <line className="extended-pip" x1={dx} y1={y} x2={10000} y2={y} />
  </g>));

  return (<g key={dataSet.name} className={className + " yBar"} style={{fontSize: "x-small", textAnchor:"middle"}}>
    <text y={dx} dy={-7} x={-maxY/2.0} style={{transform: "rotate(-90deg)"}}>{title}</text>
    <line x1={dx} y1={0} x2={dx} y2={maxY} />
    {pips}
  </g>)
};

interface ISingleValue {
  name: string,
  value: number,
  yTop: number
}

interface IBarGroupProps {
  bars: ISingleValue[],
  x: number,
  xLabel: string,
  width?: number,
}

const BarGroup = (props: IBarGroupProps) => {
  const fullWidth = props.width || 30;
  const spacing = 2;
  const barWidth = (fullWidth - spacing * (props.bars.length - 1)) / props.bars.length;
  const xMin = props.x - fullWidth/2;
  const bars = props.bars.map((x,i) =>
    <rect className={`axis-${i}`} key={`bar-${x.name}`} x={xMin + (barWidth+spacing)*i} y={x.yTop}
          width={barWidth} height={-x.yTop} stroke="black" />);

  return (<g className="bargroup">
    <text key={props.xLabel} style={{fontSize: "x-small", textAnchor: "middle"}} x={props.x} y={0} dy={10}>{props.xLabel}</text>
    {bars}
  </g>);
}

const XAxis = (props: {}): JSX.Element => {
    return (<g>
    <line x1="-10000" y1="0" x2="10000" y2="0" className="xbar" stroke="black" />
  </g>);
}

interface IPlotActualProps {
  id: string,
  data: IBarPlot,
  width?: number,
  height?: number,
  dx?: number, // the first X-index to show
  compact?: boolean
}

const PlotActual = ({id, data, width=960, height=250, dx=0, compact}: IPlotActualProps): JSX.Element => {
  const yBarWidth = 50;
  const minX = -yBarWidth/2 - yBarWidth*data.dataSets.length;
  const maxX = width * (160/height) + minX;

  const yAxes = data.dataSets.map((v,i) => {
    const key = `axis-${v.name}`;
    return <YAxis key={key} className={`axis-${i}`} dataSet={v} dx={-(i+1)*yBarWidth}/>
  });

  const itemWidth = compact ? (6*data.dataSets.length) : 30;
  const itemDelta = compact ? (itemWidth + 3) : (2*itemWidth);

  const bars = data.xAxis.map((x,i) => {
    const p : IBarGroupProps = {
      bars: data.dataSets.map(v => { return {
        name: v.name,
        value: v.dataValues[i],
        yTop: -v.conv(v.dataValues[i]),
      };}),
      width: itemWidth,
      x: itemDelta*i,
      xLabel: (!compact || (i%10) === 0) ? x : '',
    };

    return <BarGroup key={`bargroup-${x}`} {...p} />
  });

  const lastGroupX = itemDelta * (data.xAxis.length-1) + itemWidth;
  const baseDX = lastGroupX <= maxX ? 0 : (maxX - lastGroupX);
  const clipId = `clip-${id}`;

  return (<svg width={width} height={height}
    viewBox={`${minX} -140 160 160`}
    preserveAspectRatio="xMinYMin meet">
    <defs>
      <clipPath id={clipId}>
        <rect x="-40" y="-140" width={maxX + 40} height="160"/>
      </clipPath>
    </defs>
    {yAxes}
    <XAxis />
    <g clipPath={`url(#${clipId})`}>
      <g className="Bars" style={{transform: `translate(${baseDX + dx*itemDelta}px)`}}>
        {bars}
      </g>
    </g>
  </svg>);
}

interface IBarPlotProps {
  id: string,
  data: IBarPlot,
  title?: string,
  width?: number,
  height?: number,
  compact?: boolean,
}
export class BarPlot extends React.Component<IBarPlotProps, {first: number}> {
  public constructor(props: IBarPlotProps) {
    super(props);
    this.state = {
      first: 0
    }
  }

  public render() {
    return (<div className="BarPlot">
      {this.props.title && <h3>{this.props.title}</h3>}
      <p><a onClick={this.moveLeft}>&lt;</a> {this.state.first} <a onClick={this.moveRight}>&gt;</a></p>
      <PlotActual {...this.props} dx={this.state.first} />
    </div>);
  }

  private updateState = (dx: number) => {
    this.setState((state, props) => ({first:
      Math.min(Math.max(0, state.first+dx), props.data.xAxis.length-1)}));
  }

  private moveLeft = () => { this.updateState(1); }

  private moveRight = () => { this.updateState(-1); }
}