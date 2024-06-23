import React, { useState } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import '../../CSS/Department/DataEntry.css';

function DataEntryComponent() {
    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [instructors, setInstructors] = useState([
        { id: '12341234', name: 'Jim Bob', added: false },
        { id: '12341234', name: 'Billy Jim', added: true },
        { id: '12341234', name: 'Jimmy Bill', added: false },
        { id: '12341234', name: 'Jilly Bim', added: false }
    ]);

    const handleChange = (event) => {
        setSelection(event.target.value);
        // Potentially navigate to different components or render different forms here
        console.log(`Selected: ${event.target.value}`);
    };

    const toggleInstructorAdded = id => {
        setInstructors(instructors.map(instructor =>
            instructor.id === id ? { ...instructor, added: !instructor.added } : instructor
        ));
    };

    const handleShowInstructorModal = () => {
        setShowInstructorModal(true);
    };

    const handleCloseInstructorModal = () => {
        setShowInstructorModal(false);
    };

    return (
        <div className='DataEntry-page'>
            <CreateSidebarDept/>
            <div className="container">
                <CreateTopbar />
                <div className='main'>
                <h1>Data Entry</h1>
                <div className="create-new">
                    <label htmlFor="create-new-select">Create New:</label>
                    <select id="create-new-select" value={selection} onChange={handleChange}>
                        <option value="" disabled>Select</option>
                        <option value="Service Role">Service Role</option>
                        <option value="Course">Course</option>
                    </select>
                </div>
            {selection === 'Course' && (
                <div className='form-container'>
                <form className="course-form" name="course-form">
                    <div className="titleInput formInput">
                        <label htmlFor="course-title">Course Title:</label>
                        <input type="text" id="course-title" placeholder="Enter course title" />
                    </div>
                    <div className='departmentInput formInput'>
                        <label htmlFor="course-department">Department:</label>
                        <select id="course-department">
                            <option value="">Select</option>
                            <option value="CS">Computer Science</option>
                            <option value="Math">Mathematics</option>
                        </select>
                        <div className='coursecodeInput'>
                            <label htmlFor="course-code">Course Code:</label>
                            <input type="text" id="course-code" />
                        </div>
                    </div>
                    <label htmlFor="course-description">Course Description:</label>
                    <textarea id="course-description" placeholder="Describe the course"></textarea>

                    <button className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
                </form>
                <button className="finish-button" type="submit" form="course-form">Finish</button>
                </div>
            )}

            {selection === 'Service Role' && (
                <div className='form-container'>
                <form className="service-role-form">
                    <div className="titleInput formInput">
                        <label htmlFor="service-role-title">Service Role Title:</label>
                        <input type="text" id="service-role-title" placeholder="Enter service role title" />
                    </div>
                    <div className="departmentInput formInput">
                        <label htmlFor="service-role-department">Department:</label>
                        <select id="service-role-department">
                            <option value="">Select</option>
                            <option value="CS">Computer Science</option>
                            <option value="Math">Mathematics</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>
                    <label htmlFor="service-role-description">Service Role Description:</label>
                    <textarea id="service-role-description" placeholder="Describe the service role"></textarea>
                    <div className='monthlyHoursInput formInput'>
                        <label htmlFor="monthly-hours">Monthly Hours Benchmark:</label>
                        <input type="text" id="monthly-hours" placeholder="hours/month" />
                    </div>
                    <button className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>

                    
                </form>
                <button className="finish-button">Finish</button>
                </div>
            )}

            {showInstructorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseInstructorModal}>X</button>
                        {instructors.map(instructor => (
                            <div key={instructor.id} className="instructor-item">
                                <span>{instructor.name} UBC ID: {instructor.id}</span>
                                <button onClick={() => toggleInstructorAdded(instructor.id)}>
                                    {instructor.added ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        ))}
                        <button className="save-button" onClick={handleCloseInstructorModal}>Save</button>
                    </div>
                </div>
            )}
            </div>
            </div>
        </div>
    );
}

export default DataEntryComponent;
