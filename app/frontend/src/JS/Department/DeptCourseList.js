import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptCourseList.css';

function DeptCourseList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [deptCourseList, setDeptCourseList] = useState({
        courses: [{}],
        coursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [search, setSearch] = useState('');
    const [activeCoursesCount, setActiveCoursesCount] = useState(0);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                const numericAccountType = Number(accountLogInType);
                if (numericAccountType !== 1 && numericAccountType !== 2) {
                    alert('No Access, Redirecting to instructor view');
                    navigate('/InsDashboard');
                }
                const res = await axios.get(`http://localhost:3001/api/all-courses`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                const filledCourses = fillEmptyItems(res.data.courses, res.data.perPage);
                setActiveCoursesCount(filledCourses.filter(course => course.status).length); 
                setDeptCourseList({ ...res.data, courses: filledCourses });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/Login');
                } else {
                    console.error('Error fetching courses:', error);
                }
            }
        };
        fetchAllCourses();
    }, [authToken]);

    const filteredCourses = deptCourseList.courses.filter(
        (course) =>
            (course.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (course.title?.toLowerCase() ?? '').includes(search.toLowerCase())
    );

    const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Course', 'Title', 'Description', 'Status']],
            body: currentCourses.map(course => [
                course.courseCode,
                course.title,
                course.description,
                course.status !== undefined ? (course.status ? 'Active' : 'Inactive') : ''
            ]),
        });
        doc.save("course_list.pdf");
    };

    return (
        <div className="dashboard" id="dept-course-list-test-content">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
                <CreateTopBar searchListType={'DeptCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDeptCourseList);}} />

                <div className="clist-main">
                    <div className="subtitle-course">
                        List of Courses ({activeCoursesCount} Active in current)
                        <div className="action-buttons">
                            <Link to={`/DeptStatusChangeCourse`} state={{ deptCourseList }}>
                                <button className='icon-button'>
                                    <Edit size={20} color="black" />
                                </button>
                            </Link>
                            <button className='icon-button' onClick={exportToPDF}>
                                <Download size={20} color="black" />
                            </button>
                        </div>
                    </div>

                    <div className="dcourse-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <Link to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>
                                                {course.courseCode}
                                            </Link>
                                        </td>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{course.status !== undefined ? (course.status ? 'Active' : 'Inactive') : ''}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <ReactPaginate
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    breakLabel={'...'}
                                    pageCount={pageCount(deptCourseList.coursesCount, deptCourseList.perPage)}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={0}
                                    onPageChange={(data) => handlePageClick(data, setDeptCourseList)}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    forcePage={deptCourseList.currentPage - 1}
                                />
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeptCourseList;