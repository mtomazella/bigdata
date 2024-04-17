const fs = require('fs')
const { v4 } = require('uuid')

const static = require('./static.json')

const transactionAmount = 10000
const transactionDivision = {
  monthly: 0.5,
  event: 0.3,
  sporadic: 0.2,
}
const employeesThatCanSell = static.employees.filter(employee =>
const rolesThatCanSell = [3, 7]
  rolesThatCanSell.includes(employee.id_cargo)
)

const products = {}

static.products.forEach(product => {
  if (!products[product.id_categoria]) products[product.id_categoria] = []
  products[product.id_categoria].push(product)
})

const randomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)
const isNumberBetween = (number, min, max) => number >= min && number <= max

const isDateGenerallyValid = date => {
  const day = date.getDay()
  const hour = date.getHours()

  if (day === 0 && !isNumberBetween(hour, 7, 12)) return false
  if (day !== 0 && !isNumberBetween(hour, 7, 21)) return false
  return true
}

const generateTransaction = ({ amount, date, categories }) => {
  const transaction = {
    id: v4(),
    CPF_funcionario:
      employeesThatCanSell[
        randomNumberBetween(0, employeesThatCanSell.length - 1)
      ].CPF,
    data: date.toISOString(),
  }

  const itemAmount = randomNumberBetween(amount.min, amount.max)

  const transactionItems = []

  for (let i = 0; i < itemAmount; i++) {
    const isElectronic = randomNumberBetween(0, 100) === 100;
    const category = isElectronic ? 4 : categories.filter(n => n !== 4)[randomNumberBetween(0, categories.length - 2)]

    if (!products[category] || !products[category].length) continue

    const product =
      products[category][randomNumberBetween(0, products[category].length)]

    if (!product) {
      i++
      continue
    }

    const price = static.prices.find(price => price.id_produto === product.id)

    const productQuantity = randomNumberBetween(1, 5)

    transactionItems.push({
      id_compra: transaction.id,
      id_produto: product.id,
      id_lote: static.lotes.find(lote => lote.id_produto === product.id).id,
      quantidade: category === 4 ? 1 : productQuantity,
      id_preco: price.id,
      valor_unidade_cents: price.valor_cents,
      valor_final_cents: price.valor_cents * productQuantity,
    })
  }

  return {
    transaction,
    transactionItems,
  }
}

const generateDate = (
  validRanges = [
    {
      yearRange: { min: 2023, max: 2023 },
      monthRange: { min: 1, max: 12 },
      dayRange: { min: 1, max: 31 },
      hourRange: { min: 7, max: 21 },
    },
  ]
) => {
  const range = validRanges[randomNumberBetween(0, validRanges.length - 1)]

  const {
    yearRange = { min: 2023, max: 2023 },
    monthRange = { min: 1, max: 12 },
    dayRange = { min: 1, max: 31 },
    hourRange = { min: 7, max: 21 },
    allowedDays,
  } = range

  const date = new Date(
    randomNumberBetween(yearRange.min, yearRange.max),
    randomNumberBetween(monthRange.min, monthRange.max),
    randomNumberBetween(dayRange.min, dayRange.max),
    randomNumberBetween(hourRange.min, hourRange.max),
    0,
    0,
    0
  )

  if (allowedDays) {
    const day = date.getDay()
    if (!allowedDays.includes(day))
      return generateDate([
        {
          yearRange,
          monthRange,
          dayRange,
          allowedDays,
          hourRange,
        },
      ])
  }

  return date
}

const generateMonthly = () => {
  const quantity = transactionAmount * transactionDivision.monthly

  const transactions = []
  const transactionItems = []

  const isDateValid = date => {
    const dayMonth = date.getDate()
    const dayWeek = date.getDay()
    const hour = date.getHours()

    if (!isNumberBetween(dayMonth, 5, 10) && !isNumberBetween(dayMonth, 20, 25))
      return false
    if (!isDateGenerallyValid(date)) return false
    if (
      (isNumberBetween(dayWeek, 1, 5) && isNumberBetween(hour, 17, 21)) ||
      Math.random() >= 0.1
    )
      return false

    return true
  }

  for (let i = 0; i < quantity; i++) {
    let date
    do {
      date = generateDate([
        {
          dayRange: { min: 5, max: 10 },
        },
        {
          dayRange: { min: 20, max: 25 },
        },
      ])
    } while (!isDateValid(date))

    const transaction = generateTransaction({
      amount: {
        min: 50,
        max: 200,
      },
      date,
      categories: Object.values(static.categories),
    })

    transactions.push(transaction.transaction)
    transactionItems.push(...transaction.transactionItems)

    console.log(`Monthly: Generated ${i + 1} out of ${quantity}`)
  }

  return {
    transactions,
    transactionItems,
  }
}

const generateEvent = () => {
  const quantity = transactionAmount * transactionDivision.event

  const transactions = []
  const transactionItems = []

  const isDateValid = date => {
    if (!isDateGenerallyValid(date)) return false

    return true
  }

  for (let i = 0; i < quantity; i++) {
    let date
    do {
      date = generateDate([
        {
          allowedDays: [5],
          hourRange: { min: 17, max: 21 },
        },
        {
          allowedDays: [0, 6],
        },
      ])
    } while (!isDateValid(date))

    const allowedCategories = []
    for (const category of Object.keys(static.categories)) {
      if (['Alimento', 'Bebida'].includes(category))
        allowedCategories.push(static.categories[category])
    }

    const transaction = generateTransaction({
      amount: {
        min: 1,
        max: 20,
      },
      date,
      categories: allowedCategories,
    })

    transactions.push(transaction.transaction)
    transactionItems.push(...transaction.transactionItems)

    console.log(`Event: Generated ${i + 1} out of ${quantity}`)
  }

  return {
    transactions,
    transactionItems,
  }
}

const generateSporadic = () => {
  const quantity = transactionAmount * transactionDivision.event

  const transactions = []
  const transactionItems = []

  const isDateValid = date => {
    if (!isDateGenerallyValid(date)) return false

    return true
  }

  for (let i = 0; i < quantity; i++) {
    let date
    do {
      date = generateDate([
        {
          allowedDays: [5],
          hourRange: { min: 17, max: 21 },
        },
        {
          allowedDays: [0, 6],
        },
      ])
    } while (!isDateValid(date))

    const transaction = generateTransaction({
      amount: {
        min: 1,
        max: 20,
      },
      date,
      categories: Object.values(static.categories),
    })

    transactions.push(transaction.transaction)
    transactionItems.push(...transaction.transactionItems)

    console.log(`Sporadic: Generated ${i + 1} out of ${quantity}`)
  }

  return {
    transactions,
    transactionItems,
  }
}

const data = [generateMonthly(), generateEvent(), generateSporadic()].reduce(
  (obj, transaction) => {
    for (const item of transaction.transactions) obj.transactions.push(item)
    for (const item of transaction.transactionItems)
      obj.transactionItems.push(item)

    return obj
  },
  { transactions: [], transactionItems: [] }
)
fs.writeFile('./transactions.json', JSON.stringify(data, null, 2), console.log)
