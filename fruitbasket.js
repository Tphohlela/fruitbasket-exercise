module.exports = function FruitBasket(pool) {

    async function createFruitBasket(type, qty, price) {
        try {
            await pool.query(`insert into fruit_basket(fruit_type,qty,unit_price) values ($1,$2,$3)`, [type, qty, price]);

            let x = await pool.query('select id from fruit_basket where fruit_type=$1 and qty=$2 and unit_price=$3', [type, qty, price])
        } catch (error) {
            console.log(error);
        }
    }

    async function getFruitBasketTable() {
        try {
            let x = await pool.query(`SELECT * from fruit_basket`);
            return x.rows
        } catch (error) {
            console.log(error);
        }
    }

    async function specificTypeFruitBasket(type) {
        try {
            let x = await pool.query(`SELECT * from fruit_basket where fruit_type=$1`, [type]);
            return x.rows
        } catch (error) {
            console.log(error);
        }
    }

    async function totalPriceFruitBasket(id) {
        try {
            let x = await pool.query(`select unit_price from fruit_basket where id=$1`, [id]);
            return x.rows[0].unit_price
        } catch (error) {
            console.log(error);
        }
    }

    async function updateQtyFruit(idUser, updateQtyFruit) {
        try {
            var x = await pool.query(`select qty from fruit_basket where id = $1`, [idUser])
            if (x) {
                await pool.query(`update fruit_basket set qty = qty + $2 where id = $1 `, [idUser, updateQtyFruit])
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function sumOfTotalSpecificFruitType(type) {
        try {
            let x = await pool.query(`SELECT SUM(qty) from fruit_basket where fruit_type=$1`, [type]);
            return x.rows[0].sum
        } catch (error) {
            console.log(error);
        }
    }

    return {
        createFruitBasket,
        getFruitBasketTable,
        specificTypeFruitBasket,
        sumOfTotalSpecificFruitType,
        totalPriceFruitBasket,
        updateQtyFruit,
    }
}