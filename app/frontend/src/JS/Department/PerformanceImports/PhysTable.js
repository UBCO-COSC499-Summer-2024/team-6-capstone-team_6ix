import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import axios from 'axios';

function PhysTable() {

  const [courses,setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const url = "http://localhost:3000/physDeptP.json";
        const res = await axios.get(url);
        const sortedCourses = res.data.courses.sort((a, b) => b.score - a.score);
        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);

      } catch (error) {
        console.log("Error fetching data: ", error)
      }
    };
    fetchData();
  }, []);

  const filterCourses = (identifier) => {
    if (identifier == "All"){
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => course.courseCode.startsWith(`PHYS ${identifier}`));
      setFilteredCourses(filtered);
    }
  };


  return (

    <div className="division-performance-table">
      
      <div className='header-container'>
        <h1 className='subTitleD'>Physics</h1>
        <div>
          {["All", 1, 2, 3, 4].map(identifier => (
            <button className='year-button' key={identifier} onClick={() => filterCourses(identifier)}>
              {identifier}
            </button>
          ))}
        </div>
      </div>

      <table className='divi-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Course</th>
            <th>Rank</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{course.courseCode}</td>
              <td>{course.rank}</td>
              <td>{course.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

export default PhysTable;