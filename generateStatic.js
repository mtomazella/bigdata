const fs = require('fs')

const products = require('./products.json')
const employees = require('./employees.json')
const roles = require('./roles.json')
const suppliers = require('./suppliers.json')
const { v4 } = require('uuid')

const prices = []
const formattedProducts = []
const categories = {}
const lotes = []

const randomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

Array.from(new Set(products.map(({ categoria }) => categoria))).forEach(
  (name, index) => {
    categories[name] = index.toString()
  }
)

const date = new Date('01-01-2000').toISOString()
products.forEach(product => {
  formattedProducts.push({
    id: product.id,
    nome: product.nome,
    descricao: product.descricao,
    id_categoria: categories[product.categoria],
  })

  prices.push({
    id: v4(),
    data_efetiva: date,
    id_produto: product.id,
    valor_cents: product.preco_centavos,
  })

  const profitMargin = randomNumberBetween(10, 20) / 100
  lotes.push({
    id: v4(),
    id_produto: product.id,
    data_pedido: date,
    data_recebido: date,
    quantidade: 13000,
    valor_cents: product.preco_centavos * (1 - profitMargin) * 13000,
    CNPJ_fornecedor: suppliers[randomNumberBetween(0, suppliers.length - 1)].cnpj
  })
})

fs.writeFile(
  './static.json',
  JSON.stringify(
    {
      products: formattedProducts,
      categories,
      prices,
      employees,
      roles,
      suppliers,
      lotes,
    },
    null,
    2
  ),
  console.log
)
