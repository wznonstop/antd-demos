import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

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

  /**
   * 模拟获取数据
   */
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

  /**
   * 判断要对单个节点执行的是哪种操作
   */
  onTreeClick = (e) => {
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
        alert('跳往编辑页');
        break;
      case 1:
        //气泡确认框处理
        alert('气泡确认框处理');
        break;
      case 2:
        //跳往新增页面
        alert('跳往新增页面');
        break;
      default:
        //do something
    }
  }

  onTreeDelete = (e) => {
    alert('封存组织');
  }

  /**
   * 自定义叶子节点
   */
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
          onConfirm={this.onTreeDelete}
        >
          <Icon type="minus-circle-o" className='tree-minus-icon tree-icon'/>
        </Popconfirm>
        <Icon type="plus-circle-o" className='tree-plus-icon tree-icon'/>
      </span>
    </span>)
  }

  /**
   * 设置叶子节点
   */
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