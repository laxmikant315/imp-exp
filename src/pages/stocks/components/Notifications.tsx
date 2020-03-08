import { Card, Icon, List } from 'antd';
import React, { useContext } from 'react';
import SContext from '../context/context-s';
import { Flipper, Flipped } from 'react-flip-toolkit';

const Notification = (props: any) => {
  return (
    <span className=" flex-1  overflow-auto">
      <h1>{props.title}</h1>
      <List
        size="small"
        bordered
        dataSource={props.notifications.sort(
          (x: any, y: any) => y.time - x.time
        )}
        renderItem={(item: any) => (
          <Flipped flipId={item.key} key={item.key}>
            <List.Item>
              <Icon type="clock-circle" className="m-1" />
              {item.time.format('LT')}
              <br />
              {item.msg}
            </List.Item>
          </Flipped>
        )}
      />
    </span>
  );
};

export const Notifications: React.FC = (props: any) => {
  const { state, dispatch } = useContext(SContext);
  const { notifications } = state;

  const vwapNotifications = notifications.filter((x: any) => x.type === 'vwap');
  const trendNotifications = notifications.filter(
    (x: any) => x.type === 'trend'
  );
  const volumeNotifications = notifications.filter(
    (x: any) => x.type === 'volume'
  );

  return (
    <Flipper
      flipKey={JSON.stringify(notifications)}
      className="flex flex-1 flex-col bg-white overflow-auto px-2"
    >
      {notifications && notifications.length > 0 && (
        <>
          <h1>Notifications</h1>
          <div className="flex flex-col  h-full">
            {vwapNotifications.length > 0 && (
              <Notification
                title="VWAP"
                notifications={vwapNotifications}
              ></Notification>
            )}

            {trendNotifications.length > 0 && (
              <Notification
                title="Trend"
                notifications={trendNotifications}
              ></Notification>
            )}

            {volumeNotifications.length > 0 && (
              <Notification
                title="Volume"
                notifications={volumeNotifications}
              ></Notification>
            )}
          </div>
        </>
      )}
    </Flipper>
  );
};
