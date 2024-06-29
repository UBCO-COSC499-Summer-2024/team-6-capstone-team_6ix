const  pool = require('../db/index.js'); // Adjust the path as necessary for your db connection
console.log(pool); // See what pool actually is

exports.getUserProfile = async (req, res) => {

    let ubcId = req.query.ubcid;
    let profileId = req.query.profileId;
    console.log(profileId);  
    console.log("Received ubcId:", ubcId); // Log the received ubcId for debugging 
    try {
        let query;
        let result;
        if(profileId == null){
            query = `SELECT * FROM "Profile" WHERE "UBCId" = $1;`;
            //let result = await pool.query(query, [id]);
            result = await pool.query(query,[ubcId]);
            console.log("Executing query:", query);
            console.log("With parameters:", [ubcId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

        }
        else if(ubcId == null){
            query = `SELECT * FROM "Profile" WHERE "profileId" = $1;`;
            //let result = await pool.query(query, [id]);
            result = await pool.query(query,[profileId]);
            console.log("Executing query:", query);
            console.log("With parameters:", [profileId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

    
        // Extract profile information
        const row = result.rows[0];
        if(profileId==null)
            profileId = row.profileId;
        const firstName = row.firstName;
        const middleName = row.middleName || '';  // Use an empty string if middleName is null
        const lastName = row.lastName;
        const name = `${firstName} ${middleName} ${lastName}`.trim();  // Construct full name and trim any extra spaces
        const benchmark = row.sRoleBenchmark;
        if(ubcId==null)
            ubcId = row.UBCId;
        const email = row.email;
        const phoneNum = row.phoneNum;
        const office = `${row.officeBuilding} ${row.officeNum}` || '';  // Construct office info
        query = `SELECT "year" FROM "ServiceRoleAssignment" ORDER BY "year" DESC LIMIT 1`;
        result = await pool.query(query);
        const year = result.rows[0].year;
        query = `
            SELECT sr.stitle
            FROM "ServiceRoleAssignment" "sra"
            JOIN "ServiceRole" "sr" ON "sra"."serviceRoleId" = "sr"."serviceRoleId"
            WHERE "sra"."profileId" = $1 AND sra."year" = $2;
        `; 
        //result = await pool.query(query, [id]);
        result = await pool.query(query,[profileId,year]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        //const serviceRoles = result.rows;
        const roles = result.rows.map(row => row.stitle || '');
        query = `SELECT "term" FROM "InstructorTeachingAssignment" ORDER BY "term" DESC LIMIT 1`;
        result = await pool.query(query);
        const term = result.rows[0].term;
        query = `
            SELECT d."dcode"  || ' ' || c."courseNum" AS "DivisionAndCourse"
            FROM "InstructorTeachingAssignment" "ita"
            JOIN "Course" "c" ON "ita"."courseId" = "c"."courseId"
            JOIN "Division" "d" ON "c"."divisionId" = "d"."divisionId"
            WHERE "ita"."profileId" = $1 AND ita."term" = $2;
        `; 
        //result = await pool.query(query, [id]);
        result = await pool.query(query,[profileId, term]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course assignments not found' });
        }
        //const courses = result.rows;
        const teachingRoles = result.rows.map(row => ({ assign: row.DivisionAndCourse || "" }));  // Mapping ctitle to roles
        // Build the profile data object
        const profileData = {
            name: name || '',
            ubcid: ubcId || '', 
            benchmark:benchmark || '',
            roles:roles,
            email: email || '',
            phone: phoneNum || '',
            office: office,
            teachingAssignments:teachingRoles
        };    
        // Send response
        res.json(profileData);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error during fetching profile' });
    }
    
};
