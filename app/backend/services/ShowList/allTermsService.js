const pool = require('../../db/index');

async function getAllTerms(){
    try {
        //Get the currentterm
        const currentTermResult = await pool.query('SELECT "curTerm" FROM "CurrentTerm"');
        const currentTerm = currentTermResult.rows[0].curTerm;
        //Get all the terms
        const termsResult = await pool.query('SELECT DISTINCT "term" FROM "CourseByTerm"');
        const terms = termsResult.rows.map(row => row.term);

        const response = {
            currentTerm,
            terms
        };

        return response;
    } catch (error) {
        console.error('Error getting terms:', error);
        throw error;
    }
};

module.exports = {
    getAllTerms
};
