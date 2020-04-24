import React from 'react';
import { Icon, Row, Skeleton, Col,  Button, Badge } from "antd";
import { useRef, useEffect, useState } from "react";
import { getStockDetails } from "../context/service-s";
import styled from "styled-components";

import Chart from 'react-apexcharts'
import moment from 'moment';

const StockContent = (props: any) => {

    const Para = styled.p`
  font-size: 15px;
  margin-bottom:5px;
  `;
    const { stockDetails } = props;
  
    const [loading, setLoading] = useState(true);
  
    const [data, setData] = useState([{
      name: "Desktops",
      data: [1, 2, 3, 4]
    }]);
  
    const [chart, setChartData] = useState({
  
  
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
  
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [1, 2, 3, 4],
        }
      },
  
  
    });
    const colors = ['#5fa3f0', '#f0e15f', '#5fe48a']
    const [bar, setBarData] = useState({
  
      series: [{
        data: [0, 0, 0]
      }],
      options: {
        chart: {
          height: 100,
          type: 'bar',
          events: {
            click: function (chart: any, w: any, e: any) {
              console.log(chart, w, e)
            }
          }
        },
        colors: colors,
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          position: 'top'
        },
        xaxis: {
          categories: [
            'Avarage',
            'Allowed',
            'Today',
  
          ],
          labels: {
            style: {
              colors: colors,
              fontSize: '14px'
            }
          }
        }
      }
    });
  
  
    useEffect(() => {
  
      const getData = async () => {
        if(stockDetails){
        setLoading(false);
        const { highestHigh, lowestLow, high, low } = stockDetails;
        let indexes: number[] = [highestHigh.index, lowestLow.index, high.index, low.index];
  
        indexes = indexes.sort((x, y) => x - y)
  
        const final: any[] = []
        for (const i of indexes) {
  
          if (highestHigh.index === i) {
            final.push(highestHigh.highest)
          } else if (lowestLow.index === i) {
            final.push(lowestLow.lowest)
          } else if (low.index === i) {
            final.push(low.lowest)
          } else if (high.index === i) {
            final.push(high.highest)
          }
        }
  
  
        const data1 = [{
          name: "at",
          data: final
        }];
  
        setData(data1);
        setBarData({
          ...bar, series: [{
            data: [stockDetails.avgCandelSize, stockDetails.allowedCandelSize, stockDetails.todayCandelSize]
          }]
        })
  
  
        // let foo1 = new Array(max);
  
        // for (let i = 0; i < foo1.length; i++) {
        //   foo1[i] = i + 1;
        // }
        // setChartData({
        //   ...chart, options: {
        //     ...chart.options, xaxis: {
        //       categories: foo1,
        //     },
        //   }
        // })
  
      }
      }
      getData();
  
    }, [stockDetails])
    
    return (
      <div>
        {loading && <Skeleton active />}
        {!loading && stockDetails && <>
  
          
          <Row>
        <h1>{stockDetails.symbol}</h1>
            {stockDetails.goodOne && stockDetails.valid &&
              <Col span={4}>
                <Icon type="like" style={{ fontSize: '200px', color: '#5fe48a' }} /> </Col>}
            <Col span={stockDetails.goodOne && 10 || 14}>
              <Button onClick={() => openStock(stockDetails)}>Open Chart</Button>
              {stockDetails.trend === 'DOWN' && <h3 style={{ color: 'red' }}>DOWN TREND</h3 >}
              {stockDetails.trend === 'UP' && <h3 style={{ color: 'green' }}  >UP TREND</h3 >}
              {stockDetails.trend !== 'UP' && stockDetails.trend !== 'DOWN' && <h3   >{stockDetails.trend} </h3 >}
              <Para>Highest High : {stockDetails.highestHigh.highest}</Para>
              <Para>Lowest Low  : {stockDetails.lowestLow.lowest}</Para>
              <Para> High : {stockDetails.high.highest}</Para>
              <Para> Low : {stockDetails.low.lowest}</Para>
            </Col>
            <Col span={5}>
              <h3>Candel Size</h3><Chart options={bar.options} series={bar.series} type="bar" height={350} /></Col>
            <Col span={5}> <h3>Price Action
              {stockDetails.valid && <Badge count='VALID' style={{ backgroundColor: '#52c41a', marginLeft: 10 }} /> ||
                <Badge count='INVALID' style={{ backgroundColor: '#f82626', marginLeft: 10 }} />}
  
  
            </h3>  {chart && data && <div id="chart">
              <Chart options={chart.options} series={data} type="line" height={350} />
            </div>}</Col>
          </Row>
  
  
        </>}
  
      </div >
    );
  }
  
  export default StockContent;
 
  
  
  export const Coin = () => {
    return (
      <Icon
        type="dollar"
        style={{
          color: '#ad9515',
          borderRadius: '100px',
          background: 'gold',
          fontSize: 18
        }}
      ></Icon>
    );
  };
  export const openStock = (stock: any) => {
    window.open(`https://kite.zerodha.com/chart/ext/tvc/NSE/${stock.symbol}/${stock.instrument}`, '_blank');
  }