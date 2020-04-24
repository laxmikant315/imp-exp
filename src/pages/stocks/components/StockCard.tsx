import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react';
import {
  Button,
  Row,
  message,
  Card,
  Icon,
  Popconfirm,
  notification,
  Popover,
  Skeleton,
  Col,
  Drawer,
  Badge
} from 'antd';
import TweenOne from 'rc-tween-one';
import { Link } from 'react-router-dom';
import SContext from '../context/context-s';
import config from '../../../config.json';
import AppContext from '../../../context/context-app';
import styled from 'styled-components';

// @ts-ignore
import { Flipped, spring } from 'react-flip-toolkit';
import { getSpeechNotification } from '../../../context/SpeechNotification';
import { getStockDetails } from '../context/service-s';
import StockContent, { openStock, Coin } from './StockContent';


 // Hook
 function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const StockCard: React.FC<{ stock: any }> = (props: any) => {
  const { stock } = props;
  const { state, dispatch } = useContext(SContext);

  const { appState, appDispatch } = useContext(AppContext);

  const { notificationState } = appState;

  let [firstLoad, setFirstLoad] = useState(0);
  let [movement, setMovement] = useState(0);
  let previousMovement = usePrevious(movement);
  let [lastTrend, setLastTrend] = useState('');
  let [trendChanged, setTrendChanged] = useState(false);
  let [perfectVwap, setPerfectVwap] = useState(false);

  const prevStocks: any = usePrevious(state.stocks);

  let [timeoutId, setTimeoutId] = useState(0);

  let [stockInfoVisible, setStockInfoVisible] = useState(false);

  const [selectedStock, setSelectedStock] = useState<any>();

  const oldTimeoutId: any = usePrevious(timeoutId);
  useEffect(() => {
    if (prevStocks && prevStocks.length > 0) {
      const prevStock = prevStocks.find((x: any) => x.symbol === stock.symbol);
      if (prevStock) {
        let newMovement = 0;

        if (stock.rank < prevStock.rank && +stock.per > +prevStock.per) {
          newMovement = movement + (prevStock.rank - stock.rank);
        } else if (stock.rank > prevStock.rank && +stock.per < +prevStock.per) {
          newMovement = movement - (stock.rank - prevStock.rank);
        }
        if (movement !== newMovement) {
          setMovement(newMovement);
        }

        if (+stock.per != +prevStock.per && stock.rank !== prevStock.rank) {
          if (movement !== newMovement) {
            clearTimeout(oldTimeoutId);
            const timeOut = setTimeout(() => {
              setMovement(0);

              clearTimeout(timeoutId);
            }, config.trendChangeIndicatorTimeout);

            setTimeoutId(timeOut);
          }
        }
      }
    }
  }, [+stock.per]);

  // useEffect(() => {
  //   if (prevStocks && prevStocks.length > 0) {
  //     const prevStock = prevStocks.find((x: any) => x.symbol === stock.symbol);
  //     alert(prevStock.movement);
  //     alert(stock.movement);
  //     if (!prevStock.movement) {
  //       stock.movement = 0;
  //     }
  //     const oldMovement = prevStock.movement;
  //     if (oldMovement !== stock.movement) {
  //       clearTimeout(timeOut);

  //       timeOut = setTimeout(() => {
  //         alert(stock.movement);
  //         stock.movement = 0;
  //       }, config.trendChangeIndicatorTimeout);
  //     }
  //   }
  // }, [stock.movement]);

  const openNotification = (title: any, body: any) => {
    if (notificationState.ignore) {
      return;
    }

    const now = Date.now();

    const tag = now;
    const icon =
      'http://mobilusoss.github.io/react-web-notification/example/Notifications_button_24.png';
    // const icon = 'http://localhost:3000/Notifications_button_24.png';

    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: tag,
      body: body,
      icon: icon,
      lang: 'en',
      dir: 'ltr',
      sound: './sound.mp3' // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    };

    appDispatch({
      type: 'SET_NOTIFICATION_STATE',
      notificationState: {
        ...notificationState,
        title: title,
        options: options
      }
    });
  };

  useEffect(() => {
    setLastTrend(stock.currentTrend);

    if (lastTrend) {
      const msg =
        `Trend changed to ${stock.currentTrend} for stock ` + stock.symbol;
      message.warn(msg);
      openNotification(stock.symbol, msg);

      setTimeout(() => {
        getSpeechNotification(msg);
      }, 1000);
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: { msg, type: 'trend' }
      });

      setTrendChanged(true);
      setTimeout(() => {
        setTrendChanged(false);
      }, config.trendChangeIndicatorTimeout || 10000);
    }
    // if (firstLoad < 1) {
    //   setFirstLoad(firstLoad + 1);
    // } else if (stock.currentTrend) {

    // }
  }, [stock.currentTrend]);

  useEffect(() => {
    if (stock.perfectVwap) {
      setPerfectVwap(true);
      const { vwap, ltP } = stock;
      let vwapCall = 'Sell';
      if (vwap < ltP) {
        vwapCall = 'Buy';
      }
      const msg =
        'Perfect V WAP ' + vwapCall + ' is created for stock ' + stock.symbol;
      message.warn(msg);
      setTimeout(() => {
        getSpeechNotification(msg);
      }, 1000);
      openNotification(stock.symbol, msg);
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: { msg, type: 'vwap' }
      });

      setTimeout(() => {
        setPerfectVwap(false);
      }, config.trendChangeIndicatorTimeout || 10000);
    }
  }, [stock.perfectVwap]);

  const buyStock = (e: any) => {
    e.preventDefault();
    notification.success({ message: 'Stock is buying' });
  };

  const getStockData = async () => {
    const stockData = await getStockDetails(stock.symbol);
    alert(JSON.stringify(stockData));
  }
  const sellStock = (e: any) => {
    e.preventDefault();

    notification.success({ message: 'Stock is Selling' });
  };
  const getBackgroundColor = (stock: any) => {
    if (stock.currentTrend === 'BUY') {
      if (stock.trendCount === 1) {
        return '#c6f6d5';
      } else if (stock.trendCount === 2) {
        return '#9ae6b4';
      } else if (stock.trendCount >= 3) {
        return '#68d391';
      } else {
        return '#f0f2f5';
      }
    } else {
      if (stock.trendCount === 1) {
        return '#fed7d7';
      } else if (stock.trendCount === 2) {
        return '#feb2b2';
      } else if (stock.trendCount >= 3) {
        return '#fc8181';
      } else {
        return '#f0f2f5';
      }
    }
  };
  const onElementAppear = (el: any, index: any) =>
    spring({
      onUpdate: (val: any) => {
        el.style.opacity = val;
      },
      delay: index * 50
    });
  const onExit = (type: any) => (el: any, index: any, removeElement: any) => {
    spring({
      config: { overshootClamping: true },
      onUpdate: (val: any) => {
        el.style.transform = `scale${type === 'grid' ? 'X' : 'Y'}(${1 - val})`;
      },
      delay: index * 50,
      onComplete: removeElement
    });

    return () => {
      el.style.opacity = '';
      removeElement();
    };
  };
  const onGridExit = onExit('grid');

  const shouldFlip = (prev: any, current: any) => {
    if (prev.type !== current.type) {
      return true;
    }
    return false;
  };


  const p0 = 'M0,100 L25,100 C34,20 40,0 100,0';
  const p1 =
    'M0,100 C5,120 25,130 25,100 C30,60 40,75 58,90 C69,98.5 83,99.5 100,100';
  const ease0 = TweenOne.easing.path(p0);
  const ease1 = TweenOne.easing.path(p1);
  return (
    <Flipped flipId={stock.symbol} key={stock.symbol}>
      {/* <TweenOne
        paused={
          !(
            perfectVwap &&
            ((stock.ltP > stock.vwap && stock.ema > stock.vwap) ||
              (stock.ltP < stock.vwap && stock.ema < stock.vwap))
          )
        }
        animation={[
          {
            y: -5,

            repeat: -1,
            yoyo: true,
            scale: 0.9,
            duration: 1000
          }
        ]}
        className="code-box-shape"
      > */}
      <div
        // size="small"
        // headStyle={{
        //   backgroundColor: stock.per
        //     ? stock.per > 0
        //       ? '#22543d'
        //       : '#e53e3e'
        //     : '#c5c5c5',
        //   padding: 3,
        //   fontSize: 14,
        //   color: '#FFF'
        // }}
        // bodyStyle={{
        //   padding: 3
        // }}
        // title={stock.symbol}
        // extra={<span style={{ color: '#FFF' }}> {stock.per}% </span>}
        style={{
          width: 159,
          height: 'max-content',
          backgroundColor: getBackgroundColor(stock),
          margin: 3,
          fontSize: 13,
          padding: 0
        }}
      >
        {/* <button
          onClick={() => {
            const msg =
              `Trend changed to ${stock.currentTrend} for stock ` +
              stock.symbol;
            message.warn(msg);
            openNotification(stock.symbol, msg);
            setTimeout(() => {
              getSpeechNotification(msg);
            }, 1000);
          }}
        >
          Say
        </button> */}
        <div
          style={{
            backgroundColor: stock.per
              ? +stock.per > 0
                ? '#22543d'
                : '#e53e3e'
              : '#c5c5c5',
            padding: 1,
            fontSize: 12,
            color: '#FFF'
          }}
        >
          <span className="flex flex-row justify-between">
            <span>{stock.symbol}</span>
            <span style={{ color: '#FFF' }}> {stock.per}% </span>
          </span>
        </div>
        <div style={{ padding: 1 }}>
          {/* <button
            onClick={() => {
              stock.perfectVwap = true;
            }}
          >
            notify
          </button>
          <button
            onClick={() => {
              stock.currentTrend =
                stock.currentTrend === 'BUY' ? 'SELL' : 'BUY';
            }}
          >
            notify Trend
          </button> */}
          {trendChanged && (
            <Icon
              type="slack"
              style={{
                fontSize: 24,
                color: stock.currentTrend === 'BUY' ? '#22543d' : '#fc8181'
              }}
              spin
            />
          )}
          {stock.daily && (
            <p style={{ marginBottom: 1 }}>
              Daily Volitility : {stock.daily.toFixed(2)}
            </p>
          )}

          <p style={{ marginBottom: 1 }}>
            {stock.currentTrend}

            {stock.quantity && (
              <span style={{ marginBottom: 1 }}>
                {' '}
                <b> {stock.quantity}</b> Qty.
              </span>
            )}
          </p>
          {stock.margin && (
            <p style={{ marginBottom: 1 }}>
              Margin:
              {(stock.margin === '12.5' && (
                <span>
                  {' '}
                  {[1, 2, 3].map(x => (
                    <Coin />
                  ))}
                </span>
              )) ||
                ((stock.margin === '9' || stock.margin === '8.3') && (
                  <span>
                    {[1, 2].map(x => (
                      <Coin />
                    ))}
                  </span>
                )) ||
                (stock.margin <= '5' && <Coin />)}
            </p>
          )}
          {stock.ltP && <p style={{ marginBottom: 1 }}>LTP:{stock.ltP}</p>}

          {stock.vwap && (
            <p
              style={{
                marginBottom: 2,
                color: '#fff',
                backgroundColor: stock.vwapIsTooFar
                  ? '#35353521'
                  : stock.ltP > stock.vwap
                    ? '#22543d'
                    : '#e53e3e'
              }}
            >
              VWAP:{' ' + stock.vwap}
              {perfectVwap && <Icon type="slack" spin />}
            </p>
          )}
          {stock.ema && (
            <p
              style={{
                marginBottom: 2,
                color: '#fff',
                backgroundColor: stock.ltP > stock.ema ? '#22543d' : '#e53e3e'
              }}
            >
              EMA:{' ' + stock.ema}
              {perfectVwap &&
                ((stock.ltP > stock.vwap && stock.ema > stock.vwap) ||
                  (stock.ltP < stock.vwap && stock.ema < stock.vwap)) && (
                  <Icon type="slack" spin />
                )}
            </p>
          )}
          {stock.rsi && (
            <p
              style={{
                marginBottom: 2,
                color: '#fff',
                backgroundColor:
                  stock.ltP > stock.vwap && stock.rsi < 70
                    ? '#22543d'
                    : stock.ltP < stock.vwap && stock.rsi > 30
                      ? '#e53e3e'
                      : '#35353521'
              }}
            >
              RSI:{' ' + stock.rsi}
              {perfectVwap &&
                ((stock.ltP > stock.vwap && stock.rsi < 70) ||
                  (stock.ltP < stock.vwap && stock.rsi > 30)) && (
                  <Icon type="slack" spin />
                )}
            </p>
          )}
          {movement !== 0 && (
            <p
              style={{
                backgroundColor: movement > 0 ? '#22543d' : '#e53e3e',
                color: '#fff'
              }}
            >
              Movement {' ' + movement}
            </p>
          )}
          {stock.currentTrend === 'BUY' &&
            // perfectVwap &&
            stock.ltP > stock.vwap && (
              <Button
                type="primary"
                block
                style={{ margin: 0 }}
                data-kite="v6luz9id51m1ly45"
                data-exchange="NSE"
                data-tradingsymbol={stock.symbol}
                data-transaction_type="BUY"
                data-quantity={stock.quantity}
                data-order_type="MARKET"
                data-product="MIS"
              >
                Buy
              </Button>
            )}

          <Drawer
            height={450}
            title={stock.symbol}
            destroyOnClose
            placement={'bottom'}
            closable={false}
            onClose={() => setStockInfoVisible(false)}
            visible={stockInfoVisible}
          >
            <StockContent stockDetails={selectedStock} />
          </Drawer>
          <Row>
            <Col span="12">   <Button type="dashed" onClick={async () => { 
               const stockDetails = await getStockDetails(stock.symbol);
              setStockInfoVisible(true) 
              setSelectedStock({symbol:stock.symbol,instrument:stock.instrument,...stockDetails});
              }}>Details</Button></Col>
            <Col span="12"> <Button  type={'ghost'} onClick={() => openStock(stock)}>Chart</Button></Col>
          </Row>


          {/* <Popover title={stock.symbol} placement="topLeft" content={<StockContent stock={stock} />} destroyTooltipOnHide trigger="click">
            <Button type={'dashed'}>Status</Button>
          </Popover> */}
          {stock.currentTrend === 'SELL' &&
            // perfectVwap &&
            stock.ltP < stock.vwap && (
              // {true && (
              // <Popconfirm
              //   title="Are you sure？"
              //   okText="Yes"
              //   cancelText="No"
              //   placement="bottom"

              //   // data-price="100"
              // >
              <Button
                type="danger"
                block
                style={{ margin: 0 }}
                data-kite="v6luz9id51m1ly45"
                data-exchange="NSE"
                data-tradingsymbol={stock.symbol}
                data-transaction_type="SELL"
                data-quantity={stock.quantity}
                data-order_type="MARKET"
                data-product="MIS"
              >
                Sell
              </Button>

              // </Popconfirm>
            )}
        </div>
      </div>
      {/* </TweenOne> */}
    </Flipped>
  );
};

export { StockCard as default };
