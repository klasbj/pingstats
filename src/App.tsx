import * as React from 'react';
import './App.css';
import { FaultsPerDay, IDayStats } from './DataDisplay/FaultsPerDay';
import PieChart from './DataDisplay/PieChart';
import { IWeekStats, WeeksDisplay } from './DataDisplay/WeeksDisplay';
import './Fetcher';
import { Fetcher } from './Fetcher';

interface IHourStats {
  hour: number,
  count: number
}

interface ITodayStats {
  time: string,
  count: number
}

interface IStats {
  per_week: IWeekStats[],
  per_day: IDayStats[],
  per_hour: IHourStats[],
  today: ITodayStats
}

const HourToString = (x: number): string => `${x < 10 ? "0" : ""}${x}:00`;
const DayToString = (x: number): string => "Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(" ")[x];

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Fetcher<IStats> src="stats.json">
          {(data, loading, error) => {
            if (loading) {
              return <p>Loading...</p>;
            }
            
            if (data === null || error !== null) {
              return <p>Error: {error || "Unknown error"}</p>;
            }

            const faultsOnDay = data.per_day
              .map(x => ({day: new Date(x.date).getDay(), count: x.count}))
              .reduce((a, v) => {
                a[v.day] += v.count;
                return a;
              }, [0,0,0,0,0,0,0])
              .map((x,i) => ({name: DayToString(i), count: x}));

            return (<div>
              <p>Status at {new Date(data.today.time).toLocaleString("sv-SE", {timeZoneName: "short"})}</p>
              <WeeksDisplay weekData={data.per_week} />
              <FaultsPerDay data={data.per_day} />
              <PieChart title="Faults distribution per hour" data={data.per_hour.map(x => ({name: HourToString(x.hour), count: x.count }))} />
              <PieChart title="Faults distribution per weekday" data={faultsOnDay} />
            </div>);
          }}
        </Fetcher>
      </div>
    );
  }
}

export default App;
