import React from 'react';
import { useState, useEffect } from 'react';
import './CloudStorage.less';
import 'antd/dist/antd.css';
import {DatePicker} from 'antd';
import moment from 'moment';
const sdk = window.h5PanelSdk;
const { RangePicker } = DatePicker;
import ReactPlayer from 'react-player';
import { ImageViewer } from 'antd-mobile';
import { Picker, Button} from 'antd-mobile'

export default function CloudStorage() {
  const {ProductId, DeviceName} = sdk.deviceInfo;
  const [events, setEvents] = useState([,,,,,]);
  const [dataList, setDataList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [storageTime, setStorageTime] = useState([]);
  const [signedVideoURL, setSignedVideoURL] = useState('');
  const [videoStream, setVideoStream] = useState('');
  const [audioStream, setAudioStream] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleData, setVisibleData] = useState(false);
  const [visibleStorage, setVisibleStorage] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [value, setValue] = useState();
  const [columns, setColumns] =  useState([]);
  const [list, setList] = useState([]);
  // const columns = [
  //   {
  //     title: 'EventID',
  //     dataIndex: 'EventID',
  //     key: 'EventID'
  //   },
  //   {
  //     title: 'StartTime',
  //     dataIndex: 'StartTime',
  //     key: 'EventID',
  //     render: (value, record, index) => <span>{moment(record.StartTime*1000).format('YYYY-MM-DD hh:mm')}</span>
  //   },
  //   {
  //     title: 'EndTime',
  //     dataIndex: 'EndTime',
  //     key: 'EventID',
  //     render: (value, record, index) => <span>{moment(record.EndTime*1000).format('YYYY-MM-DD hh:mm')}</span>
  //   },
  //   // {
  //   //   title: 'Thumbnail',
  //   //   dataIndex: 'Thumbnail',
  //   //   key: 'Thumbnail'
  //   // },
  //   {
  //     title: 'Operation',
  //     dataIndex: 'Operation',
  //     key: 'EventID',
  //     render: (value, record, index) => <Button onClick={()=>{iotVideoDescribeCloudStorageThumbnail(record.Thumbnail)}}>缩略图</Button>
  //   }
  // ]

  useEffect(() => {
    iotVideoDescribeCloudStorageEvents([moment().unix()-(3600*24),moment().unix()])
    iotVideoDescribeCloudStorageDate();
  },[]);

  const iotVideoDescribeCloudStorageEvents = (dateString) => {
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
        // console.log("itme",item.StartTime);
        // console.log("yime", moment(item.StartTime*1000).format('YYYY-MM-DD'));
        let time = moment(item.StartTime*1000).format('YYYY-MM-DD hh:mm')+'~'+moment(item.EndTime*1000).format('YYYY-MM-DD hh:mm');
        newTimeList.push([{label:time, value:time}]);
        list.push(time)
      })
      setTimeList(timeList);
      setStorageTime(newTimeList);
      setList(list);
      console.log(storageTime);
    })
  }

  const iotVideoGenerateSignedVideoURL = (value) => {
    console.log("value", value);
    const expireTime =  moment().unix()+3600*24;
    sdk.requestTokenApi("IotVideoGenerateSignedVideoURL", {
      ProductId,
      DeviceName,
      VideoURL: `${videoUrl}?starttime_epoch=${value.StartTime}&endtime_epoch=${value.EndTime}`,
      ExpireTime: expireTime
    }).then((res) => {
      setSignedVideoURL(res.SignedVideoURL);
    })
  }
  const onChange = (
    value,
    dateString,
  ) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    let timeArr = [];
    timeArr.push(moment(dateString[0])/1000);
    timeArr.push(moment(dateString[1])/1000);
    iotVideoDescribeCloudStorageEvents(timeArr);
  };

  const onChangeDate = (value, dateString) => {
    iotVideoDescribeCloudStorageStreamData(moment(dateString)/1000)
  } 
  return (
    <div style={{padding:5}}>
      <div style={{textAlign:"center", fontSize:'20px'}}>云存服务</div>
      <button  onClick={()=>{sdk.goDeviceDetailPage();}}>返回设备详情页</button>
        <div>
          <span>请选择时间段：</span>
          <RangePicker
          style={{width:"250px"}}
          showTime={{ format: 'HH' }}
          format="YYYY-MM-DD"
          onChange={onChange}
        />
        </div>
        {/* <Table
          // style={{ margin:"0 auto"}}
          bordered={false} 
          columns={columns} 
          dataSource={events}
          size={"small"}
          // scroll={{x:true}}
        /> */}
      {/* </Card> */}
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
      <div>
        <span>拉取图片流数据: </span>
        <DatePicker showTime={{ format: 'HH' }} onChange={onChangeDate} style={{width:"70%"}}/>
        <div><span>AudioStream:</span><textarea readOnly rows={3}  style={{width:"75%",verticalAlign: "middle",margin:"3px 0"}} value={audioStream}></textarea></div>
        <div><span>VideoStream:</span><textarea readOnly style={{width:"75%",verticalAlign: "middle"}} rows={3} value={videoStream}></textarea></div>
        {/* <Select 
          defaultValue="请先选择云存的日期" 
          style={{ width: "100%", margin:"3px 0"}} 
          onChange={(value)=>{
            iotVideoDescribeCloudStorageTime(value); 
          }}>
          {
            dataList.map((item, index) => {
              console.log('1',item);
              return <Option value={item} key={index}/>
            })
          }
        </Select> */}
        <button
          onClick={() => {
            setVisibleData(true)
          }}
        >
          请先选择云存的日期
        </button>
        <Picker
          columns={columns}
          visible={visibleData}
          onClose={() => {
            setVisibleData(false)
          }}
          value={value}
          onConfirm={value => {
            iotVideoDescribeCloudStorageTime(value[0]);
          }}
        />
        <button
          onClick={() => {
            setVisibleStorage(true)
          }}
        >
          请选择云存的时间轴
        </button>
        <Picker
          columns={storageTime}
          visible={visibleStorage}
          onClose={() => {
            setVisibleStorage(false)
          }}
          value={value}
          onConfirm={value => {
            iotVideoGenerateSignedVideoURL(timeList[list.indexOf(value[0])]);
          }}
        />
        {/* <Select 
          defaultValue="请选择云存的时间轴" 
          style={{ width:"100%" }}
          onChange={(value)=>{
            iotVideoGenerateSignedVideoURL(timeList[storageTime.indexOf(value)]);
          }}>
          {
            storageTime.map((item,index) => {
              return <Option value={item} key={index}>{item}</Option>
            })
          }
        </Select> */}
      </div>
      <div>
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
      </div>
    </div>
  )
}