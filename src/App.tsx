import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, DatePicker, Space } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { Select } from 'antd';

function disabledDate(current: any) {
  return current>=moment() || current <Date.parse("2020-10-05");
}

const { RangePicker } = DatePicker;

type rangeType = [string, string] //свой тип данных из массива строк

type rowsType = {
  date: string,
  today_new_confirmed: number,
  today_new_deaths: number,
  today_new_recovered: number
}[] //свой тип данных что бы скормить графику и соотновятся с данными из источ

const { Option } = Select;
type CountryType = {
  name: string
}[] 

function App(this: any) {

  const [range, setRange] = React.useState<rangeType>(["", ""]) //useState возвращает элемент и функцию для установки, оба пустые строки 
  //<RangePicker onChange={(_: any, s: rangeType) => setRange(s)} />  при изменении выполняется функция setRange,потому что onChange две переменные у нас заполнена только одна

  // for (const [key] of Object.entries(rjson?.dates)) {
  //const d = rjson?.dates[key]?.countries?.Russia; нужно что бы доставать из json

 /* */

  const [data, setData] = React.useState<rowsType>([]) //откуда график будет забирать данные

  const fetchData = () => {
    console.log("Даты: ", range);
    fetch(`https://api.covid19tracking.narrativa.com/api/country/${selectedItem}}?date_from=${range[0]}&date_to=${range[1]}`)
    .then(
        (res) => res.json()
            .then(
                rjson => {
                  let rows: rowsType = []
                  for (const [key] of Object.entries(rjson?.dates)) {
                    const d = rjson?.dates[key]?.countries[{selectedItem}];
                    const row = {
                      date: d.date,
                      today_new_confirmed: d.today_new_confirmed,
                      today_new_deaths: d.today_new_deaths,
                      today_new_recovered: d.today_new_recovered
                    } 
                    rows.push(row)
                  }
                  console.log(rows);
                  setData(rows);
                }
            )
      )
    }

    const { Option } = Select;

    const [countryData, setCountryData] = React.useState<CountryType>([]) //откуда график будет забирать данные

    const selectedItem={selectedItem: ""};

    const fetchCountryData = () => {
      console.log("страны: ");
      fetch(`https://api.covid19tracking.narrativa.com/api/countries`)
      .then(
          (res) => res.json()
              .then(
                  rjson => {
                    let rows: CountryType = []
                    for (const [key] of Object.entries(rjson?.countries)) {
                      const d = rjson?.countries[key];
                      const row = {
                        name: d.name
                      } 
                      rows.push(row)
                    }
                    console.log(rows);
                    setCountryData(rows);
                  }
              )
        )
      }


  return (
    <div className="App">

    <Select placeholder="Search to Select" style={{ width: 120 }}  onFocus={fetchCountryData} onChange={value => {
                this.setState({ selectedItem: value });
              }}>
        {countryData.map(country => (
          <Option value={country.name}>{country.name}</Option>
        ))}
      </Select>

     <Space direction="horizontal">

        <RangePicker onChange={(_: any, s: rangeType) => setRange(s)}  disabledDate={disabledDate} locale={locale}  />  
        
        <Button type="primary" disabled={range[0] === "" || range[1] === "" } onClick={fetchData}>Построить график</Button>

    </Space>

    <div style={{ width: '100%', height: '600px' }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 50, right: 20, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="today_new_confirmed" name="Заболели" stroke="#8884d8" />
              <Line type="monotone" dataKey="today_new_deaths" name="Умерли" stroke="#ff0000" />
              <Line type="monotone" dataKey="today_new_recovered" name="Выздоровели" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
    </div>
  );
}

export default App;
