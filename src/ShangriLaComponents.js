import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import moment from 'moment'
import ShangriLaMasterAPI, { ShangriLaCoursAPI } from './ShangriLaAPI.js'

class ShangriLaRender extends Component {
  render() {
    return (
      <Paper>
        <ShangriLaToolbar />
        <ShangriLaTable />
      </Paper>
    )
  }
}

class ShangriLaToolbar extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ShangriLaCourSelector />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

class ShangriLaCourSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      api: new ShangriLaCoursAPI(),
      selected: null,
      data: {}
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event, index, value) {
    this.setState({selected: value})
  }

  getMenuItemContent(item) {
    return item.year + '年 第' + item.cours + 'クール'
  }

  async componentWillMount() {
    this.setState({data: await this.state.api.call()})
  }

  render() {
    const data = this.state.data
    return (
      <SelectField value={this.state.selected} onChange={this.handleChange}>
        {
          Object.keys(data).map(
            (key, index) => <MenuItem key={index} value={key} primaryText={this.getMenuItemContent(data[key])} />
          )
        }
      </SelectField>
    )
  }
}

class ShangriLaTableBase extends Component {
  get columns() {
    return {
      //id: 'ID',
      title: 'タイトル',
      //title_short1: '略称1',
      //title_short2: '略称2',
      //title_short3: '略称3',
      public_url: '公式ホームページ',
      twitter_account: 'ツイッターアカウント',
      twitter_hash_tag: 'ツイッターハッシュタグ',
      //cours_id: 'クールID',
      //created_at: '作成日時',
      //updated_at: '更新日時',
      sex: '男性/女性向け',
      sequel: 'アニメシリーズ何作目'
    }
  }
}

class ShangriLaTable extends ShangriLaTableBase {
  constructor(props) {
    super(props)
    this.state = {
      api: new ShangriLaMasterAPI(),
      data: []
    }
  }

  async componentWillMount() {
    this.setState({data: await this.state.api.call()})
  }

  render() {
    return (
      <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            {
              Object.values(this.columns).map(
                (value, index) => <TableHeaderColumn key={index}>{value}</TableHeaderColumn>
              )
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            this.state.data.map(
              (item, index) => <ShangriLaOverviewRender key={index} data={item} />
            )
          }
        </TableBody>
      </Table>
    )
  }
}

class ShangriLaOverviewRender extends ShangriLaTableBase {
  constructor(props) {
    super(props)
    this.state = {}
    if(props.data) this.state.data = props.data
  }

  getTableDataContent(key) {
    const data = this.state.data
    switch(key) {
      case 'public_url':
        return <a href={data.public_url}>{data.public_url}</a>
      case 'twitter_account':
        return <a href={'https://twitter.com/' + data.twitter_account}>{data.twitter_account}</a>
      case 'twitter_hash_tag':
        return <a href={'https://twitter.com/hashtag/' + data.twitter_hash_tag}>{data.twitter_hash_tag}</a>
      case 'created_at':
      case 'updated_at':
        return moment(data[key]).format('YYYY年M月D日H時m分')
      case 'sex':
        return data[key] === 0 ? '男性向け' : '女性向け'
      case 'sequel':
        return (data[key] + 1) + '作目'
      default:
        return data[key]
    }
  }

  render() {
    if(!this.state.data) return
    return (
      <TableRow>
        {
          Object.keys(this.columns).map(
            (key, index) => <TableRowColumn key={index}>{this.getTableDataContent(key)}</TableRowColumn>
          )
        }
      </TableRow>
    )
  }
}

export default ShangriLaRender

