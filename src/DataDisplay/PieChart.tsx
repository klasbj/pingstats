import * as React from 'react';

import './PieChart.css';

const ToRad = (x: number) => x * Math.PI / 180.0;

export interface IPieData {
    name: string,
    count: number
}

export interface IPieChartProps {
    data: IPieData[]
}

export const PieChart = (props: IPieChartProps) => {
    // transform data to percent
    const total = props.data.reduce((p,c) => p + c.count, 0);
    const percented = props.data.map(x => Object.assign({}, x, {count: x.count / total}));

    const radius = 100;

    const colorStep = 360 / percented.length;

    const pieces : JSX.Element[] = [];
    let angle = 0;

    percented.forEach((v,i) => {
        const startAngle = angle;
        const endAngle = (i === percented.length-1) ? 360 : (angle + v.count * 360);
        angle = endAngle;
        const path = "M 0,0 " +
            `L ${radius*Math.cos(ToRad(startAngle-90))},${radius*Math.sin(ToRad(startAngle-90))} ` +
            `A ${radius} ${radius} ${startAngle-90} ${(endAngle - startAngle) > 180.0 ? 1 : 0} 1 ${radius*Math.cos(ToRad(endAngle-90))},${radius*Math.sin(ToRad(endAngle-90))} ` +
            "L 0,0 Z";
        const fillColor = `hsl(${colorStep * i}, 80%, 60%)`;
        const strokeColor = `hsl(${colorStep * i}, 80%, 40%)`;

        pieces.push(<path key={v.name} d={path} style={{fill: fillColor, stroke: strokeColor}} />);
    });

    return (<svg className="piechart" viewBox="-100 -100 200 200">
        {pieces}
    </svg>)
}

export default PieChart;