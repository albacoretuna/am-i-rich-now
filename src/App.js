import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css'
import Result from './Result.js'
import ManageCoins from './ManageCoins.js'

class App extends Component {
  state = {
    portfolio: [],
    currency: 'EUR',
    totalPaid: 1140,
    resultLoading: true,
    holding: [
      {
        symbol: 'LTC',
        quantity: 0.9569,
      },
      {
        symbol: 'ETH',
        quantity: 0.4141,
      },
      {
        symbol: 'ADA',
        quantity: 556,
      },
      {
        symbol: 'GNT',
        quantity: 231,
      },
      {
        symbol: 'DGB',
        quantity: 3023,
      },
      {
        symbol: 'XMR',
        quantity: 0.276,
      },
      {
        symbol: 'DOGE',
        quantity: 10943,
      },
      {
        symbol: 'XRP',
        quantity: 128,
      },
    ],
  }

  setHoldings = holding => {
    this.setState({ holding })

    // refresh the profit/loss
    this.getPrices()
  }
  getPrices = () =>
    fetch(
      'https://api.coinmarketcap.com/v1/ticker/?convert=' + this.state.currency,
    ).then(data => {
      data.json().then(prices => {
        let portfolio = []
        this.state.holding.forEach(coin => {
          let match = prices.filter(price => price.symbol === coin.symbol)[0]

          if (!match) return

          portfolio.push({
            symbol: match.symbol,
            quantity: coin.quantity,
            subtotal:
              parseFloat(coin.quantity, 10) * parseFloat(match.price_eur),
          })
        })
        this.setState({
          portfolio,
          resultLoading: false,
        })
      })
    })
  componentDidMount() {
    this.getPrices()
  }

  render() {
    return (
      <Router>
        <div className="App">
          <h1 className="App-title">Am I Rich Yet?</h1>
          <ul>
            <li>
              <Link to="/manage-coins">manage coins</Link>
            </li>
            <li>
              <Link to="/">home</Link>
            </li>
          </ul>
          <Route
            path="/manage-coins"
            render={() =>
              <ManageCoins
                portfolio={this.state.portfolio}
                setHoldings={this.setHoldings}
              />}
          />
          <Route
            path="/"
            exact
            render={() =>
              <Result
                loading={this.state.resultLoading}
                totalPaid={this.state.totalPaid}
                portfolio={this.state.portfolio}
                currency={this.state.currency}
              />}
          />
        </div>
      </Router>
    )
  }
}

export default App
