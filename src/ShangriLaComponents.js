import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import {Tabs, Tab} from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import moment from 'moment'
import ShangriLaComponentStore from './ShangriLaComponentStore.js'
import ShangriLaActionCreator from './ShangriLaActionCreator.js'
import ChartComponent from './Chart.js'
import './ShangriLaComponents.css'

const store = new ShangriLaComponentStore()
const initial_state = store.state
const DATETIME_FORMAT = 'YYYY年M月D日H時m分'

class ShangriLaComponent extends Component {
  constructor(props) {
    super(props)
    this.state = props.state || {api: initial_state}
    store.subscribe(this.handleStateChanged)
  }

  handleStateChanged = () => {
    this.setState({api: store.state})
  }
}

class ShangriLaRootComponent extends ShangriLaComponent {
  render() {
    return (
      <Paper>
        <ShangriLaToolbar />
        <ShangriLaTable />
      </Paper>
    )
  }
}

class ShangriLaToolbar extends ShangriLaComponent {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="放送時期" />
          <ShangriLaCourSelector />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

class ShangriLaCourSelector extends ShangriLaComponent {
  handleChange = (event, index, value) => {
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
  constructor(props) {
    super(props)
    this.state.should_update = true
  }

  async componentWillMount() {
    this.setState({data: await this.state.api.fetchMasterData()})
  }

  shouldComponentUpdate(props, state) {
    return this.state.api.selected_cour.id !== state.api.selected_cour.id || state.should_update
  }

  async componentWillUpdate(props, state) {
    this.setState({data: await state.api.fetchMasterData(), should_update: !state.should_update})
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
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            this.state.data.map(
              (item, index) => <ShangriLaTableRow key={item.id} data={item} />
            )
          }
        </TableBody>
      </Table>
    )
  }
}

class ShangriLaTableRow extends Component {
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
        return moment(data[key]).format(DATETIME_FORMAT)
      case 'sex':
        return data[key] === 0 ? '男性向け' : '女性向け'
      case 'sequel':
        return (data[key] < 1 ? 1 : data[key]) + '作目'
      default:
        return data[key]
    }
  }

  render() {
    return (
      <TableRow onClick={this.handleClick}>
        {
          Object.keys(SHANGRILA_TABLE_COLUMNS).map(
            (key, index) => <TableRowColumn key={index}>{this.getTableDataContent(key)}</TableRowColumn>
          )
        }
        <ShangriLaTwitterDataOverview data={this.state.data} />
      </TableRow>
    )
  }
}

class ShangriLaTwitterDataOverview extends Component {
  constructor(props) {
    super(props)
    this.state = {api: initial_state, open: false, data: props.data}
  }

  handleOpen = () => {
    this.handleActiveLatestData()
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleActiveLatestData = async () => {
    const params = {accounts: this.state.data.twitter_account}
    this.setState({latest_data: await this.state.api.fetchTwitterFollowers(params)})
  }

  handleActiveHistoryData = async () => {
    const params = {account: this.state.data.twitter_account}
    this.setState({history_data: await this.state.api.fetchTwitterFollowersHistory(params)})
  }

  get circularContainerStyles() {
    return {textAlign: 'center', padding: '20px'}
  }

  circularProgressRender() {
    return (
      <div style={this.circularContainerStyles}>
        <CircularProgress size={80} thickness={5} />
      </div>
    )
  }

  latestDataRender() {
    const data = this.state.latest_data
    const account = this.state.data.twitter_account
    if(data) {
      return (
        <dl>
          <dt>フォロワー数</dt>
          <dd>{data[account].follower}</dd>
          <dt>更新日</dt>
          <dd>{moment.unix(data[account].updated_at).format(DATETIME_FORMAT)}</dd>
        </dl>
      )
    }
    else {
      return this.circularProgressRender()
    }
  }

  historyDataRender() {
    const history_data = this.state.history_data
    if(history_data) {
      const data = history_data.map(
        (item) => {
          return {x: moment.unix(item.updated_at).toDate(), y: item.follower}
        }
      )
      const options = {
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: '日時'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'フォロワー数'
            }
          }]
        }
      }
      return <ChartComponent label="フォロワー数推移" data={data} options={options}/>
    }
    else {
      return this.circularProgressRender()
    }
  }

  render() {
    return (
      <TableRowColumn>
        <RaisedButton label="データ" onClick={this.handleOpen} />
        <Dialog title={this.state.data.title} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
          <Tabs>
            <Tab label="最新" onActive={this.handleActiveLatestData}>
              {this.latestDataRender()}
            </Tab>
            <Tab label="推移" onActive={this.handleActiveHistoryData}>
              {this.historyDataRender()}
            </Tab>
          </Tabs>
        </Dialog>
      </TableRowColumn>
    )
  }
}

export default ShangriLaRootComponent

