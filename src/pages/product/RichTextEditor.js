import React, { Component } from 'react';
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class RichTextEditor extends Component {
    static propTypes={
        detail:PropTypes.string
    }
    
  
  constructor(props) {
    super(props);
    const html = this.props.detail;
    if(html){
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }
    }else{
        this.state = {
            editorState: EditorState.createEmpty(),//创建一个没有内容的编辑对象
          }
    }

  }
  getDetail=()=>{
    //   返回输入数据对应的html格式的文本
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }
//   输入过程中实时的回调 
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
//   上传图片
 uploadImageCallBack=(file)=> {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file); 
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url=response.data.url;
          // resolve(response);
          resolve({data:{link:url}});
        // 直接发送response和下面这种都可以发送成功
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
        //   wrapperClassName="demo-wrapper"
        //   editorClassName="demo-editor"
          editorStyle={{border:'1px solid black', paddingLeft:10,minHeight:200,maxHeight:600}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}
export default RichTextEditor;
