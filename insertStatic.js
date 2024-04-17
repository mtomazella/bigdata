const mariadb = require('mariadb');
const static = require('./static.json')
const transactions = require('./transactions.json')

let conn;

const main = async () => {
    try {
        conn = await mariadb.createConnection({
            host: '127.0.0.1',
            user: 'matt',
            password: '123',
            database: 'bigdata',
        })

        const databaseCategories = []
        for (const name of Object.keys(static.categories)) {
            databaseCategories.push({ id: static.categories[name], nome: name, descricao: 'empty' })
        }

        const entities = [
            // {
            //     table: 'Categoria',
            //     records: databaseCategories,
            // },
            // {
            //     table: 'Cargo',
            //     records: static.roles,
            // },
            // {
            //     table: 'Fornecedor',
            //     records: static.suppliers,
            // },
            // {
            //     table: 'Produto',
            //     records: static.products,
            // },
            {
                table: 'Lote',
                records: static.lotes,
            },
            // {
            //     table: 'Funcionario',
            //     records: static.employees,
            // },
        	// {
            //     table: 'Preco',
            //     records: static.prices,
            // },
            // {
            //     table: 'Compra',
            //     records: transactions.transactions,
            // },
            // {
            //     table: 'ItemCompra',
            //     records: transactions.transactionItems,
            // },
        ]

        for (const entity of entities) {
            const table = entity.table
            const total = entity.records.length

            for (const i in entity.records) {
                const record = entity.records[i]
                try {
                    await insertRecord({ table, record })
                    console.log(`${table} - ${i + 1} out of ${total}`)
                } catch (error) {
                    console.error(error)
                }
            }
        }

    } catch (error) {
        console.error(error)
    } finally {
        if (conn) conn.end();
    }
}

const insertRecord = async ({ table, record }) => {
    try {
		if (!record || !table)
            throw new Error('Invalid arguments')

    	const columns = Object.keys(record);
        const values = Object.values(record);

        for (const i in columns) {
            const col = columns[i]
            if (col.includes('data'))
                values[i] = new Date(values[i])
        }

        const result = await conn.query(`INSERT INTO ${table} (${columns}) VALUES (?)`, [values]);

        console.log(result)
    } catch (error) {
        const insertError = new Error('Failed to insert record')
        insertError.table = table
        insertError.record = record
        insertError.parent = error
        throw insertError
    }
}

main()
