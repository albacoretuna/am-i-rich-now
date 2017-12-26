import React, { Component } from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import {get } from 'lodash'
import './App.css'
import Result from './Result.js'
import ManageCoins from './ManageCoins.js'
import Help from './Help.js'

class App extends Component {
  state = {
    portfolio: [],
    currency: 'EUR',
    totalPaid: get( JSON.parse(localStorage.getItem('state')), 'totalPaid') || 0,
    resultLoading: true,
    holding: get(JSON.parse(localStorage.getItem('state')), 'holding')  || [],
  }

  setHolding = holding => {
    this.setState({ holding })
  }

  // set the total amount in the currency user has paid for the coins
  setTotalPaid = totalPaid => {
    this.setState({ totalPaid })

    // refresh the profit/loss
    this.getPrices()
  }

  // gets 100 top coins prices from coinmarketcap api
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
    if(get(this, 'state.holding.length') < 1) {
      this.setState({
        resultLoading: false,
      })
      return
    }
    this.getPrices()
  }

  render() {
    return (
      <Router>
        <div className="App">
          <ul className="menue">
            <li className="menue__li">
              <NavLink
                exact={true}
                className="menue__link"
                activeClassName="menue__link--active"
                to="/"
              >
                Home
              </NavLink>{' '}
              {' '}
            </li>
            <li className="menue__li">
              |{' '}
              <NavLink
                className="menue__link"
                activeClassName="menue__link--active"
                to="/manage-coins"
              >
                 Manage coins {' '}
              </NavLink>
            </li>
            <li className="menue__li">
              |{' '}
              <NavLink
                className="menue__link"
                activeClassName="menue__link--active"
                to="/help"
              >
                Help
              </NavLink>
            </li>
          </ul>
          <h1 className="App-title">Am I Rich Now?</h1>
          <Route
            path="/manage-coins"
            render={() =>
              <ManageCoins
                portfolio={this.state.portfolio}
                setHolding={this.setHolding}
                totalPaid={this.state.totalPaid}
                setTotalPaid={this.setTotalPaid}
                currency= {this.state.currency}
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
          <Route
            path="/help"
            component={Help}
          />
          <footer className="footer">
            <p>
              <a href="https://AmIRichNow.com">AmIRichNow.com</a> Track how much your cryptocurrencies have made you richer, or poorer.
              Source code on <a href="https://github.com/omidfi/am-i-rich-now">github.</a>
            </p>
          </footer>
        </div>

      </Router>
    )
  }
}

export default App
