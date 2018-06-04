import React from 'react';
import ReactDOM from 'react-dom';
import {LocaleProvider, DatePicker, message} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.css'

moment.locale('zh-cn');

import {Tree, Icon, Popconfirm} from 'antd';

const TreeNode = Tree.TreeNode;

class Demo extends React.Component {
  state = {
    treeData: [
      {title: 'Expand to load', key: '0'},
      {title: 'Expand to load', key: '1'},
      {title: 'Tree Node', key: '2', isLeaf: true},
    ],
    selectedKeys: [],
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          {title: 'Child Node', key: `${treeNode.props.eventKey}-0`},
          {title: 'Child Node', key: `${treeNode.props.eventKey}-1`},
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 100);
    });
  }
  onTreeSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    console.log('selectedKeys', selectedKeys);
    this.setState({selectedKeys});
  }

  onTreeClick = (e) => {
    console.log(e);
    const targetCls = e.target.className;

    let targetType;
    if (targetCls.indexOf('edit') !== -1) {
      targetType = 0;
    } else if (targetCls.indexOf('minus') !== -1) {
      targetType = 1;
    } else if (targetCls.indexOf('plus') !== -1) {
      targetType = 2;
    } else {
      return;
    }
    e.stopPropagation();
    switch (targetType) {
      case 0:
        //跳往编辑页
        console.log('跳往编辑页');
        break;
      case 1:
        //气泡确认框处理
        console.log('气泡确认框处理');
        break;
      case 2:
        //跳往新增页面
        console.log('跳往新增页面');
        break;
      default:
        //do something
    }
  }

  handleDeleteTree = (e) => {
    console.log('封存组织');
  }

  getCustomTreeNode = (data, key) => {
    const {selectedKeys} = this.state;
    const nodeCls = selectedKeys[0] === key ? 'cus-tree-node' : 'cus-tree-node hide-tree-opt';
    return (<span className={nodeCls} onClick={this.onTreeClick}>
      <span>{data}</span>
      <span className='tree-opt'>
        <Icon type="edit" className='tree-edit-icon tree-icon'/>
        <Popconfirm placement="bottomLeft" title="你确定要删除吗"
          okText="确定"
          cancelText="取消"
          onConfirm={this.handleDeleteTree}
        >
          <Icon type="minus-circle-o" className='tree-minus-icon tree-icon'/>
        </Popconfirm>
        <Icon type="plus-circle-o" className='tree-plus-icon tree-icon'/>
      </span>
    </span>)
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={this.getCustomTreeNode(item.title, item.key)} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (<TreeNode title={this.getCustomTreeNode(item.title, item.key)} key={item.key} dataRef={item}/>);
    });
  }

  render() {
    return (
      <Tree
        onSelect={this.onTreeSelect}
        onClick={this.onTreeClick}
        showLine
        draggable
        loadData={this.onLoadData}>
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
    );
  }
}

ReactDOM.render(<Demo/>, document.getElementById('root'));