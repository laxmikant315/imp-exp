import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
  useRef
} from 'react';
import MainLayout from '../../../layout/Layout';
import SContext from '../context/context-s';
import {
  Form,
  Input,
  Button,
  Layout,
  Icon,
  Switch,
  Calendar,
  notification
} from 'antd';
import {
  getAccessToken,
  getIntradayStocks,
  getLiveStockInformation,
  getEquityInformation,
  getVolumeStocks
} from '../context/service-s';
import { getQuote } from '../context/kite-service-s';
import { Notifications } from './Notifications';
import { Flipper } from 'react-flip-toolkit';
import StockCard from './StockCard';
import moment from 'moment';
import AppContext from '../../../context/context-app';
import SReducer from '../context/reducer-s';
import config from '../../../config.json';
import { getSpeechNotification } from '../../../context/SpeechNotification';

const useInterval = (callback: any, delay: any) => {
  const savedCallback: any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const StocksHomeRaw: React.FC = (props: any) => {
  const { appState, appDispatch } = useContext(AppContext);

  const { notificationState } = appState;
  const [state, dispatch] = useReducer(SReducer, {
    stocks: [],
    cart: [],
    notifications: [],
    round: 0
  });

  let [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const lastTradeDate = config.lastTradeDate;
  let [liveUpdate, setLiveUpdate] = useState(false);
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    getFieldInstance,
    validateFields
  } = props.form;

  const getStocks = (date?: any) => {
    getIntradayStocks(moment(date._d).format('DDMMYYYY')).then(
      (stocks: any) => {
        dispatch({
          type: 'SET_STOCKS',
          stocks
        });
      }
    );
  };

  const onChange = () => {
    setLiveUpdate(!liveUpdate);
  };

  useEffect(() => {
    setLoading(true);
    getIntradayStocks(lastTradeDate).then((stocks: any) => {
      dispatch({
        type: 'SET_STOCKS',
        stocks
      });

      setLoading(false);

      const stocksSymbols = stocks
        .sort((x: any, y: any) => y.currentTrend - x.currentTrend)
        .map((y: any) => y.symbol);

      if (config.apiEnabled) {
        const finalStocks = stocksSymbols.slice(0, 5);
        setLoading(true);
        getLiveStockInformation(finalStocks.join(',')).then((stocks: any) => {
          if (typeof stocks === 'string') {
            notification.error({ message: stocks });
            openNotification('ERRPR', stocks);
            return;
          }
          console.log(stocks);
          setLoading(false);
          dispatch({
            type: 'SET_STOCKS',
            stocks
          });

          setLastIndex(4);
        });
      }
      dispatch({
        type: 'SET_STOCKS',
        stocks
      });

      getNifty();
    });
  }, []);

  useInterval(() => {
    if (liveUpdate) {
      setLoading(true);
      getEquityInformation().then((data: any) => {
        dispatch({
          type: 'SET_STOCKS',
          stocks: data.stocks
        });
        dispatch({
          type: 'SET_NIFTY',
          data: { ...state.nifty, ...data.nifty }
        });
        setLoading(false);
      });
    }
  }, config.equityUpdateTimeout || 60000);

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

  const getNifty = () => {
    getLiveStockInformation('NIFTY 50', false).then((data: any) => {
      if (typeof data === 'string') {
        notification.error({ message: data });
        openNotification('ERRPR', data);
        return;
      }

      dispatch({
        type: 'SET_NIFTY',
        data: state.nifty ? { ...state.nifty, ...data[0] } : data[0]
      });
    });
  };

  const [stocksSymbols, setStocksSymbols] = useState([]);
  useEffect(() => {
    const symbols = state.stocks.map((x: any) => x.symbol);
    setStocksSymbols(symbols);
  }, [state.stocks]);

  useInterval(() => {
    if (liveUpdate && config.apiEnabled) {
      getNifty();
    }
  }, 300000);

  useInterval(() => {
    if (liveUpdate) {
      getStocksWithVolume();
    }
  }, 60000);

  const getStocksWithVolume = () => {
    getVolumeStocks().then((data: any) => {
      if (typeof data === 'string') {
        notification.error({ message: data });
        openNotification('ERRPR', data);
        return;
      }
      if (data && data.length > 0) {
        const stocks = data.map((x: any) => x.nsecode).join(' & ');
        const msg = `Volume is showing for stock ` + stocks;

        const existing = state.notifications.filter(
          (x: any) => x.type === 'volume'
        );
        if (
          existing &&
          existing.length > 0 &&
          existing[existing.length - 1].msg === msg
        ) {
          return;
        }

        openNotification(stocks, msg);

        setTimeout(() => {
          getSpeechNotification(msg);
        }, 1000);
        dispatch({
          type: 'ADD_NOTIFICATION',
          notification: { msg, type: 'volume' }
        });
      }
    });
  };

  useInterval(() => {
    if (liveUpdate && config.apiEnabled) {
      let stocksSymbols = state.stocks
        // .sort((x: any, y: any) => y.currentTrend - x.currentTrend)
        .map((y: any) => y.symbol);

      const batchCount = +(stocksSymbols.length / 5).toString().split('.')[0];
      const otherSymbolsCount = stocksSymbols.length % 5;

      let finalStocks: any = [];
      let availableSpace = 5;

      if (lastIndex + 1 == stocksSymbols.length) {
        lastIndex = -1;
      }
      if (lastIndex + 1 >= batchCount * 5 && otherSymbolsCount > 0) {
        finalStocks = [
          ...stocksSymbols.slice(
            lastIndex + 1,
            lastIndex + 1 + otherSymbolsCount
          )
        ];

        availableSpace = 5 - otherSymbolsCount;
      }

      if (availableSpace === 5) {
        finalStocks = [...stocksSymbols.slice(lastIndex + 1, lastIndex + 6)];
        setLastIndex(lastIndex + 5);
      } else {
        finalStocks = [
          ...finalStocks,
          ...stocksSymbols.slice(0, availableSpace)
        ];
        setLastIndex(availableSpace + 1);
      }

      // const finalStocks = stocksSymbols.slice(start, end);

      getLiveStockInformation(finalStocks.join(',')).then((stocks: any) => {
        if (typeof stocks === 'string') {
          notification.error({ message: stocks });
          openNotification('ERRPR', stocks);
          return;
        }
        dispatch({
          type: 'SET_STOCKS',
          stocks
        });
      });
      // setTimeout(() => {
      // getNifty();
      // }, 120000);
    }
  }, config.liveDataUpdateTimeout || 20000);

  return (
    <MainLayout>
      <SContext.Provider value={{ state, dispatch }}>
        <Layout className="h-full">
          <div className="flex flex-row justify-between items-center p-2">
            <span>
              {loading && (
                <Icon
                  type="loading"
                  style={{
                    fontSize: 20
                  }}
                  spin
                />
              )}
            </span>

            <span>
              <span className="pr-2">
                <Switch defaultChecked={liveUpdate} onChange={onChange} /> Live
                Data
              </span>
            </span>
          </div>

          <div className="flex bg-gray-200 w-full flex-1 overflow-auto">
            <div className=" bg-gray-400 flex flex-col ">
              <Calendar fullscreen={false} onChange={getStocks} />
              <Notifications></Notifications>
            </div>

            <div className="flex-1 bg-gray-300 flex flex-col overflow-auto">
              <Flipper
                flipKey={JSON.stringify(state.stocks)}
                className="flex justify-around w-full  flex-1 overflow-auto"
              >
                <div className="flex flex-col w-full  items-center m-2">
                  <h1>Buy</h1>
                  <div className="flex-1 bg-white w-full  overflow-auto ">
                    <div className=" flex flex-wrap ">
                      {state.stocks
                        .filter((x: any) => x.per > 0 && !x.inCart)
                        .sort((x: any, y: any) => y.per - x.per)
                        .map((d: any) => (
                          <>
                            <StockCard stock={d} key={d.symbol}></StockCard>
                            <button
                              className="hidden"
                              data-kite="v6luz9id51m1ly45"
                            ></button>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full  items-center  m-2">
                  <h1>Sell</h1>
                  <div className="flex-1 bg-white  w-full overflow-auto">
                    <div className="flex flex-wrap">
                      {state.stocks &&
                        state.stocks
                          .filter((x: any) => x.per < 0 && !x.inCart)
                          .sort((x: any, y: any) => x.per - y.per)
                          .map((x: any) => (
                            <>
                              <StockCard key={x.symbol} stock={x}></StockCard>
                              <button
                                className="hidden"
                                data-kite="v6luz9id51m1ly45"
                              ></button>
                            </>
                          ))}
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col   items-center  m-2 "
                  style={{ width: 180 }}
                >
                  <h1>Indexes</h1>
                  <div className="flex-1 bg-white  w-full overflow-auto">
                    <div className="flex flex-wrap">
                      {state.nifty && state.nifty.per && (
                        <StockCard stock={state.nifty}></StockCard>
                      )}
                    </div>
                  </div>
                </div>
              </Flipper>

              {state.cart && state.cart.length > 0 && (
                <div className=" bg-white m-2  overflow-auto ">
                  <div
                    className="flex flex-row overflow-auto"
                    style={{ display: '-webkit-box' }}
                  >
                    {state.cart.map((x: any) => (
                      <StockCard key={x.symbol} stock={x}></StockCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      </SContext.Provider>
    </MainLayout>
  );
};

const StocksHome = Form.create<any>({ name: 'horizontal_login' })(
  StocksHomeRaw
);

export { StocksHome as default };
