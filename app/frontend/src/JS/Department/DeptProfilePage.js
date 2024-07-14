import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar, CreateWorkingBarChart } from '../common/commonImports.js';
import '../../CSS/Department/DeptProfilePage.css';

function DeptProfilePage() {
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const ubcid = params.get('ubcid');
	const { authToken, accountLogInType } = useAuth();
	const initProfile = { roles: [], teachingAssignments: [] };
	const [profile, setProfile] = useState(initProfile);
	const [editState, setEditState] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!authToken) {
					navigate('/Login');
					return;
				}
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
				const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
					params: { ubcid: ubcid }, // Add ubcid as query parameter
					headers: { Authorization: `Bearer ${authToken.token}` },
				});

				if (response.data) {
					setProfile(response.data);
				}
			} catch (error) {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken');
					navigate('/Login');
				} else {
					console.error('Error fetching instructor profile:', error);
				}
			}
		};

		fetchData();
	}, [authToken, ubcid, navigate]);
	// const profile = {"name":"Billy Guy", "id":"18592831", "benchmark":"1300", "roles":["Role1", "Role2"], "email":"billyGuy@instructor.ubc.ca", "phone":"778-333-2222", "office":"SCI 300", "teachingAssignments":[{"assign":"COSC 211","link":"abc.com"},{"assign":"COSC 304","link":"def.com"}]};

	return (
		<div className="deptProfile-container">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				
				<CreateTopBar />
				<div className='outside'>
				<button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
					<h1>{profile.name}'s Profile</h1>
				</div>
				<div className="main-content" id="text-content">
        
					<section className="information">
						<button className='edit-button' onClick={() => setEditState(true)}>Edit Profile</button>
						<p>
							<strong>Name:</strong>
							{editState && (
								<input className='formInput' type="text" />
							)}
							{!editState && (
								<span>{profile.name}</span>
							)}
							 
						</p>
						<p>
							<strong>UBC ID:</strong> {profile.ubcid}
						</p>
						<p>
							<strong>Service Role Assignments:</strong> {profile.roles.map((role, index) => <span><Link to={"/DeptRoleInformation?roleid="+role.roleid} key={index}>{role.roleTitle}</Link>
              {index < profile.roles.length - 1 && (', ')}
              </span>)}
						</p>
						<p>
							<strong>Monthly Hours Benchmark:</strong> {profile.benchmark}
						</p>
						<p>
							<strong>Phone Number:</strong> {profile.phoneNum}
						</p>
						<p>
							<strong>Email:</strong> {profile.email}
						</p>
						<p>
							<strong>Office Location:</strong> {profile.office}
						</p>
						<p>
							<strong>Teaching Assignments: </strong>
							{profile.teachingAssignments
								.map((teachingAssign, index) => (
                  <span>
									<Link key={index} to={"/DeptCourseInformation?courseid="+teachingAssign.courseId}>{teachingAssign.assign}</Link>
                  {index < profile.teachingAssignments.length - 1 && (', ')}
                  </span>
								))}
								
						</p>
				<p><strong>Service Hours:</strong></p>
            	<CreateWorkingBarChart profileid={ubcid} height={400} width={500} className='performance-chart'/>
			
					</section>
				</div>
			</div>
		</div>
	);
}

export default DeptProfilePage;
