import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      navigate('/'); // Redirect to login if token is not found
      return;
    }

    // Fetch profile data from the backend using the decoded email
    axios
      .get(`http://localhost:8080/api/employee`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      })
      .then((response) => {
        setProfileData(response.data); // Set the employee data in state
      })
      .catch((error) => {
        console.error('Error fetching profile data', error);
        if (error.response || error.response.status === 401) {
          localStorage.removeItem('jwtToken');
          navigate('/');
        }
      });
  }, [navigate]);

  if (!profileData) {
    return <p className="text-center text-lg mt-8">Loading...</p>;
  }

  const { employee, courses } = profileData;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="w-36 h-36 rounded-full overflow-hidden">
            {employee.photographPath ? (
              <img
                src={`data:image/jpeg;base64,${employee.photographPath}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                No Image
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-lg text-gray-600">{employee.title}</p>
            <p className="text-gray-500">{employee.email}</p>
            <p className="text-gray-500">{employee.department}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Courses Taught</h3>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {course.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-bold">Code:</span> {course.courseCode}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Credits:</span> {course.credits}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Term:</span> {course.term}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Year:</span> {course.year}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No courses assigned.</p>
          )}
        </div>
      </div>
    </div>
  );

};

export default Profile;
