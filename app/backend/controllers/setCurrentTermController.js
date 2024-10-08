const setCurrentTermService = require('../services/setCurrentTerm.js');
const {updateAllCourses} = require('../services/UpdateStatus/updateAllCourses.js');
const {updateAllServiceRoles} = require('../services/UpdateStatus/updateAllServiceRoles.js');
const {updateAllMembers} = require('../services/UpdateStatus/updateAllMembers.js');
async function setCurrentTerm(req, res){
    try {
       
        await setCurrentTermService.setCurrentTerm(req); //Execute service
        await updateAllCourses(); //update status course
        await updateAllServiceRoles(); //update status service role
        await updateAllMembers(); //update status members
        res.status(200).json({ message: 'Current term updated successfully' });
    } catch (error) {
        console.error('Error updating current term:', error);
        res.status(500).json({ error: 'Failed to update current term' });
    }
};

module.exports = {
    setCurrentTerm,
};