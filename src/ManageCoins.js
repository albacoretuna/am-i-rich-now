import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { get } from 'lodash'
import { Link } from 'react-router-dom'

class ManageCoins extends Component {
  state = {
    hideCoinslist: true,
    value: this.props.portfolio.map(coin => coin.symbol).join(','),
    stayOpen: true,
    portfolio: this.props.portfolio,
    changesSaved: false,
    saveError: '',
    coinValueError: ''
  }

  handleSelectChange = value => {
    this.setState({ value })
  }

  resetValidationError = () => {
    this.setState({
      saveError: '',
      coinValueError: ''
    })
  }

  // sets the number of coins that user holds into app state
  saveChanges = coinsSymbols => {
    this.resetValidationError()

    if(parseFloat(this.totalPaid.value, 10) <= 0) {
      this.setState({saveError: 'Total paid should be more than zero.'})
       return;
    }
    let coins = coinsSymbols.split(',')
    let holding = coins.length > 0 && coins.map(symbol => {
      let quantity = get(this[symbol], 'value')
      if(quantity <= 0) {
        this.setState({
          coinValueError: 'Quantity should be more than zero'
        })
      }
      return {
        quantity ,
        symbol,
      }
    })
    this.props.setHolding(holding)

    this.props.setTotalPaid(parseFloat(this.totalPaid.value, 10))

    // save to localStorage
    window.localStorage.setItem(
      'state',
      JSON.stringify({
        holding,
        totalPaid: this.totalPaid.value,
      }),
    )

    // show confirmation message
    this.setState({changesSaved : true})
  }

  // for each selected coin, adds a row with symbol and quantity input box
  renderQuantityForm = coinsList => {
    if (coinsList.length < 1) return
    let coins = coinsList.split(',')
    return coins.map((symbol, i) =>
      <li className="coins-form__li" key={i}>
        <label htmlFor={symbol} className="coins-form__label">
          {' '}{symbol}:{' '}
          {this.state.coinValueError &&
              <span className="form-validation-error">{this.state.coinValueError}</span>
          }
        </label>
        <input
          type="number"
          placeholder="for example 3 or 0.43"
          className="coins-form__input"
          ref={input => (this[symbol] = input)}
          min="0.000001"
          defaultValue={
            this.state.portfolio.filter(coin => coin.symbol === symbol)[0] &&
            this.state.portfolio.filter(coin => coin.symbol === symbol)[0]
              .quantity
          }
        />
      </li>,
    )
  }

