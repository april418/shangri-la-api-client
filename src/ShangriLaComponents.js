import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import moment from 'moment'
import ShangriLaComponentStore from './ShangriLaComponentStore.js'
import ShangriLaActionCreator from './ShangriLaActionCreator.js'

const store = new ShangriLaComponentStore()
const initial_state = store.state

class ShangriLaComponent extends Component {
  constructor(props) {
    super(props)
    this.state = props.state || {api: initial_state}
    this.handleStateChanged = this.handleStateChanged.bind(this)
    store.subscribe(this.handleStateChanged)
  }

  handleStateChanged() {
    this.setState({api: store.state})
  }
}

class ShangriLaRender extends ShangriLaComponent {
  render() {
    return (
      <Paper>
        <ShangriLaToolbar state={this.state} />
        <ShangriLaTable state={this.state} />
      </Paper>
    )
  }
}

class ShangriLaToolbar extends ShangriLaComponent {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="時期" />
          <ShangriLaCourSelector state={this.state} />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

class ShangriLaCourSelector extends ShangriLaComponent {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event, index, value) {
    store.dispatch(ShangriLaActionCreator.selectorChanged(this.state.data[value]))
  }

  getMenuItemContent(item) {
    return item.year + '年 第' + item.cours + 'クール'
  }

  async componentWillMount() {
    this.setState({data: await this.state.api.fetchCoursData()})
  }

  render() {
    const data = this.state.data
    const current_value = (this.state.api.selected_cour.id || 0).toString()
    if(!data) return null
    return (
      <SelectField value={current_value} onChange={this.handleChange}>
        {
          Object.keys(data).map(
            (key, index) => <MenuItem key={index} value={key} primaryText={this.getMenuItemContent(data[key])} />
          )
        }
      </SelectField>
    )
  }
}

const SHANGRILA_TABLE_COLUMNS = {
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

class ShangriLaTable extends ShangriLaComponent {
  async componentWillMount() {
    this.setState({data: await this.state.api.fetchMasterData()})
  }

  async componentWillUpdate(props, state) {
    this.setState({data: await state.api.fetchMasterData()})
  }

  render() {
    if(!this.state.data) return null
    return (
      <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            {
              Object.values(SHANGRILA_TABLE_COLUMNS).map(
                (value, index) => <TableHeaderColumn key={index}>{value}</TableHeaderColumn>
              )
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            this.state.data.map(
              (item, index) => <ShangriLaOverviewRender key={item.id} data={item} />
            )
          }
        </TableBody>
      </Table>
    )
  }
}

class ShangriLaOverviewRender extends Component {
  constructor(props) {
    super(props)
    this.state = {data: props.data}
  }

  getTableDataContent(key) {
    const data = this.state.data
    switch(key) {
      case 'public_url':
        return <a href={data.public_url}>{data.public_url}</a>
      case 'twitter_account':
        return <a href={`https://twitter.com/${data.twitter_account}`}>{data.twitter_account}</a>
      case 'twitter_hash_tag':
        return <a href={`https://twitter.com/hashtag/${data.twitter_hash_tag}`}>{data.twitter_hash_tag}</a>
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
    return (
      <TableRow>
        {
          Object.keys(SHANGRILA_TABLE_COLUMNS).map(
            (key, index) => <TableRowColumn key={index}>{this.getTableDataContent(key)}</TableRowColumn>
          )
        }
      </TableRow>
    )
  }
}

export default ShangriLaRender

