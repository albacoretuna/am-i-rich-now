import React, { Component } from 'react'

class Help extends Component {
  render() {
    return (
      <div className="Help">
        <h2> Help </h2>
        <div>
          <h4>Privacy</h4>
          We don't save anything on our servers, everything including the number of coins you own are stored in your browser.          Search the internet for LocalStorage to see what is saved, or how to delete it.

          <h4> No warranty </h4>
          This is a hobby project released under MIT license. Its information is not to be exact or helpful, use it at your own risk.
          <h4>Source code</h4>
          The full source code is available on github.
          <a href="https://github.com/omidfi/am-i-rich-now">github repository</a>
        </div>
      </div>

    )
  }
}

export default Help