  // reads the number of coins user holds from the app state
  componentWillReceiveProps(props) {
    this.setState({ portfolio: props.portfolio }, () => {
      this.setState({
        value: props.portfolio.map(coin => coin.symbol).join(','),
      })
    })
  }
  render() {
    const { stayOpen, value } = this.state
    return (
      <div className="ManageCoins">
        <h2> Manage Coins </h2>
        <div>
          <p className="instruction">
            {' '}1. Select all the different coins that you own
          </p>
          <div className="select-wrapper">
            <Select
              closeOnSelect={!stayOpen}
              options={supportedCoins}
              multi
              onChange={this.handleSelectChange}
              placeholder="Select all the coins you own, eg: Bitcoin, Litecoin,..."
              removeSelected={true}
              simpleValue
              value={value}
            />
          </div>
        </div>

        <div>
          <p className="instruction"> 2. Specify how many coins you own</p>
          <ul className="coins-form">
            {this.renderQuantityForm(this.state.value)}
          </ul>
          <p className="instruction">
            {' '}3. Specify how much you have paid in total and save!
          </p>
          <div className="coins-form__div">
          <label htmlFor="total" className="coins-form__label">
            Total amount paid for your coins ({this.props.currency}):

            {this.state.saveError &&
                <span className="form-validation-error">{this.state.saveError}</span>
            }
          </label>
          <input
            type="number"
            name="total"
            ref={input => (this.totalPaid = input)}
            defaultValue={this.props.totalPaid}
            className="coins-form__input"
            min="0.000001"
          />
        </div>
          { this.state.changesSaved &&
          <p className="coins-form__p">
            ✓ All Changes Saved!
            <Link to="/"> { ' ' } Go to home </Link>
          </p>
          }
          <button
            className="coins-form__button"
            onClick={() => {
              this.saveChanges(this.state.value)
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    )
  }
}

export default ManageCoins

// a list of 100 cyrpto coin names and symbols, the top 100 top coins at the moment
const supportedCoins = [
  {
    value: 'BTC',
    label: 'Bitcoin',
  },
  {
    value: 'ETH',
    label: 'Ethereum',
  },
  {
    value: 'BCH',
    label: 'Bitcoin Cash',
  },
  {
    value: 'XRP',
    label: 'Ripple',
  },
  {
    value: 'LTC',
    label: 'Litecoin',
  },
  {
    value: 'ADA',
    label: 'Cardano',
  },
  {
    value: 'MIOTA',
    label: 'IOTA',
  },
  {
    value: 'DASH',
    label: 'Dash',
  },
  {
    value: 'XEM',
    label: 'NEM',
  },
  {
    value: 'BTG',
    label: 'Bitcoin Gold',
  },
  {
    value: 'XMR',
    label: 'Monero',
  },
  {
    value: 'EOS',
    label: 'EOS',
  },
  {
    value: 'QTUM',
    label: 'Qtum',
  },
  {
    value: 'XLM',
    label: 'Stellar',
  },
  {
    value: 'NEO',
    label: 'NEO',
  },
  {
    value: 'XVG',
    label: 'Verge',
  },
  {
    value: 'ETC',
    label: 'Ethereum Classic',
  },
  {
    value: 'TRX',
    label: 'TRON',
  },
  {
    value: 'LSK',
    label: 'Lisk',
  },
  {
    value: 'NXT',
    label: 'Nxt',
  },
  {
    value: 'ZEC',
    label: 'Zcash',
  },
  {
    value: 'ARDR',
    label: 'Ardor',
  },
  {
    value: 'BCC',
    label: 'BitConnect',
  },
  {
    value: 'BTS',
    label: 'BitShares',
  },
  {
    value: 'PPT',
    label: 'Populous',
  },
  {
    value: 'OMG',
    label: 'OmiseGO',
  },
  {
    value: 'WAVES',
    label: 'Waves',
  },
  {
    value: 'STRAT',
    label: 'Stratis',
  },
  {
    value: 'USDT',
    label: 'Tether',
  },
  {
    value: 'HSR',
    label: 'Hshare',
  },
  {
    value: 'BCN',
    label: 'Bytecoin',
  },
  {
    value: 'KMD',
    label: 'Komodo',
  },
  {
    value: 'DOGE',
    label: 'Dogecoin',
  },
  {
    value: 'SC',
    label: 'Siacoin',
  },
  {
    value: 'STEEM',
    label: 'Steem',
  },
  {
    value: 'REP',
    label: 'Augur',
  },
  {
    value: 'DGB',
    label: 'DigiByte',
  },
  {
    value: 'VERI',
    label: 'Veritaseum',
  },
  {
    value: 'PIVX',
    label: 'PIVX',
  },
  {
    value: 'ARK',
    label: 'Ark',
  },
  {
    value: 'MONA',
    label: 'MonaCoin',
  },
  {
    value: 'XRB',
    label: 'RaiBlocks',
  },
  {
    value: 'DCR',
    label: 'Decred',
  },
  {
    value: 'GNT',
    label: 'Golem',
  },
  {
    value: 'SALT',
    label: 'SALT',
  },
  {
    value: 'BNB',
    label: 'Binance Coin',
  },
  {
    value: 'PAY',
    label: 'TenX',
  },
  {
    value: 'SNT',
    label: 'Status',
  },
  {
    value: 'ETN',
    label: 'Electroneum',
  },
  {
    value: 'RDD',
    label: 'ReddCoin',
  },
  {
    value: 'GBYTE',
    label: 'Byteball Bytes',
  },
  {
    value: 'BTCD',
    label: 'BitcoinDark',
  },
  {
    value: 'WTC',
    label: 'Walton',
  },
  {
    value: 'MAID',
    label: 'MaidSafeCoin',
  },
  {
    value: 'SYS',
    label: 'Syscoin',
  },
  {
    value: 'SAN',
    label: 'Santiment Network Token',
  },
  {
    value: 'VET',
    label: 'VeChain',
  },
  {
    value: 'BTM',
    label: 'Bytom',
  },
  {
    value: 'BAT',
    label: 'Basic Attention Token',
  },
  {
    value: 'POWR',
    label: 'Power Ledger',
  },
  {
    value: 'DGD',
    label: 'DigixDAO',
  },
  {
    value: 'KNC',
    label: 'Kyber Network',
  },
  {
    value: 'VTC',
    label: 'Vertcoin',
  },
  {
    value: 'QASH',
    label: 'QASH',
  },
  {
    value: 'ZRX',
    label: '0x',
  },
  {
    value: 'FCT',
    label: 'Factom',
  },
  {
    value: 'XZC',
    label: 'ZCoin',
  },
  {
    value: 'AE',
    label: 'Aeternity',
  },
  {
    value: 'CVC',
    label: 'Civic',
  },
  {
    value: 'GAS',
    label: 'Gas',
  },
  {
    value: 'FUN',
    label: 'FunFair',
  },
  {
    value: 'GAME',
    label: 'GameCredits',
  },
  {
    value: 'AION',
    label: 'Aion',
  },
  {
    value: 'BAY',
    label: 'BitBay',
  },
  {
    value: 'ETHOS',
    label: 'Ethos',
  },
  {
    value: 'GNO',
    label: 'Gnosis',
  },
  {
    value: 'MCO',
    label: 'Monaco',
  },
  {
    value: 'CNX',
    label: 'Cryptonex',
  },
  {
    value: 'DRGN',
    label: 'Dragonchain',
  },
  {
    value: 'EMC2',
    label: 'Einsteinium',
  },
  {
    value: 'LINK',
    label: 'ChainLink',
  },
  {
    value: 'ICN',
    label: 'Iconomi',
  },
  {
    value: 'MANA',
    label: 'Decentraland',
  },
  {
    value: 'GXS',
    label: 'GXShares',
  },
  {
    value: 'DENT',
    label: 'Dent',
  },
  {
    value: 'EDG',
    label: 'Edgeless',
  },
  {
    value: 'NXS',
    label: 'Nexus',
  },
  {
    value: 'SUB',
    label: 'Substratum',
  },
  {
    value: 'CTR',
    label: 'Centra',
  },
  {
    value: 'XDN',
    label: 'DigitalNote',
  },
  {
    value: 'REQ',
    label: 'Request Network',
  },
  {
    value: 'BLOCK',
    label: 'Blocknet',
  },
  {
    value: 'UBQ',
    label: 'Ubiq',
  },
  {
    value: 'RDN',
    label: 'Raiden Network Token',
  },
  {
    value: 'BNT',
    label: 'Bancor',
  },
  {
    value: 'MTL',
    label: 'Metal',
  },
  {
    value: 'SNM',
    label: 'SONM',
  },
  {
    value: 'STORJ',
    label: 'Storj',
  },
  {
    value: 'TNB',
    label: 'Time New Bank',
  },
  {
    value: 'NAV',
    label: 'NAV Coin',
  },
]
