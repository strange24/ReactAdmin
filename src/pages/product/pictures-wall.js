import React,{Component} from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api';
import PropTypes from 'prop-types';
import {BASE_IMG_URL} from '../../utils/constants';
// 图片上传组件
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  static propTypes={
    imgs:PropTypes.array
  }
  state = {
    previewVisible: false,//标识是否显示大图
    previewImage: '',//大图的地址url
    previewTitle: '',
    fileList: [
    //   {
    //     uid: '-1',//每个file都有自己唯一的id
    //     name: 'image.png',//图片文件名
    //     status: 'done',//图片状态   done--已上传 uploading--上传中   removed---已删除
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-2',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-3',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-4',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-xxx',
    //     percent: 50,
    //     name: 'image.png',
    //     status: 'uploading',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-5',
    //     name: 'image.png',
    //     status: 'error',
    //   },
    ],
  };

  constructor(props){
    super(props)
    let fileList=[];
    // 如果传入图片数组imgs则fileList不为空
    const {imgs}=this.props;
    if(imgs&&imgs.length>0){
      fileList=imgs.map((img ,index)=>({
              uid: -index,
              name: img,
              status: 'done',
              url:BASE_IMG_URL+img
      }))
    }
    // 初始化状态
    this.state={
      previewVisible: false,//标识是否显示大图
      previewImage: '',//大图的地址url
      fileList//所有已上传图片的数组 
    }
  }
  handleCancel = () => this.setState({ previewVisible: false });
// 隐藏modal
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

//   dileList:所有已上传图片文件对象的数组
// file:当前操作的图片文件(上传/删除)
  handleChange = async({file, fileList }) => {
      console.log('handleChange()',file);
    // 一旦上传成功,将当前上传的file的信息修正(name,url)
    if(file.status==='done'){
        const result=file.response
        if(result.status===0){
            message.success('上传图片成功');
            const {name,url}=result.data;
            file=fileList[fileList.length-1];
            file.name=name;
            file.url=url;
        }else{
            message.error('上传图片失败');
        }
    }else if(file.status==='removed'){//删除图片
      const result=await reqDeleteImg(file.name);
      if(result.status===0){
        message.success('图片删除成功！');
      }else{
        message.error('图片删除失败！');
      }
    }

    //   在操作中(上传/删除)过程中及时更新fileList状态
    this.setState({ fileList })
  };

//   获取所有已上传图片文件名的数组
  getImgs=()=>{
      return this.state.fileList.map(file=>file.name);
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"//上传图片的接口地址
          listType="picture-card"//卡片样式
          name='image'//请求参数名
          accept='image/*' //只接受图片格式
          fileList={fileList} //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}//显示指定file对应的大图
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;
