let assert = require("assert");
let fruitBasket = require("../fruitbasket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/fruit_tests';

const pool = new Pool({
    connectionString
});

describe('The fruit basket function', function () {

    beforeEach(async function () {
        await pool.query("delete from fruit_basket");
    });

    it('should return fruit basket', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)

        const list = await fruit.getFruitBasketTable()

        const listWithNoIds = list.map(basket => {
            delete basket.id;
            return basket;
        })

        assert.deepEqual([
            {
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            }
        ], listWithNoIds);

    });

    it('should return two fruit baskets', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)
        await fruit.createFruitBasket('peach', 6, 48.00)

        const list = await fruit.getFruitBasketTable()

        const listWithNoIds = list.map(basket => {
            delete basket.id;
            return basket;
        })

        assert.deepEqual([
            {
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            },
            {
                "fruit_type": "peach",
                "qty": 6,
                "unit_price": "48.00"
            }
        ], listWithNoIds);
    });

    it('find all the fruit baskets for a given fruit type', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)
        await fruit.createFruitBasket('peach', 6, 48.00)
        await fruit.createFruitBasket('peach', 2, 16.00)

        const list = await fruit.specificTypeFruitBasket('peach')

        const listWithNoIds = list.map(basket => {
            delete basket.id;
            return basket;
        })

        assert.deepEqual([
            {
                "fruit_type": "peach",
                "qty": 6,
                "unit_price": "48.00"
            },
            {
                "fruit_type": "peach",
                "qty": 2,
                "unit_price": "16.00"
            }

        ], listWithNoIds);

    });

    it('show the total price for a given fruit basket', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)
        await fruit.createFruitBasket('peach', 6, 48.00)
        await fruit.createFruitBasket('peach', 2, 16.00)

        const baskets = await fruit.getFruitBasketTable();

        assert.equal(48.00, await fruit.totalPriceFruitBasket(baskets[1].id))

    });

    it('update the number of fruits in a given basket', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)
        await fruit.createFruitBasket('peach', 6, 48.00)
        await fruit.createFruitBasket('peach', 2, 16.00)

        const baskets = await fruit.getFruitBasketTable();

       await fruit.updateQtyFruit(baskets[1].id,10)

       const list = await fruit.getFruitBasketTable()

       const listWithNoIds = list.map(basket => {
           delete basket.id;
           return basket;
       })


       assert.deepEqual([
        {
            "fruit_type": "apple",
            "qty": 1,
            "unit_price": "11.99"
        },
        {
            "fruit_type": "peach",
            "qty": 2,
            "unit_price": "16.00"
        },
        {
            "fruit_type": "peach",
            "qty": 16,
            "unit_price": "48.00"
        }

    ],listWithNoIds)

    });

    it('show the sum of the qty for a given fruit type', async function () {
        const fruit = fruitBasket(pool);
        await fruit.createFruitBasket('apple', 1, 11.99)
        await fruit.createFruitBasket('peach', 6, 48.00)
        await fruit.createFruitBasket('peach', 2, 16.00)

        assert.equal(8, await fruit.sumOfTotalSpecificFruitType('peach'));
    });


    after(function () {
        pool.end();
    })
});
