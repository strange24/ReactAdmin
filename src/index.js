import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import storageUtils from './utils/storageUtils';
import mermoryUtils from './utils/mermoryUtils';

// 读取local中保存user到内存中
const user=storageUtils.getUser();
mermoryUtils.user=user;

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);

