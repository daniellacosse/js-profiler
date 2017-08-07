import React, { Component } from 'react';
import './App.css';

import CodeMirror from 'react-codemirror';
import { Table, Collapse, Card, CardText, CardTitle, CardBlock } from 'reactstrap';
import { BarChart, Bar, ResponsiveContainer, ReferenceLine } from 'recharts';
import 'codemirror/lib/codemirror.css';

import loadFunctions from './insert-js-fragment';
import profileFunc from './profile-func';
import analyzeResults from './analyze-profile';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: false,
      isTableOpen: false,
      code: "// Paste JS function here",
      options: {
        lineNumbers: true,
        mode: "javascript",
        theme: "night"
      }
    };
  }

  updateCode(newCode) {
      this.setState({
          code: newCode,
      });
  }

  runCode() {
    this.setState({ isRunning: true }, async () => {
      const funcs = [ this.state.code ];

      await loadFunctions(funcs);

      const results = funcs.map(
        async (_, index) => await profileFunc(window[`_func${index}`])
      );

      Promise
        .all(results)
        .then((unwrappedResults) => this.setState({
          isRunning: false,
          results: unwrappedResults
        }));
    });
  }

  renderResultRow(index) {
    let rows = [];
    let _countdown = this.state.results.length;

    while(_countdown--) {
      rows.push(this.state.results[_countdown][index]);
    }

    return (
      <tr key={index}>
        {rows.map((cell, i) => <td key={i}>{cell}ms</td>)}
      </tr>
    );
  }

  renderResults() {
    if (!this.state.results) {
      return <section></section>;
    }

    // console.log("analyzeResults(this.state.results:", analyzeResults(this.state.results[0]));

    return (
      <section>
        {this.state.results.map((result, i) => {
          const {max, median, samples, outerFence} = analyzeResults(result);

          const formatTime = (timeinNs) => {
            const fixedNum = timeinNs.toFixed(3);

            if (timeinNs < 1) {
              return `${fixedNum * 1000}ns`
            }

            return `${fixedNum}ms`
          }

          return (
            <Card key={i}>
              <CardBlock>
                <CardTitle>{`V${i + 1}`}</CardTitle>

                <ResponsiveContainer width="100%" height={75}>
                  <BarChart data={
                      samples.reverse()
                        .filter(
                          num => num > outerFence.min && num < outerFence.max
                        )
                        .map(point => ({point}))
                    }>

                    <Bar dataKey='point' fill='#108ee9' isAnimationActive={false}/>
                    <ReferenceLine y={median} stroke='#da8c18' isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>

                <CardText>
                  <b>Median Execution Time:</b> {formatTime(median)} <br />
                  <b>Max Execution Time:</b> {formatTime(max)}
                </CardText>
              </CardBlock>
            </Card>
          )
        })}
        <button onClick={() => this.setState({ isTableOpen: !this.state.isTableOpen })}>
          Toggle Table
        </button>
        <Collapse isOpen={this.state.isTableOpen}>
          <Table>
            <thead>
              <tr>
                {this.state.results.map((row, i) => <th key={i}>{i}</th>)}
              </tr>
            </thead>
            <tbody>
              {this.state.results[0].map((cell, i) => this.renderResultRow(i))}
            </tbody>
          </Table>
        </Collapse>
      </section>
    );
  }

  render() {
    const {code, options, isRunning} = this.state;

    return (
      <main>
        <CodeMirror
          value={code}
          onChange={this.updateCode.bind(this)}
          options={options}
        />

        <button onClick={this.runCode.bind(this)} disabled={isRunning}>
          Run Code
        </button>

        {this.renderResults()}
      </main>
    );
  }
}

export default App;
