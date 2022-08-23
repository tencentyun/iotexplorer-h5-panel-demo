import React from 'react';
import { useState } from 'react';
import './CloudStorage.less';
import 'antd/dist/antd.css';
import { Table, Card, Button, Select, DatePicker} from 'antd';
import { useEffect } from 'react';
import moment from 'moment';
const sdk = window.h5PanelSdk;
const { Option } = Select;
const { RangePicker } = DatePicker;
import ReactPlayer from 'react-player';

export default function CloudStorage() {
  const {ProductId, DeviceName} = sdk.deviceInfo;
  const [events, setEvents] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [storageTime, setStorageTime] = useState([]);
  const [signedVideoURL, setSignedVideoURL] = useState('');
  const [videoStream, setVideoStream] = useState('');
  const [audioStream, setAudioStream] = useState('');

  const columns = [
    {
      title: 'EventID',
      dataIndex: 'EventID',
      key: 'EventID'
    },
    {
      title: 'StartTime',
      dataIndex: 'StartTime',
      key: 'EventID',
      render: (value, record, index) => <span>{moment(record.StartTime*1000).format('YYYY-MM-DD hh:mm')}</span>
    },
    {
      title: 'EndTime',
      dataIndex: 'EndTime',
      key: 'EventID',
      render: (value, record, index) => <span>{moment(record.EndTime*1000).format('YYYY-MM-DD hh:mm')}</span>
    },
    // {
    //   title: 'Thumbnail',
    //   dataIndex: 'Thumbnail',
    //   key: 'Thumbnail'
    // },
    {
      title: 'Operation',
      dataIndex: 'Operation',
      key: 'EventID',
      render: (value, record, index) => <Button key={index} onClick={()=>{iotVideoDescribeCloudStorageThumbnail(record.Thumbnail)}}>缩略图</Button>
    }
  ]

  useEffect(() => {
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
      setDataList(res.Data)
    })
  }

  const iotVideoDescribeCloudStorageThumbnail = (thumbnail) => {
    sdk.requestTokenApi("IotVideoDescribeCloudStorageThumbnail",{
      ProductId,
      DeviceName,
      Thumbnail: thumbnail
    }).then((res) => {
      window.open(res.ThumbnailURL);
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
      console.log(res);
      let timeList = res.Data.TimeList;
      let newTimeList = [];
      timeList.map((item)=>{
        console.log("itme",item.StartTime);
        console.log("yime", moment(item.StartTime*1000).format('YYYY-MM-DD'));
        let time = moment(item.StartTime*1000).format('YYYY-MM-DD hh:mm')+'~'+moment(item.EndTime*1000).format('YYYY-MM-DD hh:mm');
        newTimeList.push(time);
      })
      setTimeList(timeList)
      setStorageTime(newTimeList)
    })
  }

  const iotVideoGenerateSignedVideoURL = (value) => {
    console.log("value", value);
    sdk.requestTokenApi("IotVideoGenerateSignedVideoURL", {
      ProductId,
      DeviceName,
      VideoURL: `${videoUrl}?starttime_epoch=${value.StartTime}&endtime_epoch=${value.EndTime}`,
      ExpireTime: 1661235954
    }).then((res) => {
      setSignedVideoURL(res.SignedVideoURL);
    })
  }
  const onChange = (
    value,
    dateString,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    let timeArr = [];
    timeArr.push(moment(dateString[0])/1000);
    timeArr.push(moment(dateString[1])/1000);
    iotVideoDescribeCloudStorageEvents(timeArr);
  };

  const onChangeDate = (value, dateString) => {
    iotVideoDescribeCloudStorageStreamData(moment(dateString)/1000)
  } 
  return (
    <div className="sdk">
      <div style={{textAlign:"center", fontSize:'20px'}}>云存服务</div>
      <Card>
        <div>
        <span>请选择时间段：</span>
        <RangePicker
        style={{width:"250px"}}
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
      />
        </div>
        <Table
          // style={{ margin:"0 auto"}}
          bordered={false} 
          columns={columns} 
          dataSource={events}
          size={"small"}
          // scroll={{x:true}}
        />
      </Card>
        <Card >
          <span>拉取图片流数据: </span>
          <DatePicker showTime onChange={onChangeDate} style={{width:"70%"}}/>
          <div><span>AudioStream:</span><textarea readOnly rows={1}  style={{width:"75%",verticalAlign: "middle",margin:"3px 0"}} value={audioStream}></textarea></div>
          <div><span>VideoStream:</span><textarea readOnly style={{width:"75%",verticalAlign: "middle"}} rows={1} value={videoStream}></textarea></div>
          <Select 
            defaultValue="请先选择云存的日期" 
            style={{ width: "100%", margin:"3px 0"}} 
            onChange={(value)=>{
              iotVideoDescribeCloudStorageTime(value); 
              console.log("item",value);
            }}>
            {
              dataList.map((item, index) => {
                console.log('1',item);
                return <Option value={item} key={index}/>
              })
            }
          </Select>
          <Select 
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
          </Select>
        </Card>
        <Card style={{}}>
          <ReactPlayer className='react-player'
            //这里是由上级页面传过来的视频地址
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