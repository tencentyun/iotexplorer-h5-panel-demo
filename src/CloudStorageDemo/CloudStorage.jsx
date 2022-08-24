import React from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
const sdk = window.h5PanelSdk;
import './CloudStorage.less'
import ReactPlayer from 'react-player';
import { ImageViewer, Picker, Calendar, Popup, Button, Card, TextArea } from 'antd-mobile'


export default function CloudStorage() {
  const {ProductId, DeviceName} = sdk.deviceInfo;
  const [events, setEvents] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [storageTime, setStorageTime] = useState([]);
  const [signedVideoURL, setSignedVideoURL] = useState('');
  const [videoStream, setVideoStream] = useState('');
  const [audioStream, setAudioStream] = useState('');
  const [eventVisible, setEventVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleData, setVisibleData] = useState(false);
  const [visibleStorage, setVisibleStorage] = useState(false);
  const [streamVisible, setStreamVisible] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [columns, setColumns] =  useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    iotVideoDescribeCloudStorageEvents([moment().unix()-(3600*24),moment().unix()])
    iotVideoDescribeCloudStorageDate();
  },[]);

  const iotVideoDescribeCloudStorageEvents = (dateString) => {
    console.log(dateString);
    sdk.requestTokenApi('IotVideoDescribeCloudStorageEvents', {
      ProductId,
      DeviceName,
      StartTime: dateString? dateString[0]:'',
      EndTime: dateString? dateString[1]:'',
      Size: 10,
      Context: ""
    }).then((res) => {
      let timeList = res.Events;
      let newTimeList = [];
      timeList.map((item)=>{
        let time = moment(item.StartTime*1000).format('YYYY-MM-DD hh:mm')+'~'+moment(item.EndTime*1000).format('YYYY-MM-DD hh:mm');
        newTimeList.push(time);
      })
      setEvents(res.Events);
    })
  }

  const iotVideoDescribeCloudStorageDate = () => {
    sdk.requestTokenApi("IotVideoDescribeCloudStorageDate", {
      ProductId,
      DeviceName
    }).then((res) => {
      setDataList(res.Data);
      let columns = [];
      res.Data.map((item, index)=>{
        columns.push({label: item, value: item});
      });
      setColumns([columns])
    })
  }

  const iotVideoDescribeCloudStorageThumbnail = (thumbnail) => {
    sdk.requestTokenApi("IotVideoDescribeCloudStorageThumbnail",{
      ProductId,
      DeviceName,
      Thumbnail: thumbnail
    }).then((res) => {
      setThumbnail(res.ThumbnailURL)
    })
  }

  const iotVideoDescribeCloudStorageStreamData = (data) => {
    sdk.requestTokenApi("IotVideoDescribeCloudStorageStreamData", {
      ProductId,
      DeviceName,
      StartTime: data
    }).then((res)=>{
      setAudioStream(res.AudioStream);
      setVideoStream(res.VideoStream)
    })
  }

  const iotVideoDescribeCloudStorageTime = (date) => {
    sdk.requestTokenApi("IotVideoDescribeCloudStorageTime", {
      ProductId,
      DeviceName,
      Date: date
    }).then((res) => {
      setVideoUrl(res.Data.VideoURL);
      // console.log(res);
      let timeList = res.Data.TimeList;
      let newTimeList = [];
      let list = []
      timeList.map((item)=>{
        let time = moment(item.StartTime*1000).format('YYYY-MM-DD hh:mm')+'~'+moment(item.EndTime*1000).format('YYYY-MM-DD hh:mm');
        newTimeList.push({label:time, value:time});
        list.push(time)
      })
      setTimeList(timeList);
      setStorageTime([newTimeList]);
      setList(list);
    })
  }

  const iotVideoGenerateSignedVideoURL = (value) => {
    console.log("value", value);
    const expireTime =  moment().unix()+3600*24;
    console.log(expireTime);
    sdk.requestTokenApi("IotVideoGenerateSignedVideoURL", {
      ProductId,
      DeviceName,
      VideoURL: `${videoUrl}?starttime_epoch=${value.StartTime}&endtime_epoch=${value.EndTime}`,
      ExpireTime: expireTime
    }).then((res) => {
      setSignedVideoURL(res.SignedVideoURL);
    })
  }
  return (
    <div style={{padding:5}}>
      <div style={{textAlign:"center", fontSize:'20px'}}>云存服务</div>
      <Card>
        <Button 
          size='small'
          onClick={()=>{sdk.goDeviceDetailPage();}}>返回设备详情页</Button>
        <Button
          size='small'
          onClick={() => {
            setEventVisible(true)
          }}
        >
          请选择云存事件时间段
        </Button>
        <Popup
          visible={eventVisible}
          onMaskClick={() => {
            setEventVisible(false)
          }}
          bodyStyle={{ height: '40vh' }}
        >
          <Calendar
            className={{}}
                selectionMode='range'
                onChange={val => {
                  let timeArr = [];
                  val.map((item)=>{
                    timeArr.push(moment(item).unix());
                  })
                  iotVideoDescribeCloudStorageEvents(timeArr);
                }}
          />
        </Popup>
        <table style={{margin:"5px"}}>
          <tr>
            <th>EventID</th>
            <th>StartTime</th>
            <th>EndTime</th>
            <th>Operation</th>
          </tr>
            {
              events.map((item)=>{
                return <tr>
                  <td>{item.EventID}</td>
                  <td>{moment(item.StartTime*1000).format('YYYY-MM-DD hh:mm')}</td>
                  <td>{moment(item.EndTime*1000).format('YYYY-MM-DD hh:mm')}</td>
                  <td>
                  <button
                    onClick={() => {
                      setVisible(true);
                      iotVideoDescribeCloudStorageThumbnail(item.Thumbnail);
                    }}
                  >
                    缩略图
                  </button>
                  <ImageViewer
                    image={thumbnail}
                    visible={visible}
                    onClose={() => {
                      setVisible(false)
                    }}
                  />
                    </td>
                  </tr>
              })
            }
        </table>
      </Card>
      <Card>
        <Button
        size='small'
        onClick={() => {
          setStreamVisible(true)
        }}
      >
        拉取图片流数据
      </Button>
      <Popup
        visible={streamVisible}
        onMaskClick={() => {
          setStreamVisible(false)
        }}
        bodyStyle={{ height: '40vh' }}
      >
        <Calendar
          className={{}}
              selectionMode='single'
              onChange={val => {
                console.log(moment(val).unix);
                iotVideoDescribeCloudStorageStreamData(moment(val).unix());
              }}
         />
      </Popup>
        <TextArea
         style={{margin:"5px 0"}}
          placeholder='AudioStream:'
          value={audioStream}
          readOnly
        />
        <TextArea
          placeholder='VideoStream:'
          value={videoStream}
          readOnly
        />
        <Button
          size='small'
          onClick={() => {
            setVisibleData(true)
          }}
        >
          请先选择云存的日期
        </Button>
        <Picker
          columns={columns}
          visible={visibleData}
          onClose={() => {
            setVisibleData(false)
          }}
          onConfirm={value => {
            iotVideoDescribeCloudStorageTime(value[0]);
          }}
        />
        <Button
          style={{margin:"5px 0"}}
          size='small'
          onClick={() => {
            setVisibleStorage(true)
          }}
        >
          请选择云存的时间轴
        </Button>
        <Picker
          columns={storageTime}
          visible={visibleStorage}
          onClose={() => {
            setVisibleStorage(false)
          }}
          onConfirm={value => {
            iotVideoGenerateSignedVideoURL(timeList[list.indexOf(value[0])]);
          }}
        />
      <Button 
        size='small'
        onClick={()=>{
        sdk.goDevicePanelPage(sdk.deviceId, {
          passThroughParams: { fullScreen: true },
        });
      }}>p2p云存实时画面</Button>
      </Card>
      <Card>
        <ReactPlayer className='react-player'
          url={signedVideoURL}
          playing
          width='100%'
          controls
          config={{
            file: {
              forceHLS: true,
            }
          }}/>
      </Card>
    </div>
  )
}