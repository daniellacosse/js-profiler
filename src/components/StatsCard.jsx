import React from "react";
import { Card, CardText, CardTitle, CardBlock } from "reactstrap";
import { BarChart, Bar, ResponsiveContainer, ReferenceLine } from "recharts";

import { formatTime } from "../lib";

export default ({ name, max, median, samples, outerFence, results }) =>
  <Card key={name}>
    <CardBlock>
      <CardTitle>{name}</CardTitle>

      <ResponsiveContainer width="100%" height={75}>
        <BarChart data={
            samples.reverse()
              .filter(
                num => num > outerFence.min && num < outerFence.max
              )
              .map(point => ({point}))
          }>

          <Bar dataKey="point" fill="#108ee9" isAnimationActive={false}/>
          <ReferenceLine
            y={median} stroke="#da8c18" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>

      <CardText>
        <b>Median Execution Time:</b> {formatTime(median)} <br />
        <b>Max Execution Time:</b> {formatTime(max)} <br />
        <b>Outliers:</b> {
          results
            .filter(num => num > outerFence.min && num < outerFence.max)
            .length
        }
      </CardText>
    </CardBlock>
  </Card>
