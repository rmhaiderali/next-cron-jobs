import { useState, useMemo, useRef } from "react"
import cronParser from "cron-parser"
import cronstrue from "cronstrue"
import date from "date-and-time"

const confirmationText =
  "Generating a large number of dates may take longer than expected. Are you sure you want to continue?"

function generateItterator(expression) {
  try {
    return cronParser.parseExpression(expression, {
      iterator: true,
      currentDate: new Date()
    })
  } catch (error) {}
}

function App() {
  const [expression, setExpression] = useState("1 7/8 * * *")
  const [occurrences, setOccurrences] = useState(5)
  const dates = useRef([])

  const itterator = useMemo(() => generateItterator(expression), [expression])

  function getDates() {
    try {
      while (dates.current.length <= occurrences) {
        dates.current.push(
          date.format(itterator.next().value.toDate(), "h:mm:ss A MMMM D, YYYY")
        )
      }
      return dates.current.slice(0, occurrences)
    } catch (error) {}
  }

  function getString(expression) {
    try {
      return cronstrue.toString(expression)
    } catch (error) {}
  }

  return (
    <>
      <input
        type="text"
        style={{ display: "block" }}
        placeholder="expression"
        value={expression}
        onChange={({ target }) => {
          dates.current.length = 0
          setExpression(target.value)
        }}
      ></input>
      <input
        type="number"
        style={{ display: "block" }}
        placeholder="occurrences"
        value={occurrences}
        onChange={({ target }) => {
          const datesYetToBeGenerated = target.value - dates.current.length
          if (
            target.value > 0 &&
            (datesYetToBeGenerated < 50 || window.confirm(confirmationText))
          )
            setOccurrences(target.value)
        }}
      ></input>
      <p>{itterator ? getString(expression) : "Invalid cron expression"}</p>
      <p>{itterator && getDates().map((e) => <li key={e}>{e}</li>)}</p>
    </>
  )
}

export default App
